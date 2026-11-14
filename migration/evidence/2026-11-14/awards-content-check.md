# Независимая сверка содержания: «Конкурсы и награды»

Дата: 2026-11-14. Сверены снимок `migration/evidence/2026-11-12/awards/source/awards.html`, страница `site/pages/awards/index.html`, свежие тела `/private/tmp/awards-source-001.jpg` … `020.png`, локальные медиа и `migration/evidence/2026-11-12/awards/asset-metadata.csv`. Оформление не оценивалось.

## Результат

- В source snapshot найдено 20 содержательных изображений `/images/konkurs/…`; в target — 20 ссылок на `site/assets/awards/…`. Последовательность, имена и соответствующие публичные source URL совпали для всех 20 вхождений. Все локальные файлы существуют.
- Независимо пересчитанный SHA-256 каждого свежего source body совпадает с SHA локального файла и записью manifest: 20/20. Два исходных URL (`image0031.jpg` и `0(5).jpg`) имеют одинаковый хеш, но это два отдельных вхождения в разных абзацах; оба сохранены на своих местах.
- Шесть разделов идут в одинаковом порядке с теми же заголовками. Ненулевые абзацы сравнивались по порядку после нормализации только пробелов; все совпали (65, 15, 2, 29, 3 и 19 абзацев по разделам; 133 всего).
- Единственная таблица сохранена: строка 1, ячейки 1–2 содержат `medal.jpg`, затем `medal2.jpg`, как в источнике. Заголовок «Премия имени Мажита Гафури и медаль» совпадает.
- У исходных изображений нет `alt`, `title` или `figcaption`; отдельных текстовых подписей к фото не обнаружено. В target добавлен общий `alt` «Иллюстрация к разделу …», указывающий раздел, а не оригинальную подпись.

## Поэлементное сопоставление

База URL исходников: `https://ufalit.ufacsdb.ru`. Колонка «src в снимке» показывает буквальное значение атрибута HTML. Локатор `pN` — порядковый абзац внутри раздела; таблица указана по ячейке.

