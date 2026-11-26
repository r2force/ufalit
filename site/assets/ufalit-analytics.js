/* Shared goals; local previews do not initialize Metrika. */
(() => {
  const goal = (name, params = {}) => {
    if (typeof window.ym === 'function') window.ym(110934501, 'reachGoal', name, params);
  };
  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    if (link.closest('.nav')) goal('section_open');
    else if (link.matches('.atlas-more') || link.closest('.atlas-text-places')) goal('place_detail_open');
    else if (link.hash?.startsWith('#person-')) goal('biography_open');
    else if (link.closest('.library-work')) goal('work_open');
    else if (link.matches('.photo-stage, [data-image-viewer]') || link.closest('.material-figure, .material-inline, .legend-figure')) goal('photo_open');
  });
  document.addEventListener('play', event => {
    if (event.target.matches('video')) goal('video_play');
    else if (event.target.matches('audio')) goal('audio_play');
  }, true);
  document.addEventListener('ufalit:map-select', () => goal('map_place_open'));
})();
