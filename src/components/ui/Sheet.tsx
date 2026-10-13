import { Dialog } from 'radix-ui'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  /** Height of the sheet on small screens. */
  size?: 'half' | 'tall'
}

/** Bottom sheet for touch layouts. Keeps the top of the 3D view visible behind a light scrim. */
export function Sheet({ open, onOpenChange, title, description, children, size = 'tall' }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay fixed inset-0 z-(--z-modal-backdrop) bg-black/35" />
        <Dialog.Content
          className={`sheet-content fixed inset-x-0 bottom-0 z-(--z-modal) flex flex-col rounded-t-[16px] border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] shadow-2xl shadow-black/50 outline-none ${size === 'half' ? 'max-h-[58dvh]' : 'max-h-[86dvh]'}`}
        >
          <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-line-strong" aria-hidden />
          <div className="flex items-center justify-between gap-3 px-4 pt-2 pb-1">
            <Dialog.Title className="text-base font-semibold">{title}</Dialog.Title>
            <Dialog.Close className="grid size-11 place-items-center rounded-control text-ink-muted hover:bg-surface-3 hover:text-ink" aria-label="Fechar">
              <X className="size-5" />
            </Dialog.Close>
          </div>
          {description ? (
            <Dialog.Description className="px-4 pb-2 text-xs text-ink-muted">{description}</Dialog.Description>
          ) : (
            <Dialog.Description className="sr-only">{title}</Dialog.Description>
          )}
          <div className="scroll-area min-h-0 flex-1">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
