(() => {
  const library = document.querySelector('[data-library]');
  if (!library) return;
  const cards = [...library.querySelectorAll('[data-library-author]')];
  const legacy = cards.find(card => `#${card.id}` === location.hash);
  if (legacy) {
    location.replace(legacy.querySelector('.library-author-link').href);
    return;
  }
  const normalize = text => text.toLocaleLowerCase('ru').replaceAll('ё', 'е').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const form = library.querySelector('[data-library-search]');
  const query = form.querySelector('input');
  const result = library.querySelector('[data-library-result]');
  const empty = library.querySelector('[data-library-empty]');
  const entries = cards.map(card => ({
    card,
    author: normalize(card.querySelector('h3').textContent + ' ' + card.dataset.alias),
    works: [...card.querySelectorAll('.library-matches li')].map(item => ({item, title: normalize(item.textContent)})),
  }));
  function filter() {
    const words = normalize(query.value).split(' ').filter(Boolean);
    let found = 0;
    for (const {card, author, works} of entries) {
      const authorMatches = words.every(word => author.includes(word));
      let workMatches = 0;
      for (const {item, title} of works) {
        item.hidden = !words.every(word => (author + ' ' + title).includes(word));
        if (!item.hidden) workMatches++;
      }
      card.hidden = !authorMatches && !workMatches;
      card.querySelector('.library-matches').hidden = !words.length || !workMatches || authorMatches;
      if (!card.hidden) found++;
    }
    result.hidden = !words.length;
    result.textContent = `Найдено авторов: ${found}`;
    empty.hidden = found !== 0;
  }
  form.hidden = false;
  form.addEventListener('submit', event => event.preventDefault());
  query.addEventListener('input', filter);
  form.addEventListener('reset', () => {
    query.value = '';
    filter();
    query.focus();
  });
  library.querySelector('[data-library-reset]').addEventListener('click', () => form.reset());
})();
