/**
 * Иллюстрированная карта на MapLibre GL JS.
 * Нативный ES-модуль для браузера: не требует сборщика или npm.
 *
 * Основа — design_example/ufamap/map-widget.js.
 * MapLibre 6.19.0, CSS и worker хранятся локально в vendor/maplibre-gl/.
 */

const MAPLIBRE_MODULE = './vendor/maplibre-gl/maplibre-gl.mjs';

const DEFAULT_STYLE = 'https://tiles.openfreemap.org/styles/bright';

const DEFAULT_PALETTE = {
  background: '#fff4d6',
  water: '#9cdef4',
  parks: '#c4e9a9',
  woodland: '#a8d99a',
  grass: '#def0b2',
  buildings: '#f4d0ad',
  residential: '#fff0d1',
  education: '#ead8f5',
  healthcare: '#ffd9d1',
  streets: '#fff8e9',
  majorRoads: '#f5bd83',
};

let mapLibrePromise;

async function loadMapLibre() {
  if (!mapLibrePromise) {
    mapLibrePromise = import(MAPLIBRE_MODULE);
  }
  return mapLibrePromise;
}

function resolveElement(container) {
  if (typeof container === 'string') {
    const element = document.querySelector(container);
    if (!element) throw new Error(`Контейнер карты не найден: ${container}`);
    return element;
  }
  if (container instanceof HTMLElement) return container;
  throw new TypeError('Параметр "container" должен быть CSS-селектором или HTML-элементом.');
}

function validateBounds(bounds) {
  if (bounds == null) return;
  if (
    !Array.isArray(bounds) || bounds.length !== 2 ||
    !bounds.every(point => Array.isArray(point) && point.length === 2 && point.every(Number.isFinite))
  ) {
    throw new TypeError('Параметр "bounds" должен иметь вид [[west, south], [east, north]].');
  }
  const [[west, south], [east, north]] = bounds;
  if (west >= east || south >= north) {
    throw new RangeError('В "bounds" должны быть west < east и south < north.');
  }
}

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .toLocaleLowerCase('ru-RU')
    .replace(/ё/g, 'е')
    .trim();
}

function toStringArray(value) {
  if (value == null) return [];
  const values = Array.isArray(value) ? value : [value];
  return values.map(item => String(item).trim()).filter(Boolean);
}

function normalizePresetFilters(filters = []) {
  if (!Array.isArray(filters)) {
    throw new TypeError('Параметр "filters" должен быть массивом объектов фильтров.');
  }
  const result = new Map();
  filters.forEach((filter, index) => {
    if (!filter || typeof filter !== 'object') {
      throw new TypeError(`Фильтр №${index + 1} должен быть объектом.`);
    }
    const id = String(filter.id ?? '').trim();
    if (!id) throw new TypeError(`У фильтра №${index + 1} отсутствует id.`);
    if (id === 'all') throw new Error('Идентификатор "all" зарезервирован для сброса фильтра.');
    if (result.has(id)) throw new Error(`Фильтр с id "${id}" уже существует.`);
    const match = filter.match ?? 'any';
    if (match !== 'any' && match !== 'all') {
      throw new TypeError(`У фильтра "${id}" параметр match должен быть "any" или "all".`);
    }
    result.set(id, {
      ...filter,
      id,
      categories: toStringArray(filter.categories).map(normalizeText),
      tags: toStringArray(filter.tags).map(normalizeText),
      ids: toStringArray(filter.ids),
      match,
    });
  });
  return result;
}

function valuesMatch(markerValues, filterValues, mode) {
  if (!filterValues.length) return true;
  const available = new Set(markerValues.map(normalizeText));
  return mode === 'all'
    ? filterValues.every(value => available.has(value))
    : filterValues.some(value => available.has(value));
}

function markerMatchesText(item, query) {
  const tokens = normalizeText(query).split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  if (!tokens.length) return true;
  const haystack = item.searchIndex ?? normalizeText([
    item.title,
    item.address,
    item.description,
    item.searchText,
    ...item.categories,
    ...item.tags,
    ...item.keywords,
  ].join(' '));
  // AND-поиск: каждое слово запроса должно встретиться хотя бы в одном поле.
  return tokens.every(token => haystack.includes(token));
}

