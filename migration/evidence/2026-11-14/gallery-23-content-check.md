# Gallery 23 content verification

**Result: 10/10 images match** across the saved source snapshots, fresh repeat downloads, target figures, and capture metadata.

## Findings

- The category snapshot lists IDs 402–408 followed by 423–425. The target figure order matches this sequence exactly, including the ID gap. Each target caption matches the corresponding content-parity caption and text in its saved detail snapshot.
- Verified all category download links identify the corresponding item ID under category 23. Each target `img src` and enclosing `a href` resolves to its assigned local file.
- For each item, the fresh repeat body is byte-identical to its assigned target file. The independently calculated SHA-256 and file size match the source-fetch record; repeat headers show HTTP 200 and `image/jpeg`.
- Reused IDs 402 and 424 are included in the same byte-for-byte check. ID 402 resolves to `site/assets/places/bikchentev/image022.jpg`; ID 424 resolves to `site/assets/persons/bikchentaev/01.jpg`.
- The source spelling “Бикчетаев” in captions for IDs 407–408 is retained exactly in the target, matching the snapshots.

## Per-item evidence

| ID | Exact source/target caption | Assigned target | Bytes | SHA-256 | Fresh bytes / capture record / placement |
|---:|---|---|---:|---|---|
| 402 | Бикчентаев. Обложка Большой оркестр | `site/assets/places/bikchentev/image022.jpg` | 7409 | `ee3ad8f128c5e93f2d7913018f2c742ebe4d2ff82b8b13a216d8303bb2274ab9` | match |
| 403 | Бикчентаев. Обложка Дочь посла 1962 | `site/assets/gallery/23/0-2.jpg` | 1352182 | `893941acd62c83b9b1ae76b2492a2c41404ef156cb5c63babdf6d74b5573414d` | match |
| 404 | Бикчентаев. Обложка Лебеди остаются на Урале. Я не сулю тебе рая | `site/assets/gallery/23/0-3.jpg` | 13644 | `a964b19dbad731f467efb3bae4a76db09b876f0e8ca18dacd23b6121441ae03e` | match |
| 405 | Бикчентаев. Обложка с автографом. Большой оркестр | `site/assets/gallery/23/0-4.jpg` | 1568115 | `d7aa593a14e14674e8eae16a8a3cd22ea509755feaeffaf6f9c1e92771fc46c0` | match |
| 406 | Бикчентаев. Обложка Семь атаманов... | `site/assets/gallery/23/0-5.jpg` | 1388987 | `9acff2a5353e1625073290f37c41fcc2b72755a5061fb15bfc8148554f0fc07a` | match |
| 407 | Бикчетаев. Обложка Большой оркестр. Сколько лет | `site/assets/gallery/23/0-6.jpg` | 49410 | `a935e8cd03d6fea756a5659098682c699ff7ec05c9690cfd587911a020912f44` | match |
| 408 | Бикчетаев. Обложка Сколько лет тебе комиссар | `site/assets/gallery/23/0-7.jpg` | 7695 | `e62fb8fe6746e1ea004a25417fffabbc1569a25504379b0921c7000cd63c8a62` | match |
| 423 | Портрет | `site/assets/gallery/23/0-15.jpg` | 2945046 | `ba02a1e87d3edc67a536bfaedf742c271866492d501ef066c43e485304f8d3a6` | match |
| 424 | Портрет | `site/assets/persons/bikchentaev/01.jpg` | 2220745 | `a8298286fd8c442d81bff5b3ad5aa184617a9c4007fa6b3304e2fa4c742eadb1` | match |
| 425 | Портрет | `site/assets/gallery/23/0-17.jpg` | 8487 | `6c1dd039f015ab9d8de164b7e827008c2dd3fbb62e6d995c8d376a7a42a176e8` | match |

## Limits

This review confirms content placement and byte identity using saved snapshots and fresh repeat downloads. I did not separately assess the visual scene or render the page in a browser. No live-source re-fetch was performed.

## Evidence

- `migration/evidence/2026-11-12/gallery-23/category.html` and `detail-402.html` through `detail-408.html`, `detail-423.html` through `detail-425.html`
- `migration/evidence/2026-11-12/gallery-23/content-parity.csv` and `source-fetch-metadata.csv`
- `/private/tmp/gallery23-repeat-402.jpg` through `gallery23-repeat-408.jpg`, and `gallery23-repeat-423.jpg` through `gallery23-repeat-425.jpg`, with matching `.headers` files
- `site/pages/gallery-23/index.html` and target files in the table
