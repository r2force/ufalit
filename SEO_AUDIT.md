# SEO-аудит «Уфа литературная»

Дата: 26 ноября 2026 года. Основной адрес подтверждён владельцем: https://ufalit.ufacsdb.ru/. Владелец самостоятельно изменил домен в Pages. Агент не менял настройки Pages, DNS и CNAME.

## Метод и охват

Проверены все 67 страниц генератора. Исходная сборка сохранена до изменений: `reports/seo-before.json`; публичные HTTP-ответы — `reports/seo-http-before.json`. Итоговый инвентарь — `reports/seo-after.json`. Для каждой страницы перечислены title, description, canonical, robots, OG/Twitter, H1–H6, JSON-LD, число ссылок и изображений, заполненность alt, объём и хэш основного текста. Опция `scripts/audit_seo.py --details` дополнительно выгружает все ссылки и атрибуты изображений.

В исходной проверке все 67 страниц основного HTTPS-домена отвечали 200. GitHub-адрес перенаправлял 301 на HTTP-версию домена; `/` и `/index.html` были доступны. HTTP и HTTPS отдавали страницы без canonical. Корневые robots.txt обоих хостов и sitemap.xml основного домена отвечали 404. Отсутствие robots.txt само по себе не запрещает сканирование.

Доступа к Search Console, Яндекс Вебмастеру, Вордстату и Keyword Planner нет. Количество проиндексированных страниц, частотности, показы, клики, CTR и трафик неизвестны. HTTP 200 и отсутствие noindex не подтверждают нахождение в индексе.

## Проблемы и исправления

| Приоритет | Исходная проблема и влияние | Реализация и файлы |
|---|---|---|
| P0 | На 67 страницах отсутствовали description и canonical. | Уникальные метаданные в `site/**/*.html`; общий вывод в `templates/base.html`, `scripts/seo.py`, `scripts/render_site.py`. |
| P0 | Четыре группы повторяющихся title: общий title галереи у 6 страниц, три других заголовка по 2 страницы. | Заголовки уточнены автором и содержанием альбома. |
| P0 | Нет sitemap и проверки конечных адресов. | Автоматическая карта из 66 самостоятельных страниц. Без недостоверных lastmod. |
| P0 | Подборка `reading-yanabi-poems` повторяет каталог автора. | URL и якоря сохранены; canonical ведёт на `reading-author-yanabi`; дубль исключён из sitemap. Причина в `templates/seo-exclusions.json`. |
| P0 | robots.txt отсутствовал. | `site/robots.txt` публикуется в корне основного пользовательского домена и ссылается на sitemap. Файл внутри `/ufalit/` не управляет корнем github.io. |
| P1 | Отсутствовали OG/Twitter и структурированные данные. | WebSite, WebPage, CollectionPage, BreadcrumbList, Article по назначению страницы; общий модуль `scripts/seo.py`. |
| P1 | Только первый объект карты имел текстовое описание вне JSON. | Все 68 объектов, адреса и описания доступны в раскрываемом HTML-списке; единственный источник — `atlas-places.json`. |
| P1 | Общий H1 фотогалерей и недостаточно тематических связей. | H1 конкретного альбома, общие ссылки на биографию и памятные места. |
| P1 | 20 515 вхождений изображений без размеров, включая повторяющийся корпус галерей. | Размеры локальных JPG/PNG/GIF добавляются при сборке; lazy-изображения получают decoding=async. Фиксированные размеры миниатюр сохранены. |
| P1 | Lighthouse выявил тяжёлые оригиналы в карточках и принудительную загрузку фонов галереи. | WebP-превью, srcset/sizes, отложенная загрузка фонов, оригиналы доступны по прежним ссылкам. Подробнее в `SEO_VALIDATION.md`. |
| P1 | Lighthouse нашёл ссылку без href в ещё не открытом просмотрщике. | Начальный href задаётся из первого оригинала: `site/assets/ufalit-gallery.js`. |
| P3 | Аналитика не подключена. | Асинхронная Метрика 110934501, noscript-пиксель, восемь целей через общие шаблоны и `ufalit-analytics.js`. |

## Содержание, доступность и структурированные данные

