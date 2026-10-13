import { ChevronRight, History, Star, TrendingUp } from 'lucide-react'
import { type ReactNode, useMemo } from 'react'
import { STRUCTURES, STRUCTURE_BY_ID } from '@/features/anatomy-catalog/catalog'
import { CATEGORY_LABELS } from '@/features/anatomy-catalog/labels'
import type { AnatomicalStructure, CategoryId } from '@/features/anatomy-catalog/types'
import { useViewer } from '@/features/anatomy-viewer/store'
import { useStudy } from '@/features/study-mode/studyStore'

export function LibraryPanel({ onPick }: { onPick?: () => void }) {
  const { favorites, history, studied, quiz, notes } = useStudy()
  const clearHistory = useStudy((s) => s.clearHistory)
  const resetProgress = useStudy((s) => s.resetProgress)
  const select = useViewer((s) => s.select)

  const explored = useMemo(() => {
    const cats = new Set<CategoryId>()
    for (const id of studied) STRUCTURE_BY_ID.get(id)?.categories.forEach((c) => cats.add(c))
    return cats
  }, [studied])
  const totalCategories = Object.keys(CATEGORY_LABELS).length
  const accuracy = quiz.answered ? Math.round((quiz.correct / quiz.answered) * 100) : null

  const pick = (id: string) => {
    select(id)
    onPick?.()
  }

  return (
    <div className="space-y-7 p-5">
      <section aria-labelledby="progress-heading" className="space-y-3">
        <h2 id="progress-heading" className="flex items-center gap-2 text-sm font-semibold">
          <TrendingUp className="size-4 text-primary" aria-hidden /> Progresso
        </h2>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
          <Stat label="Estruturas estudadas" value={`${studied.length}`} detail={`de ${STRUCTURES.length} no catálogo`} />
          <Stat label="Favoritas" value={`${favorites.length}`} />
          <Stat label="Questões respondidas" value={`${quiz.answered}`} detail={accuracy === null ? 'nenhuma ainda' : `${accuracy}% de acerto`} />
          <Stat label="Categorias exploradas" value={`${explored.size}`} detail={`de ${totalCategories}`} />
          <Stat label="Anotações" value={`${Object.keys(notes).length}`} />
        </dl>
        <p className="text-2xs text-ink-faint">O progresso fica salvo somente neste navegador; não há conta nem envio de dados.</p>
      </section>

      <ListSection
        icon={<Star className="size-4 text-highlight" aria-hidden />}
        title="Favoritos"
        empty="Marque a estrela na ficha de uma estrutura para guardá-la aqui."
        items={favorites}
        onPick={pick}
      />
      <ListSection
        icon={<History className="size-4 text-ink-muted" aria-hidden />}
        title="Histórico"
        empty="As estruturas que você abrir aparecem aqui."
        items={history}
        onPick={pick}
        action={history.length > 0 ? { label: 'Limpar', onClick: clearHistory } : undefined}
      />

      {(studied.length > 0 || quiz.answered > 0) && (
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Apagar progresso, histórico e estatísticas do questionário? Favoritos e anotações são mantidos.')) resetProgress()
          }}
          className="text-2xs text-ink-muted underline-offset-2 hover:text-danger hover:underline"
        >
          Zerar progresso
        </button>
      )}
    </div>
  )
}

function Stat({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div>
      <dt className="text-ink-muted">{label}</dt>
      <dd className="mt-0.5 text-xl font-semibold tabular">
        {value}
        {detail && <span className="ml-1.5 text-2xs font-normal text-ink-faint">{detail}</span>}
      </dd>
    </div>
  )
}

function ListSection({
  icon,
  title,
  empty,
  items,
  onPick,
  action,
}: {
  icon: ReactNode
  title: string
  empty: string
  items: string[]
  onPick: (id: string) => void
  action?: { label: string; onClick: () => void }
}) {
  const structures = items.map((id) => STRUCTURE_BY_ID.get(id)).filter((s): s is AnatomicalStructure => !!s)
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          {icon} {title}
        </h2>
        {action && (
          <button type="button" onClick={action.onClick} className="text-2xs text-ink-muted hover:text-ink">
            {action.label}
          </button>
        )}
      </div>
      {structures.length === 0 ? (
        <p className="text-xs text-ink-muted">{empty}</p>
      ) : (
        <ul className="-mx-2">
          {structures.map((s) => (
            <li key={s.id}>
              <button type="button" onClick={() => onPick(s.id)} className="flex min-h-11 w-full items-center gap-2 rounded-control px-2 text-left hover:bg-surface-2 md:min-h-9">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm">{s.name}</span>
                  <span className="block truncate text-2xs text-ink-faint">{CATEGORY_LABELS[s.categories[0]!]}</span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-ink-faint" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
