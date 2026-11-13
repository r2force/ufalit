# Локализация внутренних Joomla-ссылок

Дата: 2026-11-14. Исправлены только три семейства URL, точно сопоставленные в `text-queue.md`; источники видео и внешние сайты не затронуты.

## Изменённые HTML-файлы

1. `site/pages/gallery-18/index.html`
2. `site/pages/large-videos/index.html`
3. `site/pages/gallery-5/index.html`
4. `site/pages/gallery-aksakov/index.html`
5. `site/pages/gallery-23/index.html`
6. `site/pages/gallery-7/index.html`
7. `site/pages/gallery-amantai/index.html`
8. `site/pages/gallery-uzikov/index.html`
9. `site/pages/gallery-bikbay/index.html`
10. `site/pages/gallery-11/index.html`
11. `site/pages/gallery-10/index.html`

Другие файлы и общие реестры не менялись; Git не менялся.

## Изменения адресов

| Количество | Исходный внутренний Joomla URL | Новый относительный адрес | Проверенная локальная цель |
|---:|---|---|---|
| 1 | `https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=category&id=43%3A2012-12-30-09-57-52&Itemid=88` | `../gallery-43/` | `site/pages/gallery-43/index.html` |
| 1 | `https://ufalit.ufacsdb.ru/index.php?option=com_content&view=category&id=3&Itemid=90` | `../videos/` | `site/pages/videos/index.html` |
| 9 | `https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=categories&Itemid=88` | `../gallery/` | `site/pages/gallery/index.html` |

Подписи ссылок сохранены без изменений. Все 11 новых адресов разрешаются из папки соответствующей страницы в указанный локальный `index.html`, который существует.

## Проверки сохранности

До изменения и после него сравнивались списки ссылок с видимым текстом и ссылки изображений в каждом затронутом HTML. Изменилось ровно одно назначение `href` в каждом файле; текст ссылок, остальные `href` и все `img src` совпадают. Внешние FLV-ссылки и сторонние URL не переписывались.
