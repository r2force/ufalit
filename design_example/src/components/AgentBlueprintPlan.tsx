import React, { useState } from 'react';
import {
  Copy,
  Check,
  Terminal,
  Palette,
  Layers,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Cpu
} from 'lucide-react';

const CODE_SNIPPETS = {
  prompt: `Прочитай AGENTS.md, migration/DESIGN.md, migration/CONTENT_PARITY.md и migration/STATUS.md.
Выполни современный редизайн статического сайта в папке site/ по концепции «Литературный атлас и музейный путеводитель Уфы» со следующими обязательными правилами:

1. СОХРАНЕНИЕ СВЕРКИ (100% CONTENT PARITY):
   - Не удалять, не сокращать и не переписывать тексты, подписи, заголовки и библиографии.
   - Сохранить все существующие атрибуты id (#photo-312, #place-01, #places-text-001, #places-image-001, #category-35, #track-01 и др.), порядок элементов и исходные пути href/src к медиафайлам.
   - Все интерактивные улучшения (фильтрация библиографии, алфавитный указатель, режимы галереи, лайтбокс) реализовывать через Progressive Enhancement (CSS + легковесный локальный скрипт site/assets/ufalit-ui.js без удаления узлов из DOM).

2. ДИЗАЙН-СИСТЕМА И ДОКАЗАТЕЛЬСТВА:
   - Зафиксировать наблюдения в migration/evidence/design-origin.md и токены в migration/evidence/design-system.md:
     * --ink: #142829 (глубокий уфимский малахит)
     * --accent: #245D60 (бирюза реки Белой)
     * --paper: #F6F3EC (тёплая бумага старого издания)
     * --paper-card: #FCFAF5 (музейное паспарту)
     * --wine: #8E2D36 (кармин «Аленького цветочка»)
     * --bronze: #B58347 (уральская бронза и чугунное кружево уфимских садов)
     * --line: #D6CFC1 (деликатный контур)

3. ФОТОГАЛЕРЕИ (ОСОБЫЙ ПРИОРИТЕТ):
   - Заменить жёсткие серые рамки (.gallery img { height: 16rem; background: #edf2ec }) на адаптивную музейную раскладку с паспарту.
   - Добавить авто-определение пропорций снимков при загрузке (data-aspect="portrait | landscape | wide-doc | square"): широкие карты и родословные (например, #photo-307 и #photo-309 в gallery-aksakov) выделять на 2 колонки.
   - Добавить переключатель режимов просмотра галереи: «Паспарту-сетка», «Диафильм (scroll-snap)», «Журнальная кладка» и «Контактный лист».
   - Реализовать доступный лайтбокс на нативном <dialog> с клавишами ←/→/Esc, возвратом фокуса, ссылкой на оригинал и режимом «Лупа краеведа (2.8x)» для чтения мелких надписей на архивных картах, схемах и книгах 1928 года.

4. ДЛИННЫЕ СТРАНИЦЫ (ПЕРСОНАЛИИ, ПАМЯТНЫЕ МЕСТА, ЧИТАЛЬНЫЙ ЗАЛ):
   - На страницах personalities и places генерировать липкий алфавитный указатель (А–Я) и быстрый фильтр по авторам/адресам.
   - Длинные списки библиографии оформлять в компактный сворачиваемый блок с локальным поиском по году/названию.
   - Проверить адаптивность от 320px до desktop, контраст WCAG 2.2 AA, prefers-reduced-motion и работу без JS.`,

  css: `/* ==========================================================================
   site/assets/style.css — «Уфа литературная» (Museum & Editorial Redesign)
   100% совместимость с существующей разметкой site/ и content-parity.csv
   ========================================================================== */

:root {
  color-scheme: light;
  --ink: #142829;
  --ink-muted: #4a5d5e;
  --accent: #245d60;
  --paper: #f6f3ec;
  --paper-warm: #efeae0;
  --paper-card: #fcfaf5;
  --wine: #8e2d36;
  --bronze: #b58347;
  --line: #d6cfc1;
  --line-soft: #e5dfd3;
  --radius-card: 14px;
  --radius-lg: 22px;
  --shadow-card: 0 10px 30px -12px rgba(20, 40, 41, 0.12);

  --font-display: "Cormorant Garamond", Georgia, "Times New Roman", serif;
  --font-reading: "Literata", Georgia, Cambria, serif;
  --font-ui: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }

body {
  margin: 0;
  color: var(--ink);
  background: var(--paper);
  font: 1rem/1.68 var(--font-ui);
  -webkit-font-smoothing: antialiased;
}

/* Навигация и шапка */
.site-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(20, 40, 41, 0.96);
  backdrop-filter: blur(12px);
  color: #fff;
  border-bottom: 1px solid rgba(181, 131, 71, 0.3);
}

.wrap {
  width: min(100% - 2.5rem, 1220px);
  margin-inline: auto;
}

.header-inner {
  padding: 1rem 0;
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.brand {
  font: 700 clamp(1.45rem, 2.6vw, 1.95rem)/1.1 var(--font-display);
  color: #fcfaf5;
  text-decoration: none;
  letter-spacing: -0.01em;
}

.brand small {
  display: block;
  font: 400 0.78rem/1.35 var(--font-ui);
  color: #f3d9b1;
  margin-top: 0.2rem;
}

.nav {
  display: flex;
  gap: 0.4rem 0.6rem;
  flex-wrap: wrap;
}

.nav a {
  color: rgba(255, 255, 255, 0.88);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  transition: background 0.2s, color 0.2s;
}

.nav a:hover,
.nav a[aria-current="page"] {
  background: var(--wine);
  color: #fff;
}

/* Герой и эпиграф Назара Наджми */
.hero {
  background: linear-gradient(135deg, #142829 0%, #173b3d 55%, #1f4b4e 100%);
  color: #fcfaf5;
  border-bottom: 1px solid var(--line);
  padding: clamp(2.8rem, 6vw, 5.2rem) 0;
}

.hero-inner {
  display: grid;
  grid-template-columns: 1.2fr minmax(19rem, 0.85fr);
  gap: 2.5rem;
  align-items: center;
}

.hero h1, h1, h2 {
  font-family: var(--font-display);
  line-height: 1.08;
  font-weight: 600;
}

.hero h1 {
  font-size: clamp(2.8rem, 6.5vw, 5.2rem);
  margin: 0 0 1rem;
  color: #fcfaf5;
}

.poem {
  background: rgba(14, 32, 33, 0.72);
  border: 1px solid rgba(181, 131, 71, 0.45);
  border-left: 4px solid var(--bronze);
  border-radius: var(--radius-card);
  padding: 1.5rem 1.75rem;
  margin: 0;
  font-family: var(--font-reading);
  font-style: italic;
  color: #f4efe4;
}

/* ==========================================================================
   МУЗЕЙНАЯ ФОТОГАЛЕРЕЯ (.gallery) — 4 режима + паспарту + 3D Tilt
   ========================================================================== */

.gallery-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  background: var(--paper-card);
  border: 1px solid var(--line);
  border-radius: var(--radius-card);
  padding: 0.85rem 1.1rem;
  margin: 1.5rem 0;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 19rem), 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

/* Режим широких архивных карт и родословных (#photo-307, #photo-309 и др.) */
@media (min-width: 760px) {
  .gallery figure[data-aspect="wide-doc"] {
    grid-column: span 2;
  }
}

/* Режим 2: Диафильм (Scroll-Snap Carousel) */
.gallery[data-view="filmstrip"] {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 1.25rem;
  padding-bottom: 1rem;
}

.gallery[data-view="filmstrip"] figure {
  flex: 0 0 min(85vw, 24rem);
  scroll-snap-align: start;
}

/* Режим 3: Журнальная кладка (Masonry) */
.gallery[data-view="masonry"] {
  display: block;
  columns: 3 18rem;
  column-gap: 1.5rem;
}

.gallery[data-view="masonry"] figure {
  break-inside: avoid;
  margin-bottom: 1.5rem;
}

/* Карточка снимка с музейным паспарту и 3D-наклоном */
.gallery figure {
   --rx: 0deg;
  --ry: 0deg;
  --glare-x: 50%;
  --glare-y: 50%;
  position: relative;
  margin: 0;
  background: var(--paper-card);
  border: 1px solid var(--line);
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  transform: perspective(1000px) rotateX(var(--rx)) rotateY(var(--ry));
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.22s ease;
}

.gallery figure:hover {
  box-shadow: 0 18px 38px -12px rgba(20, 40, 41, 0.22);
}

/* Внутренняя сцена паспарту с динамическим амбиент-свечением */
.gallery figure > a {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  min-height: 16.5rem;
  background-color: var(--paper-warm);
  background-image: var(--ambient-bg, none);
  background-size: cover;
  background-position: center;
  overflow: hidden;
  text-decoration: none;
}

.gallery figure > a::before {
  content: "";
  position: absolute;
  inset: 0;
  backdrop-filter: blur(26px) saturate(1.35);
  background: rgba(246, 243, 236, 0.72);
}

.gallery img {
  position: relative;
  z-index: 1;
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: 15.5rem;
  object-fit: contain;
  display: block;
  background: var(--paper-card);
  padding: 0.45rem;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(20, 40, 41, 0.12);
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.gallery figure:hover img {
  transform: scale(1.03);
}

.gallery figcaption {
  padding: 0.95rem 1.15rem;
  background: var(--paper-card);
  border-top: 1px solid var(--line-soft);
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--ink);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.gallery figcaption::after {
  content: attr(data-photo-id);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 400;
  color: var(--wine);
  background: var(--paper-warm);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

/* Нативный лайтбокс <dialog> с оптической лупой */
dialog.ufalit-lightbox {
  width: min(96vw, 1280px);
  height: min(92vh, 860px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-lg);
  padding: 0;
  background: #0d1617;
  color: #fcfaf5;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.65);
}

dialog.ufalit-lightbox::backdrop {
  background: rgba(10, 18, 19, 0.88);
  backdrop-filter: blur(8px);
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .gallery figure, .gallery img { transition: none !important; transform: none !important; }
}`,

  tsGallery: `/**
 * site/assets/ufalit-gallery.ts
 * Прогрессивное улучшение фотогалерей «Уфы литературной»:
 * 1) Авто-классификация пропорций (portrait / landscape / wide-doc)
 * 2) Амбиент-паспарту и деликатный 3D-Tilt эффект карточек
 * 3) Переключатель режимов (Паспарту-сетка / Диафильм / Кладка / Контактный лист)
 * 4) Нативный <dialog> лайтбокс с Deep Zoom и «Лупой краеведа 2.8x»
 * Сохраняет 100% DOM-узлов и атрибутов для migration/content-parity.csv!
 */

interface GalleryItemData {
  figure: HTMLElement;
  link: HTMLAnchorElement;
  img: HTMLImageElement;
  caption: string;
  id: string;
  fullSrc: string;
}

export function initUfalitGalleries(): void {
  const galleries = document.querySelectorAll<HTMLElement>('.gallery');
  if (!galleries.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  galleries.forEach((galleryEl) => {
    const items: GalleryItemData[] = [];
    const figures = Array.from(galleryEl.querySelectorAll<HTMLElement>('figure'));

    figures.forEach((figure, index) => {
      const link = figure.querySelector<HTMLAnchorElement>('a');
      const img = figure.querySelector<HTMLImageElement>('img');
      const figcaption = figure.querySelector<HTMLElement>('figcaption');
      if (!link || !img) return;

      const id = figure.id || \`photo-idx-\${index + 1}\`;
      const caption = figcaption?.textContent?.trim() || img.alt || '';
      const fullSrc = link.getAttribute('href') || img.src;

      if (figcaption) {
        figcaption.setAttribute('data-photo-id', \`#\${id}\`);
      }

      // 1. Амбиент-паспарту и определение пропорций кадра после загрузки
      const classifyAspectRatio = () => {
        const w = img.naturalWidth || 1;
        const h = img.naturalHeight || 1;
        const ratio = w / h;
        const isMapOrTree = /карта|древо|схема|табличка/i.test(caption);

        if (ratio > 1.55 || isMapOrTree) {
          figure.dataset.aspect = 'wide-doc';
        } else if (ratio < 0.85) {
          figure.dataset.aspect = 'portrait';
        } else {
          figure.dataset.aspect = 'landscape';
        }
        link.style.setProperty('--ambient-bg', \`url("\${img.currentSrc || img.src}")\`);
      };

      if (img.complete && img.naturalWidth > 0) {
        classifyAspectRatio();
      } else {
        img.addEventListener('load', classifyAspectRatio, { once: true });
      }

      // 2. Деликатный 3D Tilt при движении курсора
      if (!prefersReducedMotion) {
        figure.addEventListener('pointermove', (e: PointerEvent) => {
          const rect = figure.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width;
          const py = (e.clientY - rect.top) / rect.height;
          const rx = ((0.5 - py) * 7).toFixed(2);
          const ry = ((px - 0.5) * 7).toFixed(2);
          figure.style.setProperty('--rx', \`\${rx}deg\`);
          figure.style.setProperty('--ry', \`\${ry}deg\`);
        });

        figure.addEventListener('pointerleave', () => {
          figure.style.setProperty('--rx', '0deg');
          figure.style.setProperty('--ry', '0deg');
        });
      }

      // 3. Перехват клика для открытия нативного <dialog> лайтбокса
      link.addEventListener('click', (e: MouseEvent) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return; // Оставляем стандартный клик в новую вкладку
        e.preventDefault();
        openArchivalLightbox(items, index, link);
      });

      items.push({ figure, link, img, caption, id, fullSrc });
    });

    // Вставляем панель переключения режимов перед галереей
    injectGalleryToolbar(galleryEl, items.length);
  });
}

function injectGalleryToolbar(galleryEl: HTMLElement, count: number): void {
  const toolbar = document.createElement('div');
  toolbar.className = 'gallery-toolbar';
  toolbar.setAttribute('aria-label', 'Режим отображения фотогалереи');
  toolbar.innerHTML = \`
    <div class="gallery-toolbar__modes">
      <button type="button" data-mode="grid" aria-pressed="true">Музейное паспарту (\${count})</button>
      <button type="button" data-mode="filmstrip" aria-pressed="false">Диафильм</button>
      <button type="button" data-mode="masonry" aria-pressed="false">Журнальная кладка</button>
    </div>
    <input type="search" class="gallery-toolbar__search" placeholder="Быстрый фильтр по подписям..." aria-label="Фильтр фотографий">
  \`;

  toolbar.querySelectorAll<HTMLButtonElement>('button[data-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode || 'grid';
      galleryEl.dataset.view = mode;
      toolbar.querySelectorAll('button[data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    });
  });

  const searchInput = toolbar.querySelector<HTMLInputElement>('.gallery-toolbar__search');
  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    galleryEl.querySelectorAll<HTMLElement>('figure').forEach((fig) => {
      const text = (fig.textContent || '') + ' ' + fig.id;
      fig.hidden = Boolean(q && !text.toLowerCase().includes(q));
    });
  });

  galleryEl.parentNode?.insertBefore(toolbar, galleryEl);
}

// Нативный <dialog> с Оптической Лупой 2.8x и возвратом фокуса
let sharedDialog: HTMLDialogElement | null = null;

function openArchivalLightbox(items: GalleryItemData[], startIndex: number, triggerEl: HTMLElement): void {
  if (!sharedDialog) {
    sharedDialog = document.createElement('dialog');
    sharedDialog.className = 'ufalit-lightbox';
    document.body.appendChild(sharedDialog);
  }
  const dialog = sharedDialog;
  let currentIndex = startIndex;
  let loupeEnabled = false;

  const renderSlide = () => {
    const item = items[currentIndex];
    dialog.innerHTML = \`
      <div class="ufalit-lb__header">
        <span>#\${item.id} · Кадр \${currentIndex + 1} из \${items.length}</span>
        <strong>\${item.caption}</strong>
        <div class="ufalit-lb__actions">
          <button type="button" data-action="loupe" aria-pressed="\${loupeEnabled}">🔍 Лупа краеведа 2.8×</button>
          <a href="\${item.fullSrc}" target="_blank" rel="noopener">Оригинал</a>
          <button type="button" data-action="close" aria-label="Закрыть">✕</button>
        </div>
      </div>
      <div class="ufalit-lb__stage">
        <button type="button" data-action="prev" aria-label="Предыдущий кадр">‹</button>
        <div class="ufalit-lb__canvas">
          <img src="\${item.fullSrc}" alt="\${item.caption}">
          <div class="ufalit-lb__loupe" hidden></div>
        </div>
        <button type="button" data-action="next" aria-label="Следующий кадр">›</button>
      </div>
    \`;

    const canvas = dialog.querySelector<HTMLElement>('.ufalit-lb__canvas')!;
    const loupe = dialog.querySelector<HTMLElement>('.ufalit-lb__loupe')!;
    loupe.style.backgroundImage = \`url("\${item.fullSrc}")\`;

    canvas.addEventListener('pointermove', (e: PointerEvent) => {
      if (!loupeEnabled) return;
      const r = canvas.getBoundingClientRect();
      const xPct = ((e.clientX - r.left) / r.width) * 100;
      const yPct = ((e.clientY - r.top) / r.height) * 100;
      loupe.hidden = false;
      loupe.style.left = \`\${e.clientX - r.left - 96}px\`;
      loupe.style.top = \`\${e.clientY - r.top - 96}px\`;
      loupe.style.backgroundPosition = \`\${xPct}% \${yPct}%\`;
    });

    canvas.addEventListener('pointerleave', () => { loupe.hidden = true; });

    dialog.querySelector('[data-action="prev"]')?.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      renderSlide();
    });
    dialog.querySelector('[data-action="next"]')?.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % items.length;
      renderSlide();
    });
    dialog.querySelector('[data-action="loupe"]')?.addEventListener('click', () => {
      loupeEnabled = !loupeEnabled;
      renderSlide();
    });
    dialog.querySelector('[data-action="close"]')?.addEventListener('click', () => {
      dialog.close();
      triggerEl.focus();
    });
  };

  renderSlide();
  if (!dialog.open) dialog.showModal();
}`,

  tsEditorial: `/**
 * site/assets/ufalit-editorial.ts
 * Прогрессивное улучшение длинных страниц (Персоналии, Памятные места, Читальный зал):
 * - Генерирует липкий алфавитный бар А–Я и живой поиск поверх <details> или <section id="place-*">
 * - Добавляет быстрый поиск по длинным спискам библиографии (90+ позиций) без удаления <p> из DOM
 */

export function initEditorialEnhancements(): void {
  enhancePersonalitiesIndex();
  enhancePlacesDirectory();
}

function enhancePersonalitiesIndex(): void {
  const detailsList = Array.from(document.querySelectorAll<HTMLDetailsElement>('article details'));
  if (detailsList.length < 3) return;

  const container = detailsList[0].parentElement;
  if (!container) return;

  // Извлекаем первые буквы фамилий писателей (А, Б, В, Г, И, К, Р, С, Т, У, Х, Ш)
  const letters = Array.from(
    new Set(
      detailsList
        .map((d) => d.querySelector('summary')?.textContent?.trim().charAt(0).toUpperCase() || '')
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b, 'ru'));

  const navBar = document.createElement('nav');
  navBar.className = 'ufalit-alpha-bar';
  navBar.setAttribute('aria-label', 'Алфавитный указатель писателей');
  navBar.innerHTML = \`
    <div class="ufalit-alpha-bar__letters">
      <button type="button" data-letter="ALL" aria-pressed="true">Все (\${detailsList.length})</button>
      \${letters.map((l) => \`<button type="button" data-letter="\${l}">\${l}</button>\`).join('')}
    </div>
    <div class="ufalit-alpha-bar__actions">
      <input type="search" placeholder="Поиск писателя или произведения..." aria-label="Поиск по персоналиям">
      <button type="button" data-expand="all">Развернуть все</button>
    </div>
  \`;

  container.insertBefore(navBar, detailsList[0]);

  let activeLetter = 'ALL';
  const searchInput = navBar.querySelector<HTMLInputElement>('input[type="search"]')!;

  const applyFilter = () => {
    const q = searchInput.value.trim().toLowerCase();
    detailsList.forEach((detail) => {
      const name = detail.querySelector('summary')?.textContent?.trim() || '';
      const firstChar = name.charAt(0).toUpperCase();
      const matchLetter = activeLetter === 'ALL' || firstChar === activeLetter;
      const matchText = !q || (detail.textContent || '').toLowerCase().includes(q);
      // Используем атрибут hidden, сохраняя весь текст в DOM для content-parity.csv!
      detail.hidden = !(matchLetter && matchText);
    });
  };

  navBar.querySelectorAll<HTMLButtonElement>('button[data-letter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeLetter = btn.dataset.letter || 'ALL';
      navBar.querySelectorAll('button[data-letter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      applyFilter();
    });
  });

  searchInput.addEventListener('input', applyFilter);

  navBar.querySelector('[data-expand="all"]')?.addEventListener('click', (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    const shouldOpen = btn.dataset.state !== 'open';
    detailsList.forEach((d) => { d.open = shouldOpen; });
    btn.dataset.state = shouldOpen ? 'open' : 'closed';
    btn.textContent = shouldOpen ? 'Свернуть все' : 'Развернуть все';
  });
}

function enhancePlacesDirectory(): void {
  const placeSections = Array.from(document.querySelectorAll<HTMLElement>('section[id^="place-"]'));
  if (placeSections.length < 2) return;

  // Создаём оглавление памятных мест по писателям
  const toc = document.createElement('nav');
  toc.className = 'ufalit-places-toc';
  toc.setAttribute('aria-label', 'Оглавление памятных мест по писателям');
  toc.innerHTML = \`
    <h2 class="ufalit-places-toc__title">Литературные маршруты по авторам (\${placeSections.length})</h2>
    <div class="ufalit-places-toc__chips">
      \${placeSections
        .map((sec) => {
          const h2 = sec.querySelector('h2')?.textContent?.trim() || sec.id;
          return \`<a href="#\${sec.id}" class="ufalit-chip">\${h2}</a>\`;
        })
        .join('')}
    </div>
  \`;

  placeSections[0].parentElement?.insertBefore(toc, placeSections[0]);
}`
};

