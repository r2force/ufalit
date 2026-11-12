# Gallery category 28 — capture report

**Source:** `https://ufalit.ufacsdb.ru/index.php?Itemid=88&id=28:2012-12-30-07-30-30&option=com_phocagallery&view=category`  
**Target:** `site/pages/gallery-28/index.html`  
**Captured:** 2026-11-12 (UTC)  
**Source category SHA-256:** `4e8a4e95c24ef7b75bb3ba961cf9d7b563b6651f4ed4fcb5b8d991507fd230d0`

## Scope and findings

The category returns HTTP 200 and contains three gallery entries in order: `l01` (detail ID 448), `l02` (449), and `l03` (450). There are no pagination controls or additional pages in the response. Each detail page's previous/next controls refer only to these same three entries. The parent link is to “Воловик Михаил Яковлевич” and is kept as a local link to `gallery-6`.

The source provides only the labels `l01`–`l03`; its category description is empty, and the detail pages contain no additional caption or biographical description. These labels and the source category spelling “Совемренники и коллеги” have been preserved as written.

Each JPEG was obtained from the Phoca Gallery download endpoint. Its hash was compared to a direct GET of the corresponding public file path; the bytes match for all three photos. The captured originals are 121×165, 121×185, and 120×164 pixels, respectively. The dimensions are those of the available source originals, not generated or enlarged derivatives.

## Parity status

`content-parity.csv` follows the required schema and has nine rows: six text items (title, parent link, item count, and three labels) and three image placements. The six text items are `matched`. All three files have successful HTTP 200 `image/jpeg` captures with nonzero sizes and matching source-path/download SHA-256 hashes; their placement status remains `discovered` pending visual inspection of the rendered target page. No video or document was found on this category or its three detail pages.

## Evidence and files

- Full category and detail HTML, response headers, direct image-path response headers, and fetch facts: this directory (`category.html`, `detail-*.html`, `*.headers`, `source-fetch-metadata.csv`).
- Target page: `site/pages/gallery-28/index.html`.
- Original JPEGs: `site/assets/gallery/28/photo-{448,449,450}.jpg`.
- Element-by-element source-to-target matrix: `content-parity.csv`.

## Remaining checks and limitations

- The target page has not been opened in a browser at desktop and narrow widths; visual identity/placement, actual link behavior, keyboard focus, and reduced-motion behavior remain unverified. Accordingly image entries are not marked `matched`.
- Source images are low resolution (about 120 pixels wide); the source offered no higher-resolution file at either the gallery download endpoint or direct file path.
- The source has been freshly captured on 2026-11-12, but no later freshness pass was made after this capture.
- No shared registries, global site styles, or Git state were changed.
