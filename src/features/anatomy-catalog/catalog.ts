import Fuse from 'fuse.js'
import { MODEL_MANIFEST, buildCatalog } from './data/build'
import { REFERENCE_BY_ID } from './data/references'
import { CATEGORY_LABELS, FUNCTION_LABELS, REGION_LABELS } from './labels'
import type { AnatomicalStructure, CategoryId, ContentField, FunctionTag, RegionId, VerificationStatus } from './types'
import { CONTENT_FIELDS } from './types'

export const STRUCTURES: AnatomicalStructure[] = buildCatalog()
export const STRUCTURE_BY_ID = new Map(STRUCTURES.map((s) => [s.id, s]))

/** mesh id -> GLB module id */
export const MESH_MODULE = new Map<string, string>()
for (const [moduleId, meshes] of Object.entries(MODEL_MANIFEST)) {
  for (const meshId of Object.keys(meshes)) MESH_MODULE.set(meshId, moduleId)
}

/** mesh id -> structure that owns it */
export const MESH_OWNER = new Map<string, string>()
for (const s of STRUCTURES) for (const m of s.meshIds) MESH_OWNER.set(m, s.id)

export const CHILDREN = new Map<string, string[]>()
for (const s of STRUCTURES) {
  if (!s.parentId) continue
  CHILDREN.set(s.parentId, [...(CHILDREN.get(s.parentId) ?? []), s.id])
}

const deepCache = new Map<string, string[]>()
/** Mesh ids of a structure and all its descendants (a parent like "masseter" owns no mesh but its parts do). */
export function meshIdsDeep(id: string): string[] {
  const cached = deepCache.get(id)
  if (cached) return cached
  const s = STRUCTURE_BY_ID.get(id)
  const own = (s?.meshIds ?? []).filter((m) => MESH_MODULE.has(m))
  const result = [...own, ...(CHILDREN.get(id) ?? []).flatMap((c) => meshIdsDeep(c))]
  deepCache.set(id, result)
  return result
}

/** A structure is "in 3D" only when at least one of its (or its parts') meshes exists in a GLB module. */
export function isIn3D(id: string): boolean {
  return meshIdsDeep(id).length > 0
}

/** Nearest ancestor that is represented in 3D (used to locate features such as foramina on their bone). */
export function nearestAncestorIn3D(id: string): AnatomicalStructure | undefined {
  let current = STRUCTURE_BY_ID.get(id)?.parentId
  const seen = new Set<string>()
  while (current && !seen.has(current)) {
    seen.add(current)
    if (isIn3D(current)) return STRUCTURE_BY_ID.get(current)
    current = STRUCTURE_BY_ID.get(current)?.parentId
  }
  return undefined
}

export function modulesFor(meshIds: string[]): string[] {
  return [...new Set(meshIds.map((m) => MESH_MODULE.get(m)).filter((m): m is string => !!m))]
}

export function presentFields(s: AnatomicalStructure): ContentField[] {
  return CONTENT_FIELDS.filter((f) => s.content[f] !== undefined)
}

export function supportedFields(s: AnatomicalStructure): Set<ContentField> {
  const set = new Set<ContentField>()
  for (const ref of s.references) {
    if (!REFERENCE_BY_ID.has(ref.sourceId)) continue
    for (const f of ref.fields) if (s.content[f] !== undefined) set.add(f)
  }
  return set
}

/** Status is derived from data: a field counts as verified only when a citation explicitly supports it. */
export function verificationStatus(s: AnatomicalStructure): VerificationStatus {
  const present = presentFields(s)
  if (present.length === 0) return 'unavailable'
  const supported = supportedFields(s)
  if (supported.size === 0) return 'pending'
  return present.every((f) => supported.has(f)) ? 'verified' : 'partial'
}

export function structuresIn(category: CategoryId): AnatomicalStructure[] {
  return STRUCTURES.filter((s) => s.categories.includes(category))
}

// ------------------------------------------------------------------ Search
export interface SearchDoc {
  id: string
  name: string
  latinName: string
  synonyms: string[]
  clinicalTerms: string[]
  categories: string[]
  regions: string[]
}

const searchDocs: SearchDoc[] = STRUCTURES.map((s) => ({
  id: s.id,
  name: s.name,
  latinName: s.latinName ?? '',
  synonyms: s.synonyms,
  clinicalTerms: s.clinicalTerms,
  categories: s.categories.map((c) => CATEGORY_LABELS[c]),
  regions: s.regions.map((r) => REGION_LABELS[r]),
}))

const fuse = new Fuse(searchDocs, {
  keys: [
    { name: 'name', weight: 3 },
    { name: 'synonyms', weight: 2 },
    { name: 'latinName', weight: 2 },
    { name: 'clinicalTerms', weight: 1.5 },
    { name: 'categories', weight: 0.6 },
    { name: 'regions', weight: 0.6 },
  ],
  threshold: 0.32,
  ignoreLocation: true,
  ignoreDiacritics: true,
  minMatchCharLength: 2,
})

export function searchStructures(query: string, limit = 12): AnatomicalStructure[] {
  const q = query.trim()
  if (q.length < 2) return []
  return fuse
    .search(q, { limit })
    .map((r) => STRUCTURE_BY_ID.get(r.item.id))
    .filter((s): s is AnatomicalStructure => !!s)
}

// ------------------------------------------------------------------ Filters
export interface FilterState {
  categories: CategoryId[]
  regions: RegionId[]
  functions: FunctionTag[]
  query: string
  only3D: boolean
}

export function filterStructures(f: FilterState): AnatomicalStructure[] {
  const base = f.query.trim().length >= 2 ? searchStructures(f.query, 500) : STRUCTURES
  return base.filter(
    (s) =>
      (f.categories.length === 0 || s.categories.some((c) => f.categories.includes(c))) &&
      (f.regions.length === 0 || s.regions.some((r) => f.regions.includes(r))) &&
      (f.functions.length === 0 || s.functionTags.some((t) => f.functions.includes(t))) &&
      (!f.only3D || isIn3D(s.id)),
  )
}

export function categoryCounts(): Record<CategoryId, { total: number; in3D: number }> {
  const out = {} as Record<CategoryId, { total: number; in3D: number }>
  for (const c of Object.keys(CATEGORY_LABELS) as CategoryId[]) {
    const list = structuresIn(c)
    out[c] = { total: list.length, in3D: list.filter((s) => s.meshIds.length > 0).length }
  }
  return out
}

export { CATEGORY_LABELS, FUNCTION_LABELS, REGION_LABELS }
