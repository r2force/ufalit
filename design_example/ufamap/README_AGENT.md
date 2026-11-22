# Инструкция для агента: подключение иллюстрированной карты

Этот пакет — небольшой браузерный ES-модуль для встраивания интерактивной карты в существующие HTML-страницы. Он использует MapLibre GL JS, поддерживает собственные изображения меток, всплывающие карточки, ссылки на статьи, границы карты, настраиваемую палитру, полнотекстовый поиск и предопределённые фильтры.

## 1. Состав пакета

```text
ufa-map-kit/
├── map-widget.js          # основной ES-модуль; логика карты и меток
├── map-widget.css         # оформление меток, карточек и вспомогательных фильтров
├── example.html           # самостоятельный пример подключения
├── example-data.js        # массив демонстрационных мест Уфы
├── README_AGENT.md        # эта инструкция
└── assets/markers/        # шесть демонстрационных SVG-иллюстраций
```

Для подключения к существующей странице достаточно скопировать `map-widget.js`, `map-widget.css` и нужные картинки в проект. `example-data.js` нужен только для демонстрации; в реальном проекте данные можно импортировать из собственного JS/JSON или получить с сервера.

## 2. Минимальное подключение

В `<head>` HTML-страницы подключить CSS MapLibre и CSS виджета. Версия CSS должна совпадать с версией MapLibre, которую импортирует `map-widget.js` (по умолчанию 6.19.0).

```html
<link rel="stylesheet" href="https://unpkg.com/maplibre-gl@6.19.0/dist/maplibre-gl.css">
<link rel="stylesheet" href="./map-widget.css">
```

В том месте страницы, где должна быть карта, создать контейнер с ненулевой высотой:

```html
<div id="places-map" style="width:100%;height:600px"></div>
```

В конце `<body>` или в отдельном JS-модуле создать карту:

```html
<script type="module">
  import { createIllustratedMap } from './map-widget.js';

  const places = [
    {
      id: 'museum',
      coordinates: [55.9516, 54.7135], // [долгота, широта]
      title: 'Дом-музей',
      address: 'Уфа, ул. Примерная, 1',
      description: 'Краткое описание места.',
      markerImage: './assets/museum-pin.svg',
      image: './assets/museum-photo.jpg',
      url: '/articles/museum/',
      color: '#c88d68'
    }
  ];

  const mapWidget = await createIllustratedMap({
    container: '#places-map',
    markers: places
  });

  // При необходимости хранить контроллер для дальнейшего управления:
  window.placesMap = mapWidget;
</script>
```

**Важно:** открывайте страницу через HTTP(S), например GitHub Pages или локальный сервер. Не проверяйте ES-модули через `file://`: браузер может блокировать загрузку модулей и ресурсов из локальной файловой системы.

Для локального просмотра из каталога проекта можно запустить:

```bash
python -m http.server 8000
```

Затем открыть `http://localhost:8000/example.html`.

## 3. Формат данных метки (`markers`)

`markers` — массив объектов. Для каждой метки обязателен только `coordinates`; остальные поля необязательны.

