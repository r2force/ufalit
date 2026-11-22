// Run with Node only: shared filtering plus page selection and offline behavior.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const places = JSON.parse(fs.readFileSync(path.join(root, 'templates/atlas-places.json'), 'utf8'));
const placesPage = fs.readFileSync(path.join(root, 'site/pages/places/index.html'), 'utf8');

function element() {
  const attributes = {};
  const classes = new Set();
  return {
    hidden: false, value: '', dataset: {}, children: [],
    classList: {
      toggle(name, active) { active ? classes.add(name) : classes.delete(name); },
      add(name) { classes.add(name); }, remove(name) { classes.delete(name); },
      contains(name) { return classes.has(name); },
    },
    setAttribute(name, value) { attributes[name] = value; },
    getAttribute(name) { return attributes[name]; },
    removeAttribute(name) { delete attributes[name]; },
    addEventListener(name, callback) { this[name] = callback; },
    replaceChildren(...children) { this.children = children; },
    append(child) { this.children.push(child); },
    focus() { this.focused = true; }, scrollIntoView() {},
  };
}

// Places of one preset filter, read from the data instead of repeating the list.
const byCategory = (...names) => places
  .filter(place => (place.categories ?? []).some(category => names.includes(category)))
  .map(place => place.id);
const textOf = place => [place.title, place.writer, place.label, place.address].join(' ').toLowerCase();
const matching = pattern => places.filter(place => pattern.test(textOf(place))).map(place => place.id);

