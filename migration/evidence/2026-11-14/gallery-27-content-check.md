# Family archive gallery content verification

- Date: 2026-11-14
- Target: `site/pages/gallery-27/index.html`
- Scope: all 14 category items, source labels/order, fresh originals versus assigned local assets, target placements and local links, including reused ID 447. Layout/design was not evaluated.

## Findings

- The source category snapshot `migration/evidence/2026-11-12/gallery-27/source-current.html.gz` lists 14 photos in this order: `f01`–`f11`, `f13`, `f14`, `tmp84B2-2`. It has no `f12` item. Each item links to the corresponding detail ID shown below; the detail snapshots' image labels match the category labels.
- The target figure order, IDs, `alt` text, and `<figcaption>` labels match the category/detail sequence exactly. No descriptions were added beyond the source file-name labels.
- I independently compared every fresh body `/private/tmp/gallery27-repeat-<ID>.jpg` with its assigned target file and computed SHA-256. All 14 are byte-for-byte identical. ID 447 correctly reuses `site/assets/persons/volovik/image002.jpg`; the remaining 13 use `site/assets/gallery/27/photo-<ID>.jpg`.
- Each image `href` and `img src` points to the same assigned local file. All 35 local `href`/`src` references resolve from the target page directory. The page includes 14 figures and displays the source count.

| Position | Source label | ID | Detail label | Target label | Assigned local file | Reused | Bytes | Fresh-source SHA-256 = local SHA-256 |
|---:|---|---:|---|---|---|:---:|---:|---|
| 1 | f01 | 434 | f01 | f01 | `site/assets/gallery/27/photo-434.jpg` | no | 16724 | `262c8a3d1330abcd2b13c83fd7b5620db155775ac453563f6e2dd33ab4779826` |
| 2 | f02 | 435 | f02 | f02 | `site/assets/gallery/27/photo-435.jpg` | no | 23881 | `583a379d65a00268881ad81ea127231a9209c376c63d3f59a681bb61afd2c59a` |
| 3 | f03 | 436 | f03 | f03 | `site/assets/gallery/27/photo-436.jpg` | no | 45625 | `fc50bb4ccaeb92539d1c9694404604e5c641a4aff9459b39262ee0e2fe700e84` |
| 4 | f04 | 437 | f04 | f04 | `site/assets/gallery/27/photo-437.jpg` | no | 22221 | `e084384b8027b38c62dc717e21ea30ccc8de3aa703ba4896ad1b3c8e7d74505b` |
| 5 | f05 | 438 | f05 | f05 | `site/assets/gallery/27/photo-438.jpg` | no | 54549 | `7313b2c29804812945c8032e06da36818adb90a5dbacf4ff21db0eaf54d08a46` |
| 6 | f06 | 439 | f06 | f06 | `site/assets/gallery/27/photo-439.jpg` | no | 122515 | `ed609813f84803828b8f64febc0b1babcc96ffa584941777ad228ab2890bdb39` |
| 7 | f07 | 440 | f07 | f07 | `site/assets/gallery/27/photo-440.jpg` | no | 22555 | `a4f509f8441613f72cf69083886d791831590b157fc65c1f2b2665a1da1f957a` |
| 8 | f08 | 441 | f08 | f08 | `site/assets/gallery/27/photo-441.jpg` | no | 13845 | `39939721f89bfec42fdef49e682523f021fec9619d90ada5bec78297b6e4556a` |
| 9 | f09 | 442 | f09 | f09 | `site/assets/gallery/27/photo-442.jpg` | no | 14349 | `31e2ce99873945bf39ce59c62ba26a9315533424719788836254ac934a30e585` |
| 10 | f10 | 443 | f10 | f10 | `site/assets/gallery/27/photo-443.jpg` | no | 16315 | `f388032ff9418916355a88a076d585ed2b2970ae456327fcd1016d9e2add85d3` |
| 11 | f11 | 444 | f11 | f11 | `site/assets/gallery/27/photo-444.jpg` | no | 24317 | `7dcb92e5603fbae5304d763eae00b14eb77cf3139945e5c6ec72a3ab93ccfe82` |
| 12 | f13 | 445 | f13 | f13 | `site/assets/gallery/27/photo-445.jpg` | no | 21241 | `4ffd88bf06c5664ea3da7dc7ae9a3c7a947e69d79e12bc634aa81fa20c264d67` |
| 13 | f14 | 446 | f14 | f14 | `site/assets/gallery/27/photo-446.jpg` | no | 19331 | `ae816004b45526df1bf2799dbd779e208f5313900b5140628776a8715f806e62` |
| 14 | tmp84B2-2 | 447 | tmp84B2-2 | tmp84B2-2 | `site/assets/persons/volovik/image002.jpg` | yes | 37035 | `2e9bd2feb9c3a7b5babd23afa5dd8b2f2825ec065e92a6aab0fe5a876e62e397` |

## Limits

- The repeated-download comparison establishes exact byte identity between source response bodies and the assigned local files, and the saved source pages establish labels/order. I did not perform a separate visual scene-by-scene comparison or browser check.
