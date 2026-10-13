import { BookOpen, ChevronRight, X, GraduationCap, Info, Library, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, RotateCcw, Search, SlidersHorizontal } from 'lucide-react'
import { Tooltip } from 'radix-ui'
import { Suspense, lazy, useEffect } from 'react'
import { STRUCTURE_BY_ID } from '@/features/anatomy-catalog/catalog'
import { DetailsPanel } from '@/features/anatomy-details/DetailsPanel'
import { FiltersPanel } from '@/features/anatomy-filters/FiltersPanel'
import { useViewer } from '@/features/anatomy-viewer/store'
import { LibraryPanel } from '@/features/library/LibraryPanel'
import { SearchBox } from '@/features/search/SearchBox'
import { StudyPanel } from '@/features/study-mode/StudyPanel'
import { useStudy } from '@/features/study-mode/studyStore'
import { AboutDialog } from '@/components/layout/AboutDialog'
import { IconButton } from '@/components/ui/IconButton'
import { Sheet } from '@/components/ui/Sheet'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { type RightMode, useUi } from './uiStore'

// The 3D stack (three, R3F, drei) is the heaviest part of the bundle: load it as its own chunk.
const Viewer = lazy(() => import('@/features/anatomy-viewer/components/Viewer').then((m) => ({ default: m.Viewer })))

const RIGHT_TABS: { id: RightMode; label: string; icon: typeof BookOpen }[] = [
  { id: 'details', label: 'Ficha', icon: BookOpen },
  { id: 'study', label: 'Estudo', icon: GraduationCap },
  { id: 'library', label: 'Meu estudo', icon: Library },
]

function useSelectionSideEffects() {
  const selectedId = useViewer((s) => s.selectedId)
  const studyActive = useUi((s) => s.studyActive)
  const recordVisit = useStudy((s) => s.recordVisit)

  // Deep link: ?s=<structure id>
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('s')
    if (id && STRUCTURE_BY_ID.has(id)) useViewer.getState().select(id)
  }, [])

  useEffect(() => {
    const url = new URL(window.location.href)
    if (selectedId && !studyActive) url.searchParams.set('s', selectedId)
    else url.searchParams.delete('s')
    window.history.replaceState(null, '', url)
    if (selectedId && !studyActive) recordVisit(selectedId)
  }, [selectedId, studyActive, recordVisit])

  // Esc clears the selection when focus is not inside a dialog or field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.key !== 'Escape' || t.closest('[role="dialog"]') || t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') return
      useViewer.getState().select(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}

export default function App() {
  useSelectionSideEffects()
  const desktop = useMediaQuery('(min-width: 1024px)')

  return (
    <Tooltip.Provider>
      <a href="#atlas-viewer" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-(--z-toast) focus:rounded-control focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-ink">
        Ir para o visualizador 3D
      </a>
      <div className="flex h-dvh flex-col">
        <TopBar desktop={desktop} />
        <div className="flex min-h-0 flex-1">
          {desktop && <LeftColumn />}
          <main id="atlas-viewer" className="viewer-backdrop relative min-w-0 flex-1" aria-label="Visualizador anatômico">
            <Suspense fallback={<ViewerFallback />}>
              <Viewer />
            </Suspense>
            {!desktop && <MobilePeek />}
          </main>
          {desktop && <RightColumn />}
        </div>
        {!desktop && <MobileNav />}
      </div>
      {!desktop && <MobileSheets />}
      <AboutDialog />
    </Tooltip.Provider>
  )
}

function ViewerFallback() {
  return (
    <div role="status" className="grid h-full place-items-center text-ink-muted">
      <span className="text-sm">Preparando o visualizador 3D…</span>
    </div>
  )
}

