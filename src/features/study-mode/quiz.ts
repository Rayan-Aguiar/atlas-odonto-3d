import { STRUCTURES, STRUCTURE_BY_ID, supportedFields, verificationStatus } from '@/features/anatomy-catalog/catalog'
import { CATEGORY_LABELS } from '@/features/anatomy-catalog/labels'
import type { AnatomicalStructure, CategoryId, ContentField } from '@/features/anatomy-catalog/types'

export type QuestionKind = 'identify-name' | 'identify-category' | 'function' | 'innervation'

export interface Question {
  kind: QuestionKind
  structureId: string
  prompt: string
  /** Whether the 3D view should highlight the structure without revealing its name. */
  highlight: boolean
  options: string[]
  answer: string
}

export type Rng = () => number

/** Small deterministic PRNG (mulberry32) so tests and "repeat session" are reproducible. */
export function seededRng(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const shuffle = <T,>(list: T[], rng: Rng) => {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

const text = (v: string | string[] | undefined) => (Array.isArray(v) ? v.join(' ') : (v ?? ''))

/** Only structures with their own mesh (so they can be highlighted) and with source-backed content. */
export function eligibleStructures(scope: { categories?: CategoryId[]; ids?: string[] } = {}): AnatomicalStructure[] {
  return STRUCTURES.filter(
    (s) =>
      s.meshIds.length > 0 &&
      (verificationStatus(s) === 'verified' || verificationStatus(s) === 'partial') &&
      (!scope.categories?.length || s.categories.some((c) => scope.categories!.includes(c))) &&
      (!scope.ids?.length || scope.ids.includes(s.id)),
  )
}

function fieldQuestionPool(field: ContentField) {
  return STRUCTURES.filter((s) => supportedFields(s).has(field))
}

function distractors(pool: string[], answer: string, rng: Rng, n = 3): string[] | null {
  const unique = [...new Set(pool.filter((p) => p !== answer))]
  if (unique.length < n) return null
  return shuffle(unique, rng).slice(0, n)
}

export function buildQuestion(s: AnatomicalStructure, kind: QuestionKind, rng: Rng): Question | null {
  const sameCategory = STRUCTURES.filter((o) => o.id !== s.id && o.categories[0] === s.categories[0])
  switch (kind) {
    case 'identify-name': {
      // Avoid giving away the answer with left/right twins of the same tooth or part.
      const pool = sameCategory.map((o) => o.name).filter((n) => n.split(' (')[0] !== s.name.split(' (')[0])
      const d = distractors(pool, s.name, rng)
      if (!d) return null
      return { kind, structureId: s.id, highlight: true, prompt: 'Qual é o nome da estrutura destacada no modelo?', options: shuffle([s.name, ...d], rng), answer: s.name }
    }
    case 'identify-category': {
      const answer = CATEGORY_LABELS[s.categories[0]!]
      const d = distractors(Object.values(CATEGORY_LABELS), answer, rng)
      if (!d) return null
      return { kind, structureId: s.id, highlight: true, prompt: 'A estrutura destacada pertence a qual categoria?', options: shuffle([answer, ...d], rng), answer }
    }
    case 'function':
    case 'innervation': {
      const field: ContentField = kind
      if (!supportedFields(s).has(field)) return null
      const answer = text(s.content[field])
      const pool = fieldQuestionPool(field)
        .filter((o) => o.id !== s.id && o.categories[0] === s.categories[0])
        .map((o) => text(o.content[field]))
      const d = distractors(pool, answer, rng)
      if (!d) return null
      const prompt = kind === 'function' ? `Qual é a função ou ação de: ${s.name}?` : `Qual é a inervação de: ${s.name}?`
      return { kind, structureId: s.id, highlight: false, prompt, options: shuffle([answer, ...d], rng), answer }
    }
  }
}

export function buildQuiz(scope: { categories?: CategoryId[]; ids?: string[] }, count: number, rng: Rng): Question[] {
  const pool = shuffle(eligibleStructures(scope), rng)
  const kinds: QuestionKind[] = ['identify-name', 'function', 'innervation', 'identify-category']
  const out: Question[] = []
  for (const s of pool) {
    if (out.length >= count) break
    for (const kind of shuffle(kinds, rng)) {
      const q = buildQuestion(s, kind, rng)
      if (q) {
        out.push(q)
        break
      }
    }
  }
  return out
}

export function flashcardDeck(scope: { categories?: CategoryId[]; ids?: string[] }, rng: Rng): string[] {
  return shuffle(eligibleStructures(scope), rng).map((s) => s.id)
}

export function structureName(id: string) {
  return STRUCTURE_BY_ID.get(id)?.name ?? id
}
