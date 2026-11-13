# Audit of discovered gallery-detail queue rows

Date: 2026-11-13  
Scope: read-only audit of `migration/pages.csv` rows with `kind=gallery-detail` and `status=discovered`; no source files were downloaded and no page, registry, or Git data was changed.

## Finding

`pages.csv` contains 147 discovered gallery-detail rows across nine source categories. These rows are stale as a representation of *missing page content*: every row maps by its source image ID and parent category to an existing local figure, an existing image file, and a captured `migration/assets.csv` image record. All 147 IDs appear exactly once and in the same order in the relevant target page's `figure#photo-ID` sequence. The local image file referenced by each figure exists, and its SHA-256 equals the value recorded for the corresponding category-scoped source image row in `migration/assets.csv`.

The 147 are therefore present as gallery entries, not absent assets. They have **not** all cleared parity review: all 147 corresponding image rows in `migration/content-parity.csv` remain `discovered`, pending visual comparison of source image identity and target placement. I did not perform that 147-image visual comparison in this queue audit. Treat these as transferred-but-unverified gallery entries, not as `matched` and not as fully accepted pages. There are no missing target figures/files among the 147 under the checks below. The old CMS detail URLs do not have separate one-file-per-detail HTML routes in the static target; each is represented as a figure and local original on its category page.

## Category-by-category reconciliation

For each row, the `ID list` is the ordered numeric `id` query parameter from the discovered detail URLs. I compared it to the ordered `figure#photo-ID` sequence on the mapped target page. `Files/hash` means every target figure's local `src` resolves to a file, and each file's SHA-256 equals its matching category-scoped captured image row in `migration/assets.csv`.

| Source category | Target page | Rows / figure IDs in source order | Evidence and result |
|---|---|---|---|
| 1 — Амантай | `site/pages/gallery-amantai/index.html` | 27: `360, 356–359, 361–382` | Detail snapshots `migration/evidence/2026-11-11/gallery-amantai/{ID}.html.gz`; target order exact; 27/27 files and ledger hashes present. |
| 2 — Бикбай | `site/pages/gallery-bikbay/index.html` | 19: `384, 383, 385–401` | Detail snapshots `migration/evidence/2026-11-12/gallery-bikbay/{ID}.html.gz`; target order exact; 19/19 files and ledger hashes present. |
| 3 — Аксаков | `site/pages/gallery-aksakov/index.html` | 15: `312, 305–311, 313–319` | Detail snapshots `migration/evidence/2026-11-11/aksakov-details/{ID}.html.gz`; target order exact; 15/15 files and ledger hashes present. |
| 5 — Бикчентаев | `site/pages/gallery-5/index.html` | 1: `430` | `migration/evidence/2026-11-12/gallery-5/detail-430.html.gz`; target ID exact; 1/1 file and ledger hash present. The image is reused from `site/assets/persons/bikchentaev/01.jpg`. |
| 8 — Ибрагимов | `site/pages/gallery-8/index.html` | 30: `518, 510–517, 519–529, 531–537, 539–541` | Detail captures and ledger `migration/evidence/2026-11-12/gallery-8/details/`, `assets.csv`, and `captions.tsv`; target order exact; 30/30 files and ledger hashes present, including hash-registered shared assets. |
| 10 — Киекбаев | `site/pages/gallery-10/index.html` | 9: `591–599` | Detail captures `migration/evidence/2026-11-13/gallery-10/detail-{ID}.html`; target order exact; 9/9 files and ledger hashes present. |
| 11 — Киньябулатова | `site/pages/gallery-11/index.html` | 20: `600–619` | Detail captures `migration/evidence/2026-11-13/gallery-11/detail-{ID}.html`; target order exact; 20/20 files and ledger hashes present. |
| 12 — Короленко | `site/pages/gallery-12/index.html` | 18: `620–624, 626–638` | Detail captures `migration/evidence/2026-11-13/gallery-12/detail-{ID}.html`; target order exact; 18/18 files and ledger hashes present. Source listing omits ID 625; the target follows the 18-item source order. |
| 18 — Тухват Янаби | `site/pages/gallery-18/index.html` | 8: `802–809` | Detail captures `migration/evidence/2026-11-12/gallery-18/details/{ID}.html`; target order exact; 8/8 files and ledger hashes present. URL-encoded spaces in local image URLs decode to the existing filenames. |
| **Total** |  | **147** | **147/147 ordered IDs present; 147/147 referenced image files and recorded hashes present.** |

Category mapping was checked against the `gallery-category` rows in `pages.csv` (source category ID to target path), not inferred from similar titles or matching counts. For each detail row, the category and image ID were also matched against the `source_url` query parameters of the corresponding `kind=image` row in `migration/assets.csv`. All 147 such asset rows have status `captured`, a target path, an existing file, and a local file hash equal to the ledger hash. The page `<figure>` ID sequence and resolved image `src` were checked against that mapping. This is stronger than a count-only comparison, but does not establish visual identity by itself.

The gallery-specific reports add more item-level evidence: Амантай and Бикбай reports record 27 and 19 detail pages/files with captions; the Аксаков evidence README lists 15 detail captures; gallery 8's `captions.tsv` maps all 30 IDs to exact captions and figure locators; gallery 10's report records IDs 591–599; gallery 11's report records IDs 600–619; gallery 12's report enumerates its 18 IDs; gallery 18's report records details and files for IDs 802–809. Gallery 5's report records the single ID 430 and a SHA-256 match to its reused local image.

## What remains open

- Each of the 147 corresponding image placements is still `discovered` in `migration/content-parity.csv`. The gallery-specific evidence explicitly leaves visual identity/placement checks pending for several batches. This audit did not change those statuses and does not assert that the images look identical to their source placements.
- The remaining page-level `discovered` rows in `migration/pages.csv` are one video category (`Itemid=90&id=3`) and three video articles (`id=389`, `388`, and `81`). Those rows have empty `target_path`; no dedicated static page for those source article URLs is recorded. Captured source snapshots are `migration/evidence/2026-11-11/video.html.gz` and `migration/evidence/2026-11-11/batch-2/video-{389,388,81}.html.gz`. The existing `site/pages/large-videos/index.html` does not close the queue rows: among the player items for articles 389 and 388, one is recorded as `accepted-exception` per page and the rest remain `discovered`; all 14 player items for article 81 remain `discovered` in `content-parity.csv`. This video category/articles branch is the next actual page-content migration priority after refreshing the stale gallery-detail statuses and completing gallery image parity review.
- This check did not download source files, revisit the live source, inspect photos visually, or test page rendering in a browser. The hash check is local-file-to-ledger; it is not a fresh source-byte download or visual comparison. Browser availability was not tested for this audit.

## Recommended queue handling

Do not spend a new capture/download pass on the 147 gallery-detail rows: their IDs, categories, placements, local files, and ledger hashes already reconcile. The migration owner should reconcile those queue statuses with the current evidence after the still-open image visual reviews are completed, following `CONTENT_PARITY.md`'s rule that `discovered` cannot be promoted to `matched` on file presence or hashes alone. Start new page capture/transfer work on the undiscovered video category and article IDs 389, 388, and 81, while maintaining the open source-to-target image checks separately.