function markerMatchesPreset(item, filter) {
  if (!filter) return true;
  if (filter.ids.length && !filter.ids.includes(item.id)) return false;
  if (!valuesMatch(item.categories, filter.categories, filter.match)) return false;
  if (!valuesMatch(item.tags, filter.tags, filter.match)) return false;
  if (typeof filter.predicate === 'function' && !filter.predicate(item)) return false;
  return true;
}

function normalizeMarker(marker, index) {
  if (!marker || typeof marker !== 'object') {
    throw new TypeError(`Метка №${index + 1} должна быть объектом.`);
  }
  if (!Array.isArray(marker.coordinates) || marker.coordinates.length !== 2 || !marker.coordinates.every(Number.isFinite)) {
    throw new TypeError(`У метки №${index + 1} (${marker.title ?? 'без названия'}) координаты должны быть [longitude, latitude].`);
  }
  const [longitude, latitude] = marker.coordinates;
  if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
    throw new RangeError(`У метки №${index + 1} координаты выходят за допустимые пределы.`);
  }
  return {
    ...marker,
    id: String(marker.id ?? `marker-${index + 1}`),
    title: String(marker.title ?? ''),
    address: marker.address == null ? '' : String(marker.address),
    description: marker.description == null ? '' : String(marker.description),
    linkText: marker.linkText == null ? 'Открыть статью ↗' : String(marker.linkText),
    emoji: marker.emoji == null ? '📍' : String(marker.emoji),
    color: marker.color ?? '#79a7a0',
    categories: toStringArray(marker.categories),
    tags: toStringArray(marker.tags),
    keywords: toStringArray(marker.keywords),
    searchText: marker.searchText == null ? '' : String(marker.searchText),
    searchIndex: normalizeText([
      marker.title,
      marker.address,
      marker.description,
      marker.searchText,
      ...toStringArray(marker.categories),
      ...toStringArray(marker.tags),
      ...toStringArray(marker.keywords),
    ].join(' ')),
  };
}

function safeHref(value) {
  if (!value) return null;
  try {
    const url = new URL(String(value), document.baseURI);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.href;
  } catch {
    return null;
  }
}

function createFallbackMarker(item) {
  const pin = document.createElement('span');
  pin.className = 'im-map-marker__fallback';
  pin.style.setProperty('--im-marker-color', item.color);
  const emoji = document.createElement('span');
  emoji.className = 'im-map-marker__emoji';
  emoji.textContent = item.emoji;
  pin.append(emoji);
  return pin;
}

function createMarkerElement(item, options) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `im-map-marker${options.markerClass ? ` ${options.markerClass}` : ''}`;
  button.setAttribute('aria-label', item.title ? `Показать информацию: ${item.title}` : 'Показать информацию о месте');
  button.dataset.placeId = item.id;
  button.title = item.title || item.address || 'Открыть описание места';

  const size = item.markerSize ?? options.markerSize ?? 64;
  if (typeof size === 'number') {
    button.style.width = `${size}px`;
    button.style.height = `${Math.round(size * 1.22)}px`;
  } else if (size && typeof size === 'object') {
    if (Number.isFinite(size.width)) button.style.width = `${size.width}px`;
    if (Number.isFinite(size.height)) button.style.height = `${size.height}px`;
  }

  const markerImage = item.markerImage;
  if (markerImage) {
    const image = document.createElement('img');
    image.className = 'im-map-marker__image';
    image.src = markerImage;
    image.alt = item.markerAlt ?? '';
    image.draggable = false;
    image.onerror = () => {
      image.replaceWith(createFallbackMarker(item));
    };
    button.append(image);
  } else {
    button.append(createFallbackMarker(item));
  }
  return button;
}

/** Заглушка окна: при popupOnMarkerClick=false окна нет, но API метки остаётся рабочим. */
function createDetachedPopup() {
  return {
    isOpen: () => false,
    remove() {},
    setLngLat() { return this; },
    addTo() { return this; },
    setDOMContent() { return this; },
  };
}

