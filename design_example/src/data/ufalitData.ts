const RAW_BASE = 'https://raw.githubusercontent.com/r2force/ufalit/main/site';

export interface GalleryPhoto {
  id: string; // e.g., "photo-312" (matches content-parity.csv)
  src: string;
  originalPath: string; // e.g., "../../assets/gallery/aksakov/312.jpg"
  caption: string;
  authorSlug: string;
  authorName: string;
  categoryTag: 'Портреты' | 'Архитектура и улицы' | 'Памятники и доски' | 'Карты и документы' | 'Книжные издания';
  aspectHint: 'portrait' | 'landscape' | 'wide-doc' | 'square';
  yearOrEra?: string;
  addressHint?: string;
  contextNote?: string;
  hasFineDetails?: boolean; // Highlights "Лупа краеведа" feature for maps/trees/documents
}

export interface GalleryCollection {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  years: string;
  photoCount: number;
  repoPagePath: string;
  coverPhoto: string;
  description: string;
  subcategories?: { id: string; title: string; count: number; path: string }[];
  photos: GalleryPhoto[];
}

export interface LiteraryLandmark {
  id: string;
  paritySectionId: string;
  title: string;
  writer: string;
  writerSlug: string;
  address: string;
  era: string;
  category: 'Дом-музей' | 'Театр и Народный дом' | 'Парк и сквер' | 'Памятник' | 'Историческая улица' | 'Библиотека';
  mapX: number; // % on stylized map of Ufa peninsula
  mapY: number;
  image: string;
  quote?: string;
  paragraphs: string[];
}

export interface WriterProfile {
  id: string;
  slug: string;
  name: string;
  letter: string;
  years: string;
  role: string;
  portrait: string;
  ufaConnection: string;
  keyPlaces: string[];
  gallerySlug: string;
  galleryCount: number;
  readingLinks: { title: string; path: string; type: 'prose' | 'poetry' | 'audio' }[];
  bioSections: {
    heading: string;
    paragraphs: string[];
    inlineImages?: { src: string; caption: string; id: string }[];
  }[];
  bibliography: {
    sectionTitle: string;
    items: string[];
  }[];
}

export interface AudioTrack {
  id: string;
  number: string;
  title: string;
  author: string;
  src: string;
  originalPath: string;
  poemExcerpt: string;
}

