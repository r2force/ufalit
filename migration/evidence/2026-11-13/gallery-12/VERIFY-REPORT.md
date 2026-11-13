# Independent verification: gallery-12 (Korolenko)

Date: 2026-11-13  
Source snapshot: `migration/evidence/2026-11-13/gallery-12/category.html`, `detail-<ID>.html`, `download-<ID>.jpg`, and response headers  
Target: `site/pages/gallery-12/index.html`

## Result

**Content and file identity verified from saved source responses; browser presentation remains unverified.** I compared all 18 target figures against the category and detail snapshots. Their source labels and captions match after whitespace-only normalization, and the target order matches the source detail order: IDs 620–624, then 626–638. The source has no ID 625 / label `0 (6)`; this gap is preserved rather than filled. All 18 target image files are byte-for-byte identical to the captured Phoca Gallery original download bodies: each SHA-256 and byte length matches `download-<ID>.jpg` in evidence and the source fetch manifest.

The host browser was unavailable because the Mac was locked. I did not claim browser loading, wide/narrow layout, click-through behavior, or responsive image display as successful. The remaining parity image statuses in `content-parity.csv` are still `discovered`; I did not alter that shared register. The exact source bytes, local file integrity, per-item placement markup, and caption-to-image semantic fit were checked independently below.

## Per-item comparison

The source label and caption come from each corresponding source detail snapshot. Local SHA-256 is compared with the captured original download SHA-256; every row is identical. The source detail HTML maps the same source ID and filename sequence (`0 (1)`–`0 (5)`, then `0 (7)`–`0 (19)`) to the target figure ID.

| ID | Source label | Source caption | Target asset | Bytes | SHA-256 of captured original and target | Result |
|---:|---|---|---|---:|---|---|
| 620 | `0 (1)` | Богданович Т. А. | [`photo-620.jpg`](../../../site/assets/gallery/12/photo-620.jpg) | 31,637 | `e7f162d47f1c2f6627ba6af7b68377c4ee517421c91f3bf7283ea385f75a4eeb` | identical |
| 621 | `0 (2)` | Гурвич Н. А. | [`photo-621.jpg`](../../../site/assets/gallery/12/photo-621.jpg) | 18,953 | `2412d1792ea16096d7d102d4b40b33bf76e3ced89e0906b380e9bb343d0a1e67` | identical |
| 622 | `0 (3)` | Гурвич Н. А. | [`photo-622.jpg`](../../../site/assets/gallery/12/photo-622.jpg) | 28,927 | `6526dcea5c99eadcceac1bc57e05d566ed97295891b41c78fcf3ee8430c5efd8` | identical |
| 623 | `0 (4)` | Добротворский П. И. | [`photo-623.jpg`](../../../site/assets/gallery/12/photo-623.jpg) | 27,814 | `5926e347b3d8189438f2d3bbcc8b2e91e4a20f6f213b8ac61d28dc10a0861ecc` | identical |
| 624 | `0 (5)` | Дом по ул. Аксаково, 49, где проживал В. Г. Короленко | [`photo-624.jpg`](../../../site/assets/gallery/12/photo-624.jpg) | 41,250 | `463108fa93b0abe4744aa43b717bb78459b500e8dec9377546637a637be49238` | identical |
| 626 | `0 (7)` | Камера Короленко | [`photo-626.jpg`](../../../site/assets/gallery/12/photo-626.jpg) | 23,440 | `d349cf9cab73e2eecc62e185cee3cb428563cdb0e3d0fdc5f076a7c58056bae2` | identical |
| 627 | `0 (8)` | Крашенинников Н. А. | [`photo-627.jpg`](../../../site/assets/gallery/12/photo-627.jpg) | 27,436 | `3acbfc493b9069b6665c27a4844187d696d653d474793e7ee65da8f14ea03793` | identical |
| 628 | `0 (9)` | Сотрудники журнала Русское богатство | [`photo-628.jpg`](../../../site/assets/gallery/12/photo-628.jpg) | 86,925 | `ff02f6a5a0c75d82f53f97d5cbc36dfae482dff7c22d2e0851b98da505794704` | identical |
| 629 | `0 (10)` | Улица Аксакова | [`photo-629.jpg`](../../../site/assets/gallery/12/photo-629.jpg) | 25,342 | `4245e5dda13a894cd0f4933314e98762a41eab9d69d7cb2fec278fc80110659c` | identical |
| 630 | `0 (11)` | Улица Аксакова | [`photo-630.jpg`](../../../site/assets/gallery/12/photo-630.jpg) | 31,157 | `4f702bb52841e3ebe9c48bf80a083f3ea72f36d651d0092ffaefd2f4ea1b807b` | identical |
| 631 | `0 (12)` | Улица Аксакова | [`photo-631.jpg`](../../../site/assets/gallery/12/photo-631.jpg) | 26,577 | `4750ccee8ff2bef5a0e5d480c474db39772864c8ff6c132e90eff63d739a6429` | identical |
| 632 | `0 (13)` | Улица имени Короленко | [`photo-632.jpg`](../../../site/assets/gallery/12/photo-632.jpg) | 48,579 | `a094aabf300de8a6b787c04205f1c8ec170e607c2a9e1e0e5329169faea93828` | identical |
| 633 | `0 (14)` | Улица имени Короленко | [`photo-633.jpg`](../../../site/assets/gallery/12/photo-633.jpg) | 86,178 | `f7bf9957b02f263fa51a09edde922141a0f13b8dce9c98403e653eea1b557fd6` | identical |
| 634 | `0 (15)` | Улица имени Короленко | [`photo-634.jpg`](../../../site/assets/gallery/12/photo-634.jpg) | 39,592 | `b6a9d7bf7a94ef14e1503423487388c0962b4bdbd7c58cf0e44ee413cd52ce75` | identical |
| 635 | `0 (16)` | Улица имени Короленко | [`photo-635.jpg`](../../../site/assets/gallery/12/photo-635.jpg) | 27,908 | `45f588989b43687defca824c26aa3dcb8417d93d9854b762ac872c9628ea4795` | identical |
| 636 | `0 (17)` | Успенский Г. И. | [`photo-636.jpg`](../../../site/assets/gallery/12/photo-636.jpg) | 18,114 | `6e57a8b0b88d516ca6c490ba5fe7488630ba54e1d57e17ffdf9dd6699b500c4a` | identical |
| 637 | `0 (18)` | Швецов С. П. | [`photo-637.jpg`](../../../site/assets/gallery/12/photo-637.jpg) | 49,451 | `d6399b5270ccea2f23610851f956ad6ad37f6259ee3638df48f3953c62fe72c6` | identical |
| 638 | `0 (19)` | Якутский городок | [`photo-638.jpg`](../../../site/assets/gallery/12/photo-638.jpg) | 31,293 | `f8cfea0c43b5746b3dfccb969c9faff53e62a9270e2289968bb4a594864f6052` | identical |

