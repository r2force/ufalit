# Gallery 18 — capture report

**Source:** `https://ufalit.ufacsdb.ru/index.php?Itemid=88&id=18:2012-12-25-06-10-14&option=com_phocagallery&view=category`  
**Target:** `site/pages/gallery-18/index.html`  
**Capture date:** 2026-11-12 UTC  
**Current category SHA-256:** `23a57bdb4dde508cfc98cd086f9d67e062f43591e28fe491f724faa348746ec2` (full response in `category.html`).

## Scope and findings

The existing 2026-11-11 evidence contained one compressed category snapshot (`migration/evidence/2026-11-11/batch-2/gallery-18.html.gz`, SHA-256 `277f041439056eb0d47f347dd753ba96c8ee362fec87e18b8c04a2ec36972e23`), but no ready page or media in `site/`. I refreshed the category and captured the eight public detail responses. The category has eight ordered entries, no pagination control and no document or video. Its links point to detail IDs 802–809; their descriptions agree with the captions shown in the category. The first two entries share the label `0 (1)` but are different file types, so the local original filenames preserve the source filenames and extensions.

The Phoca Gallery download endpoint returned all eight original files with HTTP 200 and matching `Content-Disposition` filenames and actual image MIME types. `file` identified them as GIF 640×400, JPEG 99×190, PNG 350×300, JPEG 334×459, JPEG 1296×454, JPEG 66×93, JPEG 2270×1101 and JPEG 530×649. Byte counts, response timestamps, MIME types and SHA-256 hashes are in `fetch-log.tsv`; response headers are retained beside each download. No same-hash file existed among the current gallery assets, so no shared file was reused.

The category has a separate subcategory link, “Фото улицы Тухвата Янаби” (35 entries), ID 43. This is an additional category, not a page of the assigned category. It is recorded as `discovered` in the parity CSV and returned to the migration queue. Its contents were not traversed or downloaded as part of this page.

## Parity status

`content-parity.csv` uses the exact required schema and has 19 content rows: title and entry count, the discovered linked category, eight caption text blocks, and eight image placements. The title “Тухват Янаби” was confirmed in the existing gallery-category snapshot dated 2026-11-11. The eight descriptions/captions are copied verbatim from the refreshed category and individual detail responses, including the original punctuation and capitalization; those text rows are `matched`. All eight image files were captured and validated as image responses, but the image rows intentionally remain `discovered` until a human visual comparison confirms identity, order and placement.

## Local page and evidence

- Page: `site/pages/gallery-18/index.html`.
- Original files: `site/assets/gallery/18/0 (1).gif`, `0 (1).jpg`, `0 (1).png`, and `0 (2).jpg` through `0 (6).jpg`.
- Current category response and headers: `category.html`, `category.headers`.
- Detail responses and headers: `details/802.html`–`details/809.html` and matching `.headers` files.
- Download response headers and per-response metadata: `download-802.headers`–`download-809.headers`, `fetch-log.tsv`.
- Source-to-target matrix: `content-parity.csv`.

I checked all 26 `href`/`src` references in the new page against the local tree; all local targets exist. This check is recorded in `local-check.txt`. The standalone related-category link remains pointed at the source site because its local target has not yet been migrated. The page includes all eight figures in source order with the exact source captions and local full-resolution links.

## Remaining checks and limitations

- Images are not `matched`: visual comparison of all eight local placements against the source is pending.
- The page has not been opened in a browser at wide/narrow widths; rendered layout, keyboard behavior and responsive presentation are not claimed as verified.
- The linked category ID 43 (35 photos) remains new work in the queue.
- No documents or videos were found in the refreshed category and its eight detail responses. No pagination was present in the refreshed category response.
- No shared registries, global styles, Git index or Git metadata were changed.
