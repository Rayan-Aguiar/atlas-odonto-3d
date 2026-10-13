import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { computeSceneState } from '../sceneState'
import { useViewer } from '../store'

export function useSceneState() {
  const input = useViewer(
    useShallow((s) => ({
      categories: s.categories,
      regions: s.regions,
      functions: s.functions,
      query: s.query,
      context: s.context,
      ghostCategories: s.ghostCategories,
      hiddenIds: s.hiddenIds,
      isolatedIds: s.isolatedIds,
      selectedId: s.selectedId,
    })),
  )
  return useMemo(() => computeSceneState(input), [input])
}

export const MODULE_LABELS: Record<string, string> = {
  bones: 'ossos e cartilagens',
  teeth: 'dentes',
  muscles: 'músculos',
  vessels: 'vasos sanguíneos',
  nerves: 'nervos',
  viscera: 'glândulas e vísceras',
  joints: 'articulações e ligamentos',
  lymph: 'linfonodos',
}