export const GALLERY_COLLECTIONS: GalleryCollection[] = [
  {
    id: 'aksakov',
    slug: 'gallery-aksakov',
    title: 'Аксаков Сергей Тимофеевич',
    subtitle: 'Родовое гнездо, Аксаковский сад, Народный дом и родословная Соколовых',
    years: '1791 – 1859',
    photoCount: 15,
    repoPagePath: 'site/pages/gallery-aksakov/index.html',
    coverPhoto: `${RAW_BASE}/assets/gallery/aksakov/312.jpg`,
    description:
      'Эталонная подборка из 15 архивных и современных кадров, прошедших независимую сверку SHA-256 и порядка в реестре content-parity.csv. Включает портрет писателя, старинные открытки Уфы, генеалогическое древо и карту аксаковских мест.',
    photos: [
      {
        id: 'photo-312',
        src: `${RAW_BASE}/assets/gallery/aksakov/312.jpg`,
        originalPath: '../../assets/gallery/aksakov/312.jpg',
        caption: 'Сергей Аксаков',
        authorSlug: 'aksakov',
        authorName: 'С. Т. Аксаков',
        categoryTag: 'Портреты',
        aspectHint: 'portrait',
        yearOrEra: 'XIX век',
        contextNote: 'Классический живописный портрет уроженца Уфы, автора «Семейной хроники», «Детских годов Багрова-внука» и сказки «Аленький цветочек».'
      },
      {
        id: 'photo-305',
        src: `${RAW_BASE}/assets/gallery/aksakov/305.jpg`,
        originalPath: '../../assets/gallery/aksakov/305.jpg',
        caption: 'Аксаковская гимназия',
        authorSlug: 'aksakov',
        authorName: 'С. Т. Аксаков',
        categoryTag: 'Архитектура и улицы',
        aspectHint: 'landscape',
        addressHint: 'Уфа, исторический центр',
        contextNote: 'В Аксаковской гимназии г. Уфы почетные гости Международного Аксаковского праздника традиционно проводят Аксаковский урок.'
      },
      {
        id: 'photo-306',
        src: `${RAW_BASE}/assets/gallery/aksakov/306.jpg`,
        originalPath: '../../assets/gallery/aksakov/306.jpg',
        caption: 'Бюст Аксакова',
        authorSlug: 'aksakov',
        authorName: 'С. Т. Аксаков',
        categoryTag: 'Памятники и доски',
        aspectHint: 'portrait',
        yearOrEra: 'Открыт 12 мая 1959 г.',
        addressHint: 'Ул. Пушкина, у стен Театра оперы и балета',
        contextNote: 'Скульптор Т. П. Нечаева, архитектор В. А. Кондрашков. Отлит из бронзы к 100-летию со дня смерти писателя.'
      },
      {
        id: 'photo-307',
        src: `${RAW_BASE}/assets/gallery/aksakov/307.jpg`,
        originalPath: '../../assets/gallery/aksakov/307.jpg',
        caption: 'Генеалогическое древо Соколовых',
        authorSlug: 'aksakov',
        authorName: 'С. Т. Аксаков',
        categoryTag: 'Карты и документы',
        aspectHint: 'wide-doc',
        hasFineDetails: true,
        contextNote: 'Родословная схема уфимских потомков и родственников рода Аксаковых — династии врачей и краеведов Соколовых. Включите «Лупу краеведа», чтобы прочитать ветви древа.'
      },
      {
        id: 'photo-308',
        src: `${RAW_BASE}/assets/gallery/aksakov/308.jpg`,
        originalPath: '../../assets/gallery/aksakov/308.jpg',
        caption: 'Дом губернатора',
        authorSlug: 'aksakov',
        authorName: 'С. Т. Аксаков',
        categoryTag: 'Архитектура и улицы',
        aspectHint: 'landscape',
        yearOrEra: 'Середина XIX века',
        contextNote: 'Сын писателя, Григорий Сергеевич Аксаков, в 1860-е годы служил губернатором Уфимской губернии и оставил яркий след в благоустройстве города.'
      },
      {
        id: 'photo-309',
        src: `${RAW_BASE}/assets/gallery/aksakov/309.jpg`,
        originalPath: '../../assets/gallery/aksakov/309.jpg',
        caption: 'Карта аксаковских мест',
        authorSlug: 'aksakov',
        authorName: 'С. Т. Аксаков',
        categoryTag: 'Карты и документы',
        aspectHint: 'wide-doc',
        hasFineDetails: true,
        contextNote: 'Иллюстрированная краеведческая схема памятных мест Башкирии и Уфы, связанных с семьей Аксаковых. Рекомендуется просмотр с оптической лупой.'
      },
      {
        id: 'photo-310',
        src: `${RAW_BASE}/assets/gallery/aksakov/310.jpg`,
        originalPath: '../../assets/gallery/aksakov/310.jpg',
        caption: 'Мемориальный знак',
        authorSlug: 'aksakov',
        authorName: 'С. Т. Аксаков',
        categoryTag: 'Памятники и доски',
        aspectHint: 'portrait',
        addressHint: 'Сад им. С. Т. Аксакова (ул. Пушкина)',
        contextNote: 'Памятный камень на месте усадьбы в бывшей Голубиной слободке, где родился будущий писатель.'
      },
      {
        id: 'photo-311',
        src: `${RAW_BASE}/assets/gallery/aksakov/311.jpg`,
        originalPath: '../../assets/gallery/aksakov/311.jpg',
        caption: 'Сад Аксакова',
        authorSlug: 'aksakov',
        authorName: 'С. Т. Аксаков',
        categoryTag: 'Архитектура и улицы',
        aspectHint: 'landscape',
        addressHint: 'Ул. Пушкина',
        contextNote: 'Старейший городской парк с озером и ажурными аллеями на месте бывшей усадьбы родителей писателя.'
      },
      {
        id: 'photo-313',
        src: `${RAW_BASE}/assets/gallery/aksakov/313.jpg`,
        originalPath: '../../assets/gallery/aksakov/313.jpg',
        caption: 'Скульптура Аленький цветочек',
        authorSlug: 'aksakov',
        authorName: 'С. Т. Аксаков',
        categoryTag: 'Памятники и доски',
        aspectHint: 'portrait',
        addressHint: 'Сад им. С. Т. Аксакова',
        contextNote: 'Кованая художественная композиция по мотивам знаменитой сказки «Аленький цветочек», записанной со слов ключницы Пелагеи.'
      },
      {
        id: 'photo-314',
        src: `${RAW_BASE}/assets/gallery/aksakov/314.jpg`,
        originalPath: '../../assets/gallery/aksakov/314.jpg',
        caption: 'Театр Арт\u00A0 - кафе Аленький цветочек',
        authorSlug: 'aksakov',
        authorName: 'С. Т. Аксаков',
        categoryTag: 'Архитектура и улицы',
        aspectHint: 'landscape',
        contextNote: 'Литературно-художественный уголок в городской среде Уфы, носящий имя знаменитой аксаковской сказки.'
      },
      {
        id: 'photo-315',
        src: `${RAW_BASE}/assets/gallery/aksakov/315.jpg`,
        originalPath: '../../assets/gallery/aksakov/315.jpg',
        caption: 'Улица Аксакова',
        authorSlug: 'aksakov',
        authorName: 'С. Т. Аксаков',
        categoryTag: 'Архитектура и улицы',
        aspectHint: 'landscape',
        addressHint: 'Историческая часть Уфы (бывш. Каретная ул.)',
        contextNote: 'Переименована на рубеже XIX и XX веков. Сохранила образцы деревянного модерна с резными наличниками.'
      },
      {
        id: 'photo-316',
        src: `${RAW_BASE}/assets/gallery/aksakov/316.jpg`,
        originalPath: '../../assets/gallery/aksakov/316.jpg',
        caption: 'Улица Аксакова',
        authorSlug: 'aksakov',
        authorName: 'С. Т. Аксаков',
        categoryTag: 'Архитектура и улицы',
        aspectHint: 'landscape',
        addressHint: 'Ул. Аксакова (ракурс 2)',
        contextNote: 'Архитектурный облик старинной уфимской улицы.'
      },
      {
        id: 'photo-317',
        src: `${RAW_BASE}/assets/gallery/aksakov/317.jpg`,
        originalPath: '../../assets/gallery/aksakov/317.jpg',
        caption: 'Улица Аксакова',
        authorSlug: 'aksakov',
        authorName: 'С. Т. Аксаков',
        categoryTag: 'Архитектура и улицы',
        aspectHint: 'landscape',
        addressHint: 'Ул. Аксакова (ракурс 3)',
        contextNote: 'Деревянное кружево наличников старинных домов на улице Аксакова.'
      },
      {
        id: 'photo-318',
        src: `${RAW_BASE}/assets/gallery/aksakov/318.jpg`,
        originalPath: '../../assets/gallery/aksakov/318.jpg',
        caption: 'Читальня в Аксаковском саду',
        authorSlug: 'aksakov',
        authorName: 'С. Т. Аксаков',
        categoryTag: 'Карты и документы',
        aspectHint: 'landscape',
        yearOrEra: 'Архивная открытка начала XX в.',
        hasFineDetails: true,
        contextNote: 'Редкий дореволюционный снимок павильона-читальни в саду имени С. Т. Аксакова.'
      },
      {
        id: 'photo-319',
        src: `${RAW_BASE}/assets/gallery/aksakov/319.jpg`,
        originalPath: '../../assets/gallery/aksakov/319.jpg',
        caption: 'Аксаковский народный дом',
        authorSlug: 'aksakov',
        authorName: 'С. Т. Аксаков',
        categoryTag: 'Архитектура и улицы',
        aspectHint: 'landscape',
        addressHint: 'Угол ул. Ленина, 5 и ул. Пушкина',
        yearOrEra: 'Заложен в 1909 г., арх. П. П. Рудавский',
        contextNote: 'Уникальное здание, соединяющее русский классицизм со стороны ул. Ленина и восточный стиль со стороны ул. Пушкина.'
      }
    ]
  },
  {
    id: 'karim',
    slug: 'gallery-9',
    title: 'Мустай Карим (Каримов Мустафа Сафич)',
    subtitle: 'Памятные места народного поэта Башкортостана, мемориальные доски и архив',
    years: '1919 – 2005',
    photoCount: 56,
    repoPagePath: 'site/pages/gallery-35/index.html',
    coverPhoto: `${RAW_BASE}/assets/gallery/35/581.jpg`,
    description:
      'Двухуровневая категория галереи (gallery-9 -> подразделы #category-35 «Фото памятных мест (23)» и #category-36 «Фотографии (33)»). Демонстрирует, как в новом дизайне оформляются вложенные альбомы писателя.',
    subcategories: [
      { id: 'category-35', title: 'Фото памятных мест', count: 23, path: 'pages/gallery-35/index.html' },
      { id: 'category-36', title: 'Фотографии из личного и литературного архива', count: 33, path: 'pages/gallery-36/index.html' }
    ],
    photos: [
      {
        id: 'photo-581',
        src: `${RAW_BASE}/assets/gallery/35/581.jpg`,
        originalPath: '../../assets/gallery/35/581.jpg',
        caption: 'Мустай Памятник',
        authorSlug: 'karim',
        authorName: 'Мустай Карим',
        categoryTag: 'Памятники и доски',
        aspectHint: 'portrait',
        addressHint: 'Площадь перед Домом профсоюзов (ул. Кирова)',
        contextNote: 'Монументальный скульптурный ансамбль народному поэту Башкортостана Мустаю Кариму с героями его произведений и взлетающими страницами рукописей.'
      },
      {
        id: 'photo-568',
        src: `${RAW_BASE}/assets/gallery/35/568.gif`,
        originalPath: '../../assets/gallery/35/568.gif',
        caption: 'Улица Мустая',
        authorSlug: 'karim',
        authorName: 'Мустай Карим',
        categoryTag: 'Карты и документы',
        aspectHint: 'wide-doc',
        hasFineDetails: true,
        addressHint: 'Ул. Мустая Карима (бывш. Социалистическая)',
        contextNote: 'Картографическая схема улицы имени Мустая Карима в историческом центре столицы.'
      },
      {
        id: 'photo-569',
        src: `${RAW_BASE}/assets/gallery/35/569.jpg`,
        originalPath: '../../assets/gallery/35/569.jpg',
        caption: 'Дом по улице Мустая с памятной доской',
        authorSlug: 'karim',
        authorName: 'Мустай Карим',
        categoryTag: 'Архитектура и улицы',
        aspectHint: 'landscape',
        addressHint: 'Ул. Мустая Карима'
      },
      {
        id: 'photo-576',
        src: `${RAW_BASE}/assets/gallery/35/576.jpg`,
        originalPath: '../../assets/gallery/35/576.jpg',
        caption: 'Медаль Карима',
        authorSlug: 'karim',
        authorName: 'Мустай Карим',
        categoryTag: 'Памятники и доски',
        aspectHint: 'square',
        hasFineDetails: true,
        contextNote: 'Наградная памятная медаль с барельефом Мустая Карима.'
      },
      {
        id: 'photo-577',
        src: `${RAW_BASE}/assets/gallery/35/577.jpg`,
        originalPath: '../../assets/gallery/35/577.jpg',
        caption: 'Мемориальная доска',
        authorSlug: 'karim',
        authorName: 'Мустай Карим',
        categoryTag: 'Памятники и доски',
        aspectHint: 'portrait',
        addressHint: 'Ул. Энгельса, 5',
        contextNote: 'Бронзовый барельеф на доме, где жил и творил народный поэт.'
      },
      {
        id: 'photo-578',
        src: `${RAW_BASE}/assets/gallery/35/578.jpg`,
        originalPath: '../../assets/gallery/35/578.jpg',
        caption: 'Молодежный театр',
        authorSlug: 'karim',
        authorName: 'Мустай Карим',
        categoryTag: 'Архитектура и улицы',
        aspectHint: 'landscape',
        addressHint: 'Ул. Ленина, 62',
        contextNote: 'Национальный молодежный театр Республики Башкортостан носит имя Мустая Карима.'
      },
      {
        id: 'photo-579',
        src: `${RAW_BASE}/assets/gallery/35/579.jpg`,
        originalPath: '../../assets/gallery/35/579.jpg',
        caption: 'Мустаевские чтения',
        authorSlug: 'karim',
        authorName: 'Мустай Карим',
        categoryTag: 'Портреты',
        aspectHint: 'landscape',
        contextNote: 'Участники ежегодных литературных Мустаевских чтений.'
      },
      {
        id: 'photo-580',
        src: `${RAW_BASE}/assets/gallery/24/photo-419.jpg`,
        originalPath: '../../assets/gallery/24/photo-419.jpg',
        caption: 'Мустай и Анвер',
        authorSlug: 'karim',
        authorName: 'Мустай Карим',
        categoryTag: 'Портреты',
        aspectHint: 'landscape',
        contextNote: 'Дружеский архивный кадр: Мустай Карим и писатель Анвер Гадеевич Бикчентаев.'
      },
      {
        id: 'photo-585',
        src: `${RAW_BASE}/assets/gallery/35/585.jpg`,
        originalPath: '../../assets/gallery/35/585.jpg',
        caption: 'Памятная доска',
        authorSlug: 'karim',
        authorName: 'Мустай Карим',
        categoryTag: 'Памятники и доски',
        aspectHint: 'landscape'
      },
      {
        id: 'photo-587',
        src: `${RAW_BASE}/assets/places/bikchentev/image018.jpg`,
        originalPath: '../../assets/places/bikchentev/image018.jpg',
        caption: 'Правление Союза писателей',
        authorSlug: 'karim',
        authorName: 'Мустай Карим',
        categoryTag: 'Архитектура и улицы',
        aspectHint: 'landscape',
        addressHint: 'Ул. Коммунистическая, 34',
        contextNote: 'Здание Правления Союза писателей Башкортостана, с которым десятилетиями была связана общественная работа поэта.'
      },
      {
        id: 'photo-588',
        src: `${RAW_BASE}/assets/gallery/35/588.jpg`,
        originalPath: '../../assets/gallery/35/588.jpg',
        caption: 'Проект памятника',
        authorSlug: 'karim',
        authorName: 'Мустай Карим',
        categoryTag: 'Памятники и доски',
        aspectHint: 'landscape'
      },
      {
        id: 'photo-590',
        src: `${RAW_BASE}/assets/gallery/35/590.jpg`,
        originalPath: '../../assets/gallery/35/590.jpg',
        caption: 'Энгельса 5',
        authorSlug: 'karim',
        authorName: 'Мустай Карим',
        categoryTag: 'Архитектура и улицы',
        aspectHint: 'landscape',
        addressHint: 'Ул. Энгельса, 5'
      }
    ]
  },
  {
    id: 'amantai',
    slug: 'gallery-amantai',
    title: 'Амантай Габдулла (Табулдин Габдулла Сахипгареевич)',
    subtitle: 'Архивные портреты с Мусой Джалилем и С. Агишем, детские книги 1928 года',
    years: '1907 – 1938',
    photoCount: 27,
    repoPagePath: 'site/pages/gallery-amantai/index.html',
    coverPhoto: `${RAW_BASE}/assets/gallery/amantai/360.jpg`,
    description:
      'Уникальная коллекция из 27 архивных материалов: фотографии башкирских писателей 1920–30-х годов, дом по ул. Ленина 2 и редкие сканы детских изданий 1928 года («Деревенские парни», «Маленьким друзьям», «Прилежный Валей»).',
    photos: [
      {
        id: 'photo-360',
        src: `${RAW_BASE}/assets/gallery/amantai/360.jpg`,
        originalPath: '../../assets/gallery/amantai/360.jpg',
        caption: 'Амантай',
        authorSlug: 'amantai',
        authorName: 'Габдулла Амантай',
        categoryTag: 'Портреты',
        aspectHint: 'portrait',
        yearOrEra: '1930-е годы',
        contextNote: 'Поэт, литературовед, фольклорист, один из зачинателей башкирской детской литературы.'
      },
      {
        id: 'photo-356',
        src: `${RAW_BASE}/assets/gallery/amantai/356.jpg`,
        originalPath: '../../assets/gallery/amantai/356.jpg',
        caption: 'Амантай и Муса Джалиль',
        authorSlug: 'amantai',
        authorName: 'Габдулла Амантай',
        categoryTag: 'Портреты',
        aspectHint: 'portrait',
        yearOrEra: 'Архивный снимок',
        hasFineDetails: true,
        contextNote: 'Редчайшая историческая фотография Габдуллы Амантая и поэта-героя Мусы Джалиля.'
      },
      {
        id: 'photo-357',
        src: `${RAW_BASE}/assets/gallery/amantai/357.jpg`,
        originalPath: '../../assets/gallery/amantai/357.jpg',
        caption: 'Амантай и Мухтар Баимов',
        authorSlug: 'amantai',
        authorName: 'Габдулла Амантай',
        categoryTag: 'Портреты',
        aspectHint: 'landscape'
      },
      {
        id: 'photo-358',
        src: `${RAW_BASE}/assets/gallery/amantai/358.jpg`,
        originalPath: '../../assets/gallery/amantai/358.jpg',
        caption: 'Амантай и С. Агиш',
        authorSlug: 'amantai',
        authorName: 'Габдулла Амантай',
        categoryTag: 'Портреты',
        aspectHint: 'portrait',
        contextNote: 'Габдулла Амантай и классик башкирской прозы Сагит Агиш.'
      },
      {
        id: 'photo-361',
        src: `${RAW_BASE}/assets/gallery/amantai/361.jpg`,
        originalPath: '../../assets/gallery/amantai/361.jpg',
        caption: 'Табличка - Улица Амантая',
        authorSlug: 'amantai',
        authorName: 'Габдулла Амантай',
        categoryTag: 'Памятники и доски',
        aspectHint: 'landscape',
        addressHint: 'Ул. Габдуллы Амантая (Кировский р-н Уфы)'
      },
      {
        id: 'photo-363',
        src: `${RAW_BASE}/assets/gallery/amantai/363.jpg`,
        originalPath: '../../assets/gallery/amantai/363.jpg',
        caption: 'Дом, где жил Габдулла Амантай(Ул. Ленина 2)',
        authorSlug: 'amantai',
        authorName: 'Габдулла Амантай',
        categoryTag: 'Архитектура и улицы',
        aspectHint: 'landscape',
        addressHint: 'Ул. Ленина, 2'
      },
      {
        id: 'photo-365',
        src: `${RAW_BASE}/assets/gallery/amantai/365.jpg`,
        originalPath: '../../assets/gallery/amantai/365.jpg',
        caption: 'Из книг 1928 года «Деревенские парни»',
        authorSlug: 'amantai',
        authorName: 'Габдулла Амантай',
        categoryTag: 'Книжные издания',
        aspectHint: 'portrait',
        yearOrEra: 'Издание 1928 г.',
        hasFineDetails: true,
        contextNote: 'Прижизненное иллюстрированное издание 1928 года. Откройте в лайтбоксе с «Лупой краеведа» для изучения графики.'
      },
      {
        id: 'photo-368',
        src: `${RAW_BASE}/assets/gallery/amantai/368.jpg`,
        originalPath: '../../assets/gallery/amantai/368.jpg',
        caption: 'Из книг 1928 года «Маленьким друзьям»',
        authorSlug: 'amantai',
        authorName: 'Габдулла Амантай',
        categoryTag: 'Книжные издания',
        aspectHint: 'portrait',
        yearOrEra: 'Издание 1928 г.',
        hasFineDetails: true
      },
      {
        id: 'photo-371',
        src: `${RAW_BASE}/assets/gallery/amantai/371.jpg`,
        originalPath: '../../assets/gallery/amantai/371.jpg',
        caption: 'Из книг 1928 года «Прилежный Валей»',
        authorSlug: 'amantai',
        authorName: 'Габдулла Амантай',
        categoryTag: 'Книжные издания',
        aspectHint: 'portrait',
        yearOrEra: 'Издание 1928 г.',
        hasFineDetails: true
      }
    ]
  }
];

