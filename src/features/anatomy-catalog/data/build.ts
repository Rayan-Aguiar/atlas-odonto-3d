import manifestJson from '@/data/model-manifest.json'
import type { AnatomicalStructure, CategoryId, FunctionTag, RegionId } from '../types'
import { ANGIOLOGY } from './content/angiology'
import type { StructureDraft } from './content/helpers'
import { MYOLOGY } from './content/myology'
import { NEUROLOGY } from './content/neurology'
import { OSTEOLOGY } from './content/osteology'
import { SPLANCHNOLOGY, toothDraft } from './content/splanchnology'
import { NOMENCLATURE, TEETH } from './nomenclature'
import ta2Json from './ta2-terms.json'

export interface MeshInfo {
  source: string | null
  min: [number, number, number]
  max: [number, number, number]
}
export type ModelManifest = Record<string, Record<string, MeshInfo>>

export const MODEL_MANIFEST = manifestJson as unknown as ModelManifest
const TA2 = ta2Json as Record<string, { ta2Id: string; en: string; la: string }>

const SIDE_SUFFIX = /__(l|r)$/

/** English term (as in TA2/Z-Anatomy) for structures defined only in content files. */
const TEXT_ONLY_TERMS: Record<string, string> = {
  masseter: 'Masseter',
  'lateral-pterygoid': 'Lateral pterygoid muscle',
  digastric: 'Digastric muscle',
  'orbicularis-oculi': 'Orbicularis oculi muscle',
  'thyro-arytenoid': 'Thyro-arytenoid muscle',
  'mandibular-nerve': 'Mandibular nerve',
  'common-carotid-artery': 'Common carotid artery',
  'sphenopalatine-artery': 'Sphenopalatine artery',
  'temporomandibular-joint': 'Temporomandibular joint',
  styloglossus: 'Styloglossus muscle',
  palatoglossus: 'Palatoglossus muscle',
  'infra-orbital-nerve': 'Infra-orbital nerve',
  'auriculotemporal-nerve': 'Auriculotemporal nerve',
  'nasopalatine-nerve': 'Nasopalatine nerve',
  'greater-palatine-nerve': 'Greater palatine nerve',
  'lingual-artery': 'Lingual artery',
  'pterygoid-venous-plexus': 'Pterygoid venous plexus',
  'maxillary-sinus': 'Maxillary sinus',
  'coronoid-process': 'Coronoid process of mandible',
  'condylar-process': 'Condylar process',
  'mandibular-fossa': 'Mandibular fossa',
  'articular-tubercle': 'Articular tubercle',
  'styloid-process': 'Styloid process of temporal bone',
  'mastoid-process': 'Mastoid process',
  'pterygomandibular-raphe': 'Pterygomandibular raphe',
  'supra-orbital-foramen': 'Supra-orbital foramen',
  'infra-orbital-foramen': 'Infra-orbital foramen',
  'optic-canal': 'Optic canal',
  'superior-orbital-fissure': 'Superior orbital fissure',
  'inferior-orbital-fissure': 'Inferior orbital fissure',
  'foramen-rotundum': 'Foramen rotundum',
  'foramen-ovale': 'Foramen ovale',
  'foramen-spinosum': 'Foramen spinosum',
  'foramen-lacerum': 'Foramen lacerum',
  'carotid-canal': 'Carotid canal',
  'internal-acoustic-meatus': 'Internal acoustic meatus',
  'stylomastoid-foramen': 'Stylomastoid foramen',
  'jugular-foramen': 'Jugular foramen',
  'hypoglossal-canal': 'Hypoglossal canal',
  'foramen-magnum': 'Foramen magnum',
  'mandibular-canal': 'Mandibular canal',
  'mental-foramen': 'Mental foramen',
  'incisive-canal': 'Incisive canals',
  'greater-palatine-foramen': 'Greater palatine foramen',
  'permanent-dentition': 'Permanent teeth',
}

/** Latin terms for structures absent from the TA2 term list (sourced from Gray 1918 / classical usage). */
const LATIN_FALLBACK: Record<string, string> = {
  'mandibular-foramen': 'Foramen mandibulae',
  'olfactory-foramina': 'Foramina cribrosa',
  'posterior-superior-alveolar-nerves': 'Rami alveolares superiores posteriores',
}

