(() => {
  const article = document.querySelector("main article[data-reader]");
  if (!article) return;
  const directory = article.matches(".directory-page");
  const sheet = directory ? article.querySelector(".directory-content") : article;
  if (!sheet) return;
  const literary = article.hasAttribute("data-reading-work");

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
      else {
        sheet.dataset.tone = value;
        if (literary) document.body.style.setProperty("--focus-paper", getComputedStyle(sheet).backgroundColor);
      }
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

  if (!literary) return;
  const body = sheet.querySelector('.reader-body');
  if (!body) return;
  const tools = document.createElement('div');
  tools.className = 'reader-tools';
  tools.innerHTML = `<button class="reader-focus-button" type="button" aria-pressed="false" title="Режим чтения без навигации. Escape — выйти">Только текст</button>
    <div class="reader-progress"><progress max="100" value="0" aria-label="Прочитанная часть текста"></progress><span>0%</span></div>`;
  header.append(tools);
  const focus = tools.querySelector('button');
  const progress = tools.querySelector('progress');
  const percentage = tools.querySelector('.reader-progress span');
  function setFocused(value) {
    const top = header.getBoundingClientRect().top;
    document.body.classList.toggle('is-reading-focused', value);
    focus.setAttribute('aria-pressed', String(value));
    focus.textContent = value ? 'Вернуть навигацию' : 'Только текст';
    window.scrollBy({top: header.getBoundingClientRect().top - top, behavior: 'instant'});
    updateProgress();
  }
  focus.addEventListener('click', () => setFocused(focus.getAttribute('aria-pressed') !== 'true'));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && focus.getAttribute('aria-pressed') === 'true') setFocused(false);
  });

  const key = `ufalit-reading-position:${location.pathname}`;
  let saved = 0;
  try { saved = Number(localStorage.getItem(key)); } catch { /* Optional reading position. */ }
  function bodyTop() { return body.getBoundingClientRect().top + window.scrollY; }
  function currentPosition() {
    const distance = body.offsetHeight - window.innerHeight;
    if (distance <= 0) return window.scrollY + window.innerHeight >= bodyTop() + body.offsetHeight ? 1 : 0;
    return Math.max(0, Math.min(1, (window.scrollY - bodyTop()) / distance));
  }
  if (Number.isFinite(saved) && saved > .03 && saved < .98) {
    const resume = document.createElement('div');
    resume.className = 'reader-resume';
    resume.innerHTML = `Вы остановились примерно на ${Math.round(saved * 100)}% текста.<button type="button">Продолжить чтение</button>`;
    body.before(resume);
    resume.querySelector('button').addEventListener('click', () => {
      resume.remove();
      window.scrollTo({top: bodyTop() + saved * Math.max(0, body.offsetHeight - window.innerHeight), behavior: 'instant'});
      updateProgress();
    });
  }
  function updateProgress() {
    const value = Math.round(currentPosition() * 100);
    progress.value = value;
    percentage.textContent = `${value}%`;
  }
  let saveTimer;
  let didRead = false;
  function savePosition() {
    // Opening a page to view its heading must not erase an existing bookmark.
    const position = currentPosition();
    if (!didRead || position <= .03) return;
    try { localStorage.setItem(key, String(position)); } catch { /* Optional persistence. */ }
  }
  window.addEventListener('scroll', () => {
    updateProgress();
    if (currentPosition() > .03) didRead = true;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(savePosition, 350);
  }, {passive: true});
  window.addEventListener('resize', updateProgress);
  for (const button of header.querySelectorAll('[data-reader-scale]')) button.addEventListener('click', updateProgress);
  window.addEventListener('pagehide', savePosition);
  document.addEventListener('visibilitychange', () => { if (document.hidden) savePosition(); });
  document.fonts.ready.then(updateProgress);
  updateProgress();
})();