export const LITERARY_LANDMARKS: LiteraryLandmark[] = [
  {
    id: 'landmark-aksakov-museum',
    paritySectionId: 'place-01',
    title: 'Мемориальный Дом-музей С.Т. Аксакова',
    writer: 'Аксаков Сергей Тимофеевич',
    writerSlug: 'aksakov',
    address: 'Ул. З. Биишевой (бывш. Благоева), 4 — на берегу р. Белой',
    era: 'Середина XVIII века (более 250 лет)',
    category: 'Дом-музей',
    mapX: 28,
    mapY: 74,
    image: `${RAW_BASE}/assets/places/aksakov/image003.jpg`,
    quote:
      '«Окна из столовой на улицу возвышались аршина на три над землей; парадное крыльцо имело более двадцати пяти ступенек, и с него была видна река Белая почти во всю ширину».',
    paragraphs: [
      'Мемориальный Дом-музей С.Т. Аксакова (филиал Национального музея РБ), представляющий собой образец деревянной архитектуры конца XVIII века, располагается на берегу р. Белой.',
      'Дом построен из уральской лиственницы, до настоящего времени сохранилось анфиладное построение комнат. Длина дома по ул. Благоева – 44 м, а по ул. Салавата – 22 метра. Здесь с 1795 по 1797 проживала семья писателя. Как «родовое гнездо» уфимский дом Аксаковых известен читателям по книге «Детские годы Багрова-внука».',
      'В 1991 году, объявленном по инициативе ЮНЕСКО «годом Аксакова», к 200-летию со дня рождения писателя музей распахнул свои двери для посетителей. Музейный фонд насчитывает 1583 предмета хранения.'
    ]
  },
  {
    id: 'landmark-aksakov-house',
    paritySectionId: 'place-01',
    title: 'Аксаковский народный дом (Театр оперы и балета)',
    writer: 'Аксаков Сергей Тимофеевич',
    writerSlug: 'aksakov',
    address: 'Угол ул. Ленина, 5 и ул. Пушкина',
    era: 'Заложен в 1909 г., арх. П. П. Рудавский, инт. И. Е. Бондаренко',
    category: 'Театр и Народный дом',
    mapX: 46,
    mapY: 58,
    image: `${RAW_BASE}/assets/places/aksakov/image011.jpg`,
    quote:
      '«Стиль его будет занятный: с одной стороны ренессанс, а с другой стороны - восточно-азиатский...» — С.Р. Минцлов, дневник «Дебри жизни»',
    paragraphs: [
      '30 ноября 1908 года Уфимская дума приняла решение построить в Уфе на добровольные пожертвования Аксаковский народный дом. По России было представлено 24 проекта; жюри отобрало проект губернского инженера Павла Павловича Рудавского.',
      'В здании соединились два стиля: со стороны улицы Ленина главенствует русский классицизм, а со стороны улицы Пушкина преобладает мусульманский, восточный стиль с удлиненными прорезями окон.',
      'В сквере у стен театра по ул. Пушкина 12 мая 1959 года открыт бронзовый бюст С.Т. Аксакова работы скульптора Т.П. Нечаевой.'
    ]
  },
  {
    id: 'landmark-aksakov-garden',
    paritySectionId: 'place-01',
    title: 'Сад имени С.Т. Аксакова и Голубиная слободка',
    writer: 'Аксаков Сергей Тимофеевич',
    writerSlug: 'aksakov',
    address: 'Ул. Пушкина (между ул. Цюрупы и Новомостовой)',
    era: 'Конец XVIII — XIX вв.',
    category: 'Парк и сквер',
    mapX: 54,
    mapY: 62,
    image: `${RAW_BASE}/assets/gallery/aksakov/311.jpg`,
    paragraphs: [
      'С.Т. Аксаков родился и прожил первые годы в доме родителей в Голубиной слободке. На территории бывшей усадьбы Аксаковых сегодня располагается уютный городской сад с озером, памятным знаком и кованой скульптурой «Аленький цветочек».'
    ]
  },
  {
    id: 'landmark-karim-monument',
    paritySectionId: 'place-09',
    title: 'Памятник Мустаю Кариму и улица Мустая Карима',
    writer: 'Мустай Карим',
    writerSlug: 'karim',
    address: 'Ул. Кирова / Ул. Мустая Карима / Ул. Энгельса, 5',
    era: 'XX – XXI вв.',
    category: 'Памятник',
    mapX: 49,
    mapY: 44,
    image: `${RAW_BASE}/assets/gallery/35/581.jpg`,
    paragraphs: [
      'Мемориальный маршрут народного поэта Башкортостана объединяет дом с мемориальной доской на ул. Энгельса, 5, Национальный молодежный театр им. Мустая Карима на ул. Ленина, 62, улицу Мустая Карима и величественный скульптурный ансамбль.'
    ]
  },
  {
    id: 'landmark-hudaiberdin-library',
    paritySectionId: 'place-18',
    title: 'Центральная городская детская библиотека им. Ш.А. Худайбердина',
    writer: 'Худайбердин Шагит Ахметович',
    writerSlug: 'hudaiberdin',
    address: 'Ул. Мингажева, 109 (ранее ул. Новомостовая, 20)',
    era: 'Основана в 1927–1928 гг., мемориальный уголок с 1996 г.',
    category: 'Библиотека',
    mapX: 68,
    mapY: 38,
    image: `${RAW_BASE}/assets/places/hudaiberdin/image021.jpg`,
    paragraphs: [
      'В 1961 году библиотека переехала в дом № 20 по улице Новомостовой, в котором в 1923–1924 годах жил Шагит Ахметович Худайбердин, и получила его имя. С 1990 года располагается в просторном помещении на ул. Мингажева, 109.',
      'В 1996 году к 100-летию писателя и государственного деятеля здесь открыт мемориальный уголок с уникальными фотографиями из семейного архива, переданными дочерью — балериной и профессором УГИИ Тамарой Шагитовной Худайбердиной.'
    ]
  },
  {
    id: 'landmark-shafikov-route',
    paritySectionId: 'place-19',
    title: 'Литературный маршрут Газима Шафикова (БГУ, Дом печати, ИИЯЛ)',
    writer: 'Шафиков Газим Газизович',
    writerSlug: 'shafikov',
    address: 'Ул. Заки Валиди, 32 (БГУ) — Пр. Октября (Дом печати) — Ул. К. Маркса',
    era: '1957 – 2009 гг.',
    category: 'Историческая улица',
    mapX: 36,
    mapY: 66,
    image: `${RAW_BASE}/assets/places/shafikov/karta2.jpg`,
    paragraphs: [
      'В 1957 году Газим Шафиков поступил в первый поток студентов открывшегося Башкирского государственного университета. Работал в редакции газеты «Ленинец» в Доме печати и на киностудии «Башкортостан».',
      'В 1970–1974 годах в Институте истории, языка и литературы перевел почти все башкирские народные эпосы («Урал-батыр», «Акбузат» и др.) на русский язык в блестящей поэтической форме.'
    ]
  }
];

