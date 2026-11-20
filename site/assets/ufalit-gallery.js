(() => {
  const gallery = document.querySelector(".gallery, [data-image-viewer]");
  if (!gallery) return;
  const frames = Array.from(gallery.querySelectorAll("figure"), (figure) => ({
    figure,
    link: figure.querySelector("a[href]"),
    image: figure.querySelector("img"),
    caption: figure.querySelector("figcaption"),
  })).filter(({ link, image }) => link && image);
  if (!frames.length) return;

  if (gallery.matches(".gallery")) {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const options = [
      ["grid", "Паспарту-сетка"],
      ["filmstrip", "Диафильм"],
      ["masonry", "Журнальная кладка"],
      ["contact", "Контактный лист"],
    ];

    const toolbar = document.createElement("div");
    toolbar.className = "gallery-toolbar";
    toolbar.innerHTML = `
      <div role="group" aria-label="Раскладка галереи"></div>
      <div role="group" aria-label="Прокрутка диафильма" hidden>
        <button class="museum-control" type="button" aria-label="Прокрутить к предыдущим фотографиям">←</button>
        <button class="museum-control" type="button" aria-label="Прокрутить к следующим фотографиям">→</button>
      </div>
    `;
    const [views, navigation] = toolbar.children;
    const viewButtons = options.map(([mode, label]) => {
      const button = document.createElement("button");
      button.className = "museum-control";
      button.type = "button";
      button.textContent = label;
      button.setAttribute("aria-pressed", mode === "grid");
      button.addEventListener("click", () => {
        if (button.getAttribute("aria-pressed") === "true") return;
        gallery.dataset.view = mode;
        navigation.hidden = mode !== "filmstrip";
        for (const option of viewButtons) option.setAttribute("aria-pressed", option === button);
      });
      views.append(button);
      return button;
    });
    navigation.querySelectorAll("button").forEach((button, index) => {
      button.addEventListener("click", () => {
        const distance = frames[0].figure.getBoundingClientRect().width + 12;
        gallery.scrollBy({ left: distance * (index ? 1 : -1), behavior: motion.matches ? "instant" : "smooth" });
      });
    });
    gallery.before(toolbar);
  }

  const dialog = document.createElement("dialog");
  if (typeof dialog.showModal !== "function") return;
  dialog.className = "ufalit-lightbox";
  dialog.setAttribute("aria-label", "Просмотр изображения");
  dialog.innerHTML = `
    <div class="lightbox-controls">
      <button class="museum-control" type="button" aria-label="Предыдущее изображение">←</button>
      <button class="museum-control" type="button" aria-label="Следующее изображение">→</button>
      <button class="museum-control" type="button" aria-pressed="false">Лупа 2,8×</button>
      <a target="_blank" rel="noopener">Открыть оригинал</a>
      <button class="museum-control" type="button" autofocus>Закрыть</button>
    </div>
    <div class="lightbox-stage" tabindex="0" aria-label="Изображение. В режиме лупы область прокручивается.">
      <img alt="">
    </div>
    <p class="lightbox-caption" aria-live="polite"></p>
  `;
  gallery.after(dialog);
  const [previous, next, zoom, close] = dialog.querySelectorAll("button");
  const original = dialog.querySelector("a");
  const stage = dialog.querySelector(".lightbox-stage");
  const enlarged = stage.querySelector("img");
  const caption = dialog.querySelector(".lightbox-caption");
  let active = 0;
  let opener;

  function setZoom(on) {
    const fittedWidth = enlarged.getBoundingClientRect().width;
    zoom.setAttribute("aria-pressed", on);
    stage.classList.toggle("is-zoomed", on);
    enlarged.style.width = on ? `${Math.round(fittedWidth * 2.8)}px` : "";
    if (!on) stage.scrollTo(0, 0);
  }

  function show(index) {
    active = (index + frames.length) % frames.length;
    const { link, image, caption: description } = frames[active];
    setZoom(false);
    zoom.disabled = true;
    enlarged.alt = image.alt;
    enlarged.src = original.href = link.href;
    caption.textContent = `${active + 1} / ${frames.length} · ${description?.textContent.trim() || image.alt}`;
    if (enlarged.complete && enlarged.naturalWidth) zoom.disabled = false;
  }

  frames.forEach(({ link }, index) => link.addEventListener("click", (event) => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    event.preventDefault();
    opener = link;
    show(index);
    dialog.showModal();
  }));
  enlarged.addEventListener("load", () => { zoom.disabled = false; });
  enlarged.addEventListener("error", () => { zoom.disabled = true; });
  previous.disabled = next.disabled = frames.length === 1;
  previous.addEventListener("click", () => show(active - 1));
  next.addEventListener("click", () => show(active + 1));
  zoom.addEventListener("click", () => setZoom(zoom.getAttribute("aria-pressed") !== "true"));
  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => opener?.focus());
  dialog.addEventListener("keydown", (event) => {
    if (event.target === stage && stage.classList.contains("is-zoomed")) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    show(active + (event.key === "ArrowLeft" ? -1 : 1));
  });
})();
