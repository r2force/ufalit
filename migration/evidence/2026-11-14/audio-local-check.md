# Локальная проверка аудиозаписей

Дата: 2026-11-14

## Объём и метод

Сверены все 23 строки `kind=audio` в `migration/content-parity.csv`, два сохранённых снимка статей 411/414, `downloads.tsv`, `SHA256SUMS`, целевые HTML и локальные файлы. Для каждой записи проверены позиция/подпись источника (если она есть), целевой `#track-NN`, локальный `<source src>`, ссылка скачивания, наличие файла, размер, SHA-256 против локального списка контрольных сумм и распознаваемый тип контейнера/кодека через `file`. Не менялись страницы, реестры или Git.

## Итоги

- Реестр: 23 аудиостроки, все пока имеют статус `discovered` (не менялся).
- Источники: 5 URL статьи 411 и 18 URL статьи 414 присутствуют в сохранённых снимках и совпадают с их порядком на двух локальных страницах.
- Целевые страницы: найдены 5 и 18 соответствующих элементов `<audio>`; каждый имеет ожидаемый `track-NN`, локальный Ogg `<source>` и прямую локальную ссылку скачивания на тот же файл. Все цели разрешаются в `site/assets/audio/`.
- Файлы: все 23 существуют и ненулевого размера; размер каждого совпадает с `downloads.tsv`; все 23 SHA-256 совпадают с `SHA256SUMS`; `file` распознаёт все как Ogg Vorbis, stereo, 44100 Hz.
- Подписи: все 18 названий статьи 414 совпадают с исходными видимыми подписями и сохраняют порядок. В снимке статьи 411 у пяти аудиоплееров нет отдельных видимых подписей; target использует нейтральные `Запись 1`–`Запись 5` в порядке источника. Это новые нумерационные обозначения, а не подтверждённые исходные названия.
- Эти проверки подтверждают локальное соответствие manifest и извлечённых source URL/порядка, но сами по себе не доказывают акустическую идентичность свежему источнику.

## Поэлементная сверка

