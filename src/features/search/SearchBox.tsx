import { Box, FileText, Search } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { isIn3D, searchStructures } from '@/features/anatomy-catalog/catalog'
import { CATEGORY_LABELS } from '@/features/anatomy-catalog/labels'
import { useViewer } from '@/features/anatomy-viewer/store'
import { useUi } from '@/app/uiStore'
import { cn } from '@/lib/cn'

interface Props {
  autoFocus?: boolean
  onPicked?: () => void
  /** Inline list (mobile sheet) instead of a floating dropdown. */
  inline?: boolean
}

export function SearchBox({ autoFocus, onPicked, inline }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const listId = useId()
  const select = useViewer((s) => s.select)
  const openRight = useUi((s) => s.openRight)
  const studyActive = useUi((s) => s.studyActive)
  const results = searchStructures(query, 10)

  // "/" or Ctrl/Cmd+K focuses the global search (desktop).
  useEffect(() => {
    if (inline) return
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      if ((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault()
        input.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [inline])

  const pick = (id: string) => {
    select(id, null, { focus: true })
    openRight('details')
    setQuery('')
    setOpen(false)
    onPicked?.()
  }

  const showList = (open || inline) && query.trim().length >= 2

  return (
    <div className={cn('relative', inline ? 'w-full' : 'w-full max-w-md')}>
      <label className="relative block">
        <span className="sr-only">Pesquisar estrutura anatômica</span>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" aria-hidden />
        <input
          ref={input}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && results[active] ? `${listId}-${results[active]!.id}` : undefined}
          autoFocus={autoFocus}
          value={query}
          placeholder="Pesquisar: nome, latim, sinônimo ou termo clínico"
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActive((a) => Math.min(a + 1, results.length - 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActive((a) => Math.max(a - 1, 0))
            } else if (e.key === 'Enter' && results[active]) {
              e.preventDefault()
              pick(results[active]!.id)
            } else if (e.key === 'Escape') {
              setOpen(false)
              input.current?.blur()
            }
          }}
          className="h-10 w-full rounded-control border border-line bg-bg pr-10 pl-9 text-sm text-ink placeholder:text-ink-faint focus:border-primary focus:outline-none"
        />
        {!inline && (
          <kbd className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded border border-line px-1.5 text-2xs text-ink-faint md:block">/</kbd>
        )}
      </label>
      {showList && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Sugestões"
          className={cn(
            'scroll-area mt-1.5 max-h-[min(26rem,60dvh)] rounded-panel border border-line bg-surface p-1',
            !inline && 'absolute inset-x-0 top-full z-(--z-popover) shadow-2xl shadow-black/40',
          )}
        >
          {results.length === 0 && (
            <li className="px-3 py-3 text-xs text-ink-muted">
              Nada encontrado para “{query}”. Tente outro termo, um sinônimo (ex.: “mentoniano”) ou o nome latino.
            </li>
          )}
          {results.map((s, i) => {
            const has3D = isIn3D(s.id)
            return (
              <li
                key={s.id}
                id={`${listId}-${s.id}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(s.id)}
                onMouseEnter={() => setActive(i)}
                className="flex min-h-11 cursor-pointer items-center gap-3 rounded-control px-3 py-2 aria-selected:bg-surface-3"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-ink">{studyActive && has3D ? 'Nome oculto no modo de estudo' : s.name}</span>
                  <span className="block truncate text-2xs text-ink-faint">
                    {CATEGORY_LABELS[s.categories[0]!]}
                    {s.latinName && !studyActive && <span className="italic"> · {s.latinName}</span>}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1 text-2xs text-ink-faint">
                  {has3D ? <Box className="size-3.5" aria-hidden /> : <FileText className="size-3.5" aria-hidden />}
                  {has3D ? '3D' : 'texto'}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