| Поле | Тип | Обязательное | Назначение |
|---|---|---:|---|
| `id` | `string` | нет, но желательно | Уникальный идентификатор метки. Нужен для `removeMarker`. Если не задан, создаётся автоматически. |
| `coordinates` | `[number, number]` | **да** | Координаты в порядке **`[longitude, latitude]` = `[долгота, широта]`**. Это порядок GeoJSON, не `[широта, долгота]`. |
| `title` | `string` | нет | Заголовок во всплывающем окне и подсказка при наведении. |
| `address` | `string` | нет | Адрес или местоположение. |
| `description` | `string` | нет | Описание места во всплывающей карточке. Переносы строк сохраняются. |
| `url` | `string` | нет | Ссылка на статью. Если задана, в карточке появится ссылка-кнопка. Поддерживаются HTTP(S) и относительные URL. |
| `linkText` | `string` | нет | Текст ссылки. По умолчанию `Открыть статью ↗`. |
| `linkTarget` | `'_self' \| '_blank'` | нет | Где открыть ссылку. Если не задано, используется общая настройка `linkTarget` карты. |
| `markerImage` | `string` | нет | URL/путь к SVG, PNG, WebP или JPG для самой метки. Путь считается относительно HTML-документа. Если отсутствует, отображается маркер с `emoji`. |
| `markerAlt` | `string` | нет | Альтернативный текст изображения маркера. |
| `emoji` | `string` | нет | Значок для резервного маркера, если `markerImage` не задан или не загрузился. По умолчанию `📍`. |
| `color` | CSS color | нет | Акцентный цвет маркера-заглушки и верхней полосы карточки. По умолчанию `#79a7a0`. |
| `markerSize` | `number \| {width, height}` | нет | Размер именно этой метки в CSS-пикселях. Переопределяет общий `markerSize`. Если число `64`, высота будет примерно `78px`. |
| `image` | `string` | нет | Фотография/иллюстрация внутри всплывающей карточки. Это не изображение маркера; для маркера используется `markerImage`. |
| `imageAlt` | `string` | нет | Alt-текст изображения карточки. |
| `anchor` | `string` | нет | Точка привязки MapLibre: обычно `bottom` для указателя-булавки или `center` для круглой метки. |
| `offset` | `[number, number]` | нет | Сдвиг метки относительно координаты в экранных пикселях. |
| `categories` | `string \| string[]` | нет | Категории места для предопределённых фильтров, например `['museum']`, `['park']`, `['literature']`. Значения сравниваются без учёта регистра. |
| `tags` | `string \| string[]` | нет | Теги места для тематических фильтров, например `['aksakov', 'history']`. |
| `keywords` | `string \| string[]` | нет | Дополнительные слова для полнотекстового поиска, например альтернативные имена, темы и варианты написания. |
| `searchText` | `string` | нет | Дополнительный произвольный текст, включаемый в поисковый индекс метки. |

Пример одной метки:

```js
{
  id: 'aksakov-garden',
  coordinates: [56.010514, 54.733888],
  title: 'Аксаковский сад',
  address: 'ул. Пушкина, 112/2',
  description: 'Место усадьбы семьи Аксаковых.',
  markerImage: './assets/markers/garden.svg',
  markerAlt: 'Иллюстрация дерева',
  image: './assets/photos/aksakov-garden.jpg',
  imageAlt: 'Вид на сад',
  url: '/places/aksakov-garden/',
  linkText: 'Читать о саде ↗',
  color: '#78a58a'
}
```

### Разница между `markerImage` и `image`

- `markerImage` — маленькая картинка, которая постоянно видна на карте и заменяет стандартный кружок.
- `image` — большая картинка внутри всплывающего информационного окна после клика.
- Можно указывать только `markerImage`, только `image`, оба поля или ни одного.

Если для `markerImage` указан путь, например `./assets/pin.svg`, файл должен существовать и быть доступен браузеру. Рекомендуется использовать прозрачные SVG/PNG с самим рисунком и прозрачными полями по краям.

## 4. Параметры `createIllustratedMap(config)`

Функция асинхронная: `const widget = await createIllustratedMap(config)`. Она возвращает контроллер виджета.

