# Candidate assets для ID 453–465 и 486

Сверены `migration/evidence/2026-11-17/missing-details-review.tsv`, текущий `migration/assets.csv`, локальные файлы и по-галерейные capture/recheck evidence. Общий реестр, сайт и Git не изменялись.

## Результат дедупликации

Переданный review TSV перечисляет 14 элементов и для них показывает `global_assets_csv_row=false`. При повторной проверке текущего `assets.csv` обнаружено, что ID 453–465 (gallery-31) уже зарегистрированы по точным source URL, target path, размеру и SHA-256. Повторные строки для 13 URL не включены, чтобы не дублировать записи. Это расхождение между review TSV и текущим реестром отмечено руководителю.

Для ID 453–465 прямые исходные URL — `https://ufalit.ufacsdb.ru/images/phocagallery/volovik/Pamiatnyemesta/Shqola/IMG_0861.jpg`, `IMG_0865.jpg`, `IMG_0870.jpg`, `IMG_0873.jpg`, `IMG_0876.jpg`, `school.jpg`, `SDC16459.JPG`, `SDC16463.JPG`, `SDC16464.JPG`, `SDC16476.JPG`, `SDC16484.JPG`, `SDC16485.JPG`, `tabl.jpg`. Все 13 имеют ровно по одной matching row в `assets.csv`, с совпадающими target, байтами и хешем. Их независимый повторный source-check находится в `migration/evidence/2026-11-14/gallery-31-source-check.md`; исходная capture metadata — в `migration/evidence/2026-11-12/gallery-31/assets-metadata.csv` и per-image headers.

## Единственная новая candidate-строка: gallery-33 ID 486

Точная загрузка: `https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=detail&catid=33:2012-12-30-07-41-34&id=486:0-1&tmpl=component&phocadownload=2&Itemid=88`; target `site/assets/gallery/33/0-1.png`; HTTP 200, `image/png`, 43 419 байт, SHA-256 `2e308577dfb6e68cbaf1b552c4f86b342fbba6739cd095a7d82648a1302a0622`. Ни source URL, ни target path ID 486 в assets.csv не найдены; физический target присутствует и совпадает по размеру/SHA с capture manifest и независимой source-перепроверкой.

Этот SHA-256 также уже зарегистрирован для `site/assets/places/gafuri/image011.png` по другому source URL. Это подтверждает идентичность байтов, но не позволяет считать две строки одним исходным URL: candidate сохраняет точное происхождение gallery-33 и фактический target, используемый страницей этой галереи. В duplicate file/hash учёте нужно учитывать это совпадение отдельно.

Доказательства: `migration/evidence/2026-11-12/gallery-33/original-486.headers` и `source-fetch-metadata.csv`; независимая перепроверка — `migration/evidence/2026-11-14/gallery-33-source-check.md`; локатор target — `gallery-33-content-check.md` и переданный `missing-details-review.tsv`.

## Состав кандидата

- `missing-assets-candidate.csv`: 1 новый source URL (ID 486) с точными HTTP/MIME/size/SHA и ссылками на evidence.
- IDs 453–465 намеренно не повторены, так как точные source URL и target уже зарегистрированы в общем assets.csv.
- Candidate не внесён в общий реестр; страницу, оригиналы и Git не менял.
