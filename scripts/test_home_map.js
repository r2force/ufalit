// Run with Node only: shared filtering plus page selection and offline behavior.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const places = JSON.parse(fs.readFileSync(path.join(root, 'templates/atlas-places.json'), 'utf8'));

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

(async () => {
  const source = fs.readFileSync(path.join(root, 'site/assets/map-widget.js'), 'utf8');
  const { filterMarkers } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
  const markers = places.map(place => ({ ...place, keywords: [place.writer, place.category] }));
  const filters = [
    { id: 'museum', categories: ['museum'] }, { id: 'park', categories: ['park'] },
    { id: 'culture', categories: ['theatre', 'library'] }, { id: 'street', categories: ['street'] },
  ];
  const ids = (state) => filterMarkers(markers, state, filters).map(place => place.id);
  assert.deepEqual(ids({ presetFilterId: 'museum' }), ['places-text-004', 'places-text-248']);
  assert.deepEqual(ids({ presetFilterId: 'culture' }), ['places-text-016', 'places-text-437']);
  assert.deepEqual(ids({ presetFilterId: 'park' }), ['places-text-031']);
  assert.deepEqual(ids({ presetFilterId: 'street' }), ['places-text-318']);
  assert.equal(ids({ query: ' АКСАКОВ ' }).length, 3);
  assert.deepEqual(ids({ query: 'Мажит Гафури' }), ['places-text-248']);
  assert.deepEqual(ids({ query: 'Расулева 4' }), ['places-text-004']);
  assert.deepEqual(ids({ query: 'Гафури', presetFilterId: 'park' }), []);
  assert.equal(ids({}).length, 6);
  // Unicode, token order, and ё/е are significant for Russian search.
  assert.equal(filterMarkers([{ coordinates: [0, 0], title: 'Зелёный сад' }], { query: 'сад ЗЕЛЕНЫЙ' }).length, 1);

  for (const place of places) {
    assert.ok(fs.existsSync(path.join(root, 'site', place.image)), place.image);
    assert.ok(fs.readFileSync(path.join(root, 'site/pages/places/index.html'), 'utf8').includes(`id="${place.id}"`));
    assert.ok(place.coordinates[0] > 55.9 && place.coordinates[0] < 56);
    assert.ok(place.coordinates[1] > 54.7 && place.coordinates[1] < 54.75);
  }

  const nodes = {};
  for (const selector of ['#atlas-search', '.atlas-key', '.atlas-description', '.atlas-quote', '.atlas-reset',
    '.atlas-show-detail', '.atlas-fit', '.atlas-map-notice', '.atlas-toolbar', '#atlas-place-title',
    '.atlas-writer', '.atlas-kicker', '.atlas-address', '.atlas-photo', '.atlas-more', '.atlas-count', '.atlas-empty']) {
    nodes[selector] = element();
  }
  nodes['#atlas-places'] = { textContent: JSON.stringify(places) };
  const buttons = ['all', 'museum', 'park', 'culture', 'street'].map(id => {
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
  buttons.find(button => button.dataset.mapFilter === 'museum').click();
  assert.equal(choices.filter(link => !link.closest().hidden).length, 2);
  assert.equal(nodes['.atlas-more'].href, 'pages/places/#places-text-004');
  nodes['#atlas-search'].value = 'нет такого места';
  nodes['#atlas-search'].input();
  assert.equal(nodes['.atlas-key'].hidden, true);
  assert.equal(nodes['.atlas-empty'].hidden, false);
  nodes['.atlas-reset'].click();
  assert.equal(choices.filter(link => !link.closest().hidden).length, 6);
  assert.equal(nodes['.atlas-key'].hidden, false);
  assert.equal(nodes['.atlas-empty'].hidden, true);
  console.log('Home map: all selections, categories, Russian search, empty/reset states, images, links and offline fallback passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
