# Gallery 11 content verification

- Date: 2026-11-14
- Target: `site/pages/gallery-11/index.html`
- Scope: 20 source entries, labels/order, repeated source download bodies, assigned local files, target placements, and local page references. Layout/design was not evaluated.

## Findings

- The source category snapshot `migration/evidence/2026-11-11/batch-2/gallery-11.html.gz` contains 20 image entries with detail IDs 600–619 in ascending order. Their source title/alt labels are `0 (1)` through `0 (20)` in that same order.
- Each saved detail snapshot `migration/evidence/2026-11-13/gallery-11/detail-<ID>.html` has the corresponding numbered image label. Target figure ID order, `figcaption`, image `alt`, and image-link `title` match the category/detail label for all 20 items exactly.
- I independently hashed all 20 fresh bodies in `/private/tmp/gallery11-repeat-<ID>.jpg` and compared them with `site/assets/gallery/11/photo-<ID>.jpg`. Every pair is byte-for-byte identical. The table records each independently computed size and SHA-256.
- Each figure's `href` and `img src` point to the same corresponding local image. All 48 local `href`/`src` references on the page resolve from the page directory; the only external reference is the library footer URL `http://csdb.ufanet.ru`.
- The category component heading is “Фотогалерея”; the source category index snapshot `migration/evidence/2026-11-11/galleries.html.gz` gives the category name “Киньябулатова Катиба Каримовна” and count `(20)`, matching the target page heading and count of figures.

| Position | Detail ID | Source category label | Detail label | Target label | Bytes | Fresh source SHA-256 = local SHA-256 |
|---:|---:|---|---|---|---:|---|
| 1 | 600 | 0 (1) | 0 (1) | 0 (1) | 4103181 | `d222043ff0896e766da101eea3d2165fc92158b8654682344a9c93060111c4a0` |
| 2 | 601 | 0 (2) | 0 (2) | 0 (2) | 4316 | `d123c1c096d97f9556b1120ebe71c3cf2927b4ab30aba675d89291c441745448` |
| 3 | 602 | 0 (3) | 0 (3) | 0 (3) | 7548 | `dfebf84a29eb0b749ed1e7feadfe3f513c837a5d3177bdc81839a14d426501bb` |
| 4 | 603 | 0 (4) | 0 (4) | 0 (4) | 2583647 | `89a6f53cbd00ea524bc26232caa4b8ee286da0fe373de256cf727c572fc52d82` |
| 5 | 604 | 0 (5) | 0 (5) | 0 (5) | 488880 | `5981ce7ad5dbc6856cc9df0ad5c7adaa992cf3ae7fd5c83f44347b1d0423e584` |
| 6 | 605 | 0 (6) | 0 (6) | 0 (6) | 190351 | `8f5f8ac74c3dfdaf66c8a502ade90a34254e23c145a5c003d3058df1fa1b1e45` |
| 7 | 606 | 0 (7) | 0 (7) | 0 (7) | 24418 | `ba23cdbd18489b78b7a1df5774593b519e7c505e5ef3cfdb126c155b4f293acd` |
| 8 | 607 | 0 (8) | 0 (8) | 0 (8) | 126738 | `6fcabe52372281b6935e5642a697896a333c2cf5c348a9fe06457cdd0612a257` |
| 9 | 608 | 0 (9) | 0 (9) | 0 (9) | 11756059 | `2ada2df87043dc153848f90ca0b38fd0143e168baf5f6b2fec7f452514bdf68b` |
| 10 | 609 | 0 (10) | 0 (10) | 0 (10) | 4482 | `c2e1bb42710eed162b07933555224aa4624b8fb49cab6889257b976417a85161` |
| 11 | 610 | 0 (11) | 0 (11) | 0 (11) | 10219 | `72d37240f724e5e7662fe4ce90da3fda38f52668eceeb2f88ca2a45d3b92ff70` |
| 12 | 611 | 0 (12) | 0 (12) | 0 (12) | 1603630 | `f3f469fa995aa3664c15a75e5a311bf68ab732c78f1e2316d52ce507f0720fe1` |
| 13 | 612 | 0 (13) | 0 (13) | 0 (13) | 518768 | `aa3fcd4900fe9d482c330904f9cac3442f8ca6f064752a98b3931a9f0ad9e809` |
| 14 | 613 | 0 (14) | 0 (14) | 0 (14) | 248857 | `da7aa6b541c8bd2e1d30fa64451ee13c16d432e058d3a6280e53402e34470a74` |
| 15 | 614 | 0 (15) | 0 (15) | 0 (15) | 505763 | `27608cd2872029672fca176ca75db4d4516728e1e329553f4be33d417ce4f270` |
| 16 | 615 | 0 (16) | 0 (16) | 0 (16) | 2004434 | `e10e418e7d7b56f2a7e84721aec1384e5277ca97a3758f58035bafe2192ea76b` |
| 17 | 616 | 0 (17) | 0 (17) | 0 (17) | 6768119 | `e0560565319e54d64f95ba3dba4c8d59bbf7c438f5d1d9bb44ece0a0b971bceb` |
| 18 | 617 | 0 (18) | 0 (18) | 0 (18) | 571200 | `f407c9af8c0dfad105a2f8c5ef3cee7b8e75c98e1c10c9aef5a6c713a7ccb6e8` |
| 19 | 618 | 0 (19) | 0 (19) | 0 (19) | 1604064 | `3417bcd53cff16ffe901c657d558335305244d9e72b77757d2a42f8f22297bd5` |
| 20 | 619 | 0 (20) | 0 (20) | 0 (20) | 779019 | `23771a8098ab953e22638627e9e0a64c88641d6cb4a0f65c91614f9558561edf` |

## Limits

- The comparison establishes exact byte identity between the repeated download bodies and local assets, and exact label/order correspondence to the saved category and detail HTML. I did not perform an independent visual scene-by-scene review or browser check.
- The source category response is preserved with its original encoding bytes; the extracted labels and names above are readable, and no missing descriptions or captions were inferred.
