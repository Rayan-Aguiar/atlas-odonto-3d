import { Tooltip } from 'radix-ui'
import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  /** Visible keyboard shortcut or extra hint shown in the tooltip. */
  hint?: string
  pressed?: boolean
  children: ReactNode
  size?: 'sm' | 'md'
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right'
}

export const IconButton = forwardRef<HTMLButtonElement, Props>(function IconButton(
  { label, hint, pressed, children, className, size = 'md', tooltipSide = 'top', ...rest },
  ref,
) {
  return (
    <Tooltip.Root delayDuration={350}>
      <Tooltip.Trigger asChild>
        <button
          ref={ref}
          type="button"
          aria-label={label}
          aria-pressed={pressed}
          className={cn(
            'inline-grid shrink-0 place-items-center rounded-control text-ink-muted transition-colors duration-150 ease-(--ease-out-quint)',
            'hover:bg-surface-3 hover:text-ink active:bg-line disabled:opacity-40 disabled:hover:bg-transparent',
            'aria-pressed:bg-primary-soft aria-pressed:text-primary-strong',
            size === 'md' ? 'size-11 md:size-9' : 'size-9 md:size-8',
            className,
          )}
          {...rest}
        >
          {children}
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side={tooltipSide}
          sideOffset={6}
          className="z-(--z-tooltip) rounded-control border border-line bg-surface-2 px-2 py-1 text-xs text-ink shadow-lg shadow-black/30"
        >
          {label}
          {hint && <span className="ml-1.5 text-ink-faint">{hint}</span>}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
})
