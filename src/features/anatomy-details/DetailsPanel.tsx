import { Box, ChevronRight, CircleCheck, Eye, EyeOff, FileText, LocateFixed, ScanEye, Star, X } from 'lucide-react'
import { Tabs } from 'radix-ui'
import { useEffect, useMemo, useState } from 'react'
import {
  CHILDREN,
  STRUCTURE_BY_ID,
  isIn3D,
  nearestAncestorIn3D,
  presentFields,
  supportedFields,
  verificationStatus,
} from '@/features/anatomy-catalog/catalog'
import { REFERENCE_BY_ID } from '@/features/anatomy-catalog/data/references'
import { CATEGORY_LABELS, FIELD_LABELS, REGION_LABELS, SIDE_LABELS } from '@/features/anatomy-catalog/labels'
import type { AnatomicalStructure, ContentField } from '@/features/anatomy-catalog/types'
import { sideOfMesh } from '@/features/anatomy-viewer/meshSide'
import { useViewer } from '@/features/anatomy-viewer/store'
import { useStudy } from '@/features/study-mode/studyStore'
import { IconButton } from '@/components/ui/IconButton'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { cn } from '@/lib/cn'

const TAB_FIELDS: { id: string; label: string; fields: ContentField[] }[] = [
  { id: 'overview', label: 'Visão geral', fields: ['description', 'location', 'function', 'features', 'articulations'] },
  { id: 'anatomy', label: 'Anatomia', fields: ['origin', 'insertion', 'course', 'branches', 'territory', 'contents', 'boundaries', 'communications', 'anatomicalRelations'] },
  { id: 'supply', label: 'Inervação e irrigação', fields: ['innervation', 'bloodSupply', 'venousDrainage', 'lymphaticDrainage'] },
  { id: 'clinical', label: 'Odontologia', fields: ['clinicalRelevance'] },
]

const QUICK_PICKS = ['mandible', 'inferior-alveolar-nerve', 'masseter', 'mental-foramen', 'maxillary-artery', 'temporomandibular-joint', 'lingual-nerve', 'parotid-gland']

export function DetailsPanel({ onClose }: { onClose?: () => void }) {
  const selectedId = useViewer((s) => s.selectedId)
  const structure = selectedId ? STRUCTURE_BY_ID.get(selectedId) : undefined
  if (!structure) return <EmptyDetails />
  return <Details key={structure.id} s={structure} onClose={onClose} />
}

function EmptyDetails() {
  const select = useViewer((s) => s.select)
  const history = useStudy((s) => s.history)
  return (
    <div className="space-y-6 p-5">
      <div className="space-y-2">
        <p className="font-specimen text-2xl leading-tight">Escolha uma estrutura</p>
        <p className="text-ink-muted">
          Clique ou toque em qualquer parte do modelo, pesquise pelo nome ou use a lista de filtros. A ficha mostra a anatomia, a relevância odontológica e as
          fontes de cada informação.
        </p>
      </div>
      <PickList title="Para começar" ids={QUICK_PICKS} onPick={(id) => select(id)} />
      {history.length > 0 && <PickList title="Vistas recentemente" ids={history.slice(0, 6)} onPick={(id) => select(id)} />}
    </div>
  )
}

function PickList({ title, ids, onPick }: { title: string; ids: string[]; onPick: (id: string) => void }) {
  return (
    <section className="space-y-1.5">
      <h3 className="text-2xs font-semibold text-ink-muted">{title}</h3>
      <ul className="-mx-2">
        {ids
          .map((id) => STRUCTURE_BY_ID.get(id))
          .filter((s): s is AnatomicalStructure => !!s)
          .map((s) => (
            <li key={s.id}>
              <button type="button" onClick={() => onPick(s.id)} className="flex min-h-11 w-full items-center justify-between gap-2 rounded-control px-2 text-left hover:bg-surface-2 md:min-h-9">
                <span className="truncate">{s.name}</span>
                <ChevronRight className="size-4 shrink-0 text-ink-faint" aria-hidden />
              </button>
            </li>
          ))}
      </ul>
    </section>
  )
}

