(async () => {
  const atlas = document.querySelector('.literary-atlas');
  if (!atlas) return;
  const { createIllustratedMap, filterMarkers } = await import('./map-widget.js?v=4');
  const places = JSON.parse(atlas.querySelector('#atlas-places').textContent);
  const byId = new Map(places.map(place => [place.id, place]));
  const detailUrl = place => place.detail_url ?? `pages/places/#${place.id}`;
  const filters = [
    { id: 'museum', categories: ['museum'] },
    { id: 'park', categories: ['park'] },
    { id: 'culture', categories: ['theatre', 'library'] },
    { id: 'monument', categories: ['monument'] },
    { id: 'building', categories: ['building'] },
    { id: 'street', categories: ['street'] },
  ];
  const markers = places.map(place => ({
    ...place,
    markerImage: place.image,
    markerAlt: '',
    imageAlt: place.title,
    description: place.paragraphs[0],
    keywords: [place.writer, place.category],
    url: detailUrl(place),
    linkText: 'Читать историю места',
    color: '#8e2d36',
  }));
  const search = atlas.querySelector('#atlas-search');
  const buttons = [...atlas.querySelectorAll('[data-map-filter]')];
  const choices = [...atlas.querySelectorAll('.atlas-choices a')];
  const card = atlas.querySelector('.atlas-key');
  const description = atlas.querySelector('.atlas-description');
  const quote = atlas.querySelector('.atlas-quote');
  const reset = atlas.querySelector('.atlas-reset');
  const detailButton = atlas.querySelector('.atlas-show-detail');
  const fit = atlas.querySelector('.atlas-fit');
  const notice = atlas.querySelector('.atlas-map-notice');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let widget;
  let selectedId = places[0].id;
  let presetFilterId = 'all';
  let visible = markers;
  const duration = () => reducedMotion.matches ? 0 : 400;

  // Одна метка в кадре: вместо вырожденных границ — городской масштаб,
  // чтобы фильтр с единственным результатом не улетал в уличный зум.
  const singleMarkerZoom = 13.6;

  // Масштаб z даёт 78271.5*cos(lat)/2^z метров на пиксель; ScaleControl берёт
  // ближайшую «красивую» величину 1, 2, 3 или 5×10^n в интервале 50–100 px.
  // 55 м на 100 px — середина полосы, где подпись линейки равна 50 м на всей
  // широте города (54.69–54.82), а не только в его южной части.
  const focusZoom = (latitude = 54.73, meters = 55, scalePx = 100) =>
    Math.min(19, Math.max(15, Math.log2(78271.5 * Math.cos(latitude * Math.PI / 180) / meters * scalePx)));

  function select(id, { fromMarker = false, center = true } = {}) {
    const place = byId.get(id);
    if (!place) return;
    selectedId = id;
    if ((center || fromMarker) && typeof document.dispatchEvent === 'function') {
      document.dispatchEvent(new CustomEvent('ufalit:map-select'));
    }
    card.hidden = false;
    atlas.querySelector('#atlas-place-title').textContent = place.title;
    atlas.querySelector('.atlas-writer').textContent = place.writer;
    atlas.querySelector('.atlas-kicker').textContent = place.category;
    atlas.querySelector('.atlas-address').textContent = place.address;
    const image = atlas.querySelector('.atlas-photo');
    image.src = place.image;
    image.alt = place.title;
    quote.textContent = place.quote || '';
    quote.hidden = !place.quote;
    const paragraphs = place.paragraphs.map(text => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      return paragraph;
    });
    description.replaceChildren(...paragraphs, quote);
    description.scrollTop = 0;
    atlas.querySelector('.atlas-more').href = detailUrl(place);
    choices.forEach(link => {
      const active = link.dataset.placeId === id;
      link.classList.toggle('is-selected', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    detailButton.hidden = false;
    // Место, выбранное в списке, показывается крупно: масштаб подобран так,
    // чтобы линейка ScaleControl показывала около 50 м.
    // center=false оставляет камеру как есть: смена фильтра и первичная отрисовка
    // не должны приближать карту к одной метке.
    widget?.selectMarker(id, {
      openPopup: false,
      center: center && !fromMarker,
      zoom: center && !fromMarker ? focusZoom() : undefined,
      duration: duration(),
    });
  }

  function applyFilters() {
    visible = filterMarkers(markers, { query: search.value, presetFilterId }, filters);
    const ids = new Set(visible.map(place => place.id));
    choices.forEach(link => { link.closest('li').hidden = !ids.has(link.dataset.placeId); });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mapFilter === presetFilterId)));
    atlas.querySelector('.atlas-count').textContent = `Показано мест: ${visible.length} из ${places.length}`;
    atlas.querySelector('.atlas-empty').hidden = visible.length > 0;
    reset.hidden = !search.value && presetFilterId === 'all';
    if (widget) {
      widget.setTextFilter(search.value);
      widget.setPresetFilter(presetFilterId);
      // Фильтр и поиск показывают всю подборку на обзорном масштабе.
      if (visible.length) widget.fitToContent({ useMapBounds: false, duration: duration() });
    }
    if (!ids.has(selectedId)) {
      if (visible.length) select(visible[0].id, { center: false });
      else {
        selectedId = null;
        card.hidden = true;
        detailButton.hidden = true;
        choices.forEach(link => {
          link.classList.remove('is-selected');
          link.removeAttribute('aria-current');
        });
      }
    } else if (widget) widget.selectMarker(selectedId, { openPopup: false, center: false });
  }

  choices.forEach(link => link.addEventListener('click', event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    select(link.dataset.placeId);
  }));
  buttons.forEach(button => button.addEventListener('click', () => {
    presetFilterId = button.dataset.mapFilter;
    applyFilters();
  }));
  search.addEventListener('input', applyFilters);
  reset.addEventListener('click', () => {
    search.value = '';
    presetFilterId = 'all';
    applyFilters();
    search.focus();
  });
  detailButton.addEventListener('click', () => {
    card.scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    atlas.querySelector('#atlas-place-title').focus({ preventScroll: true });
  });
  fit.addEventListener('click', () => widget?.fitToContent({ useMapBounds: false, duration: duration() }));
  atlas.querySelector('.atlas-toolbar').hidden = false;
  select(selectedId, { center: false });
  applyFilters();

  try {
    widget = await createIllustratedMap({
      container: '#literary-map',
      markers,
      filters,
      markerSize: { width: 64, height: 76 },
      markerClass: 'atlas-photo-marker',
      linkTarget: '_self',
      attributionControl: { compact: true },
      fitPadding: { top: 90, right: 65, bottom: 75, left: 65 },
      fitMaxZoom: 14.5,
      singleMarkerZoom,
      autoMinZoom: true,
      maxZoom: 18,
      cooperativeGestures: true,
      labelLanguage: 'ru',
      locale: {
        'NavigationControl.ZoomIn': 'Приблизить',
        'NavigationControl.ZoomOut': 'Отдалить',
        'NavigationControl.ResetBearing': 'Ориентировать на север',
        'AttributionControl.ToggleAttribution': 'Источники карты',
        'Popup.Close': 'Закрыть карточку',
        'Map.Title': 'Карта Уфы',
        'Map.Description': 'Используйте стрелки для перемещения по карте, плюс и минус для изменения масштаба.',
        'CooperativeGesturesHandler.WindowsHelpText': 'Удерживайте Ctrl, чтобы изменить масштаб карты',
        'CooperativeGesturesHandler.MacHelpText': 'Удерживайте ⌘, чтобы изменить масштаб карты',
        'CooperativeGesturesHandler.MobileHelpText': 'Перемещайте карту двумя пальцами',
      },
      palette: {
        background: '#f4f1e8', residential: '#eeeae1', water: '#abcfd1',
        parks: '#c6d8ba', woodland: '#a9c5ac', grass: '#d5e0c7',
        buildings: '#dfd7c8', streets: '#fffdf7', majorRoads: '#e5cfaa',
        education: '#ded9d1', healthcare: '#e6d8d2',
      },
      popup: { maxWidth: '265px', offset: 40 },
      // Описание выбранной метки показывается в карточке справа, а не поверх карты.
      popupOnMarkerClick: false,
      onMarkerClick: place => select(place.id, { fromMarker: true }),
    });
    notice.hidden = true;
    fit.hidden = false;
    applyFilters();
    // Resize when the responsive layout or text size changes.
    new ResizeObserver(() => widget.map.resize()).observe(atlas.querySelector('.atlas-sheet'));
  } catch (error) {
    notice.replaceChildren();
    const message = document.createElement('p');
    message.textContent = 'Карта сейчас недоступна. Выберите место в списке ниже — фотографии и истории доступны.';
    notice.append(message);
    atlas.classList.add('atlas-unavailable');
    console.warn('Литературная карта:', error);
  }
})();
