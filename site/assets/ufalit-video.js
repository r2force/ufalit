/* One native player; the recording links also work without JavaScript. */
(() => {
  const archive = document.querySelector('[data-video-archive]');
  if (!archive) return;
  const video = archive.querySelector('video');
  const title = archive.querySelector('#current-video-title');
  const download = archive.querySelector('.archive-download');
  const error = archive.querySelector('.archive-play-error');
  const fallback = error.querySelector('a');
  const choices = [...archive.querySelectorAll('.archive-video-choice')];
  if (!choices.length) return;
  let selection = 0;

  choices.forEach(choice => {
    choice.addEventListener('click', async event => {
      // Preserve opening the original MP4 in a separate tab with a modified click.
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const request = ++selection;
      const name = choice.dataset.videoTitle;
      const source = choice.getAttribute('href');
      if (video.getAttribute('src') !== source) {
        video.pause();
        video.src = source;
        video.poster = choice.dataset.videoPoster;
        video.load();
      }
      title.textContent = name;
      video.setAttribute('aria-label', name);
      download.href = source;
      download.setAttribute('aria-label', `Скачать видео: ${name}`);
      fallback.href = source;
      error.hidden = true;
      choices.forEach(item => {
        if (item === choice) item.setAttribute('aria-current', 'true');
        else item.removeAttribute('aria-current');
      });
      const player = archive.querySelector('.archive-player');
      const bounds = player.getBoundingClientRect();
      if (bounds.top < 0 || bounds.bottom > window.innerHeight) {
        player.focus({ preventScroll: true });
        player.scrollIntoView({
          block: 'start',
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        });
      }
      try {
        await video.play();
      } catch (failure) {
        // Switching recordings can cancel an earlier request without a media error.
        if (request === selection && failure.name !== 'AbortError') error.hidden = false;
      }
    });
  });
  video.addEventListener('error', () => { error.hidden = false; });
  video.addEventListener('playing', () => { error.hidden = true; });

  // Keep the desktop list as tall as the player, including wrapped titles.
  if ('ResizeObserver' in window) {
    const workspace = archive.querySelector('.archive-workspace');
    new ResizeObserver(([entry]) => {
      workspace.style.setProperty('--archive-player-height', `${entry.target.offsetHeight}px`);
    }).observe(archive.querySelector('.archive-player'));
  }
})();