**File checks:** all 18 source download responses are `HTTP 200`, `image/jpeg`, and nonempty according to `source-fetch-metadata.csv` and `download-<ID>.headers`. Captured download body and target asset hashes match for 18/18. The target references each matching `photo-<ID>.jpg` for both image display and full-size link. I opened all 18 local originals for a visual check; each fits its caption (portraits, house/street views, group photo, cell, and town illustration as labelled).

## Text and source scope

- The gallery title «Короленко Владимир Галактионович» is present in the earlier captured gallery listing, referenced by the capture report; the refreshed category response itself uses the generic heading «Фотогалерея».
- The refreshed category snapshot has 18 entries and no pagination; all 18 detail snapshots are present. The target contains exactly the same 18 IDs in source order.
- Each category filename label (`0 (n)`) and detail caption is preserved. ID 624's source caption includes a `<br>` line break; the target caption preserves it as markup. The target `alt` for photo-624 encodes that formatting token as literal text (`&lt;br&gt;`), which may be announced awkwardly by assistive technology. This is a minor accessibility issue; I did not edit the page.
- The existing parity CSV has 38 `matched` text entries and 18 `discovered` image entries. My comparison confirms all listed text/labels and all image binary mappings, but browser availability/rendering is still untested, so I left the shared registry untouched.

## Markup and links

- Target markup uses semantic `header`, `nav`, `main`, `figure`, `figcaption`, `footer`, and standard links/images. No deprecated tags, presentation attributes, Joomla/MCE artifacts, or PHP targets were found in the target HTML.
- All 45 local `href`/`src` references resolve to existing files. The footer also includes an external `http://csdb.ufanet.ru` link; external availability was not checked.
- No `srcset` or generated/derived images are used. The page links directly to the local original asset for each photograph.

## Not checked

1. Browser rendering, wide and narrow viewport layout, lazy-load behavior, and opening a full-size image by clicking were not tested because the available Mac was locked.
2. Keyboard navigation, focus visibility, zoom/reflow, reduced-motion behavior, contrast, and page interaction were not evaluated in a browser.
3. The source was captured on 2026-11-13; no later freshness pass was performed.

No changes were made to the target page, Git, or shared registers. This report is independent evidence only.
