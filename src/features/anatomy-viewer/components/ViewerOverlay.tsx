import { AlertTriangle, Bookmark, BookmarkCheck, BookmarkPlus, Focus, Loader2, LocateFixed, RotateCcw, ScanEye, X } from 'lucide-react'
import { useState } from 'react'
import { STRUCTURE_BY_ID } from '@/features/anatomy-catalog/catalog'
import { CATEGORY_LABELS } from '@/features/anatomy-catalog/labels'
import type { CategoryId } from '@/features/anatomy-catalog/types'
import { IconButton } from '@/components/ui/IconButton'
import { cn } from '@/lib/cn'
import { CATEGORY_COLORS } from '@/lib/categoryColors'
import { MODULE_LABELS, useSceneState } from '../hooks/useSceneState'
import { type ViewName, useViewer } from '../store'

const VIEWS: { id: ViewName; label: string; short: string }[] = [
  { id: 'anterior', label: 'Vista anterior', short: 'Anterior' },
  { id: 'posterior', label: 'Vista posterior', short: 'Posterior' },
  { id: 'right', label: 'Vista lateral direita', short: 'Lat. D' },
  { id: 'left', label: 'Vista lateral esquerda', short: 'Lat. E' },
  { id: 'superior', label: 'Vista superior', short: 'Superior' },
  { id: 'inferior', label: 'Vista inferior', short: 'Inferior' },
  { id: 'oblique', label: 'Vista oblíqua anterolateral', short: 'Oblíqua' },
]

