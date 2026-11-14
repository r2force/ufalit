# Gallery 31 content verification

**Result: 13/13 photographs match** across category/detail snapshots, fresh repeat downloads, target placements, and the capture manifest.

## Findings

- Category item order is IDs 453–465; target figure order matches exactly. The category title, parity label, target `figcaption`, and corresponding detail snapshot agree for every item. These labels are original filenames/titles; no separate descriptive captions were present.
- For each item, the target `img src` and enclosing `a href` resolve to the assigned local asset from the gallery page. All 13 current files are byte-identical to the fresh `/private/tmp/gallery31-repeat-ID.*` originals; locally calculated SHA-256 and byte lengths match `assets-metadata.csv`. Fresh headers report HTTP 200 and `image/jpeg` for all files.
- The source category/detail snapshots use IDs 453–465, confirmed against each matching item snapshot. Source image names and target files correspond; uppercase `.JPG` extension is preserved for IDs 459–464.

### Source URL case discrepancy

For IDs 453–457, `content-parity.csv` records the original image path with a lowercase basename (`img0861.jpg` through `img0876.jpg`), while `assets-metadata.csv` and the repeat-download response filenames identify uppercase `IMG_0861.jpg` through `IMG_0876.jpg`. The category/detail snapshots also show uppercase titles. The file contents nevertheless match byte-for-byte, and these source URL path spellings should be treated as a metadata case discrepancy rather than evidence of a different image. IDs 458–465 have matching URL basenames in parity and capture metadata.

## Per-item evidence

| ID | Source and target label | Assigned target | Bytes | SHA-256 | Fresh bytes / manifest / placement |
|---:|---|---|---:|---|---|
| 453 | IMG_0861 | `site/assets/gallery/31/img0861.jpg` | 41098 | `4bfd5adfeaae09a8a4c7e9fe8c01d3c1ec75ecc4277843d24c473ce1fcfadc82` | match |
| 454 | IMG_0865 | `site/assets/gallery/31/img0865.jpg` | 44908 | `7629f4407d363b461ea657b985dbe44475fc6b3248cd31ff8093d199487f4f24` | match |
| 455 | IMG_0870 | `site/assets/gallery/31/img0870.jpg` | 36388 | `24d4863fe2b7493dd984f7f5d977e919c7468737e75ea43d209a5a8d8d9e2921` | match |
| 456 | IMG_0873 | `site/assets/gallery/31/img0873.jpg` | 44653 | `c8dc9d760e0a4c4c84bb2e052c5fbea59a380d32cdfc36fe45f99ec9b921909f` | match |
| 457 | IMG_0876 | `site/assets/gallery/31/img0876.jpg` | 45677 | `d74e8649047789b2cb438c0acb775de71cba1b87f06a02106a6e0fc48c7d079a` | match |
| 458 | school | `site/assets/gallery/31/school.jpg` | 37693 | `fc86482bc38db63e851d19f3bb471f5a64d104a66a83ef9920fdbd7adbc21d0d` | match |
| 459 | SDC16459 | `site/assets/gallery/31/SDC16459.JPG` | 52833 | `18969b24f244040d843dfcbd653f65a6d565aa49577b8f03822041a8ce11d15f` | match |
| 460 | SDC16463 | `site/assets/gallery/31/SDC16463.JPG` | 59486 | `846eec16a89cd867fac61f833af713fd7c1ab43a01266cc713d9b369c7262c41` | match |
| 461 | SDC16464 | `site/assets/gallery/31/SDC16464.JPG` | 49345 | `7b01b066f3bec2318d8a6c78d84f2b1ff4bc26a8ecfe3fa28c1c2450e967fb6c` | match |
| 462 | SDC16476 | `site/assets/gallery/31/SDC16476.JPG` | 52011 | `0ce2ba8d6812290b4198c43a78117df23b64b430468522019d595abb7f0dcc58` | match |
| 463 | SDC16484 | `site/assets/gallery/31/SDC16484.JPG` | 51394 | `4e04d2175b0831d19838f08174a0cfba9f8155efc0e92592e780e750e3552fc9` | match |
| 464 | SDC16485 | `site/assets/gallery/31/SDC16485.JPG` | 54459 | `9e45c4f6643b1c4ce8e8e86fa723308e6925fab202506ca0d27b73e42e347981` | match |
| 465 | tabl | `site/assets/gallery/31/tabl.jpg` | 60302 | `5526d2064a2d2a344c2fc7d54dda962a7a69870b93e99ea201a5d743eb4e7c23` | match |

## Limits

This is a source-to-target content and byte-identity check based on the supplied snapshots, repeat-download files, and local assets. I did not separately inspect the depicted scenes visually or render the page in a browser. No live-source re-fetch was performed.

## Evidence

- `migration/evidence/2026-11-12/gallery-31/category.html` and `detail-453.html` through `detail-465.html`
- `migration/evidence/2026-11-12/gallery-31/content-parity.csv` and `assets-metadata.csv`
- `/private/tmp/gallery31-repeat-453.jpg` through `gallery31-repeat-458.jpg`, `.JPG` files 459–464, and `gallery31-repeat-465.jpg`, with corresponding `.headers` files
- `site/pages/gallery-31/index.html` and the target files listed in the table
