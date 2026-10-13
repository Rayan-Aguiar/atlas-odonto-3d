import { create } from 'zustand'
import { STRUCTURE_BY_ID } from '@/features/anatomy-catalog/catalog'
import type { CategoryId, FunctionTag, RegionId } from '@/features/anatomy-catalog/types'

export type ViewName = 'anterior' | 'posterior' | 'right' | 'left' | 'superior' | 'inferior' | 'oblique'

export type CameraCommand =
  | { type: 'view'; view: ViewName }
  | { type: 'focus'; structureId: string }
  | { type: 'fit' }
  | { type: 'reset' }
  | { type: 'custom-save' }
  | { type: 'custom-restore' }

export type ModuleStatus = 'idle' | 'loading' | 'ready' | 'error'

export const DEFAULT_CATEGORIES: CategoryId[] = ['bones', 'teeth']

interface ViewerState {
  // selection
  selectedId: string | null
  /** The exact mesh the user clicked (side-specific), when selection came from the 3D view. */
  selectedMeshId: string | null
  hoveredMeshId: string | null
  // filters that drive the scene
  categories: CategoryId[]
  regions: RegionId[]
  functions: FunctionTag[]
  query: string
  /** How meshes outside the filter are drawn. */
  context: 'hide' | 'ghost'
  /** Categories rendered translucent (e.g. bones, to reveal deep structures). */
  ghostCategories: CategoryId[]
  hiddenIds: string[]
  isolatedIds: string[] | null
  // camera
  cameraCommand: (CameraCommand & { nonce: number }) | null
  autoFocus: boolean
  // loading
  moduleStatus: Record<string, ModuleStatus>
  moduleErrors: Record<string, string>
  retryNonce: Record<string, number>

  select: (id: string | null, meshId?: string | null, options?: { focus?: boolean }) => void
  setHovered: (meshId: string | null) => void
  toggleCategory: (c: CategoryId) => void
  setCategories: (c: CategoryId[]) => void
  toggleRegion: (r: RegionId) => void
  toggleFunction: (f: FunctionTag) => void
  setQuery: (q: string) => void
  clearFilters: () => void
  setContext: (c: 'hide' | 'ghost') => void
  toggleGhostCategory: (c: CategoryId) => void
  toggleHidden: (id: string) => void
  showAll: () => void
  isolate: (ids: string[] | null) => void
  hideOthers: () => void
  restoreDefault: () => void
  camera: (cmd: CameraCommand) => void
  setAutoFocus: (v: boolean) => void
  setModuleStatus: (id: string, status: ModuleStatus, error?: string) => void
  retryModule: (id: string) => void
}

const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
let nonce = 0

export const useViewer = create<ViewerState>()((set, get) => ({
  selectedId: null,
  selectedMeshId: null,
  hoveredMeshId: null,
  categories: DEFAULT_CATEGORIES,
  regions: [],
  functions: [],
  query: '',
  context: 'hide',
  ghostCategories: [],
  hiddenIds: [],
  isolatedIds: null,
  cameraCommand: null,
  autoFocus: true,
  moduleStatus: {},
  moduleErrors: {},
  retryNonce: {},

  select: (id, meshId = null, options) => {
    if (id && !STRUCTURE_BY_ID.has(id)) return
    const s = id ? STRUCTURE_BY_ID.get(id) : undefined
    const patch: Partial<ViewerState> = { selectedId: id, selectedMeshId: meshId }
    if (s) {
      // Make sure the structure's category is on, so the selection is actually visible.
      const { categories, hiddenIds } = get()
      if (!s.categories.some((c) => categories.includes(c))) patch.categories = [...categories, s.categories[0]!]
      if (hiddenIds.includes(s.id)) patch.hiddenIds = hiddenIds.filter((h) => h !== s.id)
    }
    set(patch)
    if (id && (options?.focus ?? get().autoFocus)) get().camera({ type: 'focus', structureId: id })
  },
  setHovered: (meshId) => {
    if (get().hoveredMeshId !== meshId) set({ hoveredMeshId: meshId })
  },
  toggleCategory: (c) => set((s) => ({ categories: toggle(s.categories, c) })),
  setCategories: (categories) => set({ categories }),
  toggleRegion: (r) => set((s) => ({ regions: toggle(s.regions, r) })),
  toggleFunction: (f) => set((s) => ({ functions: toggle(s.functions, f) })),
  setQuery: (query) => set({ query }),
  clearFilters: () => set({ categories: DEFAULT_CATEGORIES, regions: [], functions: [], query: '' }),
  setContext: (context) => set({ context }),
  toggleGhostCategory: (c) => set((s) => ({ ghostCategories: toggle(s.ghostCategories, c) })),
  toggleHidden: (id) => set((s) => ({ hiddenIds: toggle(s.hiddenIds, id) })),
  showAll: () => set({ hiddenIds: [], isolatedIds: null }),
  isolate: (ids) => set({ isolatedIds: ids && ids.length ? ids : null }),
  hideOthers: () => {
    const id = get().selectedId
    if (id) set({ isolatedIds: [id] })
  },
  restoreDefault: () => {
    set({
      categories: DEFAULT_CATEGORIES,
      regions: [],
      functions: [],
      query: '',
      context: 'hide',
      ghostCategories: [],
      hiddenIds: [],
      isolatedIds: null,
      selectedId: null,
      selectedMeshId: null,
    })
    get().camera({ type: 'reset' })
  },
  camera: (cmd) => set({ cameraCommand: { ...cmd, nonce: ++nonce } }),
  setAutoFocus: (autoFocus) => set({ autoFocus }),
  setModuleStatus: (id, status, error) =>
    set((s) => {
      if (s.moduleStatus[id] === status && !error) return s
      const moduleErrors = { ...s.moduleErrors }
      if (error) moduleErrors[id] = error
      else delete moduleErrors[id]
      return { moduleStatus: { ...s.moduleStatus, [id]: status }, moduleErrors }
    }),
  retryModule: (id) =>
    set((s) => ({
      retryNonce: { ...s.retryNonce, [id]: (s.retryNonce[id] ?? 0) + 1 },
      moduleStatus: { ...s.moduleStatus, [id]: 'loading' },
    })),
}))