| Параметр | Тип | По умолчанию | Назначение |
|---|---|---|---|
| `container` | `string \| HTMLElement` | — | **Обязательный.** CSS-селектор контейнера (`'#map'`) или сам HTML-элемент. Контейнер должен иметь высоту. |
| `markers` | `Marker[]` | `[]` | Массив меток в формате раздела 3. |
| `style` | `string \| object` | OpenFreeMap Bright | URL стиля MapLibre или JSON-объект стиля. Позволяет полностью заменить картографическую подложку. |
| `bounds` | `[[west,south],[east,north]]` | `null` | Географические границы области карты. Координаты — долгота/широта. При наличии карта по умолчанию показывает всю область. |
| `restrictToBounds` | `boolean` | `Boolean(bounds)` | Ограничивает перемещение карты заданными границами. Для `true` обязательно задать `bounds`. |
| `autoMinZoom` | `boolean` | `true`, если есть `bounds` и включено ограничение | Автоматически рассчитывает минимальный zoom так, чтобы заданная область помещалась в окне. При изменении размера контейнера пересчитывает значение. |
| `minZoom` | `number` | рассчитывается автоматически либо MapLibre default | Явный минимальный масштаб. Если задан, он имеет приоритет над `autoMinZoom`. |
| `maxZoom` | `number` | `19` | Максимальное приближение. |
| `center` | `[longitude, latitude]` | `[55.968, 54.731]` | Начальный центр карты, если не задан `view.center`. При `fitBoundsOnLoad: true` начальный вид затем будет автоматически подогнан под область/метки. |
| `zoom` | `number` | `10` | Начальный zoom, если не задан `view.zoom`. |
| `view` | `{center, zoom}` | — | Альтернативный способ задать стартовый центр и zoom. Значения из `view` приоритетнее отдельных `center` и `zoom`. |
| `fitBoundsOnLoad` | `boolean` | `true` | Автоматически подгоняет вид карты под `bounds`, а если границ нет — под все метки. Если `false`, остаётся `center`/`zoom` или `view`. |
| `fitPadding` | `number \| {top,right,bottom,left}` | `48` | Отступ вокруг области при автоматическом вписывании. Учитывайте шапку/панели страницы. |
| `fitMaxZoom` | `number` | `12.5` | Максимальный zoom при первоначальном вписывании заданных `bounds`. |
| `singleMarkerZoom` | `number` | `14` | Zoom, если автоматическое вписывание выполняется только по одной метке без `bounds`. |
| `minZoomPadding` | `number \| object` | `fitPadding` | Отступ при расчёте автоматически вычисляемого `minZoom`. |
| `palette` | `boolean \| object` | `true` | Включает детскую пастельную палитру по именам слоёв базового стиля. `false` отключает. Объектом можно переопределить отдельные цвета. |
| `markerSize` | `number \| {width,height}` | `64` | Общий размер меток. Можно переопределить в отдельной записи `markerSize`. |
| `markerClass` | `string` | `''` | Дополнительный CSS-класс корневого элемента всех маркеров для собственного оформления. Не задавайте на нём `transform` или `transition`: MapLibre использует `transform` для позиционирования. |
| `popup` | `object` | см. ниже | Общие настройки всплывающих карточек. |
| `linkTarget` | `'_self' \| '_blank'` | `'_blank'` | Цель открытия ссылок, если у конкретной метки нет `linkTarget`. |
| `controls` | `object` | навигация и масштаб включены | Какие стандартные элементы управления показывать. |
| `attributionControl` | `boolean` | `true` | Показывать копирайт/атрибуцию карты. Не отключайте без проверки условий поставщика данных. |
| `cooperativeGestures` | `boolean` | `false` | Включает режим, в котором для масштабирования колесом/жестом требуется дополнительное действие пользователя. |
| `loadTimeoutMs` | `number` | `30000` | Сколько миллисекунд ждать загрузку начального стиля карты, прежде чем вернуть ошибку. |
| `onReady` | `(controller) => void` | — | Callback после загрузки карты и размещения начальных меток. |
| `onError` | `(error, map) => void` | — | Callback ошибок MapLibre, в том числе сетевых ошибок тайлов. |
| `onMarkerClick` | `(markerData, map) => void` | — | Вызывается при клике по метке. Стандартное поведение — открыть popup. Callback добавляется как дополнительное действие; не используйте его для безусловного перехода по ссылке. |
| `filters` | `Filter[]` | `[]` | Список предопределённых фильтров, которыми будут управлять кнопки страницы или API. Формат описан в разделе 6. |
| `initialFilter` | `string` | `'all'` | ID начального предопределённого фильтра. `all` означает отсутствие фильтра. |
| `initialSearch` | `string` | `''` | Начальный текст полнотекстового поиска. |
| `filterControls` | `object` | — | Необязательно автоматически связать существующее поле поиска и кнопки по CSS-селекторам. См. раздел 6. |
| `onFilterChange` | `(state, map) => void` | — | Вызывается при изменении видимых меток. `state` содержит `query`, `presetFilterId`, `visibleMarkers` и `totalMarkers`. Удобно обновлять счётчик результатов. |

### Настройки `popup`

