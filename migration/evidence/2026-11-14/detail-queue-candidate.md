# Кандидат обновления 147 строк `gallery-detail`

Машиночитаемая построчная таблица: [detail-queue-candidate.tsv](detail-queue-candidate.tsv). В неё вошли 147 строк `kind=gallery-detail,status=discovered` из `migration/pages.csv`. Каждая строка сохраняет исходный detail URL и включает выбранный сохранённый detail-снимок, target `index.html#photo-ID`, путь локального оригинала, путь доказательства загрузки, контрольные поля и предлагаемый статус.

## Результат построчной проверки

| Источник-категория | Число | Target | Путь detail-снимков |
|---|---:|---|---|
| 3 | 15 | `site/pages/gallery-aksakov/index.html#photo-ID` | `migration/evidence/2026-11-11/aksakov-details/ID.html.gz` |
| 1 | 27 | `site/pages/gallery-amantai/index.html#photo-ID` | `migration/evidence/2026-11-11/gallery-amantai/ID.html.gz` |
| 2 | 19 | `site/pages/gallery-bikbay/index.html#photo-ID` | `migration/evidence/2026-11-12/gallery-bikbay/ID.html.gz` |
| 5 | 1 | `site/pages/gallery-5/index.html#photo-ID` | `migration/evidence/2026-11-12/gallery-5/detail-ID.html.gz` |
| 8 | 30 | `site/pages/gallery-8/index.html#photo-ID` | `migration/evidence/2026-11-12/gallery-8/details/ID.html` |
| 10 | 9 | `site/pages/gallery-10/index.html#photo-ID` | `migration/evidence/2026-11-13/gallery-10/detail-ID.html` |
| 11 | 20 | `site/pages/gallery-11/index.html#photo-ID` | `migration/evidence/2026-11-13/gallery-11/detail-ID.html` |
| 12 | 18 | `site/pages/gallery-12/index.html#photo-ID` | `migration/evidence/2026-11-13/gallery-12/detail-ID.html` |
| 18 | 8 | `site/pages/gallery-18/index.html#photo-ID` | `migration/evidence/2026-11-12/gallery-18/details/ID.html` |
| **Всего** | **147** |  |  |

Для всех 147 строк найдены файлы detail-снимков; тело каждого содержит ожидаемые `catid` и `id`. Целевой файл страницы существует, содержит единственную `figure#photo-ID`, а `img src` в ней разрешается ровно в локальный оригинал, указанный соответствующей строкой `assets.csv`. Локальные файлы существуют; фактические байты по размеру и SHA-256 совпадают с метаданными сохранённого asset. В каждой записи `assets.csv` HTTP-статус 200, MIME, байты, SHA-256 и путь evidence заполнены; указанный evidence-файл существует.

`candidate_status=captured` предложен для всех 147 строк: целевая страница и точная локальная цель есть, исходный detail-ответ сохранён, а локальный оригинал и учёт загрузки доступны. Это статус только для кандидата; `pages.csv` не изменён. В TSV булевы поля `snapshot_exists`, `snapshot_id_match`, `target_asset_exists`, `proof_file_exists`, `target_figure_unique` и `figure_asset_match` позволяют независимо проверить каждое основание.

## Доказательства и границы вывода

Поле `download_proof` сохраняет исходное значение evidence из соответствующей строки `assets.csv`. Оно может указывать на журнал ответов, файл заголовков, метаданные загрузки или сохранённый detail-снимок, в зависимости от партии. TSV также приводит точный URL загрузки оригинала и статус/MIME/размер/SHA из этой записи; локальные байты повторно сверены с указанными размером и SHA. Кандидат подтверждает наличие сохранённой страницы детали и локального файла по записи источника, но не вводит нового утверждения о побайтном source-to-target сравнении image response там, где отдельное тело ответа отсутствует.

Наиболее прямые построчные журналы ответов есть у gallery-3 (`aksakov-images/responses.tsv`); у gallery-5, gallery-8 и gallery-10/11/12 имеются HTTP-заголовки и локальные оригиналы; у gallery-18 — `fetch-log.tsv`. Для gallery-1/2 evidence указывает на локальные детальные HTML-снимки и сведения `assets.csv`; отдельных файлов заголовков оригинала в этих каталогах не найдено. Эти случаи оставлены `captured`, а не `verified`: статус означает сохранение страницы и локального содержания с записью загрузки, не независимое визуальное подтверждение сюжета.

Сетевых запросов не выполнялось. Сайт, общие реестры и Git не изменялись. Подмена недоступного доказательства пустым или предполагаемым путём не потребовалась: у всех 147 строк необходимые файлы и записи обнаружены.
