(() => {
  const article = document.querySelector("main .reading");
  const heading = article?.querySelector("h1");
  if (!heading) return;

  const settings = document.createElement("div");
  settings.className = "reader-settings";
  settings.setAttribute("role", "group");
  settings.setAttribute("aria-label", "Настройки чтения");
  settings.innerHTML = `
    <label>Размер текста
      <select name="scale">
        <option value="1">100%</option><option value="1.15">115%</option><option value="1.3">130%</option>
      </select>
    </label>
    <label>Оформление
      <select name="tone">
        <option value="paper">Бумага</option><option value="sepia">Сепия</option><option value="night">Ночной зал</option>
      </select>
    </label>
  `;
  const [scale, tone] = settings.querySelectorAll("select");
  article.classList.add("reader-sheet");
  article.before(settings);
  for (const select of [scale, tone]) {
    const key = "ufalit-reader-" + select.name;
    try {
      const saved = localStorage.getItem(key);
      if (Array.from(select.options).some((option) => option.value === saved)) select.value = saved;
    } catch {
      // The current page remains adjustable when storage is unavailable.
    }
    select.addEventListener("change", () => {
      update();
      try { localStorage.setItem(key, select.value); } catch { /* Optional persistence. */ }
    });
  }

  function update() {
    article.style.setProperty("--reader-scale", scale.value);
    article.dataset.tone = tone.value;
  }
  update();
})();
