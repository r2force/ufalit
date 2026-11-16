# Reading articles and award images content check

**Scope:** 20 images in reading articles 399, 400, 401, 404, 408, 415, 416, plus medal and stipend pages.

- Independently recalculated local SHA-256: 20/20 match the recorded source SHA. Local byte sizes: 20/20 match recorded source sizes.
- Source and target order were checked by locating each image URL/local `src` in its article snapshot/page. The target sequence matches source order for each article group; each target `src` resolves to the assigned local file.
- Captions/context: saved source `<img>` tags do not carry `alt` or `title` labels for these 20 items. The target pages supply alt descriptions; each exact source/target alt and surrounding text context is recorded row-by-row in the TSV. There is no explicit source image caption in the image tag to compare.
- Link status is itemized in the TSV. The reading article, medal, and stipend images are inline and have no enclosing `<a href>`; their local image `src` paths resolve. A reused asset exception is recorded if the same local image appears elsewhere (reading-404 image 1 is also referenced by gallery-36).
- Temporary repeat bodies: 20/20 present at check time; 20/20 present bodies matched both recorded source SHA and local bytes. If a body was absent, its TSV row says “not checked”; this report does not imply a missing body was re-downloaded.

## Item-by-item results

| Seq | Content ID | Source order | Target order | Source label | Target alt | Local target | Bytes | Source SHA = local SHA | Repeat body |
|---:|---|---:|---:|---|---|---|---:|---|---|
| 01 | `reading-399-image-1` | 1 | 1 | (none in source img) | Обложка книги «Аленький цветочек» | `site/assets/reading/aksakov/book-cover.jpg` | 42922 | yes | equal |
| 02 | `reading-399-image-2` | 2 | 2 | (none in source img) | Обложки изданий сказки «Аленький цветочек» | `site/assets/reading/aksakov/illustration.gif` | 69402 | yes | equal |
| 03 | `reading-400-image-1` | 1 | 1 | (none in source img) | Обложка книги «Детские годы Багрова-внука» | `site/assets/reading/aksakov/image006.jpg` | 71592 | yes | equal |
| 04 | `reading-400-image-2` | 2 | 2 | (none in source img) | Издание книги «Детские годы Багрова-внука» | `site/assets/reading/aksakov/image011.gif` | 16602 | yes | equal |
| 05 | `reading-400-image-3` | 3 | 3 | (none in source img) | Издание книги «Детские годы Багрова-внука» | `site/assets/reading/aksakov/image012.jpg` | 18726 | yes | equal |
| 06 | `reading-400-image-4` | 4 | 4 | (none in source img) | Издание книги «Детские годы Багрова-внука» | `site/assets/reading/aksakov/image009.gif` | 14861 | yes | equal |
| 07 | `reading-401-image-1` | 1 | 1 | (none in source img) | Обложка издания книги С. Т. Аксакова | `site/assets/reading/aksakov/image014.jpg` | 19623 | yes | equal |
| 08 | `reading-401-image-2` | 2 | 2 | (none in source img) | Обложка издания книги С. Т. Аксакова | `site/assets/reading/aksakov/image016.jpg` | 92262 | yes | equal |
| 09 | `reading-415-image-1` | 1 | 1 | (none in source img) | Пчела | `site/assets/reading/kiekbaev/image001.jpg` | 47438 | yes | equal |
| 10 | `reading-415-image-2` | 2 | 2 | (none in source img) | Медведь и лиса | `site/assets/reading/kiekbaev/image003.jpg` | 487031 | yes | equal |
| 11 | `reading-416-image-1` | 1 | 1 | (none in source img) | Лиса и ёж | `site/assets/reading/kiekbaev/image005.jpg` | 526258 | yes | equal |
| 12 | `reading-404-image-1` | 1 | 1 | (none in source img) | Мустай Карим за столом | `site/assets/reading/karim/image002.jpg` | 101908 | yes | equal |
| 13 | `reading-404-image-2` | 2 | 2 | (none in source img) | Обложка книги «Долгое-долгое детство» | `site/assets/reading/karim/image004.jpg` | 65624 | yes | equal |
| 14 | `reading-404-image-3` | 3 | 3 | (none in source img) | Обложка книги «Радость нашего дома. Таганок» | `site/assets/reading/karim/image006.jpg` | 29624 | yes | equal |
| 15 | `reading-408-image-1` | 1 | 1 | (none in source img) | Портрет Газима Шафикова работы А. Лутфуллина | `site/assets/reading/shafikov/image001.png` | 6605570 | yes | equal |
| 16 | `reading-408-image-2` | 2 | 2 | (none in source img) | Трое мужчин беседуют | `site/assets/reading/shafikov/image003.png` | 3497932 | yes | equal |
| 17 | `reading-408-image-3` | 3 | 3 | (none in source img) | Двое мужчин беседуют | `site/assets/reading/shafikov/image005.jpg` | 30693 | yes | equal |
| 18 | `reading-408-image-4` | 4 | 4 | (none in source img) | Два архивных снимка | `site/assets/reading/shafikov/image009.gif` | 81150 | yes | equal |
| 19 | `medal-image-01` | 1 | 1 | (none in source img) | Памятная медаль «Мустай Карим» на удостоверении | `site/assets/medal/image003.jpg` | 125446 | yes | equal |
| 20 | `stipend-image-001` | 1 | 1 | (none in source img) | Диплом стипендиата имени Мустая Карима | `site/assets/stipend/image001.jpg` | 104718 | yes | equal |

## Context and locator observations

- For article images, the TSV records each image’s source snapshot, within-article order, source `src`/`mce_src`, target page and image order, source/target surrounding paragraph text, and target local path. Source pages used: `migration/evidence/2026-11-11/reading-articles/{399,400,401,404,408,415,416}.html.gz`.
- For the medal image, the saved source HTML’s `src` is a `127.0.0.1` development URL while `mce_src` retains `/images/konkurs/karim/image003.jpg`, which corresponds to the recorded source URL. The target `src` is local.
- Stipend source image uses `/images/konkurs/karim/image001.jpg`; the target path is local.
- No design evaluation was performed.

## Limits

This review compares source hashes recorded in `reading-images-source-check.tsv` with local recalculations and documents matching source/target contexts and paths. It does not establish semantic visual identity of depicted content from a screenshot. Source pages are saved HTML snapshots, not live source responses. See the TSV for each precise field and any repeat-body availability.

## Evidence

- `migration/evidence/2026-11-14/reading-images-source-check.tsv`
- `migration/evidence/2026-11-11/reading-articles/` source snapshots
- `migration/evidence/2026-11-12/medal/source/medal.html` and `migration/evidence/2026-11-12/stipend/source/page.html`
- Target reading pages, `site/pages/medal/index.html`, and `site/pages/stipend/index.html`
