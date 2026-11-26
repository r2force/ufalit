(() => {
  const gallery = document.querySelector('.gallery[data-archive-gallery]');
  const readFrames = (root) => Array.from(root.querySelectorAll('.photo-stage[href]'), (link) => {
    const figure = link.closest('figure');
    const image = link.querySelector('img');
    return {
      figure, link, image, alt: image.alt,
      caption: figure.querySelector('.photo-caption'),
      metadata: figure.querySelector('.photo-metadata'),
      note: figure.querySelector('.photo-note'),
      category: figure.dataset.category || 'Фотоархив',
      writer: figure.dataset.writer || '',
      writerName: figure.dataset.writerName || '',
    };
  });
  const initialFrames = gallery ? readFrames(gallery) : [];
  const articleGroups = new Map();
  for (const link of document.querySelectorAll('a[data-lightbox][href]')) {
    const group = link.closest('[data-image-viewer]')
      || link.closest('details[data-writer], section[data-writer], article, main') || document.body;
    const image = link.querySelector('img');
    const figure = link.closest('figure, .material-inline-captioned');
    const caption = figure?.querySelector('figcaption, .material-caption');
    const alt = image?.alt || caption?.textContent.trim() || link.textContent.trim() || 'Изображение';
    if (!articleGroups.has(group)) articleGroups.set(group, []);
    articleGroups.get(group).push({ link, image, caption, alt });
  }
  if (!initialFrames.length && !articleGroups.size) return;
  const initialScope = new Set(initialFrames);
  const catalogTemplate = document.querySelector('template[data-gallery-catalog]');
  const remainingFrames = catalogTemplate ? readFrames(catalogTemplate.content) : [];
  const frames = [...initialFrames, ...remainingFrames].sort((a, b) => Number(a.figure.dataset.galleryOrder || 0) - Number(b.figure.dataset.galleryOrder || 0));
  const archive = initialFrames.length > 0;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const behavior = () => motion.matches ? 'instant' : 'smooth';
  const normalize = (text) => text.toLocaleLowerCase('ru').replaceAll('ё', 'е').replace(/\s+/g, ' ').trim();
  let visible = [...initialFrames];
  let mode = 'grid';
  let stageIndex = 0;
  let film;
  let updateFilm = () => {};
  const icons = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    filmstrip: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4"/>',
    masonry: '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M12 3v18M3 9h9M12 15h9"/>',
    contact: '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>',
    search: '<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/>',
    zoomIn: '<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5M7 10.5h7M10.5 7v7"/>',
    zoomOut: '<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5M7 10.5h7"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"/>',
    external: '<path d="M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">${icons[name]}</svg>`;

  function background(element, source) {
    // Quoted CSS URL keeps filenames with spaces, quotes and parentheses intact.
    element.style.setProperty('--photo-image', `url(${JSON.stringify(source)})`);
  }
  function reveal(element, container) {
    if (!element || !container) return;
    const bounds = element.getBoundingClientRect();
    const area = container.getBoundingClientRect();
    if (bounds.left < area.left || bounds.right > area.right) {
      container.scrollTo({ left: container.scrollLeft + bounds.left - area.left, behavior: behavior() });
    }
  }
  function description(frame) {
    return [frame.caption?.textContent.trim() || frame.alt, frame.note?.textContent.trim(), frame.metadata?.textContent.trim()].filter(Boolean).join(' · ');
  }
  function copyCaption(target, frame) {
    target.replaceChildren();
    for (const part of [frame.caption, frame.note]) if (part) target.append(part.cloneNode(true));
    const footer = document.createElement('div');
    footer.className = 'photo-footer';
    if (frame.metadata) footer.append(frame.metadata.cloneNode(true));
    const original = document.createElement('a');
    original.className = 'photo-original';
    original.href = frame.link.href;
    original.target = '_blank';
    original.rel = 'noopener';
    original.textContent = 'Оригинал ↗';
    footer.append(original);
    target.append(footer);
  }

  if (archive) {
    const writers = document.querySelector('.gallery-writers');
    const heading = document.querySelector('.gallery-album-heading h2');
    const albumCount = document.querySelector('.gallery-album-heading p');
    const content = document.querySelector('.gallery-content');
    const related = document.querySelector('.gallery-related');
    let selectedWriter = gallery.dataset.writer;
    let selectedHeading = heading.textContent;
    let selectedCount = albumCount.textContent;
    let useInitialScope = true;
    let mounted = false;
    const previewSource = frame => frame.image.dataset.previewSrc || frame.image.currentSrc || frame.image.src;
    const previewObserver = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        const frame = frames.find(item => item.figure === entry.target);
        if (frame) background(frame.link, previewSource(frame));
        previewObserver.unobserve(entry.target);
      }
    }, { rootMargin: '300px' }) : null;
    const observePreview = frame => previewObserver ? previewObserver.observe(frame.figure) : background(frame.link, previewSource(frame));
    initialFrames.forEach(observePreview);
    function mountCatalog() {
      if (mounted || !catalogTemplate) return;
      remainingFrames.forEach((frame) => { frame.figure.hidden = true; });
      gallery.replaceChildren(...frames.map((frame) => frame.figure));
      catalogTemplate.remove();
      remainingFrames.forEach(observePreview);
      mounted = true;
    }
    const toolbar = document.createElement('section');
    toolbar.className = 'gallery-toolbar';
    toolbar.setAttribute('aria-label', 'Вид и фильтры фотографий');
    toolbar.innerHTML = `<div class="gallery-tools-top"><div class="gallery-views" role="group" aria-label="Вид отображения"></div><label class="gallery-search">${icon('search')}<input type="search" aria-label="Поиск по подписям фотографий всех литераторов" placeholder="Поиск по всем фотографиям"></label></div><div class="gallery-tools-bottom"><div class="gallery-filters" role="group" aria-label="Категория фотографий"></div><p class="gallery-result" role="status" aria-live="polite"></p></div>`;
    gallery.before(toolbar);
    const empty = document.createElement('div');
    empty.className = 'gallery-empty';
    empty.hidden = true;
    empty.innerHTML = '<p>Фотографии не найдены. Измените запрос или выберите другую категорию.</p><button type="button" class="museum-control">Сбросить фильтры</button>';
    gallery.after(empty);
    const views = toolbar.querySelector('.gallery-views');
    const viewButtons = [];
    const layouts = [['grid', 'Музейное паспарту'], ['filmstrip', 'Архивный стол / Диафильм'], ['masonry', 'Журнальная кладка'], ['contact', 'Контактный лист']];
    layouts.forEach(([value, label]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.innerHTML = `${icon(value)}<span>${label}</span>`;
      button.dataset.mode = value;
      button.addEventListener('click', () => setMode(value));
      views.append(button);
      viewButtons.push(button);
    });
    film = document.createElement('section');
    film.className = 'gallery-film';
    film.hidden = true;
    film.setAttribute('aria-label', 'Архивный стол');
    film.tabIndex = 0;
    film.innerHTML = `<div class="gallery-film-screen"><div class="gallery-film-bar"><span data-film-count aria-live="polite"></span><div><button type="button" class="museum-control" data-film-loupe aria-pressed="false">Лупа 2,8×</button> <button type="button" class="museum-control" data-film-open>На весь экран ↗</button></div></div><div class="gallery-film-image"><img alt=""><div class="photo-loupe" hidden aria-hidden="true"></div></div><div class="gallery-film-bar"><button type="button" class="museum-control" data-film-prev>← Предыдущий</button><button type="button" class="museum-control" data-film-next>Следующий →</button></div></div><div class="gallery-film-detail"></div>`;
    gallery.before(film);
    const filmImage = film.querySelector('img');
    const filmCount = film.querySelector('[data-film-count]');
    const filmDetail = film.querySelector('.gallery-film-detail');
    const filmLoupe = attachLoupe(film.querySelector('.gallery-film-image'), filmImage, film.querySelector('.photo-loupe'), film.querySelector('[data-film-loupe]'));
    updateFilm = () => {
      film.hidden = mode !== 'filmstrip' || !visible.length;
      if (mode !== 'filmstrip' || !visible.length) return;
      stageIndex = (stageIndex + visible.length) % visible.length;
      const frame = visible[stageIndex];
      filmImage.src = frame.link.href;
      filmImage.alt = frame.alt;
      filmCount.textContent = `Кадр ${stageIndex + 1} из ${visible.length}`;
      copyCaption(filmDetail, frame);
      filmLoupe.reset();
      frames.forEach((item) => item.figure.classList.toggle('is-current', item === frame));
      for (const button of film.querySelectorAll('[data-film-prev], [data-film-next]')) button.disabled = visible.length < 2;
    };
    const changeFilm = (step) => {
      stageIndex += step;
      updateFilm();
      reveal(visible[stageIndex]?.figure, gallery);
    };
    film.querySelector('[data-film-prev]').addEventListener('click', () => changeFilm(-1));
    film.querySelector('[data-film-next]').addEventListener('click', () => changeFilm(1));
    film.querySelector('[data-film-open]').addEventListener('click', (event) => openViewer(visible[stageIndex], event.currentTarget));
    filmImage.addEventListener('click', () => openViewer(visible[stageIndex], film.querySelector('[data-film-open]')));
    film.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      changeFilm(event.key === 'ArrowLeft' ? -1 : 1);
    });
    let category = 'Все';
    const filters = toolbar.querySelector('.gallery-filters');
    const search = toolbar.querySelector('input');
    const result = toolbar.querySelector('.gallery-result');
    const categories = ['Все', ...new Set(frames.map((frame) => frame.category))];
    for (const label of categories) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.addEventListener('click', () => { category = label; filter(); });
      filters.append(button);
    }
    function filter() {
      const query = normalize(search.value);
      if (query) mountCatalog();
      const scope = query ? frames : frames.filter((frame) => useInitialScope ? initialScope.has(frame) : frame.writer === selectedWriter);
      const allowed = new Set(scope);
      visible = frames.filter((frame) => {
        const found = allowed.has(frame) && (category === 'Все' || frame.category === category) && normalize(frame.caption?.textContent || frame.alt).includes(query);
        frame.figure.hidden = !found;
        return found;
      });
      for (const button of filters.children) button.setAttribute('aria-pressed', button.textContent === category);
      result.textContent = `Показано: ${visible.length} из ${scope.length}${query ? ' · Все литераторы' : ''}`;
      heading.textContent = query ? 'Результаты поиска по всем литераторам' : selectedHeading;
      albumCount.textContent = query ? `${visible.length} фото` : selectedCount;
      if (related) related.hidden = !!query || !useInitialScope;
      empty.hidden = !!visible.length;
      gallery.hidden = !visible.length;
      stageIndex = 0;
      updateFilm();
    }
    function setMode(value) {
      mode = value;
      gallery.dataset.view = value;
      gallery.scrollLeft = 0;
      viewButtons.forEach((button) => button.setAttribute('aria-pressed', button.dataset.mode === value));
      updateFilm();
      try { sessionStorage.setItem('ufalit-gallery-view', value); } catch { /* Storage can be disabled. */ }
    }
    search.addEventListener('input', filter);
    empty.querySelector('button').addEventListener('click', () => { search.value = ''; category = 'Все'; filter(); search.focus(); });
    function selectWriter(card, scroll) {
      mountCatalog();
      selectedWriter = card.dataset.galleryWriter;
      selectedHeading = card.querySelector('.gallery-writer-name').textContent;
      selectedCount = card.querySelector('.gallery-writer-count').textContent;
      useInitialScope = false;
      category = 'Все';
      search.value = '';
      writers.querySelectorAll('.gallery-writer').forEach((item) => {
        if (item === card) item.setAttribute('aria-current', 'true');
        else item.removeAttribute('aria-current');
      });
      gallery.dataset.writer = selectedWriter;
      filter();
      if (scroll) {
        history.replaceState(null, '', '#gallery-photos');
        content.scrollIntoView({ behavior: behavior(), block: 'start' });
        heading.focus({ preventScroll: true });
      }
    }
    writers.querySelectorAll('.gallery-writer').forEach((card) => card.addEventListener('click', (event) => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      event.preventDefault();
      selectWriter(card, true);
    }));
    let saved;
    try { saved = sessionStorage.getItem('ufalit-gallery-view'); } catch { /* Use the default layout. */ }
    setMode(layouts.some(([value]) => value === saved) ? saved : 'grid');
    filter();
    // Incoming photo anchors must stay visible in every layout, including the filmstrip.
    function followAnchor() {
      const target = frames.find((frame) => `#${frame.figure.id}` === location.hash);
      if (target && !visible.includes(target)) {
        const card = Array.from(writers.querySelectorAll('.gallery-writer')).find((item) => item.dataset.galleryWriter === target.writer);
        if (card) selectWriter(card, false);
        target.figure.scrollIntoView({ block: 'start' });
      }
      const index = visible.indexOf(target);
      if (index < 0) return;
      stageIndex = index;
      updateFilm();
      if (mode === 'filmstrip') reveal(visible[index].figure, gallery);
    }
    followAnchor();
    window.addEventListener('hashchange', followAnchor);
  }

  function attachLoupe(container, img, lens, toggle) {
    let enabled = false;
    let lastPoint;
    function hide() { lens.hidden = true; }
    function move(event) {
      lastPoint = event;
      if (!enabled || !img.naturalWidth) return hide();
      const imageBounds = img.getBoundingClientRect();
      const box = container.getBoundingClientRect();
      const x = event.clientX - imageBounds.left;
      const y = event.clientY - imageBounds.top;
      if (x < 0 || y < 0 || x > imageBounds.width || y > imageBounds.height) return hide();
      lens.hidden = false;
      const radius = lens.offsetWidth / 2;
      const centerX = event.clientX - box.left + container.scrollLeft;
      const centerY = event.clientY - box.top + container.scrollTop;
      lens.style.left = `${centerX - radius}px`;
      lens.style.top = `${centerY - radius}px`;
      lens.style.backgroundImage = `url(${JSON.stringify(img.src)})`;
      lens.style.backgroundSize = `${imageBounds.width * 2.8}px ${imageBounds.height * 2.8}px`;
      lens.style.backgroundPosition = `${radius - x * 2.8}px ${radius - y * 2.8}px`;
    }
    toggle.addEventListener('click', () => {
      enabled = !enabled;
      toggle.setAttribute('aria-pressed', enabled);
      container.style.cursor = enabled ? 'crosshair' : '';
      if (!enabled) hide();
      else if (lastPoint) move(lastPoint);
    });
    container.addEventListener('pointermove', move);
    container.addEventListener('pointerleave', hide);
    container.addEventListener('scroll', hide);
    return { reset: hide };
  }

  const dialog = document.createElement('dialog');
  if (typeof dialog.showModal !== 'function') return;
  dialog.className = 'ufalit-lightbox';
  dialog.dataset.theme = 'dark';
  dialog.setAttribute('aria-label', 'Просмотр фотографий');
  dialog.innerHTML = `
    <header class="lightbox-controls">
      <div class="lightbox-heading"><h2></h2><div class="lightbox-counter" aria-live="polite"></div></div>
      <div class="lightbox-tools">
        <button class="museum-control lightbox-loupe-toggle" type="button" data-loupe aria-pressed="false" title="Горячая клавиша: L">${icon('search')}<span>Лупа краеведа 2,8× (L)</span></button>
        <div class="lightbox-zoom" role="group" aria-label="Масштаб фотографии">
          <button class="museum-control lightbox-icon-button" type="button" data-zoom-out aria-label="Уменьшить">${icon('zoomOut')}</button>
          <button class="lightbox-zoom-label" type="button" data-zoom data-zoom-reset aria-label="Сбросить масштаб">100%</button>
          <button class="museum-control lightbox-icon-button" type="button" data-zoom-in aria-label="Увеличить">${icon('zoomIn')}</button>
        </div>
        <div class="lightbox-themes" role="group" aria-label="Оформление просмотра">${icon('layers')}
          <button type="button" data-theme="dark" aria-pressed="true">Тёмный зал</button>
          <button type="button" data-theme="mat" aria-pressed="false">Паспарту</button>
          <button type="button" data-theme="ambient" aria-pressed="false">Амбиент</button>
        </div>
      </div>
      <div class="lightbox-actions">
        <a class="lightbox-original" target="_blank" rel="noopener"><span>Оригинал</span>${icon('external')}</a>
        <button class="museum-control lightbox-icon-button lightbox-close" type="button" autofocus aria-label="Закрыть просмотр">${icon('close')}</button>
      </div>
    </header>
    <div class="lightbox-center"><button class="museum-control lightbox-prev" type="button" aria-label="Предыдущее изображение">←</button><div class="lightbox-stage" tabindex="0" aria-label="Фотография. Увеличенное изображение можно прокручивать."><div class="lightbox-image-wrap"><img class="lightbox-image" alt=""><div class="photo-loupe" hidden aria-hidden="true"></div></div></div><button class="museum-control lightbox-next" type="button" aria-label="Следующее изображение">→</button></div>
    <div class="lightbox-footer"><p class="lightbox-caption"></p><div class="lightbox-thumbnails" aria-label="Фотографии подборки"></div></div>`;
  document.body.append(dialog);
  const enlarged = dialog.querySelector('.lightbox-image');
  const stage = dialog.querySelector('.lightbox-stage');
  const title = dialog.querySelector('h2');
  const counter = dialog.querySelector('.lightbox-counter');
  const original = dialog.querySelector('.lightbox-original');
  const caption = dialog.querySelector('.lightbox-caption');
  const thumbnails = dialog.querySelector('.lightbox-thumbnails');
  const previous = dialog.querySelector('.lightbox-prev');
  const next = dialog.querySelector('.lightbox-next');
  const minus = dialog.querySelector('[data-zoom-out]');
  const plus = dialog.querySelector('[data-zoom-in]');
  const zoomLabel = dialog.querySelector('[data-zoom]');
  const loupeButton = dialog.querySelector('[data-loupe]');
  const loupe = attachLoupe(dialog.querySelector('.lightbox-image-wrap'), enlarged, dialog.querySelector('.photo-loupe'), loupeButton);
  let active = 0;
  let opener;
  let zoom = 1;
  let fittedWidth = 0;
  let viewerFrames = [];
  const thumbButtons = new Map();
  function setZoom(value) {
    zoom = Math.max(1, Math.min(3.5, value));
    stage.classList.toggle('is-zoomed', zoom > 1);
    enlarged.style.width = zoom > 1 ? `${Math.round(fittedWidth * zoom)}px` : '';
    zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
    minus.disabled = zoom === 1;
    plus.disabled = zoom === 3.5;
    loupe.reset();
    if (zoom === 1) stage.scrollTo(0, 0);
  }
  function measure() {
    if (!dialog.open || !enlarged.naturalWidth) return;
    const current = zoom;
    setZoom(1);
    fittedWidth = enlarged.getBoundingClientRect().width;
    setZoom(current);
    minus.disabled = current === 1;
    plus.disabled = current === 3.5;
  }
  function show(index) {
    active = (index + viewerFrames.length) % viewerFrames.length;
    const frame = viewerFrames[active];
    setZoom(1);
    fittedWidth = 0;
    plus.disabled = true;
    enlarged.alt = frame.alt;
    enlarged.src = original.href = frame.link.href;
    title.textContent = frame.caption?.textContent.trim() || frame.alt;
    counter.textContent = `${frame.writerName ? frame.writerName + ' · ' : ''}Кадр ${active + 1} из ${viewerFrames.length}`;
    const extension = new URL(frame.link.href).pathname.split('.').pop().toUpperCase();
    original.querySelector('span').textContent = `Оригинал ${['JPG', 'JPEG'].includes(extension) ? 'JPEG' : extension}`;
    caption.textContent = description(frame);
    background(dialog, frame.link.href);
    thumbButtons.forEach((button, item) => {
      if (item === frame) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    reveal(thumbButtons.get(frame), thumbnails);
    previous.disabled = next.disabled = viewerFrames.length < 2;
    if (enlarged.complete && enlarged.naturalWidth) measure();
  }
  function openViewer(frame, trigger, selection = visible) {
    if (!frame) return;
    opener = trigger;
    viewerFrames = [...selection];
    thumbButtons.clear();
    thumbnails.replaceChildren();
    viewerFrames.forEach((item, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'lightbox-thumbnail';
      button.setAttribute('aria-label', `Кадр ${index + 1}: ${item.alt}`);
      const img = document.createElement('img');
      img.src = item.image?.dataset.previewSrc || item.image?.currentSrc || item.image?.src || item.link.href;
      img.alt = '';
      img.loading = 'lazy';
      button.append(img);
      button.addEventListener('click', () => show(index));
      thumbnails.append(button);
      thumbButtons.set(item, button);
    });
    show(viewerFrames.indexOf(frame));
    dialog.showModal();
    measure();
    reveal(thumbButtons.get(frame), thumbnails);
  }
  function onPhotoClick(frame, open) {
    frame.link.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      event.preventDefault();
      open();
    });
  }
  for (const frame of frames) {
    onPhotoClick(frame, () => {
      if (mode === 'filmstrip') { stageIndex = visible.indexOf(frame); updateFilm(); }
      else openViewer(frame, frame.link);
    });
  }
  for (const group of articleGroups.values()) {
    for (const frame of group) {
      frame.link.setAttribute('aria-haspopup', 'dialog');
      onPhotoClick(frame, () => openViewer(frame, frame.link, group));
    }
  }
  enlarged.addEventListener('load', measure);
  enlarged.addEventListener('error', () => { plus.disabled = true; caption.textContent = 'Не удалось загрузить фотографию. Попробуйте открыть оригинал.'; });
  window.addEventListener('resize', measure);
  previous.addEventListener('click', () => show(active - 1));
  next.addEventListener('click', () => show(active + 1));
  plus.addEventListener('click', () => setZoom(zoom + .5));
  minus.addEventListener('click', () => setZoom(zoom - .5));
  dialog.querySelector('[data-zoom-reset]').addEventListener('click', () => setZoom(1));
  dialog.querySelectorAll('[data-theme]').forEach((button) => button.addEventListener('click', () => {
    dialog.dataset.theme = button.dataset.theme;
    dialog.querySelectorAll('[data-theme]').forEach((item) => item.setAttribute('aria-pressed', item === button));
    measure();
  }));
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));
  dialog.addEventListener('keydown', (event) => {
    if (event.target.matches('select, input, textarea')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      if (viewerFrames.length < 2 || (stage.contains(event.target) && zoom > 1)) return;
      event.preventDefault();
      show(active + (event.key === 'ArrowLeft' ? -1 : 1));
    } else if (event.key === '+' || event.key === '=') {
      if (fittedWidth) { event.preventDefault(); setZoom(zoom + .5); }
    } else if (event.key === '-') {
      event.preventDefault(); setZoom(zoom - .5);
    } else if (['l', 'L', 'д', 'Д'].includes(event.key)) {
      event.preventDefault(); loupeButton.click();
    }
  });
})();
