# Gallery Bikbay content verification

- Date: 2026-11-14
- Target: `site/pages/gallery-bikbay/index.html`
- Scope: all 19 gallery entries, captions, order, downloaded originals, local asset destinations, and page-local links. Layout/design was not evaluated.

## Results

- Target has 19 figures in order `384, 383, 385–401`. This matches the source order recorded in `migration/assets.csv` and the per-image snapshots under `migration/evidence/2026-11-12/gallery-bikbay/`. The snapshots' previous/next links also agree with that sequence (384 → 383 → 385 → … → 401).
- I additionally parsed the category snapshot `migration/evidence/2026-11-11/batch-2/gallery-2.html.gz`, pairing each gallery item's detail ID with its `phocaimgdesc` text. It contains exactly 19 relevant entries, in order `384, 383, 385–401`; every category caption matches both the corresponding saved detail snapshot's description and target `<figcaption>` after normalizing HTML entities, non-breaking spaces, and whitespace. No order or caption discrepancies found. The target image `alt` repeats its caption for all 19 items.
- I independently SHA-256 hashed each fresh response body `/private/tmp/gallery-bikbay-repeat-<ID>.jpg` and its corresponding `site/assets/gallery/bikbay/<ID>.jpg`. All 19 pairs are byte-for-byte identical, and all 19 source bodies and target files exist. Sizes and SHA-256 values are recorded below.
- Each figure links to its own local image file and uses that same file as `img src`. All 47 local `href`/`src` references on the page resolve from the page directory. This includes shared stylesheet, page navigation, and every image. The library footer remains an absolute external HTTP link.
- The page uses modern structural elements (`main`, `nav`, `figure`, `figcaption`), and a linked stylesheet. I found no obsolete presentation tags, inline or embedded styles, scripts, or Joomla/MCE marker tokens in this page.

| Position | ID | Source detail caption | Target caption | Bytes | Fresh-source SHA-256 = local SHA-256 |
|---:|---:|---|---|---:|---|
| 1 | 384 | Б. Бикбай и Сагит Агиш | Б. Бикбай и Сагит Агиш | 102175 | `c7009d0048b64af83f958b1747d7abe1d942ec4599d19b10689a360595a8d5a8` |
| 2 | 383 | Б. Бикбай и Загир Исмагилов | Б. Бикбай и Загир Исмагилов | 102990 | `c99d6e7a409d5fc6ce7e8f9fcdaa74c3297fe5ebc1f22ffdf85c43120c05a455` |
| 3 | 385 | Баязит Бикбай с внуком Камилем. 1968 год | Баязит Бикбай с внуком Камилем. 1968 год | 60633 | `753037017018551146324c610cfac28f93e570c943a59eb9f711f0f8646a755a` |
| 4 | 386 | Баязит Бикбай с женой Аминой, с дочкой Элизой. 1949 год | Баязит Бикбай с женой Аминой, с дочкой Элизой. 1949 год | 67094 | `14bbc19de47ee61eac4825e82e4af761082544f8a6daec5cb6ebb7669ee9f4b7` |
| 5 | 387 | Баязит Бикбай с Хай Мухаматьяровым 1930 г. | Баязит Бикбай с Хай Мухаматьяровым 1930 г. | 40076 | `e9435f4aec6a67a44344857a718b8b908506897c1d0047eba9aba13f433c6e22` |
| 6 | 388 | Галимов Салям, Сагит Агиш, Баязит Бикбай, 1932 г. | Галимов Салям, Сагит Агиш, Баязит Бикбай, 1932 г. | 41170 | `e6386bdf6780a24b39ed07d2806a6d50ab7262b8b01ca3a757e8ae66077bee1c` |
| 7 | 389 | Гимназия 38 им. Бикбая | Гимназия 38 им. Бикбая | 31841 | `79dfecadaa324a2dc264b8f7847fd2c6f45b37c7c88945f5b75fa53bc39572cb` |
| 8 | 390 | Гимназия 38 им. Бикбая | Гимназия 38 им. Бикбая | 52021 | `e56805b7c75a75859445b57d57c22c2f190a01babe98d2eb49af1ca905d8c054` |
| 9 | 391 | Группа башкирских писателей | Группа башкирских писателей | 139326 | `49226ac7af0a9dd3ec7261dc22dbf402f1e434e921a26b1c8feb17fe240b4845` |
| 10 | 392 | К. Мэргэн, М. Карим, Б. Бикбай | К. Мэргэн, М. Карим, Б. Бикбай | 31087 | `fb2ce82e09bf875b0140c11c22010efa6df62c6b5a587aa1f70e6bbba0153c0e` |
| 11 | 393 | Карта улицы им. Бикбая | Карта улицы им. Бикбая | 93593 | `c37817bcba972f4be90ce2596526041864535cf394866676bccc42ecccfa1873` |
| 12 | 394 | Мемориальная доска Бикбаю | Мемориальная доска Бикбаю | 86725 | `f199158796c4e9a2fa9b5a9ec6062c447a63adba9a0d629d487a74079a080670` |
| 13 | 395 | Могила Бикбая | Могила Бикбая | 109062 | `a3e6afa35c7554d0861f0e01f85746fcffd11052e16edce8f345f0e82d12cc27` |
| 14 | 396 | Музей в Сипайлово | Музей в Сипайлово | 33309 | `a69efceaf12a7dafa105691c7b55185a564a108b7536761c4f0ec90b9e7d1756` |
| 15 | 397 | Музей в Сипайлово | Музей в Сипайлово | 42412 | `ea0a111ac47dfedea44180a775977a4f43a6992478a8d9a2dd9ffdfa63ec9c3b` |
| 16 | 398 | Сцена из спектакля Кодаса | Сцена из спектакля Кодаса | 78138 | `f703e3abb2b9a0848578556c2fcccfe3c852cd90557964fb2109336de42c8dcd` |
| 17 | 399 | Сцена из спектакля Кодаса | Сцена из спектакля Кодаса | 46627 | `2bb9c6330b55a97c7d83db1c2d2fd6703fcd2424139aedd0055ac60000c4adc0` |
| 18 | 400 | Улица им. Бикбая | Улица им. Бикбая | 83849 | `310523aab556f6d76198fcccc86845fd2f7095e3d3b5168b375d90e6235f5dac` |
| 19 | 401 | Улица им. Бикбая | Улица им. Бикбая | 55305 | `24726b045893d9c2f3598fc21e0e360ca28826c31d50949ceecdd53c91420579` |

## Limits

- This is a byte-identity check from repeated source downloads to local assets, plus text/order comparison to the saved category and detail snapshots. I did not perform an independent visual scene-by-scene review or browser check.
