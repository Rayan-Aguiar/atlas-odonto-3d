import { z } from 'zod'
import { CATEGORY_IDS, CONTENT_FIELDS, FUNCTION_TAGS, REGION_IDS, type AnatomicalStructure } from './types'

export const referenceCitationSchema = z.object({
  sourceId: z.string().min(1),
  /** Section, page or table inside the source. */
  locator: z.string().min(1),
  /** Content fields this citation supports. */
  fields: z.array(z.enum(CONTENT_FIELDS)).min(1),
})

const contentValue = z.union([z.string().min(1), z.array(z.string().min(1)).min(1)])

export const structureSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  latinName: z.string().min(1).optional(),
  /** FIPAT Terminologia Anatomica 2 identifier, when the term exists there. */
  ta2Id: z.string().regex(/^\d+$/).optional(),
  synonyms: z.array(z.string().min(1)),
  categories: z.array(z.enum(CATEGORY_IDS)).min(1),
  subCategory: z.string().min(1).optional(),
  regions: z.array(z.enum(REGION_IDS)).min(1),
  functionTags: z.array(z.enum(FUNCTION_TAGS)),
  side: z.enum(['bilateral', 'median', 'right', 'left']),
  /** FDI two-digit notation, teeth only. */
  toothNumber: z.number().int().min(11).max(85).optional(),
  content: z.partialRecord(z.enum(CONTENT_FIELDS), contentValue),
  /** Terms a student might type that are clinical rather than anatomical (e.g. "bloqueio do alveolar inferior"). */
  clinicalTerms: z.array(z.string().min(1)),
  relatedStructures: z.array(z.string()),
  parentId: z.string().optional(),
  /** Node names in the GLB modules (see src/data/model-manifest.json). */
  meshIds: z.array(z.string()),
  references: z.array(referenceCitationSchema),
  lastReviewedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})


// Compile-time guarantee that the runtime schema and the TypeScript type describe the same shape.
type Parsed = z.infer<typeof structureSchema>
const _toType = (p: Parsed): AnatomicalStructure => p
const _toSchema = (s: AnatomicalStructure): Parsed => s
void _toType
void _toSchema
