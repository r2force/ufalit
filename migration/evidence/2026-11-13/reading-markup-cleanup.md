# Cleanup of inline styles in reading pages

Completed 2026-11-13. Scope is limited to the 11 `site/pages/reading-*/index.html` files below that contained inline `style` attributes. `site/pages/reading/index.html`, `personalities`, `awards`, and all other pages were excluded. The new stylesheet is `site/assets/reading-cleanup.css`; shared `site/assets/style.css`, registries, and Git state were not changed.

## Changes

All inline styles in the selected pages used one of four declarations: `text-align: left`, `text-align: center`, `text-align: right`, and `font-size: 14px`. They were moved to matching CSS classes and rules in the new stylesheet, linked after the existing stylesheet on affected pages. Other attributes and HTML structure were preserved. No `!important` was used. There were no MCE classes or empty presentation attributes left in the selected pages at the start of this cleanup, so none were removed.

## Comparison against Git HEAD

Git `HEAD` was used as the source baseline. Visible text was extracted and whitespace-normalized, and anchor `href` values were compared in document order. The pre-edit working pages matched `HEAD` for both sequences; previously removed MCE-only attributes do not change extracted text or links. After cleanup, both sequences remain identical. The SHA-256 values below identify the normalized text and ordered href sequences and are unchanged before/after. Each page's original line-ending pattern was restored from `HEAD` after the markup edits.

| File | Inline styles moved | Visible text characters | Anchor links | Text SHA-256 (before = after) | Ordered href SHA-256 (before = after) |
|---|---:|---:|---:|---|---|
| `site/pages/reading-aksakov-flower/index.html` | 2 | 4109 | 8 | `ae92b1737d21d8f6d4379473a5550e114e58179c5ab0afd2ec9f25388f94b678` | `b578c50ba7b36460ccaaa7937ea3452a640d2fcd879f83e9ee65b28614e99373` |
| `site/pages/reading-aksakov-nature/index.html` | 1 | 1232 | 8 | `641b7b0ea7610b2afa265e778bea0ead391a6af0d4b00bf501b9ccc5447ddcc8` | `b578c50ba7b36460ccaaa7937ea3452a640d2fcd879f83e9ee65b28614e99373` |
| `site/pages/reading-bikchentaev-reviews/index.html` | 17 | 36961 | 8 | `16dddd4df40bd82d16484b1f6346d7b44e7a6e714efc70ad41ec052642d7ef4f` | `b578c50ba7b36460ccaaa7937ea3452a640d2fcd879f83e9ee65b28614e99373` |
| `site/pages/reading-bikchentaev-stories/index.html` | 4 | 44537 | 8 | `4ec368b70e560f59926074c099e76f8311488a0b216c854c2db83f4faff5ccd4` | `b578c50ba7b36460ccaaa7937ea3452a640d2fcd879f83e9ee65b28614e99373` |
| `site/pages/reading-karim-children/index.html` | 36 | 71249 | 8 | `a686fd9bf98083e428edf8d38d9a426980338111214c156443c57b2d037aa1f1` | `54879900b6d2b8c7c2f360ae0fcf07e7a10858e0fd89333e677dec7c288b713d` |
| `site/pages/reading-karim-poems/index.html` | 3 | 48204 | 8 | `db4f84f855a24096dab5b2826ea1052d4fdc7b286b1644a7e1269eeb93abacc1` | `b578c50ba7b36460ccaaa7937ea3452a640d2fcd879f83e9ee65b28614e99373` |
| `site/pages/reading-karim-smile/index.html` | 2 | 6705 | 8 | `29539aaa564be17084059df49a985b4db538050b9873def368b7d5dbf8202c06` | `b578c50ba7b36460ccaaa7937ea3452a640d2fcd879f83e9ee65b28614e99373` |
| `site/pages/reading-shafikov-dedications/index.html` | 14 | 4612 | 9 | `26f8432a8a1d0508c6230bef39a216b4d48f6e2d9bd3e4a0aaaa29b16359eeb6` | `88f6171dcf7368354fbfee98821760d586908206fc4b7974ac1352d3fdddb90f` |
| `site/pages/reading-shafikov-poems/index.html` | 4 | 15670 | 8 | `6700ecb7a90f83713ed2d6652bf3464042077a079e248b6328e82ba409cd7e84` | `b578c50ba7b36460ccaaa7937ea3452a640d2fcd879f83e9ee65b28614e99373` |
| `site/pages/reading-shafikov-sayings/index.html` | 1 | 2252 | 8 | `2c2df311b7f7a057838e1ab14639eae49b3d7e040b0f9821794c7a7020923f43` | `b578c50ba7b36460ccaaa7937ea3452a640d2fcd879f83e9ee65b28614e99373` |
| `site/pages/reading-shafikov-talas/index.html` | 5 | 113648 | 9 | `e2b937837ec57abf1162d985da56e4d147b1a8326a60739a79593102a46c3328` | `93e0c4ba0bac7170d85360bd345b0d43bfc1df40c26740e6cdbbc34d894aac45` |

## CSS mapping and limitations

| Original declaration | CSS class | Occurrences |
|---|---|---:|
| `text-align: left;` | `reading-cleanup-left` | 34 |
| `text-align: center;` | `reading-cleanup-center` | 38 |
| `text-align: right;` | `reading-cleanup-right` | 16 |
| `font-size: 14px;` | `reading-cleanup-14px` | 1 |

These checks establish that extracted text and link targets/order did not change; they do not establish pixel-identical display in every browser or viewport. CSS uses the same declarations, scoped beneath `.reading`. Independent visual review remains useful. The source snapshots were not refreshed during this markup cleanup.
