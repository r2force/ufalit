# Gallery 12 — capture report

**Source:** `https://ufalit.ufacsdb.ru/index.php?Itemid=88&id=12:2012-12-25-05-40-35&option=com_phocagallery&view=category`  
**Target:** `site/pages/gallery-12/index.html`  
**Captured:** 2026-11-13; source response timestamp 2026-11-13 06:38:33 UTC.  
**Category source SHA-256:** `fa52efc70f16ca1fed0b6031ccd55ab93a3099ae3f132e8736701b04f5d8788b`

## Scope and findings

The live category returned HTTP 200 and contains 18 photographs in source order, with no pagination controls or additional category pages. IDs are 620–624 and 626–638; ID 625 / filename `0 (6)` is absent from the live category. Each item’s source label (`0 (n)`) is preserved alongside the description found in its detail page. The associated title “Короленко Владимир Галактионович” comes from the previously captured category listing (`migration/evidence/2026-11-11/galleries.html.gz`); the category response itself exposes only the generic heading “Фотогалерея”.

All 18 Phoca Gallery `phocadownload=2` endpoints returned JPEG originals, HTTP 200, MIME `image/jpeg`; exact sizes and SHA-256 hashes are recorded per resource in `source-fetch-metadata.csv`. They are saved under `site/assets/gallery/12/photo-<id>.jpg` and placed in the same order. Detail pages contain the captions listed below; no extra pages or articles were discovered.

## Captions and originals

| ID | Source label | Detail caption | Bytes | SHA-256 |
|---:|---|---|---:|---|
| 620 | 0 (1) | Богданович Т. А. | 31637 | `e7f162d47f1c2f6627ba6af7b68377c4ee517421c91f3bf7283ea385f75a4eeb` |
| 621 | 0 (2) | Гурвич Н. А. | 18953 | `2412d1792ea16096d7d102d4b40b33bf76e3ced89e0906b380e9bb343d0a1e67` |
| 622 | 0 (3) | Гурвич Н. А. | 28927 | `6526dcea5c99eadcceac1bc57e05d566ed97295891b41c78fcf3ee8430c5efd8` |
| 623 | 0 (4) | Добротворский П. И. | 27814 | `5926e347b3d8189438f2d3bbcc8b2e91e4a20f6f213b8ac61d28dc10a0861ecc` |
| 624 | 0 (5) | Дом по ул. Аксаково, 49, где проживал В. Г. Короленко | 41250 | `463108fa93b0abe4744aa43b717bb78459b500e8dec9377546637a637be49238` |
| 626 | 0 (7) | Камера Короленко | 23440 | `d349cf9cab73e2eecc62e185cee3cb428563cdb0e3d0fdc5f076a7c58056bae2` |
| 627 | 0 (8) | Крашенинников Н. А. | 27436 | `3acbfc493b9069b6665c27a4844187d696d653d474793e7ee65da8f14ea03793` |
| 628 | 0 (9) | Сотрудники журнала Русское богатство | 86925 | `ff02f6a5a0c75d82f53f97d5cbc36dfae482dff7c22d2e0851b98da505794704` |
| 629 | 0 (10) | Улица Аксакова | 25342 | `4245e5dda13a894cd0f4933314e98762a41eab9d69d7cb2fec278fc80110659c` |
| 630 | 0 (11) | Улица Аксакова | 31157 | `4f702bb52841e3ebe9c48bf80a083f3ea72f36d651d0092ffaefd2f4ea1b807b` |
| 631 | 0 (12) | Улица Аксакова | 26577 | `4750ccee8ff2bef5a0e5d480c474db39772864c8ff6c132e90eff63d739a6429` |
| 632 | 0 (13) | Улица имени Короленко | 48579 | `a094aabf300de8a6b787c04205f1c8ec170e607c2a9e1e0e5329169faea93828` |
| 633 | 0 (14) | Улица имени Короленко | 86178 | `f7bf9957b02f263fa51a09edde922141a0f13b8dce9c98403e653eea1b557fd6` |
| 634 | 0 (15) | Улица имени Короленко | 39592 | `b6a9d7bf7a94ef14e1503423487388c0962b4bdbd7c58cf0e44ee413cd52ce75` |
| 635 | 0 (16) | Улица имени Короленко | 27908 | `45f588989b43687defca824c26aa3dcb8417d93d9854b762ac872c9628ea4795` |
| 636 | 0 (17) | Успенский Г. И. | 18114 | `6e57a8b0b88d516ca6c490ba5fe7488630ba54e1d57e17ffdf9dd6699b500c4a` |
| 637 | 0 (18) | Швецов С. П. | 49451 | `d6399b5270ccea2f23610851f956ad6ad37f6259ee3638df48f3953c62fe72c6` |
| 638 | 0 (19) | Якутский городок | 31293 | `f8cfea0c43b5746b3dfccb969c9faff53e62a9270e2289968bb4a594864f6052` |

## Parity and evidence

`content-parity.csv` uses the required schema and has 56 rows: 38 text placements (category title/count plus 18 filename labels and 18 detail captions) marked `matched`, and 18 image placements marked `discovered`. The image statuses remain `discovered` until visual comparison of the rendered page confirms identity and placement, as requested. No video or document was present on this category or its detail pages.

Evidence files include the live category HTML and response headers, all 18 detail HTML pages and headers, all 18 full-size JPEG responses and headers, a dated fetch manifest with status/MIME/bytes/SHA-256, and `content-parity.csv`.

## Checks and limitations

- Every detail request and original download returned HTTP 200; every downloaded image is a valid non-empty JPEG. Full-size files range from 332×533 to 1071×556 pixels.
- The page has 45 local `href`/`src` references; all resolve to existing files. Image verification is limited to file integrity and placement markup; the rendered page could not be opened in the available browser UI, so the image items remain `discovered`.
- Category text in its HTTP response includes some bytes that are invalid UTF-8 despite its `charset=utf-8` header; gallery labels and captions used here are valid and were read from the preserved responses.
- A static category-list landing page is not present in this assigned scope. The existing site navigation links “Фотогалерея” to `gallery-aksakov`; this mapping follows the existing page pattern. The category-list link was not re-created as a new page.
- The source’s parent category listing was captured earlier; the direct category and details were refreshed on 2026-11-13. No later freshness pass was made. No video or document was found.

## New queue links

No new content pages were discovered. The category’s “Category List” link goes to the already inventoried gallery-categories page; the 18 detail pages are folded into this static gallery and have no separate public navigation requirement.
