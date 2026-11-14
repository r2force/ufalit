# Gallery 33 content verification

**Result: 11/11 images match** across the saved category/detail snapshots, fresh repeat downloads, target page, and recorded capture metadata.

## Findings

- Parsed the category snapshot’s `phocadownload=2` links: IDs 485–495 in sequence. Target `figure#photo-ID` order matches exactly. Every target caption matches the parity row and the corresponding `detail-ID.html` description text.
- Confirmed each category link and image parity source identify the same item ID under `catid=33:2012-12-30-07-41-34`. Both each target image `src` and its enclosing `a href` resolve to the assigned local asset.
- Compared every target file byte-for-byte with `/private/tmp/gallery33-repeat-ID.*`. All 11 match; independent local SHA-256 and byte counts match the `original-ID` records in `source-fetch-metadata.csv`. Fresh response headers show HTTP 200; ID 486 is PNG and the remaining 10 are JPEG.
- ID 487 (“Дом Гафури”) is reused at `site/assets/gallery/34/504.jpg`. It matches its fresh source body exactly and its recorded SHA-256 is `cfd0a73c9e6ee2b2fc06de5cf981952ab525171e21e9c7e91f6d43ea487dde1b`.

## Per-item evidence

| ID | Exact source/target caption | Assigned target | Bytes | SHA-256 | Fresh bytes / capture metadata / placement |
|---:|---|---|---:|---|---|
| 485 | Гафурийский район | `site/assets/gallery/33/0-1.jpg` | 371760 | `1277163494fcd299f6b330400e6f0eb8e94416304e209855a79fc4c072ba7653` | match |
| 486 | Карта парка | `site/assets/gallery/33/0-1.png` | 43419 | `2e308577dfb6e68cbaf1b552c4f86b342fbba6739cd095a7d82648a1302a0622` | match |
| 487 | Дом Гафури | `site/assets/gallery/34/504.jpg` | 464784 | `cfd0a73c9e6ee2b2fc06de5cf981952ab525171e21e9c7e91f6d43ea487dde1b` | match |
| 488 | Дом музей Гафури | `site/assets/gallery/33/0-3.jpg` | 503616 | `c39b57ddcf919c42adfe3a75c9e16659f60db1264ff6a9a5b0c4b03179694f97` | match |
| 489 | Могила Гафури | `site/assets/gallery/33/0-4.jpg` | 122257 | `a29c3d57db8640dd9d2db3973ab427526a417bcfa37baeb5d6c58030ae3e407c` | match |
| 490 | Музейные экспонаты | `site/assets/gallery/33/0-5.jpg` | 217499 | `e9a1a9dc160c128514162928f89a3eb65757d9fd1e707ac3e6ae7af3808da6a7` | match |
| 491 | Памятник Гафури | `site/assets/gallery/33/0-6.jpg` | 59590 | `281a8e4ae06e11a36987134db3e579dfb32df66513527a23e3061dd7d200f6cf` | match |
| 492 | Парк Гафури | `site/assets/gallery/33/0-7.jpg` | 41253 | `f492543843b447c55a52ff287bb068c30bbfc3ea2b79d0ab5485bfa582abf81b` | match |
| 493 | Театр Гафури | `site/assets/gallery/33/0-8.jpg` | 3571 | `28640dc79a0971fb319acb72c6b060747a294c6a16be735033a791f14dddec4a` | match |
| 494 | Улица Гафури | `site/assets/gallery/33/0-9.jpg` | 412456 | `b7164f6892bcbec7ecfac049733d7441a64f2fe53e7f5f9d0d2a9dc2db699a51` | match |
| 495 | Экспонаты Музея | `site/assets/gallery/33/0-10.jpg` | 503578 | `37dba987be6885fdcf4fd55c67a02e0797aebf2c8dec49eafeea4e170289e591` | match |

## Limits

This is a content and byte-identity review using saved source snapshots and repeat downloads. I did not separately interpret the image scenes visually, assess design, or render the page in a browser. No live-source re-fetch was performed.

## Evidence

- `migration/evidence/2026-11-12/gallery-33/source-current.html` and `detail-485.html` through `detail-495.html`
- `migration/evidence/2026-11-12/gallery-33/content-parity.csv` and `source-fetch-metadata.csv`
- `/private/tmp/gallery33-repeat-485.jpg` through `gallery33-repeat-495.jpg`, except `gallery33-repeat-486.png`, with corresponding `.headers` files
- `site/pages/gallery-33/index.html` and target files in the table
