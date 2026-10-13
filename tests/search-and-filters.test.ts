import { beforeEach, describe, expect, it } from 'vitest'
import { filterStructures, isIn3D, searchStructures } from '@/features/anatomy-catalog/catalog'
import { computeSceneState } from '@/features/anatomy-viewer/sceneState'
import { DEFAULT_CATEGORIES, useViewer } from '@/features/anatomy-viewer/store'

const baseScene = {
  categories: [] as never[],
  regions: [],
  functions: [],
  query: '',
  context: 'hide' as const,
  ghostCategories: [],
  hiddenIds: [],
  isolatedIds: null,
  selectedId: null,
}

describe('pesquisa', () => {
  it('encontra por nome em português, ignorando acentos', () => {
    expect(searchStructures('mandibula')[0]?.id).toBe('mandible')
    expect(searchStructures('Nervo alveolar inferior')[0]?.id).toBe('inferior-alveolar-nerve')
  })

  it('encontra por sinônimo', () => {
    expect(searchStructures('mentoniano').map((s) => s.id)).toEqual(expect.arrayContaining(['mental-nerve']))
    expect(searchStructures('ducto de Wharton')[0]?.id).toBe('submandibular-duct')
  })

  it('encontra por nomenclatura latina', () => {
    expect(searchStructures('Nervus alveolaris inferior')[0]?.id).toBe('inferior-alveolar-nerve')
  })

  it('encontra por termo clínico', () => {
    expect(searchStructures('trismo').map((s) => s.id)).toEqual(expect.arrayContaining(['masseter']))
  })

  it('ignora consultas muito curtas', () => {
    expect(searchStructures('a')).toEqual([])
  })
})

describe('filtros', () => {
  it('filtra por categoria e combina categorias', () => {
    const nerves = filterStructures({ categories: ['nerves'], regions: [], functions: [], query: '', only3D: false })
    expect(nerves.every((s) => s.categories.includes('nerves'))).toBe(true)
    const both = filterStructures({ categories: ['nerves', 'arteries'], regions: [], functions: [], query: '', only3D: false })
    expect(both.length).toBeGreaterThan(nerves.length)
  })

  it('filtra por região e por função', () => {
    const tmj = filterStructures({ categories: ['joints', 'muscles'], regions: ['tmj'], functions: [], query: '', only3D: false })
    expect(tmj.map((s) => s.id)).toEqual(expect.arrayContaining(['temporomandibular-joint', 'lateral-pterygoid']))
    const mastication = filterStructures({ categories: ['muscles'], regions: [], functions: ['mastication'], query: '', only3D: false })
    expect(mastication.map((s) => s.id)).toEqual(expect.arrayContaining(['masseter', 'temporalis-muscle', 'medial-pterygoid-muscle']))
    expect(mastication.map((s) => s.id)).not.toContain('sternohyoid-muscle')
  })

  it('pode restringir a estruturas com representação 3D', () => {
    const foramina = filterStructures({ categories: ['foramina'], regions: [], functions: [], query: '', only3D: true })
    expect(foramina).toEqual([])
  })
})

describe('estado da cena 3D', () => {
  it('sem categorias, nenhuma malha é exibida', () => {
    const scene = computeSceneState(baseScene)
    expect(scene.visibleCount).toBe(0)
    expect(scene.modules.size).toBe(0)
  })

  it('os filtros controlam as malhas realmente exibidas e os módulos carregados', () => {
    const scene = computeSceneState({ ...baseScene, categories: ['bones'] })
    expect(scene.display.get('mandible')).toBe('solid')
    expect(scene.display.get('superficial-part-of-masseter__l')).toBe('hidden')
    expect([...scene.modules]).toEqual(['bones'])
  })

  it('estruturas fora do filtro podem aparecer translúcidas como contexto', () => {
    const scene = computeSceneState({ ...baseScene, categories: ['bones'], context: 'ghost' })
    expect(scene.display.get('superficial-part-of-masseter__l')).toBe('ghost')
  })

  it('camada translúcida torna a categoria fantasma sem ocultá-la', () => {
    const scene = computeSceneState({ ...baseScene, categories: ['bones', 'nerves'], ghostCategories: ['bones'] })
    expect(scene.display.get('mandible')).toBe('ghost')
    expect(scene.display.get('inferior-alveolar-nerve__l')).toBe('solid')
  })

  it('ocultar uma estrutura-pai oculta todas as suas partes', () => {
    const scene = computeSceneState({ ...baseScene, categories: ['muscles'], hiddenIds: ['masseter'] })
    expect(scene.display.get('superficial-part-of-masseter__r')).toBe('hidden')
    expect(scene.display.get('deep-part-of-masseter__l')).toBe('hidden')
    expect(scene.display.get('temporalis-muscle__l')).toBe('solid')
  })

  it('isolamento mostra apenas a estrutura isolada', () => {
    const scene = computeSceneState({ ...baseScene, categories: ['bones', 'muscles'], isolatedIds: ['mandible'] })
    expect(scene.display.get('mandible')).toBe('solid')
    expect(scene.display.get('maxilla__l')).toBe('hidden')
    expect(scene.visibleCount).toBe(1)
  })

  it('a estrutura selecionada fica sempre sólida', () => {
    const scene = computeSceneState({ ...baseScene, categories: ['bones'], ghostCategories: ['bones'], selectedId: 'mandible' })
    expect(scene.display.get('mandible')).toBe('solid')
    expect(scene.selectedMeshes.has('mandible')).toBe(true)
  })
})

describe('seleção (store)', () => {
  beforeEach(() => useViewer.getState().restoreDefault())

  it('selecionar ativa a categoria da estrutura para que ela apareça no 3D', () => {
    expect(useViewer.getState().categories).toEqual(DEFAULT_CATEGORIES)
    useViewer.getState().select('masseter')
    expect(useViewer.getState().selectedId).toBe('masseter')
    expect(useViewer.getState().categories).toContain('muscles')
    expect(useViewer.getState().cameraCommand).toMatchObject({ type: 'focus', structureId: 'masseter' })
  })

  it('selecionar uma estrutura oculta volta a exibi-la', () => {
    useViewer.getState().toggleHidden('mandible')
    useViewer.getState().select('mandible')
    expect(useViewer.getState().hiddenIds).not.toContain('mandible')
  })

  it('ids inexistentes são ignorados', () => {
    useViewer.getState().select('estrutura-inventada')
    expect(useViewer.getState().selectedId).toBeNull()
  })

  it('restaurar a visualização padrão limpa filtros, isolamento e seleção', () => {
    const s = useViewer.getState()
    s.select('mandible')
    s.isolate(['mandible'])
    s.toggleRegion('tmj')
    s.restoreDefault()
    const after = useViewer.getState()
    expect(after.selectedId).toBeNull()
    expect(after.isolatedIds).toBeNull()
    expect(after.regions).toEqual([])
  })

  it('forames são registros textuais sem 3D', () => {
    expect(isIn3D('foramen-ovale')).toBe(false)
  })
})
