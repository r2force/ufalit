# Gallery 37 — capture and parity candidates

**Source:** `https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=category&id=37%3A2012-12-30-08-42-35&Itemid=88`  
**Target:** `site/pages/gallery-37/index.html`  
**Capture date:** 2026-11-13  
**Evidence:** `category.html`, `details/{ID}.html`, `fetch-log.tsv`, `IMAGE-REPORT.md`, `TEXT-REPORT.md`, `VERIFY-REPORT.md`

## Candidate files and statuses

- `assets-candidate.csv` follows the shared asset schema and records all 23 original image URLs and local paths with HTTP status, MIME, byte size, SHA-256, response date, and per-file evidence. All 23 asset rows are `captured`.
- `content-parity-candidate.csv` follows the shared content parity schema and has 49 rows: 26 text placements and 23 image placements. The category name, component heading, parent label, and 23 source image labels are `matched`; all 23 image placements remain `discovered` because no direct source image body is retained for comparison.
- No invented photo captions or category count were added. Source detail pages and `IMAGE-REPORT.md` state there are no separate descriptive captions. Existing `title`/`alt` filename labels are retained; the page repeats them in `figcaption`.

## Capture facts

The saved category response is HTTP 200 with `text/html; charset=utf-8`; `category.html` is 44,700 bytes and has SHA-256 `9d8a4c919cdc453ef5944ea6fab11462abc5e85887892d7e1c24322e5eb6bce6`. All 23 detail pages returned HTTP 200 HTML. Each original returned HTTP 200 and `image/jpeg`. Original URL, response time, byte count, capture SHA-256, pixel dimensions, and target file are recorded per row in `fetch-log.tsv` and `assets-candidate.csv`.

The independent checker recalculated all 23 local file hashes and sizes against the capture journal; all agree. The journal's capture hashes establish the identity of the saved bytes relative to the original download event, but the original image response bodies were not separately retained in evidence for a second source-body comparison. Thus asset capture is recorded, while parity image rows stay `discovered`.

The source order is 675–696 followed by 715 (`01.jpg`), with exact source label/alt values preserved. The final item is last despite its ID gap. `01.jpg` is also an exact local duplicate of `site/assets/persons/hudaiberdin/01.jpg`; both files remain unchanged. The two failed initial requests noted in `IMAGE-REPORT.md` were retried successfully and do not represent missing images.

## Text and remaining checks

`VERIFY-REPORT.md` confirms the source order, each ID and label, target locator, local path, and capture-journal metadata for all 23 items. It reports no source descriptive caption blocks. The category component heading is «Фотогалерея»; the category name «Музей, премия» is taken from the source parent gallery 17 listing. No separate textual count was present or added.

The checker visually inspected the local files but could not compare them directly against original image bodies because those source bodies were not retained. The source page was not openable in the browser, so browser rendering, source-to-local visual comparison, and wide/narrow layout review remain open. The source has not been refreshed after the 2026-11-13 snapshots. Full detail for text and page limits is in `TEXT-REPORT.md` and `VERIFY-REPORT.md`.

These CSVs are candidates only. Shared registries and Git were not changed.
