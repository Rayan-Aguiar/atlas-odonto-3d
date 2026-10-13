import { Dialog } from 'radix-ui'
import { X } from 'lucide-react'
import { useMemo } from 'react'
import { STRUCTURES, isIn3D, verificationStatus } from '@/features/anatomy-catalog/catalog'
import { REFERENCE_SOURCES } from '@/features/anatomy-catalog/data/references'
import { STATUS_LABELS } from '@/features/anatomy-catalog/labels'
import { VERIFICATION_STATUSES } from '@/features/anatomy-catalog/types'
import { useUi } from '@/app/uiStore'

export function AboutDialog() {
  const open = useUi((s) => s.aboutOpen)
  const setOpen = useUi((s) => s.setAboutOpen)
  const stats = useMemo(() => {
    const byStatus = Object.fromEntries(VERIFICATION_STATUSES.map((v) => [v, 0])) as Record<(typeof VERIFICATION_STATUSES)[number], number>
    for (const s of STRUCTURES) byStatus[verificationStatus(s)]++
    return { total: STRUCTURES.length, in3D: STRUCTURES.filter((s) => s.meshIds.length > 0).length, inherited: STRUCTURES.filter((s) => isIn3D(s.id)).length, byStatus }
  }, [])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-(--z-modal-backdrop) bg-black/55" />
        <Dialog.Content className="fixed inset-x-3 top-[max(1rem,env(safe-area-inset-top))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-(--z-modal) mx-auto flex max-w-2xl flex-col rounded-panel border border-line bg-surface shadow-2xl shadow-black/50 outline-none">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <Dialog.Title className="font-specimen text-2xl">Sobre o Atlas Odonto 3D</Dialog.Title>
            <Dialog.Close className="grid size-10 place-items-center rounded-control text-ink-muted hover:bg-surface-3 hover:text-ink" aria-label="Fechar">
              <X className="size-5" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Fontes, licenças, critérios de verificação e limitações do atlas.</Dialog.Description>
          <div className="scroll-area flex-1 space-y-7 px-6 py-5 text-sm leading-relaxed">
            <section className="space-y-2">
              <p className="max-w-[68ch]">
                Atlas interativo de anatomia de cabeça e pescoço para o estudo de odontologia. É uma ferramenta <strong>complementar</strong>: não substitui
                livros-texto, aulas práticas, orientação docente ou avaliação clínica.
              </p>
            </section>

            <section className="space-y-2" aria-labelledby="coverage-h">
              <h3 id="coverage-h" className="font-semibold">
                Cobertura atual
              </h3>
              <ul className="list-disc space-y-1 pl-5 text-ink-muted marker:text-ink-faint">
                <li>
                  {stats.total} registros no catálogo; {stats.in3D} têm malha própria selecionável no modelo 3D e {stats.inherited - stats.in3D} são agrupamentos
                  exibidos pelas suas partes (ex.: músculo masseter = partes superficial e profunda).
                </li>
                <li>Forames, canais, fissuras e acidentes ósseos são fichas textuais localizadas pelo osso correspondente; ainda não têm marcador 3D próprio.</li>
                <li>O modelo não inclui dentes decíduos, terceiros molares, seio maxilar, vários ramos nervosos (infraorbital, alveolares superiores, nasopalatino) nem a artéria lingual. Essas estruturas aparecem apenas como texto.</li>
                <li>Ossículos da audição e nervos coclear e vestibular foram retirados do 3D: no Z-Anatomy, vêm de um modelo com licença não comercial (CC BY-NC-SA).</li>
              </ul>
            </section>

            <section className="space-y-2" aria-labelledby="verification-h">
              <h3 id="verification-h" className="font-semibold">
                Como a verificação é indicada
              </h3>
              <p className="max-w-[68ch] text-ink-muted">
                Cada campo de uma ficha só conta como verificado quando há uma citação que o sustenta explicitamente (livro, seção e página quando disponível). O estado
                da ficha é calculado automaticamente a partir disso. A conferência foi feita durante a construção do atlas, com apoio de IA na leitura e na
                organização das fontes. Ainda <strong>não houve revisão por docente de anatomia</strong>, recomendada antes de uso formal.
              </p>
              <ul className="grid grid-cols-2 gap-2 text-xs">
                {VERIFICATION_STATUSES.map((v) => (
                  <li key={v} className="rounded-control bg-surface-2 p-2.5">
                    <span className="block font-medium">{STATUS_LABELS[v].label}</span>
                    <span className="text-ink-muted tabular">{stats.byStatus[v]} fichas</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-3" aria-labelledby="sources-h">
              <h3 id="sources-h" className="font-semibold">
                Fontes e licenças
              </h3>
              <ul className="space-y-3">
                {REFERENCE_SOURCES.map((r) => (
                  <li key={r.id} className="text-xs">
                    <a href={r.url} target="_blank" rel="noreferrer" className="font-medium text-primary underline-offset-2 hover:underline">
                      {r.title}
                    </a>
                    <span className="block text-ink-muted">
                      {r.authors} · {r.license} · consultado em {new Date(`${r.accessedAt}T12:00:00`).toLocaleDateString('pt-BR')}
                    </span>
                    {r.notes && <span className="block text-ink-faint">{r.notes}</span>}
                  </li>
                ))}
              </ul>
              <p className="rounded-control bg-surface-2 p-3 text-xs text-ink-muted">
                <strong className="text-ink">Atribuição do modelo 3D:</strong> “Z-Anatomy — The libre 3D atlas of anatomy”, CC BY-SA 4.0, derivado de
                “BodyParts3D, © The Database Center for Life Science”, CC BY 4.0 (a versão original declarava CC BY-SA 2.1 Japão). Os arquivos GLB deste atlas são
                obras derivadas (subconjunto de cabeça e pescoço, simplificado e comprimido) e são distribuídos sob a mesma licença CC BY-SA 4.0.
              </p>
            </section>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