| № | Публичный source URL path | src в snapshot | Source → target locator / section | Target file и `src` | SHA-256 |
|---:|---|---|---|---|---|
| 01 | `/images/konkurs/aksakov/image001.jpg` | `/images/konkurs/aksakov/image001.jpg` | Аксаков Сергей Тимофеевич; p10 → p10 | `site/assets/awards/image001.jpg`; `../../assets/awards/image001.jpg` | `79861c9f8a072b2a24f0abc23b9e7a4445b64bd31aea93fcea7a3398a03ccda9` |
| 02 | `/images/konkurs/aksakov/image003.jpg` | `/images/konkurs/aksakov/image003.jpg` | Аксаков Сергей Тимофеевич; p10 → p10 | `site/assets/awards/image003.jpg`; `../../assets/awards/image003.jpg` | `d25a782f3c6d44f3e431d75d6d381f471c4b9c1167fd785509d8b3043796ec6c` |
| 03 | `/images/konkurs/aksakov/image009.jpg` | `/images/konkurs/aksakov/image009.jpg` | Аксаков Сергей Тимофеевич; p20 → p20 | `site/assets/awards/image009.jpg`; `../../assets/awards/image009.jpg` | `2698e0809a199910a6a1c8db07b08eef40c3f9808923f3e022999008f514ad97` |
| 04 | `/images/konkurs/aksakov/image007.jpg` | `/images/konkurs/aksakov/image007.jpg` | Аксаков Сергей Тимофеевич; p20 → p20 | `site/assets/awards/image007.jpg`; `../../assets/awards/image007.jpg` | `089db8ec46514dccecb8f33003c8f169211ea13f34d2d19f4125c7fe5fcfdc87` |
| 05 | `/images/konkurs/aksakov/image0011.jpg` | `http://127.0.0.1:4001/work/images/konkurs/aksakov/image0011.jpg` | Аксаков Сергей Тимофеевич; p21 → p21 | `site/assets/awards/image0011.jpg`; `../../assets/awards/image0011.jpg` | `5dc6f5bd10718993906cb446e28a7643dec61fb7f9134b7db3e238e640217e76` |
| 06 | `/images/konkurs/aksakov/image0031.jpg` | `/images/konkurs/aksakov/image0031.jpg` | Аксаков Сергей Тимофеевич; p23 → p23 | `site/assets/awards/image0031.jpg`; `../../assets/awards/image0031.jpg` | `caf2a9da6da6ea6ed938f48dfd4c522dd0299da2b9b9a8430773919c165a76b0` |
| 07 | `/images/konkurs/aksakov/image0051.jpg` | `/images/konkurs/aksakov/image0051.jpg` | Аксаков Сергей Тимофеевич; p25 → p25 | `site/assets/awards/image0051.jpg`; `../../assets/awards/image0051.jpg` | `b6dcc13efe7cd983934e24b0a932ddb11def87dc2924192002ec8447da6a7409` |
| 08 | `/images/konkurs/aksakov/0%282%29.jpg` | `/images/konkurs/aksakov/0%282%29.jpg` | Аксаков Сергей Тимофеевич; p32 → p32 | `site/assets/awards/0(2).jpg`; `../../assets/awards/0(2).jpg` | `28391cd96edceade8c650428be3ba3ac6f1e57163072b9a9b0029ad7ca0d6efd` |
| 09 | `/images/konkurs/aksakov/0%283%29.jpg` | `/images/konkurs/aksakov/0%283%29.jpg` | Аксаков Сергей Тимофеевич; p45 → p45 | `site/assets/awards/0(3).jpg`; `../../assets/awards/0(3).jpg` | `5f8940fb4dd6a038cce7ea6a2cb298d6561ed64a4238888feedad9d13ea10cc5` |
| 10 | `/images/konkurs/aksakov/0%284%29.jpg` | `/images/konkurs/aksakov/0%284%29.jpg` | Аксаков Сергей Тимофеевич; p49 → p49 | `site/assets/awards/0(4).jpg`; `../../assets/awards/0(4).jpg` | `ecbc959c32a90393670e27f491810d79b0d7cae9e0a86c20ae25971823a4d38b` |
| 11 | `/images/konkurs/aksakov/0%285%29.jpg` | `/images/konkurs/aksakov/0%285%29.jpg` | Аксаков Сергей Тимофеевич; p52 → p52 | `site/assets/awards/0(5).jpg`; `../../assets/awards/0(5).jpg` | `caf2a9da6da6ea6ed938f48dfd4c522dd0299da2b9b9a8430773919c165a76b0` |
| 12 | `/images/konkurs/aksakov/0%286%29.jpg` | `/images/konkurs/aksakov/0%286%29.jpg` | Аксаков Сергей Тимофеевич; p55 → p55 | `site/assets/awards/0(6).jpg`; `../../assets/awards/0(6).jpg` | `ab3977442f5e7f8b6c102ef81829aa81a04520f9e194bc51265b573596aa61e6` |
| 13 | `/images/konkurs/aksakov/0%287%29.jpg` | `/images/konkurs/aksakov/0%287%29.jpg` | Аксаков Сергей Тимофеевич; p60 → p60 | `site/assets/awards/0(7).jpg`; `../../assets/awards/0(7).jpg` | `dceb2ceae119819d552bfc5957a347f802abbc061101039fce6cf90af594c46d` |
| 14 | `/images/konkurs/aksakov/0%288%29.jpg` | `http://127.0.0.1:4001/work/images/konkurs/aksakov/0%288%29.jpg` | Аксаков Сергей Тимофеевич; p63 → p63 | `site/assets/awards/0(8).jpg`; `../../assets/awards/0(8).jpg` | `99484ee6c26dd6bc814aec5731cb2f9683c45a15319d5827e14507036ca64c09` |
| 15 | `/images/konkurs/aksakov/0%289%29.jpg` | `http://127.0.0.1:4001/work/images/konkurs/aksakov/0%289%29.jpg` | Аксаков Сергей Тимофеевич; p65 → p65 | `site/assets/awards/0(9).jpg`; `../../assets/awards/0(9).jpg` | `d03a93d286750be32ba4899b852c1560b00bdaf6e18e4646492135a5299a5821` |
| 16 | `/images/konkurs/aksakov/0%2810%29.jpg` | `/images/konkurs/aksakov/0%2810%29.jpg` | Аксаков Сергей Тимофеевич; p71 → p71 | `site/assets/awards/0(10).jpg`; `../../assets/awards/0(10).jpg` | `c7eeb95841b5d53bcd0ce94eae463174db921154e1624cf21389c6fd9e8159f3` |
| 17 | `/images/konkurs/aksakov/0%281%29.jpg` | `http://127.0.0.1:4001/work/images/konkurs/aksakov/0%281%29.jpg` | Аксаков Сергей Тимофеевич; p74 → p74 | `site/assets/awards/0(1).jpg`; `../../assets/awards/0(1).jpg` | `726494f958693de5cbd8c8619f824be7c27c530f2548abf3eed9e8ceb5aa3b78` |
| 18 | `/images/konkurs/mazhit/medal.jpg` | `/images/konkurs/mazhit/medal.jpg` | Мажит Гафури; table row 1 / cell 1 → table row 1 / cell 1 | `site/assets/awards/medal.jpg`; `../../assets/awards/medal.jpg` | `04c712bdd896f42bba5085f5d6c0f69476cfa6781a7b142529c3ecd6ce45a5cf` |
| 19 | `/images/konkurs/mazhit/medal2.jpg` | `/images/konkurs/mazhit/medal2.jpg` | Мажит Гафури; table row 1 / cell 2 → table row 1 / cell 2 | `site/assets/awards/medal2.jpg`; `../../assets/awards/medal2.jpg` | `0fb842ca1613134a8b7495ad81216d9ad7874501f20b03d4adfa3144e132899b` |
| 20 | `/images/konkurs/hudaiberdin/01.png` | `/images/konkurs/hudaiberdin/01.png` | Худайбердин Шагит Ахметович; p3 → p3 | `site/assets/awards/01.png`; `../../assets/awards/01.png` | `d43369b312f1de5121c47763699fcfd84b0b26bbb80c6adc545e5116eda9ad7b` |

