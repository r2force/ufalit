# Gallery 18 content verification

**Result: 8/8 images match** across the category/detail snapshots, fresh repeat downloads, target figures, and original capture hashes.

## Findings

- The category snapshot order is IDs 802–809; the target figure order is identical. Each target caption matches the content-parity entry and the corresponding saved detail page.
- Each source URL identifies the same item ID in category 18. Every target `src` and enclosing `href` resolves to the assigned local file, including paths with encoded spaces.
- Compared each target file byte-for-byte to its fresh `/private/tmp/gallery18-repeat-ID.*` file. All match. Independently calculated SHA-256 and sizes match the captured original rows in `fetch-log.tsv`; fresh headers report HTTP 200 and the appropriate image MIME. ID 802 is GIF, ID 804 is PNG, and the remaining six are JPEG.

### Source locator suffix discrepancy

For IDs 805–809, the category/content-parity item URLs use suffixes `0-2` through `0-6`, while the original-download URLs recorded in `fetch-log.tsv` use `0-1` for each item. Both URL sets contain the same category and item IDs; the captured hash for each source item matches its fresh repeat and target file. This is a locator suffix inconsistency in the older fetch log, not a byte mismatch.

## Per-item evidence

| ID | Exact source/target caption | Assigned target | Bytes | SHA-256 | Fresh bytes / capture hash / placement |
|---:|---|---|---:|---|---|
| 802 | Тухват Янаби - портрет с обложки | `site/assets/gallery/18/0 (1).gif` | 53648 | `7a7b055a4fcd3e8ab2c6d150b30a6484209d5959d70323fc4278f876a185254d` | match |
| 803 | Клара Иш | `site/assets/gallery/18/0 (1).jpg` | 14798 | `7d85dc7dd6bb1041c25f772378c0c68f9647bd84693b29e498057791a9a370c1` | match |
| 804 | Карта | `site/assets/gallery/18/0 (1).png` | 26322 | `eea19ffc8c879cd8edf39fb620097e09e1f2df5fecee94154f8a3d2b8e094c9d` | match |
| 805 | Кулибай | `site/assets/gallery/18/0 (2).jpg` | 35428 | `8ad5282cb413bca397363ae1a32459a5fb85384301b6b90182146eadf4759a0f` | match |
| 806 | Мемориальная доска | `site/assets/gallery/18/0 (3).jpg` | 83934 | `5421ba8b5cf1ae7394dac6a7734d88d3c1eaec7e9c3a89c003804b7e87a0ee91` | match |
| 807 | Нинель Юлтыева | `site/assets/gallery/18/0 (4).jpg` | 4340 | `5d7aea564cbe6dd71311f26e1fab69e92efce40b1baa0a50a3f2c09d7fb39744` | match |
| 808 | Тухват общее фото | `site/assets/gallery/18/0 (5).jpg` | 334979 | `7d44de65767d0e5c3c255719b48e14ece9043bc264992a3c53794bc755aa5adb` | match |
| 809 | фото Т. Янаби | `site/assets/gallery/18/0 (6).jpg` | 118881 | `eee97eff24f7087cba0ea7cd63262fc04e80efac589d7d0db31d1768e93552d3` | match |

## Limits

This review checks the saved snapshots, exact caption/order placement, source-file hashes, and local links. I did not separately interpret the scenes visually, assess design, or open the page in a browser. No live-source re-fetch was performed.

## Evidence

- `migration/evidence/2026-11-12/gallery-18/category.html` and `details/802.html` through `details/809.html`
- `migration/evidence/2026-11-12/gallery-18/content-parity.csv` and `fetch-log.tsv`
- `/private/tmp/gallery18-repeat-802.gif`, `gallery18-repeat-803.jpg`, `gallery18-repeat-804.png`, and `gallery18-repeat-805.jpg` through `gallery18-repeat-809.jpg`, with corresponding `.headers` files
- `site/pages/gallery-18/index.html` and target assets in the table