| ID | Source file / source label | Target track / label | Target file | Bytes | SHA-256 | Checks |
|---|---|---|---|---:|---|---|
| `reading-411-audio-1` | `berga.ogg`; нет отдельной подписи в снимке | `track-01`; `Запись 1` | `site/assets/audio/karim-nazarova/berga.ogg` | 1,334,624 | `04b84640c9b983a72c47cb28b084547232d4a3632de40e0397b6fb85c755a1d4` | ok |
| `reading-411-audio-2` | `isudba.ogg`; нет отдельной подписи в снимке | `track-02`; `Запись 2` | `site/assets/audio/karim-nazarova/isudba.ogg` | 2,027,340 | `4c9b7fef329137736134568d97af14c652b7b40f31ef946b69af525edc57e267` | ok |
| `reading-411-audio-3` | `razgovor.ogg`; нет отдельной подписи в снимке | `track-03`; `Запись 3` | `site/assets/audio/karim-nazarova/razgovor.ogg` | 1,383,833 | `a76346f27db0e6bea68eb389ff976922dd820dc5ee8c47f5d75f19286848ebae` | ok |
| `reading-411-audio-4` | `shoferey.ogg`; нет отдельной подписи в снимке | `track-04`; `Запись 4` | `site/assets/audio/karim-nazarova/shoferey.ogg` | 967,938 | `f1d6f078a56fdd12fc7ae2573d5b95340dfcd0beb5af2202999b8b0df2a3d1c0` | ok |
| `reading-411-audio-5` | `tiugan.ogg`; нет отдельной подписи в снимке | `track-05`; `Запись 5` | `site/assets/audio/karim-nazarova/tiugan.ogg` | 2,160,820 | `6daccf1b3925af0894a5a0cd7548bbb381d6c522f0ddaefe348283772d65419c` | ok |
| `reading-414-audio-1` | `01.ogg`; `01 Все просто..` | `track-01`; `01 Все просто..` | `site/assets/audio/karim/01.ogg` | 694,971 | `b3a171e2d4e914285994b36195c20517b9c00306705efa8240fd771b4382bad7` | ok |
| `reading-414-audio-2` | `02.ogg`; `02 Цветы на камне` | `track-02`; `02 Цветы на камне` | `site/assets/audio/karim/02.ogg` | 408,652 | `75f5625a1834f5596e81b205e73d95702f43baeff899289901ae58c4fd0c48fc` | ok |
| `reading-414-audio-3` | `03.ogg`; `03 Три дня подряд` | `track-03`; `03 Три дня подряд` | `site/assets/audio/karim/03.ogg` | 467,720 | `cc8de21056317147fed8c9633613a8501c5eb9abc691b4278ab0a723501e9a12` | ok |
| `reading-414-audio-4` | `04.ogg`; `04 Эту песню мать мне пела` | `track-04`; `04 Эту песню мать мне пела` | `site/assets/audio/karim/04.ogg` | 433,051 | `ca26eef1d8c4b0ad82511c176500acbb3fb6f1747024127f9646071c277bc975` | ok |
| `reading-414-audio-5` | `05.ogg`; `05 Подует ветер` | `track-05`; `05 Подует ветер` | `site/assets/audio/karim/05.ogg` | 350,921 | `9aa92f78b173c6cffd15ccbb6764d8d269876ffb99577d9bc6c0ffcb3a4a6070` | ok |
| `reading-414-audio-6` | `06.ogg`; `06 Берега остаются` | `track-06`; `06 Берега остаются` | `site/assets/audio/karim/06.ogg` | 651,165 | `feab4b42cda39e5270052ff4ff16713a684d51c25ae0af5c4c4d3f2edb74b4a8` | ok |
| `reading-414-audio-7` | `07.ogg`; `07 Мужчины дарят женщинам цветы` | `track-07`; `07 Мужчины дарят женщинам цветы` | `site/assets/audio/karim/07.ogg` | 241,435 | `3d92d667d734b0e15b384308d87adf62b242202b376d51989c67e0f5f17d3c4b` | ok |
| `reading-414-audio-8` | `08.ogg`; `08 Карусель все вертится` | `track-08`; `08 Карусель все вертится` | `site/assets/audio/karim/08.ogg` | 917,894 | `0a7cb669d47e43ca05c6814c078b3dcd9d25ab96f957c9ba17fff9be75b0f8be` | ok |
| `reading-414-audio-9` | `09.ogg`; `09 Горы` | `track-09`; `09 Горы` | `site/assets/audio/karim/09.ogg` | 760,417 | `9c32127366af881d86486159b58e47122a0112de410988ad2c5173c59ec8f49b` | ok |
| `reading-414-audio-10` | `10.ogg`; `10 Я белый лист кладу перед собой` | `track-10`; `10 Я белый лист кладу перед собой` | `site/assets/audio/karim/10.ogg` | 547,205 | `973cd09021b7acaf9b399ccd3c4cf84b5ff167b687f01d16a5fb359bb6087364` | ok |
| `reading-414-audio-11` | `11.ogg`; `11 Была моя жизнь непрерывной игрой` | `track-11`; `11 Была моя жизнь непрерывной игрой` | `site/assets/audio/karim/11.ogg` | 506,983 | `b7748bfd165ddeafab3179e7f1f3ae20fc2698b6c8425193c1118981ed68bf78` | ok |
| `reading-414-audio-12` | `12.ogg`; `12 Ночами разговаривают реки` | `track-12`; `12 Ночами разговаривают реки` | `site/assets/audio/karim/12.ogg` | 270,633 | `a540d26c3fadd46d279c6e5ecea54d11ec4b8d1f06b91e9827a9fe84d7d1e665` | ok |
| `reading-414-audio-13` | `13.ogg`; `13 В дороге-ноги` | `track-13`; `13 В дороге-ноги` | `site/assets/audio/karim/13.ogg` | 534,345 | `eefd2e65c825a019f9cfd799e848bd012071aff17e07f87ff0de54093f3e96b8` | ok |
| `reading-414-audio-14` | `14.ogg`; `14 Я знал успех` | `track-14`; `14 Я знал успех` | `site/assets/audio/karim/14.ogg` | 271,204 | `4227cca40ebca3750c27ef84ee65d6878b4baceab300b1b25d7b9fc18e0d5864` | ok |
| `reading-414-audio-15` | `15.ogg`; `15 А бывает в природе такая пора` | `track-15`; `15 А бывает в природе такая пора` | `site/assets/audio/karim/15.ogg` | 167,916 | `fc16cac1bde244235aacebeb7a51f84e5e7ad3d8b1e95e92f02c61cc46c15569` | ok |
| `reading-414-audio-16` | `16.ogg`; `16 Я умному тайну открыл` | `track-16`; `16 Я умному тайну открыл` | `site/assets/audio/karim/16.ogg` | 121,812 | `4fb57a36ef31c049887aded58c72b8cb3741e35fc10e3690f74619034bd8ffa5` | ok |
| `reading-414-audio-17` | `17.ogg`; `17 Белое и черное` | `track-17`; `17 Белое и черное` | `site/assets/audio/karim/17.ogg` | 142,238 | `59bf97eed9534e77678557929da8173ff08ef8271e30e3c39060ffc968447993` | ok |
| `reading-414-audio-18` | `18.ogg`; `18 Птиц выпускаю` | `track-18`; `18 Птиц выпускаю` | `site/assets/audio/karim/18.ogg` | 816,876 | `fcd3d03de7bdea95f41a941a3ea3fe4b218abb3b8afef4dd55a7d01c35f41a24` | ok |

## Декодирование, длительность и работа плеера

`afinfo` и `afconvert` не поддержали эти Ogg Vorbis-файлы (ошибка открытия входного файла). В среде не обнаружены `ffmpeg`/`ffprobe`, `ogginfo`, `oggdec`, `oggz-validate`, `sox`, GStreamer или установленные Python-модули `mutagen`/`soundfile`/`av`, поэтому независимое декодирование и длительность не подтверждены. Команда `file` подтверждает распознаваемый заголовок Ogg Vorbis, но не полноценное декодирование, отсутствие повреждения в конце или пригодность содержимого к воспроизведению.

Плеер в браузере, реальное воспроизведение, звук и перемотка (включая середину/конец) не проверены. Управляемый browser connector не нашёл браузер; Firefox виден как открытое desktop-приложение, но browser automation для него недоступна. HTTP-проверка локальной страницы тоже не состоялась: доступный `127.0.0.1:8883` отказал в соединении, а запуск стандартного `python3 -m http.server` на локальном порту завершился `PermissionError: Operation not permitted`. Файловые ссылки проверены разбором относительных путей на диске, а не HTTP GET.

Ни воспроизведение, ни декодирование, ни перемотка не заявляются. Свежая повторная загрузка исходных URL не выполнялась; исторические HTTP 200 / `audio/ogg` в `downloads.tsv` и совпадение локальных хешей с `SHA256SUMS` не равны независимой source-to-target проверке. Поэтому все 23 строки корректно остаются `discovered` до проверки воспроизведения и идентичности относительно доступного источника.