export const WRITER_PROFILES: WriterProfile[] = [
  {
    id: 'writer-aksakov',
    slug: 'aksakov',
    name: 'Аксаков Сергей Тимофеевич',
    letter: 'А',
    years: '1791 – 1859',
    role: 'Русский писатель-классик, мемуарист, автор «Аленького цветочка»',
    portrait: `${RAW_BASE}/assets/persons/aksakov/image001.jpg`,
    ufaConnection: 'Родился в Уфе 20 сентября 1791 г. в Голубиной слободке; детские годы провёл в уфимском доме деда на берегу Белой и в имении Ново-Аксаково.',
    keyPlaces: ['Дом-музей С.Т. Аксакова (ул. Благоева, 4)', 'Аксаковский народный дом (ул. Ленина, 5)', 'Сад им. С.Т. Аксакова', 'Улица Аксакова'],
    gallerySlug: 'aksakov',
    galleryCount: 15,
    readingLinks: [
      { title: 'Аленький цветочек (сказка ключницы Пелагеи)', path: 'pages/reading-aksakov-flower/', type: 'prose' },
      { title: 'Детские годы Багрова-внука', path: 'pages/reading-aksakov-childhood/', type: 'prose' },
      { title: 'Рассказы о родной природе', path: 'pages/reading-aksakov-nature/', type: 'prose' }
    ],
    bioSections: [
      {
        heading: 'Детство в Уфе и истоки творчества (1791 – 1820)',
        paragraphs: [
          'Сергей Тимофеевич родился в старинной небогатой дворянской семье в Уфе 20 сентября 1791 года. Его детство прошло в городском доме родителей и в родном имении Ново-Аксаково, где он жил до 1820 года.',
          'Своим родоначальником Аксаковы считали знатного варяга Шимона Африкановича, племянника норвежского короля, приехавшего в 1027 году в Киев со своей дружиной. Потомок Шимона Иван Федорович Вельяминов, по прозвищу Осак, жил при великом князе Иване III. От него и пошел род Аксаковых.',
          'Именно природа Оренбургского края наполнила душу Сережи Аксакова, вошла в него такой огромной благодатью, пробудила его любознательность, его ранние увлечения, что это осталось на всю жизнь обостренным чувством родной земли, ее тихой прелести и красоты, и эти места дали потом писателю не только фон, но и все содержание для его будущих произведений.',
          'Женская половина дворни очень любила маленького болезненного Сережу, и как хранительница народно-поэтического творчества, знакомила мальчика с песнями, сказками, святочными играми. И «Аленький цветочек», который он записал спустя много лет по памяти из рассказов ключницы Пелагеи, — случайный обрывок того огромного мира народной поэзии.'
        ],
        inlineImages: [
          {
            id: 'persons-aksakov-001',
            src: `${RAW_BASE}/assets/persons/aksakov/image001.jpg`,
            caption: 'Портрет Сергея Тимофеевича Аксакова'
          }
        ]
      },
      {
        heading: 'Уфимские родственники С.Т. Аксакова — династия Соколовых',
        paragraphs: [
          'Семья Соколовых долгое время и не подозревала, что они связаны узами родства со своим знаменитым земляком, Сергеем Тимофеевичем Аксаковым. Соколовы обосновались в Башкирии в начале XIX века. Николай Иванович Соколов служил в городе Миассе Уфимской губернии заводским лекарем и породнился с родственницей семьи Аксаковых по женской линии.',
          'В 1930 году Михаила Яковлевича Соколова пригласили на преподавательскую работу в Башкирский педагогический институт (ныне УУНиТ / БашГУ). Его сын Виктор Михайлович продолжил династию врачей в Республиканской клинической больнице и БГМУ, а также собрал третью по величине в России коллекцию земских марок.',
          'А.В. Соколова говорит: «Мы – дальние родственники Аксаковых, но все равно чувствуем себя частицей этого великого рода».'
        ],
        inlineImages: [
          {
            id: 'persons-aksakov-002',
            src: `${RAW_BASE}/assets/persons/aksakov/image002.jpg`,
            caption: 'Семейная фотография уфимской ветви рода Соколовых-Аксаковых'
          },
          {
            id: 'persons-aksakov-003',
            src: `${RAW_BASE}/assets/persons/aksakov/image003.jpg`,
            caption: 'Потомки рода Соколовых в Уфе'
          }
        ]
      }
    ],
    bibliography: [
      {
        sectionTitle: 'Произведения С. Т. Аксакова (8 изданий)',
        items: [
          '1. Аксаков, С. Т. Собрание сочинений [Текст] : в 5 т. / С. Т. Аксаков. — М. : Правда, 1966. — 5 т. — (Огонёк).',
          '2. Аксаков, С. Т. Избранные сочинения [Текст] / С. Т. Аксаков. — М. ; Л. : Гослитиздат, 1949. — 596 с.',
          '3. Аксаков, С. Т. Избранные сочинения [Текст] / С. Т. Аксаков ; сост., вступ. ст. и примеч. В. А. Богданова. — М. : Современник, 1982. — 847 с.',
          '4. Аксаков, С. Т. Аленький цветочек [Текст] : сказка ключницы Пелагеи / С. Т. Аксаков ; худож. Е. Д. Петрова. — М. : Дрофа-Плюс, 2005. — 64 с. : ил. — (Русские классики – детям).',
          '5. Аксаков, С. Т. Детские годы Багрова-внука [Текст] / С. Т. Аксаков. — М. : АСТ : Астрель, 2009. — 349, [2] с. — (Внеклассное чтение).',
          '6. Аксаков, С. Т. Записки ружейного охотника Оренбургской губернии [Текст] / С. Т. Аксаков. — Уфа : Баш. кн. изд-во, 1984. — 416 с. — (Золотые родники).',
          '7. Аксаков, С. Т. Рассказы о родной природе [Текст] / С. Т. Аксаков ; худож. Г. Никольский. — М. : Дет. лит., 1981. — 143 с. : ил.',
          '8. Аксаков, С. Т. Семейная хроника [Текст] / С. Т. Аксаков. — Уфа : Баш. кн. изд-во, 1983. — 206 с. — (Золотые россыпи).'
        ]
      },
      {
        sectionTitle: 'Литература о С. Т. Аксакове (избранное из 19 позиций)',
        items: [
          '1. Анненкова, Е. И. Аксаковы [Текст] / Е. И. Анненкова. — СПб. : Наука, 1998. — 366 с.',
          '2. Бачурина, Н. Аксаковская тропа [Текст] / Н. Бачурина // Памятники Отечества. — 1997. — № 38. — С. 9-12.',
          '3. Буравцов, В. Аксаковский народный дом [Текст] / В. Буравцов // Уфа : страницы истории. — Уфа, 2006. — С. 290-292.',
          '6. Гудков, Г. Ф. С. Т. Аксаков : семья и окружение [Текст] / Г. Ф. Гудков, З. И. Гудкова. — Уфа : Баш. кн. изд-во, 1991. — 374, [5] с. : ил.',
          '9. Синенко, С. Г. Аксакова сад [Текст] / С. Г. Синенко // Уфа старая и новая. — Уфа, 2007. — С. 32-33.',
          '14. Узиков, Ю. А. Родина чудесного волшебника [Текст] / Ю. А. Узиков // Это с нами навсегда. — Уфа, 1983. — С. 10-12.',
          '16. Чванов, М. Аксаковские места в Башкирии [Текст] / М. Чванов. — Уфа : Баш. кн. изд-во, 1976. — 70 с.'
        ]
      }
    ]
  },
  {
    id: 'writer-karim',
    slug: 'karim',
    name: 'Мустай Карим (Каримов Мустафа Сафич)',
    letter: 'К',
    years: '1919 – 2005',
    role: 'Народный поэт Башкортостана, драматург, прозаик, Герой Социалистического Труда',
    portrait: `${RAW_BASE}/assets/gallery/35/581.jpg`,
    ufaConnection: 'Окончил Башкирский пединститут в Уфе, возглавлял Союз писателей БАССР, жил и творил на ул. Энгельса, 5 и ул. К. Маркса.',
    keyPlaces: ['Памятник Мустаю Кариму (ул. Кирова)', 'Национальный молодежный театр им. М. Карима', 'Улица Мустая Карима', 'Дом с мемориальной доской (ул. Энгельса, 5)'],
    gallerySlug: 'karim',
    galleryCount: 56,
    readingLinks: [
      { title: 'Стихотворения. Читает Мустай Карим (14 аудиозаписей)', path: 'pages/reading-karim-audio/', type: 'audio' },
      { title: 'Мустай Карим — детям («Радость нашего дома», «Таганок»)', path: 'pages/reading-karim-children/', type: 'prose' },
      { title: 'Улыбка. Восточная сказка', path: 'pages/reading-karim-smile/', type: 'prose' },
      { title: 'Стихотворения', path: 'pages/reading-karim-poems/', type: 'poetry' }
    ],
    bioSections: [
      {
        heading: 'Поэт, мудрец и голос Башкортостана',
        paragraphs: [
          'Жизнь и творчество народного поэта Башкортостана Мустая Карима неразрывно связаны со столицей республики — Уфой. Его повести «Радость нашего дома», «Таганок», «Долгое-долгое детство», трагедии «В ночь лунного затмения» и «Салават» вошли в золотой фонд многонациональной литературы.',
          'В путеводителе «Уфа литературная» собраны 56 архивных и современных фотографий памятных мест поэта, а в «Читальном зале» сохранены бесценные аудиозаписи стихотворений в авторском исполнении самого Мустая Карима.'
        ]
      }
    ],
    bibliography: [
      {
        sectionTitle: 'Избранные издания в путеводителе',
        items: [
          '1. Карим, М. Собрание сочинений : в 3 т. / Мустай Карим. — М. : Художественная литература, 1983.',
          '2. Карим, М. Долгое-долгое детство : повесть / Мустай Карим. — Уфа : Китап, 2004.',
          '3. Карим, М. Радость нашего дома. Таганок : повести и рассказы для детей / Мустай Карим. — Уфа : Китап.'
        ]
      }
    ]
  },
  {
    id: 'writer-amantai',
    slug: 'amantai',
    name: 'Амантай Габдулла (Табулдин Габдулла)',
    letter: 'А',
    years: '1907 – 1938',
    role: 'Башкирский поэт, фольклорист, автор первых советских башкирских книг для детей',
    portrait: `${RAW_BASE}/assets/gallery/amantai/360.jpg`,
    ufaConnection: 'Работал редактором в Уфе, жил в доме по ул. Ленина, 2; его имя носит улица в Кировском районе Уфы.',
    keyPlaces: ['Дом на ул. Ленина, 2', 'Улица Габдуллы Амантая', 'Институт национальной культуры'],
    gallerySlug: 'amantai',
    galleryCount: 27,
    readingLinks: [],
    bioSections: [
      {
        heading: 'Основоположник детской книги и исследователь фольклора',
        paragraphs: [
          'Габдулла Амантай оставил яркий след в литературной жизни Уфы 1920–1930-х годов. В 1928 году вышли его знаменитые иллюстрированные книжки для детей: «Деревенские парни», «Маленьким друзьям», «Прилежный Валей», сканы которых бережно сохранены в фотогалерее проекта.'
        ]
      }
    ],
    bibliography: []
  }
];

