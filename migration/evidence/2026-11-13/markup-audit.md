# Аудит разметки HTML в `site/`

Дата: 13 ноября 2026 года. Аудировано read-only всё дерево `site/`: 60 файлов `.html`, `.htm` не найдено. Сбор совпадений выполнен HTML-парсером по элементам и атрибутам; повторно просмотрены контексты найденных групп и stylesheet `site/assets/style.css`.

## Итог

- В 60 HTML-файлах не обнаружено устаревших HTML-элементов из проверенного набора (`center`, `font`, `big`, `strike`, `tt`, `marquee`, `blink`, `basefont`, `applet`, `frame`, `frameset`, `noframes`, `acronym`, `dir`, `isindex`, `keygen`, `menuitem`, `listing`, `plaintext`, `xmp`).
- Обнаружено **532 атрибута `style`** в 14 файлах. Это inline-оформление, которое следует переносить в CSS по смысловым группам, сохраняя выравнивание текстов, изображений и библиографических блоков.
- Обнаружено **121 `mce_style`**, **15 `mce_bogus`**, **5 `mce_href`**, **14 классов `mceItemTable`**, один класс `mceItemVisualAid` и 10 `MsoNormal`. В дополнение к ним в странице персоналий встроен фрагмент Office/Word с условными комментариями, XML и Mso CSS.
- Найдено **20 атрибутов `border`**: 14 на таблицах и 6 на изображениях. Все они задают presentation (`border="0"`), а не смысл изображения или данных.
- Найдено **56 `<div class="clr">`** в четырёх страницах. Класс не используется в `site/assets/style.css`; это вспомогательная очистка/разделитель из прежней разметки, но его поведение нужно проверять при удалении.
- Явных классов или атрибутов с `joomla`/`com_phocagallery` в HTML-разметке не обнаружено. В галереях остаются видимая атрибуция Phoca и ссылки на сайт Phoca — это текст и внешние ссылки, их не следует удалять как служебную разметку.

## Точные группы совпадений

| Группа | Количество и расположение |
|---|---|
| Inline `style` | 532: `site/pages/personalities/index.html` — 405; `site/pages/awards/index.html` — 25; `site/pages/reading/index.html` — 13; `site/pages/reading-karim-children/index.html` — 36; `site/pages/reading-bikchentaev-reviews/index.html` — 17; `site/pages/reading-bikchentaev-stories/index.html` — 4; `site/pages/reading-karim-poems/index.html` — 3; `site/pages/reading-karim-smile/index.html` — 2; `site/pages/reading-shafikov-dedications/index.html` — 14; `site/pages/reading-shafikov-poems/index.html` — 4; `site/pages/reading-shafikov-sayings/index.html` — 1; `site/pages/reading-shafikov-talas/index.html` — 5; `site/pages/reading-aksakov-flower/index.html` — 2; `site/pages/reading-aksakov-nature/index.html` — 1. |
| Дубли `mce_style` | 121 в 13 файлах: `awards` — 25, `reading` — 9, `reading-aksakov-flower` — 2, `reading-aksakov-nature` — 1, `reading-bikchentaev-reviews` — 16, `reading-bikchentaev-stories` — 4, `reading-karim-children` — 36, `reading-karim-poems` — 3, `reading-karim-smile` — 2, `reading-shafikov-dedications` — 13, `reading-shafikov-poems` — 4, `reading-shafikov-sayings` — 1, `reading-shafikov-talas` — 5. Во всех 121 случаях значение `mce_style` побайтно совпадает со значением обычного `style` того же элемента. |
| `mce_bogus` | 15 на `<br>`: `site/pages/awards/index.html` — 4; `site/pages/reading/index.html` — 10; `site/pages/reading-aksakov-childhood/index.html` — 1. |
| Дубли `mce_href` | 5 на ссылках: `site/pages/awards/index.html` — 3; `site/pages/reading-shafikov-dedications/index.html` — 1; `site/pages/reading-shafikov-talas/index.html` — 1. Во всех 5 случаях значение совпадает с `href`. |
| MCE-классы | `mceItemTable` — 14 таблиц: `awards` — 1, `personalities` — 6, `places` — 7. `mceItemVisualAid` — 1 элемент на `personalities`. В stylesheet сайта эти классы не используются. |
| Word-класс/стили | 10 `MsoNormal` на `personalities`; в этой же странице находятся скрытый контейнер `id="_mcePaste"` с классом `mceItemVisualAid`, условные `<!--[if gte mso 9]>` XML-блоки и определения `MsoNormalTable`/`mso-*`. Внутри контейнера есть Word-форматированный текст библиографии; удаление всего блока без извлечения содержимого повредит материал. |
| Presentation `border` | 14 `border="0"` на таблицах в `awards`, `personalities`, `places`; 6 `border="0"` на изображениях в `places`. |
| Вспомогательный `clr` | 56 `<div class="clr">`: `site/pages/personalities/index.html` — 19; `site/pages/places/index.html` — 19; `site/pages/reading/index.html` — 12; `site/pages/awards/index.html` — 6. Селектора `.clr` в `site/assets/style.css` нет. |

Проверенные типичные legacy presentation-атрибуты `align`, `valign`, `bgcolor`, `background`, `cellpadding`, `cellspacing`, `hspace`, `vspace`, `nowrap`, `color`, `face`, `size` не найдены. Атрибуты `width` и `height` встречаются на `<img>` для указания размеров/аспекта и здесь не считаются устаревшей разметкой. Семантические `alt`, `title`, `href`, `id`, `loading`, а также обычные `<b>`/`<small>` не классифицировались как нарушения.

## Рекомендуемые группы безопасной очистки

1. Удалить дублирующие `mce_style` и `mce_href` после сохранения соответствующих `style` и `href`: все обнаруженные значения совпадают. Смысл ссылок и текущие значения стилей останутся на месте.
2. Удалить атрибут `mce_bogus` и MCE-классы `mceItemTable`/`mceItemVisualAid` после проверки отсутствия зависимостей в CSS/JS. Не удалять автоматически сам `<br>`: перенос может быть видимой частью текста.
3. Удалить `border="0"` и вынести нужное оформление таблиц/изображений в CSS. Для `places`, где есть `<table>` с `mceItemTable`, отдельно проверить, где таблица группирует картинки и где используется как раскладка; менять структуру таблиц только с сохранением порядка чтения и взаимного расположения содержимого.
4. Перенести повторяющиеся `text-align`, `float`, `margin`, `border`, `font-size` и аналогичные inline-правила в понятные CSS-классы. Сначала сверить отображение абзацев, заголовков, изображений и стихотворных строк; не вычищать `style` целиком.
5. Отдельно обработать Office/Word-остаток в `personalities/index.html`: сначала извлечь и сверить весь видимый текст и нужное форматирование из `_mcePaste`, затем убрать невидимую Office-обвязку, `MsoNormal`/`mso-*` и встроенные XML/CSS-данные. Сам контейнер включает текст, поэтому его безусловное удаление небезопасно.
6. Удалить пустые `<div class="clr">` только после проверки новой верстки в браузере. Если clear нужен из-за обтекания, заменить его CSS containment/современной раскладкой, а не оставлять неиспользуемый legacy-класс.

Это инвентаризация и рекомендации, а не исправление. Файлы `site/`, Git и реестры не менялись; полнота исправлений не заявляется. Браузерное отображение страниц в рамках этого аудита не проверялось.
