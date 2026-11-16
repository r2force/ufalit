# Review: missing-assets candidate

**Scope:** independently inspect `missing-assets-candidate.csv/.md`, current `migration/assets.csv`, gallery-specific capture evidence, and local asset bytes. No registry, page, Git metadata, or other file was changed.

## Result

The candidate is correctly reduced to **one eligible captured row: gallery-33 ID 486**. The 13 gallery-31 entries (IDs 453–465) are already present once each in the current `assets.csv` under their direct image source URLs, so adding them again would duplicate assets registry records. For each of these 13, the registry source URL, assigned target path, byte count, and SHA-256 agree with the gallery-31 manifest; independently recalculated local bytes and SHA-256 agree as well. The separate `gallery-31-source-check.md` records repeat source-body comparison for all 13.

| ID | Current registered source basename | Target | Bytes | Local SHA-256 | Registry row | Local vs manifest |
|---:|---|---|---:|---|---:|---|
| 453 | `IMG_0861.jpg` | `site/assets/gallery/31/img0861.jpg` | 41098 | `4bfd5adfeaae09a8a4c7e9fe8c01d3c1ec75ecc4277843d24c473ce1fcfadc82` | 1 | match |
| 454 | `IMG_0865.jpg` | `site/assets/gallery/31/img0865.jpg` | 44908 | `7629f4407d363b461ea657b985dbe44475fc6b3248cd31ff8093d199487f4f24` | 1 | match |
| 455 | `IMG_0870.jpg` | `site/assets/gallery/31/img0870.jpg` | 36388 | `24d4863fe2b7493dd984f7f5d977e919c7468737e75ea43d209a5a8d8d9e2921` | 1 | match |
| 456 | `IMG_0873.jpg` | `site/assets/gallery/31/img0873.jpg` | 44653 | `c8dc9d760e0a4c4c84bb2e052c5fbea59a380d32cdfc36fe45f99ec9b921909f` | 1 | match |
| 457 | `IMG_0876.jpg` | `site/assets/gallery/31/img0876.jpg` | 45677 | `d74e8649047789b2cb438c0acb775de71cba1b87f06a02106a6e0fc48c7d079a` | 1 | match |
| 458 | `school.jpg` | `site/assets/gallery/31/school.jpg` | 37693 | `fc86482bc38db63e851d19f3bb471f5a64d104a66a83ef9920fdbd7adbc21d0d` | 1 | match |
| 459 | `SDC16459.JPG` | `site/assets/gallery/31/SDC16459.JPG` | 52833 | `18969b24f244040d843dfcbd653f65a6d565aa49577b8f03822041a8ce11d15f` | 1 | match |
| 460 | `SDC16463.JPG` | `site/assets/gallery/31/SDC16463.JPG` | 59486 | `846eec16a89cd867fac61f833af713fd7c1ab43a01266cc713d9b369c7262c41` | 1 | match |
| 461 | `SDC16464.JPG` | `site/assets/gallery/31/SDC16464.JPG` | 49345 | `7b01b066f3bec2318d8a6c78d84f2b1ff4bc26a8ecfe3fa28c1c2450e967fb6c` | 1 | match |
| 462 | `SDC16476.JPG` | `site/assets/gallery/31/SDC16476.JPG` | 52011 | `0ce2ba8d6812290b4198c43a78117df23b64b430468522019d595abb7f0dcc58` | 1 | match |
| 463 | `SDC16484.JPG` | `site/assets/gallery/31/SDC16484.JPG` | 51394 | `4e04d2175b0831d19838f08174a0cfba9f8155efc0e92592e780e750e3552fc9` | 1 | match |
| 464 | `SDC16485.JPG` | `site/assets/gallery/31/SDC16485.JPG` | 54459 | `9e45c4f6643b1c4ce8e8e86fa723308e6925fab202506ca0d27b73e42e347981` | 1 | match |
| 465 | `tabl.jpg` | `site/assets/gallery/31/tabl.jpg` | 60302 | `5526d2064a2d2a344c2fc7d54dda962a7a69870b93e99ea201a5d743eb4e7c23` | 1 | match |

## ID 486 cross-check

- The candidate CSV has exactly one row, with `status=captured`, HTTP 200, MIME `image/png`, 43,419 bytes, and SHA-256 `2e308577dfb6e68cbaf1b552c4f86b342fbba6739cd095a7d82648a1302a0622`.
- `migration/evidence/2026-11-12/gallery-33/source-fetch-metadata.csv` contains the corresponding `original-486` record for the same full PhocaGallery `catid=33`, `id=486`, `phocadownload=2` URL, assigned path `site/assets/gallery/33/0-1.png`, HTTP 200, PNG MIME, byte count and SHA. The matching response headers are `original-486.headers`.
- The assigned local file exists; independently recalculated size and SHA match the capture. The independent repeat comparison recorded in `migration/evidence/2026-11-14/gallery-33-source-check.md` also reports source body and local bytes/hash matching. The current page uses that target at `site/pages/gallery-33/index.html#photo-486`, captioned “Карта парка”.
- Searching current `assets.csv` for the exact PhocaGallery download URL returns no row; searching for `site/assets/gallery/33/0-1.png` also returns no row. Thus this source URL/target mapping is missing from the shared registry.
- The same SHA-256 and 43,419-byte size occur in one existing `assets.csv` row: source `https://ufalit.ufacsdb.ru/images/pamiatniemesta/gafuri/image011.png`, target `site/assets/places/gafuri/image011.png`. That is a pre-existing byte-identical copy registered under a different source URL and target. It confirms duplicate physical content, but does not replace the missing gallery-33 capture provenance or target mapping.

## Evidence and limitations

Recalculated local size/SHA for the 13 gallery-31 paths against `migration/evidence/2026-11-12/gallery-31/assets-metadata.csv`; inspected their current `assets.csv` rows and the per-item recheck table in `migration/evidence/2026-11-14/gallery-31-source-check.md`. For ID 486, inspected the candidate row, source capture record/headers, current registry by exact URL, path and hash, local target, gallery page placement, and repeat-source report. This review does not assert a new external fetch; it relies on retained capture and repeat-check evidence.