function createPopupContent(item, options) {
  const article = document.createElement('article');
  article.className = 'im-map-popup';
  article.style.setProperty('--im-popup-accent', item.color);

  if (item.image) {
    const image = document.createElement('img');
    image.className = 'im-map-popup__image';
    image.src = item.image;
    image.alt = item.imageAlt ?? item.title ?? '';
    image.loading = 'lazy';
    image.onerror = () => image.remove();
    article.append(image);
  }

  const body = document.createElement('div');
  body.className = 'im-map-popup__body';

  if (item.title) {
    const title = document.createElement('h3');
    title.className = 'im-map-popup__title';
    title.textContent = item.title;
    body.append(title);
  }
  if (item.address) {
    const address = document.createElement('div');
    address.className = 'im-map-popup__address';
    address.textContent = item.address;
    body.append(address);
  }
  if (item.description) {
    const description = document.createElement('p');
    description.className = 'im-map-popup__description';
    description.textContent = item.description;
    body.append(description);
  }

  const href = safeHref(item.url);
  if (href) {
    const link = document.createElement('a');
    link.className = 'im-map-popup__link';
    link.href = href;
    link.target = item.linkTarget ?? options.linkTarget;
    if (link.target === '_blank') link.rel = 'noopener noreferrer';
    link.textContent = item.linkText;
    body.append(link);
  }

  article.append(body);
  return article;
}

/** Применяет необязательную детскую палитру к слоям базового стиля. */
function applyPalette(map, paletteOption) {
  if (paletteOption === false || paletteOption == null) return;
  const palette = { ...DEFAULT_PALETTE, ...(paletteOption === true ? {} : paletteOption) };

  for (const layer of map.getStyle()?.layers ?? []) {
    const id = String(layer.id ?? '').toLowerCase();
    try {
      if (layer.type === 'background' && palette.background) {
        map.setPaintProperty(layer.id, 'background-color', palette.background);
      } else if (layer.type === 'fill' || layer.type === 'fill-extrusion') {
        const property = layer.type === 'fill' ? 'fill-color' : 'fill-extrusion-color';
        if (id.includes('water') && palette.water) {
          map.setPaintProperty(layer.id, property, palette.water);
        } else if (id.includes('park') && palette.parks) {
          map.setPaintProperty(layer.id, property, palette.parks);
        } else if ((id.includes('wood') || id.includes('forest')) && palette.woodland) {
          map.setPaintProperty(layer.id, property, palette.woodland);
        } else if ((id.includes('grass') || id.includes('garden') || id.includes('green')) && palette.grass) {
          map.setPaintProperty(layer.id, property, palette.grass);
        } else if ((id.includes('school') || id.includes('education') || id.includes('kindergarten')) && palette.education) {
          map.setPaintProperty(layer.id, property, palette.education);
        } else if ((id.includes('hospital') || id.includes('healthcare')) && palette.healthcare) {
          map.setPaintProperty(layer.id, property, palette.healthcare);
        } else if (id.includes('building') && palette.buildings) {
          map.setPaintProperty(layer.id, property, palette.buildings);
        } else if (id.includes('residential') && palette.residential) {
          map.setPaintProperty(layer.id, property, palette.residential);
        }
      } else if (layer.type === 'line') {
        if (id.includes('water') && palette.water) {
          map.setPaintProperty(layer.id, 'line-color', palette.water);
        } else if (
          (id.includes('motorway') || id.includes('trunk') || id.includes('primary') || id.includes('major')) && palette.majorRoads
        ) {
          map.setPaintProperty(layer.id, 'line-color', palette.majorRoads);
        } else if ((id.includes('road') || id.includes('transportation')) && palette.streets) {
          map.setPaintProperty(layer.id, 'line-color', palette.streets);
        }
      }
    } catch (error) {
      // Some source styles contain layers whose paint properties cannot be changed.
      // This is an optional visual enhancement, so skip those layers safely.
      console.debug(`[IllustratedMap] Не удалось изменить стиль слоя "${layer.id}".`, error);
    }
  }
}