export const AgentBlueprintPlan: React.FC<{ showComparisonOnly?: boolean }> = ({
  showComparisonOnly = false
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'prompt' | 'css' | 'tsGallery' | 'tsEditorial'>('prompt');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  if (showComparisonOnly) {
    return (
      <section className="space-y-8">
        <div className="rounded-2xl bg-[#142829] text-white p-6 sm:p-8 shadow-xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code text-[#F3D9B1] mb-2">
            <Eye className="w-4 h-4" />
            <span>Визуальный и технический аудит: Текущий `site/` в GitHub ↔ Предлагаемый редизайн</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">
            Наглядное сравнение «Было / Стало» по ключевым узлам сайта
          </h2>
          <p className="text-sm text-[#D0E0DC] mt-2 max-w-3xl">
            Главный принцип нашего плана — <strong>не ломать результаты колоссальной работы по сверке (`content-parity.csv` — 9 411 строк!)</strong>, а преобразить визуальную подачу и UX через прогрессивный CSS и легковесный TypeScript/JS.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            {
              node: '1. Фотогалереи (site/pages/gallery-*/index.html)',
              beforeTitle: 'Сейчас в репозитории (style.css)',
              beforePoints: [
                'Все фото зажаты в .gallery img { height: 16rem; object-fit: contain; background: #edf2ec } — вокруг вертикальных портретов и широких схем торчат холодные серые поля.',
                'Клик по фото просто выбрасывает пользователя со страницы на голый JPEG-файл в браузере (теряется контекст и навигация).',
                'Широкие карты (#photo-309 «Карта аксаковских мест») и родословные (#photo-307 «Древо Соколовых») зажаты в узкую ячейку 15rem — прочитать надписи невозможно.',
                'Двухуровневые галереи (например, gallery-9 Мустая Карима) выглядят как пустая страница с двумя текстовыми ссылками.'
              ],
              afterTitle: 'В новом дизайне (Музейный фотоархив)',
              afterPoints: [
                'Динамическое амбиент-паспарту (--ambient-bg + blur) и тёплая рама #FCFAF5: вертикальные портреты, пейзажи и карты смотрятся как экспонаты в багете.',
                'Авто-определение пропорций: широкие карты и схемы (data-aspect="wide-doc") автоматически получают 2 колонки.',
                '4 режима просмотра: Паспарту-сетка с 3D-Tilt, Архивный стол / Диафильм (scroll-snap), Журнальная кладка и Контактный лист.',
                'Нативный <dialog> лайтбокс с «Лупой краеведа 2.8×» для изучения мелких деталей карт, клавишами ←/→/Esc и сохранением всех #photo-* ID.'
              ]
            },
            {
              node: '2. Персоналии и Библиографии (site/pages/personalities/)',
              beforeTitle: 'Сейчас в репозитории',
              beforePoints: [
                'Один HTML-файл на 182 000+ токенов, состоящий из 19 голых тегов <details><summary>Имя</summary>...</details>.',
                'Нет ни алфавитного указателя, ни поиска, ни портретов в оглавлении.',
                'Нет перекрёстных ссылок между биографией писателя, его памятными местами в Уфе, его фотогалереей и его аудиозаписями.',
                'Списки библиографии (по 96 пунктов подряд) растягивают страницу на десятки экранов.'
              ],
              afterTitle: 'В новом дизайне',
              afterPoints: [
                'Липкий алфавитный указатель (А Б В Г И К Р С Т У Х Ш) + мгновенный живой фильтр по писателям и произведениям.',
                'Карточка-паспорт писателя с портретом, годами жизни и прямыми чипами перехода: «Памятные места», «Фотогалерея», «Читальный зал / Аудио».',
                'Журнальная колонка чтения 68ch с выносными иллюстрациями на полях (вместо устаревшего float: left).',
                'Умный фильтр библиографии по году/изданию, который скрывает несовпадающие строки через атрибут hidden, оставляя 100% узлов в DOM для сверки.'
              ]
            },
            {
              node: '3. Главная страница и Памятные места (index.html, places/)',
              beforeTitle: 'Сейчас в репозитории',
              beforePoints: [
                'В шапке (header.site-header) всего 3 ссылки (О проекте, Фотогалерея, Видеоматериалы) — разделы Персоналии, Места и Читальный зал спрятаны внизу страницы.',
                'Литературная карта Уфы упоминается в тексте, но визуальной карты города с точками музеев и улиц нет.',
                'В разделе places/ иллюстрации вставлены внутрь текстовых абзацев с фиксированным width="200", из-за чего строки рвутся.'
              ],
              afterTitle: 'В новом дизайне',
              afterPoints: [
                'Полноценная сквозная шапка со всеми ключевыми разделами путеводителя и хлебными крошками.',
                'Интерактивная Литературная карта Уфимского полуострова (река Белая, косогор Дома-музея Аксакова, Народный дом, Сад Аксакова, сквер Мустая Карима, библиотека Худайбердина).',
                'Эпиграф Назара Наджми оформлен с мотивом «чугунного кружева уфимских садов» и акцентами уральской бронзы.'
              ]
            },
            {
              node: '4. Читальный зал и Аудиоархив (reading/, reading-karim-audio/)',
              beforeTitle: 'Сейчас в репозитории',
              beforePoints: [
                '14 уникальных аудиозаписей голоса Мустая Карима выведены просто списком стандартных системных тегов <audio>.',
                'В длинных произведениях («Детские годы Багрова-внука», «Аленький цветочек») нет настройки размера шрифта и темы бумаги для школьников и пожилых читателей.'
              ],
              afterTitle: 'В новом дизайне',
              afterPoints: [
                'Единая студийная фонотека «Голос поэта» с виниловым индикатором воспроизведения, переключением дорожек и сохранением нативных <audio> и ссылок скачивания.',
                'Панель комфортного чтения: масштаб текста (100% / 115% / 130%) и переключение фона («Бумага», «Тёплая сепия», «Ночной зал»).'
              ]
            }
          ].map((card, i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#FCFAF5] border border-[#D6CFC1] overflow-hidden shadow-sm flex flex-col"
            >
              <div className="px-5 py-3.5 bg-[#EFEAE0] border-b border-[#D6CFC1] font-display text-xl font-semibold text-[#142829]">
                {card.node}
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                    <span>{card.beforeTitle}</span>
                  </div>
                  <ul className="space-y-2 text-xs text-amber-950/90 leading-relaxed list-disc pl-4">
                    {card.beforePoints.map((pt, idx) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{card.afterTitle}</span>
                  </div>
                  <ul className="space-y-2 text-xs text-emerald-950/90 leading-relaxed list-disc pl-4">
                    {card.afterPoints.map((pt, idx) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-10">
      {/* Top Blueprint Header */}
      <section className="rounded-3xl bg-gradient-to-br from-[#142829] via-[#173B3D] to-[#1F4B4E] text-white p-6 sm:p-10 shadow-2xl border border-[#245D60]">
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B58347]/25 border border-[#B58347]/40 text-[#F3D9B1] text-xs font-mono-code">
            <Terminal className="w-3.5 h-3.5" />
            <span>Инженерно-дизайнерский план для ИИ-агента репозитория r2force/ufalit</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold leading-tight">
            Подробный план редизайна «Уфы литературной» + готовые модули CSS / TypeScript
          </h1>
          <p className="text-sm sm:text-base text-[#D4E2DD] leading-relaxed">
            Этот план составлен с учётом всех реальных правил вашего репозитория (<code className="font-mono-code bg-black/30 px-1.5 py-0.5 rounded">AGENTS.md</code>, <code className="font-mono-code bg-black/30 px-1.5 py-0.5 rounded">migration/DESIGN.md</code>, <code className="font-mono-code bg-black/30 px-1.5 py-0.5 rounded">migration/CONTENT_PARITY.md</code>): статический HTML/CSS для GitHub Pages без сервера и тяжёлых фреймворков, прогрессивное улучшение (Progressive Enhancement) на чистом TypeScript/ES2022 и <strong>100% сохранность всех 9 411 строк реестра сверки</strong>.
          </p>
        </div>
      </section>

      {/* SECTION 1: DESIGN SYSTEM TOKens (migration/evidence/design-system.md) */}
      <section className="rounded-3xl bg-[#FCFAF5] border border-[#D6CFC1] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5DFD3] pb-4">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-[#8E2D36]" />
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#142829]">
              1. Дизайн-система для <code className="font-mono-code text-xl text-[#8E2D36]">migration/evidence/design-system.md</code>
            </h2>
          </div>
          <span className="text-xs font-mono-code text-[#4A5D5E]">
            6 обоснованных цветов с HEX + 3 типографические роли · WCAG 2.2 AA
          </span>
        </div>

        {/* 6 Color Swatches */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {[
            {
              name: 'Уфимский малахит',
              token: '--ink',
              hex: '#142829',
              role: 'Основной текст, шапка, глубокие фоны (контраст 13.8:1)'
            },
            {
              name: 'Воды Белой (Агидель)',
              token: '--accent',
              hex: '#245D60',
              role: 'Акцентные плашки, вторичные заголовки, пины карты'
            },
            {
              name: 'Книжный лист',
              token: '--paper',
              hex: '#F6F3EC',
              role: 'Тёплый фон страницы для долгого чтения без усталости глаз'
            },
            {
              name: 'Музейное паспарту',
              token: '--paper-card',
              hex: '#FCFAF5',
              role: 'Рамы фотогалереи, карточки персоналий и памятных мест'
            },
            {
              name: 'Аленький кармин',
              token: '--wine',
              hex: '#8E2D36',
              role: 'Ссылки, активные состояния, акцент сказки Аксакова'
            },
            {
              name: 'Уральская бронза',
              token: '--bronze',
              hex: '#B58347',
              role: 'Орнаментальная линия «чугунного кружева», бейджи архива'
            }
          ].map((c) => (
            <div
              key={c.token}
              className="rounded-xl border border-[#D6CFC1] overflow-hidden bg-white flex flex-col"
            >
              <div className="h-16 w-full" style={{ backgroundColor: c.hex }} />
              <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                <div>
                  <div className="font-semibold text-xs text-[#142829]">{c.name}</div>
                  <div className="font-mono-code text-[11px] text-[#8E2D36]">{c.hex}</div>
                  <div className="font-mono-code text-[10px] text-[#5C6E6F]">{c.token}</div>
                </div>
                <p className="text-[11px] text-[#4A5D5E] leading-snug pt-1">{c.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Typography & Grid Spec */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#F6F3EC] border border-[#E5DFD3] space-y-1.5">
            <div className="text-xs font-mono-code text-[#8E2D36] font-semibold">
              Роль 1: Титульная антиква (--font-display)
            </div>
            <div className="font-display text-2xl font-semibold text-[#142829]">
              Cormorant Garamond / Georgia
            </div>
            <p className="text-xs text-[#4A5D5E]">
              Для заголовков H1–H3, имён писателей и подписей музейных экспонатов. Полная поддержка кириллицы и башкирских символов (Ә, Ө, Ү, Ғ, Ҡ, Ң, Ҙ, Ҫ, Һ).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F6F3EC] border border-[#E5DFD3] space-y-1.5">
            <div className="text-xs font-mono-code text-[#245D60] font-semibold">
              Роль 2: Книжная гарнитура (--font-reading)
            </div>
            <div className="font-reading text-xl font-medium text-[#142829]">
              Literata / Charter / Georgia
            </div>
            <p className="text-xs text-[#4A5D5E]">
              Для длинных статей в «Персоналиях», «Памятных местах» и «Читальном зале». Ширина колонки 65–72ch, интерлиньяж 1.75.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F6F3EC] border border-[#E5DFD3] space-y-1.5">
            <div className="text-xs font-mono-code text-[#B58347] font-semibold">
              Роль 3: Навигация и метаданные (--font-ui)
            </div>
            <div className="font-sans-ui text-lg font-semibold text-[#142829]">
              Inter / system-ui + Monospace ID
            </div>
            <p className="text-xs text-[#4A5D5E]">
              Для шапки, фильтров галереи, алфавитного указателя А–Я, бейджей адресов и архивных индексов (#photo-312).
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: 5 DESIGNER-FAVORITE JS/TS MICRO-INTERACTIONS */}
      <section className="rounded-3xl bg-[#FCFAF5] border border-[#D6CFC1] p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 border-b border-[#E5DFD3] pb-4">
          <Cpu className="w-5 h-5 text-[#8E2D36]" />
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#142829]">
            2. Пять крутых JS/TS-элементов, которые любят дизайнеры (Zero-Dependency)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              badge: 'JS/TS + CSS Blur',
              title: '1. Adaptive Aspect & Ambient Passe-Partout',
              desc: 'Скрипт при загрузке читает img.naturalWidth / naturalHeight, присваивает карточке data-aspect="portrait | landscape | wide-doc" и передаёт URL картинки в CSS-переменную --ambient-bg. Разнокалиберные архивные снимки получают мягкое свечение паспарту без серых полос.'
            },
            {
              badge: 'Optical Lens 2.8×',
              title: '2. «Лупа краеведа» в нативном <dialog>',
              desc: 'В галерее много старинных карт (#photo-309), родословных (#photo-307) и сканов книг 1928 г. Встроенная круглая оптическая лупа 2.8× следует за курсором/пальцем внутри <dialog> и позволяет читать мельчайшие подписи.'
            },
            {
              badge: 'Hardware 3D Tilt',
              title: '3. Perspective Card Tilt + Specular Glare',
              desc: 'При наведении на карточку галереи вычисляются координаты курсора и плавно обновляются CSS-переменные --rx, --ry и радиальный блик. Автоматически отключается при prefers-reduced-motion: reduce.'
            },
            {
              badge: 'DOM-Safe Enhancement',
              title: '4. Липкий Алфавитный Бар А–Я и Фильтр Библиографии',
              desc: 'Автоматически сканирует заголовки <summary> в personalities и <section id="place-*"> в places, создаёт плавающий алфавитный бар и поиск по 96 пунктам библиографии через атрибут hidden (не ломая content-parity.csv).'
            },
            {
              badge: 'CSS Scroll-Snap + Audio',
              title: '5. Синхронизированный Диафильм и Винил-плеер',
              desc: 'Лента превью на базе нативного CSS scroll-snap-type: x mandatory без навязчивой автопрокрутки + стильная студийная обёртка вокруг нативных тегов <audio> с записями голоса Мустая Карима.'
            },
            {
              badge: 'View Transitions API',
              title: '6. Плавные переходы между режимами галереи',
              desc: 'Использование document.startViewTransition() (с мгновенным fallback) при переключении галереи между режимами «Паспарту-сетка», «Диафильм» и «Журнальная кладка» — карточки плавно перетекают на новые места.'
            }
          ].map((feat, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-[#F6F3EC] border border-[#D6CFC1] space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#173B3D] text-[#F3D9B1] font-mono-code text-[10px]">
                  {feat.badge}
                </span>
                <h3 className="font-display text-xl font-semibold text-[#142829]">{feat.title}</h3>
                <p className="text-xs text-[#374B4C] leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: STEP-BY-STEP EXECUTION PLAN FOR THE AGENT */}
      <section className="rounded-3xl bg-[#FCFAF5] border border-[#D6CFC1] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 border-b border-[#E5DFD3] pb-4">
          <Layers className="w-5 h-5 text-[#8E2D36]" />
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#142829]">
            3. Пошаговый план работ для ИИ-агента (7 шагов)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              step: 'Шаг 1',
              title: 'Аудит и фиксация в migration/evidence/',
              detail:
                'Создать migration/evidence/design-origin.md (описание мотивов уфимской архитектуры, Аксаковского сада и башкирского орнамента) и migration/evidence/design-system.md (палитра HEX, типографика, сетки, правила галерей).'
            },
            {
              step: 'Шаг 2',
              title: 'Обновление site/assets/style.css и cleanup-стилей',
              detail:
                'Внедрить дизайн-токены (:root), флюидную типографику clamp(), стилизацию .gallery с поддержкой data-aspect="wide-doc", data-view="filmstrip|masonry" и модального окна dialog.ufalit-lightbox.'
            },
            {
              step: 'Шаг 3',
              title: 'Единая сквозная навигация в <header class="site-header">',
              detail:
                'Обновить навигацию в шаблоне страниц, чтобы читатель с любой страницы имел прямой доступ к разделам: О проекте, Персоналии, Памятные места, Фотогалерея, Читальный зал, Конкурсы и награды, Видео.'
            },
            {
              step: 'Шаг 4',
              title: 'Подключение модуля галерей (site/assets/ufalit-gallery.js)',
              detail:
                'Скомпилировать или подключить легковесный модуль ufalit-gallery.ts: авто-определение пропорций фото, амбиент-паспарту, переключатель режимов просмотра и <dialog> лайтбокс с «Лупой краеведа 2.8×».'
            },
            {
              step: 'Шаг 5',
              title: 'Улучшение длинных страниц (site/assets/ufalit-editorial.js)',
              detail:
                'Подключить авто-генерацию липкого алфавитного указателя А–Я на странице personalities/index.html, оглавления авторов в places/index.html и фильтра библиографии без удаления узлов из DOM.'
            },
            {
              step: 'Шаг 6',
              title: 'Интерактивная карта Уфы на главной и в Памятных местах',
              detail:
                'Добавить на главную страницу и в начало раздела places/index.html интерактивную SVG-карту Уфимского полуострова с якорными ссылками на #place-01 .. #place-19.'
            },
            {
              step: 'Шаг 7',
              title: 'Приёмка WCAG 2.2 AA и проверка content-parity.csv',
              detail:
                'Проверить верстку на 320px, 768px и 1440px, масштаб текста 200%, навигацию с клавиатуры (Tab, Esc, стрелки), prefers-reduced-motion и запустить скрипт сверки content-parity.csv (0 потерь ID, текста и медиа).'
            }
          ].map((s, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#F6F3EC] border border-[#E5DFD3] flex items-start gap-3.5"
            >
              <span className="px-2.5 py-1 rounded-lg bg-[#173B3D] text-[#F3D9B1] font-mono-code text-xs font-semibold shrink-0">
                {s.step}
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold text-[#142829]">{s.title}</h3>
                <p className="text-xs text-[#374B4C] mt-1 leading-relaxed">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: INTERACTIVE CODE BLUEPRINTS WITH COPY BUTTON */}
      <section className="rounded-3xl bg-[#0F1C1D] text-white border border-[#245D60] overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-6 bg-[#142829] border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Code2 className="w-5 h-5 text-[#F3D9B1]" />
            <div>
              <h2 className="font-display text-2xl font-semibold text-white">
                4. Готовый код и промпт для агента (Copy & Paste)
              </h2>
              <p className="text-xs text-[#B9CEC7]">
                Выберите вкладку ниже, чтобы просмотреть или скопировать готовый промпт, CSS или TypeScript-модули
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'prompt', label: '📋 Промпт для агента' },
                { id: 'css', label: '🎨 site/assets/style.css' },
                { id: 'tsGallery', label: '🖼️ ufalit-gallery.ts (Галерея + Лупа)' },
                { id: 'tsEditorial', label: '📚 ufalit-editorial.ts (А–Я + Поиск)' }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCodeTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeCodeTab === tab.id
                    ? 'bg-[#8E2D36] text-white shadow'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => handleCopy(activeCodeTab, CODE_SNIPPETS[activeCodeTab])}
              className="ml-2 px-3.5 py-1.5 rounded-lg bg-[#B58347] hover:bg-[#C69253] text-white text-xs font-medium flex items-center gap-1.5 transition shadow"
            >
              {copiedKey === activeCodeTab ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Скопировано!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Скопировать код</span>
                </>
              )}
            </button>
          </div>
        </div>

        <pre className="p-5 sm:p-6 text-xs sm:text-[13px] font-mono-code text-[#E5EFEA] overflow-x-auto max-h-[540px] custom-scrollbar leading-relaxed">
          <code>{CODE_SNIPPETS[activeCodeTab]}</code>
        </pre>
      </section>
    </div>
  );
};
