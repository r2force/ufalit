# Gallery 30 content verification

**Result: 7/7 entries matched** in the source category/detail snapshots and target page. Local asset hashes and sizes match the captured original metadata.

## Findings

- Category snapshot order is IDs 466–472; target figure order matches exactly. Each category title, label row, target caption, and corresponding detail snapshot agree.
- For each entry, the target `img src` and enclosing `a href` resolve to the assigned local asset. The category source links identify the same item ID within `catid=30`.
- The first comparison pass had the seven `/private/tmp/gallery30-repeat-ID.jpg` files available. The recorded per-item command output showed byte-for-byte equality between every repeat file and its target, and all seven repeat response headers were HTTP 200 `image/jpeg`. Independent local SHA-256 and byte sizes also match each `original-ID` record in `source-fetch-metadata.csv`.

## Per-item evidence

| ID | Exact source/target label | Assigned target | Bytes | SHA-256 | Captured original metadata |
|---:|---|---|---:|---|---|
| 466 | 1IMG_1044 | `site/assets/gallery/30/466.jpg` | 30056 | `69dfda6b6e5aba7feb8b05b2b79d5b3608aae6690e0ccf400e00506856e92670` | match |
| 467 | 300px-Su-27_UMPO_(Ufa) | `site/assets/gallery/30/467.jpg` | 19092 | `2466b57b8ae1dfd13e0b624aba433bc4f789f9fc19b713279797096e9fd5b601` | match |
| 468 | IMG_1044 | `site/assets/gallery/30/468.jpg` | 2268920 | `b80e4836fd40e24dc44b06a94cdfa86ff9afdbde9965cbb5fa5a0f38c2027f2c` | match |
| 469 | IMG_1045 | `site/assets/gallery/30/469.jpg` | 35188 | `a83768ae8d65b572db318d503fbd1427374700988611f875135b2c0ef1b26d59` | match |
| 470 | IMG_1068 | `site/assets/gallery/30/470.jpg` | 39014 | `b4a61f11ffd042fb85ee9f0a9127b18438191dec713aac214d4c74184c283ee8` | match |
| 471 | IMG_1075 | `site/assets/gallery/30/471.jpg` | 62201 | `ef09d4e160639af5e9f926b111a5e730f7c297ee17544ccd651f57021da438d0` | match |
| 472 | IMG_1081 | `site/assets/gallery/30/472.jpg` | 58153 | `39e5c97b486aa172e544160b4dcb2facdf69e11031fd776b29fe8132e54440af` | match |

## Limit

The `/private/tmp/gallery30-repeat-*` files and their headers had been removed by the time the report was written, so the repeat-file comparisons could not be rerun. The byte-equality results above are from the completed first pass in this verification turn; the current local-file checks were reproduced against the persistent capture SHA-256/size records. I did not visually interpret the scenes or render the page in a browser.

## Evidence

- `migration/evidence/2026-11-12/gallery-30/category.html` and `detail-466.html` through `detail-472.html`
- `migration/evidence/2026-11-12/gallery-30/content-parity.csv` and `source-fetch-metadata.csv`
- `/private/tmp/gallery30-repeat-466.jpg` through `gallery30-repeat-472.jpg` and their `.headers` files (present and compared during the first verification pass; removed before report completion)
- `site/pages/gallery-30/index.html` and the target files in the table
