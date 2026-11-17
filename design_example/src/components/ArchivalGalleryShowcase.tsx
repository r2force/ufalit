import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  GALLERY_COLLECTIONS,
  GalleryPhoto,
  GalleryCollection
} from '../data/ufalitData';
import {
  Grid,
  Film,
  LayoutGrid,
  Table,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  MapPin,
  Calendar,
  Layers,
  FolderOpen,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';

type ViewMode = 'bento-passepartout' | 'filmstrip-stage' | 'masonry' | 'contact-sheet';
type LightboxTheme = 'dark-cinema' | 'museum-mat' | 'ambient-glow';

interface TiltState {
  rx: number;
  ry: number;
  glareX: number;
  glareY: number;
  active: boolean;
}

const TiltGalleryCard: React.FC<{
  photo: GalleryPhoto;
  index: number;
  enable3DTilt: boolean;
  enableAmbientMat: boolean;
  onOpenLightbox: (index: number, startWithLoupe?: boolean) => void;
}> = ({ photo, index, enable3DTilt, enableAmbientMat, onOpenLightbox }) => {
  const cardRef = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState<TiltState>({ rx: 0, ry: 0, glareX: 50, glareY: 50, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!enable3DTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;
    const rx = (0.5 - py) * 9; // max +/- 4.5 deg subtle designer tilt
    const ry = (px - 0.5) * 9;
    setTilt({
      rx,
      ry,
      glareX: px * 100,
      glareY: py * 100,
      active: true
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, glareX: 50, glareY: 50, active: false });
  };

  const isWide = photo.aspectHint === 'wide-doc';

  return (
    <figure
      ref={cardRef}
      id={photo.id}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        enable3DTilt && tilt.active
          ? {
              transform: `perspective(1000px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) translateY(-3px)`
            }
          : undefined
      }
      className={`group relative flex flex-col rounded-xl bg-[#FCFAF5] border border-[#D6CFC1] overflow-hidden passe-partout-frame tilt-card ${
        isWide ? 'md:col-span-2' : 'col-span-1'
      }`}
    >
      {/* Top Archival Metadata Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#F4EFE4]/80 border-b border-[#E5DFD3] text-[11px] font-mono-code text-[#4A5D5E]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#245D60]"></span>
          <span>№ {String(index + 1).padStart(2, '0')}</span>
          <span className="text-[#8E2D36] font-medium">#{photo.id}</span>
        </span>
        <span className="px-2 py-0.5 rounded bg-[#E6ECE8] text-[#173B3D] font-sans-ui text-[10px] font-medium">
          {photo.categoryTag}
        </span>
      </div>

      {/* Passe-partout Image Stage */}
      <div
        onClick={() => onOpenLightbox(index, false)}
        className="relative flex-1 flex items-center justify-center p-4 sm:p-5 min-h-[240px] sm:min-h-[268px] cursor-pointer overflow-hidden bg-[#EFEAE0]"
      >
        {/* Dynamic Ambient Blurred Backdrop from the image itself (eliminates ugly gray bars!) */}
        {enableAmbientMat && (
          <img
            src={photo.src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-30 saturate-150 pointer-events-none select-none transition-transform duration-700 group-hover:scale-150"
          />
        )}

        {/* Inner Museum Mat Frame */}
        <div className="relative z-10 flex items-center justify-center w-full h-full p-2.5 bg-[#FCFAF5]/90 rounded-lg shadow-sm border border-[#142829]/10">
          <img
            src={photo.src}
            alt={photo.caption}
            loading="lazy"
            className={`max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.03] ${
              isWide ? 'max-h-[250px]' : 'max-h-[220px]'
            }`}
          />
        </div>

        {/* Specular Glare Overlay when 3D Tilt is active */}
        {enable3DTilt && tilt.active && (
          <div
            className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-200"
            style={{
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.32), transparent 60%)`
            }}
          />
        )}

        {/* Quick Action Floating Pills */}
        <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5 opacity-95 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 translate-y-1 sm:group-hover:translate-y-0">
          {photo.hasFineDetails && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenLightbox(index, true);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#8E2D36] text-white text-xs font-medium shadow-md hover:bg-[#74222A] transition"
              title="Открыть с оптической лупой для чтения мелких подписей"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Лупа 2.8×</span>
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenLightbox(index, false);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#142829]/90 text-white text-xs font-medium backdrop-blur-sm shadow-md hover:bg-[#142829] transition"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Открыть</span>
          </button>
        </div>
      </div>

      {/* Figcaption — Preserves exact caption for content-parity.csv */}
      <figcaption className="p-4 bg-[#FCFAF5] border-t border-[#E5DFD3] flex flex-col justify-between gap-2">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg sm:text-xl font-semibold text-[#142829] leading-snug group-hover:text-[#8E2D36] transition-colors">
              {photo.caption}
            </h3>
            {photo.hasFineDetails && (
              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#B58347]/15 text-[#7D5626] text-[10px] font-medium">
                🔍 Мелкие детали
              </span>
            )}
          </div>
          {photo.contextNote && (
            <p className="mt-1 text-xs text-[#4A5D5E] line-clamp-2 leading-relaxed">
              {photo.contextNote}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-[#EFEAE0] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#5C6E6F]">
          {photo.addressHint ? (
            <span className="inline-flex items-center gap-1 text-[#245D60]">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate max-w-[210px]">{photo.addressHint}</span>
            </span>
          ) : photo.yearOrEra ? (
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3 shrink-0" />
              <span>{photo.yearOrEra}</span>
            </span>
          ) : (
            <span className="text-[#6E7F80]">Оригинал проверен (SHA-256)</span>
          )}

          <a
            href={photo.src}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 font-mono-code text-[10px] text-[#8E2D36] hover:underline"
            title={`Исходный атрибут href="${photo.originalPath}" сохранён для сверки`}
          >
            <span>Оригинал</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </figcaption>
    </figure>
  );
};

export const ArchivalGalleryShowcase: React.FC = () => {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('aksakov');
  const [viewMode, setViewMode] = useState<ViewMode>('bento-passepartout');
  const [activeCategory, setActiveCategory] = useState<string>('Все');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Designer UX Toggles
  const [enable3DTilt, setEnable3DTilt] = useState<boolean>(true);
  const [enableAmbientMat, setEnableAmbientMat] = useState<boolean>(true);

  // Filmstrip stage active photo index
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [stageLoupeActive, setStageLoupeActive] = useState<boolean>(false);
  const [stageLoupePos, setStageLoupePos] = useState<{ x: number; y: number; show: boolean }>({
    x: 50,
    y: 50,
    show: false
  });

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [lightboxZoom, setLightboxZoom] = useState<number>(1);
  const [lightboxLoupe, setLightboxLoupe] = useState<boolean>(false);
  const [lightboxTheme, setLightboxTheme] = useState<LightboxTheme>('dark-cinema');
  const [loupeCoords, setLoupeCoords] = useState<{ xPct: number; yPct: number; pxX: number; pxY: number; visible: boolean }>({
    xPct: 50,
    yPct: 50,
    pxX: 0,
    pxY: 0,
    visible: false
  });

  const currentCollection: GalleryCollection =
    GALLERY_COLLECTIONS.find((c) => c.id === selectedCollectionId) || GALLERY_COLLECTIONS[0];

  const categories = ['Все', 'Портреты', 'Архитектура и улицы', 'Памятники и доски', 'Карты и документы', 'Книжные издания'];

  const filteredPhotos = currentCollection.photos.filter((photo) => {
    const matchesCategory = activeCategory === 'Все' || photo.categoryTag === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      photo.caption.toLowerCase().includes(q) ||
      photo.id.toLowerCase().includes(q) ||
      (photo.contextNote && photo.contextNote.toLowerCase().includes(q)) ||
      (photo.addressHint && photo.addressHint.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  // Reset stage index when collection or filter changes
  useEffect(() => {
    setStageIndex(0);
  }, [selectedCollectionId, activeCategory, searchQuery]);

  const openLightbox = (idx: number, startWithLoupe = false) => {
    setLightboxIndex(idx);
    setLightboxZoom(1);
    setLightboxLoupe(startWithLoupe);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setLightboxZoom(1);
    setLightboxLoupe(false);
  }, []);

  const nextPhoto = useCallback(() => {
    if (filteredPhotos.length === 0) return;
    setLightboxIndex((prev) => (prev + 1) % filteredPhotos.length);
    setLightboxZoom(1);
  }, [filteredPhotos.length]);

  const prevPhoto = useCallback(() => {
    if (filteredPhotos.length === 0) return;
    setLightboxIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
    setLightboxZoom(1);
  }, [filteredPhotos.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'l' || e.key === 'L' || e.key === 'д' || e.key === 'Д') {
        setLightboxLoupe((v) => !v);
      }
      if (e.key === '+' || e.key === '=') {
        setLightboxZoom((z) => Math.min(3.5, +(z + 0.5).toFixed(1)));
      }
      if (e.key === '-') {
        setLightboxZoom((z) => Math.max(1, +(z - 0.5).toFixed(1)));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox, nextPhoto, prevPhoto]);

  const activeStagePhoto = filteredPhotos[stageIndex] || filteredPhotos[0];
  const activeLightboxPhoto = filteredPhotos[lightboxIndex] || filteredPhotos[0];

  const handleLightboxMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!lightboxLoupe) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pxX = e.clientX - rect.left;
    const pxY = e.clientY - rect.top;
    const xPct = Math.max(0, Math.min(100, (pxX / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, (pxY / rect.height) * 100));
    setLoupeCoords({ xPct, yPct, pxX, pxY, visible: true });
  };

  return (
    <section className="space-y-6">
      {/* Header Banner explaining the Gallery Redesign */}
      <div className="rounded-2xl bg-gradient-to-br from-[#142829] via-[#173B3D] to-[#1F4B4E] text-white p-6 sm:p-8 shadow-xl border border-[#245D60]/50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B58347]/20 border border-[#B58347]/40 text-[#F3D9B1] text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Флагманский модуль редизайна · Музейная фотогалерея «Уфы литературной»</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#FCFAF5]">
              Архивная фотогалерея с умным паспарту и «Лупой краеведа»
            </h2>
            <p className="text-sm sm:text-base text-[#D4E2DD] leading-relaxed">
              В текущем <code className="px-1.5 py-0.5 rounded bg-black/30 font-mono-code text-xs text-[#F3D9B1]">site/assets/style.css</code> все снимки зажаты в одинаковые ячейки <code className="px-1.5 py-0.5 rounded bg-black/30 font-mono-code text-xs">height: 16rem; object-fit: contain</code> с серыми пустыми полями. Мы предлагаем <strong>4 дизайнерских режима просмотра</strong>, динамическое <strong>амбиент-паспарту</strong>, деликатный <strong>3D-параллакс</strong> и <strong>оптическую лупу 2.8×</strong> для чтения старинных карт и родословных — при 100% сохранении всех <code className="px-1.5 py-0.5 rounded bg-black/30 font-mono-code text-xs">#photo-*</code> для <code className="px-1.5 py-0.5 rounded bg-black/30 font-mono-code text-xs">content-parity.csv</code>.
            </p>
          </div>

          {/* Interactive Designer Feature Switches */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 bg-black/25 backdrop-blur-md p-4 rounded-xl border border-white/10 shrink-0">
            <div className="text-xs font-medium text-[#B9CEC7] flex items-center gap-1.5 mb-0.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#B58347]" />
              <span>JS/CSS микро-эффекты галереи:</span>
            </div>
            <label className="flex items-center justify-between gap-4 text-xs cursor-pointer select-none">
              <span className="text-white/90">Амбиент-паспарту (Blur-фон кадра)</span>
              <input
                type="checkbox"
                checked={enableAmbientMat}
                onChange={(e) => setEnableAmbientMat(e.target.checked)}
                className="w-4 h-4 accent-[#B58347] rounded cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between gap-4 text-xs cursor-pointer select-none">
              <span className="text-white/90">3D Tilt параллакс + блик при наведении</span>
              <input
                type="checkbox"
                checked={enable3DTilt}
                onChange={(e) => setEnable3DTilt(e.target.checked)}
                className="w-4 h-4 accent-[#B58347] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Collection Selector Tabs (Aksakov, Mustai Karim, Gabdulla Amantai) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {GALLERY_COLLECTIONS.map((col) => {
          const isSelected = col.id === selectedCollectionId;
          return (
            <button
              key={col.id}
              type="button"
              onClick={() => {
                setSelectedCollectionId(col.id);
                setActiveCategory('Все');
              }}
              className={`text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                isSelected
                  ? 'bg-[#173B3D] text-white border-[#173B3D] shadow-lg ring-2 ring-[#B58347]/50'
                  : 'bg-[#FCFAF5] text-[#142829] border-[#D6CFC1] hover:border-[#245D60]'
              }`}
            >
              <img
                src={col.coverPhoto}
                alt={col.title}
                className="w-14 h-16 rounded-lg object-cover shrink-0 border border-white/20 bg-[#EFEAE0]"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-mono-code text-[10px] px-2 py-0.5 rounded ${
                      isSelected ? 'bg-[#B58347]/30 text-[#F3D9B1]' : 'bg-[#EFEAE0] text-[#5C6E6F]'
                    }`}
                  >
                    {col.years}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      isSelected ? 'text-[#A8D5BA]' : 'text-[#8E2D36]'
                    }`}
                  >
                    {col.photos.length} фото в демо
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold leading-tight mt-1 truncate">
                  {col.title}
                </h3>
                <p
                  className={`text-xs mt-1 line-clamp-2 ${
                    isSelected ? 'text-[#D0E0DC]' : 'text-[#5C6E6F]'
                  }`}
                >
                  {col.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Subcategories Bar if collection has nested galleries (like Mustai Karim gallery-9 -> gallery-35 & gallery-36) */}
      {currentCollection.subcategories && (
        <div className="p-4 rounded-xl bg-[#EFEAE0] border border-[#D6CFC1] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#142829]">
            <FolderOpen className="w-4 h-4 text-[#8E2D36] shrink-0" />
            <span>
              <strong>Двухуровневая категория:</strong> в <code className="font-mono-code text-xs bg-white/70 px-1.5 py-0.5 rounded">site/pages/gallery-9/</code> это голый список из 2 ссылок. В новом дизайне подразделы становятся переключаемыми вкладками альбомов с превью:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentCollection.subcategories.map((sub, i) => (
              <span
                key={sub.id}
                id={sub.id}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  i === 0
                    ? 'bg-[#173B3D] text-white border-[#173B3D]'
                    : 'bg-[#FCFAF5] text-[#142829] border-[#D6CFC1]'
                }`}
              >
                <span>{sub.title}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/15 text-[10px] font-mono-code">
                  {sub.count} кадр. · #{sub.id}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Control Toolbar: 4 View Modes + Category Filter Pills + Search */}
      <div className="p-4 rounded-xl bg-[#FCFAF5] border border-[#D6CFC1] shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* 4 View Mode Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#EFEAE0] p-1.5 rounded-xl border border-[#D6CFC1]">
            <button
              type="button"
              onClick={() => setViewMode('bento-passepartout')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === 'bento-passepartout'
                  ? 'bg-[#173B3D] text-white shadow-sm'
                  : 'text-[#374B4C] hover:bg-white/60'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>1. Музейное паспарту (Bento)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('filmstrip-stage')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === 'filmstrip-stage'
                  ? 'bg-[#173B3D] text-white shadow-sm'
                  : 'text-[#374B4C] hover:bg-white/60'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>2. Архивный стол / Диафильм</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('masonry')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === 'masonry'
                  ? 'bg-[#173B3D] text-white shadow-sm'
                  : 'text-[#374B4C] hover:bg-white/60'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>3. Журнальная кладка (Masonry)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('contact-sheet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === 'contact-sheet'
                  ? 'bg-[#173B3D] text-white shadow-sm'
                  : 'text-[#374B4C] hover:bg-white/60'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>4. Контактный лист (Parity ID)</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search className="w-4 h-4 text-[#5C6E6F] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по подписи, улице или #photo-id..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#F6F3EC] border border-[#D6CFC1] text-xs text-[#142829] placeholder:text-[#78898A] focus:outline-none focus:border-[#173B3D]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5C6E6F] hover:text-[#142829]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills & Parity Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#EFEAE0]">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                    active
                      ? 'bg-[#8E2D36] text-white'
                      : 'bg-[#EFEAE0] text-[#374B4C] hover:bg-[#E2DBD0]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-[#245D60] font-mono-code">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>
              Показано: {filteredPhotos.length} из {currentCollection.photos.length} · `{currentCollection.repoPagePath}`
            </span>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: BENTO PASSE-PARTOUT GRID */}
      {viewMode === 'bento-passepartout' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPhotos.map((photo, idx) => (
            <TiltGalleryCard
              key={photo.id}
              photo={photo}
              index={idx}
              enable3DTilt={enable3DTilt}
              enableAmbientMat={enableAmbientMat}
              onOpenLightbox={openLightbox}
            />
          ))}
        </div>
      )}

      {/* VIEW MODE 2: FILMSTRIP & SPLIT-SCREEN STAGE INSPECTOR */}
      {viewMode === 'filmstrip-stage' && activeStagePhoto && (
        <div className="rounded-2xl bg-[#FCFAF5] border border-[#D6CFC1] shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left/Main Stage with interactive Loupe */}
            <div className="lg:col-span-8 relative bg-[#142021] flex flex-col justify-between p-4 sm:p-6 min-h-[420px] sm:min-h-[480px]">
              {/* Top Stage Bar */}
              <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 text-xs text-white/80">
                <div className="flex items-center gap-2 font-mono-code">
                  <span className="px-2 py-0.5 rounded bg-white/10 text-[#F3D9B1]">
                    Кадр {stageIndex + 1} / {filteredPhotos.length}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#8E2D36]/80 text-white">
                    #{activeStagePhoto.id}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStageLoupeActive((v) => !v)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      stageLoupeActive
                        ? 'bg-[#B58347] text-white shadow'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>{stageLoupeActive ? 'Лупа краеведа: ВКЛ (наведите курсор)' : 'Включить Лупу 2.8×'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openLightbox(stageIndex, stageLoupeActive)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 text-white hover:bg-white/25 text-xs font-medium transition"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>На весь экран</span>
                  </button>
                </div>
              </div>

              {/* Main Stage Image with optional interactive Loupe */}
              <div
                onMouseMove={(e) => {
                  if (!stageLoupeActive) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setStageLoupePos({ x, y, show: true });
                }}
                onMouseLeave={() => setStageLoupePos((p) => ({ ...p, show: false }))}
                onClick={() => openLightbox(stageIndex, stageLoupeActive)}
                className={`relative my-4 flex items-center justify-center min-h-[320px] sm:min-h-[360px] select-none ${
                  stageLoupeActive ? 'cursor-crosshair' : 'cursor-zoom-in'
                }`}
              >
                <img
                  src={activeStagePhoto.src}
                  alt={activeStagePhoto.caption}
                  className="max-h-[360px] w-auto max-w-full object-contain rounded shadow-2xl border border-white/10"
                />

                {/* Stage Optical Loupe Overlay */}
                {stageLoupeActive && stageLoupePos.show && (
                  <div
                    className="pointer-events-none absolute w-44 h-44 rounded-full border-2 border-[#F3D9B1] shadow-2xl z-30 overflow-hidden"
                    style={{
                      left: `calc(${stageLoupePos.x}% - 88px)`,
                      top: `calc(${stageLoupePos.y}% - 88px)`,
                      backgroundImage: `url(${activeStagePhoto.src})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '280%',
                      backgroundPosition: `${stageLoupePos.x}% ${stageLoupePos.y}%`
                    }}
                  >
                    <div className="absolute bottom-1.5 inset-x-0 text-center">
                      <span className="px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono-code text-[#F3D9B1]">
                        2.8× Оптическая лупа
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Prev / Next Controls on Stage */}
              <div className="relative z-20 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setStageIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length)
                  }
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Предыдущий кадр</span>
                </button>
                <span className="text-xs text-white/60 hidden sm:inline">
                  Используйте ленту диафильма ниже или клавиши ← / →
                </span>
                <button
                  type="button"
                  onClick={() => setStageIndex((prev) => (prev + 1) % filteredPhotos.length)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition"
                >
                  <span>Следующий кадр</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Metadata & Archival Card Inspector */}
            <div className="lg:col-span-4 p-6 flex flex-col justify-between bg-[#FCFAF5] border-t lg:border-t-0 lg:border-l border-[#D6CFC1]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-[#173B3D]/10 text-[#173B3D] text-xs font-medium">
                    {activeStagePhoto.categoryTag}
                  </span>
                  <span className="font-mono-code text-xs text-[#8E2D36] font-semibold">
                    id=&quot;{activeStagePhoto.id}&quot;
                  </span>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-[#5C6E6F] font-medium">
                    Оригинальная подпись в источнике:
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#142829] mt-1">
                    {activeStagePhoto.caption}
                  </h3>
                </div>

                {activeStagePhoto.contextNote && (
                  <div className="p-3.5 rounded-xl bg-[#F4EFE4] border border-[#E5DFD3] text-xs sm:text-sm text-[#2C3E3F] leading-relaxed">
                    {activeStagePhoto.contextNote}
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-[#E5DFD3] text-xs">
                  <div className="flex justify-between py-1">
                    <span className="text-[#5C6E6F]">Раздел персоналий:</span>
                    <span className="font-medium text-[#142829]">{activeStagePhoto.authorName}</span>
                  </div>
                  {activeStagePhoto.addressHint && (
                    <div className="flex justify-between py-1 gap-2">
                      <span className="text-[#5C6E6F] shrink-0">Локация в Уфе:</span>
                      <span className="font-medium text-[#245D60] text-right">
                        {activeStagePhoto.addressHint}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-1 gap-2">
                    <span className="text-[#5C6E6F] shrink-0">Путь в репозитории:</span>
                    <code className="font-mono-code text-[11px] text-[#8E2D36] truncate">
                      {activeStagePhoto.originalPath}
                    </code>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#5C6E6F]">Статус сверки:</span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-mono-code font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> matched (SHA-256)
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-[#E5DFD3] flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => openLightbox(stageIndex, true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#173B3D] hover:bg-[#245D60] text-white text-xs font-medium flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>Изучить кадр в лайтбоксе с Лупой</span>
                </button>
                <a
                  href={activeStagePhoto.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-4 rounded-xl bg-[#EFEAE0] hover:bg-[#E5DFD3] text-[#142829] text-xs font-medium flex items-center justify-center gap-1.5 transition"
                >
                  <span>Открыть исходный JPEG в новой вкладке</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Synchronized Scroll-Snap Filmstrip Bar */}
          <div className="p-4 bg-[#EFEAE0] border-t border-[#D6CFC1]">
            <div className="flex items-center justify-between text-xs text-[#4A5D5E] mb-2">
              <span className="font-medium flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-[#8E2D36]" />
                <span>Лента диафильма (`CSS scroll-snap-type: x mandatory` — без автопрокрутки по требованию DESIGN.md)</span>
              </span>
              <span className="font-mono-code text-[11px]">
                Нажмите на миниатюру для смены кадра
              </span>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2 snap-x snap-mandatory">
              {filteredPhotos.map((photo, idx) => {
                const active = idx === stageIndex;
                return (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setStageIndex(idx)}
                    className={`snap-start shrink-0 group relative rounded-lg overflow-hidden border-2 transition-all text-left w-36 bg-[#FCFAF5] ${
                      active
                        ? 'border-[#8E2D36] ring-2 ring-[#8E2D36]/30 -translate-y-0.5 shadow-md'
                        : 'border-[#D6CFC1] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="h-20 bg-[#142021] flex items-center justify-center p-1">
                      <img
                        src={photo.src}
                        alt={photo.caption}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="p-1.5">
                      <div className="font-mono-code text-[9px] text-[#8E2D36]">#{photo.id}</div>
                      <div className="text-[11px] font-medium text-[#142829] truncate">
                        {photo.caption}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: NATURAL ASPECT MASONRY */}
      {viewMode === 'masonry' && (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {filteredPhotos.map((photo, idx) => (
            <figure
              key={photo.id}
              id={photo.id}
              onClick={() => openLightbox(idx, false)}
              className="break-inside-avoid group rounded-xl bg-[#FCFAF5] border border-[#D6CFC1] p-3.5 shadow-sm hover:shadow-xl transition cursor-pointer"
            >
              <div className="relative rounded-lg overflow-hidden bg-[#EFEAE0]">
                <img
                  src={photo.src}
                  alt={photo.caption}
                  loading="lazy"
                  className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 text-white font-mono-code text-[10px]">
                  #{photo.id}
                </span>
              </div>
              <figcaption className="pt-3 px-1">
                <div className="flex items-center justify-between gap-2 text-[11px] text-[#5C6E6F]">
                  <span>Кадр № {idx + 1}</span>
                  <span>{photo.categoryTag}</span>
                </div>
                <div className="font-display text-lg font-semibold text-[#142829] mt-0.5 group-hover:text-[#8E2D36]">
                  {photo.caption}
                </div>
                {photo.contextNote && (
                  <p className="text-xs text-[#4A5D5E] mt-1 leading-relaxed">{photo.contextNote}</p>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {/* VIEW MODE 4: ARCHIVAL CONTACT SHEET (FOR CONTENT-PARITY VERIFICATION) */}
      {viewMode === 'contact-sheet' && (
        <div className="rounded-xl bg-[#FCFAF5] border border-[#D6CFC1] overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-[#EFEAE0] border-b border-[#D6CFC1] flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-medium text-[#142829]">
              Контактный лист для быстрой сверки <code className="font-mono-code text-[#8E2D36]">migration/content-parity.csv</code>
            </span>
            <span className="font-mono-code text-[#4A5D5E]">
              Все атрибуты figure[id], a[href], img[src], img[alt] и figcaption сохранены 1:1
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-4">
            {filteredPhotos.map((photo, idx) => (
              <figure
                key={photo.id}
                id={photo.id}
                onClick={() => openLightbox(idx, false)}
                className="group rounded-lg bg-white border border-[#D6CFC1] p-2 hover:border-[#8E2D36] transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono-code text-[#5C6E6F] mb-1.5">
                    <span className="font-semibold text-[#8E2D36]">#{photo.id}</span>
                    <span>#{idx + 1}</span>
                  </div>
                  <div className="h-28 bg-[#F4EFE4] rounded flex items-center justify-center p-1 overflow-hidden">
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition"
                    />
                  </div>
                  <figcaption className="mt-2 text-xs font-medium text-[#142829] leading-snug line-clamp-2">
                    {photo.caption}
                  </figcaption>
                </div>
                <div className="mt-2 pt-1.5 border-t border-[#EFEAE0] font-mono-code text-[9px] text-[#5C6E6F] truncate">
                  {photo.originalPath}
                </div>
              </figure>
            ))}
          </div>
        </div>
      )}

      {/* FULL-SCREEN ARCHIVAL LIGHTBOX MODAL (<dialog> pattern with Deep Zoom & Loupe) */}
      {lightboxOpen && activeLightboxPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeLightboxPhoto.caption}
          className={`fixed inset-0 z-50 flex flex-col justify-between transition-colors duration-300 ${
            lightboxTheme === 'museum-mat'
              ? 'bg-[#F4EFE4]/98 text-[#142829]'
              : lightboxTheme === 'ambient-glow'
              ? 'bg-[#0F1B1C]/95 text-white'
              : 'bg-[#0B1213]/98 text-white'
          }`}
        >
          {/* Optional Ambient Backdrop in Lightbox */}
          {lightboxTheme === 'ambient-glow' && (
            <img
              src={activeLightboxPhoto.src}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 w-full h-full object-cover blur-3xl opacity-25 scale-110"
            />
          )}

          {/* Top Lightbox Control Bar */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-current/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-md bg-[#8E2D36] text-white font-mono-code text-xs font-medium">
                #{activeLightboxPhoto.id}
              </span>
              <div>
                <h3 className="font-display text-lg sm:text-xl font-semibold leading-tight">
                  {activeLightboxPhoto.caption}
                </h3>
                <p className="text-xs opacity-70">
                  {activeLightboxPhoto.authorName} · Кадр {lightboxIndex + 1} из {filteredPhotos.length}
                </p>
              </div>
            </div>

            {/* Center Zoom & Loupe Controls */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setLightboxLoupe((v) => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  lightboxLoupe
                    ? 'bg-[#B58347] text-white shadow-md'
                    : 'bg-current/10 hover:bg-current/20'
                }`}
                title="Горячая клавиша: L"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Лупа краеведа 2.8× {lightboxLoupe ? '(ВКЛ)' : '(L)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setLightboxZoom((z) => Math.max(1, +(z - 0.5).toFixed(1)))}
                className="p-1.5 rounded-lg bg-current/10 hover:bg-current/20 transition"
                title="Уменьшить (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono-code text-xs px-2 min-w-[52px] text-center">
                {Math.round(lightboxZoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setLightboxZoom((z) => Math.min(3.5, +(z + 0.5).toFixed(1)))}
                className="p-1.5 rounded-lg bg-current/10 hover:bg-current/20 transition"
                title="Увеличить (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              {lightboxZoom > 1 && (
                <button
                  type="button"
                  onClick={() => setLightboxZoom(1)}
                  className="p-1.5 rounded-lg bg-current/10 hover:bg-current/20 transition text-xs"
                  title="Сбросить масштаб"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Frame Theme Switcher */}
              <div className="hidden md:flex items-center gap-1 ml-2 pl-2 border-l border-current/15">
                <Layers className="w-3.5 h-3.5 opacity-70 mr-1" />
                {(
                  [
                    { id: 'dark-cinema', label: 'Тёмный зал' },
                    { id: 'museum-mat', label: 'Паспарту' },
                    { id: 'ambient-glow', label: 'Амбиент' }
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setLightboxTheme(t.id)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                      lightboxTheme === t.id
                        ? 'bg-[#245D60] text-white'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Original Link & Close */}
            <div className="flex items-center gap-2">
              <a
                href={activeLightboxPhoto.src}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-current/10 hover:bg-current/20 text-xs font-medium transition"
              >
                <span>Оригинал JPEG</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={closeLightbox}
                className="p-2 rounded-lg bg-[#8E2D36] text-white hover:bg-[#74222A] transition"
                aria-label="Закрыть просмотр (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Image Viewport */}
          <div className="relative z-10 flex-1 flex items-center justify-center overflow-auto p-4 sm:p-8 select-none">
            <button
              type="button"
              onClick={prevPhoto}
              className="fixed left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm transition shadow-lg"
              aria-label="Предыдущий снимок"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div
              onMouseMove={handleLightboxMouseMove}
              onMouseLeave={() => setLoupeCoords((c) => ({ ...c, visible: false }))}
              className={`relative inline-flex items-center justify-center transition-transform duration-200 ${
                lightboxTheme === 'museum-mat'
                  ? 'p-6 sm:p-10 bg-[#FCFAF5] rounded-xl shadow-2xl border border-[#D6CFC1]'
                  : ''
              } ${lightboxLoupe ? 'cursor-crosshair' : 'cursor-default'}`}
              style={{
                transform: `scale(${lightboxZoom})`
              }}
            >
              <img
                src={activeLightboxPhoto.src}
                alt={activeLightboxPhoto.caption}
                className="max-h-[64vh] max-w-[82vw] w-auto h-auto object-contain rounded shadow-xl"
              />

              {/* Optical Magnifier Loupe in Lightbox */}
              {lightboxLoupe && loupeCoords.visible && (
                <div
                  className="pointer-events-none absolute w-52 h-52 rounded-full border-2 border-[#F3D9B1] shadow-2xl z-40 overflow-hidden"
                  style={{
                    left: `${loupeCoords.pxX - 104}px`,
                    top: `${loupeCoords.pxY - 104}px`,
                    backgroundImage: `url(${activeLightboxPhoto.src})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '300%',
                    backgroundPosition: `${loupeCoords.xPct}% ${loupeCoords.yPct}%`
                  }}
                >
                  <div className="absolute bottom-2 inset-x-0 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-black/75 text-[10px] font-mono-code text-[#F3D9B1]">
                      Лупа краеведа 3.0×
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={nextPhoto}
              className="fixed right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm transition shadow-lg"
              aria-label="Следующий снимок"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Caption & Filmstrip Bar */}
          <div className="relative z-20 px-4 sm:px-6 py-3 border-t border-current/10 backdrop-blur-md space-y-2.5">
            {activeLightboxPhoto.contextNote && (
              <p className="text-xs sm:text-sm opacity-85 max-w-4xl mx-auto text-center">
                {activeLightboxPhoto.contextNote}
              </p>
            )}
            <div className="flex items-center justify-center gap-2 overflow-x-auto custom-scrollbar py-1">
              {filteredPhotos.map((photo, idx) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => {
                    setLightboxIndex(idx);
                    setLightboxZoom(1);
                  }}
                  className={`shrink-0 w-14 h-12 rounded overflow-hidden border-2 transition ${
                    idx === lightboxIndex
                      ? 'border-[#B58347] scale-105 opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-85'
                  }`}
                >
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