```js
popup: {
  offset: 34,             // отступ окна от метки в px
  closeButton: true,      // крестик закрытия
  closeOnClick: true,     // закрывать popup при клике по карте
  maxWidth: '310px',      // максимальная ширина
  className: 'my-popup'   // дополнительный класс контейнера popup
}
```

### Настройки `controls`

```js
controls: {
  navigation: true,       // кнопки + / -
  compass: false,         // показывать компас рядом с zoom-кнопками
  scale: true,            // масштабная линейка
  scaleUnit: 'metric',    // 'metric', 'imperial' или 'nautical'
  scaleWidth: 100,        // ширина линейки в px
  position: 'top-right'   // позиция навигационных кнопок
}
```

Позиция `scale` в текущей реализации — `bottom-right`. Допустимые позиции MapLibre: `top-left`, `top-right`, `bottom-left`, `bottom-right`.

### Настройки `palette`

По умолчанию применяется такая палитра:

```js
palette: {
  background: '#fff4d6',
  water: '#9cdef4',
  parks: '#c4e9a9',
  woodland: '#a8d99a',
  grass: '#def0b2',
  buildings: '#f4d0ad',
  residential: '#fff0d1',
  education: '#ead8f5',
  healthcare: '#ffd9d1',
  streets: '#fff8e9',
  majorRoads: '#f5bd83'
}
```

Передавайте только те ключи, которые требуется изменить:

```js
palette: {
  water: '#83d7f0',
  buildings: '#f6d8b8'
}
```

`palette: false` оставляет цвета исходного стиля без изменений.

**Ограничение палитры:** перекраска применяется к слоям, названия которых распознаны по словам `water`, `park`, `building`, `road` и т. п. Это удобная автоматическая настройка для демонстрационного Bright-стиля, но названия слоёв могут различаться в других стилях. Для точного контроля над другим стилем используйте собственный JSON style или его редактор. Палитра меняет общие слои карты, а не отдельные здания.

## 5. Границы и масштаб карты

Формат `bounds` строго такой:

```js
bounds: [
  [55.78, 54.56], // юго-запад: [west longitude, south latitude]
  [56.30, 54.96]  // северо-восток: [east longitude, north latitude]
]
```

Пример с ограничением картой города:

```js
bounds: [[55.781564, 54.565138], [56.297619, 54.960214]],
restrictToBounds: true,
autoMinZoom: true,
```

- `restrictToBounds` запрещает перетаскивать карту далеко за границы заданной области.
- `autoMinZoom` не позволяет отдалить карту настолько, чтобы область перестала помещаться в окне.
- `maxZoom` ограничивает максимальное приближение.
- Передавайте bounds по реальному прямоугольнику интересующей области. Прямоугольник — не административный полигон: углы области останутся прямоугольными.
- Если требуется только начально показать область, но разрешить пользователю свободно уходить за границы, используйте `restrictToBounds: false`.

## 6. Полнотекстовый поиск и предопределённые фильтры

Фильтрация встроена в модуль. Она не требует вручную удалять метки или создавать второй экземпляр карты. При изменении фильтров модуль скрывает неподходящие метки, оставляя карту и камеру на месте. Когда фильтр снимается, метки появляются снова.

Текстовый поиск и выбранная кнопка фильтра работают **одновременно**: метка отображается, только если она соответствует предопределённому фильтру И текстовому запросу.

### 6.1. Полнотекстовый поиск

По умолчанию поиск выполняется по следующим полям каждой метки:

- `title` — заголовок;
- `address` — адрес;
- `description` — описание;
- `categories` и `tags` — категории и теги;
- `keywords` — дополнительные ключевые слова;
- `searchText` — произвольный дополнительный текст.

Запрос разбивается на слова. **Каждое слово запроса должно встретиться хотя бы в одном поисковом поле**. Сопоставление выполняется по подстроке, поэтому запрос `Габдулла` найдёт метку `Дом, где жил Габдулла Амантай`, а запрос `Габдулла Амантай` также найдёт её. Поиск нечувствителен к регистру; `ё` и `е` считаются одинаковыми. Пунктуация используется как разделитель слов.

Пример:

```js
widget.setTextFilter('Габдулла');
widget.setTextFilter('дом Габдулла');
widget.setTextFilter('музей Аксаков');
widget.setTextFilter(''); // очистить только текстовый поиск
```

