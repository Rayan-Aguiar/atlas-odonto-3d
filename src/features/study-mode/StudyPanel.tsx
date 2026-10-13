import { ArrowLeft, ArrowRight, Check, Eye, GraduationCap, Layers, RotateCcw, Star, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { STRUCTURE_BY_ID } from '@/features/anatomy-catalog/catalog'
import { CATEGORY_LABELS } from '@/features/anatomy-catalog/labels'
import type { CategoryId } from '@/features/anatomy-catalog/types'
import { useViewer } from '@/features/anatomy-viewer/store'
import { useUi } from '@/app/uiStore'
import { cn } from '@/lib/cn'
import { type Question, buildQuiz, eligibleStructures, flashcardDeck, seededRng } from './quiz'
import { useStudy } from './studyStore'

type Mode = 'flashcards' | 'quiz'
type Session = { mode: Mode; deck: string[]; questions: Question[] }

const STUDY_CATEGORIES: CategoryId[] = ['muscles', 'nerves', 'bones', 'teeth', 'arteries', 'veins', 'glands', 'joints']

export function StudyPanel() {
  const [session, setSession] = useState<Session | null>(null)
  const setStudyActive = useUi((s) => s.setStudyActive)

  useEffect(() => {
    setStudyActive(!!session)
    return () => setStudyActive(false)
  }, [session, setStudyActive])

  if (!session) return <Setup onStart={setSession} />
  return session.mode === 'flashcards' ? (
    <Flashcards deck={session.deck} onExit={() => setSession(null)} />
  ) : (
    <Quiz questions={session.questions} onExit={() => setSession(null)} />
  )
}

function Setup({ onStart }: { onStart: (s: Session) => void }) {
  const favorites = useStudy((s) => s.favorites)
  const [mode, setMode] = useState<Mode>('flashcards')
  const [scope, setScope] = useState<CategoryId[]>(['muscles'])
  const [useFavorites, setUseFavorites] = useState(false)
  const [size, setSize] = useState(10)

  const scopeArg = useFavorites ? { ids: favorites } : { categories: scope }
  const available = useMemo(() => eligibleStructures(useFavorites ? { ids: favorites } : { categories: scope }).length, [useFavorites, favorites, scope])

  const start = () => {
    const rng = seededRng(Date.now() & 0xffffffff)
    if (mode === 'flashcards') onStart({ mode, deck: flashcardDeck(scopeArg, rng).slice(0, size), questions: [] })
    else onStart({ mode, deck: [], questions: buildQuiz(scopeArg, size, rng) })
  }

  return (
    <div className="space-y-6 p-5">
      <div className="space-y-2">
        <p className="flex items-center gap-2 font-specimen text-2xl leading-tight">
          <GraduationCap className="size-6 text-primary" aria-hidden /> Modo de estudo
        </p>
        <p className="text-ink-muted">
          As perguntas usam apenas estruturas presentes no modelo 3D e com conteúdo sustentado por fonte citada. Durante a sessão, os nomes ficam ocultos no modelo
          e nas listas.
        </p>
      </div>

      <fieldset className="space-y-2">
        <legend className="mb-2 text-2xs font-semibold text-ink-muted">Formato</legend>
        <div className="grid grid-cols-2 gap-2" role="radiogroup">
          {(
            [
              ['flashcards', 'Identificação', 'Veja a estrutura destacada e revele o nome.'],
              ['quiz', 'Questionário', 'Múltipla escolha com correção imediata.'],
            ] as const
          ).map(([id, title, desc]) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={mode === id}
              onClick={() => setMode(id)}
              className="rounded-panel border border-line p-3 text-left transition-colors hover:border-line-strong aria-checked:border-primary aria-checked:bg-primary-soft"
            >
              <span className="block text-sm font-medium">{title}</span>
              <span className="mt-1 block text-2xs text-ink-muted">{desc}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="mb-2 text-2xs font-semibold text-ink-muted">Conteúdo</legend>
        <div className="flex flex-wrap gap-1.5">
          {STUDY_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={!useFavorites && scope.includes(c)}
              onClick={() => {
                setUseFavorites(false)
                setScope((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]))
              }}
              className="min-h-9 rounded-full border border-line px-3 text-xs text-ink-muted hover:text-ink aria-pressed:border-primary/60 aria-pressed:bg-primary-soft aria-pressed:text-primary-strong"
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={useFavorites}
            disabled={favorites.length === 0}
            onClick={() => setUseFavorites((v) => !v)}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs text-ink-muted hover:text-ink disabled:opacity-40 aria-pressed:border-highlight/60 aria-pressed:bg-highlight-soft aria-pressed:text-highlight"
          >
            <Star className="size-3.5" aria-hidden /> Meus favoritos ({favorites.length})
          </button>
        </div>
      </fieldset>

      <label className="flex items-center justify-between gap-3 text-xs">
        <span className="text-ink-muted">Quantidade</span>
        <select value={size} onChange={(e) => setSize(Number(e.target.value))} className="h-10 rounded-control border border-line bg-bg px-3 text-sm">
          {[5, 10, 20, 30].map((n) => (
            <option key={n} value={n}>
              {n} {mode === 'quiz' ? 'questões' : 'cartões'}
            </option>
          ))}
        </select>
      </label>

      <div className="space-y-2">
        <button
          type="button"
          disabled={available < 4}
          onClick={start}
          className="h-11 w-full rounded-control bg-primary font-medium text-primary-ink transition-colors hover:bg-primary-strong disabled:bg-surface-3 disabled:text-ink-faint"
        >
          Começar
        </button>
        <p className="text-2xs text-ink-faint" aria-live="polite">
          {available < 4 ? 'São necessárias ao menos 4 estruturas elegíveis para montar a sessão.' : `${available} estruturas elegíveis na seleção.`}
        </p>
      </div>
    </div>
  )
}

function useHighlight(id: string | null) {
  const select = useViewer((s) => s.select)
  useEffect(() => {
    if (id) select(id, null, { focus: true })
  }, [id, select])
}

function SessionHeader({ title, index, total, onExit }: { title: string; index: number; total: number; onExit: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
      <div className="min-w-0">
        <p className="text-2xs text-ink-muted">{title}</p>
        <p className="text-sm font-medium tabular">
          {Math.min(index + 1, total)} de {total}
        </p>
      </div>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3" aria-hidden>
        <div className="h-full rounded-full bg-primary transition-[width] duration-200" style={{ width: `${(Math.min(index, total) / total) * 100}%` }} />
      </div>
      <button type="button" onClick={onExit} className="inline-flex h-9 items-center gap-1 rounded-control px-2 text-xs text-ink-muted hover:bg-surface-3 hover:text-ink">
        <X className="size-4" aria-hidden /> Encerrar
      </button>
    </div>
  )
}

function Flashcards({ deck, onExit }: { deck: string[]; onExit: () => void }) {
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const recordAnswer = useStudy((s) => s.recordAnswer)
  const id = deck[index] ?? null
  useHighlight(id)
  const s = id ? STRUCTURE_BY_ID.get(id) : undefined

  if (!s) return <Finished onExit={onExit} message="Você revisou todos os cartões desta sessão." />

  const go = (delta: number) => {
    setRevealed(false)
    setIndex((i) => Math.max(0, i + delta))
  }
  const summary = s.content.function ?? s.content.description

  return (
    <div className="flex min-h-full flex-col">
      <SessionHeader title="Identificação" index={index} total={deck.length} onExit={onExit} />
      <div className="flex-1 space-y-5 p-5">
        <p className="text-ink-muted">Observe a estrutura destacada no modelo (cor de destaque verde-água). Gire a câmera se precisar. Qual é o nome dela?</p>
        <div className="min-h-36 rounded-panel border border-line bg-surface-2 p-5" aria-live="polite">
          {revealed ? (
            <div className="space-y-2">
              <p className="font-specimen text-2xl leading-tight">{s.name}</p>
              {s.latinName && <p className="font-specimen text-ink-muted italic">{s.latinName}</p>}
              <p className="text-2xs text-ink-faint">{CATEGORY_LABELS[s.categories[0]!]}</p>
              {summary && <p className="pt-2 text-sm leading-relaxed">{Array.isArray(summary) ? summary[0] : summary}</p>}
            </div>
          ) : (
            <button type="button" onClick={() => setRevealed(true)} className="grid h-full min-h-26 w-full place-items-center gap-2 rounded-control text-ink-muted hover:text-ink">
              <Eye className="size-5" aria-hidden />
              <span className="text-sm font-medium">Revelar resposta</span>
            </button>
          )}
        </div>
        {revealed && (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                recordAnswer(s.id, false)
                go(1)
              }}
              className="h-11 rounded-control border border-line text-sm hover:bg-surface-3"
            >
              Ainda não sabia
            </button>
            <button
              type="button"
              onClick={() => {
                recordAnswer(s.id, true)
                go(1)
              }}
              className="h-11 rounded-control bg-primary text-sm font-medium text-primary-ink hover:bg-primary-strong"
            >
              Acertei
            </button>
          </div>
        )}
      </div>
      <div className="flex justify-between border-t border-line px-5 py-3">
        <button type="button" disabled={index === 0} onClick={() => go(-1)} className="inline-flex h-10 items-center gap-1.5 rounded-control px-3 text-xs text-ink-muted hover:bg-surface-3 hover:text-ink disabled:opacity-40">
          <ArrowLeft className="size-4" aria-hidden /> Anterior
        </button>
        <button type="button" onClick={() => go(1)} className="inline-flex h-10 items-center gap-1.5 rounded-control px-3 text-xs text-ink-muted hover:bg-surface-3 hover:text-ink">
          Pular <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  )
}

function Quiz({ questions, onExit }: { questions: Question[]; onExit: () => void }) {
  const [index, setIndex] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const recordAnswer = useStudy((s) => s.recordAnswer)
  const q = questions[index]
  useHighlight(q?.structureId ?? null)

  if (!q) return <Finished onExit={onExit} message={`Você acertou ${score} de ${questions.length} questões.`} />

  const answer = (option: string) => {
    if (chosen) return
    setChosen(option)
    const ok = option === q.answer
    if (ok) setScore((v) => v + 1)
    recordAnswer(q.structureId, ok)
  }

  return (
    <div className="flex min-h-full flex-col">
      <SessionHeader title={`Questionário · ${score} acerto${score === 1 ? '' : 's'}`} index={index} total={questions.length} onExit={onExit} />
      <div className="flex-1 space-y-4 p-5">
        {q.highlight && (
          <p className="inline-flex items-center gap-1.5 rounded-full bg-highlight-soft px-2.5 py-1 text-2xs text-highlight">
            <Layers className="size-3.5" aria-hidden /> Estrutura destacada no modelo
          </p>
        )}
        <p className="text-base font-medium leading-snug">{q.prompt}</p>
        <ul className="space-y-2">
          {q.options.map((o) => {
            const isAnswer = o === q.answer
            const isChosen = o === chosen
            return (
              <li key={o}>
                <button
                  type="button"
                  disabled={!!chosen}
                  onClick={() => answer(o)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-control border p-3 text-left text-sm leading-snug transition-colors',
                    !chosen && 'border-line hover:border-line-strong hover:bg-surface-2',
                    chosen && isAnswer && 'border-verified/70 bg-verified/10',
                    chosen && isChosen && !isAnswer && 'border-danger/70 bg-danger/10',
                    chosen && !isAnswer && !isChosen && 'border-line opacity-60',
                  )}
                >
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-line-strong" aria-hidden>
                    {chosen && isAnswer && <Check className="size-3.5 text-verified" />}
                    {chosen && isChosen && !isAnswer && <X className="size-3.5 text-danger" />}
                  </span>
                  <span className="flex-1">{o}</span>
                </button>
              </li>
            )
          })}
        </ul>
        {chosen && (
          <div role="status" className={cn('rounded-control p-3 text-sm', chosen === q.answer ? 'bg-verified/10 text-verified' : 'bg-danger/10 text-danger')}>
            {chosen === q.answer ? 'Correto!' : 'Não foi dessa vez.'}{' '}
            <span className="text-ink">Estrutura: {STRUCTURE_BY_ID.get(q.structureId)?.name}.</span>
          </div>
        )}
      </div>
      <div className="flex justify-end border-t border-line px-5 py-3">
        <button
          type="button"
          disabled={!chosen}
          onClick={() => {
            setChosen(null)
            setIndex((i) => i + 1)
          }}
          className="inline-flex h-10 items-center gap-1.5 rounded-control bg-primary px-4 text-sm font-medium text-primary-ink hover:bg-primary-strong disabled:bg-surface-3 disabled:text-ink-faint"
        >
          {index + 1 === questions.length ? 'Ver resultado' : 'Próxima'} <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  )
}

function Finished({ message, onExit }: { message: string; onExit: () => void }) {
  return (
    <div className="space-y-4 p-5">
      <p className="font-specimen text-2xl">Sessão concluída</p>
      <p className="text-ink-muted">{message} O resultado foi somado ao seu progresso.</p>
      <button type="button" onClick={onExit} className="inline-flex h-11 items-center gap-2 rounded-control bg-primary px-4 font-medium text-primary-ink hover:bg-primary-strong">
        <RotateCcw className="size-4" aria-hidden /> Nova sessão
      </button>
    </div>
  )
}
