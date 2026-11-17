import { useState } from 'react';
import { ArchivalGalleryShowcase } from './components/ArchivalGalleryShowcase';
import { RedesignedSiteSections } from './components/RedesignedSiteSections';
import { AgentBlueprintPlan } from './components/AgentBlueprintPlan';
import {
  Camera,
  Compass,
  Users,
  Headphones,
  Terminal,
  Eye,
  Sparkles,
  ExternalLink,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

type StudioMode = 'live-prototype' | 'agent-plan' | 'before-after';
type SiteTab = 'home-map' | 'gallery' | 'personalities' | 'reading-audio';

export function App() {
  const [studioMode, setStudioMode] = useState<StudioMode>('live-prototype');
  const [siteTab, setSiteTab] = useState<SiteTab>('gallery');

  const navigateToGallery = () => {
    setStudioMode('live-prototype');
    setSiteTab('gallery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3EC] text-[#142829]">
      {/* TOP STUDIO META BAR (Switches between Live Prototype, Agent Plan & Code, and Before/After) */}
      <div className="bg-[#0B1617] text-white border-b border-[#245D60]/50 px-4 py-2.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#8E2D36] text-white font-mono-code text-[11px] font-medium">
              <Sparkles className="w-3 h-3" />
              <span>Редизайн + ТЗ для агента</span>
            </span>
            <a
              href="https://github.com/r2force/ufalit/tree/main/site"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-code text-[#F3D9B1] hover:underline inline-flex items-center gap-1"
            >
              <span>github.com/r2force/ufalit/tree/main/site</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="hidden xl:inline text-white/50">
              · Совместимо с AGENTS.md, DESIGN.md и content-parity.csv (9 411 строк)
            </span>
          </div>

          {/* 3 Main Mode Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setStudioMode('live-prototype')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                studioMode === 'live-prototype'
                  ? 'bg-[#B58347] text-white shadow'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1. Живой пример дизайна</span>
            </button>
            <button
              type="button"
              onClick={() => setStudioMode('agent-plan')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                studioMode === 'agent-plan'
                  ? 'bg-[#B58347] text-white shadow'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>2. Подробный План и Код для Агента (TS/CSS)</span>
            </button>
            <button
              type="button"
              onClick={() => setStudioMode('before-after')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                studioMode === 'before-after'
                  ? 'bg-[#B58347] text-white shadow'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>3. Сравнение Было / Стало</span>
            </button>
          </div>
        </div>
      </div>

      {/* REDESIGNED SITE HEADER (<header class="site-header">) */}
      <header className="sticky top-0 z-40 bg-[#142829]/95 backdrop-blur-md text-white border-b border-[#B58347]/30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
          {/* Brand Logo */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setStudioMode('live-prototype');
                setSiteTab('home-map');
              }}
              className="text-left group flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8E2D36] to-[#B58347] flex items-center justify-center text-white font-display text-2xl font-bold shadow-inner border border-white/20">
                У
              </div>
              <div>
                <div className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#FCFAF5] group-hover:text-[#F3D9B1] transition leading-none">
                  Уфа литературная
                </div>
                <small className="block text-[11px] sm:text-xs text-[#D0E0DC] mt-1">
                  Информационно-краеведческий путеводитель · Литературная карта столицы Башкортостана
                </small>
              </div>
            </button>
          </div>

          {/* Site Navigation (When in Live Prototype Mode or Quick Jump) */}
          <nav aria-label="Основная навигация" className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setStudioMode('live-prototype');
                setSiteTab('home-map');
              }}
              className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                studioMode === 'live-prototype' && siteTab === 'home-map'
                  ? 'bg-[#8E2D36] text-white shadow-sm'
                  : 'text-[#E5EFEA] hover:bg-white/10'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>О проекте и Карта Уфы</span>
            </button>

            <button
              type="button"
              onClick={navigateToGallery}
              className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                studioMode === 'live-prototype' && siteTab === 'gallery'
                  ? 'bg-[#8E2D36] text-white shadow-sm ring-2 ring-[#F3D9B1]/50'
                  : 'text-[#E5EFEA] hover:bg-white/10'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Фотогалерея (4 режима + Лупа)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setStudioMode('live-prototype');
                setSiteTab('personalities');
              }}
              className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                studioMode === 'live-prototype' && siteTab === 'personalities'
                  ? 'bg-[#8E2D36] text-white shadow-sm'
                  : 'text-[#E5EFEA] hover:bg-white/10'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Персоналии (А–Я)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setStudioMode('live-prototype');
                setSiteTab('reading-audio');
              }}
              className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                studioMode === 'live-prototype' && siteTab === 'reading-audio'
                  ? 'bg-[#8E2D36] text-white shadow-sm'
                  : 'text-[#E5EFEA] hover:bg-white/10'
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>Читальный зал и Аудио</span>
            </button>

            <button
              type="button"
              onClick={() => setStudioMode('agent-plan')}
              className={`ml-1 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium transition flex items-center gap-1.5 border ${
                studioMode === 'agent-plan'
                  ? 'bg-[#F3D9B1] text-[#142829] border-[#F3D9B1] font-semibold'
                  : 'border-[#B58347]/50 text-[#F3D9B1] hover:bg-[#B58347]/20'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>План и Код для Агента</span>
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main id="main" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {studioMode === 'live-prototype' && (
          <>
            {siteTab === 'gallery' ? (
              <ArchivalGalleryShowcase />
            ) : (
              <RedesignedSiteSections
                activeSubTab={siteTab}
                onNavigateSubTab={(tab) => {
                  setSiteTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </>
        )}

        {studioMode === 'agent-plan' && <AgentBlueprintPlan showComparisonOnly={false} />}

        {studioMode === 'before-after' && <AgentBlueprintPlan showComparisonOnly={true} />}
      </main>

      {/* BOTTOM CALLOUT TO TOGGLE BETWEEN GALLERY PROTOTYPE AND AGENT BLUEPRINT */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 pb-8">
        <div className="rounded-2xl bg-[#EFEAE0] border border-[#D6CFC1] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-[#8E2D36] shrink-0" />
            <div className="text-xs sm:text-sm text-[#142829]">
              <strong>Готово к внедрению в репозиторий `r2force/ufalit`:</strong> все фотографии и аудиозаписи в этом прототипе подгружаются напрямую из вашего ветки <code className="font-mono-code text-[#8E2D36]">main/site/assets/</code>, а во вкладке «План и Код для Агента» лежат готовые CSS и TypeScript-модули.
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {studioMode !== 'agent-plan' ? (
              <button
                type="button"
                onClick={() => {
                  setStudioMode('agent-plan');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2.5 rounded-xl bg-[#173B3D] hover:bg-[#245D60] text-white text-xs font-medium flex items-center gap-2 transition shadow"
              >
                <Terminal className="w-4 h-4" />
                <span>Открыть План и Код для Агента</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={navigateToGallery}
                className="px-4 py-2.5 rounded-xl bg-[#8E2D36] hover:bg-[#74222A] text-white text-xs font-medium flex items-center gap-2 transition shadow"
              >
                <Camera className="w-4 h-4" />
                <span>Смотреть живую Фотогалерею</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* SITE FOOTER (<footer class="site-footer">) */}
      <footer className="bg-[#142829] text-[#D0E0DC] border-t border-[#245D60] py-8 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-display text-lg font-semibold text-white">
              «Уфа литературная» — Литературная карта столицы Республики Башкортостан
            </div>
            <div>
              Источник и авторские материалы:{' '}
              <a
                href="http://csdb.ufanet.ru"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F3D9B1] hover:underline"
              >
                Центральная городская детская библиотека им. Ш.А. Худайбердина г. Уфы (20 библиотек МБУ ЦСДБ)
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono-code text-[11px] text-[#A8D5BA]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Static HTML/CSS + Progressive TS/JS · WCAG 2.2 AA · 100% Content Parity</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
