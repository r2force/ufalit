# Gallery-40 — registry candidates

**Source page:** `https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=category&id=40%3A2012-12-30-08-53-37&Itemid=88`  
**Target page:** `site/pages/gallery-40/index.html`  
**Capture/review date:** 2026-11-13  
**Evidence:** `category.html`, `details/{ID}.html`, `fetch-log.tsv`, `IMAGE-REPORT.md`, `TEXT-REPORT.md`, `VERIFY-REPORT.md`

## Candidate files and statuses

`assets-candidate.csv` follows the schema of `migration/assets.csv`. It records all 53 original image responses as `captured`: exact source URL, target path, HTTP status, MIME, bytes, SHA-256, date, and per-file header evidence. All are HTTP 200, MIME `image/jpeg`. The independent verifier recomputed local byte size and SHA-256 and confirmed these agree with the capture log.

`content-parity-candidate.csv` follows `migration/content-parity.csv`. It contains 55 text rows marked `matched`: the generic component title, the category title (confirmed in the parent category), and all 53 original `title`/`alt` filename labels. It also contains one image row per original, 53 total, all `discovered`. Capture and target structure checks do not establish image identity, so the images are not marked matched.

## Text comparison

The source heading «Фотогалерея» is preserved in the target breadcrumb. The H1 «Из Литературного музея» comes from the link naming category ID 40 in the parent category snapshot. All 53 source `title`/`alt` values match the target `img[alt]` labels. These values are filename stems (`DSC01277`–`DSC01329`), not descriptions. Source category and details have no separate captions or descriptions. The target repeats each filename label in `figcaption`; no caption has been invented.

The 55 text rows are supported by `TEXT-REPORT.md` and `VERIFY-REPORT.md`. The independent review confirmed the title, labels, order, IDs, local target paths, and target markup.

## Captured image metadata

The 53 entries appear in original category order, detail IDs 749–801 and filenames `DSC01277.JPG`…`DSC01329.JPG`. Each asset row records source response metadata (`HTTP 200`, `image/jpeg`, bytes, SHA-256, response date) and pixel dimensions in its notes. Evidence references include `fetch-log.tsv`, the corresponding `original-{filename}.headers`, `IMAGE-REPORT.md`, and `VERIFY-REPORT.md`.

Images remain `discovered` in the content-parity candidate because independent source-to-target image comparison is incomplete. The verifier could not compare local files against source response bodies: the original binary bodies are not retained in evidence. It did verify local files against logged size/SHA and visually opened 13 of 53 local images, but did not establish source-body identity for every image.

## Limitations

- `captured` means the originals were successfully fetched and their metadata recorded; it is not a source-to-target parity status.
- Every image content row remains `discovered` until direct source-to-target comparison is possible for the complete set.
- Browser rendering, responsive behavior, and real browser navigation were not checked; the verifier inspected static markup and local paths.
- The source snapshot dates to 2026-11-13 and was not refreshed after that date.

These files are candidates for the shared registries and do not modify them. The page, images, and Git were not changed.
