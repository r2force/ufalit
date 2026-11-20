(() => {
  const directory = document.querySelector(".directory-page");
  if (!directory) return;
  const entries = directory.querySelector(".directory-entries");
  if (!entries) return;
  const people = directory.matches(".people-list");
  const places = directory.matches(".places-page");

  const normalize = (text) => text.toLocaleLowerCase("ru").replaceAll("ё", "е").replace(/\s+/g, " ").trim();
  const records = Array.from(entries.content.children, (entry) => {
    const link = entry.querySelector("a");
    const node = document.getElementById(link.getAttribute("href").slice(1));
    const heading = node.querySelector("h2");
    const name = link.querySelector("span").firstChild.textContent;
    const annotations = places ? Array.from(node.querySelectorAll("p[id], figcaption[id]"), (paragraph) => {
      const text = paragraph.textContent.trim();
      const label = paragraph.querySelector("b, strong")?.textContent ?? "";
      const addresses = text.match(/(?:ул\.|улиц[аеыу]|проспект[ае]?|переул(?:ок|ке)|адресу:)\s*[\p{L}.\d–-]+(?:[ ,]+[\p{L}\d–/-]+){0,4}/giu) ?? [];
      return [label.length < 170 ? label : "", ...addresses].join(" ");
    }) : [];
    return { node, entry, link, heading, letter: entry.dataset.letter,
      terms: normalize([name, entry.dataset.alias, heading.textContent, ...annotations].join(" ")) };
  });
  if (!records.length) return;

  const filter = document.createElement("section");
  const searchLabel = places ? "Имя, место или адрес" : "Поиск по имени или фамилии";
  filter.className = "directory-filter";
  filter.setAttribute("aria-label", "Алфавитный указатель");
  filter.innerHTML = `
    <span class="directory-filter-label">Алфавитный указатель:</span>
    <div class="directory-letters" role="group" aria-label="Первая буква фамилии"></div>
    <label class="directory-query">
      <span>${searchLabel}</span>
      <input type="search" autocomplete="off" placeholder="${searchLabel}…">
    </label>
  `;
  const letters = filter.querySelector(".directory-letters");
  const input = filter.querySelector("input");
  const count = document.createElement("output");
  count.setAttribute("aria-live", "polite");
  const buttons = new Map();
  let activeLetter = "";
  let activeRecord;

  const sidebar = document.createElement("nav");
  sidebar.className = "directory-sidebar";
  sidebar.setAttribute("aria-label", "Список литераторов");
  const list = document.createElement("ul");
  sidebar.append(count, list);
  const layout = document.createElement("div");
  layout.className = "directory-layout";
  const content = document.createElement("div");
  content.className = "directory-content";
  layout.append(sidebar, content);

  list.append(entries.content);
  entries.replaceWith(filter, layout);
  directory.classList.add("is-filterable");

  for (const record of records) {
    const { node, heading } = record;
    node.classList.add("directory-card");
    content.append(node);
    heading.tabIndex = -1;

    const header = people ? heading.closest("header") : heading;
    if (people) enhanceBibliography(node);

    record.link.addEventListener("click", (event) => {
      if (event.button || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      event.preventDefault();
      selectRecord(record);
      if (location.hash !== record.link.hash) history.pushState(null, "", record.link.hash);
      if (event.detail === 0) record.heading.focus({ preventScroll: true });
      const top = record.node.getBoundingClientRect().top;
      const bar = filter.getBoundingClientRect();
      if (top < Math.max(0, bar.bottom) || top + header.offsetHeight > innerHeight) {
        record.node.scrollIntoView({ block: "start", behavior: "instant" });
      }
    });
  }

  function selectRecord(selection) {
    activeRecord = selection;
    for (const record of records) {
      const selected = record === selection;
      record.node.hidden = !selected;
      if (people) record.node.open = selected;
      if (selected) record.link.setAttribute("aria-current", "true");
      else record.link.removeAttribute("aria-current");
    }
    if (selection) {
      const item = selection.link.getBoundingClientRect();
      const viewport = list.getBoundingClientRect();
      if (item.top < viewport.top) list.scrollTop += item.top - viewport.top;
      else if (item.bottom > viewport.bottom) list.scrollTop += item.bottom - viewport.bottom;
    }
  }

  function render() {
    const words = normalize(input.value).split(" ").filter(Boolean);
    const visible = [];
    for (const record of records) {
      const { entry, letter, terms } = record;
      const matches = (!activeLetter || letter === activeLetter) && words.every((word) => terms.includes(word));
      entry.hidden = !matches;
      if (matches) visible.push(record);
    }
    for (const [letter, button] of buttons) button.setAttribute("aria-pressed", letter === activeLetter);
    count.textContent = visible.length
      ? `Найдено литераторов: ${visible.length}`
      : "Совпадений нет";
    if (!activeRecord || activeRecord.entry.hidden) {
      const updateHash = activeRecord?.node.contains(hashTarget());
      selectRecord(visible[0]);
      if (updateHash) history.replaceState(null, "", activeRecord?.link.hash ?? location.pathname + location.search);
    }
  }

  for (const letter of ["", ...Array.from(new Set(records.map((item) => item.letter))).sort((a, b) => a.localeCompare(b, "ru"))]) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = letter || "Все";
    button.addEventListener("click", () => {
      activeLetter = letter;
      render();
    });
    buttons.set(letter, button);
    letters.append(button);
  }
  input.addEventListener("input", render);
  const measureFilter = () => directory.style.setProperty("--directory-filter-height", `${filter.offsetHeight}px`);
  measureFilter();
  if ("ResizeObserver" in window) new ResizeObserver(measureFilter).observe(filter);

  function hashTarget() {
    return document.getElementById(location.hash.slice(1));
  }

  function fromHash() {
    if (!location.hash) {
      selectRecord(records.find(({ entry }) => !entry.hidden));
      return;
    }
    const target = hashTarget();
    const record = records.find(({ node }) => node.contains(target));
    if (!record) return;
    if (record.entry.hidden) {
      activeLetter = "";
      input.value = "";
      render();
    }
    selectRecord(record);
    for (let details = target.closest("details"); details; details = details.parentElement.closest("details")) {
      details.open = true;
    }
    const illustration = target.closest(".material-figure");
    (illustration ?? target).scrollIntoView({ block: "start", behavior: "instant" });
  }

  function enhanceBibliography(profile) {
    const bio = profile.querySelector(".person-body");
    const title = Array.from(bio.children).find((node) => normalize(node.textContent) === "библиография");
    if (!title) return;

    const panel = document.createElement("section");
    panel.className = "bibliography-panel";
    const resultsId = `${profile.id}-bibliography`;
    panel.innerHTML = `
      <div class="bibliography-toolbar">
        <button class="bibliography-toggle" type="button" aria-expanded="false">Библиографический указатель</button>
        <input class="bibliography-search" type="search" aria-label="Фильтр по году, книге или автору" placeholder="Год, книга или автор…" autocomplete="off">
      </div>
      <div class="bibliography-body" hidden>
        <output class="bibliography-count" aria-live="polite"></output>
        <div class="bibliography-results" role="region" aria-label="Записи библиографии" tabindex="0"></div>
      </div>
    `;
    const button = panel.querySelector("button");
    const query = panel.querySelector("input");
    const body = panel.querySelector(".bibliography-body");
    body.id = resultsId;
    button.setAttribute("aria-controls", resultsId);
    const results = panel.querySelector(".bibliography-results");
    const count = panel.querySelector("output");
    const source = [];
    for (let node = title; node; node = node.nextSibling) source.push(node);
    title.before(panel);
    title.classList.add("bibliography-source-title");

    const sections = [];
    let section = { heading: null, entries: [] };
    sections.push(section);
    let entry;
    const recordStart = /^\d{1,3}\s*[.)]\s*[^\d]|^https?:\/\/|^[\p{L}«“"].*\[\s*(?:текст|электронный ресурс|звукозапись|видеозапись)\s*\]/u;
    const sectionStart = /^(?:(?:основные )?произведения|литература (?:о|об) |книги(?:$| (?:и|о|об))|статьи(?:$| (?:и|о|об))|список литературы|аудио|видеоиздания|дискография|электронные ресурсы|публикации|периодические издания|издания)/;
    for (const node of source) {
      const paragraph = node.nodeType === Node.ELEMENT_NODE && node.matches("p, li");
      const text = normalize(node.textContent);
      const isCitation = paragraph && recordStart.test(text);
      const isHeading = paragraph && text.length > 0 && text.length < 150 &&
        (sectionStart.test(text) || (node.matches(".text-center") && node.querySelector("b, strong")));
      if (node !== title && isHeading && !isCitation) {
        node.classList.add("bibliography-section-title");
        section = { heading: node, entries: [] };
        sections.push(section);
        entry = null;
      } else if (isCitation) {
        entry = document.createElement("div");
        entry.className = "bibliography-entry";
        section.entries.push(entry);
        results.append(entry);
      }
      if (paragraph && !text && !node.querySelector("img, a")) node.classList.add("bibliography-spacing");
      if (!paragraph && node.nodeType === Node.ELEMENT_NODE && !node.matches("figure, .material-photo-grid")) entry = null;
      (entry ?? results).append(node);
    }

    const searchWords = (value) => normalize(value).split(/[^\p{L}\p{N}]+/u).filter(Boolean);
    const terms = new Map(sections.flatMap(({ entries }) => entries.map((item) => [item, searchWords(item.textContent)])));
    function filterEntries() {
      const words = searchWords(query.value);
      let found = 0;
      for (const { heading, entries } of sections) {
        let matched = 0;
        for (const item of entries) {
          const index = terms.get(item);
          item.hidden = !words.every((word) => index.some((term) => /^\d{4}$/.test(word) ? term === word : term.includes(word)));
          if (!item.hidden) matched += 1;
        }
        if (heading) heading.hidden = words.length > 0 && matched === 0;
        found += matched;
      }
      count.textContent = found ? `Найдено записей: ${found}` : "Совпадений нет";
      results.scrollTop = 0;
    }

    function setOpen(open) {
      body.hidden = !open;
      button.setAttribute("aria-expanded", open);
    }

    button.addEventListener("click", () => setOpen(body.hidden));
    query.addEventListener("input", () => {
      setOpen(true);
      filterEntries();
    });
    filterEntries();
  }

  render();
  window.addEventListener("hashchange", fromHash);
  if (location.hash) fromHash();
})();
