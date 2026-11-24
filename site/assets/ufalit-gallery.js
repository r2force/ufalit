(() => {
  const gallery = document.querySelector('.gallery, [data-image-viewer]');
  if (!gallery) return;
  const frames = Array.from(gallery.querySelectorAll('figure'), (figure) => ({
    figure,
    link: figure.querySelector('a[href]'),
    image: figure.querySelector('img'),
    caption: figure.querySelector('.photo-caption') || figure.querySelector('figcaption'),
    metadata: figure.querySelector('.photo-metadata'),
    note: figure.querySelector('.photo-note'),
    category: figure.dataset.category || 'Фотоархив',
  })).filter(({ link, image }) => link && image);
  if (!frames.length) return;
  const archive = gallery.hasAttribute('data-archive-gallery');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const behavior = () => motion.matches ? 'instant' : 'smooth';
  const normalize = (text) => text.toLocaleLowerCase('ru').replaceAll('ё', 'е').replace(/\s+/g, ' ').trim();
  let visible = [...frames];
  let mode = 'grid';
  let stageIndex = 0;
  let film;
  let updateFilm = () => {};

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
    return [frame.caption?.textContent.trim() || frame.image.alt, frame.note?.textContent.trim(), frame.metadata?.textContent.trim()].filter(Boolean).join(' · ');
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
    const navigation = document.querySelector('[data-collection-navigation]');
    if (writers && navigation) {
      navigation.hidden = false;
      for (const [selector, direction] of [['[data-collection-prev]', -1], ['[data-collection-next]', 1]]) {
        navigation.querySelector(selector).addEventListener('click', () => writers.scrollBy({ left: writers.clientWidth * direction, behavior: behavior() }));
      }
      // Scroll only this strip; keep the page and incoming #photo anchor in place.
      const selected = writers.querySelector('[aria-current]');
      if (selected) writers.scrollLeft = selected.offsetLeft - writers.firstElementChild.offsetLeft;
    }
    frames.forEach((frame, index) => {
      background(frame.link, frame.image.src);
      const number = document.createElement('span');
      number.className = 'photo-number';
      number.textContent = `№ ${String(index + 1).padStart(2, '0')}`;
      frame.figure.querySelector('.photo-identifier').prepend(number);
    });

    const icons = {
      grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
      filmstrip: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4"/>',
      masonry: '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M12 3v18M3 9h9M12 15h9"/>',
      contact: '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>',
    };
    const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">${icons[name]}</svg>`;
    const toolbar = document.createElement('section');
    toolbar.className = 'gallery-toolbar';
    toolbar.setAttribute('aria-label', 'Вид и фильтры фотографий');
    toolbar.innerHTML = `<div class="gallery-tools-top"><div class="gallery-views" role="group" aria-label="Вид отображения"></div><label class="gallery-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></svg><input type="search" aria-label="Поиск фотографий по подписи, месту или номеру" placeholder="Поиск по подписи, месту или #photo"></label></div><div class="gallery-tools-bottom"><div class="gallery-filters" role="group" aria-label="Категория фотографий"></div><p class="gallery-result" role="status" aria-live="polite"></p></div>`;
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
      if (!visible.length) return;
      stageIndex = (stageIndex + visible.length) % visible.length;
      const frame = visible[stageIndex];
      filmImage.src = frame.link.href;
      filmImage.alt = frame.image.alt;
      filmCount.textContent = `Кадр ${stageIndex + 1} из ${visible.length} · #${frame.figure.id}`;
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
      visible = frames.filter((frame) => {
        const found = (category === 'Все' || frame.category === category) && normalize(`${description(frame)} ${frame.figure.id}`).includes(query);
        frame.figure.hidden = !found;
        return found;
      });
      for (const button of filters.children) button.setAttribute('aria-pressed', button.textContent === category);
      result.textContent = `Показано: ${visible.length} из ${frames.length}`;
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
    let saved;
    try { saved = sessionStorage.getItem('ufalit-gallery-view'); } catch { /* Use the default layout. */ }
    setMode(layouts.some(([value]) => value === saved) ? saved : 'grid');
    filter();
    // Incoming photo anchors must stay visible in every layout, including the filmstrip.
    function followAnchor() {
      const index = visible.findIndex((frame) => `#${frame.figure.id}` === location.hash);
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
  dialog.innerHTML = `<div class="lightbox-controls"><div class="lightbox-heading"><h2></h2><div class="lightbox-counter" aria-live="polite"></div></div><div class="lightbox-actions"><button class="museum-control" type="button" data-loupe aria-pressed="false">Лупа 2,8×</button><button class="museum-control" type="button" data-zoom-out aria-label="Уменьшить">−</button><output data-zoom>100%</output><button class="museum-control" type="button" data-zoom-in aria-label="Увеличить">+</button><button class="museum-control" type="button" data-zoom-reset>Сброс</button><select aria-label="Оформление просмотра"><option value="dark">Тёмный зал</option><option value="mat">Паспарту</option><option value="ambient">Амбиент</option></select><a class="lightbox-original" target="_blank" rel="noopener">Оригинал ↗</a><button class="museum-control lightbox-close" type="button" autofocus aria-label="Закрыть просмотр">✕</button></div></div><div class="lightbox-center"><button class="museum-control lightbox-prev" type="button" aria-label="Предыдущее изображение">←</button><div class="lightbox-stage" tabindex="0" aria-label="Фотография. Увеличенное изображение можно прокручивать."><div class="lightbox-image-wrap"><img class="lightbox-image" alt=""><div class="photo-loupe" hidden aria-hidden="true"></div></div></div><button class="museum-control lightbox-next" type="button" aria-label="Следующее изображение">→</button></div><div class="lightbox-footer"><p class="lightbox-caption"></p><div class="lightbox-thumbnails" aria-label="Фотографии подборки"></div></div>`;
  gallery.after(dialog);
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
    enlarged.alt = frame.image.alt;
    enlarged.src = original.href = frame.link.href;
    title.textContent = frame.caption?.textContent.trim() || frame.image.alt;
    counter.textContent = `Кадр ${active + 1} из ${viewerFrames.length} · #${frame.figure.id}`;
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
  function openViewer(frame, trigger) {
    if (!frame) return;
    opener = trigger;
    viewerFrames = [...visible];
    thumbButtons.clear();
    thumbnails.replaceChildren();
    viewerFrames.forEach((item, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'lightbox-thumbnail';
      button.setAttribute('aria-label', `Кадр ${index + 1}: ${item.image.alt}`);
      const img = document.createElement('img');
      img.src = item.image.src;
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
  frames.forEach((frame) => frame.link.addEventListener('click', (event) => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    event.preventDefault();
    if (archive && mode === 'filmstrip') { stageIndex = visible.indexOf(frame); updateFilm(); }
    else openViewer(frame, frame.link);
  }));
  enlarged.addEventListener('load', measure);
  enlarged.addEventListener('error', () => { plus.disabled = true; caption.textContent = 'Не удалось загрузить фотографию. Попробуйте открыть оригинал.'; });
  window.addEventListener('resize', measure);
  previous.addEventListener('click', () => show(active - 1));
  next.addEventListener('click', () => show(active + 1));
  plus.addEventListener('click', () => setZoom(zoom + .5));
  minus.addEventListener('click', () => setZoom(zoom - .5));
  dialog.querySelector('[data-zoom-reset]').addEventListener('click', () => setZoom(1));
  dialog.querySelector('select').addEventListener('change', (event) => { dialog.dataset.theme = event.target.value; measure(); });
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));
  dialog.addEventListener('keydown', (event) => {
    if (event.target.matches('select, input, textarea')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      if (stage.contains(event.target) && zoom > 1) return;
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
