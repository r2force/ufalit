# Gallery-42 — registry candidates

**Source page:** `https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=category&id=42%3A2012-12-30-08-53-57&Itemid=88`  
**Target page:** `site/pages/gallery-42/index.html`  
**Capture/review date:** 2026-11-13  
**Evidence:** `category.html`, `details/{ID}.html`, `fetch-log.tsv`, `IMAGE-REPORT.md`, `TEXT-REPORT.md`, `VERIFY-REPORT.md`

## Candidate statuses

`assets-candidate.csv` follows the shared `migration/assets.csv` schema and records all eight original responses as `captured`. Each row includes the exact source URL, target file, HTTP code, MIME, byte count, SHA-256, date, and individual response-header file.

`content-parity-candidate.csv` follows `migration/content-parity.csv`. It contains 18 verified text rows marked `matched`: component title, category title, eight title/alt filename labels, and eight visible captions. It contains eight image rows marked `discovered`. Capture and local asset checks do not establish source-to-target image identity; no image is marked matched.

## Order, labels, captions, and duplicate stems

| Order | ID | Filename | Source title/alt | Verified caption | Image status |
|---:|---:|---|---|---|---|
| 1 | 716 | `0 (1).jpeg` | `0 (1)` / `0 (1)` | Национальный Музей | discovered |
| 2 | 717 | `0 (1).jpg` | `0 (1)` / `0 (1)` | Академия наук | discovered |
| 3 | 718 | `0 (2).jpeg` | `0 (2)` / `0 (2)` | Союз писателей | discovered |
| 4 | 719 | `0 (2).jpg` | `0 (2)` / `0 (2)` | Дом печати | discovered |
| 5 | 720 | `0 (3).jpeg` | `0 (3)` / `0 (3)` | Союз писателей | discovered |
| 6 | 721 | `0 (3).jpg` | `0 (3)` / `0 (3)` | Башкирский государственный университет | discovered |
| 7 | 722 | `0 (4).jpg` | `0 (4)` / `0 (4)` | Карта Уфы | discovered |
| 8 | 723 | `0 (5).jpg` | `0 (5)` / `0 (5)` | Телецентр | discovered |

The repeated base names `0 (1)`, `0 (2)`, and `0 (3)` designate separate source entries. For each pair, `.jpeg` and `.jpg` have distinct detail IDs, source URLs, captions, dimensions, sizes and SHA-256. Candidate records preserve each exact extension and ID so the files do not collapse by title/alt. Source titles/alt remain filename labels; they are not prose descriptions. All eight source captions are reproduced exactly from the category and detail snapshots.

The category title «Фото памятных мест» is evidenced by the ID 42 link in parent gallery-39. The generic component title «Фотогалерея» is preserved in the target breadcrumb.

## Captured asset metadata and verification limits

The asset rows copy HTTP 200, `image/jpeg`, bytes, SHA-256 and response date from `fetch-log.tsv`; pixel dimensions and detail IDs are included in notes. `VERIFY-REPORT.md` independently recalculated size and SHA-256 for all eight local files and checked the source order, IDs, extensions, captions, and target paths. The verifier opened all eight local files and confirmed they decode as images.

The original JPEG response bodies are absent from the evidence directory. The local hashes therefore confirm local integrity relative to the capture log, not direct equality to retained origin bodies. Each parity image row remains `discovered` pending direct source-to-target comparison. The image `0 (4).jpg` visibly contains an embedded “Converted by Total Image Slicer” inscription; its origin status could not be established from the saved evidence, so it has not been edited or described as a transfer discrepancy.

## Other limitations

- The category snapshot has malformed UTF-8 in a third-party DLE advertising tail; the photo labels, captions and order were readable and independently checked.
- Browser rendering, responsive behavior, and current network availability were not checked. The source was not refreshed after 2026-11-13.

These are registry candidates only. Shared registries, the page, the images, and Git were not changed.
