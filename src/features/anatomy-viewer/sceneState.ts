import {
  MESH_MODULE,
  MESH_OWNER,
  STRUCTURES,
  STRUCTURE_BY_ID,
  filterStructures,
  meshIdsDeep,
} from '@/features/anatomy-catalog/catalog'
import type { CategoryId, FunctionTag, RegionId } from '@/features/anatomy-catalog/types'

export type MeshDisplay = 'solid' | 'ghost' | 'hidden'

export interface SceneInput {
  categories: CategoryId[]
  regions: RegionId[]
  functions: FunctionTag[]
  query: string
  context: 'hide' | 'ghost'
  ghostCategories: CategoryId[]
  hiddenIds: string[]
  isolatedIds: string[] | null
  selectedId: string | null
}

export interface SceneState {
  display: Map<string, MeshDisplay>
  selectedMeshes: Set<string>
  modules: Set<string>
  /** Structures matching the filters (all of them, with or without 3D). */
  matchingIds: Set<string>
  visibleCount: number
}

const ANCESTORS = new Map<string, string[]>()
for (const s of STRUCTURES) {
  const chain: string[] = [s.id]
  let p = s.parentId
  while (p && !chain.includes(p)) {
    chain.push(p)
    p = STRUCTURE_BY_ID.get(p)?.parentId
  }
  ANCESTORS.set(s.id, chain)
}

const anyInChain = (structureId: string, set: Set<string>) => (ANCESTORS.get(structureId) ?? [structureId]).some((id) => set.has(id))

export function computeSceneState(input: SceneInput): SceneState {
  const matching =
    input.categories.length === 0
      ? []
      : filterStructures({ categories: input.categories, regions: input.regions, functions: input.functions, query: input.query, only3D: false })
  const matchingIds = new Set(matching.map((s) => s.id))
  const hidden = new Set(input.hiddenIds)
  const isolated = input.isolatedIds ? new Set(input.isolatedIds) : null
  const ghostCats = new Set(input.ghostCategories)
  const selectedMeshes = new Set(input.selectedId ? meshIdsDeep(input.selectedId) : [])
  const outside: MeshDisplay = input.context === 'ghost' ? 'ghost' : 'hidden'

  const display = new Map<string, MeshDisplay>()
  const modules = new Set<string>()
  let visibleCount = 0

  for (const [meshId, owner] of MESH_OWNER) {
    const s = STRUCTURE_BY_ID.get(owner)
    if (!s) continue
    let d: MeshDisplay
    if (selectedMeshes.has(meshId)) d = 'solid'
    else if (isolated) d = anyInChain(owner, isolated) ? 'solid' : outside
    else if (anyInChain(owner, hidden)) d = 'hidden'
    else if (anyInChain(owner, matchingIds)) d = ghostCats.has(s.categories[0]!) ? 'ghost' : 'solid'
    else d = outside
    display.set(meshId, d)
    if (d !== 'hidden') {
      const m = MESH_MODULE.get(meshId)
      if (m) modules.add(m)
      if (d === 'solid') visibleCount++
    }
  }
  return { display, selectedMeshes, modules, matchingIds, visibleCount }
}
