# Gallery 14 — capture and parity candidates

**Source category:** `https://ufalit.ufacsdb.ru/index.php?Itemid=88&id=14:2012-12-25-05-41-14&option=com_phocagallery&view=category`  
**Target:** `site/pages/gallery-14/index.html`  
**Capture date:** 2026-11-13 (UTC dates in response headers)  
**Independent review:** `migration/evidence/gallery-14/VERIFY-REPORT.md`

## Candidate files

- `assets-candidate.csv` contains 13 source image download URLs, target paths, response status/MIME/size, local SHA-256, and evidence paths.
- `content-parity-candidate.csv` follows the repository parity schema and contains 41 proposed rows: 28 text rows (category heading/count and 13 item labels plus 13 captions) and 13 image placements.
- Text statuses are `matched`: heading, item labels, and all captions were checked against the saved category/detail HTML and the target page. Caption/order comparisons are summarized in `TEXT-REPORT.md`.
- Image asset rows are `captured` because local JPEG files exist and saved headers document successful image responses. Image content-parity rows remain `discovered`; do not mark them `matched` or `verified` based on the current evidence.

## Capture facts

The category snapshot and all 13 detail snapshots have saved HTTP response headers; the category and detail pages returned HTTP 200 with `text/html; charset=utf-8`. The response timestamps are on 2026-11-13 UTC. The source page lists 13 images in this order: 639–650, then 852. Detail snapshots identify the corresponding original filenames `0 (1).jpg` through `0 (13).jpg` and preserve the captions. No additional content pages were found in the assigned category/details.

All 13 saved image response headers report HTTP 200 and `image/jpeg`. Each local JPEG is non-empty; its byte count exactly matches the image response `Content-Length`. The local byte count and SHA-256 are recorded row-by-row in `assets-candidate.csv`. The source response body hashes are not available in the saved headers, so the local hashes identify only the local files and cannot prove binary identity with source originals.

## Remaining limits

- The browser was unavailable/blocked during independent review. Source originals and the target page could not be opened for visual comparison, link activation, or wide/narrow layout checks.
- Matching response sizes, gallery IDs, filenames, and captions does not prove that each local photograph depicts the same source image. Keep all 13 image rows as `discovered` in content parity; assets may remain `captured`.
- The source was not rechecked after the 2026-11-13 snapshots.
- The original category's “Category List” link points to the existing gallery categories listing (`https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=categories&Itemid=88`). No new content page was found. The 13 detail pages are represented in the single static gallery. There are no new child-category or pagination URLs from this category.
- The external footer destination `http://csdb.ufanet.ru` is retained on the target; its availability was not checked.

Do not merge these candidates into shared registries as verified image matches. Independent browser comparison and source-original identity checks remain open.
