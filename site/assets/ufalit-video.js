/* Progressive enhancement: native video controls and MP4 links also work without JS. */
(() => {
  const archive = document.querySelector('[data-video-archive]');
  if (!archive) return;
  const records = [...archive.querySelectorAll('.archive-record')];
  const videos = records.map(record => record.querySelector('video'));

  records.forEach((record, index) => {
    const video = videos[index];
    const button = record.querySelector('[data-play-video]');
    const error = record.querySelector('.archive-play-error');
    const title = record.querySelector('h3').textContent;
    button.hidden = false;
    const updateButton = () => {
      const playing = !video.paused && !video.ended;
      button.lastChild.textContent = playing ? 'Пауза' : 'Смотреть';
      button.querySelector('path').setAttribute('d', playing ? 'M5 4h4v12H5zm7 0h4v12h-4Z' : 'm6 4 10 6-10 6Z');
      button.setAttribute('aria-label', `${playing ? 'Приостановить' : 'Смотреть'}: ${title}`);
      record.classList.toggle('is-playing', playing);
    };
    button.addEventListener('click', async () => {
      if (!video.paused) {
        video.pause();
        return;
      }
      error.hidden = true;
      try {
        await video.play();
      } catch {
        error.hidden = false;
        updateButton();
      }
    });
    video.addEventListener('play', () => {
      videos.forEach(other => { if (other !== video) other.pause(); });
      error.hidden = true;
      updateButton();
    });
    ['pause', 'ended'].forEach(event => video.addEventListener(event, updateButton));
    video.addEventListener('error', () => {
      error.hidden = false;
      updateButton();
    });
  });

  const search = archive.querySelector('.archive-search');
  const query = search.querySelector('input');
  const reset = search.querySelector('button');
  const status = archive.querySelector('.archive-results');
  const empty = archive.querySelector('.archive-empty');
  const normalize = text => text.toLocaleLowerCase('ru').replace(/ё/g, 'е').trim();
  const filter = () => {
    const value = normalize(query.value);
    let count = 0;
    records.forEach((record, index) => {
      const matches = normalize(record.querySelector('h3').textContent).includes(value);
      record.hidden = !matches;
      if (matches) count += 1;
      else videos[index].pause();
    });
    reset.hidden = !query.value;
    status.hidden = !value;
    status.textContent = value ? `Найдено записей: ${count} из ${records.length}` : '';
    empty.hidden = count > 0;
  };
  search.hidden = false;
  search.addEventListener('submit', event => event.preventDefault());
  query.addEventListener('input', filter);
  search.addEventListener('reset', () => {
    query.value = '';
    filter();
    query.focus();
  });
})();
