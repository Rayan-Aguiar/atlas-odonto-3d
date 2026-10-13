export const CATEGORY_IDS = [
  'bones',
  'muscles',
  'arteries',
  'veins',
  'nerves',
  'foramina',
  'teeth',
  'joints',
  'glands',
  'oral',
  'tongue',
  'pharynx-larynx',
  'lymph',
  'other',
] as const
export type CategoryId = (typeof CATEGORY_IDS)[number]

export const REGION_IDS = [
  // Ordered by relevance to dental study (the filter UI shows the first ones by default).
  'oral-cavity',
  'mandible',
  'maxilla',
  'tmj',
  'infratemporal',
  'floor-of-mouth',
  'tongue',
  'face',
  'parotid',
  'pterygopalatine',
  'nasal-cavity',
  'orbit',
  'temporal',
  'pharynx',
  'larynx',
  'cervical',
  'neck-triangles',
  'neurocranium',
  'viscerocranium',
  'cranial-cavity',
  'ear',
] as const
export type RegionId = (typeof REGION_IDS)[number]

export const FUNCTION_TAGS = [
  'mastication',
  'facial-expression',
  'swallowing',
  'speech',
  'eye-movement',
  'head-neck-movement',
  'general-sensation',
  'special-sense',
  'motor-innervation',
  'arterial-supply',
  'venous-drainage',
  'lymphatic-drainage',
  'salivation',
  'support',
  'respiration',
  'endocrine',
  'occlusion',
] as const
export type FunctionTag = (typeof FUNCTION_TAGS)[number]

/** Textual content fields. Each field shown in the UI must be backed by a reference to count as verified. */
export const CONTENT_FIELDS = [
  'description',
  'location',
  'function',
  'origin',
  'insertion',
  'innervation',
  'bloodSupply',
  'venousDrainage',
  'lymphaticDrainage',
  'course',
  'branches',
  'territory',
  'contents',
  'boundaries',
  'communications',
  'articulations',
  'features',
  'anatomicalRelations',
  'clinicalRelevance',
] as const
export type ContentField = (typeof CONTENT_FIELDS)[number]

export const VERIFICATION_STATUSES = ['verified', 'partial', 'pending', 'unavailable'] as const
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number]

export interface ReferenceCitation {
  sourceId: string
  /** Section, page or table inside the source. */
  locator: string
  /** Content fields this citation supports. */
  fields: ContentField[]
}

export type StructureSide = 'bilateral' | 'median' | 'right' | 'left'

export interface AnatomicalStructure {
  id: string
  name: string
  latinName?: string
  /** FIPAT Terminologia Anatomica 2 identifier, when the term exists there. */
  ta2Id?: string
  synonyms: string[]
  categories: CategoryId[]
  subCategory?: string
  regions: RegionId[]
  functionTags: FunctionTag[]
  side: StructureSide
  /** FDI two-digit notation, teeth only. */
  toothNumber?: number
  content: Partial<Record<ContentField, string | string[]>>
  /** Clinical search terms (e.g. "bloqueio do alveolar inferior"). */
  clinicalTerms: string[]
  relatedStructures: string[]
  parentId?: string
  /** Node names in the GLB modules (see src/data/model-manifest.json). */
  meshIds: string[]
  references: ReferenceCitation[]
  lastReviewedAt?: string
}

export interface ModelModuleInfo {
  id: string
  label: string
  url: string
  source: string
  license: string
}

export interface ReferenceSource {
  id: string
  title: string
  authors: string
  url: string
  kind: 'textbook' | 'open-textbook' | 'terminology' | 'model' | 'article'
  license: string
  accessedAt: string
  notes?: string
}
