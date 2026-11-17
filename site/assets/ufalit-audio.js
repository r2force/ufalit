(() => {
  const list = document.querySelector(".audio-archive .audio-list");
  const items = Array.from(list?.querySelectorAll(".audio-item") ?? []);
  if (!items.length) return;

  const original = items.map((section) => ({
    section,
    heading: section.querySelector("h2"),
    audio: section.querySelector("audio"),
    download: section.querySelector("a"),
  }));
  if (original.some(({ heading, audio, download }) => !heading || !audio || !download)) return;

  const studio = document.createElement("div");
  studio.className = "audio-studio";
  studio.innerHTML = `
    <section class="audio-deck" aria-label="Аудиоплеер">
      <div class="audio-track-display">
        <div class="record" aria-hidden="true"><span></span></div>
        <div><p>Голос Мустая Карима</p><h2 class="audio-title" aria-live="polite"></h2></div>
      </div>
      <audio controls preload="none" aria-label="Текущая аудиозапись"></audio>
      <nav aria-label="Управление дорожками">
        <button class="museum-control" type="button">Предыдущая</button>
        <button class="museum-control" type="button">Следующая</button>
        <a download>Скачать аудиозапись</a>
      </nav>
      <p class="media-error" role="status" hidden>Запись не удалось воспроизвести. Попробуйте скачать её.</p>
    </section>
  `;
  const deck = studio.querySelector(".audio-deck");
  const player = deck.querySelector("audio");
  const title = deck.querySelector(".audio-title");
  const record = deck.querySelector(".record");
  const label = record.querySelector("span");
  const [previous, next] = deck.querySelectorAll("button");
  const download = deck.querySelector("a");
  const error = deck.querySelector(".media-error");
  let current = -1;

  function select(index, play) {
    const track = tracks[index];
    if (!track) return;
    if (index !== current) {
      tracks[current]?.button.removeAttribute("aria-current");
      track.button.setAttribute("aria-current", "true");
      current = index;
      player.pause();
      record.classList.remove("is-playing");
      title.textContent = track.name;
      label.textContent = track.section.id.replace("track-", "");
      download.href = track.download.getAttribute("href");
      player.src = track.audio.querySelector("source")?.getAttribute("src") ?? download.href;
      player.setAttribute("aria-label", track.name);
      previous.disabled = index === 0;
      next.disabled = index === tracks.length - 1;
    }
    error.hidden = true;
    if (play) {
      const requested = current;
      player.play().catch((failure) => {
        if (requested === current && failure.name !== "AbortError") error.hidden = false;
      });
    }
  }

  const tracks = original.map((track, index) => {
    const button = document.createElement("button");
    const name = track.heading.textContent.trim();
    button.type = "button";
    button.append(...track.heading.childNodes);
    track.heading.append(button);
    track.audio.hidden = true;
    track.download.hidden = true;
    button.addEventListener("click", () => select(index, true));
    return { ...track, button, name };
  });
  function fromHash() {
    select(Math.max(0, tracks.findIndex(({ section }) => "#" + section.id === location.hash)), false);
  }

  list.before(studio);
  studio.append(list);
  list.setAttribute("role", "region");
  list.setAttribute("aria-label", "Список аудиозаписей");
  previous.addEventListener("click", () => select(current - 1, !player.paused));
  next.addEventListener("click", () => select(current + 1, !player.paused));
  player.addEventListener("playing", () => record.classList.add("is-playing"));
  for (const event of ["pause", "ended", "waiting", "emptied", "error"]) {
    player.addEventListener(event, () => record.classList.remove("is-playing"));
  }
  player.addEventListener("error", () => { error.hidden = false; });
  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
