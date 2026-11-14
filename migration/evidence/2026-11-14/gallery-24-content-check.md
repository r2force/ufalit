# Gallery 24 content verification

- Date: 2026-11-14
- Target: `site/pages/gallery-24/index.html`
- Scope: all 18 category entries and target placements, captions/order, fresh original bodies versus assigned local assets, including reused assets. Layout/design was not evaluated.

## Findings

- The saved source category `migration/evidence/2026-11-12/gallery-24/source-current.html.gz` contains 18 entries in order: IDs 409–422, then 426–429. Its caption sequence matches all 18 saved detail snapshots and target `<figcaption>`/`img alt` text exactly.
- For every item, I independently compared `/private/tmp/gallery24-repeat-<ID>.jpg` with the assigned target file and computed SHA-256. All 18 fresh bodies match their assigned files byte-for-byte, including the six items reused from `site/assets/places/bikchentev/`: IDs 412, 414, 415, 420, 422, and 426. The other 12 files are under `site/assets/gallery/24/`.
- Every figure's image link and `img src` point to the same assigned local asset. The page has 18 figures and all 43 local `href`/`src` references resolve relative to its directory.
- The parent category snapshot records the category title “Фото. Памятные места Бикчентаева” and `(18)`; these agree with the target heading and figure count.

| Position | ID | Source/detail/target caption | Target local file | Reused | Bytes | Fresh-source SHA-256 = assigned-local SHA-256 |
|---:|---:|---|---|:---:|---:|---|
| 1 | 409 | Бикчентаев в детской библиотеке | `site/assets/gallery/24/photo-409.jpg` | no | 520332 | `de811ff8f9c33acd2e51d256f13f3e121a23b3252a867d356cedbf9e66bc3501` |
| 2 | 410 | Бывший гастроном | `site/assets/gallery/24/photo-410.jpg` | no | 82683 | `1557f611c8c692efbf0b6694a5f104f8b7481046e9a4c7b15bd00b1dc61938f6` |
| 3 | 411 | Бывший Детский мир | `site/assets/gallery/24/photo-411.jpg` | no | 3736758 | `a41f6ad51c8eb4f5b351240cd2f9dcaae056cf12ad1d7e908236692313ce4341` |
| 4 | 412 | Дом во дворе улицы Цюрупы | `site/assets/places/bikchentev/image003.jpg` | yes | 3766424 | `889bdb865a98dcbe69bf6041901cb6ed285d1cb7357c8cf0988b1c33d142f6d9` |
| 5 | 413 | Дом героев Большого оркестра | `site/assets/gallery/24/photo-413.jpg` | no | 3670586 | `d10f0021582c851850ddd334911630d93e17d86317b634a6b351867b21efa440` |
| 6 | 414 | Достоевского 73 | `site/assets/places/bikchentev/image007.jpg` | yes | 3704066 | `5786836696a6275bdafb89fced3261505b6de1ba635b7121dd5edb88e70b932f` |
| 7 | 415 | Здесь размещалась редакция Ленинца | `site/assets/places/bikchentev/image005.jpg` | yes | 3701074 | `434a6083ba817a8402a4643c1252794d3b5a3eb2caeb7c63e8ae80c690225779` |
| 8 | 416 | Здесь размещалась редакция Советской Башкирии | `site/assets/gallery/24/photo-416.jpg` | no | 3727574 | `dcb042bfe955451a5852663878ab80d27c516f0141cf433a15d152ae10569ddc` |
| 9 | 417 | Коммунистическая 43 | `site/assets/gallery/24/photo-417.jpg` | no | 3666762 | `040c2bebda6f9d627751d42f306520c9c2cbd962821fb6d37f8e8e1395fa2ab8` |
| 10 | 418 | Коммунистическая 107 | `site/assets/gallery/24/photo-418.jpg` | no | 50376 | `89397983e5d39fc0644130a0fa6ac7ae54afdf2c4b902776edd6b9013c78f68b` |
| 11 | 419 | Мустай и Анвер | `site/assets/gallery/24/photo-419.jpg` | no | 1182329 | `7b644784f6a4ecbe464e045f645f0d0c738d21614d895fab4c99eeaa36ea3c62` |
| 12 | 420 | Мусульманское кладбище | `site/assets/places/bikchentev/image011.jpg` | yes | 3694691 | `5c11ab1a7265048cac68239cf7cbf9952cb0bc091080a2e45c19aa9bc12a069a` |
| 13 | 421 | Островок у железнодорожного моста | `site/assets/gallery/24/photo-421.jpg` | no | 3797930 | `227be3f11c21b6fc86b66474763c66fee29eb00768bd8c9990a165d5bafd08e2` |
| 14 | 422 | Памятная доска | `site/assets/places/bikchentev/image009.jpg` | yes | 3776749 | `2275ade200ac4ba4d3cdc7edde0523f945f62d2173528a3a88b7462e7b3e1a89` |
| 15 | 426 | Правление Союза писателей | `site/assets/places/bikchentev/image018.jpg` | yes | 3717086 | `6dd01e459cac60eef6b205428b9feec2e8ab780e3ceb825255a529f3e6bd1ad5` |
| 16 | 427 | Сад на Случевской горе | `site/assets/gallery/24/photo-427.jpg` | no | 3631127 | `184e015c930c87889d03a76d27f2527014977dbb70a6f33cd25750f4466aa124` |
| 17 | 428 | Улица Достоевского у дома Бикчентаева | `site/assets/gallery/24/photo-428.jpg` | no | 1430105 | `6fc7370bfb2d255cde36de3bd6f66fe4b1dca032845a01a855e29537c20523c8` |
| 18 | 429 | Школа № 35 | `site/assets/gallery/24/photo-429.jpg` | no | 1205068 | `e5caf94597e310c56fc22365fadbe6683e590061cd7a2685bfb65c24cc5b67ae` |

## Limits

- The checks establish exact byte identity between repeated source downloads and assigned local files, and exact text/order correspondence to saved category and detail HTML. I did not perform a separate visual scene-by-scene review or browser check.
