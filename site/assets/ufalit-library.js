(() => {
  const library = document.querySelector('[data-library]');
  if (!library) return;
  const cards = [...library.querySelectorAll('[data-library-author]')];
  const legacy = cards.find(card => `#${card.id}` === location.hash);
  if (legacy) {
    location.replace(legacy.querySelector('.library-author-link').href);
    return;
  }
  const search = window.UfalitSearch;
  const form = library.querySelector('[data-library-search]');
  const query = form.querySelector('input');
  const result = library.querySelector('[data-library-result]');
  const empty = library.querySelector('[data-library-empty]');
  const authors = library.querySelector('.library-authors');
  const heading = library.querySelector('[data-library-heading]');
  const results = library.querySelector('#library-search-results');
  const list = results.querySelector('ol');
  const index = search.prepare(JSON.parse(library.querySelector('[data-library-index]').textContent));
  const initial = new URL(location.href).searchParams.get('q');
  if (initial) query.value = initial.slice(0, query.maxLength);

  function appendParts(element, parts) {
    for (const part of parts) {
      if (part.match) {
        const mark = document.createElement('mark');
        mark.textContent = part.text;
        element.append(mark);
      } else element.append(document.createTextNode(part.text));
    }
  }

  function resultRow(work, words) {
    const row = document.createElement('li');
    const author = document.createElement('p');
    author.className = 'library-search-author';
    appendParts(author, search.highlight(work.author, words));
    const kind = document.createElement('span');
    kind.className = 'library-kind';
    kind.textContent = work.kind;
    const title = document.createElement('h3');
    const link = document.createElement('a');
    const excerpt = search.snippet(work.text, words);
    link.href = work.href + (excerpt.target ? `#:~:text=${encodeURIComponent(excerpt.target)}` : '');
    appendParts(link, search.highlight(work.title, words));
    title.append(link);
    const text = document.createElement('p');
    text.className = 'library-search-excerpt';
    appendParts(text, excerpt.target ? excerpt.parts : search.highlight(work.description, words));
    row.append(author, kind, title, text);
    return row;
  }

  let timer;
  function filter() {
    clearTimeout(timer);
    const words = search.terms(query.value);
    const matches = words.length ? search.search(index, query.value) : [];
    list.replaceChildren(...matches.map(hit => resultRow(hit.document, words)));
    authors.hidden = !!words.length;
    heading.textContent = words.length ? 'Результаты поиска' : 'Литераторы';
    results.hidden = !matches.length;
    result.hidden = !words.length;
    result.textContent = `Найдено материалов: ${matches.length}`;
    empty.hidden = !words.length || matches.length !== 0;
    const url = new URL(location.href);
    if (words.length) url.searchParams.set('q', query.value.trim());
    else url.searchParams.delete('q');
    history.replaceState(null, '', url);
  }
  form.hidden = false;
  form.addEventListener('submit', event => { event.preventDefault(); filter(); });
  query.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(filter, 120); });
  form.addEventListener('reset', () => {
    query.value = '';
    filter();
    query.focus();
  });
  library.querySelector('[data-library-reset]').addEventListener('click', () => form.reset());
  filter();
})();
