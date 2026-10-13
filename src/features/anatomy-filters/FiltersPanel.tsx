import { Blend, Box, Check, FileText, RotateCcw, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { categoryCounts, filterStructures, isIn3D } from '@/features/anatomy-catalog/catalog'
import { CATEGORY_LABELS, FUNCTION_LABELS, REGION_LABELS } from '@/features/anatomy-catalog/labels'
import { CATEGORY_IDS, type CategoryId, FUNCTION_TAGS, REGION_IDS } from '@/features/anatomy-catalog/types'
import { useViewer } from '@/features/anatomy-viewer/store'
import { useUi } from '@/app/uiStore'
import { cn } from '@/lib/cn'
import { CATEGORY_COLORS } from '@/lib/categoryColors'

const COUNTS = categoryCounts()
const RESULT_PAGE = 60

export function FiltersPanel({ onPick }: { onPick?: () => void }) {
  const f = useViewer(
    useShallow((s) => ({
      categories: s.categories,
      regions: s.regions,
      functions: s.functions,
      query: s.query,
      context: s.context,
      ghostCategories: s.ghostCategories,
      selectedId: s.selectedId,
    })),
  )
  const actions = useViewer(
    useShallow((s) => ({
      toggleCategory: s.toggleCategory,
      setCategories: s.setCategories,
      toggleRegion: s.toggleRegion,
      toggleFunction: s.toggleFunction,
      setQuery: s.setQuery,
      clearFilters: s.clearFilters,
      setContext: s.setContext,
      toggleGhostCategory: s.toggleGhostCategory,
      select: s.select,
      showAll: s.showAll,
    })),
  )
  const studyActive = useUi((s) => s.studyActive)
  const [limit, setLimit] = useState(RESULT_PAGE)

  const results = useMemo(
    () => (f.categories.length ? filterStructures({ categories: f.categories, regions: f.regions, functions: f.functions, query: f.query, only3D: false }) : []),
    [f.categories, f.regions, f.functions, f.query],
  )
  const in3D = useMemo(() => results.filter((s) => isIn3D(s.id)).length, [results])
  const filtersActive = f.regions.length + f.functions.length > 0 || f.query.trim().length > 0

  return (
    <div className="flex flex-col gap-5 p-4">
      <section aria-labelledby="layers-heading" className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 id="layers-heading" className="text-xs font-semibold text-ink">
            Camadas
          </h2>
          <div className="flex gap-1 text-2xs">
            <button type="button" className="rounded px-2 py-1 text-ink-muted hover:bg-surface-3 hover:text-ink" onClick={() => actions.setCategories([...CATEGORY_IDS])}>
              Todas
            </button>
            <button type="button" className="rounded px-2 py-1 text-ink-muted hover:bg-surface-3 hover:text-ink" onClick={() => actions.setCategories([])}>
              Nenhuma
            </button>
          </div>
        </div>
        <ul className="space-y-0.5">
          {CATEGORY_IDS.map((c) => (
            <CategoryRow
              key={c}
              category={c}
              on={f.categories.includes(c)}
              ghost={f.ghostCategories.includes(c)}
              onToggle={() => actions.toggleCategory(c)}
              onGhost={() => actions.toggleGhostCategory(c)}
            />
          ))}
        </ul>
        <fieldset className="pt-1">
          <legend className="mb-1.5 text-2xs text-ink-muted">Estruturas fora do filtro</legend>
          <div className="grid grid-cols-2 gap-1 rounded-control bg-surface-2 p-1" role="radiogroup">
            {(['hide', 'ghost'] as const).map((v) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={f.context === v}
                onClick={() => actions.setContext(v)}
                className="h-9 rounded-[6px] text-xs text-ink-muted transition-colors aria-checked:bg-surface-3 aria-checked:font-medium aria-checked:text-ink"
              >
                {v === 'hide' ? 'Ocultar' : 'Translúcidas'}
              </button>
            ))}
          </div>
        </fieldset>
        <button type="button" onClick={actions.showAll} className="text-2xs text-primary underline-offset-2 hover:underline">
          Reexibir estruturas ocultadas individualmente
        </button>
      </section>

      <section aria-labelledby="filter-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 id="filter-heading" className="text-xs font-semibold">
            Filtrar
          </h2>
          {filtersActive && (
            <button type="button" onClick={actions.clearFilters} className="inline-flex items-center gap-1 text-2xs text-ink-muted hover:text-ink">
              <RotateCcw className="size-3" aria-hidden /> Limpar filtros
            </button>
          )}
        </div>
        <label className="relative block">
          <span className="sr-only">Filtrar por nome, sinônimo ou termo latino</span>
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-ink-faint" aria-hidden />
          <input
            value={f.query}
            onChange={(e) => {
              actions.setQuery(e.target.value)
              setLimit(RESULT_PAGE)
            }}
            placeholder="Nome, sinônimo ou latim"
            className="h-10 w-full rounded-control border border-line bg-bg pr-3 pl-8 text-sm text-ink placeholder:text-ink-faint focus:border-primary focus:outline-none"
          />
        </label>
        <ChipGroup label="Região" ids={REGION_IDS} labels={REGION_LABELS} selected={f.regions} onToggle={actions.toggleRegion} />
        <ChipGroup label="Função" ids={FUNCTION_TAGS} labels={FUNCTION_LABELS} selected={f.functions} onToggle={actions.toggleFunction} />
      </section>

      <section aria-labelledby="results-heading" className="space-y-2">
        <h2 id="results-heading" className="text-xs font-semibold">
          Estruturas
          <span className="ml-2 font-normal text-ink-muted tabular" aria-live="polite">
            {results.length} encontradas · {in3D} no 3D
          </span>
        </h2>
        {results.length === 0 ? (
          <p className="rounded-control border border-dashed border-line p-3 text-xs text-ink-muted">
            {f.categories.length === 0 ? 'Ative ao menos uma camada para listar estruturas.' : 'Nenhuma estrutura corresponde aos filtros. Experimente remover uma região ou função.'}
          </p>
        ) : (
          <ul className="-mx-1 space-y-px">
            {results.slice(0, limit).map((s) => {
              const has3D = isIn3D(s.id)
              const selected = f.selectedId === s.id
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    aria-current={selected ? 'true' : undefined}
                    onClick={() => {
                      actions.select(s.id)
                      onPick?.()
                    }}
                    className={cn(
                      'flex min-h-11 w-full items-center gap-2 rounded-control px-2 py-1.5 text-left transition-colors md:min-h-9',
                      selected ? 'bg-highlight-soft text-ink' : 'hover:bg-surface-2',
                    )}
                  >
                    <span className="size-2 shrink-0 rounded-full" style={{ background: CATEGORY_COLORS[s.categories[0]!] }} aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs text-ink">{studyActive && has3D ? '•••' : s.name}</span>
                      {s.subCategory && <span className="block truncate text-2xs text-ink-faint">{s.subCategory}</span>}
                    </span>
                    {has3D ? (
                      <Box className="size-3.5 shrink-0 text-ink-faint" aria-label="Representada no 3D" />
                    ) : (
                      <FileText className="size-3.5 shrink-0 text-ink-faint" aria-label="Somente ficha textual" />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
        {results.length > limit && (
          <button type="button" onClick={() => setLimit((l) => l + RESULT_PAGE)} className="w-full rounded-control border border-line py-2 text-xs text-ink-muted hover:bg-surface-2 hover:text-ink">
            Mostrar mais {Math.min(RESULT_PAGE, results.length - limit)} de {results.length - limit}
          </button>
        )}
      </section>
    </div>
  )
}

function CategoryRow({ category, on, ghost, onToggle, onGhost }: { category: CategoryId; on: boolean; ghost: boolean; onToggle: () => void; onGhost: () => void }) {
  const count = COUNTS[category]
  const textOnly = count.in3D === 0
  return (
    <li className="flex items-center gap-1">
      <button
        type="button"
        role="checkbox"
        aria-checked={on}
        onClick={onToggle}
        className="group flex min-h-11 flex-1 items-center gap-2.5 rounded-control px-2 text-left hover:bg-surface-2 md:min-h-9"
      >
        <span
          className={cn(
            'grid size-4 shrink-0 place-items-center rounded-[4px] border transition-colors',
            on ? 'border-transparent' : 'border-line-strong bg-transparent',
          )}
          style={on ? { background: CATEGORY_COLORS[category] } : undefined}
          aria-hidden
        >
          {on && <Check className="size-3 text-black/70" strokeWidth={3} />}
        </span>
        <span className={cn('flex-1 truncate text-xs', on ? 'text-ink' : 'text-ink-muted')}>{CATEGORY_LABELS[category]}</span>
        <span className="text-2xs text-ink-faint tabular" title={`${count.total} registros, ${count.in3D} com malha 3D`}>
          {textOnly ? `${count.total} · texto` : `${count.in3D}/${count.total}`}
        </span>
      </button>
      <button
        type="button"
        aria-pressed={ghost}
        aria-label={`Transparência: ${CATEGORY_LABELS[category]}`}
        title="Mostrar translúcido"
        disabled={textOnly || !on}
        onClick={onGhost}
        className="grid size-11 place-items-center rounded-control text-ink-faint hover:bg-surface-2 hover:text-ink disabled:invisible aria-pressed:bg-primary-soft aria-pressed:text-primary-strong md:size-9"
      >
        <Blend className="size-4" />
      </button>
    </li>
  )
}

function ChipGroup<T extends string>({ label, ids, labels, selected, onToggle }: { label: string; ids: readonly T[]; labels: Record<T, string>; selected: T[]; onToggle: (id: T) => void }) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? ids : ids.slice(0, 8)
  return (
    <fieldset>
      <legend className="mb-1.5 text-2xs text-ink-muted">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {visible.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={selected.includes(id)}
            onClick={() => onToggle(id)}
            className="min-h-8 rounded-full border border-line px-2.5 text-2xs text-ink-muted transition-colors hover:border-line-strong hover:text-ink aria-pressed:border-primary/60 aria-pressed:bg-primary-soft aria-pressed:text-primary-strong"
          >
            {labels[id]}
          </button>
        ))}
        {ids.length > 8 && (
          <button type="button" onClick={() => setExpanded((e) => !e)} className="min-h-8 px-1.5 text-2xs text-primary hover:underline">
            {expanded ? 'Menos' : `+${ids.length - 8}`}
          </button>
        )}
      </div>
    </fieldset>
  )
}