При необходимости добавляйте синонимы и варианты написания в `keywords` или `searchText`. Например:

```js
{
  title: 'Дом, где жил Габдулла Амантай',
  keywords: ['Габдулла', 'Амантай', 'поэт', 'литература', 'жилой дом'],
  searchText: 'история уфимской литературы'
}
```

### 6.2. Предопределённые фильтры для кнопок

В конфигурации карты задайте массив `filters`. Каждая кнопка с атрибутом `data-map-filter` указывает `id` нужного фильтра. Значение `all` зарезервировано: оно показывает все метки и снимает только предопределённый фильтр (текстовый запрос остаётся активным).

Поля определения фильтра:

| Поле | Тип | Значение |
|---|---|---|
| `id` | `string` | Уникальный идентификатор. Должен совпадать с `data-map-filter` на кнопке. `all` зарезервирован. |
| `label` | `string` | Необязательное название для документации/интерфейса; виджет не создаёт кнопки автоматически. |
| `categories` | `string \| string[]` | Оставлять метки с совпадающими `marker.categories`. |
| `tags` | `string \| string[]` | Оставлять метки с совпадающими `marker.tags`. |
| `ids` | `string[]` | Оставлять метки с указанными ID. |
| `match` | `'any' \| 'all'` | Как сравнивать несколько значений внутри `categories` или `tags`. `any` — достаточно одного совпадения (по умолчанию); `all` — должны совпасть все значения фильтра. |
| `predicate` | `(marker) => boolean` | Необязательная произвольная проверка на JavaScript. Можно использовать вместе с остальными условиями. |

Условия разных полей комбинируются через AND: если фильтр задаёт `categories` и `tags`, метка должна соответствовать обеим группам. Внутри каждой группы `match: 'any'` означает OR, `match: 'all'` — AND.

Пример конфигурации:

```js
const widget = await createIllustratedMap({
  container: '#places-map',
  markers: places,
  filters: [
    { id: 'parks', label: 'Парки', categories: ['park'] },
    { id: 'museums', label: 'Музеи', categories: ['museum'] },
    { id: 'literary', label: 'Литературные места', tags: ['literature'] },
    { id: 'aksakov', label: 'Аксаков', tags: ['aksakov'] },
  ],
});
```

Каждой метке добавьте соответствующие данные:

```js
{
  id: 'aksakov-garden',
  title: 'Аксаковский сад',
  categories: ['park'],
  tags: ['aksakov', 'literature', 'history'],
  keywords: ['сад', 'усадьба', 'писатель'],
  coordinates: [56.010514, 54.733888]
}
```

### 6.3. Связь с уже существующими элементами HTML

Самый простой вариант — добавить к кнопкам `data-map-filter`, а полю поиска назначить обычный CSS-селектор:

```html
<input id="places-search" type="search" placeholder="Поиск по местам…">

<button type="button" data-map-filter="all">Все</button>
<button type="button" data-map-filter="parks">Парки</button>
<button type="button" data-map-filter="museums">Музеи</button>
<button type="button" data-map-filter="aksakov">Аксаков</button>
```

Передайте селекторы в настройках создания карты:

```js
const widget = await createIllustratedMap({
  container: '#places-map',
  markers: places,
  filters: [
    { id: 'parks', categories: ['park'] },
    { id: 'museums', categories: ['museum'] },
    { id: 'aksakov', tags: ['aksakov'] },
  ],
  filterControls: {
    searchInput: '#places-search',
    filterButtons: '[data-map-filter]',
    activeClass: 'is-active', // CSS-класс активной кнопки; false — не менять классы
  },
});
```

Виджет сам установит обработчики `input` и `click`, а также будет выставлять кнопкам `aria-pressed="true/false"`. Стили активной кнопки принадлежат странице. Пример CSS:

```css
[data-map-filter] { /* обычная кнопка */ }
[data-map-filter].is-active { background: #dcefd7; border-color: #709c7c; }
```

`filterControls` можно не использовать, если страница уже управляет кнопками самостоятельно. Тогда вызывайте методы контроллера напрямую:

