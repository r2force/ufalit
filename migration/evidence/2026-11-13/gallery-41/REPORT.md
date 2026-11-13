# Gallery-41 — registry candidates

**Source page:** `https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=category&id=41%3A2012-12-30-08-53-47&Itemid=88`  
**Target page:** `site/pages/gallery-41/index.html`  
**Capture/review date:** 2026-11-13  
**Evidence:** `category.html`, `details/{ID}.html`, `fetch-log.tsv`, `IMAGE-REPORT.md`, `TEXT-REPORT.md`, `VERIFY-REPORT.md`

## Candidate contents and status

`assets-candidate.csv` follows `migration/assets.csv`; it contains one row for each of 24 original JPEG responses, all `captured`. Each row records the exact original URL, category page as `used_by`, local target, HTTP code, MIME, bytes, SHA-256, capture date and per-original response-header evidence.

`content-parity-candidate.csv` follows `migration/content-parity.csv` and contains 50 rows: 26 verified text rows marked `matched` (component heading, category title, and 24 exact source `title`/`alt` filename labels) plus 24 photo rows marked `discovered`. The photos were captured and the local page order/paths were checked, but image identity has not been established by direct source-body comparison; none is marked `matched`.

No source captions or descriptions were invented. The category and its detail pages contain filename-only title/alt labels and no separate caption/description. Target `figcaption` elements repeat those filename labels; candidate text rows point to `img[alt]` labels and notes explicitly distinguish them from captions.

## Image capture fields

The rows follow source category order and use the exact full URLs, local paths, HTTP 200 status, MIME `image/jpeg`, byte sizes, SHA-256 values, response timestamps and pixel dimensions from `fetch-log.tsv`. Each evidence field links the capture log, the per-file `original-{filename}.headers`, `IMAGE-REPORT.md`, and `VERIFY-REPORT.md`. Independent verification recalculated every local byte size and SHA-256 and matched them against the log.

The filename sequence has a source gap: after `0 (18).JPG` (detail ID 741), source order continues with `0 (20).JPG` (detail ID 743). `0 (19)` and ID 742 do not appear in the capture; no row or placeholder was fabricated.

## Verified text

The component heading «Фотогалерея» is preserved in the breadcrumb. The H1 «Семейный архив» is supported by the link in the parent gallery-39 snapshot. The 24 accessible filename labels match the source title/alt values in `fetch-log.tsv` and details. Their order, IDs and target locators were independently reviewed. These are filenames only, not descriptions of photo content.

## Image parity limitations

The independent reviewer visually opened all 24 local images and confirmed they decode as images, and confirmed local size/hash against the capture log. However, this evidence set does not retain the original binary JPEG response bodies. Thus the independent reviewer could not compare each local image directly with the source body; image rows remain `discovered` pending source-to-target identity comparison. The low resolution of `0 (1).jpg` (71×100) is an original-source limitation and was not altered.

The category snapshot has a malformed UTF-8 advertising tail despite its UTF-8 response declaration; ASCII image labels/order are legible and were independently matched. Browser rendering/responsive layout and current source availability were not verified. These candidates describe the 2026-11-13 capture, not a refreshed source.

These are candidates for the shared registries only. Shared registries, the page, images, and Git were not changed.