function Details({ s, onClose }: { s: AnatomicalStructure; onClose?: () => void }) {
  const { select, camera, isolate, toggleHidden } = useViewer.getState()
  const selectedMeshId = useViewer((st) => st.selectedMeshId)
  const hidden = useViewer((st) => st.hiddenIds.includes(s.id))
  const isolated = useViewer((st) => !!st.isolatedIds?.includes(s.id))
  const favorite = useStudy((st) => st.favorites.includes(s.id))
  const toggleFavorite = useStudy((st) => st.toggleFavorite)

  const status = verificationStatus(s)
  const supported = useMemo(() => supportedFields(s), [s])
  const present = presentFields(s)
  const has3D = isIn3D(s.id)
  const locator = has3D ? undefined : nearestAncestorIn3D(s.id)
  const children = (CHILDREN.get(s.id) ?? []).map((id) => STRUCTURE_BY_ID.get(id)).filter((x): x is AnatomicalStructure => !!x)
  const parent = s.parentId ? STRUCTURE_BY_ID.get(s.parentId) : undefined
  const related = s.relatedStructures.filter((id) => id !== s.parentId && !children.some((c) => c.id === id))
  const side = selectedMeshId ? sideOfMesh(selectedMeshId) : null

  const tabs = TAB_FIELDS.filter((t) => t.fields.some((f) => present.includes(f)))
  const [tab, setTab] = useState(tabs[0]?.id ?? 'relations')

  return (
    <article className="flex min-h-full flex-col" aria-labelledby="structure-title">
      <header className="space-y-3 border-b border-line p-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <p className="pt-1 text-2xs text-ink-muted">
            {s.categories.map((c) => CATEGORY_LABELS[c]).join(' · ')}
            {s.subCategory && <> — {s.subCategory}</>}
          </p>
          <IconButton
            label="Limpar seleção"
            hint="Esc"
            size="sm"
            onClick={() => {
              select(null)
              onClose?.()
            }}
          >
            <X className="size-4" />
          </IconButton>
        </div>
        <div className="space-y-1">
          <h2 id="structure-title" className="font-specimen text-[1.75rem] leading-[1.1] font-medium tracking-[-0.01em] text-ink">
            {s.name}
          </h2>
          {s.latinName && (
            <p className="font-specimen text-base text-ink-muted italic" lang="la">
              {s.latinName}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={status} />
          {has3D ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-2xs text-ink-muted">
              <Box className="size-3.5" aria-hidden /> No modelo 3D{side && s.side === 'bilateral' ? ` · lado ${side} selecionado` : ''}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-line-strong px-2.5 py-1 text-2xs text-ink-muted">
              <FileText className="size-3.5" aria-hidden /> Sem representação 3D
            </span>
          )}
        </div>
        {!has3D && (
          <p className="rounded-control bg-surface-2 p-3 text-xs text-ink-muted">
            Esta estrutura existe no catálogo, mas não está individualizada no modelo 3D atual.
            {locator ? (
              <>
                {' '}
                Ela é exibida a partir de{' '}
                <button type="button" className="font-medium text-primary underline-offset-2 hover:underline" onClick={() => select(locator.id)}>
                  {locator.name}
                </button>
                , onde se localiza.
              </>
            ) : (
              ' Os dados textuais abaixo continuam disponíveis.'
            )}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-1" role="toolbar" aria-label="Ações da estrutura">
          <IconButton label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} pressed={favorite} onClick={() => toggleFavorite(s.id)}>
            <Star className={cn('size-4', favorite && 'fill-current')} />
          </IconButton>
          <IconButton label="Centralizar a câmera" onClick={() => camera({ type: 'focus', structureId: s.id })}>
            <LocateFixed className="size-4" />
          </IconButton>
          <IconButton label={isolated ? 'Sair do isolamento' : 'Isolar estrutura'} pressed={isolated} disabled={!has3D} onClick={() => isolate(isolated ? null : [s.id])}>
            <ScanEye className="size-4" />
          </IconButton>
          <IconButton label={hidden ? 'Mostrar estrutura' : 'Ocultar estrutura'} pressed={hidden} disabled={!has3D} onClick={() => toggleHidden(s.id)}>
            {hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </IconButton>
        </div>
      </header>

      <Tabs.Root value={tab} onValueChange={setTab} className="flex flex-1 flex-col">
        <Tabs.List aria-label="Seções da ficha" className="scroll-area flex shrink-0 gap-1 overflow-x-auto border-b border-line px-3">
          {[...tabs, { id: 'relations', label: 'Relações' }, { id: 'refs', label: 'Fontes' }, { id: 'notes', label: 'Notas' }].map((t) => (
            <Tabs.Trigger
              key={t.id}
              value={t.id}
              className="relative h-11 shrink-0 px-2.5 text-xs whitespace-nowrap text-ink-muted transition-colors hover:text-ink data-[state=active]:font-medium data-[state=active]:text-ink data-[state=active]:after:absolute data-[state=active]:after:inset-x-2 data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5 data-[state=active]:after:rounded-full data-[state=active]:after:bg-primary"
            >
              {t.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {tabs.map((t) => (
          <Tabs.Content key={t.id} value={t.id} className="space-y-5 p-5 outline-none">
            {t.fields
              .filter((f) => present.includes(f))
              .map((f) => (
                <Field key={f} field={f} value={s.content[f]!} supported={supported.has(f)} />
              ))}
            {t.id === 'clinical' && s.clinicalTerms.length > 0 && (
              <div className="flex flex-wrap gap-1.5" aria-label="Termos clínicos relacionados">
                {s.clinicalTerms.map((c) => (
                  <span key={c} className="rounded-full bg-surface-2 px-2.5 py-1 text-2xs text-ink-muted">
                    {c}
                  </span>
                ))}
              </div>
            )}
          </Tabs.Content>
        ))}

        <Tabs.Content value="relations" className="space-y-5 p-5 outline-none">
          {present.length === 0 && (
            <p className="text-xs text-ink-muted">
              A ficha descritiva desta estrutura ainda não foi escrita. A nomenclatura foi registrada{s.ta2Id ? ` e conferida na Terminologia Anatômica (TA2 ${s.ta2Id})` : ''}.
            </p>
          )}
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-xs">
            <dt className="text-ink-muted">Regiões</dt>
            <dd>{s.regions.map((r) => REGION_LABELS[r]).join(', ')}</dd>
            <dt className="text-ink-muted">Lateralidade</dt>
            <dd>{s.toothNumber ? `Dente ${s.toothNumber} (FDI)` : SIDE_LABELS[s.side]}</dd>
            {s.synonyms.length > 0 && (
              <>
                <dt className="text-ink-muted">Sinônimos</dt>
                <dd>{s.synonyms.join(', ')}</dd>
              </>
            )}
          </dl>
          {parent && <LinkList title="Faz parte de" items={[parent]} />}
          {children.length > 0 && <LinkList title="Partes e ramos" items={children} />}
          {related.length > 0 && (
            <LinkList title="Estruturas relacionadas" items={related.map((id) => STRUCTURE_BY_ID.get(id)).filter((x): x is AnatomicalStructure => !!x)} />
          )}
        </Tabs.Content>

        <Tabs.Content value="refs" className="space-y-4 p-5 outline-none">
          <References s={s} />
        </Tabs.Content>

        <Tabs.Content value="notes" className="p-5 outline-none">
          <Notes id={s.id} />
        </Tabs.Content>
      </Tabs.Root>
    </article>
  )
}

function Field({ field, value, supported }: { field: ContentField; value: string | string[]; supported: boolean }) {
  return (
    <section className="space-y-1.5">
      <h3 className="flex items-center gap-2 text-2xs font-semibold text-ink-muted">
        {FIELD_LABELS[field]}
        {supported ? (
          <span className="inline-flex items-center gap-1 font-normal text-verified" title="Campo sustentado por fonte citada">
            <CircleCheck className="size-3" aria-hidden />
            <span className="sr-only">com fonte citada</span>
          </span>
        ) : (
          <span className="rounded-full border border-pending/40 px-1.5 text-[0.6875rem] font-normal text-pending">sem fonte conferida</span>
        )}
      </h3>
      {Array.isArray(value) ? (
        <ul className="max-w-[68ch] list-disc space-y-1 pl-4 text-sm leading-relaxed marker:text-ink-faint">
          {value.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      ) : (
        <p className="max-w-[68ch] text-sm leading-relaxed">{value}</p>
      )}
    </section>
  )
}

function LinkList({ title, items }: { title: string; items: AnatomicalStructure[] }) {
  const select = useViewer((s) => s.select)
  return (
    <section className="space-y-1.5">
      <h3 className="text-2xs font-semibold text-ink-muted">{title}</h3>
      <ul className="-mx-2">
        {items.map((i) => (
          <li key={i.id}>
            <button type="button" onClick={() => select(i.id)} className="flex min-h-11 w-full items-center gap-2 rounded-control px-2 text-left hover:bg-surface-2 md:min-h-9">
              <span className="min-w-0 flex-1 truncate text-sm">{i.name}</span>
              <span className="shrink-0 text-2xs text-ink-faint">{isIn3D(i.id) ? '3D' : 'texto'}</span>
              <ChevronRight className="size-4 shrink-0 text-ink-faint" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function References({ s }: { s: AnatomicalStructure }) {
  const model = REFERENCE_BY_ID.get('z-anatomy')!
  return (
    <>
      {s.references.length === 0 ? (
        <p className="text-xs text-ink-muted">Nenhuma referência foi associada ao conteúdo desta estrutura até o momento.</p>
      ) : (
        <ol className="space-y-3">
          {s.references.map((r, i) => {
            const src = REFERENCE_BY_ID.get(r.sourceId)
            return (
              <li key={`${r.sourceId}-${i}`} className="space-y-1 text-xs">
                <p>
                  <a href={src?.url} target="_blank" rel="noreferrer" className="font-medium text-primary underline-offset-2 hover:underline">
                    {src?.title ?? r.sourceId}
                  </a>
                  {src && <span className="text-ink-muted"> — {src.authors}</span>}
                </p>
                <p className="text-ink-muted">{r.locator}</p>
                <p className="text-ink-faint">Sustenta: {r.fields.map((f) => FIELD_LABELS[f]).join(', ')}</p>
              </li>
            )
          })}
        </ol>
      )}
      <div className="space-y-1 border-t border-line pt-4 text-xs text-ink-muted">
        {s.ta2Id && (
          <p>
            Nomenclatura latina: FIPAT, Terminologia Anatomica 2ª ed., termo {s.ta2Id}.
          </p>
        )}
        {s.meshIds.length > 0 && (
          <p>
            Modelo 3D: {model.title} ({model.license}), derivado de BodyParts3D © DBCLS. Malhas: {s.meshIds.join(', ')}.
          </p>
        )}
      </div>
    </>
  )
}

function Notes({ id }: { id: string }) {
  const saved = useStudy((s) => s.notes[id] ?? '')
  const setNote = useStudy((s) => s.setNote)
  const [text, setText] = useState(saved)
  const [state, setState] = useState<'idle' | 'saved'>('idle')
  useEffect(() => {
    if (text === saved) return
    const t = window.setTimeout(() => {
      setNote(id, text)
      setState('saved')
    }, 500)
    return () => window.clearTimeout(t)
  }, [text, saved, id, setNote])
  return (
    <label className="block space-y-2">
      <span className="text-2xs font-semibold text-ink-muted">Anotações pessoais</span>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setState('idle')
        }}
        rows={8}
        placeholder="Escreva lembretes, mnemônicos ou observações da aula. Fica salvo apenas neste navegador."
        className="w-full resize-y rounded-control border border-line bg-bg p-3 text-sm leading-relaxed text-ink placeholder:text-ink-faint focus:border-primary focus:outline-none"
      />
      <span className="block text-2xs text-ink-faint" aria-live="polite">
        {state === 'saved' ? 'Anotação salva neste navegador.' : ' '}
      </span>
    </label>
  )
}
