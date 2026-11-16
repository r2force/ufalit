# Аудит 198 кандидатов gallery-detail

Дата: 2026-11-17

Независимо сверены все строки `migration/evidence/2026-11-17/missing-details-candidate.csv` с исходными category/detail snapshots, сохранёнными сведениями об оригинальных загрузках, текущими целевыми страницами/файлами и `migration/pages.csv`. Поэлементные проверки сохранены в [`missing-details-review.tsv`](missing-details-review.tsv).

## Итог

- Кандидатов проверено: **198** по 14 категориям.
- **198 eligible_captured**, flagged: **0**. Это означает, что source category содержит соответствующую detail-ссылку; detail snapshot содержит тот же catid/id URL; локальная целевая страница содержит единственный ожидаемый `#photo-ID`; `href` и `src` указывают на один существующий файл; запись захвата подтверждает HTTP 200, image MIME, байты и SHA файла.
- В **184** строках идентичность target подтверждается строкой основного `migration/assets.csv`. Ещё **14** строк используют захваты из evidence-манифестов категории: 13 файлов gallery-31 в `assets-metadata.csv` и ID 486 gallery-33 в `source-fetch-metadata.csv`. Для них исходные byte/sha metadata совпали с текущим локальным файлом. Эти 14 отдельно отмечены в TSV как per-gallery capture basis; они ещё не представлены точными source-detail rows основного `assets.csv`.
- Source ID / target `#photo-ID` и размер группы по категориям: см. таблицу ниже; все target пути существуют.

| CatID | Строк | Eligible captured | Flagged |
|---:|---:|---:|---:|
| 23 | 10 | 10 | 0 |
| 24 | 18 | 18 | 0 |
| 25 | 3 | 3 | 0 |
| 27 | 14 | 14 | 0 |
| 28 | 3 | 3 | 0 |
| 29 | 2 | 2 | 0 |
| 30 | 7 | 7 | 0 |
| 31 | 13 | 13 | 0 |
| 32 | 12 | 12 | 0 |
| 33 | 11 | 11 | 0 |
| 34 | 14 | 14 | 0 |
| 35 | 23 | 23 | 0 |
| 36 | 33 | 33 | 0 |
| 43 | 35 | 35 | 0 |

## Проверка source → detail → target

Для каждой строки разобраны `catid` и `id` из исходного detail URL. Родительский URL `discovered_from` указывает на ту же категорию. В указанном source category snapshot найдена соответствующая ссылка `view=detail` с теми же ID; найден соответствующий сохранённый detail snapshot (учтены разные имена вроде `detail-ID`, `ID-detail`, `item-ID`). В target-path проверены page, единственный figure с ID `photo-ID`, существование локального image файла и совпадение разрешённых `href`/`src`. TSV содержит для всех 198 строк точные source URL, пути evidence, target ref, capture source, размеры, SHA и результат каждого условия.

## Оригинальные загрузки и файл

Capture подтверждение взято из основного `assets.csv` либо из указанного per-gallery capture manifest. Для каждой записи его HTTP status/MIME/байты/SHA сопоставлены с независимо пересчитанными локальными байтами/SHA того файла, на который указывает target. Наличие capture body или header-specific evidence не подменено одним фактом существования картинки: все строки имеют item-level metadata, связывающие источник/ID и target. Внутренние note пер-gallery manifest отдельно сохранены в столбцах `asset_capture_basis`, `asset_capture_record` и `capture_source_url`.

## Проверка дубликатов pages.csv

В текущем `migration/pages.csv` **0** строк совпали с этими кандидатами по нормализованной паре `(catid, id)`, и **0** совпали по полному `target_ref` с `#photo-ID`. Среди самих 198 строк также нет повторов source `(catid,id)` или target ref. В `pages.csv` есть один уже существующий общий `target_path` `site/pages/gallery-uzikov/index.html`, повторённый у категории и её detail-строк; ни одна из этих строк не относится к данному набору, и это не совпадает с candidate target anchors.

## Ограничения и статус реестров

Этот аудит проверяет captured-source evidence и отображение на текущие локальные страницы, но не оценивает визуальную композицию каждого изображения и не выполняет браузерный HTTP smoke test. `eligible_captured` не является записью о ручном подтверждении внешнего раздела, а показывает, что локальный detail-элемент уже присутствует и имеет подтверждённый capture-файл. Изменены только два собственных review-файла; сайт, Git и общие реестры не менялись.