function TopBar({ desktop }: { desktop: boolean }) {
  const { leftOpen, rightOpen, setLeftOpen, setRightOpen, setAboutOpen } = useUi()
  const restoreDefault = useViewer((s) => s.restoreDefault)
  return (
    <header className="z-(--z-panel) flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface px-3 pt-[env(safe-area-inset-top)] md:px-4">
      {desktop && (
        <IconButton label={leftOpen ? 'Recolher filtros' : 'Mostrar filtros'} tooltipSide="bottom" onClick={() => setLeftOpen(!leftOpen)}>
          {leftOpen ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
        </IconButton>
      )}
      <div className="flex min-w-0 items-baseline gap-2">
        <h1 className="font-specimen text-xl font-medium whitespace-nowrap">
          Atlas Odonto <span className="text-primary">3D</span>
        </h1>
        <span className="hidden truncate text-2xs text-ink-faint xl:inline">Anatomia de cabeça e pescoço</span>
      </div>
      <div className="flex flex-1 justify-center">{desktop && <SearchBox />}</div>
      <div className="flex items-center gap-0.5">
        <IconButton label="Restaurar visualização padrão" tooltipSide="bottom" onClick={restoreDefault}>
          <RotateCcw className="size-4" />
        </IconButton>
        <IconButton label="Sobre, fontes e licenças" tooltipSide="bottom" onClick={() => setAboutOpen(true)}>
          <Info className="size-4" />
        </IconButton>
        {desktop && (
          <IconButton label={rightOpen ? 'Recolher painel' : 'Mostrar painel'} tooltipSide="bottom" onClick={() => setRightOpen(!rightOpen)}>
            {rightOpen ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}
          </IconButton>
        )}
      </div>
    </header>
  )
}

function LeftColumn() {
  const open = useUi((s) => s.leftOpen)
  if (!open) return null
  return (
    <aside aria-label="Camadas e filtros" className="scroll-area w-[19rem] shrink-0 border-r border-line bg-surface xl:w-[20rem]">
      <FiltersPanel />
    </aside>
  )
}

function RightColumn() {
  const { rightOpen, rightMode, openRight } = useUi()
  if (!rightOpen) return null
  return (
    <aside aria-label="Painel de estudo" className="flex w-[24rem] shrink-0 flex-col border-l border-line bg-surface xl:w-[26rem]">
      <nav aria-label="Seções do painel" className="flex shrink-0 gap-1 border-b border-line p-1.5">
        {RIGHT_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-current={rightMode === t.id ? 'page' : undefined}
            onClick={() => openRight(t.id)}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-control text-xs text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink aria-[current=page]:bg-surface-3 aria-[current=page]:font-medium aria-[current=page]:text-ink"
          >
            <t.icon className="size-4" aria-hidden /> {t.label}
          </button>
        ))}
      </nav>
      <div className="scroll-area min-h-0 flex-1">
        {rightMode === 'details' && <DetailsPanel />}
        {rightMode === 'study' && <StudyPanel />}
        {rightMode === 'library' && <LibraryPanel />}
      </div>
    </aside>
  )
}

const MOBILE_ITEMS = [
  { id: 'filters', label: 'Filtros', icon: SlidersHorizontal },
  { id: 'search', label: 'Buscar', icon: Search },
  { id: 'details', label: 'Ficha', icon: BookOpen },
  { id: 'study', label: 'Estudo', icon: GraduationCap },
  { id: 'library', label: 'Meu estudo', icon: Library },
] as const

function MobileNav() {
  const sheet = useUi((s) => s.mobileSheet)
  const setSheet = useUi((s) => s.setMobileSheet)
  return (
    <nav aria-label="Navegação principal" className="z-(--z-toolbar) grid shrink-0 grid-cols-5 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]">
      {MOBILE_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={sheet === item.id}
          onClick={() => setSheet(sheet === item.id ? null : item.id)}
          className="flex h-16 flex-col items-center justify-center gap-1 text-[0.6875rem] text-ink-muted aria-pressed:text-primary-strong"
        >
          <item.icon className="size-5" aria-hidden />
          {item.label}
        </button>
      ))}
    </nav>
  )
}

/** Compact bar above the bottom nav: the model stays in view, details open on demand. */
function MobilePeek() {
  const selectedId = useViewer((s) => s.selectedId)
  const select = useViewer((s) => s.select)
  const studyActive = useUi((s) => s.studyActive)
  const setSheet = useUi((s) => s.setMobileSheet)
  const s = selectedId ? STRUCTURE_BY_ID.get(selectedId) : undefined
  if (!s || studyActive) return null
  return (
    <div className="absolute inset-x-3 top-3 z-(--z-toolbar) flex items-center gap-2 rounded-panel border border-highlight/50 bg-surface/95 p-1.5 pl-3 shadow-xl shadow-black/40">
      <span className="size-2.5 shrink-0 rounded-full bg-highlight" aria-hidden />
      <button type="button" onClick={() => setSheet('details')} className="flex min-h-11 min-w-0 flex-1 items-center gap-1 text-left">
        <span className="truncate text-sm font-medium">{s.name}</span>
        <ChevronRight className="size-4 shrink-0 text-ink-muted" aria-hidden />
      </button>
      <button type="button" onClick={() => select(null)} className="grid size-11 shrink-0 place-items-center rounded-control text-ink-muted" aria-label="Limpar seleção">
        <X className="size-4" aria-hidden />
      </button>
    </div>
  )
}

function MobileSheets() {
  const sheet = useUi((s) => s.mobileSheet)
  const setSheet = useUi((s) => s.setMobileSheet)
  const close = () => setSheet(null)
  const props = (id: typeof sheet) => ({ open: sheet === id, onOpenChange: (o: boolean) => setSheet(o ? id : null) })
  return (
    <>
      <Sheet {...props('filters')} title="Camadas e filtros">
        <FiltersPanel onPick={close} />
      </Sheet>
      <Sheet {...props('search')} title="Pesquisar" size="tall">
        <div className="p-4">
          <SearchBox inline autoFocus onPicked={close} />
        </div>
      </Sheet>
      <Sheet {...props('details')} title="Ficha da estrutura">
        <DetailsPanel onClose={close} />
      </Sheet>
      <Sheet {...props('study')} title="Modo de estudo" size="half">
        <StudyPanel />
      </Sheet>
      <Sheet {...props('library')} title="Meu estudo">
        <LibraryPanel onPick={close} />
      </Sheet>
    </>
  )
}

