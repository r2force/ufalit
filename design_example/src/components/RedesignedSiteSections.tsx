import React, { useState, useRef } from 'react';
import {
  LITERARY_LANDMARKS,
  WRITER_PROFILES,
  ALL_WRITERS_INDEX,
  KARIM_AUDIO_TRACKS,
  LiteraryLandmark,
  AudioTrack
} from '../data/ufalitData';
import {
  MapPin,
  BookOpen,
  Users,
  Camera,
  Headphones,
  Award,
  Sparkles,
  Search,
  Play,
  Pause,
  Volume2,
  ExternalLink,
  CheckCircle2,
  Compass,
  FileText,
  ChevronDown,
  ChevronUp,
  Type
} from 'lucide-react';

interface Props {
  activeSubTab: 'home-map' | 'personalities' | 'reading-audio';
  onNavigateSubTab: (tab: 'home-map' | 'gallery' | 'personalities' | 'reading-audio') => void;
}

export const RedesignedSiteSections: React.FC<Props> = ({ activeSubTab, onNavigateSubTab }) => {
  // Interactive Map state
  const [selectedLandmark, setSelectedLandmark] = useState<LiteraryLandmark>(LITERARY_LANDMARKS[0]);

  // Personalities state
  const [selectedLetter, setSelectedLetter] = useState<string>('Все');
  const [writerSearch, setWriterSearch] = useState<string>('');
  const [activeWriterSlug, setActiveWriterSlug] = useState<string>('aksakov');
  const [biblioOpen, setBiblioOpen] = useState<boolean>(true);
  const [biblioSearch, setBiblioSearch] = useState<string>('');

  // Reading & Audio state
  const [currentTrack, setCurrentTrack] = useState<AudioTrack>(KARIM_AUDIO_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [readerTheme, setReaderTheme] = useState<'paper' | 'sepia' | 'night'>('paper');
  const [fontScale, setFontScale] = useState<'base' | 'lg' | 'xl'>('base');
  const audioRef = useRef<HTMLAudioElement>(null);

  const letters = ['Все', 'А', 'Б', 'В', 'Г', 'И', 'К', 'Р', 'С', 'Т', 'У', 'Х', 'Ш'];

  const filteredWritersList = ALL_WRITERS_INDEX.filter((w) => {
    const matchLetter = selectedLetter === 'Все' || w.letter === selectedLetter;
    const matchQ = !writerSearch.trim() || w.name.toLowerCase().includes(writerSearch.trim().toLowerCase());
    return matchLetter && matchQ;
  });

  const currentWriter =
    WRITER_PROFILES.find((w) => w.slug === activeWriterSlug) || WRITER_PROFILES[0];

  const handlePlayTrack = (track: AudioTrack) => {
    if (currentTrack.id === track.id && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.play().catch(() => {});
        }
      }, 60);
    }
  };

  if (activeSubTab === 'home-map') {
    return (
      <div className="space-y-10">
        {/* REDESIGNED HERO SECTION WITH NAZAR NAJMI EPIGRAPH */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#142829] via-[#173B3D] to-[#1D4648] text-white shadow-2xl border border-[#245D60]">
          {/* Decorative Wrought-Iron Garden Fence Lace Pattern */}
          <div className="absolute inset-0 opacity-15 ufa-lace-border pointer-events-none" />

          <div className="relative z-10 p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B58347]/20 border border-[#B58347]/40 text-[#F3D9B1] text-xs font-medium">
                <Compass className="w-3.5 h-3.5" />
                <span>Электронный информационно-краеведческий путеводитель · 20 библиотек МБУ ЦСДБ г. Уфы</span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.03] text-[#FCFAF5]">
                Уфа литературная
              </h1>

              <p className="text-lg sm:text-xl text-[#D5E3DF] font-reading max-w-2xl leading-relaxed">
                Литературная карта столицы Республики Башкортостан: родовые усадьбы, мемориальные дома-музеи, архивные фотографии, живые голоса поэтов и произведения XIX–XX веков.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigateSubTab('gallery')}
                  className="px-5 py-3 rounded-xl bg-[#8E2D36] hover:bg-[#A43540] text-white text-sm font-medium flex items-center gap-2 shadow-lg transition"
                >
                  <Camera className="w-4 h-4" />
                  <span>Открыть музейную фотогалерею</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateSubTab('personalities')}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-medium flex items-center gap-2 transition"
                >
                  <Users className="w-4 h-4" />
                  <span>Персоналии и библиографии (А–Я)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateSubTab('reading-audio')}
                  className="px-4 py-3 rounded-xl bg-[#B58347]/25 hover:bg-[#B58347]/35 text-[#F3D9B1] border border-[#B58347]/40 text-sm font-medium flex items-center gap-2 transition"
                >
                  <Headphones className="w-4 h-4" />
                  <span>Слушать голос Мустая Карима</span>
                </button>
              </div>
            </div>

            {/* Epigraph Card: Nazar Najmi "ПЕСНЯ РОДНОМУ ГОРОДУ" */}
            <div className="lg:col-span-5">
              <blockquote className="relative rounded-2xl bg-[#0E2021]/80 backdrop-blur-md p-6 sm:p-7 border border-[#B58347]/40 shadow-xl">
                <div className="flex items-center justify-between text-xs text-[#F3D9B1] font-mono-code mb-3 pb-2 border-b border-white/10">
                  <span>ПЕСНЯ РОДНОМУ ГОРОДУ</span>
                  <span>Эпиграф главной страницы</span>
                </div>
                <p className="font-reading italic text-base sm:text-lg text-[#F4EFE4] leading-relaxed">
                  Мне здесь любая улица знакома,
                  <br />Я знаю каждый дом и поворот,
                  <br />Мосты, причалы, заводи, паромы
                  <br />И где какое дерево растет...
                  <br />Вокруг садов чугунные ограды,
                  <br />Как кружева, искусством тешат взор,
                  <br />И каждому бутону сердце радо,
                  <br />И восхищает каждый твой узор.
                </p>
                <footer className="mt-4 flex items-center justify-between">
                  <cite className="not-italic font-display text-xl font-semibold text-[#F3D9B1]">
                    — Назар Наджми
                  </cite>
                  <span className="text-[11px] text-white/50">Мотив «чугунного кружева Уфы»</span>
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* INTERACTIVE LITERARY MAP OF UFA (Replaces static text list with visual guide + full places data) */}
        <section className="rounded-3xl bg-[#FCFAF5] border border-[#D6CFC1] p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5DFD3] pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono-code uppercase tracking-wider text-[#8E2D36]">
                <MapPin className="w-3.5 h-3.5" />
                <span>Интерактивный слой поверх раздела pages/places/index.html</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#142829] mt-1">
                Литературная карта Уфимского полуострова
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#4A5D5E] max-w-md">
              Нажмите на любую литературную точку на карте Уфы (между реками Белой и Уфой), чтобы открыть подлинный материал и архивный снимок из <code className="font-mono-code text-[#8E2D36]">site/pages/places/</code>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Stylized Interactive SVG Map of Ufa Peninsula */}
            <div className="lg:col-span-7 relative rounded-2xl bg-[#E8EFEA] border border-[#C8D8CB] overflow-hidden min-h-[380px] sm:min-h-[430px] flex flex-col justify-between p-4">
              {/* Topographic & River SVG Background representing Ufa Peninsula & Agidel (Belaya) bend */}
              <svg
                viewBox="0 0 600 420"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                aria-hidden="true"
              >
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="#173B3D"
                      strokeWidth="0.6"
                      strokeOpacity="0.1"
                    />
                  </pattern>
                </defs>
                <rect width="600" height="420" fill="url(#grid)" />
                {/* Historic Street Grid of Old Ufa (Lenina, Pushkina, Aksakova, Zaki Validi) */}
                <g stroke="#8FA89B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.55">
                  <line x1="110" y1="260" x2="480" y2="260" />
                  <line x1="130" y1="220" x2="470" y2="220" />
                  <line x1="160" y1="175" x2="460" y2="175" />
                  <line x1="275" y1="90" x2="275" y2="330" />
                  <line x1="330" y1="100" x2="330" y2="320" />
                  <line x1="210" y1="130" x2="210" y2="330" />
                </g>
                {/* River Belaya (Agidel) Great Southern & Western Bend */}
                <path
                  d="M 20,90 Q 45,240 120,320 Q 220,385 410,360 Q 520,340 585,270"
                  fill="none"
                  stroke="#9CC3C9"
                  strokeWidth="26"
                  strokeLinecap="round"
                />
                <path
                  d="M 20,90 Q 45,240 120,320 Q 220,385 410,360 Q 520,340 585,270"
                  fill="none"
                  stroke="#6BA3AD"
                  strokeWidth="3"
                  strokeDasharray="8 6"
                />
                {/* Labels on Map */}
                <text x="195" y="366" fill="#173B3D" fontSize="12" fontWeight="600" opacity="0.75">
                  р. Белая (Агидель) — косогор у дома Аксаковых
                </text>
                <text x="155" y="253" fill="#245D60" fontSize="10" opacity="0.7">
                  ул. Пушкина / Голубиная слободка
                </text>
                <text x="282" y="130" fill="#245D60" fontSize="10" opacity="0.7">
                  ул. Ленина
                </text>
              </svg>

              {/* Map Top Legend */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-[#FCFAF5]/90 backdrop-blur-sm border border-[#D6CFC1] text-xs font-medium text-[#142829] shadow-sm">
                  📍 Исторический центр Уфы · 6 ключевых литературных узлов
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#173B3D]/90 text-white font-mono-code text-[11px]">
                  #{selectedLandmark.paritySectionId}
                </span>
              </div>

              {/* Interactive Pins */}
              <div className="relative z-10 flex-1 my-4">
                {LITERARY_LANDMARKS.map((lm, index) => {
                  const isActive = lm.id === selectedLandmark.id;
                  return (
                    <button
                      key={lm.id}
                      type="button"
                      onClick={() => setSelectedLandmark(lm)}
                      style={{ left: `${lm.mapX}%`, top: `${lm.mapY}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-200 shadow-lg ${
                        isActive
                          ? 'bg-[#8E2D36] text-white scale-110 z-30 ring-4 ring-[#8E2D36]/30'
                          : 'bg-[#FCFAF5] text-[#142829] hover:bg-[#173B3D] hover:text-white border border-[#173B3D]/30 z-20'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono-code font-bold ${
                          isActive ? 'bg-white text-[#8E2D36]' : 'bg-[#173B3D] text-white'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="text-xs font-medium whitespace-nowrap hidden sm:inline">
                        {lm.title.split('(')[0].trim().slice(0, 26)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Map Bottom Quick Selector Strip */}
              <div className="relative z-10 flex flex-wrap gap-1.5 bg-[#FCFAF5]/90 backdrop-blur-sm p-2 rounded-xl border border-[#D6CFC1]">
                {LITERARY_LANDMARKS.map((lm, idx) => (
                  <button
                    key={lm.id}
                    type="button"
                    onClick={() => setSelectedLandmark(lm)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                      selectedLandmark.id === lm.id
                        ? 'bg-[#173B3D] text-white'
                        : 'text-[#374B4C] hover:bg-[#EFEAE0]'
                    }`}
                  >
                    {idx + 1}. {lm.writer.split(' ')[0]} — {lm.category}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Landmark Detail Card (with real image & text from site/pages/places/) */}
            <div className="lg:col-span-5 rounded-2xl bg-[#F6F3EC] border border-[#D6CFC1] p-5 sm:p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#8E2D36]/15 text-[#8E2D36] text-xs font-medium">
                    {selectedLandmark.category}
                  </span>
                  <span className="font-mono-code text-xs text-[#4A5D5E]">
                    Раздел: #{selectedLandmark.paritySectionId}
                  </span>
                </div>

                <div className="flex gap-4 items-start">
                  <img
                    src={selectedLandmark.image}
                    alt={selectedLandmark.title}
                    className="w-28 h-24 sm:w-32 sm:h-28 rounded-xl object-cover border border-[#D6CFC1] bg-[#EFEAE0] shrink-0 shadow-sm"
                  />
                  <div>
                    <p className="text-xs font-medium text-[#245D60]">{selectedLandmark.writer}</p>
                    <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#142829] leading-snug mt-0.5">
                      {selectedLandmark.title}
                    </h3>
                    <p className="text-xs text-[#5C6E6F] mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8E2D36] shrink-0" />
                      <span>{selectedLandmark.address}</span>
                    </p>
                  </div>
                </div>

                {selectedLandmark.quote && (
                  <blockquote className="p-3.5 rounded-xl bg-[#FCFAF5] border-l-3 border-[#8E2D36] font-reading italic text-xs sm:text-sm text-[#2C3E3F]">
                    {selectedLandmark.quote}
                  </blockquote>
                )}

                <div className="space-y-2.5 text-xs sm:text-sm text-[#1E3334] font-reading leading-relaxed max-h-[210px] overflow-y-auto custom-scrollbar pr-1">
                  {selectedLandmark.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#D6CFC1] flex items-center justify-between text-xs">
                <span className="text-[#5C6E6F]">{selectedLandmark.era}</span>
                <button
                  type="button"
                  onClick={() => onNavigateSubTab('gallery')}
                  className="text-[#8E2D36] font-medium hover:underline flex items-center gap-1"
                >
                  <span>Смотреть в фотогалерее</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* BENTO NAVIGATION GRID & EDITORIAL "О ПРОЕКТЕ" FROM site/index.html */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Cols: Complete Unabridged Text "О проекте" from site/index.html */}
          <article className="lg:col-span-7 rounded-3xl bg-[#FCFAF5] border border-[#D6CFC1] p-6 sm:p-9 shadow-sm space-y-4 font-reading text-[#142829] leading-relaxed">
            <div className="flex items-center justify-between border-b border-[#E5DFD3] pb-4 mb-2 font-sans-ui">
              <div>
                <span className="text-xs font-mono-code uppercase text-[#245D60]">
                  Полный текст главной страницы (site/index.html)
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#142829]">
                  О проекте «Уфа литературная»
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono-code">
                100% Parity
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#F4EFE4] border border-[#E5DFD3] font-sans-ui text-xs sm:text-sm">
              <div>
                <span className="text-[#5C6E6F] block text-xs">Название проекта:</span>
                <strong className="text-[#142829]">
                  «Уфа литературная»: литературная карта столицы Республики Башкортостан
                </strong>
              </div>
              <div>
                <span className="text-[#5C6E6F] block text-xs">Форма издания:</span>
                <strong className="text-[#142829]">
                  Электронный информационно-краеведческий путеводитель
                </strong>
              </div>
            </div>

            <p>
              Город Уфа имеет богатое историко-литературное прошлое. Здесь жили и творили известнейшие писатели XIX–XX вв., имена которых заняли достойное место на литературной карте столицы Республики Башкортостан.
            </p>
            <p>
              Данный информационный ресурс способствует появлению интереса к реальному и виртуальному культурологическому туризму, приобщая к духовно-нравственным ценностям широкий круг пользователей с различным уровнем образования и разных возрастных категорий.
            </p>
            <p>
              В создании литературной карты Уфы приняли участие <strong>20 библиотек МБУ ЦСДБ ГО г. Уфа</strong>, одним из критериев отбора имен для литературной карты являлось наличие в творчестве писателей произведений для детей. В работе над путеводителем были использованы самые современные компьютерные технологии, что значительно усиливает познавательный эффект проекта.
            </p>
            <p>
              Проект «Уфа литературная» предоставляет богатый материал для экскурсий по столице Республики Башкортостан, позволяет получить систематизированную информацию о достопримечательностях города, связанных с творчеством писателей, оказавших влияние на развитие мировой литературы XIX–XX веков.
            </p>
          </article>

          {/* Right 5 Cols: Bento Grid of All 9 Sections of the Guide */}
          <div className="lg:col-span-5 space-y-3.5">
            <h3 className="font-display text-2xl font-semibold text-[#142829] px-1">
              Разделы путеводителя (Bento-навигация)
            </h3>
            {[
              {
                title: 'Персоналии (19 писателей)',
                desc: 'Биографии литераторов, чья жизнь была тесно связана с Уфой, родословные и полная библиография.',
                path: 'pages/personalities/index.html',
                icon: Users,
                action: () => onNavigateSubTab('personalities'),
                badge: 'А–Я Указатель'
              },
              {
                title: 'Памятные места Уфы',
                desc: 'Дома-музеи, памятники, мемориальные доски, улицы, названные в честь литераторов, и маршрутные карты.',
                path: 'pages/places/index.html',
                icon: MapPin,
                action: () => onNavigateSubTab('home-map'),
                badge: '19 локаций'
              },
              {
                title: 'Фотогалерея (33+ подборки)',
                desc: 'Сотни архивных снимков, портретов, старинных открыток и сканов прижизненных изданий.',
                path: 'pages/gallery/index.html',
                icon: Camera,
                action: () => onNavigateSubTab('gallery'),
                badge: '4 режима + Лупа'
              },
              {
                title: 'Читальный зал и Голос поэта',
                desc: 'Полнотекстовые сказки, рассказы, стихи, басни и 23 подлинные аудиозаписи (читает Мустай Карим).',
                path: 'pages/reading/index.html',
                icon: BookOpen,
                action: () => onNavigateSubTab('reading-audio'),
                badge: 'Тексты + Аудио'
              },
              {
                title: 'Конкурсы, премии, фонды и праздники',
                desc: 'Международный Аксаковский праздник, Аксаковские балы, медали, стипендии и литературные фонды.',
                path: 'pages/awards/index.html',
                icon: Award,
                action: () => onNavigateSubTab('personalities'),
                badge: 'Культурная жизнь'
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={item.action}
                  className="group p-4 sm:p-5 rounded-2xl bg-[#FCFAF5] border border-[#D6CFC1] hover:border-[#173B3D] shadow-sm hover:shadow-md transition cursor-pointer flex items-start gap-4"
                >
                  <div className="p-3 rounded-xl bg-[#173B3D] text-[#F3D9B1] group-hover:bg-[#8E2D36] group-hover:text-white transition shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-display text-xl font-semibold text-[#142829] group-hover:text-[#8E2D36] transition">
                        {item.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-[#EFEAE0] text-[#245D60] font-mono-code text-[10px] shrink-0">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#4A5D5E] mt-1 leading-relaxed">{item.desc}</p>
                    <div className="mt-2 font-mono-code text-[10px] text-[#8E2D36]">
                      {item.path} →
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  if (activeSubTab === 'personalities') {
    return (
      <div className="space-y-6">
        {/* Top Explanation of Personalities Redesign */}
        <div className="rounded-2xl bg-[#173B3D] text-white p-6 sm:p-7 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono-code text-[#F3D9B1]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Реформа раздела site/pages/personalities/index.html</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold">
              Персоналии: Алфавитный указатель А–Я, перекрёстные связи и умная библиография
            </h2>
            <p className="text-xs sm:text-sm text-[#D0E0DC] leading-relaxed">
              Сейчас в репозитории страница <code className="font-mono-code bg-black/25 px-1.5 py-0.5 rounded">personalities/index.html</code> весит более 500 КБ (19 гигантских <code className="font-mono-code bg-black/25 px-1.5 py-0.5 rounded">&lt;details&gt;</code> подряд с сотнями строк библиографии без поиска и связей с галереей). В новом дизайне скрипт автоматически строит липкий алфавитный бар, карточки-паспорта и сворачиваемый фильтр библиографии, <strong>не удаляя ни одной строки из DOM</strong>.
            </p>
          </div>
        </div>

        {/* Sticky A-Я Alphabet Bar + Search */}
        <div className="sticky top-16 z-30 rounded-2xl bg-[#FCFAF5]/95 backdrop-blur-md border border-[#D6CFC1] p-4 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-[#5C6E6F] mr-1">Алфавитный указатель:</span>
            {letters.map((letter) => (
              <button
                key={letter}
                type="button"
                onClick={() => setSelectedLetter(letter)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedLetter === letter
                    ? 'bg-[#8E2D36] text-white shadow-sm'
                    : 'bg-[#EFEAE0] text-[#142829] hover:bg-[#E0D8C8]'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-[#5C6E6F] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={writerSearch}
              onChange={(e) => setWriterSearch(e.target.value)}
              placeholder="Быстрый фильтр по фамилии..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#F6F3EC] border border-[#D6CFC1] text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 4 Cols: Directory of Writers */}
          <div className="lg:col-span-4 rounded-2xl bg-[#FCFAF5] border border-[#D6CFC1] p-4 space-y-2.5 max-h-[720px] overflow-y-auto custom-scrollbar">
            <div className="text-xs font-mono-code text-[#5C6E6F] px-1 pb-1 border-b border-[#EFEAE0]">
              Найдено литераторов: {filteredWritersList.length}
            </div>
            {filteredWritersList.map((w) => {
              const isDetailed = ['aksakov', 'karim', 'amantai'].includes(w.slug);
              const isSelected = activeWriterSlug === w.slug;
              return (
                <button
                  key={w.slug}
                  type="button"
                  onClick={() => {
                    if (isDetailed) setActiveWriterSlug(w.slug);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-[#173B3D] text-white border-[#173B3D] shadow'
                      : 'bg-[#F6F3EC] text-[#142829] border-[#E5DFD3] hover:border-[#245D60]'
                  }`}
                >
                  <div>
                    <div className="font-display text-base font-semibold leading-snug">
                      {w.name}
                    </div>
                    <div
                      className={`text-[11px] font-mono-code mt-0.5 ${
                        isSelected ? 'text-[#F3D9B1]' : 'text-[#5C6E6F]'
                      }`}
                    >
                      {w.years}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {isDetailed ? (
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          isSelected ? 'bg-[#8E2D36] text-white' : 'bg-[#EFEAE0] text-[#8E2D36]'
                        }`}
                      >
                        Демо-профиль
                      </span>
                    ) : (
                      <span className="text-[10px] opacity-60">В реестре</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right 8 Cols: Editorial Longread & Cross-links for Selected Writer */}
          <article className="lg:col-span-8 rounded-2xl bg-[#FCFAF5] border border-[#D6CFC1] p-6 sm:p-8 shadow-sm space-y-6">
            {/* Writer Passport Header */}
            <div className="flex flex-col sm:flex-row gap-6 items-start pb-6 border-b border-[#E5DFD3]">
              <img
                src={currentWriter.portrait}
                alt={currentWriter.name}
                className="w-28 h-36 sm:w-32 sm:h-40 rounded-xl object-cover border-2 border-[#D6CFC1] shadow-md shrink-0 bg-[#EFEAE0]"
              />
              <div className="space-y-2.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#8E2D36] text-white font-mono-code text-xs">
                    {currentWriter.years}
                  </span>
                  <span className="text-xs text-[#245D60] font-medium">{currentWriter.role}</span>
                </div>
                <h3 className="font-display text-3xl sm:text-4xl font-semibold text-[#142829]">
                  {currentWriter.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#374B4C] leading-relaxed">
                  <strong>Связь с Уфой:</strong> {currentWriter.ufaConnection}
                </p>

                {/* Cross-links required by DESIGN.md ("связи писателя, места, фото и произведений") */}
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigateSubTab('gallery')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#173B3D] text-white text-xs font-medium hover:bg-[#245D60] transition"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Фотоархив ({currentWriter.galleryCount} фото)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateSubTab('home-map')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EFEAE0] text-[#142829] text-xs font-medium hover:bg-[#E2DBD0] transition"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#8E2D36]" />
                    <span>Памятные места ({currentWriter.keyPlaces.length})</span>
                  </button>
                  {currentWriter.readingLinks.length > 0 && (
                    <button
                      type="button"
                      onClick={() => onNavigateSubTab('reading-audio')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B58347]/20 text-[#6E4B1F] text-xs font-medium hover:bg-[#B58347]/30 transition"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Читальный зал ({currentWriter.readingLinks.length})</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Bio Longread Sections with Margin Figures */}
            <div className="space-y-8">
              {currentWriter.bioSections.map((sec, idx) => (
                <section key={idx} className="space-y-4">
                  <h4 className="font-display text-2xl font-semibold text-[#173B3D] border-l-3 border-[#8E2D36] pl-3">
                    {sec.heading}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    <div
                      className={`${
                        sec.inlineImages && sec.inlineImages.length > 0
                          ? 'md:col-span-8'
                          : 'md:col-span-12'
                      } space-y-3.5 font-reading text-sm sm:text-base text-[#1E3334] leading-[1.75]`}
                    >
                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>

                    {/* Margin Figures (replaces awkward inline float:left images) */}
                    {sec.inlineImages && sec.inlineImages.length > 0 && (
                      <div className="md:col-span-4 space-y-3">
                        {sec.inlineImages.map((img) => (
                          <figure
                            key={img.id}
                            className="p-2.5 rounded-xl bg-[#F6F3EC] border border-[#D6CFC1] shadow-sm"
                          >
                            <img
                              src={img.src}
                              alt={img.caption}
                              className="w-full h-auto rounded-lg object-contain max-h-48 mx-auto"
                            />
                            <figcaption className="mt-2 text-[11px] text-[#4A5D5E] text-center leading-snug">
                              {img.caption}
                            </figcaption>
                          </figure>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              ))}
            </div>

            {/* Smart Bibliography Drawer with Instant Filter (Preserves 100% DOM nodes for parity) */}
            {currentWriter.bibliography.length > 0 && (
              <div className="rounded-2xl bg-[#F6F3EC] border border-[#D6CFC1] overflow-hidden">
                <div className="p-4 bg-[#EFEAE0] flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setBiblioOpen((v) => !v)}
                    className="flex items-center gap-2 font-display text-xl font-semibold text-[#142829]"
                  >
                    <FileText className="w-4 h-4 text-[#8E2D36]" />
                    <span>Библиографический указатель (сохранён 1:1 в DOM)</span>
                    {biblioOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  <div className="relative min-w-[220px]">
                    <Search className="w-3.5 h-3.5 text-[#5C6E6F] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={biblioSearch}
                      onChange={(e) => setBiblioSearch(e.target.value)}
                      placeholder="Фильтр по году, книге или автору..."
                      className="w-full pl-8 pr-3 py-1 rounded-lg bg-white border border-[#D6CFC1] text-xs"
                    />
                  </div>
                </div>

                {biblioOpen && (
                  <div className="p-5 space-y-5 max-h-[340px] overflow-y-auto custom-scrollbar">
                    {currentWriter.bibliography.map((bSec, i) => (
                      <div key={i} className="space-y-2">
                        <h5 className="font-sans-ui text-xs font-semibold uppercase tracking-wider text-[#8E2D36]">
                          {bSec.sectionTitle}
                        </h5>
                        <div className="space-y-1.5">
                          {bSec.items
                            .filter(
                              (item) =>
                                !biblioSearch.trim() ||
                                item.toLowerCase().includes(biblioSearch.trim().toLowerCase())
                            )
                            .map((item, j) => (
                              <p
                                key={j}
                                className="text-xs sm:text-sm font-reading text-[#233738] p-2 rounded-lg bg-[#FCFAF5] border border-[#E5DFD3]"
                              >
                                {item}
                              </p>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </article>
        </div>
      </div>
    );
  }

  // SUBTAB 3: READING ROOM & ARCHIVAL AUDIO PLAYER ("Читальный зал и Голос Поэта")
  return (
    <div className="space-y-8">
      {/* Archival Studio Audio Player for Mustai Karim's Real Voice Recordings */}
      <section className="rounded-3xl bg-gradient-to-br from-[#142021] via-[#173234] to-[#1F4447] text-white p-6 sm:p-8 shadow-2xl border border-[#245D60]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left 5 Cols: Active Vinyl / Tape Deck Card */}
          <div className="lg:col-span-5 rounded-2xl bg-black/35 backdrop-blur-md p-6 border border-white/10 space-y-5">
            <div className="flex items-center justify-between text-xs font-mono-code text-[#F3D9B1]">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-[#B58347]" />
                <span>Аудиофонд: reading-karim-audio</span>
              </span>
              <span>#{currentTrack.id}</span>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-tr from-[#0B1213] via-[#263839] to-[#0B1213] border-4 border-[#B58347]/60 flex items-center justify-center shrink-0 shadow-xl ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '9s' }}
              >
                <div className="w-7 h-7 rounded-full bg-[#8E2D36] border-2 border-[#F3D9B1] flex items-center justify-center text-[9px] font-mono-code">
                  {currentTrack.number}
                </div>
              </div>

              <div>
                <span className="text-xs text-[#A8D5BA] font-medium">{currentTrack.author}</span>
                <h3 className="font-display text-2xl font-semibold text-white mt-0.5">
                  {currentTrack.title}
                </h3>
                <p className="text-xs text-white/70 mt-1 leading-relaxed">
                  {currentTrack.poemExcerpt}
                </p>
              </div>
            </div>

            {/* Native HTML5 <audio> preserved for progressive enhancement & parity */}
            <div className="pt-2">
              <audio
                ref={audioRef}
                controls
                preload="none"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-10 rounded-lg"
              >
                <source src={currentTrack.src} type="audio/ogg" />
              </audio>
              <div className="mt-2 flex items-center justify-between text-[11px] font-mono-code text-white/60">
                <span>Формат: OGG Vorbis (подлинник из репозитория)</span>
                <a
                  href={currentTrack.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F3D9B1] hover:underline inline-flex items-center gap-1"
                >
                  <span>Скачать аудиозапись</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Playlist of Mustai Karim's Author Recordings */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <span className="text-xs font-mono-code uppercase tracking-wider text-[#F3D9B1]">
                Живой голос народного поэта Башкортостана
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold mt-1">
                Стихотворения. Читает Мустай Карим
              </h2>
              <p className="text-xs sm:text-sm text-[#D0E0DC] mt-1">
                В текущем <code className="font-mono-code bg-black/30 px-1.5 py-0.5 rounded">site/pages/reading-karim-audio/</code> это 14 отдельных рамок со стандартными браузерными плеерами. В новом дизайне они объединены в единую студийную фонотеку с сохранением всех <code className="font-mono-code bg-black/30 px-1.5 py-0.5 rounded">section#track-01..14</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[290px] overflow-y-auto custom-scrollbar pr-1">
              {KARIM_AUDIO_TRACKS.map((track) => {
                const active = currentTrack.id === track.id;
                return (
                  <button
                    key={track.id}
                    id={track.id}
                    type="button"
                    onClick={() => handlePlayTrack(track)}
                    className={`p-3 rounded-xl border text-left transition flex items-center justify-between gap-3 ${
                      active
                        ? 'bg-[#8E2D36] text-white border-[#F3D9B1]/50 shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-lg bg-black/30 flex items-center justify-center shrink-0">
                        {active && isPlaying ? (
                          <Pause className="w-4 h-4 text-[#F3D9B1]" />
                        ) : (
                          <Play className="w-4 h-4 text-white/80" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-medium truncate">{track.title}</div>
                        <div className="text-[10px] font-mono-code opacity-70">#{track.id}</div>
                      </div>
                    </div>
                    <CheckCircle2 className="w-3.5 h-3.5 opacity-60 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Comfortable Reading Room Sample with Typography & Paper Theme Controls */}
      <section
        className={`rounded-3xl border p-6 sm:p-10 transition-colors duration-300 shadow-sm ${
          readerTheme === 'night'
            ? 'bg-[#121D1E] text-[#E6ECE8] border-[#263C3E]'
            : readerTheme === 'sepia'
            ? 'bg-[#F1E7D0] text-[#2B2118] border-[#D5C4A1]'
            : 'bg-[#FCFAF5] text-[#142829] border-[#D6CFC1]'
        }`}
      >
        {/* Reader Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-current/10">
          <div>
            <span className="text-xs font-mono-code opacity-75">
              Комфортное чтение длинных статей и поэзии (60–75 знаков в строке по DESIGN.md)
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-semibold mt-0.5">
              Читальный зал: С.Т. Аксаков и Тухват Янаби — детям
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-current/5 p-1 rounded-lg border border-current/10 text-xs">
              <Type className="w-3.5 h-3.5 mx-1.5 opacity-70" />
              {(
                [
                  { id: 'base', label: '100%' },
                  { id: 'lg', label: '115%' },
                  { id: 'xl', label: '130%' }
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setFontScale(s.id)}
                  className={`px-2 py-1 rounded font-medium transition ${
                    fontScale === s.id ? 'bg-[#8E2D36] text-white' : 'opacity-75 hover:opacity-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-current/5 p-1 rounded-lg border border-current/10 text-xs">
              {(
                [
                  { id: 'paper', label: 'Бумага' },
                  { id: 'sepia', label: 'Сепия' },
                  { id: 'night', label: 'Ночь' }
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setReaderTheme(t.id)}
                  className={`px-2.5 py-1 rounded font-medium transition ${
                    readerTheme === t.id ? 'bg-[#173B3D] text-white' : 'opacity-75 hover:opacity-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Two-column literary showcase: Prose + Poetry */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 font-reading leading-[1.8] ${
            fontScale === 'xl' ? 'text-xl' : fontScale === 'lg' ? 'text-lg' : 'text-base'
          }`}
        >
          <div className="space-y-4 max-w-[68ch]">
            <div className="text-xs font-sans-ui uppercase tracking-wider text-[#8E2D36] font-semibold">
              Проза · С. Т. Аксаков «Детские годы Багрова-внука»
            </div>
            <p>
              «Мы жили тогда в губернском городе Уфе и занимали огромный зубинский (зубовский) деревянный дом, купленный моим отцом, как я после узнал, с аукциона за триста рублей ассигнациями.
            </p>
            <p>
              Дом был оббит тесом, но не выкрашен; он потемнел от дождей, и вся эта громада имела очень печальный вид. Дом стоял на косогоре, так что окна в сад были очень низки от земли. А окна из столовой на улицу возвышались аршина на три над землей; парадное крыльцо имело более двадцати пяти ступенек, и с него была видна река Белая почти во всю ширину».
            </p>
          </div>

          <div className="space-y-4 border-t lg:border-t-0 lg:border-l border-current/15 pt-6 lg:pt-0 lg:pl-8">
            <div className="text-xs font-sans-ui uppercase tracking-wider text-[#245D60] font-semibold">
              Поэтическая вёрстка · Тухват Янаби «Слон и петух» (басня, пер. с башк.)
            </div>
            <div className="italic space-y-2 border-l-2 border-[#B58347] pl-4">
              <p>
                Однажды, выглянув во двор,
                <br />Петух и слон увидели друг друга.
                <br />Затеяли такой вот спор:
                <br />Кто может съесть больше другого?
              </p>
              <p>
                «Ты сколько ешь?» — огромный слон спросил.
                <br />«О много, очень много!» —
                <br />Петух ответил, хвост свой распушил...
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
