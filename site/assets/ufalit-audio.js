(() => {
  const studio = document.querySelector(".audio-studio");
  const list = studio?.querySelector(".audio-list");
  const deck = studio?.querySelector(".audio-deck");
  const items = Array.from(list?.querySelectorAll(".audio-item") ?? []);
  if (!deck || !items.length) return;

  const original = items.map((section) => ({
    section,
    heading: section.querySelector("h2"),
    audio: section.querySelector("audio"),
    download: section.querySelector("a"),
  }));
  if (original.some(({ heading, audio, download }) => !heading || !audio || !download)) return;

  const player = deck.querySelector("audio");
  const title = deck.querySelector(".audio-title");
  const label = deck.querySelector(".record span");
  const anchor = deck.querySelector(".audio-track-anchor");
  const download = deck.querySelector(".audio-download");
  const error = deck.querySelector(".media-error");
  let current = -1;

  function setPlaying(playing) {
    studio.classList.toggle("is-playing", playing);
    const track = tracks[current];
    if (track) track.button.setAttribute("aria-label", (playing ? "Приостановить: " : "Воспроизвести: ") + track.name);
  }

  function select(index) {
    if (index === current) return;
    const track = tracks[index];
    player.pause();
    setPlaying(false);
    tracks[current]?.button.removeAttribute("aria-current");
    current = index;
    track.button.setAttribute("aria-current", "true");

    title.textContent = track.name;
    label.textContent = track.section.id.replace("track-", "");
    anchor.href = "#" + track.section.id;
    anchor.textContent = anchor.hash;
    download.href = track.download.getAttribute("href");
    player.src = track.audio.querySelector("source")?.getAttribute("src") ?? download.href;
    player.setAttribute("aria-label", track.name);
    error.hidden = true;
  }

  function toggleTrack(index) {
    if (index === current && !player.paused) {
      player.pause();
      return;
    }
    select(index);
    error.hidden = true;
    player.play().catch((failure) => {
      if (index === current && failure.name !== "AbortError") error.hidden = false;
    });
  }

  const tracks = original.map((track, index) => {
    const button = document.createElement("button");
    const name = track.heading.textContent.trim();
    button.type = "button";
    button.title = name;
    button.setAttribute("aria-label", "Воспроизвести: " + name);
    button.innerHTML = `
      <span class="audio-card-icon">
        <svg class="audio-play-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M7 5.5a1 1 0 0 1 1.55-.83l11 6.5a1 1 0 0 1 0 1.66l-11 6.5A1 1 0 0 1 7 18.5z"/>
        </svg>
        <svg class="audio-pause-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M9 5v14m6-14v14"/>
        </svg>
      </span>
      <span class="audio-card-copy">
        <span class="audio-card-title"></span>
        <span class="audio-card-id" aria-hidden="true"></span>
      </span>
      <svg class="audio-card-check" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>
      </svg>
    `;
    button.querySelector(".audio-card-title").append(...track.heading.childNodes);
    button.querySelector(".audio-card-id").textContent = "#" + track.section.id;
    track.heading.append(button);
    track.audio.hidden = true;
    track.download.hidden = true;
    button.addEventListener("click", () => toggleTrack(index));
    return { ...track, button, name };
  });

  function fromHash() {
    const index = tracks.findIndex(({ section }) => "#" + section.id === location.hash);
    select(Math.max(0, index));
    if (index >= 0) tracks[index].section.scrollIntoView({ block: "nearest", behavior: "instant" });
  }

  studio.classList.add("is-enhanced");
  deck.hidden = false;
  list.setAttribute("role", "region");
  list.setAttribute("aria-label", "Список аудиозаписей");
  player.addEventListener("playing", () => setPlaying(true));
  for (const event of ["pause", "ended", "waiting", "emptied", "error"]) {
    player.addEventListener(event, () => setPlaying(false));
  }
  player.addEventListener("error", () => { error.hidden = false; });
  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