В исходной сборке на каждой странице был один H1; изображений без атрибута alt не найдено. Пустые alt у повторяющих подпись портретов и миниатюр намеренны. Биографии, библиографии, произведения, подписи и источники присутствуют в HTML. Инертный корпус других авторов внутри `<template>` дополнен самостоятельными статическими страницами каждого альбома. Аудио ранее удалено владельцем и не восстанавливалось.

ProfilePage не применяется к общему справочнику; Place — к общей карте. VideoObject не добавлен из-за отсутствия достоверных uploadDate и достаточных описаний роликов. Не выдуманы даты публикаций, рейтинги и авторы редакционных статей. Article используется для трёх самостоятельных материалов: фонд, медаль, стипендия. Валидный JSON-LD не гарантирует расширенный результат поиска.

Изменения не разделяют статьи на новые URL. Полный перечень прежних страниц и метаданных — в JSON-инвентаре. Внутренние адреса и якоря проверяются `scripts/test_seo.py`, включая абсолютные ссылки и изображения для соцсетей. Относительные ссылки сохраняют совместимость с `/ufalit/`.

## Внешние ссылки

Проверены 28 уникальных внешних адресов исходных материалов. HTTP-ответы и перенаправления — `reports/seo-external-links.json`. Найдены исторические 404/410, DNS-ошибки и временный 500. Библиографические ссылки сохранены: отсутствие страницы сегодня не отменяет атрибуцию источника. Для замены нужен подтверждённый тот же материал или архивная копия; похожие статьи вместо источников не подставлялись.

## Данные, необходимые от владельца

Доступ владельца к Search Console и Вебмастеру; выгрузки запросов, страниц и исключений из индекса; регион и период Вордстата; права управления Метрикой; реальные данные Core Web Vitals при их наличии. Порядок действий — в `SEO_OWNER_GUIDE.md`. Аккаунты не создавались, сообщения партнёрам не отправлялись.

## Реестр исходных страниц

Все перечисленные страницы имели один H1, но не имели description, canonical, OG/Twitter и JSON-LD. Robots meta отсутствовал. Структура заголовков, атрибуты, объём и хэши сохранены в инвентаре.

