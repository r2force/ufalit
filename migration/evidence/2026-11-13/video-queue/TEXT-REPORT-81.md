# Перенос статьи 81 «Мустай Карим»

Дата: 2026-11-14.

## Изменённые файлы

- `site/pages/video-81/index.html` — статическая страница статьи.
- `migration/evidence/2026-11-13/video-queue/TEXT-REPORT-81.md` — этот отчёт.

Общие файлы, другие страницы, медиа, реестры и Git не менялись.

## Источник и текст

Исходный URL: <https://ufalit.ufacsdb.ru/index.php?Itemid=123&catid=3:2012-04-20-10-55-31&id=81:2012-04-27-10-52-55&option=com_content&view=article>. Снимок `article-81.html` и заголовки ответа `article-81.headers` сохранены в этой папке. HTTP 200, `text/html; charset=utf-8`, 26,561 байт; SHA-256 `865b9f5471f78dbc0d871d18b225dd0f423a4092952ca4c2c4a93117650453cd`.

Основной текст снимка состоит из заголовка `Мустай Карим` и четырнадцати видеоплееров без текстовых подписей. Это согласуется с `VERIFY-INVENTORY.md`: значения `Без подписи` в TSV являются учётными маркерами, не исходным текстом. На новой странице «Видео 1»–«Видео 14» используются исключительно для различения ссылок и прямо помечены как навигационные обозначения, а не подписи источника. Порядок сохранён. Каждая ссылка ведёт к точному FLV URL из снимка/`media-metadata.tsv`; видимый текст сообщает, что проигрывание не подтверждено.

## Видео

Все HEAD-ответы указаны в `media-metadata.tsv`; полные заголовки для статьи 81 лежат в соответствующих `video-81-*.headers`.

| № | Обозначение на странице | Исходный URL | HEAD: HTTP / MIME / байты | Заголовки |
|---:|---|---|---|---|
| 1 | `Видео 1` (навигационная метка; исходной подписи нет) | `https://ufalit.ufacsdb.ru/images/stories/videos/karim/1r.flv` | 200 / `video/x-flv` / 21 786 684 | `video-81-1r.headers` |
| 2 | `Видео 2` (навигационная метка; исходной подписи нет) | `https://ufalit.ufacsdb.ru/images/stories/videos/karim/2r.flv` | 200 / `video/x-flv` / 14 296 060 | `video-81-2r.headers` |
| 3 | `Видео 3` (навигационная метка; исходной подписи нет) | `https://ufalit.ufacsdb.ru/images/stories/videos/karim/3r.flv` | 200 / `video/x-flv` / 7 298 011 | `video-81-3r.headers` |
| 4 | `Видео 4` (навигационная метка; исходной подписи нет) | `https://ufalit.ufacsdb.ru/images/stories/videos/karim/4r.flv` | 200 / `video/x-flv` / 4 107 489 | `video-81-4r.headers` |
| 5 | `Видео 5` (навигационная метка; исходной подписи нет) | `https://ufalit.ufacsdb.ru/images/stories/videos/karim/5r.flv` | 200 / `video/x-flv` / 6 107 702 | `video-81-5r.headers` |
| 6 | `Видео 6` (навигационная метка; исходной подписи нет) | `https://ufalit.ufacsdb.ru/images/stories/videos/karim/6r.flv` | 200 / `video/x-flv` / 2 074 646 | `video-81-6r.headers` |
| 7 | `Видео 7` (навигационная метка; исходной подписи нет) | `https://ufalit.ufacsdb.ru/images/stories/videos/karim/7r.flv` | 200 / `video/x-flv` / 5 974 095 | `video-81-7r.headers` |
| 8 | `Видео 8` (навигационная метка; исходной подписи нет) | `https://ufalit.ufacsdb.ru/images/stories/videos/karim/8r.flv` | 200 / `video/x-flv` / 6 704 146 | `video-81-8r.headers` |
| 9 | `Видео 9` (навигационная метка; исходной подписи нет) | `https://ufalit.ufacsdb.ru/images/stories/videos/karim/9r.flv` | 200 / `video/x-flv` / 6 770 588 | `video-81-9r.headers` |
| 10 | `Видео 10` (навигационная метка; исходной подписи нет) | `https://ufalit.ufacsdb.ru/images/stories/videos/karim/10r.flv` | 200 / `video/x-flv` / 7 491 343 | `video-81-10r.headers` |
| 11 | `Видео 11` (навигационная метка; исходной подписи нет) | `https://ufalit.ufacsdb.ru/images/stories/videos/karim/11r.flv` | 200 / `video/x-flv` / 3 846 664 | `video-81-11r.headers` |
| 12 | `Видео 12` (навигационная метка; исходной подписи нет) | `https://ufalit.ufacsdb.ru/images/stories/videos/karim/12r.flv` | 200 / `video/x-flv` / 6 711 509 | `video-81-12r.headers` |
| 13 | `Видео 13` (навигационная метка; исходной подписи нет) | `https://ufalit.ufacsdb.ru/images/stories/videos/karim/13r.flv` | 200 / `video/x-flv` / 7 228 679 | `video-81-13r.headers` |
| 14 | `Видео 14` (навигационная метка; исходной подписи нет) | `https://ufalit.ufacsdb.ru/images/stories/videos/karim/14r.flv` | 200 / `video/x-flv` / 9 762 961 | `video-81-14r.headers` |

Все 14 файлов объявлены HTTP 200, `video/x-flv`; размеры взяты из `Content-Length`. Тела видео не загружались, поэтому хеши и целостность видео не проверены. Проигрывание, звук и перемотка не проверялись. Ссылки остаются зависимы от доступности исходного сайта.

## Кодировка снимка и ограничения

HTTP `Content-Type` объявляет UTF-8, но строгий декодер обнаруживает невалидные байты в общем рекламном подвале шаблона `article-81.html`: смещение 26 191, первый проблемный байт `0xF8`. Последовательность начинается так: `F8 E0 E1 EB EE ED FB 20 44 4C 45 20 39 2E 36 22 3E F8 E0 E1 EB EE ED FB` (hex). Она не исправлялась и не скрыта; исходный снимок не менялся. По форме это похоже на текст Windows-1251 в рекламном хвосте, но такое предположение не использовалось для изменения содержания. Заголовок статьи и конфигурации основных блоков находятся до повреждённого шаблонного хвоста. Воспроизведение через исходную ссылку не подтверждалось.
