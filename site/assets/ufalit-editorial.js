(() => {
  const people = document.querySelector(".people-list");
  const directory = people ?? document.querySelector(".places-page");
  if (!directory) return;

  const normalize = (text) => text.toLocaleLowerCase("ru").replaceAll("ё", "е").replace(/\s+/g, " ").trim();
  const records = Array.from(directory.querySelectorAll("[data-letter]"), (node) => {
    const name = node.querySelector(people ? "summary > span" : "h2");
    const title = (people ? name.firstChild.textContent : name.textContent).trim();
    const years = people ? name.querySelector("small")?.textContent : null;
    const annotations = people ? [] : Array.from(node.querySelectorAll("p[id]"), (paragraph) => {
      const text = paragraph.textContent.trim();
      const label = normalize(paragraph.querySelector("b, strong")?.textContent ?? "");
      const addresses = text.match(/(?:ул\.|улиц[аеыу]|проспект[ае]?|переул(?:ок|ке)|адресу:)\s*[\p{L}.\d–-]+(?:[ ,]+[\p{L}\d–/-]+){0,4}/giu) ?? [];
      return [label.length < 170 ? label : "", ...addresses].join(" ");
    });
    return { node, title, years, letter: node.dataset.letter, terms: normalize([title, ...annotations].join(" ")) };
  });
  if (!records.length) return;

  const filter = document.createElement("section");
  filter.className = "directory-filter";
  filter.setAttribute("aria-label", "Алфавитный указатель");
  filter.innerHTML = `
    <div class="directory-letters" role="group" aria-label="Первая буква фамилии"></div>
    <label class="directory-query">
      <span>${people ? "Поиск по имени или фамилии" : "Имя, место или адрес"}</span>
      <input type="search" autocomplete="off"${people ? ' placeholder="Поиск по имени или фамилии…"' : ""}>
    </label>
    <output aria-live="polite"></output>
  `;
  const letters = filter.querySelector(".directory-letters");
  const input = filter.querySelector("input");
  const count = filter.querySelector("output");
  const buttons = new Map();
  let activeLetter = "";
  let activeProfile;

  const outline = document.createElement("nav");
  outline.className = people ? "people-directory" : "directory-outline";
  outline.setAttribute("aria-label", people ? "Список литераторов" : "Оглавление памятных мест");
  const list = document.createElement("ul");
  outline.append(list);
  for (const record of records) {
    record.entry = document.createElement("li");
    record.link = document.createElement("a");
    record.link.href = "#" + record.node.id;
    record.link.textContent = record.title;
    record.entry.append(record.link);
    list.append(record.entry);
  }

  function showProfile(profile) {
    activeProfile = profile;
    for (const record of records) {
      const selected = record === profile;
      record.node.hidden = !selected;
      record.node.open = selected;
      if (selected) record.link.setAttribute("aria-current", "true");
      else record.link.removeAttribute("aria-current");
    }
    if (profile) {
      const item = profile.link.getBoundingClientRect();
      const viewport = list.getBoundingClientRect();
      if (item.top < viewport.top) list.scrollTop += item.top - viewport.top;
      else if (item.bottom > viewport.bottom) list.scrollTop += item.bottom - viewport.bottom;
    }
  }

  function render() {
    const words = normalize(input.value).split(" ").filter(Boolean);
    const visible = [];
    for (const record of records) {
      const { node, entry, letter, terms } = record;
      const matches = (!activeLetter || letter === activeLetter) && words.every((word) => terms.includes(word));
      if (!people) node.hidden = !matches;
      entry.hidden = !matches;
      if (matches) visible.push(record);
    }
    for (const [letter, button] of buttons) button.setAttribute("aria-pressed", letter === activeLetter);
    count.textContent = visible.length
      ? (people ? `Найдено литераторов: ${visible.length}` : `Найдено: ${visible.length} из ${records.length}`)
      : "Совпадений нет";
    if (people && (!activeProfile || activeProfile.entry.hidden)) {
      const updateHash = activeProfile && location.hash === activeProfile.link.hash;
      showProfile(visible[0]);
      if (updateHash) history.replaceState(null, "", activeProfile?.link.hash ?? location.pathname + location.search);
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
  directory.classList.add("is-filterable");
  records[0].node.before(filter);
  filter.after(outline);

  function reveal(target, scroll) {
    const record = records.find(({ node }) => node.contains(target));
    if (!record) return;
    if (record.entry.hidden) {
      activeLetter = "";
      input.value = "";
      render();
    }
    if (people) showProfile(record);
    for (let details = target.closest("details"); details; details = details.parentElement.closest("details")) {
      details.open = true;
    }
    if (scroll) target.scrollIntoView({ block: "start", behavior: "instant" });
  }

  function fromHash() {
    const target = document.getElementById(location.hash.slice(1));
    if (target) reveal(target, true);
    else if (people && !location.hash) showProfile(records.find(({ entry }) => !entry.hidden));
  }

  if (people) {
    const label = document.createElement("span");
    label.className = "people-filter-label";
    label.textContent = "Алфавитный указатель:";
    letters.before(label);
    outline.prepend(count);

    const layout = document.createElement("div");
    layout.className = "people-layout";
    const profiles = document.createElement("div");
    profiles.className = "people-profiles";
    filter.after(layout);
    layout.append(outline, profiles);

    const measureFilter = () => directory.style.setProperty("--people-filter-height", `${filter.offsetHeight}px`);
    measureFilter();
    if ("ResizeObserver" in window) new ResizeObserver(measureFilter).observe(filter);

    for (const { node, title, years, link } of records) {
      profiles.append(node);
      const body = node.querySelector(".person-body");
      const header = document.createElement("header");
      header.className = "person-profile-heading";
      const portrait = node.querySelector("summary > img");
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
        const small = document.createElement("small");
        small.textContent = years;
        link.append(small);
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

      link.addEventListener("click", (event) => {
        if (event.button || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        event.preventDefault();
        reveal(node, false);
        if (location.hash !== link.hash) history.pushState(null, "", link.hash);
        if (event.detail === 0) heading.focus({ preventScroll: true });
        const top = node.getBoundingClientRect().top;
        const bar = filter.getBoundingClientRect();
        if (top < Math.max(0, bar.bottom) || top + header.offsetHeight > innerHeight) {
          node.scrollIntoView({ block: "start", behavior: "instant" });
        }
      });

      const children = Array.from(body.children);
      const start = children.findIndex((child) => normalize(child.textContent) === "библиография");
      if (start === -1) continue;
      const bibliography = children.slice(start);
      const entries = bibliography.filter((child) => child.matches("p") &&
        /^\d+[.\s)]/.test(child.textContent.trim()) && !child.querySelector("img, [id]") && !child.id);
      if (entries.length < 8) continue;

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
  }
  render();
  window.addEventListener("hashchange", fromHash);
  if (location.hash) fromHash();
})();