(async () => {
  const source = fs.readFileSync(path.join(root, 'site/assets/map-widget.js'), 'utf8');
  const { filterMarkers } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
  const markers = places.map(place => ({
    ...place, keywords: [place.writer, place.category].filter(Boolean),
  }));
  const filters = [
    { id: 'museum', categories: ['museum'] }, { id: 'park', categories: ['park'] },
    { id: 'culture', categories: ['theatre', 'library'] }, { id: 'street', categories: ['street'] },
    { id: 'monument', categories: ['monument'] }, { id: 'building', categories: ['building'] },
  ];
  const ids = (state) => filterMarkers(markers, state, filters).map(place => place.id);
  const sameSet = (actual, expected, label) => assert.deepEqual(
    [...actual].sort(), [...expected].sort(), label,
  );

  sameSet(ids({ presetFilterId: 'museum' }), byCategory('museum'), 'museum filter');
  sameSet(ids({ presetFilterId: 'park' }), byCategory('park'), 'park filter');
  sameSet(ids({ presetFilterId: 'culture' }), byCategory('theatre', 'library'), 'culture filter');
  sameSet(ids({ presetFilterId: 'monument' }), byCategory('monument'), 'monument filter');
  sameSet(ids({ presetFilterId: 'building' }), byCategory('building'), 'building filter');
  sameSet(ids({ presetFilterId: 'street' }), byCategory('street'), 'street filter');
  assert.deepEqual(ids({ presetFilterId: 'museum' }).slice(0, 2), ['places-text-004', 'places-text-196']);
  assert.equal(ids({}).length, places.length);
  assert.ok(ids({}).length > 50, 'the map must stay a large city overview');

  sameSet(ids({ query: ' АКСАКОВ ' }), matching(/аксаков/), 'writer search');
  sameSet(ids({ query: 'Мажит Гафури' }), matching(/мажит гафури/), 'full-name search');
  sameSet(ids({ query: 'Расулева 4' }), matching(/расулева, 4/), 'address search');
  assert.deepEqual(ids({ query: 'Расулева 4' }), ['places-text-004']);
  assert.deepEqual(ids({ query: 'кураю' }), ['places-text-484']);
  assert.deepEqual(ids({ query: 'Гафури', presetFilterId: 'park' }), ['places-text-271']);
  assert.deepEqual(ids({ query: 'Гафури', presetFilterId: 'street' }), ['places-text-278']);
  // Unicode, token order, and ё/е are significant for Russian search.
  assert.equal(filterMarkers([{ coordinates: [0, 0], title: 'Зелёный сад' }], { query: 'сад ЗЕЛЕНЫЙ' }).length, 1);

  for (const place of places) {
    assert.ok(fs.existsSync(path.join(root, 'site', place.image)), place.image);
    assert.ok(placesPage.includes(`id="${place.id}"`), place.id);
    assert.ok(place.paragraphs.length > 0 && place.paragraphs.every(text => text.trim()), place.id);
    // Ufa stretches far beyond the old town: Шакша in the north-east, Инорс and Черниковка
    // in the north, Дёма and Сипайлово on the flanks, Зелёная Роща in the south.
    assert.ok(place.coordinates[0] > 55.75 && place.coordinates[0] < 56.3, `${place.id}: longitude`);
    assert.ok(place.coordinates[1] > 54.65 && place.coordinates[1] < 54.85, `${place.id}: latitude`);
  }
  assert.equal(places[0].id, 'places-text-004', 'the first record opens on load');

  const nodes = {};
  for (const selector of ['#atlas-search', '.atlas-key', '.atlas-description', '.atlas-quote', '.atlas-reset',
    '.atlas-show-detail', '.atlas-fit', '.atlas-map-notice', '.atlas-toolbar', '#atlas-place-title',
    '.atlas-writer', '.atlas-kicker', '.atlas-address', '.atlas-photo', '.atlas-more', '.atlas-count', '.atlas-empty']) {
    nodes[selector] = element();
  }
  nodes['#atlas-places'] = { textContent: JSON.stringify(places) };
  const buttons = ['all', 'museum', 'park', 'culture', 'monument', 'building', 'street'].map(id => {
    const button = element(); button.dataset.mapFilter = id; return button;
  });
  const choices = places.map(place => {
    const item = element();
    const link = element(); link.dataset.placeId = place.id; link.closest = () => item;
    return link;
  });
  const atlas = { ...element(), querySelector: selector => nodes[selector],
    querySelectorAll: selector => selector === '[data-map-filter]' ? buttons : choices };
  // Simulate unavailable map tiles/WebGL. The whole list and filters must still work.
  const mapModule = { filterMarkers, createIllustratedMap: async () => { throw new Error('Map unavailable'); } };
  const integration = fs.readFileSync(path.join(root, 'site/assets/ufalit-map.js'), 'utf8');
  await vm.runInNewContext(integration.replace(/await import\('\.\/map-widget\.js\?v=\d+'\)/, 'mapModule'), {
    document: { querySelector: () => atlas, createElement: element },
    window: { matchMedia: () => ({ matches: false }) }, mapModule, console: { warn() {} },
  });
  assert.ok(atlas.classList.contains('atlas-unavailable'));
  for (const link of choices) {
    let prevented = false;
    link.click({ button: 0, preventDefault() { prevented = true; } });
    assert.ok(prevented);
    const place = places.find(place => place.id === link.dataset.placeId);
    assert.equal(nodes['.atlas-more'].href, `pages/places/#${place.id}`);
    assert.equal(nodes['#atlas-place-title'].textContent, place.title);
    assert.equal(nodes['.atlas-photo'].src, place.image);
    assert.equal(link.getAttribute('aria-current'), 'true');
  }
  let prevented = false;
  choices[0].click({ button: 0, ctrlKey: true, preventDefault() { prevented = true; } });
  assert.equal(prevented, false, 'modified clicks must remain normal links');
  const visibleCount = () => choices.filter(link => !link.closest().hidden).length;
  for (const id of ['museum', 'park', 'culture', 'monument', 'building', 'street']) {
    buttons.find(button => button.dataset.mapFilter === id).click();
    assert.equal(visibleCount(), byCategory(...(id === 'culture' ? ['theatre', 'library'] : [id])).length, `${id} button`);
  }
  buttons.find(button => button.dataset.mapFilter === 'monument').click();
  nodes['#atlas-search'].value = 'Мусульманское';
  nodes['#atlas-search'].input();
  assert.equal(nodes['.atlas-empty'].hidden, false, 'no monument is a cemetery');
  nodes['#atlas-search'].value = 'кураю';
  nodes['#atlas-search'].input();
  assert.equal(nodes['.atlas-empty'].hidden, true);
  assert.equal(visibleCount(), 1);
  assert.equal(nodes['#atlas-place-title'].textContent, 'Памятник кураю');
  nodes['#atlas-search'].value = 'нет такого места';
  nodes['#atlas-search'].input();
  assert.equal(nodes['.atlas-key'].hidden, true);
  assert.equal(nodes['.atlas-empty'].hidden, false);
  nodes['.atlas-reset'].click();
  assert.equal(visibleCount(), places.length);
  assert.equal(nodes['.atlas-key'].hidden, false);
  assert.equal(nodes['.atlas-empty'].hidden, true);
  assert.equal(nodes['.atlas-count'].textContent, `Показано мест: ${places.length} из ${places.length}`);
  console.log(`Home map: ${places.length} places, selections, six category filters, Russian search, empty/reset states, images, links and offline fallback passed.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
