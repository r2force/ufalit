# Aksakov gallery content verification

- Date: 2026-11-14
- Target: `site/pages/gallery-aksakov/index.html`
- Scope: all 15 category entries and target placements, captions/order, fresh download bodies versus assigned local assets, and local page references. Layout/design was not evaluated.

## Findings

- The saved category snapshot `migration/evidence/2026-11-11/gallery-aksakov.html.gz` lists 15 photo entries in the order shown below. It is intentionally not numeric ID order: item `312` (source label `01 (8)`) is first, followed by `305`–`311`, then `313`–`319`.
- I compared each source category caption with its saved detail snapshot under `migration/evidence/2026-11-11/aksakov-details/` and the corresponding target `<figcaption>`. All 15 match after whitespace/entity normalization. Figure order, image IDs, and local destinations match the source sequence. Target `alt` text carries the same caption; the one visible whitespace variation in the theater caption (`Арт  - кафе`) is presentational whitespace only.
- I independently computed SHA-256 for all 15 fresh bodies `/private/tmp/gallery-aksakov-repeat-<ID>.jpg` and compared them with `site/assets/gallery/aksakov/<ID>.jpg`. All 15 pairs are byte-for-byte identical; sizes and digests are listed below.
- Each figure's `href` and `img src` point to the same corresponding local file. All 40 local `href`/`src` references on the target page resolve relative to its directory.

| Position | Source label | ID | Category/detail/target caption | Target local file | Bytes | Fresh-source SHA-256 = local SHA-256 |
|---:|---|---:|---|---|---:|---|
| 1 | 01 (8) | 312 | Сергей Аксаков | `site/assets/gallery/aksakov/312.jpg` | 23937 | `770b0eaa20fdebc414ad2d55a5266cb366e976c5c8215cfe5c58c23962677a4c` |
| 2 | 01 (1) | 305 | Аксаковская гимназия | `site/assets/gallery/aksakov/305.jpg` | 44909 | `3406754a8635862265f65d2a5465eb32796c7c463418eff509f2c49b74c1d2a4` |
| 3 | 01 (2) | 306 | Бюст Аксакова | `site/assets/gallery/aksakov/306.jpg` | 587574 | `e8d9b835b9c4c245f5c5fd6a197585cb78588ec33453ea31eaddea27901e0c93` |
| 4 | 01 (3) | 307 | Генеалогическое древо Соколовых | `site/assets/gallery/aksakov/307.jpg` | 3098821 | `380df071b3cb8b22bca7fc770ba062b0c6a9932281d06248abac11dde5d1876b` |
| 5 | 01 (4) | 308 | Дом губернатора | `site/assets/gallery/aksakov/308.jpg` | 728032 | `d7a6e397b32450c237ec8bbf47e3d236c61705195d5c1fa4759709cedb0c938d` |
| 6 | 01 (5) | 309 | Карта аксаковских мест | `site/assets/gallery/aksakov/309.jpg` | 1341192 | `45379c48dc89f87ffc085b321a847218a4553a1435429e5dd29b74576311bd3f` |
| 7 | 01 (6) | 310 | Мемориальный знак | `site/assets/gallery/aksakov/310.jpg` | 944241 | `fbaa9bae967f0ad4a3f48452840f8aafd315e1a762f99b97d448b02c9f0e008a` |
| 8 | 01 (7) | 311 | Сад Аксакова | `site/assets/gallery/aksakov/311.jpg` | 752483 | `4bcc65eb3c664ee983214639a2dde6f85549590f4cd98be469a9c2d08ae020b2` |
| 9 | 01 (9) | 313 | Скульптура Аленький цветочек | `site/assets/gallery/aksakov/313.jpg` | 746684 | `a63220c7c73687b94d5dfd3761ebfc15301796ab0607a8266b24a9293c6b90a7` |
| 10 | 01 (10) | 314 | Театр Арт  - кафе Аленький цветочек | `site/assets/gallery/aksakov/314.jpg` | 741288 | `2768bff7e991540f160ee3766f2bec0115cf074a284720b40da5c8472e48d769` |
| 11 | 01 (11) | 315 | Улица Аксакова | `site/assets/gallery/aksakov/315.jpg` | 76432 | `ae0c3917dc0e06644b989f47f33cc4379668a904659c60e50e3656224143c07c` |
| 12 | 01 (12) | 316 | Улица Аксакова | `site/assets/gallery/aksakov/316.jpg` | 86122 | `ce43d237151727ca0907c0d936fc5d35924661f93e90519129cfcf03c23c7a9d` |
| 13 | 01 (13) | 317 | Улица Аксакова | `site/assets/gallery/aksakov/317.jpg` | 203363 | `b9408464c722e2cd850cfb5fcff7d22f6e77eb7c7222738e02d187db474efcc4` |
| 14 | 01 (14) | 318 | Читальня в Аксаковском саду | `site/assets/gallery/aksakov/318.jpg` | 470630 | `669a30b945f6f1cba1ec33ed07c1e6d0f252ce0d20013c2f3c5d514c56d768d1` |
| 15 | 01 (15) | 319 | Аксаковский народный дом | `site/assets/gallery/aksakov/319.jpg` | 1076930 | `48bdff857950ec34e47764f42324e8a4b5742c2e24ff352339913b3a6a579a27` |

## Limits

- This check establishes byte identity from repeated source downloads to assigned local assets and text/order correspondence to saved category/detail HTML. I did not perform a separate visual scene-by-scene review or browser check.
