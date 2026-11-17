(() => {
  const people = document.querySelector(".people-list");
  const directory = people ?? document.querySelector(".places-page");
  if (!directory) return;

  const normalize = (text) => text.toLocaleLowerCase("ru").replaceAll("ё", "е").replace(/\s+/g, " ").trim();
  const records = Array.from(directory.querySelectorAll("[data-letter]"), (node) => {
    const name = node.querySelector(people ? "summary > span" : "h2");
    const title = (people ? name.firstChild.textContent : name.textContent).trim();
    const annotations = people ? [] : Array.from(node.querySelectorAll("p[id]"), (paragraph) => {
      const text = paragraph.textContent.trim();
      const label = normalize(paragraph.querySelector("b, strong")?.textContent ?? "");
      const addresses = text.match(/(?:ул\.|улиц[аеыу]|проспект[ае]?|переул(?:ок|ке)|адресу:)\s*[\p{L}.\d–-]+(?:[ ,]+[\p{L}\d–/-]+){0,4}/giu) ?? [];
      return [label.length < 170 ? label : "", ...addresses].join(" ");
    });
    return { node, title, letter: node.dataset.letter, terms: normalize([title, ...annotations].join(" ")) };
  });
  if (!records.length) return;

  const filter = document.createElement("section");
  filter.className = "directory-filter";
  filter.setAttribute("aria-label", "Алфавитный указатель");
  filter.innerHTML = `
    <div class="directory-letters" role="group" aria-label="Первая буква фамилии"></div>
    <label class="directory-query">
      <span>${people ? "Имя или фамилия" : "Имя, место или адрес"}</span>
      <input type="search" autocomplete="off">
    </label>
    <output aria-live="polite"></output>
  `;
  const letters = filter.querySelector(".directory-letters");
  const input = filter.querySelector("input");
  const count = filter.querySelector("output");
  const buttons = new Map();
  let activeLetter = "";

  let outline;
  if (!people) {
    outline = document.createElement("nav");
    outline.className = "directory-outline";
    outline.setAttribute("aria-label", "Оглавление памятных мест");
    const list = document.createElement("ul");
    outline.append(list);
    for (const record of records) {
      record.entry = document.createElement("li");
      const link = document.createElement("a");
      link.href = "#" + record.node.id;
      link.textContent = record.title;
      record.entry.append(link);
      list.append(record.entry);
    }
  }

  function render() {
    const words = normalize(input.value).split(" ").filter(Boolean);
    let visible = 0;
    for (const { node, entry, letter, terms } of records) {
      const matches = (!activeLetter || letter === activeLetter) && words.every((word) => terms.includes(word));
      node.hidden = !matches;
      if (entry) entry.hidden = !matches;
      if (matches) visible += 1;
    }
    for (const [letter, button] of buttons) button.setAttribute("aria-pressed", letter === activeLetter);
    count.textContent = visible ? `Найдено: ${visible} из ${records.length}` : "Совпадений нет";
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
  if (outline) filter.after(outline);
  render();

  function reveal(target, scroll) {
    const record = records.find(({ node }) => node.contains(target));
    if (!record) return;
    if (record.node.hidden) {
      activeLetter = "";
      input.value = "";
      render();
    }
    for (let details = target.closest("details"); details; details = details.parentElement.closest("details")) {
      details.open = true;
    }
    if (scroll) target.scrollIntoView({ block: "start", behavior: "instant" });
  }

  function fromHash() {
    const target = document.getElementById(location.hash.slice(1));
    if (target) reveal(target, true);
  }

  if (people) {
    for (const { node } of records) {
      const body = node.querySelector(".person-body");
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
  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
