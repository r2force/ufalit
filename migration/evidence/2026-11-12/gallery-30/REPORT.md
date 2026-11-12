# Галерея 30 — «УМПО»

- **Источник:** `https://ufalit.ufacsdb.ru/index.php?Itemid=88&id=30:2012-12-30-07-33-16&option=com_phocagallery&view=category`
- **Цель:** `site/pages/gallery-30/index.html`
- **Срез:** 12 ноября 2026 года (UTC); основной HTML получен в 08:32:25 UTC, оригиналы — 09:00 UTC.
- **Изменённые пути:** `site/pages/gallery-30/index.html`; `site/assets/gallery/30/{466,467,468,469,470,471,472}.jpg`; `migration/evidence/2026-11-12/gallery-30/`.

## Охват и найденные материалы

Категория отвечает HTTP 200. В HTML семь карточек изображений подряд, пагинации, дополнительных страниц категории и дочерних категорий нет. Семь detail URL ведут по циклу «предыдущий/следующий» в том же порядке, от ID 466 до 472. У детальных страниц нет отдельных описаний; они показывают превью, исходное имя файла и навигацию. Описание категории пустое. Сохранены имена/подписи карточек: `1IMG_1044`, `300px-Su-27_UMPO_(Ufa)`, `IMG_1044`, `IMG_1045`, `IMG_1068`, `IMG_1075`, `IMG_1081`.

В категории также видна ссылка «Документы» на `id=32:doqumenty`. Она сохранена на целевой странице как временная ссылка на источник и поставлена в очередь отдельной страницы: `https://ufalit.ufacsdb.ru/index.php?Itemid=88&id=32:doqumenty&option=com_phocagallery&view=category`. Это соседняя категория, не пагинация и не дочерний раздел «УМПО». Родительская ссылка «Памятные места» ведёт на готовую локальную страницу `gallery-26`.

Ни аудио, ни видео, ни документы, относящиеся к семи карточкам, не обнаружены. В карточках не указаны авторы/подписи сверх исходных title/alt-имён. Эти короткие строки сохранены без редакторского переименования.

## Загрузка и ресурсы

Полные HTML ответа категории и семи detail-страниц сохранены в этой папке вместе с заголовками. Оригинальные JPEG получены через штатный `phocadownload=2`; HTTP 200, `Content-Type: image/jpeg`, ненулевые тела. Ответ `Content-Disposition` подтверждает имена исходников. Тела сохранены в `site/assets/gallery/30/`; размер, SHA-256, запрошенный URL, дата, HTTP-код, MIME и evidence перечислены пофайлово в `source-fetch-metadata.csv`. Ни один общий ресурс по хешу не требовался.

| ID | Исходный файл | Размер в пикселях | SHA-256 |
|---:|---|---:|---|
| 466 | `1IMG_1044.jpg` | 507 × 373 | `69dfda6b6e5aba7feb8b05b2b79d5b3608aae6690e0ccf400e00506856e92670` |
| 467 | `300px-Su-27_UMPO_(Ufa).jpg` | 300 × 225 | `2466b57b8ae1dfd13e0b624aba433bc4f789f9fc19b713279797096e9fd5b601` |
| 468 | `IMG_1044.jpg` | 4000 × 3000 | `b80e4836fd40e24dc44b06a94cdfa86ff9afdbde9965cbb5fa5a0f38c2027f2c` |
| 469 | `IMG_1045.jpg` | 386 × 579 | `a83768ae8d65b572db318d503fbd1427374700988611f875135b2c0ef1b26d59` |
| 470 | `IMG_1068.jpg` | 600 × 450 | `b4a61f11ffd042fb85ee9f0a9127b18438191dec713aac214d4c74184c283ee8` |
| 471 | `IMG_1075.jpg` | 450 × 600 | `ef09d4e160639af5e9f926b111a5e730f7c297ee17544ccd651f57021da438d0` |
| 472 | `IMG_1081.jpg` | 600 × 450 | `39e5c97b486aa172e544160b4dcb2facdf69e11031fd776b29fe8132e54440af` |

The original bytes are unmodified. In particular, ID 468 is a 4000×3000 JPEG, not the much smaller thumbnail in the source listing. The target links each displayed image to its local full-resolution original.

## Матрица сверки

`content-parity.csv` uses the required schema and contains 18 entries: the title, parent link, count, seven visible photo labels, seven image placements, and the visible «Документы» category link. All rows remain `discovered`: photo identity/placement and target presentation have not been checked in a browser. Filenames in source `title`/`alt` and saved captions were compared at capture time; no additional photo descriptions existed in the detail pages. This is not a claim of full page visual parity.

## Ограничения и дальнейшие проверки

- Target HTML, all seven local JPEGs, captured category and detail HTML, and HTTP headers are present. Browser review at desktop and narrow widths, click-through to every original, keyboard/focus review, and visual item-by-item matching remain open. Keep image rows `discovered` pending that review.
- A path check resolved all 22 relative `href`/`src` targets in the HTML (22/22). This check did not serve the page under the `/ufalit/` prefix; that and browser rendering remain open.
- The source detail view itself displays `phoca_thumb_l_*` previews; the downloadable originals were captured separately and dimensions checked. Original-to-preview visual comparison was not performed here.
- The target preserves the gallery order and source filenames, uses the existing project styles, and links to the already-migrated parent category. The adjacent «Документы» link still depends on the legacy Joomla site until page 32 is migrated and mapped locally.
- No source changes were made. Shared registries, Git index, commits, and branch were not changed.
