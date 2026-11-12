# Gallery category 6 capture

- Source: `https://ufalit.ufacsdb.ru/index.php?Itemid=88&id=6:2012-12-25-05-39-18&option=com_phocagallery&view=category`
- Target: `site/pages/gallery-6/index.html`
- Preserved source snapshot: `migration/evidence/2026-11-11/batch-2/gallery-6.html.gz` (gzip is valid; HTTP 200, `text/html; charset=utf-8`, 15,821 bytes, source-response SHA-256 `59e7e2ba11ef9b08f9fc856e9b0746d62a319c2cf75618af201f3733dcf2c1d0`; compressed archive SHA-256 `7165701c729bda4c781172bf443069a24a00fb8a9994cf3e9cdc56d046756c43`). The extracted full HTML is preserved in this evidence folder.
- Fresh response obtained on 2026-11-12 at 06:36:53 UTC: HTTP/2 200, `text/html; charset=utf-8`, 15,821 bytes. `source-current.html` preserves the response; SHA-256 `96bfe44a1a81711fccec0eb62eea08fea02e489ae941fe806cd8e14c32ff0f08`. Comparison with the prior snapshot shows only the dynamic date and generated hidden form token changed. The gallery content block is byte-identical; see `freshness-comparison.md`.

## Scope found

The fresh response and the prior snapshot both show an index of four child categories: “Семейный архив” (14), “Афиши” (3), “Памятные места” (no count shown), and “Совемренники и коллеги” (3; source spelling retained). It contains no direct photo entries, descriptions, detail-page links, originals, or pagination controls. The empty category form is not a content item. No media files belong to this page, so `site/assets/gallery/6/` is intentionally empty and no image is marked matched.

The four category pages are separate pages and have been returned to the queue:

- `id=27:2012-12-30-07-29-53` — Семейный архив (14)
- `id=25:2012-12-30-07-28-54` — Афиши (3)
- `id=26:2012-12-30-07-29-04` — Памятные места
- `id=28:2012-12-30-07-30-30` — Совемренники и коллеги (3)

Their labels and counts are preserved; because their destination pages have not yet been migrated, links currently point to the original public category URLs. Pagination, photo detail pages, original downloads, and descriptions for those categories remain for their assigned tasks.

## Parity and checks

`content-parity.csv` uses the required 11-column schema. It records the page title and four category labels as `discovered`, pending visual/browser review and page-level recapture. No photo or description rows were implied where the source snapshot exposed none.

The new page reuses `site/assets/style.css`; no shared files or registries were changed. Source order and exact category spelling/counts are retained. Local navigation points to existing site paths; child category links intentionally remain on the source until those pages are transferred. No browser, wide/narrow viewport, or visual review was available. Freshness was checked against the current response; only generated date/token fields changed. Browser and visual review remain pending.

## Files

- `site/pages/gallery-6/index.html`
- `site/assets/gallery/6/` (empty; no page-specific images found)
- `migration/evidence/2026-11-12/gallery-6/source-snapshot.html`
- `migration/evidence/2026-11-12/gallery-6/source-fetch-metadata.csv`
- `migration/evidence/2026-11-12/gallery-6/source-current.html`
- `migration/evidence/2026-11-12/gallery-6/freshness-comparison.md`
- `migration/evidence/2026-11-12/gallery-6/content-parity.csv`
- `migration/evidence/2026-11-12/gallery-6/REPORT.md`
