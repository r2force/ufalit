# Ссылка на исходное видео страницы «Уфа в легендах и преданиях»

## Изменение

В `site/pages/legends/index.html` явно указана ссылка на исходный файл FLV:

- URL источника: `https://ufalit.ufacsdb.ru/images/stories/videos/literaturnieprazdniki/presentation.flv`.
- Подпись ссылки: «Открыть исходный файл на сайте-источнике (FLV)».

Ранее сохранённая локальная копия оставлена на месте и доступна отдельной ссылкой:

- Цель: `../../assets/video/literary-monuments-ufa.flv`.
- Подпись: «Открыть сохранённую локальную копию видеозаписи (FLV)».
- Проверенный по capture evidence файл: `site/assets/video/literary-monuments-ufa.flv`, 4 196 800 байт, SHA-256 `10f52d5b877c3bb643930c101063ceac253402eb0d7d9ca28f8655d4bbe0bacb` (`migration/evidence/legends-capture.md`).

Фраза перед ссылками теперь прямо обозначает, что это локальная копия. Текст статьи и ссылка «Посмотреть оригинал презентации» на `../../assets/documents/literary-monuments-ufa.ppt` не менялись. Исходная ссылка берётся из зафиксированного URL в `migration/content-parity.csv`, `migration/assets.csv` и `migration/evidence/legends-capture.md`.

## Проверка и ограничения

- Относительный адрес локального FLV из `/ufalit/pages/legends/` разрешается в `/ufalit/assets/video/literary-monuments-ufa.flv`; файл существует.
- Относительный адрес презентации разрешается в `/ufalit/assets/documents/literary-monuments-ufa.ppt`; файл существует.
- URL исходного FLV совпадает с документированным исходным URL. Новых сетевых запросов, загрузки видео или проверки воспроизведения не выполнялось.
- Эта правка даёт пользователю явный переход к источнику и отдельно к сохранённой копии. Наличие ссылки не подтверждает проигрывание FLV ни в браузере, ни локально.