export const ALL_WRITERS_INDEX = [
  { name: 'Аксаков Сергей Тимофеевич', letter: 'А', years: '1791–1859', slug: 'aksakov', hasGallery: true, hasReading: true, hasPlaces: true },
  { name: 'Амантай Габдулла', letter: 'А', years: '1907–1938', slug: 'amantai', hasGallery: true, hasReading: false, hasPlaces: true },
  { name: 'Баязит Бикбай', letter: 'Б', years: '1909–1968', slug: 'bikbay', hasGallery: true, hasReading: false, hasPlaces: true },
  { name: 'Бикчентаев Анвер Гадеевич', letter: 'Б', years: '1913–1989', slug: 'bikchentaev', hasGallery: true, hasReading: true, hasPlaces: true },
  { name: 'Воловик Михаил Яковлевич', letter: 'В', years: '1917–1994', slug: 'volovik', hasGallery: true, hasReading: false, hasPlaces: true },
  { name: 'Гафури Мажит', letter: 'Г', years: '1880–1934', slug: 'gafuri', hasGallery: true, hasReading: false, hasPlaces: true },
  { name: 'Ибрагимов Галимджан Гирфанович', letter: 'И', years: '1887–1938', slug: 'ibragimov', hasGallery: true, hasReading: false, hasPlaces: true },
  { name: 'Карим Мустай', letter: 'К', years: '1919–2005', slug: 'karim', hasGallery: true, hasReading: true, hasPlaces: true },
  { name: 'Киекбаев Джалиль Гиниятович', letter: 'К', years: '1911–1968', slug: 'kiekbaev', hasGallery: true, hasReading: true, hasPlaces: true },
  { name: 'Киньябулатова Катиба Каримовна', letter: 'К', years: '1920–2012', slug: 'kinyabulatova', hasGallery: true, hasReading: false, hasPlaces: true },
  { name: 'Короленко Владимир Галактионович', letter: 'К', years: '1853–1921', slug: 'korolenko', hasGallery: true, hasReading: false, hasPlaces: true },
  { name: 'Рахимкулов Мурат Галимович', letter: 'Р', years: '1925–2015', slug: 'rahimkulov', hasGallery: true, hasReading: false, hasPlaces: true },
  { name: 'Сотников Иван Владимирович', letter: 'С', years: '1913–2004', slug: 'sotnikov', hasGallery: true, hasReading: false, hasPlaces: true },
  { name: 'Тухват Янаби', letter: 'Т', years: '1894–1938', slug: 'yanabi', hasGallery: true, hasReading: true, hasPlaces: true },
  { name: 'Узиков Юрий Андреевич', letter: 'У', years: '1931–2010', slug: 'uzikov', hasGallery: true, hasReading: false, hasPlaces: true },
  { name: 'Худайбердин Шагит Ахметович', letter: 'Х', years: '1896–1924', slug: 'hudaiberdin', hasGallery: true, hasReading: false, hasPlaces: true },
  { name: 'Шафиков Газим Газизович', letter: 'Ш', years: '1939–2009', slug: 'shafikov', hasGallery: true, hasReading: true, hasPlaces: true }
];

