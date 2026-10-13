import type { ReferenceSource } from '../types'

/**
 * Bibliographic sources actually consulted while writing the catalog.
 * Every citation in the structure data must point to one of these ids (enforced by tests).
 */
export const REFERENCE_SOURCES: ReferenceSource[] = [
  {
    id: 'gray-1918',
    title: 'Anatomy of the Human Body, 20th ed. (rev. Warren H. Lewis)',
    authors: 'Henry Gray',
    url: 'https://archive.org/details/101532328.nlm.nih.gov',
    kind: 'textbook',
    license: 'Domínio público (digitalização da U.S. National Library of Medicine)',
    accessedAt: '2026-10-13',
    notes:
      'Texto clássico; alguns termos seguem a nomenclatura BNA de 1918 (ex.: "Pterygoideus externus" = pterigóideo lateral, ' +
      '"submaxillary" = submandibular, "internal maxillary artery" = artéria maxilar). Os termos foram convertidos para a TA atual.',
  },
  {
    id: 'openstax-ap2e-7-2',
    title: 'Anatomy and Physiology 2e — 7.2 The Skull',
    authors: 'J. Gordon Betts et al. (OpenStax, Rice University)',
    url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/7-2-the-skull',
    kind: 'open-textbook',
    license: 'CC BY 4.0',
    accessedAt: '2026-10-13',
  },
  {
    id: 'openstax-ap2e-11-3',
    title: 'Anatomy and Physiology 2e — 11.3 Axial Muscles of the Head, Neck, and Back',
    authors: 'J. Gordon Betts et al. (OpenStax, Rice University)',
    url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/11-3-axial-muscles-of-the-head-neck-and-back',
    kind: 'open-textbook',
    license: 'CC BY 4.0',
    accessedAt: '2026-10-13',
  },
  {
    id: 'openstax-ap2e-13-4',
    title: 'Anatomy and Physiology 2e — 13.4 The Peripheral Nervous System (Tabela 13.3, nervos cranianos)',
    authors: 'J. Gordon Betts et al. (OpenStax, Rice University)',
    url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/13-4-the-peripheral-nervous-system',
    kind: 'open-textbook',
    license: 'CC BY 4.0',
    accessedAt: '2026-10-13',
  },
  {
    id: 'fipat-ta2',
    title: 'Terminologia Anatomica, 2nd ed. (TA2) — lista de termos (inglês/latim)',
    authors: 'FIPAT — Federative International Programme for Anatomical Terminology',
    url: 'https://fipat.library.dal.ca/ta2/',
    kind: 'terminology',
    license: 'Termos distribuídos pelo projeto Z-Anatomy (TA2.csv, CC BY-SA 4.0)',
    accessedAt: '2026-10-13',
    notes: 'Usada para conferir o nome latino e o identificador TA2 de cada estrutura.',
  },
  {
    id: 'z-anatomy',
    title: 'Z-Anatomy — The libre 3D atlas of anatomy (Startup.blend)',
    authors: 'Gauthier Kervyn, Marcin Zielinski, Lluis Vinent et al.; derivado de BodyParts3D (DBCLS)',
    url: 'https://github.com/Z-Anatomy/Models-of-human-anatomy',
    kind: 'model',
    license: 'CC BY-SA 4.0',
    accessedAt: '2026-10-13',
  },
]

export const REFERENCE_BY_ID = new Map(REFERENCE_SOURCES.map((r) => [r.id, r]))
