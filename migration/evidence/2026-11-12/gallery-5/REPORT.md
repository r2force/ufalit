# Gallery category 5 capture

- Source: `https://ufalit.ufacsdb.ru/index.php?Itemid=88&id=5:2012-12-25-05-39-04&option=com_phocagallery&view=category`
- Target: `site/pages/gallery-5/index.html`
- Previous snapshot: `migration/evidence/2026-11-11/batch-2/gallery-5.html.gz` (valid gzip HTML snapshot; category contents match the recaptured response).
- New source evidence: `source-current.html.gz` (HTTP 200 full HTML response, 16,041 bytes before compression); `detail-430.html.gz` (HTTP 200 full HTML response, 9,320 bytes before compression).
- Category page has no pagination links and presents one direct image plus two child categories. The category directory snapshot identifies this category as “Бикчентаев Анвер Гадеевич” with count (1). Its detail view references `phoca_thumb_l_0 (16).jpg`, alt/title `0 (16)`, and offers one downloadable JPEG. No additional direct image or page of results was exposed.
- Child category links to return to the queue: `id=23:2012-12-30-06-40-49` “Фотоархив Бикчентаева” (10), and `id=24:2012-12-30-06-41-04` “Фото. Памятные места Бикчентаева” (18). These are separate category pages and were not crawled as part of this page assignment.

## Image and reuse

The public download endpoint returned HTTP 200, MIME `image/jpeg`, 2,220,745 bytes, filename `0 (16).jpg`; headers are preserved in `photo-430.headers`. Its SHA-256 is `a8298286fd8c442d81bff5b3ad5aa184617a9c4007fa6b3304e2fa4c742eadb1`. This exactly matches the existing `site/assets/persons/bikchentaev/01.jpg` (already registered in `migration/assets.csv`), so the page reuses that file without making a duplicate. The image file was opened for a visual look, but placement against the source category presentation has not been fully reviewed; matrix status remains `discovered` as instructed.

## Content parity

`content-parity.csv` uses the exact project schema. All three text labels/counts were retained exactly. The single image occurrence is recorded as `discovered`, not `matched`, pending final visual/placement review. The old detail page contains no descriptive caption beyond the filename-like label `0 (16)`.

## Page and checks

- New HTML uses the site's shared stylesheet, provides a single responsive figure linking to the full-resolution shared image, preserves the source label, and surfaces the two child categories and their counts.
- No pagination or additional direct image was present in the recaptured category response.
- Image target file exists and its SHA-256 matches the source download response exactly.
- No browser rendering or narrow-screen review was performed in this subtask.
- Unknown child categories remain linked to their public Joomla URLs until the queued pages are migrated. Main category index remains an external source link.
- No new image file was required, hence `site/assets/gallery/5/` is empty.

## Capture checksums

The uncompressed category response SHA-256 is `818a7d5ad83e12ef9f433f1f8e681f80bcab58aec843226adab470d6b5520c9b`; its saved gzip evidence SHA-256 is `f999b43add5cc1dcd58ed5f781ec289a8740dd7b47c418ae0629e2f27fd475fe`. The uncompressed detail response SHA-256 is `ae01d96b56541cca9f9ff73f45d9b128c99b6697230006c342991514277f03a7`; its saved gzip evidence SHA-256 is `d9a7b00192357a34a459d4a9b20c8bb0916978a38f5f5ad0d0e28bd7ca23584f`. Raw response sizes, media types, statuses, and hashes are tabulated in `source-fetch-metadata.csv`.
