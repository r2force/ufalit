# Gallery 38 — capture and parity candidates

**Source:** `https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=category&id=38%3A2012-12-30-08-42-58&Itemid=88`  
**Target:** `site/pages/gallery-38/index.html`  
**Capture date:** 2026-11-13  
**Evidence:** `category.html`, `details/{ID}.html`, `fetch-log.tsv`, `IMAGE-REPORT.md`, `TEXT-REPORT.md`, `VERIFY-REPORT.md`

## Candidate rows

- `assets-candidate.csv` follows the shared assets schema. It lists all 17 source image URLs, local targets, HTTP status, MIME, bytes, SHA-256, response date, and evidence. Each row is `captured`.
- `content-parity-candidate.csv` follows the shared content parity schema and has 37 rows: 20 text placements and 17 image placements. The title «Экскурсия по мемориальному уголку», generic heading «Фотогалерея», parent-category label, and 17 source filename labels are `matched`; image placements remain `discovered` pending direct source-to-target body comparison.
- Source and detail snapshots contain no separate descriptive photo captions. The target uses only the actual `title`/`alt` filename labels; no descriptions or separate photo count are proposed as source text.

## Capture facts

The saved category snapshot is 36,625 bytes with SHA-256 `70267afd0dd28796d40e2bb2919b5efab0829d7e24338cb0763632164b9676f5`; its headers report HTTP 200 and `text/html; charset=utf-8`. All 17 detail pages also returned HTTP 200 HTML. Each original image response returned HTTP 200 and `image/jpeg`. Exact source URLs, response timestamps, bytes, capture SHA-256 values, pixel dimensions, and local paths are in `fetch-log.tsv` and `assets-candidate.csv`.

The 17 local image sizes and hashes were rechecked against the capture journal while preparing these rows; all agree. The journal identifies the downloaded bytes and the source request, but the source JPEG response bodies are not archived separately for a direct second comparison. For that reason assets are `captured` while all image placements stay `discovered` in content parity.

The target preserves the source sequence and casing for IDs 698–714 and labels `01`, `DSC00306-1`, `PA060026`, `PA060033`, `PA060042`, `PA310010`, `SDC10858`, `SDC10861`, `SDC10862`, `SDC10863`, `SDC10873`, `SDC10888`, `SDC10895`, `SDC10897`, `SDC10928`, `SDC10930`, and `SDC10931`. The local files total 27,020,334 bytes. `reuse-check.tsv` reports no exact duplicates.

## Text, links, and remaining limits

The component heading «Фотогалерея» and parent link «Худайбердин Шагит Ахметович» are preserved; the parent link points to local `site/pages/gallery-17/`. The category title «Экскурсия по мемориальному уголку» is taken from the exact ID 38 link in the parent category snapshot. The target has no separately added item count or descriptive photo captions.

`VERIFY-REPORT.md` confirms 17 figures, IDs, labels, order, local paths, and hash/size agreement with the capture journal. It also confirms no obsolete markup or unresolved local links. Local image files were visually inspected by the reviewer, but source image bodies were not retained and the browser source page was unavailable, so direct source-to-target visual matching is still open. The target page was not opened in a browser here; rendered image loading, keyboard behavior, and responsive layout remain unchecked. Source freshness after the 2026-11-13 snapshots is unknown.

These CSVs are candidates only. Shared registries, Git, the target page, and image files were not changed in this task.