function makeBoundsFromMarkers(maplibregl, markers) {
  if (!markers.length) return null;
  const bounds = new maplibregl.LngLatBounds();
  for (const marker of markers) bounds.extend(marker.coordinates);
  return bounds;
}

function waitForMapLoad(map, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error(`Карта не загрузилась за ${timeoutMs} мс. Проверьте URL стиля и доступ к картографическому серверу.`));
    }, timeoutMs);
    map.once('load', () => {
      window.clearTimeout(timeout);
      resolve();
    });
  });
}

/**
 * Создаёт интерактивную карту и размещает на ней иллюстрированные метки.
 * Возвращает контроллер с map/addMarker/removeMarker/setMarkers/fitToContent/destroy.
 *
 * @param {object} config Настройки карты. Полный список — README_AGENT.md.
 * @returns {Promise<object>} Контроллер карты.
 */
export async function createIllustratedMap(config = {}) {
  const maplibregl = await loadMapLibre();
  const container = resolveElement(config.container);
  const markersData = (config.markers ?? []).map(normalizeMarker);
  const presetFilters = normalizePresetFilters(config.filters ?? []);
  const initialFilterId = config.initialFilter == null || config.initialFilter === 'all'
    ? null
    : String(config.initialFilter);
  if (initialFilterId && !presetFilters.has(initialFilterId)) {
    throw new Error(`Начальный фильтр "${initialFilterId}" отсутствует в массиве filters.`);
  }
  const initialSearch = String(config.initialSearch ?? '');
  const bounds = config.bounds ?? null;
  validateBounds(bounds);

  const restrictToBounds = config.restrictToBounds ?? Boolean(bounds);
  if (restrictToBounds && !bounds) {
    throw new Error('Для restrictToBounds: true необходимо передать bounds.');
  }

  const map = new maplibregl.Map({
    container,
    style: config.style ?? DEFAULT_STYLE,
    center: config.view?.center ?? config.center ?? markersData[0]?.coordinates ?? [0, 0],
    zoom: config.view?.zoom ?? config.zoom ?? 10,
    minZoom: Number.isFinite(config.minZoom) ? config.minZoom : undefined,
    maxZoom: Number.isFinite(config.maxZoom) ? config.maxZoom : 19,
    maxBounds: restrictToBounds ? bounds : undefined,
    attributionControl: config.attributionControl ?? true,
    cooperativeGestures: config.cooperativeGestures ?? false,
    locale: config.locale,
  });

  const controllerState = {
    destroyed: false,
    markerHandles: new Map(),
    map,
    maplibregl,
    presetFilters,
    activePresetFilterId: initialFilterId,
    textQuery: initialSearch,
    filterBindings: new Set(),
  };

  map.on('error', event => {
    const error = event?.error ?? event;
    if (typeof config.onError === 'function') config.onError(error, map);
  });

  const timeoutMs = Number.isFinite(config.loadTimeoutMs) ? config.loadTimeoutMs : 30000;
  try {
    await waitForMapLoad(map, timeoutMs);
  } catch (error) {
    map.remove();
    throw error;
  }

  const controls = config.controls ?? {};
  if (controls.navigation !== false) {
    map.addControl(new maplibregl.NavigationControl({ showCompass: controls.compass ?? false }), controls.position ?? 'top-right');
  }
  if (controls.scale !== false) {
    map.addControl(new maplibregl.ScaleControl({ unit: controls.scaleUnit ?? 'metric', maxWidth: controls.scaleWidth ?? 100 }), 'bottom-right');
  }

  applyPalette(map, config.palette ?? true);
  if (config.labelLanguage) {
    for (const layer of map.getStyle()?.layers ?? []) {
      const field = layer.layout?.['text-field'];
      if (layer.type === 'symbol' && JSON.stringify(field ?? '').includes('name')) {
        map.setLayoutProperty(layer.id, 'text-field', [
          'coalesce', ['get', `name:${config.labelLanguage}`], ['get', 'name'], ['get', 'name:latin'],
        ]);
      }
    }
  }

  const fitPadding = config.fitPadding ?? 48;
  const autoMinZoom = config.autoMinZoom ?? (restrictToBounds && bounds != null);
  const updateCalculatedMinZoom = (overrides = {}) => {
    if (!autoMinZoom || Number.isFinite(config.minZoom)) return;
    const targetBounds = getContentBounds(overrides);
    if (!targetBounds) return;
    const camera = map.cameraForBounds(targetBounds, {
      ...getFitOptions(overrides),
      padding: overrides.padding ?? config.minZoomPadding ?? fitPadding,
    });
    if (camera && Number.isFinite(camera.zoom)) map.setMinZoom(camera.zoom);
  };

  function getActivePresetFilter() {
    return controllerState.activePresetFilterId
      ? controllerState.presetFilters.get(controllerState.activePresetFilterId)
      : null;
  }

  function syncFilterButtons(binding) {
    const activeId = controllerState.activePresetFilterId ?? 'all';
    for (const button of binding.buttons) {
      const buttonFilterId = button.getAttribute('data-map-filter') ?? button.dataset.mapFilter;
      const active = buttonFilterId === activeId;
      if (binding.activeClass) button.classList.toggle(binding.activeClass, active);
      button.setAttribute('aria-pressed', String(active));
    }
  }

  function applyFilters(notify = true) {
    const preset = getActivePresetFilter();
    const visibleMarkers = [];
    for (const handle of controllerState.markerHandles.values()) {
      const visible = markerMatchesPreset(handle.item, preset)
        && markerMatchesText(handle.item, controllerState.textQuery);
      if (visible) {
        visibleMarkers.push(handle.item);
        if (!handle.visible) {
          handle.marker.addTo(map);
          handle.visible = true;
        }
      } else if (handle.visible) {
        handle.popup.remove();
        handle.marker.remove();
        handle.visible = false;
      }
    }

    for (const binding of controllerState.filterBindings) {
      if (binding.searchInput && binding.searchInput.value !== controllerState.textQuery) {
        binding.searchInput.value = controllerState.textQuery;
      }
      syncFilterButtons(binding);
    }

    const result = {
      query: controllerState.textQuery,
      presetFilterId: controllerState.activePresetFilterId ?? 'all',
      visibleMarkers,
      totalMarkers: controllerState.markerHandles.size,
    };
    if (notify) updateCalculatedMinZoom();
    if (notify && typeof config.onFilterChange === 'function') {
      config.onFilterChange(result, map);
    }
    return result;
  }

  function setTextFilter(query = '') {
    controllerState.textQuery = String(query ?? '');
    applyFilters();
    return controller;
  }

  function setPresetFilter(filterId = 'all') {
    const id = filterId == null || filterId === '' ? 'all' : String(filterId);
    if (id === 'all') {
      controllerState.activePresetFilterId = null;
    } else {
      if (!controllerState.presetFilters.has(id)) {
        throw new Error(`Неизвестный фильтр "${id}". Проверьте массив filters в настройках карты.`);
      }
      controllerState.activePresetFilterId = id;
    }
    applyFilters();
    return controller;
  }

  function clearFilters() {
    controllerState.textQuery = '';
    controllerState.activePresetFilterId = null;
    for (const binding of controllerState.filterBindings) {
      if (binding.searchInput) binding.searchInput.value = '';
    }
    applyFilters();
    return controller;
  }

  function getVisibleMarkers() {
    const preset = getActivePresetFilter();
    return [...controllerState.markerHandles.values()]
      .filter(handle => handle.visible && markerMatchesPreset(handle.item, preset) && markerMatchesText(handle.item, controllerState.textQuery))
      .map(handle => handle.item);
  }

  function resolveFilterButtons(source) {
    if (!source) return [];
    if (typeof source === 'string') return [...document.querySelectorAll(source)];
    if (source instanceof Element) return [source];
    if (typeof source[Symbol.iterator] === 'function') return [...source];
    throw new TypeError('filterButtons должен быть CSS-селектором, элементом или массивом элементов.');
  }

  /** Подключает к API уже существующие элементы поиска и кнопки фильтров страницы. */
  function bindFilterControls(options = {}) {
    const searchInput = options.searchInput ? resolveElement(options.searchInput) : null;
    const buttons = resolveFilterButtons(options.filterButtons ?? '[data-map-filter]');
    const activeClass = options.activeClass === false ? '' : (options.activeClass ?? 'is-active');
    const binding = { searchInput, buttons, activeClass, cleanup: null };

    const onSearchInput = () => setTextFilter(searchInput.value);
    if (searchInput) {
      searchInput.addEventListener('input', onSearchInput);
      // Значение из HTML имеет приоритет; иначе показываем initialSearch в поле.
      if (searchInput.value.trim()) controllerState.textQuery = searchInput.value;
      else searchInput.value = controllerState.textQuery;
    }

    const buttonListeners = [];
    for (const button of buttons) {
      const onClick = event => {
        const filterId = button.getAttribute('data-map-filter') ?? button.dataset.mapFilter;
        if (!filterId) return;
        event.preventDefault();
        setPresetFilter(filterId);
      };
      button.addEventListener('click', onClick);
      buttonListeners.push([button, onClick]);
    }

    const cleanup = () => {
      if (searchInput) searchInput.removeEventListener('input', onSearchInput);
      for (const [button, listener] of buttonListeners) button.removeEventListener('click', listener);
      controllerState.filterBindings.delete(binding);
    };
    binding.cleanup = cleanup;
    controllerState.filterBindings.add(binding);
    syncFilterButtons(binding);
    applyFilters();
    return cleanup;
  }

  function removeMarker(id) {
    const handle = controllerState.markerHandles.get(String(id));
    if (!handle) return false;
    handle.marker.remove();
    handle.popup.remove();
    controllerState.markerHandles.delete(String(id));
    applyFilters();
    return true;
  }

  function addMarker(rawMarker, notify = true) {
    const item = normalizeMarker(rawMarker, controllerState.markerHandles.size);
    if (controllerState.markerHandles.has(item.id)) {
      throw new Error(`Метка с id "${item.id}" уже существует.`);
    }

    const element = createMarkerElement(item, config);
    // popupOnMarkerClick=false: описание показывается только в карточке страницы.
    // MapLibre вешает свой обработчик клика в setPopup, поэтому окно не создаём и не
    // привязываем к метке. Заглушка оставляет рабочими remove()/isOpen() в API метки.
    const withPopup = config.popupOnMarkerClick !== false;
    const popup = withPopup
      ? new maplibregl.Popup({
          offset: config.popup?.offset ?? 34,
          closeButton: config.popup?.closeButton ?? true,
          closeOnClick: config.popup?.closeOnClick ?? true,
          maxWidth: config.popup?.maxWidth ?? '310px',
          className: config.popup?.className ?? 'im-map-popup-container',
        }).setDOMContent(createPopupContent(item, config))
      : createDetachedPopup();

    element.addEventListener('click', () => {
      for (const handle of controllerState.markerHandles.values()) {
        if (handle.item.id !== item.id) handle.popup.remove();
      }
      if (typeof config.onMarkerClick === 'function') config.onMarkerClick(item, map);
    });

    const marker = new maplibregl.Marker({
      element,
      anchor: item.anchor ?? 'bottom',
      offset: item.offset ?? [0, 0],
    }).setLngLat(item.coordinates).addTo(map);
    if (withPopup) marker.setPopup(popup);

    const handle = { item, marker, popup, element, visible: true };
    controllerState.markerHandles.set(item.id, handle);
    applyFilters(notify);
    return {
      id: item.id,
      remove: () => removeMarker(item.id),
      marker,
      popup,
    };
  }

  function setMarkers(nextMarkers = []) {
    for (const id of [...controllerState.markerHandles.keys()]) {
      const handle = controllerState.markerHandles.get(id);
      handle.marker.remove();
      handle.popup.remove();
      controllerState.markerHandles.delete(id);
    }
    nextMarkers.forEach((item, index) => addMarker(normalizeMarker(item, index), false));
    applyFilters();
    return controller;
  }

  function getContentBounds(overrides = {}) {
    return bounds && (overrides.useMapBounds ?? true)
      ? bounds
      : makeBoundsFromMarkers(maplibregl, getVisibleMarkers());
  }

  function getFitOptions(overrides = {}) {
    return {
      padding: overrides.padding ?? fitPadding,
      maxZoom: overrides.maxZoom ?? config.fitMaxZoom ?? 15,
      duration: overrides.duration ?? 500,
    };
  }

  function fitToContent(overrides = {}) {
    const targetBounds = getContentBounds(overrides);
    if (targetBounds) {
      updateCalculatedMinZoom(overrides);
      map.fitBounds(targetBounds, getFitOptions(overrides));
    } else if (controllerState.markerHandles.size === 1) {
      const only = [...controllerState.markerHandles.values()][0].item;
      map.easeTo({ center: only.coordinates, zoom: overrides.zoom ?? config.singleMarkerZoom ?? 14, duration: overrides.duration ?? 500 });
    }
  }

  const controller = {
    map,
    get markers() {
      return [...controllerState.markerHandles.values()].map(handle => handle.item);
    },
    get filters() {
      return [...controllerState.presetFilters.values()].map(({ predicate, ...filter }) => filter);
    },
    get filterState() {
      return {
        query: controllerState.textQuery,
        presetFilterId: controllerState.activePresetFilterId ?? 'all',
        visibleMarkers: getVisibleMarkers(),
        totalMarkers: controllerState.markerHandles.size,
      };
    },
    addMarker: rawMarker => addMarker(rawMarker, true),
    removeMarker,
    setMarkers,
    setTextFilter,
    setPresetFilter,
    clearFilters,
    getVisibleMarkers,
    selectMarker(id, { openPopup = true, center = true, zoom, duration = 400 } = {}) {
      const selected = controllerState.markerHandles.get(String(id));
      if (!selected || !selected.visible) return false;
      for (const handle of controllerState.markerHandles.values()) {
        const active = handle === selected;
        handle.element.classList.toggle('is-selected', active);
        handle.element.setAttribute('aria-pressed', String(active));
        if (!active || !openPopup) handle.popup.remove();
      }
      if (center) map.easeTo({ center: selected.item.coordinates, zoom, duration });
      if (openPopup && config.popupOnMarkerClick !== false && !selected.popup.isOpen()) {
        selected.marker.togglePopup();
      }
      return true;
    },
    bindFilterControls,
    fitToContent,
    destroy() {
      if (controllerState.destroyed) return;
      controllerState.destroyed = true;
      for (const binding of [...controllerState.filterBindings]) binding.cleanup();
      controllerState.markerHandles.clear();
      map.remove();
    },
  };

  markersData.forEach(item => addMarker(item, false));
  applyFilters(false);
  updateCalculatedMinZoom();

  if (config.filterControls) bindFilterControls(config.filterControls);
  else if (typeof config.onFilterChange === 'function') applyFilters(true);

  if (typeof config.onReady === 'function') config.onReady(controller);

  if (config.fitBoundsOnLoad !== false) {
    if (bounds) {
      map.fitBounds(bounds, {
        padding: fitPadding,
        maxZoom: config.fitMaxZoom ?? 12.5,
        duration: 0,
      });
    } else {
      fitToContent({ padding: fitPadding, duration: 0 });
    }
  }

  if (autoMinZoom && !Number.isFinite(config.minZoom)) {
    map.on('resize', () => updateCalculatedMinZoom());
  }

  return controller;
}

// Shared with the page so search and category filters also work before map loading.
export function filterMarkers(markers, { query = '', presetFilterId = 'all' } = {}, filters = []) {
  const preset = normalizePresetFilters(filters).get(presetFilterId) ?? null;
  return markers.map(normalizeMarker).filter(item => markerMatchesPreset(item, preset) && markerMatchesText(item, query));
}

export { DEFAULT_STYLE, DEFAULT_PALETTE };
