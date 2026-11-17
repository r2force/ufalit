# Разбор трёх расхождений live article audit

Проверены ровно три отмеченных случая в `live-article-compare.tsv`: ID 319 (`image003.jpg`), ID 317 (11 `raw-media-url` без парного target URL) и ID 396 (второй raw URL без target). Сопоставлены сырые сохранённые article HTML, фактические `<img>`-вхождения и текущие target HTML, соответствующие строки `assets.csv`/`content-parity.csv`, сохранённые source-check evidence и независимо пересчитанные SHA-256 локальных файлов. Новые загрузки не выполнялись; сайт, реестры и Git не менялись.

## ID 319 — `uzikov/image003.jpg` → переиспользованный `672.jpg`

- Свежий source: `migration/evidence/2026-11-17/live-refresh/article-002.html.gz`; страница ID 319, раздел «Узиков Юрий Андреевич». Встроенный видимый элемент — `<img src="/images/pamiatniemesta/uzikov/image003.jpg">` в абзаце, затем идёт исходная подпись о Доме печати. Это одно изображение, без ссылки `<a>` и без отдельного вложения.
- Аудит live-статьи сопоставляет позицию 168 с фактическим target `../../assets/gallery/uzikov/672.jpg`. В текущем [places/index.html](/Users/user/codex_dirs/ufalit/site-repo/site/pages/places/index.html) у `#places-image-168` действительно стоит этот `src`; подпись и позиция сохранены.
- Повторный файл `site/assets/gallery/uzikov/672.jpg` имеет 37 878 байт и SHA-256 `7d530e4fd121336f1c58ad304fe7e26cb92c491ac7d50ab4f0a0afed5f72f42b`. Это совпадает с записью `assets.csv` для публичного исходного URL `https://ufalit.ufacsdb.ru/images/pamiatniemesta/uzikov/image003.jpg` и с независимой проверкой источника в `migration/evidence/2026-11-14/places-source-check.md` (строка 169). Этот же файл зарегистрирован как загрузка категории gallery-uzikov, detail ID 672. Контент-проверка places также зафиксировала совпадение источника и локального файла по SHA и по размещению (`places-content-check.md`, строка 169).
- **Вывод:** это переиспользование уже сохранённого побайтно идентичного фото, а не пропущенное изображение. Отличие имени файла допустимо и обосновано повторным использованием.
- **Реальное несоответствие:** строка `places-image-168` в `migration/content-parity.csv` всё ещё указывает `target_ref=../../assets/places/uzikov/image003.jpg`; такого файла нет. В самой target-странице фактический путь — `../../assets/gallery/uzikov/672.jpg`. Рекомендуемое исправление реестра: заменить `target_ref` на фактический путь из target, сохранив исходный `source_ref`, target locator и доказательства. Не создавать вторую копию файла.

## ID 317 — 11 «непарных» raw URL являются атрибутами тех же изображений

Сохранённый ответ: `migration/evidence/2026-11-17/live-refresh/article-004.html.gz`. В статье 20 содержательных изображений; в каждом из рассматриваемых случаев URL обнаружен в атрибутах `<img src>` и/или редакторском `mce_src`, а не как отдельная ссылка `<a>` или файл-вложение. В target также 20 изображений, в исходном порядке. Плоское сравнение последовательностей raw URL приняло варианты URL-атрибутов за новые отдельные медиа и сдвинуло пары.

| Строки raw URL без target | Source occurrence | URL варианты/контекст | Фактический локальный target | SHA-256 target |
|---|---:|---|---|---|
| 21–22 | 14 | `http://127.0.0.1:4001/work/images/konkurs/aksakov/0%288%29.jpg`; `/images/konkurs/aksakov/0(8).jpg` | `site/assets/awards/0(8).jpg` | `99484ee6c26dd6bc814aec5731cb2f9683c45a15319d5827e14507036ca64c09` |
| 23–24 | 15 | `http://127.0.0.1:4001/work/images/konkurs/aksakov/0%289%29.jpg`; `/images/konkurs/aksakov/0(9).jpg` | `site/assets/awards/0(9).jpg` | `d03a93d286750be32ba4899b852c1560b00bdaf6e18e4646492135a5299a5821` |
| 25–26 | 16 | `/images/konkurs/aksakov/0%2810%29.jpg`; `/images/konkurs/aksakov/0(10).jpg` | `site/assets/awards/0(10).jpg` | `c7eeb95841b5d53bcd0ce94eae463174db921154e1624cf21389c6fd9e8159f3` |
| 27–28 | 17 | `http://127.0.0.1:4001/work/images/konkurs/aksakov/0%281%29.jpg`; `/images/konkurs/aksakov/0(1).jpg` | `site/assets/awards/0(1).jpg` | `726494f958693de5cbd8c8619f824be7c27c530f2548abf3eed9e8ceb5aa3b78` |
| 29 | 18 | `/images/konkurs/mazhit/medal.jpg` (`src` и `mce_src` одной картинки) | `site/assets/awards/medal.jpg` | `04c712bdd896f42bba5085f5d6c0f69476cfa6781a7b142529c3ecd6ce45a5cf` |
| 30 | 19 | `/images/konkurs/mazhit/medal2.jpg` (`src` и `mce_src` одной картинки) | `site/assets/awards/medal2.jpg` | `0fb842ca1613134a8b7495ad81216d9ad7874501f20b03d4adfa3144e132899b` |
| 31 | 20 | `/images/konkurs/hudaiberdin/01.png` (`src` и `mce_src` одной картинки) | `site/assets/awards/01.png` | `d43369b312f1de5121c47763699fcfd84b0b26bbb80c6adc545e5116eda9ad7b` |

