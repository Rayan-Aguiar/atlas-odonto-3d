import type { ContentField } from '../../types'
import { GRAY, OS, gray, osSkull, type StructureDraft } from './helpers'

export const SPLANCHNOLOGY: StructureDraft[] = [
  // ------------------------------------------------------------ Glândulas salivares
  {
    id: 'parotid-gland',
    content: {
      description: 'A maior das três glândulas salivares maiores (14 a 28 g).',
      location:
        'Na lateral da face, imediatamente abaixo e à frente da orelha externa, entre o ramo da mandíbula (anteriormente) e o processo mastoide e o esternocleidomastóideo (posteriormente), sobrepondo-se a ambos; superiormente quase alcança o arco zigomático.',
      anatomicalRelations: 'Cobre posteriormente a parte profunda do masseter; contém em seu interior a veia retromandibular e a artéria carótida externa com seus ramos terminais, além do plexo intraparotídeo do nervo facial.',
      clinicalRelevance:
        'Atravessada pelo nervo facial: anestésico depositado posteriormente demais no bloqueio do alveolar inferior pode difundir-se para a glândula e causar paralisia facial transitória.',
    },
    clinicalTerms: ['caxumba', 'parotidite', 'paralisia facial transitória'],
    relatedStructures: ['parotid-duct', 'accessory-parotid-gland', 'facial-nerve-vii', 'retromandibular-vein', 'external-carotid-artery', 'masseter', 'auriculotemporal-nerve', 'intraglandular-parotid-nodes', 'superficial-parotid-nodes'],
    references: [gray(GRAY.salivary, 'description', 'location'), gray(GRAY.mastication, 'anatomicalRelations'), gray(GRAY.neckVeins, 'anatomicalRelations')],
  },
  {
    id: 'parotid-duct',
    content: {
      course: 'Cruza a face lateral do masseter e perfura o músculo bucinador na altura do segundo molar superior, abrindo-se no vestíbulo da boca.',
      clinicalRelevance: 'Sua abertura (papila parotídea) na mucosa jugal, junto ao segundo molar superior, é referência no exame intrabucal.',
    },
    relatedStructures: ['parotid-gland', 'bucinator', 'masseter', 'upper-second-molar-tooth-r'],
    references: [gray(GRAY.facial, 'course')],
  },
  {
    id: 'submandibular-gland',
    content: {
      description: 'Glândula de forma irregular, do tamanho aproximado de uma noz.',
      location:
        'Em grande parte no trígono submandibular, estendendo-se do ventre anterior do digástrico até o ligamento estilomandibular, que a separa da parótida; superiormente fica sob o corpo da mandíbula.',
      anatomicalRelations:
        'Geralmente sobrepõe-se ao tendão intermédio do digástrico e à inserção do estilo-hióideo; de sua face profunda, um processo profundo estende-se para a frente acima do milo-hióideo. O nervo lingual passa entre o hioglosso e a parte profunda da glândula.',
    },
    clinicalTerms: ['sialolitíase', 'cálculo salivar'],
    relatedStructures: ['submandibular-duct', 'digastric', 'mylohyoid-muscle', 'stylomandibular-ligament', 'lingual-nerve', 'facial-artery', 'facial-vein', 'submandibular-nodes'],
    references: [gray(GRAY.salivary, 'description', 'location', 'anatomicalRelations'), gray(GRAY.mandibularNerve, 'anatomicalRelations')],
  },
  {
    id: 'submandibular-duct',
    content: {
      anatomicalRelations: 'É cruzado pelo nervo lingual no assoalho da boca; corre medialmente à glândula sublingual.',
      clinicalRelevance: 'Local mais frequente de cálculos salivares, por seu trajeto ascendente e pela saliva mais viscosa da glândula submandibular.',
    },
    relatedStructures: ['submandibular-gland', 'lingual-nerve', 'sublingual-gland'],
    references: [gray(GRAY.mandibularNerve, 'anatomicalRelations'), gray(GRAY.salivary, 'anatomicalRelations')],
  },
  {
    id: 'sublingual-gland',
    content: {
      description: 'A menor das três glândulas salivares maiores; estreita, achatada, em forma de amêndoa, com cerca de 2 g.',
      location: 'Sob a mucosa do assoalho da boca, ao lado do frênulo da língua, em contato com a fossa sublingual da face interna da mandíbula, junto à sínfise.',
      anatomicalRelations:
        'Acima, mucosa; abaixo, músculo milo-hióideo; atrás, parte profunda da glândula submandibular; lateralmente, mandíbula; medialmente, músculo genioglosso, do qual é separada pelo nervo lingual e pelo ducto submandibular.',
    },
    relatedStructures: ['mylohyoid-muscle', 'genioglossus-muscle', 'lingual-nerve', 'submandibular-duct', 'submandibular-gland', 'mandible'],
    references: [gray(GRAY.salivary, 'description', 'location', 'anatomicalRelations')],
  },

  // ------------------------------------------------------------ Língua e cavidade oral
  {
    id: 'tongue',
    content: {
      description: 'Órgão muscular da cavidade oral, formado por músculos intrínsecos e extrínsecos (genioglosso, hioglosso, estiloglosso e palatoglosso).',
      innervation: [
        'Motora: nervo hipoglosso (XII).',
        'Sensibilidade geral dos dois terços anteriores: nervo lingual (V3).',
      ],
      function: 'Participa da mastigação, da deglutição, da fala e da gustação.',
      clinicalRelevance: 'Exame obrigatório da mucosa lingual (bordas laterais e ventre) no rastreamento de lesões potencialmente malignas.',
    },
    relatedStructures: ['genioglossus-muscle', 'hyoglossus-muscle', 'styloglossus', 'palatoglossus', 'hypoglossal-nerve-xii', 'lingual-nerve', 'lingual-artery', 'lingual-vein', 'chorda-tympani'],
    references: [gray(GRAY.tongue, 'description'), gray(GRAY.mandibularNerve, 'innervation'), { sourceId: 'openstax-ap2e-13-4', locator: OS.cranialNerves, fields: ['innervation'] as ContentField[] }],
  },

  // ------------------------------------------------------------ ATM e ligamentos
  {
    id: 'temporomandibular-joint',
    name: 'Articulação temporomandibular (ATM)',
    categories: ['joints'],
    regions: ['tmj'],
    functionTags: ['mastication', 'speech'],
    side: 'bilateral',
    synonyms: ['ATM', 'articulação da mandíbula'],
    content: {
      description: 'Articulação entre o côndilo da mandíbula e a fossa mandibular e o tubérculo articular do osso temporal, com um disco articular interposto.',
      features: ['Côndilo (processo condilar) da mandíbula', 'Fossa mandibular e tubérculo articular do temporal', 'Disco articular', 'Cápsula articular', 'Ligamentos lateral, esfenomandibular e estilomandibular'],
      function:
        'Permite abaixamento, elevação, protrusão, retrusão e lateralidade da mandíbula; o pterigóideo lateral, inserido no colo do côndilo e na margem anterior do disco, traciona ambos para a frente na protrusão e na abertura.',
      clinicalRelevance: 'Objeto de estudo nas disfunções temporomandibulares (dor, ruídos articulares, limitação ou desvio de abertura).',
    },
    clinicalTerms: ['DTM', 'disfunção temporomandibular', 'estalido', 'luxação da mandíbula'],
    relatedStructures: ['condylar-process', 'mandibular-fossa', 'articular-tubercle', 'articular-disc-of-temporomandibular-joint', 'articular-capsule-of-temporomandibular-joint', 'lateral-temporomandibular-ligament', 'sphenomandibular-ligament', 'stylomandibular-ligament', 'lateral-pterygoid', 'auriculotemporal-nerve'],
    references: [osSkull(OS.temporal, 'description'), gray(GRAY.mastication, 'function')],
  },
  {
    id: 'articular-disc-of-temporomandibular-joint',
    content: {
      description: 'Disco fibrocartilaginoso interposto entre o côndilo e as superfícies articulares do temporal, dividindo a articulação em compartimentos superior e inferior.',
      anatomicalRelations: 'Sua margem anterior recebe parte da inserção do músculo pterigóideo lateral.',
    },
    relatedStructures: ['temporomandibular-joint', 'lateral-pterygoid', 'superior-head-of-lateral-pterygoid-muscle'],
    references: [gray(GRAY.mastication, 'anatomicalRelations')],
  },
  {
    id: 'sphenomandibular-ligament',
    content: {
      description: 'Ligamento acessório da ATM, presa superiormente à espinha do esfenoide.',
      anatomicalRelations: 'O nervo e a artéria alveolares inferiores passam entre ele e o ramo da mandíbula a caminho do forame mandibular; a artéria maxilar passa entre ele e o colo da mandíbula.',
      clinicalRelevance: 'Pode desviar a solução anestésica no bloqueio do alveolar inferior quando a agulha é posicionada medialmente a ele.',
    },
    relatedStructures: ['temporomandibular-joint', 'sphenoid-bone', 'inferior-alveolar-nerve', 'maxillary-artery', 'mandibular-foramen'],
    references: [gray(GRAY.sphenoid, 'description'), gray(GRAY.mandibularNerve, 'anatomicalRelations'), gray(GRAY.maxillaryArtery, 'anatomicalRelations')],
  },
  {
    id: 'stylohyoid-ligament',
    content: {
      description: 'Cordão fibroso preso à ponta do processo estiloide do temporal e ao corno menor do hioide; frequentemente contém cartilagem ou é parcialmente ossificado.',
      clinicalRelevance: 'Sua ossificação alongada (processo estiloide alongado) pode causar dor cervicofacial e à deglutição.',
    },
    clinicalTerms: ['síndrome de Eagle'],
    relatedStructures: ['styloid-process', 'hyoid-bone', 'stylohyoid-muscle'],
    references: [gray(GRAY.suprahyoid, 'description')],
  },
  {
    id: 'stylomandibular-ligament',
    content: { anatomicalRelations: 'Separa a glândula submandibular da glândula parótida.' },
    relatedStructures: ['temporomandibular-joint', 'styloid-process', 'submandibular-gland', 'parotid-gland'],
    references: [gray(GRAY.salivary, 'anatomicalRelations')],
  },

  // ------------------------------------------------------------ Dentição (registro geral)
  {
    id: 'permanent-dentition',
    name: 'Dentição permanente',
    categories: ['teeth'],
    regions: ['oral-cavity', 'maxilla', 'mandible'],
    functionTags: ['mastication', 'occlusion', 'speech'],
    side: 'median',
    synonyms: ['dentes permanentes', 'segunda dentição'],
    content: {
      description:
        'São 32 dentes permanentes: em cada hemiarcada, 2 incisivos, 1 canino, 2 pré-molares e 3 molares. A dentição decídua tem 20 dentes: em cada hemiarcada, 2 incisivos, 1 canino e 2 molares.',
      features: ['Coroa — projeta-se acima da gengiva', 'Colo — porção constrita entre coroa e raiz', 'Raiz — implantada no alvéolo'],
      innervation: [
        'Dentes superiores: ramos alveolares superiores posteriores (molares), médio (pré-molares) e anterior (canino e incisivos), do nervo maxilar.',
        'Dentes inferiores: ramos dentais do nervo alveolar inferior (molares e pré-molares) e ramo incisivo (canino e incisivos).',
      ],
      clinicalRelevance:
        'O modelo 3D atual contém 28 dentes permanentes (sem terceiros molares) e não contém dentes decíduos. A notação FDI (dois dígitos: quadrante + posição) é usada nos nomes dos dentes deste atlas.',
    },
    clinicalTerms: ['FDI', 'odontograma', 'notação dentária'],
    relatedStructures: ['maxilla', 'mandible', 'gingiva', 'inferior-alveolar-nerve', 'posterior-superior-alveolar-nerves', 'infra-orbital-nerve'],
    references: [gray(GRAY.teeth, 'description', 'features'), gray(GRAY.maxillaryNerve, 'innervation'), gray(GRAY.mandibularNerve, 'innervation')],
  },
]

