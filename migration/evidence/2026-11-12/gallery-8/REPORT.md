# Gallery 8 migration report

- Source category: https://ufalit.ufacsdb.ru/index.php?Itemid=88&id=8:2012-12-25-05-39-45&option=com_phocagallery&view=category
- Target page: `site/pages/gallery-8/index.html`
- Category title: «Ибрагимов Галимджан Гирфанович».
- Current full source response: `source-current.html.gz`, HTTP 200, headers in `source-current.headers`; a previous source capture is retained in `../../2026-11-11/batch-2/gallery-8.html.gz`.
- Scope: all 30 category entries, 30 detail pages, and 30 full image download endpoints. The previous snapshot and live listing have the same ordered images and captions (`source-diff.txt`). No pagination controls or next page were present in the current response.
- Detail page bodies and response headers are in `details/`; response ledger is `detail-responses.tsv`. All detail requests returned HTTP 200.
- Every description in the category and its detail page matches exactly. The same text is present in the local figure caption; see `captions.tsv`. The page title was copied from the parent gallery list. Text rows are `matched` in `content-parity.csv`.
- All 30 image originals returned HTTP 200 and image MIME (JPEG/PNG); size and SHA-256 per entry are in `assets.csv`. Raw response headers are `original-<id>.headers`. The 518 original response body is also retained as `original-518.bin`.
- Seven byte-identical files were reused from other site assets by SHA-256, and their duplicate copies were removed from `site/assets/gallery/8/`. The remaining 23 originals are new files in `site/assets/gallery/8/`. Their exact shared paths and hashes are in `assets.csv`.
- The local page preserves the original item order and descriptions. Each image opens its local original; the existing responsive `.gallery` styles provide the layout.
- Internal stylesheet, navigation, gallery breadcrumb, and 30 image links were checked against local paths. No external image dependency remains.
- Image content rows remain `discovered` pending visual confirmation of subject and correct placement, as required. No browser visual review was performed.
- No new queue links: no additional pages, pagination, or child categories were found.

Changed page/evidence paths: `site/pages/gallery-8/index.html`, `site/assets/gallery/8/`, and `migration/evidence/2026-11-12/gallery-8/`. Common assets and shared registries were not modified.