| URL | HTTP | Исходный title | Символов основного текста |
|---|---:|---|---:|
| [https://ufalit.ufacsdb.ru/](https://ufalit.ufacsdb.ru/) | 200 | Уфа литературная — о проекте | 2880 |
| [https://ufalit.ufacsdb.ru/pages/awards/](https://ufalit.ufacsdb.ru/pages/awards/) | 200 | Конкурсы и награды — Уфа литературная | 31342 |
| [https://ufalit.ufacsdb.ru/pages/fund/](https://ufalit.ufacsdb.ru/pages/fund/) | 200 | Фонд личного происхождения Мустая Карима — Уфа литературная | 2361 |
| [https://ufalit.ufacsdb.ru/pages/gallery/](https://ufalit.ufacsdb.ru/pages/gallery/) | 200 | Фотогалерея — Уфа литературная | 5353 |
| [https://ufalit.ufacsdb.ru/pages/gallery-10/](https://ufalit.ufacsdb.ru/pages/gallery-10/) | 200 | Киекбаев — фотогалерея «Уфа литературная» | 2645 |
| [https://ufalit.ufacsdb.ru/pages/gallery-11/](https://ufalit.ufacsdb.ru/pages/gallery-11/) | 200 | Киньябулатова Катиба Каримовна — фотогалерея «Уфа литературная» | 3224 |
| [https://ufalit.ufacsdb.ru/pages/gallery-12/](https://ufalit.ufacsdb.ru/pages/gallery-12/) | 200 | Короленко Владимир Галактионович — фотогалерея | 3857 |
| [https://ufalit.ufacsdb.ru/pages/gallery-14/](https://ufalit.ufacsdb.ru/pages/gallery-14/) | 200 | Фотогалерея — Уфа литературная | 3109 |
| [https://ufalit.ufacsdb.ru/pages/gallery-15/](https://ufalit.ufacsdb.ru/pages/gallery-15/) | 200 | Фотогалерея — Уфа литературная | 3197 |
| [https://ufalit.ufacsdb.ru/pages/gallery-17/](https://ufalit.ufacsdb.ru/pages/gallery-17/) | 200 | Фотогалерея — Уфа литературная | 4763 |
| [https://ufalit.ufacsdb.ru/pages/gallery-18/](https://ufalit.ufacsdb.ru/pages/gallery-18/) | 200 | Тухват Янаби — фотогалерея | 4045 |
| [https://ufalit.ufacsdb.ru/pages/gallery-19/](https://ufalit.ufacsdb.ru/pages/gallery-19/) | 200 | Аксаковские праздники — фотогалерея | 5507 |
| [https://ufalit.ufacsdb.ru/pages/gallery-20/](https://ufalit.ufacsdb.ru/pages/gallery-20/) | 200 | Аксаков 2005 — фотогалерея | 2427 |
| [https://ufalit.ufacsdb.ru/pages/gallery-21/](https://ufalit.ufacsdb.ru/pages/gallery-21/) | 200 | Аксаков 2008 — фотогалерея | 2542 |
| [https://ufalit.ufacsdb.ru/pages/gallery-22/](https://ufalit.ufacsdb.ru/pages/gallery-22/) | 200 | Праздник в парке Аксакова — фотогалерея | 3024 |
| [https://ufalit.ufacsdb.ru/pages/gallery-23/](https://ufalit.ufacsdb.ru/pages/gallery-23/) | 200 | Фотоархив Бикчентаева — фотогалерея | 2984 |
| [https://ufalit.ufacsdb.ru/pages/gallery-24/](https://ufalit.ufacsdb.ru/pages/gallery-24/) | 200 | Фото. Памятные места Бикчентаева — Уфа литературная | 3588 |
| [https://ufalit.ufacsdb.ru/pages/gallery-25/](https://ufalit.ufacsdb.ru/pages/gallery-25/) | 200 | Афиши — Уфа литературная | 2140 |
| [https://ufalit.ufacsdb.ru/pages/gallery-26/](https://ufalit.ufacsdb.ru/pages/gallery-26/) | 200 | Памятные места — Уфа литературная | 4015 |
| [https://ufalit.ufacsdb.ru/pages/gallery-27/](https://ufalit.ufacsdb.ru/pages/gallery-27/) | 200 | Семейный архив — Уфа литературная | 2825 |
| [https://ufalit.ufacsdb.ru/pages/gallery-28/](https://ufalit.ufacsdb.ru/pages/gallery-28/) | 200 | Современники и коллеги — Уфа литературная | 2174 |
| [https://ufalit.ufacsdb.ru/pages/gallery-29/](https://ufalit.ufacsdb.ru/pages/gallery-29/) | 200 | Мемориальная доска — Уфа литературная | 2115 |
| [https://ufalit.ufacsdb.ru/pages/gallery-30/](https://ufalit.ufacsdb.ru/pages/gallery-30/) | 200 | УМПО — Уфа литературная | 2421 |
| [https://ufalit.ufacsdb.ru/pages/gallery-31/](https://ufalit.ufacsdb.ru/pages/gallery-31/) | 200 | Школа — Уфа литературная | 2772 |
| [https://ufalit.ufacsdb.ru/pages/gallery-32/](https://ufalit.ufacsdb.ru/pages/gallery-32/) | 200 | Документы — Уфа литературная | 2665 |
| [https://ufalit.ufacsdb.ru/pages/gallery-33/](https://ufalit.ufacsdb.ru/pages/gallery-33/) | 200 | Памятные места — Уфа литературная | 2708 |
| [https://ufalit.ufacsdb.ru/pages/gallery-34/](https://ufalit.ufacsdb.ru/pages/gallery-34/) | 200 | Фотоматериалы по творчеству Гафури — Уфа литературная | 2926 |
| [https://ufalit.ufacsdb.ru/pages/gallery-35/](https://ufalit.ufacsdb.ru/pages/gallery-35/) | 200 | Фото памятных мест — Уфа литературная | 3553 |
| [https://ufalit.ufacsdb.ru/pages/gallery-36/](https://ufalit.ufacsdb.ru/pages/gallery-36/) | 200 | Фотографии — Уфа литературная | 3679 |
| [https://ufalit.ufacsdb.ru/pages/gallery-37/](https://ufalit.ufacsdb.ru/pages/gallery-37/) | 200 | Музей, премия — Уфа литературная | 3535 |
| [https://ufalit.ufacsdb.ru/pages/gallery-38/](https://ufalit.ufacsdb.ru/pages/gallery-38/) | 200 | Экскурсия по мемориальному уголку — Уфа литературная | 3158 |
| [https://ufalit.ufacsdb.ru/pages/gallery-39/](https://ufalit.ufacsdb.ru/pages/gallery-39/) | 200 | Шафиков Газим Газизович — Уфа литературная | 6923 |
| [https://ufalit.ufacsdb.ru/pages/gallery-40/](https://ufalit.ufacsdb.ru/pages/gallery-40/) | 200 | Из Литературного музея — Уфа литературная | 4909 |
| [https://ufalit.ufacsdb.ru/pages/gallery-41/](https://ufalit.ufacsdb.ru/pages/gallery-41/) | 200 | Семейный архив — Уфа литературная | 3298 |
| [https://ufalit.ufacsdb.ru/pages/gallery-42/](https://ufalit.ufacsdb.ru/pages/gallery-42/) | 200 | Фото памятных мест — Уфа литературная | 2606 |
| [https://ufalit.ufacsdb.ru/pages/gallery-43/](https://ufalit.ufacsdb.ru/pages/gallery-43/) | 200 | Фото улицы Тухвата Янаби — Уфа литературная | 3527 |
| [https://ufalit.ufacsdb.ru/pages/gallery-5/](https://ufalit.ufacsdb.ru/pages/gallery-5/) | 200 | Бикчентаев Анвер Гадеевич — фотогалерея | 4677 |
| [https://ufalit.ufacsdb.ru/pages/gallery-6/](https://ufalit.ufacsdb.ru/pages/gallery-6/) | 200 | Фотогалерея — Уфа литературная | 5266 |
| [https://ufalit.ufacsdb.ru/pages/gallery-7/](https://ufalit.ufacsdb.ru/pages/gallery-7/) | 200 | Мажит Гафури — Фотогалерея — Уфа литературная | 3686 |
| [https://ufalit.ufacsdb.ru/pages/gallery-8/](https://ufalit.ufacsdb.ru/pages/gallery-8/) | 200 | Ибрагимов Галимджан Гирфанович — Фотогалерея — Уфа литературная | 4759 |
| [https://ufalit.ufacsdb.ru/pages/gallery-9/](https://ufalit.ufacsdb.ru/pages/gallery-9/) | 200 | Фотогалерея — Уфа литературная | 5286 |
| [https://ufalit.ufacsdb.ru/pages/gallery-aksakov/](https://ufalit.ufacsdb.ru/pages/gallery-aksakov/) | 200 | Сергей Аксаков — фотогалерея | 5391 |
| [https://ufalit.ufacsdb.ru/pages/gallery-amantai/](https://ufalit.ufacsdb.ru/pages/gallery-amantai/) | 200 | Габдулла Амантай — фотогалерея | 4254 |
| [https://ufalit.ufacsdb.ru/pages/gallery-bikbay/](https://ufalit.ufacsdb.ru/pages/gallery-bikbay/) | 200 | Баязит Бикбай — фотогалерея | 3498 |
| [https://ufalit.ufacsdb.ru/pages/gallery-uzikov/](https://ufalit.ufacsdb.ru/pages/gallery-uzikov/) | 200 | Юрий Узиков — фотогалерея | 2377 |
| [https://ufalit.ufacsdb.ru/pages/large-videos/](https://ufalit.ufacsdb.ru/pages/large-videos/) | 200 | Видеоматериалы — Уфа литературная | 196 |
| [https://ufalit.ufacsdb.ru/pages/legends/](https://ufalit.ufacsdb.ru/pages/legends/) | 200 | Уфа в легендах и преданиях — Уфа литературная | 14624 |
| [https://ufalit.ufacsdb.ru/pages/map/](https://ufalit.ufacsdb.ru/pages/map/) | 200 | Литературная карта Уфы — Уфа литературная | 4043 |
| [https://ufalit.ufacsdb.ru/pages/medal/](https://ufalit.ufacsdb.ru/pages/medal/) | 200 | Памятная медаль «Мустай Карим» — Уфа литературная | 395 |
| [https://ufalit.ufacsdb.ru/pages/personalities/](https://ufalit.ufacsdb.ru/pages/personalities/) | 200 | Персоналии — Уфа литературная | 435798 |
| [https://ufalit.ufacsdb.ru/pages/places/](https://ufalit.ufacsdb.ru/pages/places/) | 200 | Памятные места Уфы — Уфа литературная | 91603 |
| [https://ufalit.ufacsdb.ru/pages/reading/](https://ufalit.ufacsdb.ru/pages/reading/) | 200 | Читальный зал — Уфа литературная | 619 |
| [https://ufalit.ufacsdb.ru/pages/reading-aksakov-childhood/](https://ufalit.ufacsdb.ru/pages/reading-aksakov-childhood/) | 200 | Аксаков, С. Т. Детские годы Багрова-внука — Уфа литературная | 10275 |
| [https://ufalit.ufacsdb.ru/pages/reading-aksakov-flower/](https://ufalit.ufacsdb.ru/pages/reading-aksakov-flower/) | 200 | Аксаков, С. Т. Аленький цветочек — Уфа литературная | 4026 |
| [https://ufalit.ufacsdb.ru/pages/reading-aksakov-nature/](https://ufalit.ufacsdb.ru/pages/reading-aksakov-nature/) | 200 | Аксаков, С. Т. Рассказы о родной природе — Уфа литературная | 1115 |
| [https://ufalit.ufacsdb.ru/pages/reading-author-aksakov/](https://ufalit.ufacsdb.ru/pages/reading-author-aksakov/) | 200 | Аксаков Сергей Тимофеевич — Читальный зал | 590 |
| [https://ufalit.ufacsdb.ru/pages/reading-author-yanabi/](https://ufalit.ufacsdb.ru/pages/reading-author-yanabi/) | 200 | Тухват Янаби — Читальный зал | 938 |
| [https://ufalit.ufacsdb.ru/pages/reading-yanabi-pesnya-oktyabrenka/](https://ufalit.ufacsdb.ru/pages/reading-yanabi-pesnya-oktyabrenka/) | 200 | Песня октябрёнка — Тухват Янаби — Уфа литературная | 589 |
| [https://ufalit.ufacsdb.ru/pages/reading-yanabi-poems/](https://ufalit.ufacsdb.ru/pages/reading-yanabi-poems/) | 200 | Стихотворения и басня — Тухват Янаби — Уфа литературная | 925 |
| [https://ufalit.ufacsdb.ru/pages/reading-yanabi-shkolnik/](https://ufalit.ufacsdb.ru/pages/reading-yanabi-shkolnik/) | 200 | Школьник — Тухват Янаби — Уфа литературная | 484 |
| [https://ufalit.ufacsdb.ru/pages/reading-yanabi-shkolnye-chastushki/](https://ufalit.ufacsdb.ru/pages/reading-yanabi-shkolnye-chastushki/) | 200 | Школьные частушки — Тухват Янаби — Уфа литературная | 450 |
| [https://ufalit.ufacsdb.ru/pages/reading-yanabi-slon-i-petukh/](https://ufalit.ufacsdb.ru/pages/reading-yanabi-slon-i-petukh/) | 200 | Слон и петух — Тухват Янаби — Уфа литературная | 994 |
| [https://ufalit.ufacsdb.ru/pages/stipend/](https://ufalit.ufacsdb.ru/pages/stipend/) | 200 | Стипендия имени Мустая Карима — Уфа литературная | 637 |
| [https://ufalit.ufacsdb.ru/pages/video-388/](https://ufalit.ufacsdb.ru/pages/video-388/) | 200 | Злобин Степан Павлович — Видеокопилка | 230 |
| [https://ufalit.ufacsdb.ru/pages/video-389/](https://ufalit.ufacsdb.ru/pages/video-389/) | 200 | Аксаков Сергей Тимофеевич — Видеокопилка | 269 |
| [https://ufalit.ufacsdb.ru/pages/video-81/](https://ufalit.ufacsdb.ru/pages/video-81/) | 200 | Мустай Карим — Видеокопилка | 223 |
| [https://ufalit.ufacsdb.ru/pages/videos/](https://ufalit.ufacsdb.ru/pages/videos/) | 200 | Видеокопилка — Уфа литературная | 371 |
