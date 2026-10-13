import { type RefObject, useEffect, useRef } from 'react'
import { MESH_OWNER, STRUCTURE_BY_ID } from '@/features/anatomy-catalog/catalog'
import { useUi } from '@/app/uiStore'
import { sideOfMesh } from '../meshSide'
import { useViewer } from '../store'

/** Name tooltip that follows the mouse. Position is written straight to the DOM to avoid React renders per pointer move. */
export function HoverLabel({ container }: { container: RefObject<HTMLDivElement | null> }) {
  const label = useRef<HTMLDivElement>(null)
  const hovered = useViewer((s) => s.hoveredMeshId)
  const studyActive = useUi((s) => s.studyActive)

  useEffect(() => {
    const el = container.current
    if (!el) return
    const move = (e: PointerEvent) => {
      const node = label.current
      if (!node) return
      if (e.pointerType === 'touch') {
        node.style.opacity = '0'
        return
      }
      const rect = el.getBoundingClientRect()
      node.style.transform = `translate(${e.clientX - rect.left + 14}px, ${e.clientY - rect.top + 14}px)`
    }
    el.addEventListener('pointermove', move)
    return () => el.removeEventListener('pointermove', move)
  }, [container])

  const owner = hovered ? MESH_OWNER.get(hovered) : undefined
  // Names stay hidden during a study session so the hover label does not give answers away.
  const structure = owner && !studyActive ? STRUCTURE_BY_ID.get(owner) : undefined
  const side = hovered ? sideOfMesh(hovered) : null

  return (
    <div
      ref={label}
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 z-(--z-tooltip) max-w-64 rounded-control border border-line bg-surface/95 px-2.5 py-1.5 text-xs shadow-lg shadow-black/30 transition-opacity duration-150"
      style={{ opacity: structure ? 1 : 0 }}
    >
      {structure && (
        <>
          <span className="font-medium text-ink">{structure.name}</span>
          {side && structure.side === 'bilateral' && <span className="text-ink-muted"> · {side}</span>}
        </>
      )}
    </div>
  )
}
