# Сверка 41 обновлённой категории фотогалереи

Проверены 41 ответа `gallery-category` из `live-refresh.tsv` (каждый записан как HTTP 200). Для каждой категории сопоставлены текущий HTML-ответ, сохранённый ранее HTML категории (если он доступен), целевая страница, упорядоченный список `detail` ID, ссылки на дочерние категории и наличие локальных файлов изображений. Динамическая оболочка страницы и служебная Joomla-навигация не сравнивались; идентичность сырого HTML/SHA не использовалась как доказательство содержательного совпадения. Подробные данные по каждой категории приведены в TSV.

## Итог

- Обновлённых категорий: **41**.
- Сравнение списка detail ID live → target: **41/41** точное совпадение порядка; расхождений нет.
- Для старых category snapshots old→live порядок и ID фотографий совпали: **41/41**; дополнительный пригодный старый снимок ID 16 найден в `migration/evidence/2026-11-11/batch-2/gallery-16.html.gz`.
- В target проверены `src` и `href` каждого изображения: **41/41** страниц без отсутствующих файлов.
- Индивидуальные detail snapshots ID 669–674 найдены в `migration/evidence/2026-11-12/gallery-uzikov/`; подписи этих detail-снимков, live-категории и target совпали 6/6. Эти detail endpoints не обновлялись live 17 ноября.
- Всего detail ID в 41 live category response: **542**; для всех 41 категорий имеются подходящие старые category baselines, их detail ID и порядок совпали.
- Все дочерние категории, видимые имена и счётчики target совпали с live source; во всех 41 baseline-снимках дочерние названия/счётчики также совпадают old→live.
- Ни в одном сохранённом live ответе не обнаружена пагинационная ссылка или элемент управления пагинацией.

## Дополнительные подтверждения и закрытие ранее отмеченных пунктов

- **ID 16** (`site/pages/gallery-uzikov/index.html`): хотя `live-refresh.tsv` указывал общий `galleries.html.gz` как previous evidence, отдельный старый category snapshot найден в `migration/evidence/2026-11-11/batch-2/gallery-16.html.gz`. В нём, live category и target 6 IDs `669–674` идут в одном порядке; source labels и descriptions old→live совпадают. Сохранённые detail HTML `migration/evidence/2026-11-12/gallery-uzikov/{669..674}.html.gz` проверены по URL catid/ID. `#description-text` — `Узиков Юрий Андреевич` (669–671), `Дом печати` (672), `Дом Узикова` (673), `УНЦ РАН` (674); каждое значение совпадает с `phocaimgdesc` live category и target figcaption. Category title/thumbnail alt `01`–`06` также совпадают с detail image alt.
- **ID 36** (`site/pages/gallery-36/index.html`): прежняя разница меток устранена добавлением точных figcaption для ID 544–567; независимо подтверждено в [gallery-36-label-review.md](gallery-36-label-review.md). В текущем target метки совпадают с live category и detail labels; это несоответствие закрыто. Пути изображений не менялись.

## Метод и ограничения

- В category response извлечены `id` из ссылок `view=detail` и `view=category`; дублирующие thumbnail/detail ссылки для одного ID считались одним элементом, порядок — первое появление ID в HTML.
- Детали старого/нового списка сравнивались по ID и позиции. Source `alt`/`title` старого и live category snapshot сопоставлялись. Видимые target figcaption сравнивались с source `phocaimgdesc`; для ID 16 они также сверены с сохранённым detail `#description-text`. Category labels проверялись отдельно. `missing_detail_caption_sources` указывает ID, для которых не нашлось индивидуального detail HTML; отдельные snapshots ID 669–674 присутствуют и проверены. Live detail pages не обновлялись, поэтому их состояние на 17 ноября не проверено.
- Дочерние категории сравнивались по ID/порядку/видимому имени/счётчику. Глобальная ссылка «Фотогалерея» и меню Joomla исключены; в отчёте учитываются только ссылки на категории из этой партии, имеющие собственный target `gallery-category`.
- Для каждого фото видимый target figcaption сопоставлен с исходным видимым описанием категории (`phocaimgdesc`), если оно было; source filename/alt labels проверены отдельно. Old→live source descriptions также сопоставлены. Ссылки на локальные файлы изображений проверены существованием относительно каталога страницы. Контентное визуальное сходство изображений здесь не переоценивалось; задача сверяет HTML категории, регистрацию исходного порядка и target references.
- Для ID 16 `previous_evidence` в live-refresh указывает общий `galleries.html.gz`, который не принят как baseline. Подходящий category baseline найден отдельно по evidence detail rows: `migration/evidence/2026-11-11/batch-2/gallery-16.html.gz`; с ним detail ID/order и видимые метки/описания совпадают. Detail HTML от 12 ноября не подтверждает состояние самих live detail endpoints на 17 ноября.
- Проверка охватывает только эти 41 сохранённый live response и соответствующие target-файлы. Она не доказывает полноту всех страниц текущего внешнего сайта и не подтверждает контент вложенных detail endpoints на 17 ноября.

Подробная поэлементная таблица (включая последующую caption-сверку и закрытие gallery-36 label finding): [`live-gallery-compare.tsv`](live-gallery-compare.tsv).