export const KARIM_AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'track-01',
    number: '01',
    title: '01 Все просто..',
    author: 'Читает Мустай Карим',
    src: `${RAW_BASE}/assets/audio/karim/01.ogg`,
    originalPath: '../../assets/audio/karim/01.ogg',
    poemExcerpt: 'Авторское чтение из золотого аудиофонда «Уфы литературной» (формат OGG Vorbis, проверен в реестре assets.csv).'
  },
  {
    id: 'track-02',
    number: '02',
    title: '02 Цветы на камне',
    author: 'Читает Мустай Карим',
    src: `${RAW_BASE}/assets/audio/karim/02.ogg`,
    originalPath: '../../assets/audio/karim/02.ogg',
    poemExcerpt: 'Лирическое размышление о стойкости жизни, памяти и родной уральской земле.'
  },
  {
    id: 'track-04',
    number: '04',
    title: '04 Эту песню мать мне пела',
    author: 'Читает Мустай Карим',
    src: `${RAW_BASE}/assets/audio/karim/04.ogg`,
    originalPath: '../../assets/audio/karim/04.ogg',
    poemExcerpt: 'Проникновенное стихотворение о материнской колыбельной и истоках родного слова.'
  },
  {
    id: 'track-06',
    number: '06',
    title: '06 Берега остаются',
    author: 'Читает Мустай Карим',
    src: `${RAW_BASE}/assets/audio/karim/06.ogg`,
    originalPath: '../../assets/audio/karim/06.ogg',
    poemExcerpt: 'Воды текут и меняются, но берега родной Белой и память поколений остаются незыблемыми.'
  },
  {
    id: 'track-09',
    number: '09',
    title: '09 Горы',
    author: 'Читает Мустай Карим',
    src: `${RAW_BASE}/assets/audio/karim/09.ogg`,
    originalPath: '../../assets/audio/karim/09.ogg',
    poemExcerpt: 'Философская лирика народного поэта Башкортостана в живом авторском исполнении.'
  },
  {
    id: 'track-10',
    number: '10',
    title: '10 Я белый лист кладу перед собой',
    author: 'Читает Мустай Карим',
    src: `${RAW_BASE}/assets/audio/karim/10.ogg`,
    originalPath: '../../assets/audio/karim/10.ogg',
    poemExcerpt: 'О высокой ответственности поэта перед чистым листом бумаги и своим читателем.'
  },
  {
    id: 'track-12',
    number: '12',
    title: '12 Ночами разговаривают реки',
    author: 'Читает Мустай Карим',
    src: `${RAW_BASE}/assets/audio/karim/12.ogg`,
    originalPath: '../../assets/audio/karim/12.ogg',
    poemExcerpt: 'Поэтический диалог рек Башкортостана — Агидели, Караидели и Дёмы.'
  }
];