Эти occurrence соответствуют содержимому `awards-image-14`…`awards-image-20` в `content-parity.csv`. Для всех семи путь, раздел и порядок подтверждены в `migration/evidence/2026-11-14/awards-content-check.md`; свежие source тела и локальные файлы побайтно сверены в `awards-source-check.md`. Размеры target по порядку: 8 360, 21 799, 11 521, 5 131, 26 466, 144 520 и 567 643 байта. Независимый пересчёт SHA локальных файлов совпал с source-check для всех семи.

Остальные четыре `src`/MCE-варианта из строк 21–28 прикреплены к тем же occurrences 14–17, а не к дополнительным картинкам. В источнике они отличаются loopback hostname и/или percent-encoding скобок. `http://127.0.0.1:4001/...` не считается отдельным публичным ресурсом; canonical `/images/...` вариант сохранён в `mce_src` и использован как исходный URL загрузки.

- **Вывод:** реального пропуска target-медиа нет. Все 20 видимых изображений ID 317 в target имеют соответствующие локальные файлы; 7 ресурсов, на которые указывают строки raw 21–31, дополнительно имеют побайтное подтверждение. Сравнение не только недосчитало 11 URL: поскольку оно позиционно выравнивало список из 31 URL с 20 image occurrences, часть ранних `different-url-review` также сдвинута. Повторно оценивать нужно весь raw URL список по DOM occurrence, а не только последние 11 строк.
- **Ограничение:** для изображений с буквальным `src` на `127.0.0.1` идентичность ответа именно этого loopback URL отдельно не проверялась. Доказана идентичность локального target официальному URL из `mce_src`/asset-check, а не недоступному loopback endpoint.
- **Рекомендуемое исправление сверки:** группировать URL-варианты по исходному `<img>` occurrence. Учитывать `src` как отображаемый ресурс, `mce_src` как редакторскую альтернативу того же элемента; нормализовать hostname/source path и percent-encoding для определения дублей. Сравнивать 20 image occurrences с 20 target occurrences, не плоский список из 31 raw URL. Сам сайт и строки `awards-image-14`…`awards-image-20` исправлять не требуется.

## ID 396 — loopback `src` и canonical `mce_src` у одной медали

- Свежий source: `migration/evidence/2026-11-17/live-refresh/article-026.html.gz`. Контент содержит один видимый `<img>` в начале статьи с `src="http://127.0.0.1:4001/work/images/konkurs/karim/image003.jpg"` и `mce_src="/images/konkurs/karim/image003.jpg"`. Второй «непарный» raw URL `/images/konkurs/karim/image003.jpg` — не вторая иллюстрация и не `<a>`/вложение: это canonical MCE-атрибут того же `<img>`.
- Target содержит одну медаль в `site/pages/medal/index.html`, `../../assets/medal/image003.jpg`. В `content-parity.csv` строка `medal-image-01` связывает публичный canonical source URL с этой target-картинкой и имеет статус `matched`.
- Target-файл имеет 125 446 байт, SHA-256 `8551f4b0a7c7aaac8d7ad598daa00256c541e706a39701027458815157cd2770`. Те же размер и SHA записаны в `migration/evidence/2026-11-12/medal/REPORT.md` и `asset-metadata.csv` для ответа HTTP 200 `image/jpeg` по canonical URL; повторный SHA локального файла совпал. В `migration/evidence/2026-11-17/reading-images-content-check.md` есть подтверждение свежего source SHA ↔ local SHA, occurrence, контекста и порядка.
- **Вывод:** raw URL #2 не обозначает пропущенную картинку; текущий target содержит соответствующее изображение, и source-check подтверждает его побайтную идентичность canonical ресурсу.
- **Ограничение:** исходный `src` на 127.0.0.1 не запрашивался отдельно. Доказательство привязано к сохранённому canonical `mce_src` и official asset endpoint. Визуальное совпадение placement в исходном браузере не подтверждается этим SHA.
- **Рекомендуемое исправление сверки:** аналогично ID 317, считать обе URL-вариации атрибутами одного image occurrence. В content parity уже записаны canonical source и фактический local target; менять эту строку не требуется.

## Итоговые действия

1. Для ID 319 исправить только устаревший `target_ref` строки `places-image-168` в общем parity registry на `../../assets/gallery/uzikov/672.jpg` (это рекомендация владельцу реестра; здесь реестр не менялся).
2. ID 317 и 396 в списке открытых raw URL-различий можно закрыть как ошибки плоского сопоставления: source→target image occurrence, контекст и локальная побайтная копия подтверждены. Сохранять оговорку, что `127.0.0.1` URL body отдельно не проверялся.
