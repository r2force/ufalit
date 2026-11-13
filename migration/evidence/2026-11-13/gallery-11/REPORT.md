# Gallery 11 — capture report

**Source:** `https://ufalit.ufacsdb.ru/index.php?Itemid=88&id=11:2012-12-25-05-40-22&option=com_phocagallery&view=category`  
**Target:** `site/pages/gallery-11/index.html`  
**Captured:** 2026-11-13

## Scope and findings

A fresh category response returned HTTP 200 (`text/html; charset=utf-8`, 40,022 bytes). Its visible component heading is “Фотогалерея”, the category description is empty, and the category contains 20 entries in order (detail IDs 600–619). No pagination controls were present. The category name “Киньябулатова Катиба Каримовна” and the count `(20)` are recorded in the previously captured public category index, `migration/evidence/2026-11-11/galleries.html.gz`.

All 20 detail modal responses were captured separately (HTTP 200, HTML). They contain slideshow/navigation controls and no additional descriptive text for the individual images. The category's source title/alt labels are the numbered strings `0 (1)` through `0 (20)`; the target preserves them verbatim and in order. No documents, video, or additional content page was discovered. The gallery index destination is not migrated yet and remains a clearly labeled link to the previous site.

All 20 PhocaGallery download URLs returned HTTP 200 with `image/jpeg`. The downloaded originals are in `site/assets/gallery/11/photo-600.jpg` through `photo-619.jpg`. Exact URL, status, MIME, byte size, pixel dimensions, SHA-256, and response-header evidence are in `assets.tsv`. Each response body begins with the JPEG signature. Original byte sizes range from 4,316 to 4,103,181 bytes (33,903,693 bytes total).

## Parity and evidence

`content-parity.csv` uses the required 11-column schema and records the category title, count, all 20 source labels, and all 20 image placements (42 rows total, excluding the header). Text labels and ordering are manually compared against the fresh category HTML and matched. Image rows remain **discovered** pending visual comparison of each source image with its target placement; file presence, dimensions, and hashes alone do not prove visual identity.

Evidence files in this directory:

- `source.html`, `source.headers`: fresh category response and headers.
- `detail-600.html`–`detail-619.html` and corresponding `.headers`: modal detail responses.
- `photo-600.headers`–`photo-619.headers`: original download response headers. Image bodies are the matching JPEG files under `site/assets/gallery/11/`.
- `source-extract.txt`, `assets.tsv`, `capture.txt`, `content-parity.csv`.

The fresh category declares UTF-8 but contains at least one byte sequence that is not valid UTF-8. The raw response is preserved unchanged; the extracted visible labels and Cyrillic category title are readable in the source listing snapshot. No replacement text was inferred for the absent descriptions.

## Local paths and remaining checks

The target uses the existing `site/assets/style.css`; image links point to the 20 local JPEG originals and open the original directly. Local-path existence and HTML/parity inventory counts were checked. Browser rendering, narrow-screen layout, keyboard behavior, and visual identity/order comparison of all 20 images have not been checked. Consequently, image parity remains discovered and this page is not fully verified.
