import { CircleCheck, CircleDashed, CircleHelp, CircleMinus } from 'lucide-react'
import { Tooltip } from 'radix-ui'
import { STATUS_LABELS } from '@/features/anatomy-catalog/labels'
import type { VerificationStatus } from '@/features/anatomy-catalog/types'
import { cn } from '@/lib/cn'

const ICONS = { verified: CircleCheck, partial: CircleDashed, pending: CircleHelp, unavailable: CircleMinus }
const TONES = {
  verified: 'text-verified border-verified/40 bg-verified/10',
  partial: 'text-partial border-partial/40 bg-partial/10',
  pending: 'text-pending border-pending/40 bg-pending/10',
  unavailable: 'text-ink-muted border-line bg-surface-2',
}

export function StatusBadge({ status, className }: { status: VerificationStatus; className?: string }) {
  const Icon = ICONS[status]
  const { label, description } = STATUS_LABELS[status]
  return (
    <Tooltip.Root delayDuration={250}>
      <Tooltip.Trigger asChild>
        <span
          tabIndex={0}
          className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-2xs font-medium', TONES[status], className)}
        >
          <Icon className="size-3.5" aria-hidden />
          {label}
        </span>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content side="bottom" sideOffset={6} className="z-(--z-tooltip) max-w-64 rounded-control border border-line bg-surface-2 px-2.5 py-1.5 text-xs text-ink shadow-lg shadow-black/30">
          {description}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}