const QUADRANT = { upper: { r: 1, l: 2 }, lower: { r: 4, l: 3 } } as const

export function toothDraft(base: string, side: 'l' | 'r', name: string, position: number): StructureDraft {
  const arch = base.startsWith('upper') ? 'upper' : 'lower'
  const fdi = QUADRANT[arch][side] * 10 + position
  const group = position <= 2 ? 'incisor' : position === 3 ? 'canine' : position <= 5 ? 'premolar' : 'molar'
  const innervation =
    arch === 'upper'
      ? group === 'molar'
        ? 'Ramos alveolares superiores posteriores (nervo maxilar, V2).'
        : group === 'premolar'
          ? 'Ramo alveolar superior médio (nervo maxilar, V2).'
          : 'Ramo alveolar superior anterior (nervo maxilar, V2).'
      : group === 'molar' || group === 'premolar'
        ? 'Ramos dentais do nervo alveolar inferior (V3).'
        : 'Ramo incisivo do nervo alveolar inferior (V3).'
  const nerve =
    arch === 'upper'
      ? group === 'molar'
        ? 'posterior-superior-alveolar-nerves'
        : 'infra-orbital-nerve'
      : 'inferior-alveolar-nerve'
  const sideLabel = side === 'r' ? 'direito' : 'esquerdo'
  const related = ['permanent-dentition', arch === 'upper' ? 'maxilla' : 'mandible', nerve, 'gingiva']
  const extra: Partial<Record<ContentField, string>> = {}
  const refs = [gray(GRAY.teeth, 'description'), gray(arch === 'upper' ? GRAY.maxillaryNerve : GRAY.mandibularNerve, 'innervation')]
  if (arch === 'lower' && position === 5) {
    extra.anatomicalRelations = 'O forame mentual situa-se abaixo deste dente, a meio caminho entre as margens superior e inferior do corpo da mandíbula.'
    related.push('mental-foramen')
    refs.push(gray(GRAY.mandible, 'anatomicalRelations'))
  }
  if (arch === 'upper' && position === 7) {
    extra.anatomicalRelations = 'O ducto parotídeo abre-se na mucosa jugal na altura do segundo molar superior.'
    related.push('parotid-duct')
    refs.push(gray(GRAY.facial, 'anatomicalRelations'))
  }
  return {
    id: `${base}-${side}`,
    name: `${name} ${sideLabel} (${fdi})`,
    categories: ['teeth'],
    subCategory: 'Dente permanente',
    regions: ['oral-cavity', arch === 'upper' ? 'maxilla' : 'mandible'],
    functionTags: ['mastication', 'occlusion'],
    side: side === 'r' ? 'right' : 'left',
    toothNumber: fdi,
    synonyms: [`dente ${fdi}`, String(fdi)],
    content: {
      description: `Dente permanente (${name.toLowerCase()}), formado por coroa, colo e raiz implantada no alvéolo do processo alveolar.`,
      innervation,
      ...extra,
    },
    relatedStructures: related,
    references: refs,
    meshIds: [`${base}__${side}`],
  }
}
