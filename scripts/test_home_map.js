// Run with Node only: shared filtering plus page selection and offline behavior.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const places = JSON.parse(fs.readFileSync(path.join(root, 'templates/atlas-places.json'), 'utf8'));
const placesPage = fs.readFileSync(path.join(root, 'site/pages/places/index.html'), 'utf8');
const legendsPage = fs.readFileSync(path.join(root, 'site/pages/legends/index.html'), 'utf8');
const detailUrl = place => place.detail_url ?? `pages/places/#${place.id}`;
assert.ok(!placesPage.includes('id="place-20"'), 'the duplicate legends section is removed');
assert.ok(!placesPage.includes('href="../legends/#pamyatniki"'), 'places page has no redundant legends section link');
for (const [id, url] of Object.entries({
  'legend-zuhra': 'pages/legends/#zuhra',
  'legend-salavat': 'pages/legends/#salavat',
  'legend-kunitsa': 'pages/legends/#kunitsa',
  'legend-kurai': 'pages/legends/#kurai',
})) {
  assert.equal(places.find(place => place.id === id)?.detail_url, url, `${id}: canonical legend link`);
}

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
  assert.deepEqual(ids({ query: 'Парковая' }), ['places-text-409']);
  assert.deepEqual(ids({ query: 'Янаби', presetFilterId: 'street' }), ['places-text-398']);
  assert.deepEqual(ids({ query: 'Сазонова' }), ['places-text-289']);

  sameSet(ids({ query: ' АКСАКОВ ' }), matching(/аксаков/), 'writer search');
  sameSet(ids({ query: 'Мажит Гафури' }), matching(/мажит гафури/), 'full-name search');
  sameSet(ids({ query: 'Расулева 4' }), matching(/расулева, 4/), 'address search');
  assert.deepEqual(ids({ query: 'Расулева 4' }), ['places-text-004']);
  assert.deepEqual(ids({ query: 'кураю' }), ['legend-kurai']);
  assert.deepEqual(ids({ query: 'Гафури', presetFilterId: 'park' }), ['places-text-271']);
  assert.deepEqual(ids({ query: 'Гафури', presetFilterId: 'street' }), ['places-text-278']);
  // Unicode, token order, and ё/е are significant for Russian search.
  assert.equal(filterMarkers([{ coordinates: [0, 0], title: 'Зелёный сад' }], { query: 'сад ЗЕЛЕНЫЙ' }).length, 1);

  assert.equal(new Set(places.map(place => place.id)).size, places.length, 'map IDs are unique');
  for (const place of places) {
    assert.ok(fs.existsSync(path.join(root, 'site', place.image)), place.image);
    const [detailPage, detailAnchor] = detailUrl(place).split('#');
    const detailHtml = {
      'pages/places/': placesPage,
      'pages/legends/': legendsPage,
    }[detailPage];
    assert.ok(detailHtml, `${place.id}: unsupported detail page ${detailPage}`);
    assert.ok(detailHtml.includes(`id="${detailAnchor}"`), `${place.id}: missing detail anchor ${detailUrl(place)}`);
    assert.ok(place.paragraphs.length > 0 && place.paragraphs.every(text => text.trim()), place.id);
    // Ufa stretches far beyond the old town: Шакша in the north-east, Инорс and Черниковка
    // in the north, Дёма and Сипайлово on the flanks, Зелёная Роща in the south.
    assert.ok(place.coordinates[0] > 55.75 && place.coordinates[0] < 56.3, `${place.id}: longitude`);
    assert.ok(place.coordinates[1] > 54.65 && place.coordinates[1] < 54.85, `${place.id}: latitude`);
  }
  // Фото не должно повторяться у соседних объектов: именно так разъезжались
  // подписи в разделе Ю. Узикова, где снимок стоит перед своим заголовком.
  const uzikov = ['places-text-409', 'places-text-410', 'places-text-411']
    .map(id => places.find(place => place.id === id).image);
  assert.equal(new Set(uzikov).size, 3, 'each Узиков place keeps its own photo');
  const byImage = new Map();
  for (const place of places) {
    const ids = byImage.get(place.image) ?? [];
    ids.push(place.id);
    byImage.set(place.image, ids);
  }
  for (const [image, ids] of byImage) {
    assert.equal(ids.length, 1, `${image} is reused by ${ids.join(', ')}`);
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
    const link = element();
    link.dataset.placeId = place.id;
    link.href = detailUrl(place);
    link.closest = () => item;
    return link;
  });
  const atlas = { ...element(), querySelector: selector => nodes[selector],
    querySelectorAll: selector => selector === '[data-map-filter]' ? buttons : choices };
  // Simulate unavailable map tiles/WebGL. The whole list and filters must still work.
  const mapModule = { filterMarkers, createIllustratedMap: async () => { throw new Error('Map unavailable'); } };
  const integration = fs.readFileSync(path.join(root, 'site/assets/ufalit-map.js'), 'utf8');
  const runIntegration = (module, scope) => vm.runInNewContext(
    integration.replace(/await import\('\.\/map-widget\.js\?v=\d+'\)/, 'mapModule'),
    { document: { querySelector: () => atlas, createElement: element },
      window: { matchMedia: () => ({ matches: false }) }, mapModule: module, console: { warn() {} }, ...scope },
  );
  await runIntegration(mapModule);
  assert.ok(atlas.classList.contains('atlas-unavailable'));
  for (const link of choices) {
    let prevented = false;
    link.click({ button: 0, preventDefault() { prevented = true; } });
    assert.ok(prevented);
    const place = places.find(place => place.id === link.dataset.placeId);
    assert.equal(link.href, detailUrl(place), `${place.id}: list destination`);
    assert.equal(nodes['.atlas-more'].href, detailUrl(place), `${place.id}: card destination`);
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
  // Виджет против поддельного MapLibre: выбор из списка центрирует метку и
  // приближает карту примерно до 50 м, а к меткам не привязывается всплывающая карточка.
  const domElement = () => {
    const node = element();
    node.style = { setProperty() {} };
    return node;
  };
  class FakeHTMLElement {}
  globalThis.HTMLElement = FakeHTMLElement;
  globalThis.window = { setTimeout, clearTimeout, matchMedia: () => ({ matches: true }) };
  globalThis.document = {
    createElement: () => Object.assign(new FakeHTMLElement(), domElement()),
    querySelector: () => null,
  };
  const mapCalls = [];
  const markerPopups = [];
  const fakeLibre = `
    export class Marker {
      constructor(options) { this.element = options.element; this.popups = []; }
      setLngLat() { return this; } addTo() { return this; } remove() { return this; }
      setPopup(popup) { this.popups.push(popup); globalThis.__markerPopups.push(popup); return this; }
      togglePopup() { return this; }
    }
    export class Popup {
      setDOMContent() { return this; } setLngLat() { return this; }
      constructor() { globalThis.__popupConstructions = (globalThis.__popupConstructions ?? 0) + 1; }
      addTo() { return this; } remove() { this.removed = true; } isOpen() { return false; }
    }
    export class LngLatBounds { extend() { return this; } isEmpty() { return false; } }
    export class NavigationControl {}
    export class ScaleControl {}
    export class Map {
      constructor() {
        return {
          on() {}, once(event, handler) { if (event === 'load') setTimeout(handler, 0); },
          addControl() {}, getStyle: () => ({ layers: [] }), setLayoutProperty() {},
          setPaintProperty() {}, setMinZoom() {}, getZoom: () => 10, resize() {}, remove() {},
          cameraForBounds: () => ({ zoom: 10 }),
          fitBounds(b, options) { globalThis.__fits.push({ bounds: b, options }); },
          easeTo(options) { globalThis.__mapCalls.push(options); return this; },
          project: point => ({ x: point[0], y: point[1] }),
          unproject: point => ({ lng: point.x, lat: point.y, toArray: () => [point.x, point.y] }),
        };
      }
    }`;
  globalThis.__mapCalls = mapCalls;
  globalThis.__markerPopups = markerPopups;
  globalThis.__fits = [];
  const widgetModuleUrl = `data:text/javascript;base64,${Buffer.from(fakeLibre).toString('base64')}`;
  const widgetSource = source.replace(
    "const MAPLIBRE_MODULE = './vendor/maplibre-gl/maplibre-gl.mjs';",
    `const MAPLIBRE_MODULE = ${JSON.stringify(widgetModuleUrl)};`,
  );
  const widget = await import(`data:text/javascript;base64,${Buffer.from(widgetSource).toString('base64')}`);
  const controller = await widget.createIllustratedMap({
    container: new FakeHTMLElement(),
    markers: places.map(place => ({ ...place })),
    filters,
    popupOnMarkerClick: false,
  });
  const parkovaya = places.find(place => place.id === 'places-text-409');
  assert.equal(controller.selectMarker('places-text-409', { zoom: 16.33, duration: 0 }), true);
  const camera = mapCalls.at(-1);
  assert.deepEqual(camera.center, parkovaya.coordinates, 'list selection centers the marker');
  assert.equal(camera.zoom, 16.33, 'list selection zooms to the ~50 m scale');
  assert.equal(markerPopups.length, 0, 'no popup is bound to markers, so clicks show only the panel');
  assert.equal(globalThis.__popupConstructions ?? 0, 0, 'no popup element is even created for markers');
  assert.ok(Array.isArray(controller.getVisibleMarkers()) && controller.getVisibleMarkers().length === places.length);

  // Фильтр «Памятники» и одиночный результат поиска — это обзор, а не уличный зум.
  controller.setPresetFilter('monument');
  assert.equal(controller.getVisibleMarkers().length, byCategory('monument').length);
  const markerFilterFit = globalThis.__fits.at(-1);
  assert.ok(markerFilterFit, 'filter change fits all matching markers');
  const lone = places.find(place => place.id === 'places-text-409');
  controller.setPresetFilter('all');
  controller.setTextFilter('Парковая');
  controller.fitToContent({ useMapBounds: false, duration: 0 });
  const visibleAfterSearch = controller.getVisibleMarkers();
  assert.deepEqual(visibleAfterSearch.map(place => place.id), ['places-text-409']);
  const loneCall = mapCalls.at(-1);
  assert.deepEqual(loneCall.center, lone.coordinates, 'single result centers its marker');
  assert.equal(loneCall.zoom, 13.5, 'single result keeps the city-wide overview instead of zooming in');
  assert.ok(loneCall.zoom < 15, 'single result is not an extreme street-level zoom');

  console.log(`Home map: ${places.length} places, selections, six category filters, Russian search, empty/reset states, images, links and offline fallback passed.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
