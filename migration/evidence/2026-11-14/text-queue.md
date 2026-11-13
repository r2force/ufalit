# Очередь текстовых страниц и оставшихся Joomla-ссылок

Дата: 2026-11-14. Read-only анализ снимков и текущих локальных страниц. Ни сайт, ни общие реестры, ни Git не менялись.

## Результат

В сохранённых снимках главного меню и основных статей не найдено ещё одной публичной текстовой Joomla-страницы, отсутствующей в текущем `pages.csv`. Все найденные меню и межстатейные ссылки на основной текстовый контент сопоставляются с локальными страницами. В реестре сейчас 375 URL-строк: 28 `article` и 2 `category` имеют статус `captured`; все 30 целевых файлов существуют, все основные текстовые ссылки имеют соответствующие цели. Этот статус подтверждает наличие файла, не является итоговой оценкой содержательной приёмки.

Обнаружены три семейства внутренних ссылок в текущих страницах, которые всё ещё ведут на Joomla, хотя локальные цели уже учтены и существуют. Это ближайшая очередь навигационных исправлений. Они не требуют новых страниц или скачивания; до исправления посетитель уходит с локального сайта.

## Приоритетная очередь

| Приоритет | Текущий локатор и подпись ссылки | Точный внешний Joomla URL | Сопоставленная локальная цель | Доказательства |
|---|---|---|---|---|
| P1 | `site/pages/gallery-18/index.html`, ссылка «Фото улицы Тухвата Янаби (35 фотографий)» | `https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=category&id=43%3A2012-12-30-09-57-52&Itemid=88` | `site/pages/gallery-43/index.html` (`../gallery-43/`); страница уже есть. Запись `pages.csv` для ID 43 использует неэкранированный двоеточием вариант того же `id` | Текущая ссылка в `site/pages/gallery-18/index.html`; `migration/evidence/2026-11-12/gallery-18/REPORT.md` (дочерний ID 43); `migration/evidence/2026-11-13/gallery-43/REPORT.md`; запись pages.csv ID 43 |
| P1 | `site/pages/large-videos/index.html`, ссылка «Все видеоматериалы на прежнем сайте» | `https://ufalit.ufacsdb.ru/index.php?option=com_content&view=category&id=3&Itemid=90` | `site/pages/videos/index.html` (`../videos/`); та же категория ID 3 уже есть в `pages.csv` с переставленными query-параметрами | Текущая ссылка в `site/pages/large-videos/index.html`; исходный указатель `migration/evidence/2026-11-11/video.html.gz`; поздний снимок категории `migration/evidence/2026-11-13/video-queue/category.html`; запись pages.csv ID 3 |
| P2 | Девять ссылок на общий список категорий, см. список ниже | `https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=categories&Itemid=88` | `site/pages/gallery/index.html` (`../gallery/`); маршрут списка категорий есть в `pages.csv` | Текущие целевые HTML-файлы; снимок `migration/evidence/2026-11-11/galleries.html.gz`; страница списка в `pages.csv` |

Девять мест со ссылкой на общий список фотогалерей:

1. `site/pages/gallery-5/index.html` — «Список категорий фотогалереи».
2. `site/pages/gallery-aksakov/index.html` — «Другие категории на прежнем сайте».
3. `site/pages/gallery-23/index.html` — «Другие категории на прежнем сайте».
4. `site/pages/gallery-7/index.html` — «Фотогалерея».
5. `site/pages/gallery-amantai/index.html` — «Другие категории на прежнем сайте».
6. `site/pages/gallery-uzikov/index.html` — «Другие категории на прежнем сайте».
7. `site/pages/gallery-bikbay/index.html` — «Другие категории на прежнем сайте».
8. `site/pages/gallery-11/index.html` — «Другие категории фотогалереи на прежнем сайте».
9. `site/pages/gallery-10/index.html` — «Другие категории фотогалереи на прежнем сайте».

Для этих ссылок цель уже существует, поэтому очередь — заменить внешний адрес локальным относительным и при необходимости убрать вводящую в заблуждение часть надписи «на прежнем сайте». Содержимое страниц менять не требуется.

## Проверка меню и ссылок из статей

