# Независимая проверка локализации навигационных ссылок

Дата: 14 ноября 2026 года. Основание: текущий `git diff` для затронутых HTML, `migration/evidence/2026-11-14/navigation-cleanup.md`, `migration/evidence/2026-11-14/text-queue.md`, соответствующие строки `migration/pages.csv` и снимки, перечисленные в этих материалах. Страницы, реестры и Git не менялись.

## Результат

Проверены 11 замен ссылок в 11 файлах: одна ссылка на целевую категорию gallery-43, одна — на указатель видеокопилки и девять — на список категорий фотогалереи. Каждая цель соответствует former Joomla route из `pages.csv`, существует в `site/`, а новый href относительный и при разрешении из URL под `/ufalit/` остаётся внутри этого префикса.

Для каждого файла сравнил полное содержимое `HEAD` с рабочей версией после замены только конкретного старого `href` на новый. Все 11 сравнений дают точное равенство; число ссылок в каждом документе не менялось. Значит, подпись и текст вокруг ссылки, остальные href, `src`, в том числе изображения, и остальная HTML-разметка побайтно сохранены.

| Страница | Подпись ссылки | Новый href | Локальная цель | Результат |
| --- | --- | --- | --- | --- |
| `gallery-18` | Фото улицы Тухвата Янаби (35 фотографий) | `../gallery-43/` | `site/pages/gallery-43/index.html` | Цель существует; внутренний переход `/ufalit/pages/gallery-43/` |
| `large-videos` | Все видеоматериалы на прежнем сайте | `../videos/` | `site/pages/videos/index.html` | Цель существует; внутренний переход `/ufalit/pages/videos/` |
| `gallery-5` | Список категорий фотогалереи | `../gallery/` | `site/pages/gallery/index.html` | Цель существует; внутренний переход `/ufalit/pages/gallery/` |
| `gallery-aksakov` | Другие категории на прежнем сайте | `../gallery/` | `site/pages/gallery/index.html` | Цель существует; внутренний переход `/ufalit/pages/gallery/` |
| `gallery-23` | Другие категории на прежнем сайте | `../gallery/` | `site/pages/gallery/index.html` | Цель существует; внутренний переход `/ufalit/pages/gallery/` |
| `gallery-7` | Фотогалерея | `../gallery/` | `site/pages/gallery/index.html` | Цель существует; внутренний переход `/ufalit/pages/gallery/` |
| `gallery-amantai` | Другие категории на прежнем сайте | `../gallery/` | `site/pages/gallery/index.html` | Цель существует; внутренний переход `/ufalit/pages/gallery/` |
| `gallery-uzikov` | Другие категории на прежнем сайте | `../gallery/` | `site/pages/gallery/index.html` | Цель существует; внутренний переход `/ufalit/pages/gallery/` |
| `gallery-bikbay` | Другие категории на прежнем сайте | `../gallery/` | `site/pages/gallery/index.html` | Цель существует; внутренний переход `/ufalit/pages/gallery/` |
| `gallery-11` | Другие категории фотогалереи на прежнем сайте | `../gallery/` | `site/pages/gallery/index.html` | Цель существует; внутренний переход `/ufalit/pages/gallery/` |
| `gallery-10` | Другие категории фотогалереи на прежнем сайте | `../gallery/` | `site/pages/gallery/index.html` | Цель существует; внутренний переход `/ufalit/pages/gallery/` |

## Подтверждение исходных назначений и путей

- Категория с исходным URL `view=category&id=43:2012-12-30-09-57-52` в `pages.csv` уже сопоставлена с `site/pages/gallery-43/index.html`. URL с `%3A` в старой ссылке — URL-encoded вариант того же ID/slug; снимок и отчёт ветви gallery-43 указаны в `text-queue.md` и `navigation-cleanup.md`.
- Исходная категория видеокопилки `com_content`, `view=category`, `id=3` в `pages.csv` сопоставлена с `site/pages/videos/index.html`; запись с query-параметрами в другом порядке обозначает тот же маршрут. Её снимки — `evidence/2026-11-11/video.html.gz` и `evidence/2026-11-13/video-queue/category.html`.
- Общий фотоуказатель `com_phocagallery&view=categories` в `pages.csv` сопоставлен с `site/pages/gallery/index.html`; его исходная база — `migration/evidence/2026-11-11/galleries.html.gz`.
- Относительные адреса разрешены от каждой папки `site/pages/<slug>/` с воображаемым base URL `/ufalit/pages/<slug>/`. Для 11/11 получился указанный выше `/ufalit/pages/.../` путь без перехода на корень домена и без query-части Joomla; все 11 файлов `index.html` существуют.

## Ограничения

Это проверка фактических замен и существования локальных целей, а не браузерный просмотр или тест на поднятом сервере с mount `/ufalit/`. Маршрут рассчитан по стандартному разрешению относительного URL; HTTP-ответ сервера под префиксом и клики в браузере здесь не проверялись. Тексты подписи ссылок оставлены без изменения — включая слова «на прежнем сайте», что соответствовало требованию проверить сохранность текста и не редактировать страницу.
