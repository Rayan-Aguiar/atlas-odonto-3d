import type { CategoryId, ContentField, FunctionTag, RegionId, VerificationStatus } from './types'

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  bones: 'Ossos e cartilagens',
  muscles: 'Músculos',
  arteries: 'Artérias',
  veins: 'Veias e seios venosos',
  nerves: 'Nervos',
  foramina: 'Forames, canais e fissuras',
  teeth: 'Dentes',
  joints: 'Articulações e ligamentos',
  glands: 'Glândulas',
  oral: 'Cavidade oral',
  tongue: 'Língua',
  'pharynx-larynx': 'Faringe e laringe',
  lymph: 'Linfonodos e tonsilas',
  other: 'Outras estruturas',
}

export const REGION_LABELS: Record<RegionId, string> = {
  neurocranium: 'Neurocrânio',
  viscerocranium: 'Viscerocrânio',
  orbit: 'Órbita',
  temporal: 'Região temporal',
  infratemporal: 'Fossa infratemporal',
  pterygopalatine: 'Fossa pterigopalatina',
  'nasal-cavity': 'Cavidade nasal e seios',
  'oral-cavity': 'Cavidade oral',
  maxilla: 'Maxila',
  mandible: 'Mandíbula',
  tmj: 'Região da ATM',
  face: 'Face',
  parotid: 'Região parotideomassetérica',
  'floor-of-mouth': 'Assoalho da boca',
  tongue: 'Língua',
  pharynx: 'Região faríngea',
  larynx: 'Laringe',
  cervical: 'Região cervical',
  'neck-triangles': 'Trígonos do pescoço',
  'cranial-cavity': 'Cavidade craniana',
  ear: 'Orelha',
}

export const FUNCTION_LABELS: Record<FunctionTag, string> = {
  mastication: 'Mastigação',
  'facial-expression': 'Expressão facial',
  swallowing: 'Deglutição',
  speech: 'Fala e fonação',
  'eye-movement': 'Movimentos oculares',
  'head-neck-movement': 'Movimentos da cabeça e pescoço',
  'general-sensation': 'Sensibilidade geral',
  'special-sense': 'Sentidos especiais',
  'motor-innervation': 'Inervação motora',
  'arterial-supply': 'Irrigação arterial',
  'venous-drainage': 'Drenagem venosa',
  'lymphatic-drainage': 'Drenagem linfática',
  salivation: 'Secreção salivar',
  support: 'Sustentação e proteção',
  respiration: 'Respiração',
  endocrine: 'Função endócrina',
  occlusion: 'Oclusão dentária',
}

export const FIELD_LABELS: Record<ContentField, string> = {
  description: 'Descrição',
  location: 'Localização',
  function: 'Função / ação',
  origin: 'Origem',
  insertion: 'Inserção',
  innervation: 'Inervação',
  bloodSupply: 'Irrigação arterial',
  venousDrainage: 'Drenagem venosa',
  lymphaticDrainage: 'Drenagem linfática',
  course: 'Trajeto',
  branches: 'Ramos',
  territory: 'Território',
  contents: 'Estruturas que atravessam',
  boundaries: 'Limites',
  communications: 'Comunicações',
  articulations: 'Articulações',
  features: 'Acidentes e partes',
  anatomicalRelations: 'Relações anatômicas',
  clinicalRelevance: 'Relevância odontológica e clínica',
}

export const STATUS_LABELS: Record<VerificationStatus, { label: string; description: string }> = {
  verified: {
    label: 'Verificado em fonte',
    description: 'Todos os campos exibidos têm referência bibliográfica citada que os sustenta.',
  },
  partial: {
    label: 'Parcialmente verificado',
    description: 'Parte dos campos tem referência citada; os demais aguardam conferência.',
  },
  pending: {
    label: 'Pendente de validação',
    description: 'O conteúdo existe, mas ainda não foi conferido em fonte citada.',
  },
  unavailable: {
    label: 'Informação não disponível',
    description: 'Somente a nomenclatura foi registrada; o conteúdo descritivo ainda não foi escrito.',
  },
}

export const SIDE_LABELS = {
  bilateral: 'Par (direito e esquerdo)',
  median: 'Ímpar / mediano',
  right: 'Lado direito',
  left: 'Lado esquerdo',
} as const