export function ViewerOverlay({ onRetry }: { onRetry: (moduleId: string) => void }) {
  const camera = useViewer((s) => s.camera)
  const moduleStatus = useViewer((s) => s.moduleStatus)
  const moduleErrors = useViewer((s) => s.moduleErrors)
  const isolatedIds = useViewer((s) => s.isolatedIds)
  const isolate = useViewer((s) => s.isolate)
  const categories = useViewer((s) => s.categories)
  const restoreDefault = useViewer((s) => s.restoreDefault)
  const selectedId = useViewer((s) => s.selectedId)
  const scene = useSceneState()
  const [savedFlash, setSavedFlash] = useState(false)

  const loading = Object.entries(moduleStatus).filter(([, s]) => s === 'loading').map(([id]) => id)
  const failed = Object.entries(moduleStatus).filter(([, s]) => s === 'error').map(([id]) => id)
  const nothingVisible = scene.visibleCount === 0 && loading.length === 0 && !isolatedIds

  return (
    <>
      {/* Status column (top-left) */}
      <div className="pointer-events-none absolute top-3 left-3 z-(--z-canvas-overlay) flex max-w-[min(26rem,calc(100%-1.5rem))] flex-col gap-2">
        {loading.length > 0 && (
          <div role="status" className="pointer-events-auto flex items-center gap-2 rounded-control border border-line bg-surface/90 px-3 py-2 text-xs text-ink-muted">
            <Loader2 className="size-4 animate-spin text-primary motion-reduce:animate-none" aria-hidden />
            Carregando {loading.map((m) => MODULE_LABELS[m] ?? m).join(', ')}…
          </div>
        )}
        {failed.map((m) => (
          <div key={m} role="alert" className="pointer-events-auto flex items-start gap-2 rounded-control border border-danger/50 bg-surface/95 px-3 py-2 text-xs">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
            <div className="space-y-1">
              <p className="text-ink">
                O módulo de {MODULE_LABELS[m] ?? m} não carregou. As estruturas dele continuam na pesquisa, mas não aparecem no 3D.
              </p>
              {moduleErrors[m] && <p className="text-ink-faint">Detalhe técnico: {moduleErrors[m]}</p>}
              <button type="button" onClick={() => onRetry(m)} className="font-medium text-primary underline-offset-2 hover:underline">
                Tentar novamente
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Isolation banner */}
      {isolatedIds && (
        <div role="status" className="absolute top-3 left-1/2 z-(--z-canvas-overlay) flex -translate-x-1/2 items-center gap-3 rounded-full border border-highlight/60 bg-surface/95 py-1.5 pr-1.5 pl-4 text-xs shadow-lg shadow-black/30">
          <ScanEye className="size-4 text-highlight" aria-hidden />
          <span>
            Isolamento ativo:{' '}
            <strong className="font-medium">
              {isolatedIds.length === 1 ? (STRUCTURE_BY_ID.get(isolatedIds[0]!)?.name ?? '1 estrutura') : `${isolatedIds.length} estruturas`}
            </strong>
          </span>
          <button
            type="button"
            onClick={() => isolate(null)}
            className="inline-flex items-center gap-1 rounded-full bg-surface-3 px-3 py-1 font-medium hover:bg-line"
          >
            <X className="size-3.5" aria-hidden /> Sair
          </button>
        </div>
      )}

      {nothingVisible && (
        <div className="absolute inset-0 z-(--z-canvas-overlay) grid place-items-center p-6">
          <div className="max-w-xs space-y-3 rounded-panel border border-line bg-surface/95 p-5 text-center">
            <p className="font-specimen text-lg">Nenhuma estrutura visível</p>
            <p className="text-ink-muted">
              {categories.length === 0
                ? 'Todas as camadas estão desligadas. Ative uma categoria nos filtros para ver o modelo.'
                : 'Os filtros atuais não correspondem a estruturas representadas no modelo 3D.'}
            </p>
            <button type="button" onClick={restoreDefault} className="rounded-control bg-primary px-4 py-2 font-medium text-primary-ink hover:bg-primary-strong">
              Restaurar visualização padrão
            </button>
          </div>
        </div>
      )}

      {/* View toolbar */}
      <div className="absolute inset-x-0 bottom-3 z-(--z-toolbar) flex justify-center px-3 max-md:bottom-[calc(4.5rem+env(safe-area-inset-bottom))]">
        <div
          role="toolbar"
          aria-label="Vistas anatômicas"
          className="scroll-area flex max-w-full items-center gap-0.5 overflow-x-auto rounded-panel border border-line bg-surface/95 p-1 shadow-xl shadow-black/30"
        >
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              aria-label={v.label}
              onClick={() => camera({ type: 'view', view: v.id })}
              className="h-11 shrink-0 rounded-control px-2.5 text-xs font-medium whitespace-nowrap text-ink-muted transition-colors hover:bg-surface-3 hover:text-ink md:h-8"
            >
              {v.short}
            </button>
          ))}
        </div>
      </div>

      {/* Camera controls (right edge) */}
      <div
        role="toolbar"
        aria-label="Câmera"
        aria-orientation="vertical"
        className="absolute top-1/2 right-3 z-(--z-toolbar) flex -translate-y-1/2 flex-col gap-0.5 rounded-panel border border-line bg-surface/95 p-1 shadow-xl shadow-black/30 max-md:top-auto max-md:bottom-[calc(8.75rem+env(safe-area-inset-bottom))] max-md:translate-y-0"
      >
        <IconButton label="Centralizar na estrutura selecionada" tooltipSide="left" disabled={!selectedId} onClick={() => selectedId && camera({ type: 'focus', structureId: selectedId })}>
          <LocateFixed className="size-4" />
        </IconButton>
        <IconButton label="Reenquadrar o modelo completo" tooltipSide="left" onClick={() => camera({ type: 'fit' })}>
          <Focus className="size-4" />
        </IconButton>
        <IconButton label="Voltar à posição inicial" tooltipSide="left" onClick={() => camera({ type: 'reset' })}>
          <RotateCcw className="size-4" />
        </IconButton>
        <span className="mx-auto my-0.5 h-px w-5 bg-line" aria-hidden />
        <IconButton
          label={savedFlash ? 'Vista personalizada salva' : 'Salvar vista personalizada'}
          tooltipSide="left"
          onClick={() => {
            camera({ type: 'custom-save' })
            setSavedFlash(true)
            window.setTimeout(() => setSavedFlash(false), 1600)
          }}
        >
          {savedFlash ? <BookmarkCheck className="size-4 text-verified" /> : <BookmarkPlus className="size-4" />}
        </IconButton>
        <IconButton label="Ir para a vista personalizada" tooltipSide="left" onClick={() => camera({ type: 'custom-restore' })}>
          <Bookmark className="size-4" />
        </IconButton>
      </div>

      <Legend categories={categories} />
    </>
  )
}

function Legend({ categories }: { categories: CategoryId[] }) {
  const [open, setOpen] = useState(false)
  const shown = categories.filter((c) => c !== 'foramina')
  if (shown.length === 0) return null
  return (
    <div className="absolute bottom-3 left-3 z-(--z-canvas-overlay) hidden 2xl:block">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="rounded-control border border-line bg-surface/90 px-3 py-1.5 text-xs text-ink-muted hover:text-ink"
      >
        Legenda de cores
      </button>
      {open && (
        <ul className="mt-2 space-y-1 rounded-panel border border-line bg-surface/95 p-3 text-xs">
          {shown.map((c) => (
            <li key={c} className="flex items-center gap-2">
              <span className={cn('size-3 rounded-full ring-1 ring-black/30')} style={{ background: CATEGORY_COLORS[c] }} aria-hidden />
              {CATEGORY_LABELS[c]}
            </li>
          ))}
          <li className="flex items-center gap-2 border-t border-line pt-1.5">
            <span className="size-3 rounded-full bg-highlight" aria-hidden /> Estrutura selecionada
          </li>
        </ul>
      )}
    </div>
  )
}
