# Gallery 35 content verification

**Result: 23/23 item contents matched** across saved source snapshots, fresh repeat downloads, target figures, local files, and the capture manifest.

## Findings

- Extracted the category order from its `phocadownload=2` links: IDs 568–590. Target `figure#photo-ID` order is identical. All 23 target captions match the corresponding category `phocaimgdesc` text exactly; every corresponding `item-ID.html` snapshot also contains the same caption.
- All 23 category download URLs and parity rows identify the same `catid=35` and item ID. The target image `src` and enclosing link `href` both resolve from `site/pages/gallery-35/` to the assigned local path.
- SHA-256 and byte length were independently calculated for each assigned local file and compared with its fresh `/private/tmp/gallery35-repeat-*` body. All 23 are byte-identical to the fresh body and match `assets-metadata.csv`. Fresh response headers show HTTP 200, `image/gif` for ID 568 and `image/jpeg` for IDs 569–590.
- Five files are reused from other sections: 570, 571, 580, 584, 587. All were compared byte-for-byte to their fresh source bodies, and all have corresponding manifest rows. ID 568 remains a GIF and matches the fresh GIF bytes.

### Source URL locator note

The `source_ref` URLs in `content-parity.csv` correctly identify `catid=35`, the same item IDs, and `phocadownload=2`. However, the category snapshot’s second numeric `id` suffix (`0-N`) differs from the parity `source_ref` suffix for IDs 569–590: the snapshot suffix is one lower in each case (ID 568 matches). This is a locator/index discrepancy in the parity metadata; it does not alter the item ID, captions, or the verified downloaded bytes.

## Per-item evidence

| ID | Exact category/target caption | Assigned target | Bytes | SHA-256 | Fresh bytes / manifest / local links |
|---:|---|---|---:|---|---|
| 568 | Улица Мустая | `site/assets/gallery/35/568.gif` | 13525 | `0848c6c936a410979fff344f51e068fa9c75cf80ec556cd239edaa4181cb1b60` | match |
| 569 | Дом по улице Мустая с памятной доской | `site/assets/gallery/35/569.jpg` | 3633771 | `28dc17017df48594e0ca1789aee68e06ff0a9b606e1a854494c5bf3c06069541` | match |
| 570 | Здесь размещалась редакция Ленинца | `site/assets/places/bikchentev/image005.jpg` | 3701074 | `434a6083ba817a8402a4643c1252794d3b5a3eb2caeb7c63e8ae80c690225779` | match |
| 571 | Здесь размещалась редакция Советской Башкирии | `site/assets/gallery/24/photo-416.jpg` | 3727574 | `dcb042bfe955451a5852663878ab80d27c516f0141cf433a15d152ae10569ddc` | match |
| 572 | Карла Маркса 31 | `site/assets/gallery/35/572.jpg` | 21089 | `ae4506ed59f0fae561c5680f92351348ea99bdf4c15e6801e91013a6df5cd02c` | match |
| 573 | Коммунистическая 113 | `site/assets/gallery/35/573.jpg` | 3673187 | `dd5d150d4671bdac69af1ffc5664a423d383e74d721f759075ea35f7a4f58890` | match |
| 574 | Ленина 31-33 | `site/assets/gallery/35/574.jpg` | 3719641 | `598fe118ef9918cc9b1c59507986e5471eff5c700f72dfe3e08b8d605fda8538` | match |
| 575 | Ленина 65а | `site/assets/gallery/35/575.jpg` | 3764673 | `ab724be1ea9d5fe794dcbc2965c8c1776cafadc6e8a1285ac636692438035333` | match |
| 576 | Медаль Карима | `site/assets/gallery/35/576.jpg` | 159329 | `560890561c8c17088414068100696e77eca729480f3d6c053b26410ed8f1ab7b` | match |
| 577 | Мемориальная доска | `site/assets/gallery/35/577.jpg` | 819298 | `bce82804e4ae067eeb3c9e982221d5e554b928d12e0827af2701b0c9aa1c8760` | match |
| 578 | Молодежный театр | `site/assets/gallery/35/578.jpg` | 3785427 | `cf2c1406b77187ffb15fe1180b242237594887fec701227999a55619a28d2955` | match |
| 579 | Мустаевские чтения | `site/assets/gallery/35/579.jpg` | 228402 | `569d2d7df192b73697ea68df399adef6d4ec5a9badf04f514533811bc8cfdcad` | match |
| 580 | Мустай и Анвер | `site/assets/gallery/24/photo-419.jpg` | 1182329 | `7b644784f6a4ecbe464e045f645f0d0c738d21614d895fab4c99eeaa36ea3c62` | match |
| 581 | Мустай Памятник | `site/assets/gallery/35/581.jpg` | 153331 | `5962a04ea1ac7541e30cd5cbdc55ea991cb439f2cd76496c2091cf0afa5d160a` | match |
| 582 | Мустая Карима | `site/assets/gallery/35/582.jpg` | 24455 | `28e47b49b38f3ed03bb5cda29312435c4a2f426c316707c0e1d9bf2ec9921192` | match |
| 583 | Мустая Карима | `site/assets/gallery/35/583.jpg` | 28538 | `5a187b12b5efc9e2eb32510a20177ec2cfa3671e8cbe9573b22bfc26c5e30d3c` | match |
| 584 | Мусульманское кладбище | `site/assets/places/bikchentev/image011.jpg` | 3694691 | `5c11ab1a7265048cac68239cf7cbf9952cb0bc091080a2e45c19aa9bc12a069a` | match |
| 585 | Памятная доска | `site/assets/gallery/35/585.jpg` | 1311199 | `a961b564001dfbd8926a166a94d15fefc92602b2678cd4dc6cdc04abc81064e3` | match |
| 586 | Площадь для памятника | `site/assets/gallery/35/586.jpg` | 124843 | `132e8dc8b7fc7e4d2e342588bb5f32f30b31898fa9dd6a37db1740a506f12b44` | match |
| 587 | Правление Союза писателей | `site/assets/places/bikchentev/image018.jpg` | 3717086 | `6dd01e459cac60eef6b205428b9feec2e8ab780e3ceb825255a529f3e6bd1ad5` | match |
| 588 | Проект памятника | `site/assets/gallery/35/588.jpg` | 218717 | `edbea96df89715a482eeb8062c8e278d1a39e5bf46f4966232540545ff817d3d` | match |
| 589 | Часть дома с памятной доской | `site/assets/gallery/35/589.jpg` | 1359452 | `c5a92eb5b99680bb6705e3ec7ef2b83679a4f9ee7252f8cf14806a8333904944` | match |
| 590 | Энгельса 5 | `site/assets/gallery/35/590.jpg` | 1010535 | `0db9333efb35c6f560c484ab171c89d73ee4bfc57181d21b68c97182332bac24` | match |

## Limits

This checks byte identity and source/target placement using supplied snapshots and repeat-download files. I did not visually inspect the depicted scenes, assess design, render the page in a browser, or re-fetch the live source.

## Evidence

- `migration/evidence/2026-11-12/gallery-35/category.html`
- `migration/evidence/2026-11-12/gallery-35/item-568.html` through `item-590.html`
- `migration/evidence/2026-11-12/gallery-35/content-parity.csv` and `assets-metadata.csv`
- `/private/tmp/gallery35-repeat-568.gif`, `/private/tmp/gallery35-repeat-569.jpg` through `gallery35-repeat-590.jpg`, with matching `.headers` files
- `site/pages/gallery-35/index.html` and all target files listed above
