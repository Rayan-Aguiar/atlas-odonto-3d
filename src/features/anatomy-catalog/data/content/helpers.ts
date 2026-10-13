import type { AnatomicalStructure, ContentField, ReferenceCitation } from '../../types'

/** Overlay for a structure generated from the nomenclature table, or a full text-only structure. */
export type StructureDraft = { id: string } & Partial<Omit<AnatomicalStructure, 'id'>>

const cite =
  (sourceId: string) =>
  (locator: string, ...fields: ContentField[]): ReferenceCitation => ({ sourceId, locator, fields })

export const gray = cite('gray-1918')
export const osSkull = cite('openstax-ap2e-7-2')
export const osMuscles = cite('openstax-ap2e-11-3')
export const osNerves = cite('openstax-ap2e-13-4')

export const GRAY = {
  mastication: 'Myology — The muscles of mastication (Masseter, Temporalis, Pterygoidei), pp. 385–387',
  facial: 'Myology — The muscles of the mouth (facial muscles; Buccinator p. 384)',
  suprahyoid: 'Myology — The supra- and infrahyoid muscles, pp. 391–394',
  scm: 'Myology — The lateral cervical muscles (Sternocleidomastoideus)',
  neckTriangles: 'Surgical anatomy — The triangles of the neck (relations of the accessory nerve)',
  tongue: 'Splanchnology — The muscles of the tongue, p. 1130',
  salivary: 'Splanchnology — The salivary glands (parotid p. 1133)',
  teeth: 'Splanchnology — The teeth: general characteristics and dental formulae',
  trigeminal: 'Neurology — The trigeminal nerve, pp. 891–897',
  maxillaryNerve: 'Neurology — The trigeminal nerve: maxillary nerve, p. 891',
  mandibularNerve: 'Neurology — The trigeminal nerve: mandibular nerve, pp. 894–897',
  externalCarotid: 'Angiology — The external carotid artery and its branches, p. 552 ss.',
  maxillaryArtery: 'Angiology — The internal maxillary artery (branches by portion), p. 562',
  neckVeins: 'Angiology — The veins of the head and neck, p. 649 ss.',
  mandible: 'Osteology — The mandible',
  maxilla: 'Osteology — The maxillae; the bony palate',
  sphenoid: 'Osteology — The sphenoid bone',
  temporal: 'Osteology — The temporal bone',
  hyoid: 'Osteology — The hyoid bone, p. 178',
  skullBase: 'Osteology — The skull: norma basalis and infratemporal fossa',
}

export const OS = {
  muscleFacial: 'Seção 11.3 — Músculos da expressão facial (Figura 11.8)',
  muscleEye: 'Seção 11.3 — Tabela 11.3, músculos dos olhos',
  muscleMastication: 'Seção 11.3 — Tabela 11.4, músculos da mastigação',
  muscleTongueNeck: 'Seção 11.3 — Figura 11.12, músculos da língua e do pescoço',
  muscleHead: 'Seção 11.3 — Tabela 11.5, músculos que movem a cabeça',
  skullOpenings: 'Seção 7.2 — Forames e aberturas do crânio',
  mandible: 'Seção 7.2 — Mandíbula',
  maxilla: 'Seção 7.2 — Maxila',
  sinuses: 'Seção 7.2 — Seios paranasais',
  hyoid: 'Seção 7.2 — Osso hioide',
  temporal: 'Seção 7.2 — Osso temporal',
  sphenoid: 'Seção 7.2 — Osso esfenoide',
  cranialNerves: 'Seção 13.4 — Tabela 13.3, nervos cranianos',
}
