# Повторная сверка оригиналов — галерея 42 «Фото памятных мест»

Дата: 2026-11-14. Все 8 оригиналов из `migration/evidence/2026-11-13/gallery-42/fetch-log.tsv` повторно получены по одному с паузами. Тела и полные HTTP headers сохранены только в `/private/tmp/gallery42-repeat-<ID>.jpg` и `/private/tmp/gallery42-repeat-<ID>.headers`.

Для каждого ответа проверены HTTP, MIME, размер тела, `Content-Length` и SHA-256; свежий источник сопоставлен с файлом из `site/assets/gallery/42/`. Все ответы вернули HTTP 200 `image/jpeg`; размер тела совпал с `Content-Length` и локальным размером. SHA-256 каждого оригинала совпал с локальным и с исходным журналом.

В этой категории есть три пары одного basename с разными исходными расширениями `.jpeg` и `.jpg` (ID 716/717, 718/719, 720/721). Сверял каждую запись по ID, полному URL и полному локальному имени вместе с расширением; коллизий/перезаписей не было.

| ID | URL оригинала | HTTP | MIME | Байты / Content-Length | SHA-256 оригинала | Локальный файл; SHA-256 | Результат |
|---:|---|---:|---|---:|---|---|---|
| 716 | `https://ufalit.ufacsdb.ru/images/phocagallery/shafikov/Fotopamiatnykhmest/0%20%281%29.jpeg` | 200 | `image/jpeg` | 7336 / 7336 | `d62116c9b4b74793c8975471feea9fb5e9d409c8680e3e1d26b2cca604cf2821` | `site/assets/gallery/42/0 (1).jpeg`; `d62116c9b4b74793c8975471feea9fb5e9d409c8680e3e1d26b2cca604cf2821` | совпали байты, размеры и SHA-256 |
| 717 | `https://ufalit.ufacsdb.ru/images/phocagallery/shafikov/Fotopamiatnykhmest/0%20%281%29.jpg` | 200 | `image/jpeg` | 44898 / 44898 | `0b37e05e75048a42e5adb3da7efc9f1a420341ac5ebc908199a8ca84ee09d302` | `site/assets/gallery/42/0 (1).jpg`; `0b37e05e75048a42e5adb3da7efc9f1a420341ac5ebc908199a8ca84ee09d302` | совпали байты, размеры и SHA-256 |
| 718 | `https://ufalit.ufacsdb.ru/images/phocagallery/shafikov/Fotopamiatnykhmest/0%20%282%29.jpeg` | 200 | `image/jpeg` | 13613 / 13613 | `6e6e1209b776dbf7bf0f675ee8a2925aca4cc5c8ec772b26909f803901fe109e` | `site/assets/gallery/42/0 (2).jpeg`; `6e6e1209b776dbf7bf0f675ee8a2925aca4cc5c8ec772b26909f803901fe109e` | совпали байты, размеры и SHA-256 |
| 719 | `https://ufalit.ufacsdb.ru/images/phocagallery/shafikov/Fotopamiatnykhmest/0%20%282%29.jpg` | 200 | `image/jpeg` | 38183 / 38183 | `ceab88d2f79a2e473652bf76372992efea5441da058728d30c786b76546f6d4e` | `site/assets/gallery/42/0 (2).jpg`; `ceab88d2f79a2e473652bf76372992efea5441da058728d30c786b76546f6d4e` | совпали байты, размеры и SHA-256 |
| 720 | `https://ufalit.ufacsdb.ru/images/phocagallery/shafikov/Fotopamiatnykhmest/0%20%283%29.jpeg` | 200 | `image/jpeg` | 42513 / 42513 | `374fa5e139aee45013e29bbc5a0552c1bc852659bdd8afbeda2bb8f1eea26176` | `site/assets/gallery/42/0 (3).jpeg`; `374fa5e139aee45013e29bbc5a0552c1bc852659bdd8afbeda2bb8f1eea26176` | совпали байты, размеры и SHA-256 |
| 721 | `https://ufalit.ufacsdb.ru/images/phocagallery/shafikov/Fotopamiatnykhmest/0%20%283%29.jpg` | 200 | `image/jpeg` | 14576 / 14576 | `93b2cb26a0c7c71e63ee30e8fcd6c15be5d05422ebd9cfd0a9a45d60a71da32f` | `site/assets/gallery/42/0 (3).jpg`; `93b2cb26a0c7c71e63ee30e8fcd6c15be5d05422ebd9cfd0a9a45d60a71da32f` | совпали байты, размеры и SHA-256 |
| 722 | `https://ufalit.ufacsdb.ru/images/phocagallery/shafikov/Fotopamiatnykhmest/0%20%284%29.jpg` | 200 | `image/jpeg` | 853184 / 853184 | `6d1933bffc312f8e11e4286bea17283aaaee59e670a355b56d62d211a68ea6eb` | `site/assets/gallery/42/0 (4).jpg`; `6d1933bffc312f8e11e4286bea17283aaaee59e670a355b56d62d211a68ea6eb` | совпали байты, размеры и SHA-256 |
| 723 | `https://ufalit.ufacsdb.ru/images/phocagallery/shafikov/Fotopamiatnykhmest/0%20%285%29.jpg` | 200 | `image/jpeg` | 46619 / 46619 | `2cdbc790f9ad87303d927c85e374314fb4d6e43ec482bae4ca28c0f7fb8999c4` | `site/assets/gallery/42/0 (5).jpg`; `2cdbc790f9ad87303d927c85e374314fb4d6e43ec482bae4ca28c0f7fb8999c4` | совпали байты, размеры и SHA-256 |

## Результат

- 8 из 8 оригиналов совпали с локальными файлами побайтно.
- Для всех ответов HTTP 200 и `image/jpeg`; тело, `Content-Length` и локальный размер равны.
- SHA-256 всех свежих оригиналов совпал с локальными и с прежними значениями журнала.
- Свежие файлы и headers оставлены только в `/private/tmp`; сайт, реестры и Git не менялись.