## Контекст и ссылки

- Локаторы для каждой строки совпали: абзацы 10, 20, 21, 23, 25, 32, 45, 49, 52, 55, 60, 63, 65, 71, 74 раздела Аксакова; таблица Гафури (строка 1, ячейки 1–2); абзац 3 Худайбердина. Две фотографии в одном абзаце остались парой в прежнем порядке. Текстовые абзацы рядом с фотографиями совпадают.
- Четыре исходных HTML `src` используют временный префикс `http://127.0.0.1:4001/work/images/…` (вхождения 05, 14, 15, 17), остальные — `/images/konkurs/…`. Имена этих четырёх файлов совпали с именами в manifest; свежая загрузка указанного публичного URL совпала с target по SHA. Различие буквального `src` snapshot и публичного URL зафиксировано; сопоставление однозначно по manifest и SHA.
- В target нет ссылок-обёрток вокруг изображений. Три содержательные ссылки раздела Мустая Карима сохраняют подписи source и ведут на существующие локальные страницы `../stipend/index.html`, `../medal/index.html`, `../fund/index.html`. Все локальные href/src на странице разрешаются в существующие пути.
- `sips` успешно декодирует все 20 target-файлов как JPEG/PNG; это проверка читаемости файла, не визуальное сравнение сюжетов.

## Ограничения

Браузер не запускался; дизайн и визуальное сходство сцен не оценивались. Байтовая идентичность проверена свежим SHA-256, а позиции и текст сопоставлены по исходному и целевому HTML. HTTP-статусы, типы, размеры и заголовки повторной загрузки перечислены в `migration/evidence/2026-11-14/awards-source-check.md`; публичные URL и метаданные — в `migration/evidence/2026-11-12/awards/asset-metadata.csv`.
