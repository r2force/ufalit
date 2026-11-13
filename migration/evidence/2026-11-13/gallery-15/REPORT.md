# Gallery 15 — capture and parity candidates

**Source category:** `https://ufalit.ufacsdb.ru/index.php?Itemid=88&id=15:2012-12-25-05-41-29&option=com_phocagallery&view=category`  
**Target:** `site/pages/gallery-15/index.html`  
**Snapshot date:** 2026-11-13  
**Text comparison:** `migration/evidence/2026-11-13/gallery-15/TEXT-REPORT.md`  
**Image capture evidence:** `migration/evidence/2026-11-13/gallery-15/IMAGE-REPORT.md` and `fetch-log.tsv`

## Candidate files

- `assets-candidate.csv` follows the shared asset schema and has 17 image rows with the original source URL, used-by category URL, local target path, HTTP status, MIME, bytes, SHA-256, date, and evidence paths. All rows are `captured`.
- `content-parity-candidate.csv` follows the shared content parity schema and has 52 rows: 35 text placements and 17 image placements. The category heading, source image labels, and captions are proposed as `matched`; all images remain `discovered` pending independent image-to-placement review.
- The new interface count «17 фотографий» is derived from the category entries, not an explicit source text block, so it is intentionally not represented as a source text row. The added instruction for opening a full-size image is also interface text, not a parity item.

## Text and order

The category heading «Фотогалерея» and all 17 labels/captions were compared against the preserved category/detail snapshots and the current target page. The detail captions agree with category captions in the same order. Image IDs in sequence are 651, 652, 653, 655–668; the source filename label `0 (4)` is absent and no gallery item was invented for it. Text comparison details and the full caption list are in `TEXT-REPORT.md`.

## Image capture facts

The saved category returned HTTP 200 with `text/html; charset=utf-8` on 2026-11-13 07:42:36 GMT. Its body is 37,221 bytes with SHA-256 `a6cefcc05c6a558d94a589be253404dc93255f35a94b9a5e1bd65d65d033b606`. The first detail snapshot returned HTTP 200 with `text/html; charset=utf-8` on 2026-11-13 07:42:58 GMT; the other 16 saved detail responses are also HTTP 200 HTML, as documented in `IMAGE-REPORT.md`.

All 17 original image responses returned HTTP 200 and `image/jpeg`. Their source response dates, exact URL, byte count, SHA-256, dimensions, and local filename are recorded per row in `fetch-log.tsv` and `assets-candidate.csv`. The 17 originals total 837,933 bytes. Local-file sizes and hashes were checked against the fetch log while preparing these candidates. Image #653 (`0 (3).jpg`) has the same SHA-256 as the existing `site/assets/persons/sotnikov/01.jpg`; its gallery copy was left in place and no image file was changed.

Asset capture does not settle the content-parity status: the image evidence report explicitly leaves visual comparison of originals and their page placement open. Consequently, every image placement stays `discovered` in the parity candidate; do not promote these rows to `matched` or `verified` from the capture metadata alone.

## Links and remaining checks

- The category's “Category List” link points to `https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=categories&Itemid=88`, the existing gallery-categories listing. The category has no newly found child-category or pagination URLs. Its 17 detail pages are represented in this static gallery rather than separate target pages.
- The existing footer points to `http://csdb.ufanet.ru`; external availability is not established here.
- The original category/details have not been refreshed after the 2026-11-13 snapshots. The source capture report records visual image-to-placement comparison as open.
- The target uses local assets under `site/assets/gallery/15/`; source originals are not required at runtime. The image links and CSS use relative paths that resolve from the `/ufalit/` subpath.

These CSVs are candidates for review only. Shared registries and Git were not changed.