const words = (s: string) => s.split(/\s+/).filter(Boolean)

function emptyStructure(id: string): AnatomicalStructure {
  return {
    id,
    name: id,
    synonyms: [],
    categories: ['other'],
    regions: ['viscerocranium'],
    functionTags: [],
    side: 'bilateral',
    content: {},
    clinicalTerms: [],
    relatedStructures: [],
    meshIds: [],
    references: [],
  }
}

function meshIdsByBase(): Map<string, string[]> {
  const map = new Map<string, string[]>()
  for (const meshes of Object.values(MODEL_MANIFEST)) {
    for (const meshId of Object.keys(meshes)) {
      const base = meshId.replace(SIDE_SUFFIX, '')
      map.set(base, [...(map.get(base) ?? []), meshId])
    }
  }
  return map
}

function zanatomyEnglish(meshId: string): string | null {
  for (const meshes of Object.values(MODEL_MANIFEST)) {
    const info = meshes[meshId]
    if (info?.source) return info.source.replace(/\.(l|r)$/, '')
  }
  return null
}

function applyDraft(target: AnatomicalStructure, draft: StructureDraft): AnatomicalStructure {
  return {
    ...target,
    ...draft,
    content: { ...target.content, ...draft.content },
    synonyms: [...new Set([...target.synonyms, ...(draft.synonyms ?? [])])],
    relatedStructures: [...new Set([...target.relatedStructures, ...(draft.relatedStructures ?? [])])],
    clinicalTerms: [...new Set([...target.clinicalTerms, ...(draft.clinicalTerms ?? [])])],
    references: [...target.references, ...(draft.references ?? [])],
    meshIds: draft.meshIds ?? target.meshIds,
  }
}

export function buildCatalog(): AnatomicalStructure[] {
  const byId = new Map<string, AnatomicalStructure>()
  const bases = meshIdsByBase()

  // 1. Structures generated from mesh nomenclature.
  for (const [base, [name, cats, regions, tags, opts]] of Object.entries(NOMENCLATURE)) {
    const meshIds = bases.get(base) ?? []
    const english = meshIds[0] ? zanatomyEnglish(meshIds[0]) : null
    const term = english ? TA2[english] : undefined
    byId.set(base, {
      ...emptyStructure(base),
      name,
      latinName: term?.la,
      ta2Id: term?.ta2Id,
      categories: words(cats) as CategoryId[],
      regions: words(regions) as RegionId[],
      functionTags: words(tags) as FunctionTag[],
      subCategory: opts?.sub,
      parentId: opts?.parent,
      synonyms: opts?.synonyms ?? [],
      side: meshIds.some((m) => m.endsWith('__l')) ? 'bilateral' : 'median',
      meshIds,
    })
  }

  // 2. Teeth: one structure per tooth (FDI).
  for (const [base, [name, position]] of Object.entries(TEETH)) {
    for (const side of ['r', 'l'] as const) {
      const draft = toothDraft(base, side, name, position)
      const english = zanatomyEnglish(`${base}__${side}`)
      const term = english ? TA2[english] : undefined
      byId.set(draft.id, applyDraft({ ...emptyStructure(draft.id), latinName: term?.la, ta2Id: term?.ta2Id }, draft))
    }
  }

  // 3. Content overlays and text-only structures.
  for (const draft of [...MYOLOGY, ...NEUROLOGY, ...ANGIOLOGY, ...OSTEOLOGY, ...SPLANCHNOLOGY]) {
    const existing = byId.get(draft.id)
    if (existing) {
      byId.set(draft.id, applyDraft(existing, draft))
      continue
    }
    const english = TEXT_ONLY_TERMS[draft.id]
    const term = english ? TA2[english] : undefined
    byId.set(
      draft.id,
      applyDraft(
        { ...emptyStructure(draft.id), latinName: term?.la ?? LATIN_FALLBACK[draft.id], ta2Id: term?.ta2Id },
        draft,
      ),
    )
  }

  // 4. Children lists are implicit (parentId); ensure every parent links back through relatedStructures.
  for (const s of byId.values()) {
    if (s.parentId && byId.has(s.parentId) && !s.relatedStructures.includes(s.parentId)) {
      s.relatedStructures = [s.parentId, ...s.relatedStructures]
    }
  }

  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
}