```js
searchInput.addEventListener('input', () => {
  widget.setTextFilter(searchInput.value);
});

for (const button of document.querySelectorAll('[data-map-filter]')) {
  button.addEventListener('click', () => {
    widget.setPresetFilter(button.dataset.mapFilter);
  });
}
```

### 6.4. Методы API фильтрации

| Метод/свойство | Назначение |
|---|---|
| `widget.setTextFilter(text)` | Установить/изменить текстовый запрос. Пустая строка снимает только текстовый фильтр. |
| `widget.setPresetFilter(id)` | Включить предопределённый фильтр по ID. `all` снимает только предопределённый фильтр. |
| `widget.clearFilters()` | Снять оба вида фильтра и очистить подключённое поле поиска. |
| `widget.getVisibleMarkers()` | Получить массив данных меток, которые сейчас отображаются. |
| `widget.filterState` | Текущее состояние: `{ query, presetFilterId, visibleMarkers, totalMarkers }`. |
| `widget.bindFilterControls(options)` | Подключить элементы HTML после создания карты. Возвращает функцию отписки. |
| `widget.filters` | Массив определённых фильтров (без функций `predicate`). |

Примеры:

```js
widget.setPresetFilter('aksakov');
widget.setTextFilter('Габдулла'); // применится одновременно с фильтром aksakov
widget.clearFilters();

// Получить число оставшихся меток:
console.log(widget.getVisibleMarkers().length);

// Подключить элементы, добавленные позже:
const unbind = widget.bindFilterControls({
  searchInput: document.querySelector('#map-search'),
  filterButtons: document.querySelectorAll('.map-filter'),
  activeClass: 'selected',
});

// При удалении панели/компонента:
unbind();
```

Если в `createIllustratedMap` передан callback `onFilterChange`, он вызывается после каждого изменения фильтра:

```js
onFilterChange({ query, presetFilterId, visibleMarkers, totalMarkers }, map) {
  document.querySelector('#result-count').textContent =
    `Найдено: ${visibleMarkers.length} из ${totalMarkers}`;
}
```

`setTextFilter`, `setPresetFilter` и `clearFilters` возвращают контроллер, поэтому вызовы можно объединять. Сочетание фильтров всегда аддитивно по условиям: включённая кнопка и текстовый запрос ограничивают один и тот же общий набор меток.

## 7. Управление картой после создания

```js
const widget = await createIllustratedMap(config);
```

Контроллер содержит:

| Метод/свойство | Назначение |
|---|---|
| `widget.map` | Нативный экземпляр MapLibre GL JS. Для любых функций MapLibre, например `map.flyTo(...)`, слоёв и событий. |
| `widget.markers` | Текущий массив данных меток. |
| `widget.addMarker(markerData)` | Добавить одну новую метку. Возвращает объект `{id, remove, marker, popup}`. `id` должен быть уникальным. |
| `widget.removeMarker(id)` | Удалить метку по `id`. Возвращает `true`, если метка была найдена и удалена. |
| `widget.setMarkers(array)` | Полностью удалить старые метки и установить новый массив. |
| `widget.fitToContent(options)` | Подогнать камеру под область карты или все текущие метки. |
| `widget.setTextFilter(text)` | Применить полнотекстовый поиск. |
| `widget.setPresetFilter(id)` | Включить предопределённый фильтр (`all` — снять). |
| `widget.clearFilters()` | Снять все фильтры. |
| `widget.getVisibleMarkers()` | Получить текущий набор показанных меток. |
| `widget.bindFilterControls(options)` | Связать HTML-поле поиска и кнопки с виджетом. |
| `widget.filterState` | Прочитать активный запрос, фильтр и количество результатов. |
| `widget.destroy()` | Уничтожить экземпляр MapLibre и освободить связанные с ним ресурсы. Вызывайте при удалении/замене страницы или компонента. |

Примеры:

```js
// Добавить метку
widget.addMarker({
  id: 'new-place',
  coordinates: [55.95, 54.73],
  title: 'Новое место',
  description: 'Описание.',
  url: '/articles/new-place/',
  emoji: '🏛️',
  color: '#a9a0d4'
});

// Удалить метку
widget.removeMarker('new-place');

// Полностью заменить набор точек
widget.setMarkers(serverData);

// Показать городские bounds с небольшими отступами
widget.fitToContent({ padding: 55, duration: 400, useMapBounds: true });

// Нативное управление MapLibre
widget.map.flyTo({ center: [55.96, 54.74], zoom: 14 });

// Очистка перед повторной инициализацией компонента
widget.destroy();
```

