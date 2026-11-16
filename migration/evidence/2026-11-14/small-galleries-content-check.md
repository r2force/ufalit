# Small galleries content verification

**Result: 14/14 local assets match the source SHA-256 and size recorded in the source-check reports.** Category/detail captions, source order, target order, and local `href`/`src` paths were checked for galleries 25, 28, 29, and Uzikov.

## Findings

- Gallery 25: category and target order IDs 431–433. Captions `T01`, `T02`, `T03` match category title, detail alt, and target figcaption.
- Gallery 28: category and target order IDs 448–450. Captions `l01`, `l02`, `l03` match category title, detail alt, and target figcaption. The source category title’s spelling “Совемренники и коллеги” is retained in the target.
- Gallery 29: category and target order IDs 451–452. Captions `img15172843` and `IMG_0711` match category title, detail alt, and target figcaption.
- Uzikov: archived category list (gallery 16) and target order IDs 669–674. Captions for IDs 669–671 match the detail description “Узиков Юрий Андреевич”; IDs 672–674 match “Дом печати”, “Дом Узикова”, and “УНЦ РАН”.
- For all 14 items, target `img src` and enclosing `a href` resolve to the assigned local asset. The table shows independently recalculated local SHA-256 and byte size against the source-check report values.

## Per-item source and target evidence

| Gallery | ID | Exact source/target caption | Assigned local asset | Bytes | Recorded source SHA-256 | Recalculated local SHA-256 | Match |
|---|---:|---|---|---:|---|---|---|
| 25 | 431 | T01 | `site/assets/gallery/25/photo-431.jpg` | 59885 | `a97078ca0be8f5d7b21c490aaae56b6ea9695e35a9d8e1321745a79cb67d1b17` | `a97078ca0be8f5d7b21c490aaae56b6ea9695e35a9d8e1321745a79cb67d1b17` | yes |
| 25 | 432 | T02 | `site/assets/gallery/25/photo-432.jpg` | 62004 | `fa36a6f49d73f00229b3080b2e945b425fee154f6a02c6b684d01f5006828029` | `fa36a6f49d73f00229b3080b2e945b425fee154f6a02c6b684d01f5006828029` | yes |
| 25 | 433 | T03 | `site/assets/gallery/25/photo-433.jpg` | 75081 | `a3118074c269d03b908ddb5758bbb460f01dd8793b7c417ea45956cfb4164cf5` | `a3118074c269d03b908ddb5758bbb460f01dd8793b7c417ea45956cfb4164cf5` | yes |
| 28 | 448 | l01 | `site/assets/gallery/28/photo-448.jpg` | 5710 | `ca78a7760d08679feddbe8cba9a02ab751bf58f24d741553b755c908e47ccba2` | `ca78a7760d08679feddbe8cba9a02ab751bf58f24d741553b755c908e47ccba2` | yes |
| 28 | 449 | l02 | `site/assets/gallery/28/photo-449.jpg` | 6856 | `bf70975c1ebfcd00777ac1b4a6fb05f17604b5a6e7360ba0c4c77726670962a1` | `bf70975c1ebfcd00777ac1b4a6fb05f17604b5a6e7360ba0c4c77726670962a1` | yes |
| 28 | 450 | l03 | `site/assets/gallery/28/photo-450.jpg` | 5159 | `5cd0d63d7762a391118ab68b80d7337129b1ebaf526241fe6ae783b612868412` | `5cd0d63d7762a391118ab68b80d7337129b1ebaf526241fe6ae783b612868412` | yes |
| 29 | 451 | img15172843 | `site/assets/gallery/29/451.jpg` | 13252 | `0199245b56eb1583281ef29200a723c171994ff6d61e958ed23255ac4fa9b26f` | `0199245b56eb1583281ef29200a723c171994ff6d61e958ed23255ac4fa9b26f` | yes |
| 29 | 452 | IMG_0711 | `site/assets/gallery/29/452.jpg` | 46333 | `05b01eb1bd8a242c0cb4b4e2981dcd34bf6456fcd1b0afbdc94136a847c578e8` | `05b01eb1bd8a242c0cb4b4e2981dcd34bf6456fcd1b0afbdc94136a847c578e8` | yes |
| uzikov | 669 | Узиков Юрий Андреевич | `site/assets/gallery/uzikov/669.jpg` | 210649 | `c4e627f28f9d4cfd1a95a52f1a984dcd5d81c9db24ada98b082c4d3263c86af7` | `c4e627f28f9d4cfd1a95a52f1a984dcd5d81c9db24ada98b082c4d3263c86af7` | yes |
| uzikov | 670 | Узиков Юрий Андреевич | `site/assets/gallery/uzikov/670.jpg` | 9240 | `ceef308a374fdce93126249a14e622c13f51b10d4a29c020836e097e1a7784cd` | `ceef308a374fdce93126249a14e622c13f51b10d4a29c020836e097e1a7784cd` | yes |
| uzikov | 671 | Узиков Юрий Андреевич | `site/assets/gallery/uzikov/671.jpg` | 42257 | `7bb04dd7606371d7af951cd6e8e294b390725537dec935abae52d72342d13715` | `7bb04dd7606371d7af951cd6e8e294b390725537dec935abae52d72342d13715` | yes |
| uzikov | 672 | Дом печати | `site/assets/gallery/uzikov/672.jpg` | 37878 | `7d530e4fd121336f1c58ad304fe7e26cb92c491ac7d50ab4f0a0afed5f72f42b` | `7d530e4fd121336f1c58ad304fe7e26cb92c491ac7d50ab4f0a0afed5f72f42b` | yes |
| uzikov | 673 | Дом Узикова | `site/assets/gallery/uzikov/673.jpg` | 1483091 | `d9b366c537fba4f722f3786a6b8bb2108887f986136712cf806a6d968147213e` | `d9b366c537fba4f722f3786a6b8bb2108887f986136712cf806a6d968147213e` | yes |
| uzikov | 674 | УНЦ РАН | `site/assets/gallery/uzikov/674.jpg` | 119460 | `5d78103c9b6274052018c1bdcafe1a5c475b7eeb7b4fbc7b6cb600ba56187ffe` | `5d78103c9b6274052018c1bdcafe1a5c475b7eeb7b4fbc7b6cb600ba56187ffe` | yes |

## Temporary source files and limits

The `/private/tmp/gallery25-repeat-*`, `gallery28-repeat-*`, `gallery29-repeat-*`, and `gallery-uzikov-repeat-*` files are absent after the environment restart (zero files found for each pattern). Therefore this check does **not** claim a renewed byte-for-byte comparison against those temporary bodies. It only compares independently calculated local hashes and sizes with the recorded source SHA/size in the source-check reports. The reports document their earlier source download checks, but I did not rerun those downloads. No design or browser rendering was assessed.

## Evidence used

- Source-check reports: `migration/evidence/2026-11-14/gallery-25-source-check.md`, `gallery-28-source-check.md`, `gallery-29-source-check.md`, and `gallery-uzikov-source-check.md`.
- Saved category/detail snapshots: `migration/evidence/2026-11-12/gallery-25/`, `gallery-28/`, `gallery-29/`; Uzikov detail snapshots in `migration/evidence/2026-11-12/gallery-uzikov/` and category listing `migration/evidence/2026-11-11/batch-2/gallery-16.html.gz`.
- Target pages: `site/pages/gallery-25/index.html`, `gallery-28/index.html`, `gallery-29/index.html`, and `gallery-uzikov/index.html`.
