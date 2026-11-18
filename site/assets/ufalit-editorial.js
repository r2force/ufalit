(() => {
  const directory = document.querySelector(".directory-page");
  if (!directory) return;
  const people = directory.matches(".people-list");

  const normalize = (text) => text.toLocaleLowerCase("ru").replaceAll("ё", "е").replace(/\s+/g, " ").trim();
  const records = Array.from(directory.querySelectorAll("[data-letter]"), (node) => {
    const name = node.querySelector(people ? "summary > span" : "h2");
    const title = (people ? name.firstChild.textContent : name.textContent).trim();
    const years = people ? name.querySelector("small")?.textContent : null;
    const portrait = people ? node.querySelector("summary > img") : null;
    const annotations = people ? [] : Array.from(node.querySelectorAll("p[id]"), (paragraph) => {
      const text = paragraph.textContent.trim();
      const label = normalize(paragraph.querySelector("b, strong")?.textContent ?? "");
      const addresses = text.match(/(?:ул\.|улиц[аеыу]|проспект[ае]?|переул(?:ок|ке)|адресу:)\s*[\p{L}.\d–-]+(?:[ ,]+[\p{L}\d–/-]+){0,4}/giu) ?? [];
      return [label.length < 170 ? label : "", ...addresses].join(" ");
    });
    const thumbnail = portrait ? portrait.dataset.thumbnail ?? portrait.src : node.dataset.thumbnail;
    return { node, title, years, portrait, thumbnail, heading: name,
      letter: node.dataset.letter, terms: normalize([title, ...annotations].join(" ")) };
  });
  if (!records.length) return;

  const filter = document.createElement("section");
  const searchLabel = people ? "Поиск по имени или фамилии" : "Имя, место или адрес";
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
  sidebar.setAttribute("aria-label", people ? "Список литераторов" : "Памятные места по литераторам");
  const list = document.createElement("ul");
  sidebar.append(count, list);
  const layout = document.createElement("div");
  layout.className = "directory-layout";
  const content = document.createElement("div");
  content.className = "directory-content";
  layout.append(sidebar, content);

  records[0].node.before(filter, layout);
  directory.classList.add("is-filterable");

  for (const record of records) {
    record.entry = document.createElement("li");
    record.link = document.createElement("a");
    record.link.href = "#" + record.node.id;
    if (record.thumbnail) {
      const image = document.createElement("img");
      image.className = "directory-thumbnail";
      image.src = record.thumbnail;
      image.alt = "";
      image.loading = "lazy";
      image.width = 40;
      image.height = 50;
      record.link.append(image);
    }
    const label = document.createElement("span");
    label.textContent = record.title;
    if (record.years) {
      const dates = document.createElement("small");
      dates.textContent = record.years;
      label.append(dates);
    }
    record.link.append(label);
    record.entry.append(record.link);
    list.append(record.entry);

    record.node.classList.add("directory-card");
    content.append(record.node);
    if (people) enhancePerson(record);
    else record.heading.tabIndex = -1;

    record.link.addEventListener("click", (event) => {
      if (event.button || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      event.preventDefault();
      selectRecord(record);
      if (location.hash !== record.link.hash) history.pushState(null, "", record.link.hash);
      if (event.detail === 0) record.heading.focus({ preventScroll: true });
      const top = record.node.getBoundingClientRect().top;
      const bar = filter.getBoundingClientRect();
      if (top < Math.max(0, bar.bottom) || top + (record.header ?? record.heading).offsetHeight > innerHeight) {
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
      ? `Найдено ${people ? "литераторов" : "разделов"}: ${visible.length}`
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
    target.scrollIntoView({ block: "start", behavior: "instant" });
  }

  function enhancePerson(record) {
    const { node, title, years, portrait } = record;
    const body = node.querySelector(".person-body");
    const header = document.createElement("header");
    header.className = "person-profile-heading";
    portrait.classList.add("person-profile-portrait");
    const info = document.createElement("div");
    info.className = "person-profile-info";
    const meta = document.createElement("div");
    meta.className = "person-profile-meta";
    header.append(portrait, info);
    if (years) {
      const date = document.createElement("span");
      date.className = "person-profile-years";
      date.textContent = years;
      meta.append(date);
    }
    const role = body.querySelector(".person-role");
    if (role) meta.append(role);
    if (meta.childElementCount) info.append(meta);

    const heading = document.createElement("h2");
    heading.className = "person-title";
    heading.textContent = title;
    heading.tabIndex = -1;
    info.append(heading);
    const connection = body.querySelector(".person-connection");
    if (connection) info.append(connection);
    const related = body.querySelector(".related-links");
    if (related) {
      const gallery = related.querySelector('a[href^="../gallery-"]');
      if (gallery) related.prepend(gallery);
      info.append(related);
    }
    body.before(header);
    record.heading = heading;
    record.header = header;

    enhanceBibliography(body);
  }

  function enhanceBibliography(body) {
    const children = Array.from(body.children);
    const start = children.findIndex((child) => normalize(child.textContent) === "библиография");
    if (start === -1) return;
    const bibliography = children.slice(start);
    const entries = bibliography.filter((child) => child.matches("p") &&
      /^\d+[.\s)]/.test(child.textContent.trim()) && !child.querySelector("img, [id]") && !child.id);
    if (entries.length < 8) return;

    const details = document.createElement("details");
    details.className = "bibliography";
    details.innerHTML = `
      <summary>Показать библиографию</summary>
      <label class="directory-query">Фильтр по названию или году <input type="search"></label>
      <output aria-live="polite"></output>
    `;
    bibliography[0].before(details);
    details.append(...bibliography);
    const query = details.querySelector("input");
    const result = details.querySelector("output");
    const terms = entries.map((entry) => normalize(entry.textContent));
    query.addEventListener("input", () => {
      const key = normalize(query.value);
      let matched = 0;
      entries.forEach((entry, index) => {
        entry.hidden = !terms[index].includes(key);
        if (!entry.hidden) matched += 1;
      });
      result.textContent = key ? `Совпадений среди записей: ${matched}` : "";
    });
  }

  render();
  window.addEventListener("hashchange", fromHash);
  if (location.hash) fromHash();
})();
