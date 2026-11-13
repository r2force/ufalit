# Проверка исходной карты «Карта Уфы»

Проверен только один файл — элемент № 7, запись `722` из gallery-42, подпись «Карта Уфы».

- Публичный оригинал: https://ufalit.ufacsdb.ru/images/phocagallery/shafikov/Fotopamiatnykhmest/0%20%284%29.jpg
- Источник локального имени: `migration/evidence/2026-11-13/gallery-42/fetch-log.tsv`, строка 8: `site/assets/gallery/42/0 (4).jpg`.
- Деталь Phoca Gallery: https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=detail&catid=42:2012-12-30-08-53-57&id=722:0-4&tmpl=component&Itemid=88
- Повторный GET публичного оригинала: HTTP 200, MIME `image/jpeg`, 853184 байта; заголовки сохранены в `map-source-check.headers`.
- Повторно загруженная копия во временном каталоге: `/private/tmp/ufalit-gallery42-map-original.jpg`.
- SHA-256 повторной загрузки: `6d1933bffc312f8e11e4286bea17283aaaee59e670a355b56d62d211a68ea6eb`.
- SHA-256 существующего локального `site/assets/gallery/42/0 (4).jpg`: `6d1933bffc312f8e11e4286bea17283aaaee59e670a355b56d62d211a68ea6eb`.
- Хеши совпали. Обе проверки файла определяют JPEG размером 2516×2815.

## Визуальное наблюдение

На повторно полученном оригинале в верхней части изображения отчётливо видна надпись `Converted by Total Image Slicer - (no stamps are applied by registered version)`. Она проходит поверх верхнего края карты и повторяется в верхней полосе примерно посередине изображения. Такой же текст виден на локальной копии; совпадение SHA-256 подтверждает побайтовое совпадение этих файлов.

Вывод относится только к этому оригиналу карты `0 (4).jpg`; другие изображения gallery-42 не проверялись.