## 8. Полный пример конфигурации

```js
const widget = await createIllustratedMap({
  container: '#places-map',
  style: 'https://tiles.openfreemap.org/styles/bright',
  markers: articlePlaces,
  filters: [
    { id: 'parks', categories: ['park'] },
    { id: 'museums', categories: ['museum'] },
    { id: 'literary', tags: ['literature'] },
  ],
  filterControls: {
    searchInput: '#places-search',
    filterButtons: '[data-map-filter]',
    activeClass: 'is-active',
  },
  onFilterChange({ visibleMarkers, totalMarkers }) {
    console.log(`Показано ${visibleMarkers.length} из ${totalMarkers}`);
  },
  bounds: [[55.781564, 54.565138], [56.297619, 54.960214]],
  restrictToBounds: true,
  autoMinZoom: true,
  maxZoom: 18,
  fitBoundsOnLoad: true,
  fitPadding: { top: 70, right: 60, bottom: 70, left: 60 },
  fitMaxZoom: 12.5,
  markerSize: { width: 66, height: 82 },
  palette: true,
  linkTarget: '_blank',
  popup: { closeButton: true, maxWidth: '320px' },
  controls: { navigation: true, scale: true },
  onMarkerClick(markerData, map) {
    console.log('Выбрано место:', markerData.id);
  },
  onError(error) {
    console.error('Ошибка карты или тайлов:', error);
  }
});
```

## 9. Сетевые ресурсы, атрибуция и публикация

- MapLibre GL JS загружается как ES-модуль с UNPKG; если он недоступен, модуль пробует jsDelivr.
- CSS MapLibre загружается отдельно через `<link>` в HTML.
- По умолчанию картографический стиль загружается с `https://tiles.openfreemap.org/styles/bright`.
- Следовательно, карта и подложка требуют подключения к интернету. Этот JS-модуль не содержит сами картографические тайлы.
- Включён `attributionControl: true`; не удаляйте атрибуцию источников картографических данных.
- Публичные картографические endpoints могут иметь собственные условия использования, лимиты и отсутствие SLA. Перед широким коммерческим запуском проверьте актуальные условия OpenFreeMap и OpenStreetMap либо используйте собственный/коммерческий хостинг тайлов.
- Для публикации на GitHub Pages сохраняйте относительные пути к модулю и иллюстрациям. Проверьте регистр букв в именах файлов: на Linux/GitHub Pages он чувствителен к регистру.

## 10. Важные замечания по реализации

- В этом пакете **нет механизма поиска, подсветки или перекраски отдельных зданий и полигонов**. Метки — отдельные HTML-элементы, привязанные к географическим координатам.
- Не добавляйте `transform` и `transition` на `.im-map-marker`: MapLibre задаёт `transform` корневому DOM-элементу маркера. Анимацию можно задавать только дочерним элементам (`.im-map-marker__image` или `.im-map-marker__fallback`).
- Координаты MapLibre всегда задаются как `[longitude, latitude]`.
- Popup строится через DOM и `textContent`, а не вставляет текст пользователя через `innerHTML`.
- Полнотекстовый поиск нечувствителен к регистру, нормализует `ё` в `е`, ищет каждое слово запроса по подстроке в `title`, `address`, `description`, `categories`, `tags`, `keywords` и `searchText`.
- Чтобы кнопки работали, ID в `data-map-filter` должны совпадать с ID в массиве `filters`; значение `all` зарезервировано.
- Предопределённые фильтры и текстовый поиск комбинируются: должны одновременно выполняться оба условия.
- Ссылки с протоколами, отличными от HTTP/HTTPS, отклоняются.
- Если маркер не отобразился, проверьте `markerImage` URL, консоль браузера, доступность файла и высоту контейнера карты.
- Если карта не загрузилась, проверьте доступность MapLibre CDN, стиля OpenFreeMap и наличие ошибок CORS/сети в DevTools.
