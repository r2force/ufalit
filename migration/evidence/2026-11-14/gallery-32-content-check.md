# Gallery 32 content verification

**Result: 12/12 photographs match** across source snapshots, fresh repeat downloads, target figures, and recorded capture metadata.

## Findings

- Extracted category sequence is IDs 473–484; target figure order is identical. For every item, the category title, content-parity label, target `figcaption`, and matching `detail-ID.html` snapshot agree exactly.
- Each category item links to the expected detail identity (`catid=32:doqumenty`, matching item ID). Each target `img src` and enclosing `a href` resolves to its assigned local asset.
- Compared each local file with its fresh `/private/tmp/gallery32-repeat-ID.jpg` body. All 12 files are byte-identical. Independently calculated SHA-256 and byte sizes match the `original-ID` rows in `source-fetch-metadata.csv`; repeat response headers show HTTP 200 and `image/jpeg`.
- Capture metadata records the source through the PhocaGallery `phocadownload=2` URL, while content-parity `source_ref` records the corresponding direct image URL. Both identify the same numbered asset and category; their URL forms differ because the capture used the component download endpoint.

## Per-item evidence

| ID | Exact source/target label | Assigned target | Bytes | SHA-256 | Fresh body / capture record / links |
|---:|---|---|---:|---|---|
| 473 | IMG_1028 | `site/assets/gallery/32/IMG_1028.jpg` | 35395 | `8f569e72fe7930c72edb421431d4ba8fe969b171635ade9a7d8af5039e4dccd6` | match |
| 474 | IMG_1029 | `site/assets/gallery/32/IMG_1029.jpg` | 50964 | `07542a1cbf7ee3a0ba40dfc3d6828c7fbe0e3244461f969b9d6e556bb7d41bc8` | match |
| 475 | IMG_1032 | `site/assets/gallery/32/IMG_1032.jpg` | 58360 | `dbc2ba6d00bf77a06d30da53bf85e2237ed8cf48e13babb948d4d426f5d7722f` | match |
| 476 | IMG_1035 | `site/assets/gallery/32/IMG_1035.jpg` | 39213 | `43ec78dd6f74708fbca532c02174af1ca6df0dc4c83b496ea4493a19c451639c` | match |
| 477 | IMG_1041 | `site/assets/gallery/32/IMG_1041.jpg` | 48442 | `867ca1c188a6f493d5aa954467510e889a56045a4f63d2a7fe7dbc3f5f9dafa8` | match |
| 478 | IMG_1046 | `site/assets/gallery/32/IMG_1046.jpg` | 35693 | `3058d2c548e41b305a9f70660775439f8cbe69dec59f3c32c9ea2ce0098b7bee` | match |
| 479 | IMG_1047 | `site/assets/gallery/32/IMG_1047.jpg` | 52168 | `c76d3d9508554e30a47a0def3afda53c51d5dfcb48fac2b18e1977dc446697b9` | match |
| 480 | IMG_1050 | `site/assets/gallery/32/IMG_1050.jpg` | 41768 | `a2b13672665e9f8830d60c76b9b928319c1c714cd413054a17ce346fe1e95c9b` | match |
| 481 | IMG_1051 | `site/assets/gallery/32/IMG_1051.jpg` | 41618 | `7b82f8712654a4f8cc3e289729f839458befbfd2a03dde36507cf2977f9e1573` | match |
| 482 | IMG_1052 | `site/assets/gallery/32/IMG_1052.jpg` | 37703 | `a04e2d39871f3f845a9e79beecb5d34c3919c7e68752293453b4326e5e840031` | match |
| 483 | IMG_1055 | `site/assets/gallery/32/IMG_1055.jpg` | 39800 | `1957ab62ff17634a3f04d206bf6c0e6707f3047684608513f9bee50fca590226` | match |
| 484 | IMG_1064 | `site/assets/gallery/32/IMG_1064.jpg` | 49544 | `2c0871ee5764f0c4c6bf502aa7717757332709e38c898af94a9718d05ff9f317` | match |

## Limits

This review establishes source-to-target byte identity and label/order/placement using saved snapshots and supplied repeat downloads. I did not separately interpret each depicted document visually, assess design, or render the page in a browser. No live-source re-fetch was performed.

## Evidence

- `migration/evidence/2026-11-12/gallery-32/category.html` and `detail-473.html` through `detail-484.html`
- `migration/evidence/2026-11-12/gallery-32/content-parity.csv` and `source-fetch-metadata.csv`
- `/private/tmp/gallery32-repeat-473.jpg` through `gallery32-repeat-484.jpg`, with matching `.headers` files
- `site/pages/gallery-32/index.html` and target files in the table
