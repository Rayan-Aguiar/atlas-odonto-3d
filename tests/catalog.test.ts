import { describe, expect, it } from 'vitest'
import {
  CHILDREN,
  MESH_MODULE,
  MESH_OWNER,
  STRUCTURES,
  STRUCTURE_BY_ID,
  isIn3D,
  meshIdsDeep,
  nearestAncestorIn3D,
  verificationStatus,
} from '@/features/anatomy-catalog/catalog'
import { MODEL_MANIFEST } from '@/features/anatomy-catalog/data/build'
import { REFERENCE_BY_ID } from '@/features/anatomy-catalog/data/references'
import ta2 from '@/features/anatomy-catalog/data/ta2-terms.json'
import { structureSchema } from '@/features/anatomy-catalog/schema'

const ta2Latin = new Map<string, Set<string>>()
for (const t of Object.values(ta2 as Record<string, { ta2Id: string; la: string }>)) {
  ta2Latin.set(t.ta2Id, (ta2Latin.get(t.ta2Id) ?? new Set()).add(t.la))
}

describe('catálogo anatômico', () => {
  it('todas as estruturas passam no esquema Zod', () => {
    for (const s of STRUCTURES) {
      const r = structureSchema.safeParse(s)
      expect(r.success, `${s.id}: ${r.success ? '' : r.error.message}`).toBe(true)
    }
  })

  it('ids são únicos', () => {
    expect(new Set(STRUCTURES.map((s) => s.id)).size).toBe(STRUCTURES.length)
  })

  it('nenhum nome ficou igual ao id (nomenclatura ausente)', () => {
    const missing = STRUCTURES.filter((s) => s.name === s.id).map((s) => s.id)
    expect(missing).toEqual([])
  })

  it('cada malha do modelo pertence a exatamente uma estrutura', () => {
    const owners = new Map<string, string[]>()
    for (const s of STRUCTURES) for (const m of s.meshIds) owners.set(m, [...(owners.get(m) ?? []), s.id])
    const allMeshes = Object.values(MODEL_MANIFEST).flatMap((meshes) => Object.keys(meshes))
    const orphan = allMeshes.filter((m) => !owners.has(m))
    const duplicated = [...owners].filter(([, ids]) => ids.length > 1)
    expect(orphan).toEqual([])
    expect(duplicated).toEqual([])
  })

  it('nenhuma estrutura declara malha inexistente', () => {
    const bad = STRUCTURES.flatMap((s) => s.meshIds.filter((m) => !MESH_MODULE.has(m)).map((m) => `${s.id}:${m}`))
    expect(bad).toEqual([])
    expect(MESH_OWNER.size).toBe(MESH_MODULE.size)
  })

  it('relações e pais apontam para estruturas existentes', () => {
    const broken: string[] = []
    for (const s of STRUCTURES) {
      for (const r of s.relatedStructures) if (!STRUCTURE_BY_ID.has(r)) broken.push(`${s.id} -> ${r}`)
      if (s.parentId && !STRUCTURE_BY_ID.has(s.parentId)) broken.push(`${s.id} parent ${s.parentId}`)
    }
    expect(broken).toEqual([])
  })

  it('a hierarquia não tem ciclos', () => {
    for (const s of STRUCTURES) {
      const seen = new Set<string>()
      let cur: string | undefined = s.id
      while (cur) {
        expect(seen.has(cur), `ciclo em ${s.id}`).toBe(false)
        seen.add(cur)
        cur = STRUCTURE_BY_ID.get(cur)?.parentId
      }
    }
  })

  it('toda citação aponta para uma fonte registrada', () => {
    const bad = STRUCTURES.flatMap((s) => s.references.filter((r) => !REFERENCE_BY_ID.has(r.sourceId)).map((r) => `${s.id}:${r.sourceId}`))
    expect(bad).toEqual([])
  })

  it('o nome latino confere com a TA2 quando há ta2Id', () => {
    const bad = STRUCTURES.filter((s) => s.ta2Id && !(s.latinName && ta2Latin.get(s.ta2Id)?.has(s.latinName))).map((s) => s.id)
    expect(bad).toEqual([])
  })

  it('estruturas sem conteúdo descritivo não são marcadas como verificadas', () => {
    for (const s of STRUCTURES) {
      if (Object.keys(s.content).length === 0) expect(verificationStatus(s)).toBe('unavailable')
    }
  })

  it('estruturas-pai sem malha própria herdam a representação 3D das partes', () => {
    expect(STRUCTURE_BY_ID.get('masseter')?.meshIds).toEqual([])
    expect(isIn3D('masseter')).toBe(true)
    expect(meshIdsDeep('masseter')).toEqual(expect.arrayContaining(['superficial-part-of-masseter__l', 'deep-part-of-masseter__r']))
    expect(CHILDREN.get('masseter')).toEqual(expect.arrayContaining(['superficial-part-of-masseter', 'deep-part-of-masseter']))
  })

  it('forames não têm malha e são localizados pelo osso relacionado', () => {
    expect(isIn3D('mandibular-foramen')).toBe(false)
    expect(nearestAncestorIn3D('mandibular-foramen')?.id).toBe('mandible')
  })

  it('dentes usam notação FDI correta', () => {
    expect(STRUCTURE_BY_ID.get('upper-medial-incisor-r')?.toothNumber).toBe(11)
    expect(STRUCTURE_BY_ID.get('upper-second-molar-tooth-l')?.toothNumber).toBe(27)
    expect(STRUCTURE_BY_ID.get('lower-canine-l')?.toothNumber).toBe(33)
    expect(STRUCTURE_BY_ID.get('lower-first-molar-tooth-r')?.toothNumber).toBe(46)
  })
})
