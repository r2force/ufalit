(() => {
  const article = document.querySelector("main article[data-reader]");
  if (!article) return;
  const directory = article.matches(".directory-page");
  const sheet = directory ? article.querySelector(".directory-content") : article;
  if (!sheet) return;

  const header = document.createElement("header");
  header.className = "reader-header";
  header.innerHTML = `
    <div class="reader-settings" aria-label="Настройки чтения" role="group">
      <div class="reader-options" aria-label="Размер текста" role="group">
        <span class="reader-size-icon" aria-hidden="true">Т</span>
        <button type="button" data-reader-scale="1">100%</button>
        <button type="button" data-reader-scale="1.15">115%</button>
        <button type="button" data-reader-scale="1.3">130%</button>
      </div>
      <div class="reader-options" aria-label="Тема оформления" role="group">
        <button type="button" data-reader-tone="paper">Бумага</button>
        <button type="button" data-reader-tone="sepia">Сепия</button>
        <button type="button" data-reader-tone="night">Ночь</button>
      </div>
    </div>
  `;

  sheet.classList.add("reader-sheet");
  const heading = directory ? null : sheet.querySelector(":scope > h1, :scope > h2");
  if (heading) {
    const body = document.createElement("div");
    body.className = "reader-body";
    while (heading.nextSibling) body.append(heading.nextSibling);
    heading.before(header, body);
    header.prepend(heading);
  } else {
    sheet.prepend(header);
  }

  for (const [name, datasetKey] of [["scale", "readerScale"], ["tone", "readerTone"]]) {
    const key = `ufalit-reader-${name}`;
    const buttons = Array.from(header.querySelectorAll(`[data-reader-${name}]`));
    const values = buttons.map((button) => button.dataset[datasetKey]);
    let saved;
    try { saved = localStorage.getItem(key); } catch { /* Preferences also work without storage. */ }

    function apply(value) {
      if (name === "scale") sheet.style.setProperty("--reader-scale", value);
      else sheet.dataset.tone = value;
      for (const button of buttons) button.setAttribute("aria-pressed", button.dataset[datasetKey] === value);
    }

    apply(values.includes(saved) ? saved : values[0]);
    for (const button of buttons) {
      button.addEventListener("click", () => {
        const value = button.dataset[datasetKey];
        apply(value);
        try { localStorage.setItem(key, value); } catch { /* Optional persistence. */ }
      });
    }
  }
})();