Главное меню из `home.html.gz` и повторяющихся навигационных блоков в `persons.html.gz`, `places.html.gz`, `reading.html.gz`, `awards.html.gz`, `legends.html.gz` и `video.html.gz` даёт следующие целевые разделы; все есть в `pages.csv` и имеют локальные страницы. Таблица показывает абсолютные назначения, восстановленные из root-relative href в снимках и домена источника:

| Разрешённый URL из href снимка | Текст пункта | Цель по pages.csv |
|---|---|---|
| `https://ufalit.ufacsdb.ru/index.php?option=com_content&view=article&id=320&Itemid=85` | Персоналии | `site/pages/personalities/index.html` |
| `https://ufalit.ufacsdb.ru/index.php?option=com_content&view=article&id=319&Itemid=86` | Памятные места Уфы | `site/pages/places/index.html` |
| `https://ufalit.ufacsdb.ru/index.php?option=com_content&view=article&id=318&Itemid=87` | Читальный зал | `site/pages/reading/index.html` |
| `https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=categories&Itemid=88` | Фотогалерея | `site/pages/gallery/index.html` |
| `https://ufalit.ufacsdb.ru/index.php?option=com_content&view=category&id=3&Itemid=90` | Видеокопилка | `site/pages/videos/index.html` |
| `https://ufalit.ufacsdb.ru/index.php?option=com_content&view=article&id=317&Itemid=148` | Конкурсы, премии, фонды, праздники | `site/pages/awards/index.html` |
| `https://ufalit.ufacsdb.ru/index.php?option=com_content&view=article&id=4&Itemid=149` | Уфа в легендах и преданиях | `site/pages/legends/index.html` |

В сохранённых HTML сами значения `href` начинаются с `/index.php?...`; полные адреса в таблице — те же query-параметры, разрешённые относительно `https://ufalit.ufacsdb.ru/`. Пункт `id=287&Itemid=114` «Выход» в снимке — действие выхода из сессии, а не публичная текстовая страница; в очередь переноса текста не включён. Печатные `tmpl=component&print=1` варианты — служебные представления уже учтённых страниц, а не самостоятельные материалы.

Ссылки из `reading.html.gz` на статьи читального зала с ID 399–411, 414–416 сопоставлены с локальными `site/pages/reading-*/index.html`; все соответствующие строки есть в pages.csv. Ссылки `awards.html.gz` на ID 395–397 ведут локально в `site/pages/fund/index.html`, `site/pages/medal/index.html` и `site/pages/stipend/index.html`. Ссылки `video.html.gz` на ID 389, 388 и 81 ведут на локальные `site/pages/video-389/`, `site/pages/video-388/` и `site/pages/video-81/`; текущий указатель `site/pages/videos/index.html` уже направляет на них локально.

## Учёт и границы анализа

`migration/INVENTORY.md` содержит устаревшую фразу, что `pages.csv` содержит только девять стартовых адресов. Текущий CSV уже имеет 375 строк; исходный снимок `migration/evidence/2026-11-11/README.md` действительно описывает только девять начальных запросов, но не полную инвентаризацию. В `pages.csv` 28 статей и 2 категории — все captured; 37 gallery-category также captured. Это показывает состояние имеющихся записей, но не доказывает замкнутый обход исходного сайта.

Оставшиеся 147 строк со статусом `discovered` относятся к `gallery-detail` и имеют пустой `target_path`; их рассматривает отдельная очередь медиадеталей. Они не включены в эту очередь текстовых страниц, однако текстовые метки и подписи на этих деталях должны оставаться частью поэлементной проверки контента.

В локальных статьях остаются внешние не-Joomla ссылки на сторонние материалы: `http://hronos.km.ru/text/2004/shafi10_04.html` и `http://ajdaha2003.ya.ru/replies.xml?item_no=1406`; также встречается библиотечный адрес `http://csdb.ufanet.ru`. Это цитаты/внешние сервисы, а не внутренние Joomla-разделы Ufalit; рекурсивное зеркалирование внешних сайтов вне охвата согласно `migration/PLAN.md`.

Вывод ограничен сохранёнными снимками, текущим pages.csv и локальными HTML. `robots.txt` и `sitemap.xml` из снимка 11 ноября вернули 404, что не доказывает отсутствие других разделов. Перед окончательной приёмкой нужен полный обход источника, проверка обновлений после датированных снимков и закрытие отдельной очереди gallery-detail.
