# Фото. Памятные места Бикчентаева

- Source category: `https://ufalit.ufacsdb.ru/index.php?Itemid=88&id=24:2012-12-30-06-41-04&option=com_phocagallery&view=category`
- Target: `site/pages/gallery-24/index.html`
- Source snapshot: `source-current.html.gz` is the full HTTP 200 category response, 39,785 uncompressed bytes, SHA-256 `10caf3c34783e13ff654e6e4773626edaedde7e65a6393e707240711e838f0b0`; gzip evidence SHA-256 `44da91213f1931f3b53c26d0103593c9bce8753d1b4e050a96b3f98fcadaff69`.
- The category lists 18 photos in order: 0 (1)–0 (14), then 0 (18)–0 (21). No pagination controls or further category links appear in this response. The exact category label and source count “(18)” are confirmed in the parent category snapshot at `../gallery-5/source-current.html.gz`.
- Captured all 18 linked detail views (`detail-<id>.html.gz`) and every original offered by the download action (`photo-<id>.headers`). All detail and original-download responses returned HTTP 200. Originals are JPEG, with `Content-Disposition` names and response sizes recorded per item in `source-fetch-metadata.csv`; their SHA-256 values were computed from the response bodies.

## Images and reuse

- Preserved the source order and all 18 source descriptions as figure captions and image alt text. Every new gallery image links to the downloaded full-resolution original.
- Twelve originals are new files under `site/assets/gallery/24/`.
- Six originals are byte-identical to assets already present under `site/assets/places/bikchentaev/`; the page reuses those files without duplication: IDs 412, 414, 415, 420, 422, and 426. The matching source and local hashes are listed in `source-fetch-metadata.csv`.
- Image parity remains `discovered` for all 18 images until each placement has been visually compared against the source. No image has been marked `matched` based only on a file hash.

## Content parity

`content-parity.csv` follows the project’s exact schema. It records the category title, source count (18), parent-category link, 18 source captions, and 18 image occurrences. The title, count, breadcrumb, and captions are `matched` against saved source responses (21 matched text records). Each image occurrence is `discovered` pending visual placement review.

## New page and checks

- One static page was created at `site/pages/gallery-24/index.html`. It retains all 18 images, labels, their source order, the category title, and a link back to the parent category.
- The 18 detail URLs are gallery modal views of these same images and captions; they are represented within the category page, with links to the full originals. No separate article or child category was exposed by this page.
- The existing parent category page also links to the sibling category “Фотоархив Бикчентаева” (23), which is a separate category and already appears in the parent page’s queue/context; no new sibling URL was discovered here.
- No narrow-screen browser rendering or side-by-side visual comparison was performed. Responsive layout uses the shared `.gallery` rules; all 18 image rows remain `discovered` pending visual review.
- Local image paths were checked for existence, and source text/captions were compared with the saved category and detail responses. No external image dependencies remain.

## Files changed

- `site/pages/gallery-24/index.html`
- `site/assets/gallery/24/photo-<id>.jpg` (12 new originals)
- `migration/evidence/2026-11-12/gallery-24/` (category and detail snapshots, response headers, source metadata, and parity matrix)

Shared registries, navigation, styles, and Git index were not changed.
