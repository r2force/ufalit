# Gallery 34: first six available images

- Date: 2026-11-14
- Target: `site/pages/gallery-34/index.html`
- Scope: only the first six source items, in category order: IDs 507, 496, 497, 498, 499, and 500. The other eight items are explicitly outside this check. Layout/design was not evaluated.

## Findings

- The saved category snapshot `migration/evidence/2026-11-12/gallery-34/category.html` lists the first six entries in order `507, 496, 497, 498, 499, 500`. Their captions match the corresponding detail snapshots and target figures exactly, including the source's double space/non-breaking-space spacing in item 500.
- I independently compared the fresh response bodies `/private/tmp/gallery34-repeat-<ID>.jpg` for these six IDs with their assigned local targets and computed SHA-256. All six source/local pairs are byte-for-byte identical.
- For each of these six figures, the target `href` and `img src` use the same assigned local path, and that path exists. ID 498 correctly points to the reused `site/assets/persons/gafuri/image001.jpg`.

| Position | ID | Source label | Category caption | Detail caption | Target caption | Assigned local file | Bytes | Fresh-source SHA-256 = local SHA-256 |
|---:|---:|---|---|---|---|---|---:|---|
| 1 | 507 | 0 (12) | М. Гафури | М. Гафури | М. Гафури | `site/assets/gallery/34/507.jpg` | 186093 | `875b81e0ece9caa30c0208841ba6a9a6ba85f1503d192e6cfac768427ca66a10` |
| 2 | 496 | 0 (1) | Автограф поэта | Автограф поэта | Автограф поэта | `site/assets/gallery/34/496.jpg` | 227688 | `9e7a2c235a2b47cf230c18a4243f7397f07b16154262595e90efecc208679449` |
| 3 | 497 | 0 (2) | Гафури в кругу семьи | Гафури в кругу семьи | Гафури в кругу семьи | `site/assets/gallery/34/497.jpg` | 224693 | `3f2e0e55d5924169a4065a9638f7a9f972b2ba11ca64d4484747638de19ae6f9` |
| 4 | 498 | 0 (3) | Гафури за рабочим столом | Гафури за рабочим столом | Гафури за рабочим столом | `site/assets/persons/gafuri/image001.jpg` (reused) | 164667 | `8315b44672f7d8ca15527a00bf30a397f4a8441a5d506e6ba3cf63241e12430e` |
| 5 | 499 | 0 (4) | Гафури и Худайбердин | Гафури и Худайбердин | Гафури и Худайбердин | `site/assets/gallery/34/499.jpg` | 323465 | `ac51b4db6a10e046eea67b69cf8846d31b9f7741ee950c0fbc492d5eef077397` |
| 6 | 500 | 0 (5) | Гафури с  башкирскими писателями | Гафури с  башкирскими писателями | Гафури с  башкирскими писателями | `site/assets/gallery/34/500.jpg` | 210763 | `303c2a5571f3aa06e97436d2de492353b4305a018425070ffb503f2ebccb3b9d` |

## Limits

- This report covers exactly the six requested IDs. It makes no verification claim about the remaining eight photos, their captions/order, or their destination links.
- The check establishes byte identity from repeated download bodies to assigned local files and text/order correspondence to saved category/detail HTML. I did not perform visual scene comparison or browser review.
