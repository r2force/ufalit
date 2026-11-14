# Gallery 10 content verification

**Result: 9/9 images match** across category/detail snapshots, fresh repeat downloads, target figures, and recorded image hashes.

## Findings

- The source category order is IDs 591–599; target figure order matches exactly. Every target caption matches both the matching detail snapshot and the text row in `content-parity.csv`.
- For each image, compared the local target bytes with the fresh `/private/tmp/gallery10-repeat-ID.jpg` file. All nine are byte-identical, and their independently calculated SHA-256 values match the original hash recorded in the image parity row. Fresh response headers show HTTP 200 and `image/jpeg`.
- Each source category link identifies the matching item ID under category 10. Target `img src` and enclosing `a href` both resolve to the assigned local file.

## Per-item evidence

| ID | Exact source/target caption | Assigned target | Bytes | SHA-256 | Fresh bytes / recorded hash / links |
|---:|---|---|---:|---|---|
| 591 | Киекбаев | `site/assets/gallery/10/photo-591.jpg` | 131603 | `347c5c8d4f3da1c00e1361da746e5687e45a423f7d59f2ec4cee79c61e754ba8` | match |
| 592 | Дом, где жил Киекбаев | `site/assets/gallery/10/photo-592.jpg` | 227669 | `f248ac3964c7dd3e83c2a3e0dd36b77d66d741e72bb9531d501f0cb3f20be23e` | match |
| 593 | Киекбаев играет на мандолине | `site/assets/gallery/10/photo-593.jpg` | 212829 | `a416e3206a341945c200aaf6f373d38dc195c1bee675d616ca66af12878e1c7c` | match |
| 594 | Киекбаев с другом Гарифуллиным | `site/assets/gallery/10/photo-594.jpg` | 123310 | `1abe536c158b5ed576229fe3d0a01b23ce93e88bf5e3c97f1f281f51244ecdeb` | match |
| 595 | Киекбаев | `site/assets/gallery/10/photo-595.jpg` | 386174 | `33a0b54333f3494ddfded1cc426d78df5f55a1df5a183f2a1d6410cf9db66e3a` | match |
| 596 | Киекбаев с сыном | `site/assets/gallery/10/photo-596.jpg` | 64723 | `d551c34605b0849063718d74a3263b73aa49f9a065b9ee3c1e61e9fc62f78c26` | match |
| 597 | Молодой Киекбаев | `site/assets/gallery/10/photo-597.jpg` | 70122 | `24ae65a2d1efd465e767faf65d53c166ea481a1648199ee8ba8f5fa79a4b04e0` | match |
| 598 | Киекбаев с семьей | `site/assets/gallery/10/photo-598.jpg` | 89742 | `7fa29e6cd8d38f8820e89c8908d6ef4bb60125ef90e0dc382b2938aaf482e556` | match |
| 599 | Киекбаев в молодости | `site/assets/gallery/10/photo-599.jpg` | 108919 | `1bc09eeab81d9070f5607c5131a06df8541c7f6f9fb93a79775c2dde5d6ca7c2` | match |

## Limits

This review verifies the saved source text, target placement, and file identity by SHA-256 and byte comparison. I did not separately interpret the depicted scenes visually or render the page in a browser. No live-source re-fetch was performed.

## Evidence

- `migration/evidence/2026-11-13/gallery-10/source.html` and `detail-591.html` through `detail-599.html`
- `migration/evidence/2026-11-13/gallery-10/content-parity.csv`
- `/private/tmp/gallery10-repeat-591.jpg` through `gallery10-repeat-599.jpg`, with corresponding `.headers` files
- `site/pages/gallery-10/index.html` and target files in the table
