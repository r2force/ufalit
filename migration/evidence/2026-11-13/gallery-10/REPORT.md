# Gallery 10 — capture report

**Source:** `https://ufalit.ufacsdb.ru/index.php?Itemid=88&id=10:2012-12-25-05-40-09&option=com_phocagallery&view=category`  
**Target:** `site/pages/gallery-10/index.html`  
**Captured:** 2026-11-13 (UTC)

## Scope and findings

The fresh category response is HTTP 200 (`text/html; charset=utf-8`, 26,043 bytes). It contains nine photos in order (detail IDs 591–599), no pagination controls, and an empty category description. Each of the nine detail pages was captured separately; they provide the captions used on the target page. No video or document was found. The source links to the gallery category list; that destination is not yet migrated and is retained as a clearly labeled link to the previous site. The nine detail URLs were already present in `migration/pages.csv`; this capture adds no additional public page to the queue.

The gallery download endpoint returned nine JPEG originals (HTTP 200, `image/jpeg`), rather than the small category previews. Dimensions, lengths, and SHA-256 values follow:

| Detail ID | Target file | Dimensions | Bytes | SHA-256 |
|---:|---|---:|---:|---|
| 591 | `site/assets/gallery/10/photo-591.jpg` | 659×699 | 131603 | `347c5c8d4f3da1c00e1361da746e5687e45a423f7d59f2ec4cee79c61e754ba8` |
| 592 | `site/assets/gallery/10/photo-592.jpg` | 791×545 | 227669 | `f248ac3964c7dd3e83c2a3e0dd36b77d66d741e72bb9531d501f0cb3f20be23e` |
| 593 | `site/assets/gallery/10/photo-593.jpg` | 963×545 | 212829 | `a416e3206a341945c200aaf6f373d38dc195c1bee675d616ca66af12878e1c7c` |
| 594 | `site/assets/gallery/10/photo-594.jpg` | 541×498 | 123310 | `1abe536c158b5ed576229fe3d0a01b23ce93e88bf5e3c97f1f281f51244ecdeb` |
| 595 | `site/assets/gallery/10/photo-595.jpg` | 737×1096 | 386174 | `33a0b54333f3494ddfded1cc426d78df5f55a1df5a183f2a1d6410cf9db66e3a` |
| 596 | `site/assets/gallery/10/photo-596.jpg` | 545×340 | 64723 | `d551c34605b0849063718d74a3263b73aa49f9a065b9ee3c1e61e9fc62f78c26` |
| 597 | `site/assets/gallery/10/photo-597.jpg` | 342×552 | 70122 | `24ae65a2d1efd465e767faf65d53c166ea481a1648199ee8ba8f5fa79a4b04e0` |
| 598 | `site/assets/gallery/10/photo-598.jpg` | 481×618 | 89742 | `7fa29e6cd8d38f8820e89c8908d6ef4bb60125ef90e0dc382b2938aaf482e556` |
| 599 | `site/assets/gallery/10/photo-599.jpg` | 434×622 | 108919 | `1bc09eeab81d9070f5607c5131a06df8541c7f6f9fb93a79775c2dde5d6ca7c2` |

## Parity and evidence

`content-parity.csv` follows the required schema and contains 20 entries: category title and count, nine detail captions, and nine image placements. Text was compared manually with the captured category/detail HTML and is marked `matched`. Image rows remain `discovered` until rendered source-to-target visual comparison confirms each image identity, position, and caption. Captions preserve the source wording, including “Киекбаев с семьей”.

Evidence files in this directory: `source.html`, `response-headers.raw.txt`, `detail-591.html`–`detail-599.html` and their `.headers`, `photo-591.headers`–`photo-599.headers`, `source-extract.txt`, `capture.txt`, and `content-parity.csv`. The image response bodies are the corresponding JPEGs in `site/assets/gallery/10/`; their response headers include the HTTP status, MIME and attachment filename. SHA-256 is recorded in both the parity rows and table above.

## Local paths and remaining checks

The target uses the shared stylesheet at `site/assets/style.css`; all nine image links point to existing local JPEGs. Gallery item IDs are stable anchors and the original files open through their figure links. The target was not opened in a browser, so rendered layout, keyboard navigation, narrow-screen behavior and image identity against the rendered source remain unverified. Accordingly, image parity is not marked `matched`. No shared registry or global style was changed.
