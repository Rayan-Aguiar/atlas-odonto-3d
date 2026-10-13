import { GRAY, OS, gray, osMuscles, type StructureDraft } from './helpers'

const V3_MASTICATION = 'Nervo mandibular (V3) — os músculos da mastigação são supridos pelo nervo mandibular.'

export const MYOLOGY: StructureDraft[] = [
  // ------------------------------------------------------------ Mastigação
  {
    id: 'masseter',
    name: 'Músculo masseter',
    categories: ['muscles'],
    subCategory: 'Músculo da mastigação',
    regions: ['parotid', 'face', 'mandible'],
    functionTags: ['mastication'],
    side: 'bilateral',
    content: {
      description: 'Músculo espesso, aproximadamente quadrilátero, formado por uma parte superficial (maior) e uma parte profunda.',
      origin: [
        'Parte superficial: processo zigomático da maxila e dois terços anteriores da margem inferior do arco zigomático, por aponeurose espessa.',
        'Parte profunda: terço posterior da margem inferior e toda a face medial do arco zigomático.',
      ],
      insertion: [
        'Parte superficial: ângulo e metade inferior da face lateral do ramo da mandíbula.',
        'Parte profunda: metade superior do ramo e face lateral do processo coronoide.',
      ],
      function: 'Eleva a mandíbula contra a maxila com grande força (fechamento da boca).',
      innervation: V3_MASTICATION,
      anatomicalRelations:
        'A parte profunda é parcialmente coberta, anteriormente, pela parte superficial e, posteriormente, pela glândula parótida.',
      clinicalRelevance:
        'Facilmente palpável ao cerrar os dentes; é avaliado no exame da musculatura mastigatória em casos de dor orofacial, bruxismo e limitação de abertura bucal (trismo).',
    },
    clinicalTerms: ['trismo', 'bruxismo', 'DTM', 'dor miofascial'],
    relatedStructures: ['superficial-part-of-masseter', 'deep-part-of-masseter', 'mandible', 'zygomatic-bone', 'parotid-gland', 'temporalis-muscle', 'medial-pterygoid-muscle', 'lateral-pterygoid'],
    references: [
      gray(GRAY.mastication, 'description', 'origin', 'insertion', 'function', 'innervation', 'anatomicalRelations'),
      osMuscles(OS.muscleMastication, 'function', 'origin', 'insertion'),
    ],
  },
  {
    id: 'superficial-part-of-masseter',
    content: {
      description: 'Porção maior do masseter; suas fibras dirigem-se para baixo e para trás.',
      origin: 'Processo zigomático da maxila e dois terços anteriores da margem inferior do arco zigomático.',
      insertion: 'Ângulo e metade inferior da face lateral do ramo da mandíbula.',
    },
    relatedStructures: ['masseter', 'deep-part-of-masseter'],
    references: [gray(GRAY.mastication, 'description', 'origin', 'insertion')],
  },
  {
    id: 'deep-part-of-masseter',
    content: {
      description: 'Porção menor e mais muscular do masseter; suas fibras dirigem-se para baixo e para a frente.',
      origin: 'Terço posterior da margem inferior e toda a face medial do arco zigomático.',
      insertion: 'Metade superior do ramo e face lateral do processo coronoide da mandíbula.',
      anatomicalRelations: 'Coberta anteriormente pela parte superficial e posteriormente pela glândula parótida.',
    },
    relatedStructures: ['masseter', 'superficial-part-of-masseter', 'parotid-gland'],
    references: [gray(GRAY.mastication, 'description', 'origin', 'insertion', 'anatomicalRelations')],
  },
  {
    id: 'temporalis-muscle',
    content: {
      description: 'Músculo largo, em leque, situado na face lateral da cabeça.',
      origin: 'Toda a fossa temporal (exceto a porção formada pelo osso zigomático) e face profunda da fáscia temporal.',
      insertion:
        'Por tendão que passa profundamente ao arco zigomático: face medial, ápice e margem anterior do processo coronoide e margem anterior do ramo da mandíbula, quase até o último molar.',
      function: 'Eleva a mandíbula; suas fibras posteriores retraem a mandíbula.',
      innervation: 'Nervo mandibular (V3), por meio dos nervos temporais profundos.',
      clinicalRelevance:
        'Palpável na região temporal durante o apertamento dentário; frequentemente avaliado em quadros de cefaleia tensional e dor miofascial associada a DTM.',
    },
    clinicalTerms: ['cefaleia', 'DTM'],
    relatedStructures: ['temporal-bone', 'mandible', 'masseter', 'anterior-deep-temporal-artery', 'posterior-deep-temporal-artery'],
    references: [
      gray(GRAY.mastication, 'description', 'origin', 'insertion', 'function', 'innervation'),
      osMuscles(OS.muscleMastication, 'function'),
    ],
  },
  {
    id: 'medial-pterygoid-muscle',
    content: {
      description: 'Músculo espesso e quadrilátero, situado medialmente ao ramo da mandíbula.',
      origin: [
        'Face medial da lâmina lateral do processo pterigoide e face sulcada do processo piramidal do palatino.',
        'Segundo feixe: faces laterais do processo piramidal do palatino e túber da maxila.',
      ],
      insertion: 'Parte inferior e posterior da face medial do ramo e do ângulo da mandíbula, até a altura do forame mandibular.',
      function: 'Eleva a mandíbula; auxilia a protrusão e, agindo de um só lado, os movimentos de lateralidade.',
      innervation: V3_MASTICATION,
      anatomicalRelations:
        'Forma, com o ramo da mandíbula, o espaço por onde passam os nervos lingual e alveolar inferior antes deste último penetrar no forame mandibular.',
      clinicalRelevance:
        'Referência de profundidade na técnica do bloqueio do nervo alveolar inferior; espasmo ou lesão do músculo pela agulha é uma das causas de trismo pós-anestésico.',
    },
    clinicalTerms: ['bloqueio do nervo alveolar inferior', 'trismo'],
    relatedStructures: ['sphenoid-bone', 'palatine-bone', 'maxilla', 'mandible', 'lingual-nerve', 'inferior-alveolar-nerve', 'mandibular-foramen'],
    references: [
      gray(GRAY.mastication, 'description', 'origin', 'insertion', 'function', 'innervation'),
      gray(GRAY.mandibularNerve, 'anatomicalRelations'),
      osMuscles(OS.muscleMastication, 'function'),
    ],
  },
  {
    id: 'lateral-pterygoid',
    name: 'Músculo pterigóideo lateral',
    categories: ['muscles'],
    subCategory: 'Músculo da mastigação',
    regions: ['infratemporal', 'tmj'],
    functionTags: ['mastication'],
    side: 'bilateral',
    synonyms: ['pterigóideo externo'],
    content: {
      description: 'Músculo curto, espesso e cônico, disposto quase horizontalmente entre a fossa infratemporal e o côndilo da mandíbula.',
      origin: [
        'Cabeça superior: parte inferior da face lateral da asa maior do esfenoide e crista infratemporal.',
        'Cabeça inferior: face lateral da lâmina lateral do processo pterigoide.',
      ],
      insertion: 'Depressão anterior ao colo do côndilo da mandíbula (fóvea pterigóidea) e margem anterior do disco articular da ATM.',
      function:
        'Auxilia a abertura da boca; sua ação principal é tracionar para a frente o côndilo e o disco articular, protraindo a mandíbula. A ação unilateral, com o pterigóideo medial, produz os movimentos de lateralidade.',
      innervation: V3_MASTICATION,
      clinicalRelevance:
        'Por sua inserção no disco e no côndilo, é estudado na biomecânica da ATM e nas disfunções temporomandibulares.',
    },
    clinicalTerms: ['DTM', 'deslocamento de disco'],
    relatedStructures: ['superior-head-of-lateral-pterygoid-muscle', 'inferior-head-of-lateral-pterygoid-muscle', 'articular-disc-of-temporomandibular-joint', 'sphenoid-bone', 'mandible', 'maxillary-artery'],
    references: [
      gray(GRAY.mastication, 'description', 'origin', 'insertion', 'function', 'innervation'),
      osMuscles(OS.muscleMastication, 'function'),
    ],
  },
  {
    id: 'superior-head-of-lateral-pterygoid-muscle',
    content: {
      origin: 'Parte inferior da face lateral da asa maior do esfenoide e crista infratemporal.',
      insertion: 'Junto com a cabeça inferior: fóvea pterigóidea do colo do côndilo e margem anterior do disco articular da ATM.',
    },
    relatedStructures: ['lateral-pterygoid', 'articular-disc-of-temporomandibular-joint'],
    references: [gray(GRAY.mastication, 'origin', 'insertion')],
  },
  {
    id: 'inferior-head-of-lateral-pterygoid-muscle',
    content: {
      origin: 'Face lateral da lâmina lateral do processo pterigoide.',
      insertion: 'Junto com a cabeça superior: fóvea pterigóidea do colo do côndilo e margem anterior do disco articular da ATM.',
    },
    relatedStructures: ['lateral-pterygoid'],
    references: [gray(GRAY.mastication, 'origin', 'insertion')],
  },

  // ------------------------------------------------------------ Expressão facial
  {
    id: 'bucinator',
    content: {
      description: 'Músculo fino e quadrilátero que ocupa o intervalo entre a maxila e a mandíbula, na lateral da face; forma a base muscular da bochecha.',
      origin: [
        'Faces externas dos processos alveolares da maxila e da mandíbula, na altura dos três molares.',
        'Posteriormente, margem anterior da rafe pterigomandibular, que o separa do constritor superior da faringe.',
      ],
      insertion: 'Converge para o ângulo da boca, onde suas fibras se continuam com as do músculo orbicular da boca.',
      function: 'Desloca as bochechas lateralmente e as comprime contra os dentes.',
      innervation: 'Nervo facial (VII).',
      anatomicalRelations:
        'Coberto pela fáscia bucofaríngea; separado do ramo da mandíbula e do masseter por uma massa de tecido adiposo. É perfurado pelo ducto parotídeo.',
      clinicalRelevance:
        'Mantém o bolo alimentar sobre a face oclusal durante a mastigação; sua inserção alveolar é referência na disseminação de infecções odontogênicas para o vestíbulo ou para o espaço bucal.',
    },
    clinicalTerms: ['espaço bucal', 'infecção odontogênica'],
    relatedStructures: ['orbicularis-oris-muscle', 'superior-pharyngeal-constrictor', 'parotid-duct', 'buccal-nerve', 'facial-nerve-vii', 'maxilla', 'mandible'],
    references: [
      gray(GRAY.facial, 'description', 'origin', 'insertion', 'innervation', 'anatomicalRelations'),
      gray(GRAY.salivary, 'anatomicalRelations'),
      osMuscles(OS.muscleFacial, 'function', 'origin', 'insertion'),
    ],
  },
  {
    id: 'orbicularis-oris-muscle',
    content: {
      description:
        'Não é um esfíncter simples: é formado por vários estratos de fibras ao redor da rima da boca, parte própria dos lábios e parte proveniente de outros músculos faciais, especialmente do bucinador.',
      function: 'Fecha os lábios; suas fibras profundas aplicam os lábios contra a arcada alveolar e as superficiais os aproximam e protraem.',
      innervation: 'Nervo facial (VII).',
    },
    relatedStructures: ['bucinator', 'risorius-muscle', 'zygomaticus-major-muscle', 'levator-labii-superioris', 'depressor-anguli-oris', 'facial-nerve-vii', 'superior-labial-artery', 'inferior-labial-artery'],
    references: [gray(GRAY.facial, 'description', 'function', 'innervation'), osMuscles(OS.muscleFacial, 'function')],
  },
  {
    id: 'risorius-muscle',
    content: {
      origin: 'Fáscia sobre o músculo masseter (parotideomassetérica).',
      insertion: 'Pele do ângulo da boca, passando horizontalmente, superficial ao platisma.',
      function: 'Traciona lateralmente o ângulo da boca.',
      innervation: 'Nervo facial (VII).',
      description: 'Feixe estreito de fibras, mais largo na origem, de tamanho e forma muito variáveis.',
    },
    relatedStructures: ['orbicularis-oris-muscle', 'masseter', 'platysma', 'facial-nerve-vii'],
    references: [gray(GRAY.facial, 'origin', 'insertion', 'innervation', 'description'), osMuscles(OS.muscleFacial, 'function')],
  },
  {
    id: 'zygomaticus-major-muscle',
    content: {
      origin: 'Osso zigomático.',
      insertion: 'Ângulo da boca, mesclando-se ao músculo orbicular da boca.',
      function: 'Eleva e traciona lateralmente o ângulo da boca (sorriso).',
      innervation: 'Nervo facial (VII).',
    },
    relatedStructures: ['zygomatic-bone', 'orbicularis-oris-muscle', 'zygomaticus-minor-muscle', 'facial-nerve-vii'],
    references: [osMuscles(OS.muscleFacial, 'origin', 'insertion', 'function'), gray(GRAY.facial, 'innervation')],
  },
  {
    id: 'levator-labii-superioris',
    content: {
      origin: 'Maxila.',
      insertion: 'Pele do lábio superior e músculo orbicular da boca.',
      function: 'Eleva o lábio superior.',
      innervation: 'Nervo facial (VII).',
    },
    relatedStructures: ['maxilla', 'orbicularis-oris-muscle', 'facial-nerve-vii'],
    references: [osMuscles(OS.muscleFacial, 'origin', 'insertion', 'function'), gray(GRAY.facial, 'innervation')],
  },
  {
    id: 'depressor-anguli-oris',
    content: {
      origin: 'Mandíbula.',
      insertion: 'Pele do ângulo da boca e do lábio inferior.',
      function: 'Abaixa o ângulo da boca.',
      innervation: 'Nervo facial (VII).',
    },
    relatedStructures: ['mandible', 'orbicularis-oris-muscle', 'facial-nerve-vii'],
    references: [osMuscles(OS.muscleFacial, 'origin', 'insertion', 'function'), gray(GRAY.facial, 'innervation')],
  },
  {
    id: 'mentalis-muscle',
    content: {
      origin: 'Mandíbula.',
      insertion: 'Pele do mento.',
      function: 'Protrai o lábio inferior e enruga a pele do mento.',
      innervation: 'Nervo facial (VII).',
      clinicalRelevance: 'Sua hiperatividade pode interferir na estabilidade de próteses inferiores e é observada em pacientes com selamento labial deficiente.',
    },
    relatedStructures: ['mandible', 'orbicularis-oris-muscle', 'facial-nerve-vii'],
    references: [osMuscles(OS.muscleFacial, 'origin', 'insertion', 'function'), gray(GRAY.facial, 'innervation')],
  },
  {
    id: 'nasalis-muscle',
    content: { origin: 'Maxila.', insertion: 'Osso e cartilagens nasais.', function: 'Dilata as narinas.' },
    relatedStructures: ['maxilla', 'nasal-bone'],
    references: [osMuscles(OS.muscleFacial, 'origin', 'insertion', 'function')],
  },
  {
    id: 'corrugator-supercilii',
    content: { origin: 'Osso frontal.', insertion: 'Pele sob o supercílio.', function: 'Abaixa e aproxima os supercílios.' },
    relatedStructures: ['frontal-bone'],
    references: [osMuscles(OS.muscleFacial, 'origin', 'insertion', 'function')],
  },
  {
    id: 'frontalis-muscle',
    content: { origin: 'Aponeurose epicrânica.', insertion: 'Pele da fronte.', function: 'Eleva os supercílios.' },
    relatedStructures: ['occipitalis-muscle', 'frontal-bone'],
    references: [osMuscles(OS.muscleFacial, 'origin', 'insertion', 'function')],
  },
  {
    id: 'occipitalis-muscle',
    content: { origin: 'Osso occipital e processo mastoide.', insertion: 'Aponeurose epicrânica.', function: 'Tensiona e retrai o couro cabeludo.' },
    relatedStructures: ['frontalis-muscle', 'occipital-bone'],
    references: [osMuscles(OS.muscleFacial, 'origin', 'insertion', 'function')],
  },
  {
    id: 'orbicularis-oculi',
    name: 'Músculo orbicular do olho',
    categories: ['muscles'],
    subCategory: 'Músculo da expressão facial',
    regions: ['face', 'orbit'],
    functionTags: ['facial-expression'],
    side: 'bilateral',
    content: {
      origin: 'Ossos da margem medial da órbita.',
      insertion: 'Ao redor de toda a circunferência da órbita.',
      function: 'Fecha as pálpebras.',
    },
    relatedStructures: ['orbital-part-of-orbicularis-oculi', 'palpebral-part-of-orbicularis-oculi', 'facial-nerve-vii'],
    references: [osMuscles(OS.muscleEye, 'origin', 'insertion', 'function')],
  },

  {
    id: 'thyro-arytenoid',
    name: 'Músculo tireoaritenóideo',
    categories: ['muscles', 'pharynx-larynx'],
    subCategory: 'Músculo da laringe',
    regions: ['larynx'],
    functionTags: ['speech'],
    side: 'bilateral',
    relatedStructures: ['external-part-of-thyro-arytenoid-muscle', 'thyro-epiglottic-part-of-thyro-arytenoid-muscle', 'thyroid-cartilage', 'arytenoid-cartilage'],
  },

  // ------------------------------------------------------------ Supra-hióideos e língua
  {
    id: 'digastric',
    name: 'Músculo digástrico',
    categories: ['muscles'],
    subCategory: 'Músculo supra-hióideo',
    regions: ['floor-of-mouth', 'neck-triangles', 'cervical'],
    functionTags: ['mastication', 'swallowing'],
    side: 'bilateral',
    content: {
      description:
        'Dois ventres carnosos unidos por um tendão intermédio arredondado; estende-se, em curva, do processo mastoide à sínfise da mandíbula, abaixo do corpo da mandíbula.',
      origin: [
        'Ventre posterior: incisura mastóidea do osso temporal.',
        'Ventre anterior: fossa digástrica, na face interna da margem inferior da mandíbula, junto à sínfise.',
      ],
      insertion:
        'Tendão intermédio, que perfura o músculo estilo-hióideo e é mantido junto ao corpo e ao corno maior do hioide por uma alça fibrosa.',
      innervation: [
        'Ventre anterior: nervo milo-hióideo (ramo do nervo alveolar inferior, V3).',
        'Ventre posterior: nervo facial (VII).',
      ],
      function: 'Na deglutição, eleva o hioide; com o hioide fixado pelos infra-hióideos, abaixa a mandíbula.',
      clinicalRelevance:
        'Seus dois ventres e a margem da mandíbula delimitam o trígono submandibular, onde se localizam a glândula e os linfonodos submandibulares.',
    },
    relatedStructures: ['anterior-belly-of-digastric-muscle', 'posterior-belly-of-digastric-muscle', 'intermediate-tendon-of-digastric-muscle', 'stylohyoid-muscle', 'hyoid-bone', 'nerve-to-mylohyoid-muscle', 'facial-nerve-vii', 'submandibular-gland'],
    references: [
      gray(GRAY.suprahyoid, 'description', 'origin', 'insertion', 'innervation', 'function'),
      osMuscles(OS.muscleTongueNeck, 'function'),
    ],
  },
  {
    id: 'anterior-belly-of-digastric-muscle',
    content: {
      origin: 'Fossa digástrica da mandíbula, junto à sínfise.',
      innervation: 'Nervo milo-hióideo, ramo do nervo alveolar inferior (V3).',
    },
    relatedStructures: ['digastric', 'nerve-to-mylohyoid-muscle', 'mylohyoid-muscle'],
    references: [gray(GRAY.suprahyoid, 'origin', 'innervation')],
  },
  {
    id: 'posterior-belly-of-digastric-muscle',
    content: {
      origin: 'Incisura mastóidea do osso temporal.',
      innervation: 'Nervo facial (VII).',
    },
    relatedStructures: ['digastric', 'facial-nerve-vii', 'stylohyoid-muscle', 'temporal-bone'],
    references: [gray(GRAY.suprahyoid, 'origin', 'innervation')],
  },
  {
    id: 'intermediate-tendon-of-digastric-muscle',
    content: {
      description: 'Une os dois ventres do digástrico; perfura o músculo estilo-hióideo e é preso ao corpo e ao corno maior do hioide por uma alça fibrosa.',
    },
    relatedStructures: ['digastric', 'stylohyoid-muscle', 'hyoid-bone'],
    references: [gray(GRAY.suprahyoid, 'description')],
  },
  {
    id: 'mylohyoid-muscle',
    content: {
      description: 'Músculo plano e triangular que forma, com o do lado oposto, o diafragma muscular do assoalho da boca.',
      origin: 'Toda a extensão da linha milo-hióidea da mandíbula, da sínfise até a altura do último molar.',
      insertion: 'Fibras posteriores: corpo do hioide. Fibras médias e anteriores: rafe fibrosa mediana entre a sínfise e o hioide.',
      innervation: 'Nervo milo-hióideo, ramo do nervo alveolar inferior (V3).',
      function: 'Eleva o hioide e a base da língua na deglutição; com o hioide fixo, auxilia o abaixamento da mandíbula.',
      clinicalRelevance:
        'A posição dos ápices radiculares em relação à linha milo-hióidea orienta a disseminação de infecções dos molares inferiores para o espaço sublingual (acima) ou submandibular (abaixo).',
    },
    clinicalTerms: ['espaço submandibular', 'espaço sublingual', 'angina de Ludwig'],
    relatedStructures: ['geniohyoid-muscle', 'anterior-belly-of-digastric-muscle', 'nerve-to-mylohyoid-muscle', 'mandible', 'hyoid-bone', 'sublingual-gland', 'submandibular-gland'],
    references: [
      gray(GRAY.suprahyoid, 'description', 'origin', 'insertion', 'innervation', 'function'),
      osMuscles(OS.muscleTongueNeck, 'function'),
    ],
  },
  {
    id: 'geniohyoid-muscle',
    content: {
      description: 'Músculo estreito situado acima da margem medial do milo-hióideo, em contato com o do lado oposto.',
      origin: 'Espinha geniana (mentual) inferior, na face posterior da sínfise da mandíbula.',
      insertion: 'Face anterior do corpo do hioide.',
      innervation: 'Nervo hipoglosso (XII), conforme o Gray (1918).',
      function: 'Eleva o hioide e o traciona para a frente; com o hioide fixo, auxilia o abaixamento da mandíbula.',
    },
    relatedStructures: ['mylohyoid-muscle', 'genioglossus-muscle', 'hypoglossal-nerve-xii', 'hyoid-bone', 'mandible'],
    references: [gray(GRAY.suprahyoid, 'description', 'origin', 'insertion', 'innervation', 'function'), osMuscles(OS.muscleTongueNeck, 'function')],
  },
  {
    id: 'stylohyoid-muscle',
    content: {
      description: 'Músculo delgado, anterior e superior ao ventre posterior do digástrico.',
      origin: 'Faces posterior e lateral do processo estiloide, junto à base.',
      insertion: 'Corpo do hioide, na junção com o corno maior; perfurado próximo à inserção pelo tendão do digástrico.',
      innervation: 'Nervo facial (VII).',
      function: 'Eleva e retrai o hioide.',
    },
    relatedStructures: ['posterior-belly-of-digastric-muscle', 'intermediate-tendon-of-digastric-muscle', 'stylohyoid-ligament', 'hyoid-bone', 'facial-nerve-vii'],
    references: [gray(GRAY.suprahyoid, 'description', 'origin', 'insertion', 'innervation'), osMuscles(OS.muscleTongueNeck, 'function')],
  },
  {
    id: 'genioglossus-muscle',
    content: {
      description: 'Músculo plano e triangular, próximo e paralelo ao plano mediano; ápice na mandíbula e base na língua e no hioide.',
      origin: 'Espinha geniana (mentual) superior, na face interna da sínfise da mandíbula.',
      insertion: 'Toda a face inferior da língua, da raiz ao ápice; fibras inferiores no corpo do hioide.',
      function: 'Abaixa e protrai a língua.',
      innervation: 'Nervo hipoglosso (XII).',
      clinicalRelevance:
        'Ao protrair a língua, impede que ela caia sobre a parede posterior da faringe; por isso a anteriorização da mandíbula ajuda a desobstruir a via aérea em pacientes inconscientes.',
    },
    relatedStructures: ['tongue', 'geniohyoid-muscle', 'hyoglossus-muscle', 'hypoglossal-nerve-xii', 'mandible', 'hyoid-bone'],
    references: [gray(GRAY.tongue, 'description', 'origin', 'insertion'), osMuscles(OS.muscleTongueNeck, 'function', 'origin'), osNervesHypoglossal()],
  },
  {
    id: 'hyoglossus-muscle',
    content: {
      description: 'Músculo fino e quadrilátero da parte lateral da língua.',
      origin: 'Lateral do corpo e toda a extensão do corno maior do hioide.',
      insertion: 'Lateral da língua, entre o estiloglosso e o longitudinal inferior.',
      function: 'Abaixa e achata a língua.',
      innervation: 'Nervo hipoglosso (XII).',
      anatomicalRelations: 'O nervo lingual e o ducto submandibular cruzam sua face lateral; a artéria lingual passa profundamente a ele.',
    },
    relatedStructures: ['tongue', 'genioglossus-muscle', 'styloglossus', 'lingual-nerve', 'submandibular-duct', 'lingual-artery', 'hypoglossal-nerve-xii'],
    references: [gray(GRAY.tongue, 'description', 'origin', 'insertion'), gray(GRAY.externalCarotid, 'anatomicalRelations'), gray(GRAY.mandibularNerve, 'anatomicalRelations'), osMuscles(OS.muscleTongueNeck, 'function'), osNervesHypoglossal()],
  },
  {
    id: 'styloglossus',
    name: 'Músculo estiloglosso',
    categories: ['muscles', 'tongue'],
    subCategory: 'Músculo extrínseco da língua',
    regions: ['tongue', 'pharynx'],
    functionTags: ['swallowing', 'speech'],
    side: 'bilateral',
    content: {
      origin: 'Processo estiloide do osso temporal.',
      function: 'Eleva e retrai a língua.',
      innervation: 'Nervo hipoglosso (XII).',
    },
    relatedStructures: ['tongue', 'hyoglossus-muscle', 'temporal-bone', 'hypoglossal-nerve-xii'],
    references: [osMuscles(OS.muscleTongueNeck, 'origin', 'function'), osNervesHypoglossal()],
  },
  {
    id: 'palatoglossus',
    name: 'Músculo palatoglosso',
    categories: ['muscles', 'tongue', 'oral'],
    subCategory: 'Músculo extrínseco da língua / do palato mole',
    regions: ['tongue', 'oral-cavity', 'pharynx'],
    functionTags: ['swallowing', 'speech'],
    side: 'bilateral',
    content: {
      origin: 'Palato mole.',
      function: 'Eleva a parte posterior da língua e estreita o istmo das fauces.',
      anatomicalRelations: 'Embora seja músculo da língua, está mais associado ao palato mole quanto à posição e à função; forma o arco palatoglosso.',
    },
    relatedStructures: ['tongue', 'soft-palate', 'palatine-tonsil'],
    references: [osMuscles(OS.muscleTongueNeck, 'origin', 'function'), gray(GRAY.tongue, 'anatomicalRelations')],
  },

  // ------------------------------------------------------------ Infra-hióideos e cervicais
  {
    id: 'sternohyoid-muscle',
    content: {
      origin: 'Clavícula.',
      insertion: 'Corpo do hioide.',
      function: 'Abaixa o hioide após a deglutição.',
      innervation: 'Ramos da alça cervical (C1–C3; "ansa hypoglossi" na nomenclatura de 1918).',
    },
    relatedStructures: ['omohyoid-muscle', 'sternothyroid-muscle', 'thyrohyoid-muscle', 'hyoid-bone'],
    references: [osMuscles(OS.muscleTongueNeck, 'origin', 'function'), gray(GRAY.suprahyoid, 'innervation', 'insertion')],
  },
  {
    id: 'omohyoid-muscle',
    content: {
      description: 'Dois ventres unidos por um tendão central, mantido em posição por uma expansão da fáscia cervical profunda.',
      origin: 'Margem superior da escápula (ventre inferior).',
      insertion: 'Margem inferior do corpo do hioide, lateralmente à inserção do esterno-hióideo (ventre superior).',
      function: 'Abaixa o hioide e o leva para trás e para o lado.',
      innervation: 'Ramos da alça cervical (C1–C3).',
      anatomicalRelations: 'O ventre inferior passa posteriormente ao esternocleidomastóideo, onde se torna tendíneo e muda de direção.',
    },
    relatedStructures: ['sternohyoid-muscle', 'sternocleidomastoid-muscle', 'hyoid-bone'],
    references: [gray(GRAY.suprahyoid, 'description', 'origin', 'insertion', 'function', 'innervation', 'anatomicalRelations'), osMuscles(OS.muscleTongueNeck, 'function')],
  },
  {
    id: 'sternothyroid-muscle',
    content: {
      origin: 'Face posterior do manúbrio do esterno, abaixo do esterno-hióideo, e cartilagem da primeira costela.',
      insertion: 'Linha oblíqua da lâmina da cartilagem tireóidea.',
      function: 'Abaixa a laringe, a cartilagem tireóidea e o hioide.',
      innervation: 'Ramos da alça cervical (C1–C3).',
    },
    relatedStructures: ['thyrohyoid-muscle', 'sternohyoid-muscle', 'thyroid-cartilage'],
    references: [gray(GRAY.suprahyoid, 'origin', 'insertion', 'innervation'), osMuscles(OS.muscleTongueNeck, 'function')],
  },
  {
    id: 'thyrohyoid-muscle',
    content: {
      description: 'Pequeno músculo quadrilátero que parece continuar para cima o esternotireóideo.',
      origin: 'Linha oblíqua da lâmina da cartilagem tireóidea.',
      insertion: 'Margem inferior do corno maior do hioide.',
      function: 'Aproxima a cartilagem tireóidea e o hioide.',
      innervation: 'Ramo dos dois primeiros nervos cervicais que acompanha o nervo hipoglosso.',
    },
    relatedStructures: ['sternothyroid-muscle', 'thyroid-cartilage', 'hyoid-bone', 'hypoglossal-nerve-xii'],
    references: [gray(GRAY.suprahyoid, 'description', 'origin', 'insertion', 'innervation'), osMuscles(OS.muscleTongueNeck, 'function')],
  },
  {
    id: 'sternocleidomastoid-muscle',
    content: {
      description: 'Cruza obliquamente a lateral do pescoço; espesso no meio e mais largo e delgado nas extremidades.',
      origin: [
        'Cabeça esternal: parte superior da face anterior do manúbrio do esterno.',
        'Cabeça clavicular: margem superior e face anterior do terço medial da clavícula.',
      ],
      insertion: 'Face lateral do processo mastoide (do ápice à margem superior) e metade lateral da linha nucal superior do occipital.',
      function: 'Gira e inclina a cabeça.',
      innervation: 'Nervo acessório (XI), que perfura o músculo a caminho do trapézio.',
      clinicalRelevance: 'Principal referência de superfície do pescoço: separa os trígonos cervicais anterior e posterior e orienta a palpação de linfonodos cervicais.',
    },
    relatedStructures: ['accessory-nerve-xi', 'temporal-bone', 'occipital-bone', 'internal-jugular-vein', 'superficial-lateral-cervical-nodes'],
    references: [gray(GRAY.scm, 'description', 'origin', 'insertion'), osMuscles(OS.muscleHead, 'function', 'origin', 'insertion'), gray(GRAY.neckTriangles, 'innervation'), osNervesAccessory()],
  },
  {
    id: 'scalenus-anterior-muscle',
    content: { function: 'Com os demais escalenos, flete, inclina lateralmente e gira o pescoço; contribui para a inspiração profunda.' },
    relatedStructures: ['scalenus-medius-muscle', 'scalenus-posterior-muscle'],
    references: [osMuscles('Seção 11.3 — Músculos escalenos (texto)', 'function')],
  },
  {
    id: 'scalenus-medius-muscle',
    content: { function: 'Com os demais escalenos, flete, inclina lateralmente e gira o pescoço; contribui para a inspiração profunda.' },
    relatedStructures: ['scalenus-anterior-muscle', 'scalenus-posterior-muscle'],
    references: [osMuscles('Seção 11.3 — Músculos escalenos (texto)', 'function')],
  },
  {
    id: 'scalenus-posterior-muscle',
    content: { function: 'Com os demais escalenos, flete, inclina lateralmente e gira o pescoço; contribui para a inspiração profunda.' },
    relatedStructures: ['scalenus-anterior-muscle', 'scalenus-medius-muscle'],
    references: [osMuscles('Seção 11.3 — Músculos escalenos (texto)', 'function')],
  },
  {
    id: 'splenius-capitis-muscle',
    content: {
      origin: 'Processos espinhosos de vértebras cervicais e torácicas.',
      insertion: 'Processo mastoide e osso occipital.',
      function: 'Estende, inclina lateralmente e gira a cabeça.',
    },
    references: [osMuscles(OS.muscleHead, 'origin', 'insertion', 'function')],
  },
  {
    id: 'longissimus-capitis-muscle',
    content: {
      origin: 'Processos transversos e articulares de vértebras cervicais e torácicas.',
      insertion: 'Processo mastoide.',
      function: 'Estende, inclina lateralmente e gira a cabeça.',
    },
    references: [osMuscles(OS.muscleHead, 'origin', 'insertion', 'function')],
  },

  // ------------------------------------------------------------ Músculos extrínsecos do bulbo do olho
  ...(
    [
      ['superior-rectus-muscle', 'Anel tendíneo comum.', 'Face superior do bulbo do olho.', 'Eleva e aduz o olho.', 'oculomotor-nerve-iii'],
      ['inferior-rectus-muscle', 'Anel tendíneo comum.', 'Face inferior do bulbo do olho.', 'Abaixa e aduz o olho.', 'oculomotor-nerve-iii'],
      ['medial-rectus-muscle', 'Anel tendíneo comum.', 'Face medial do bulbo do olho.', 'Aduz o olho.', 'oculomotor-nerve-iii'],
      ['lateral-rectus-muscle', 'Anel tendíneo comum.', 'Face lateral do bulbo do olho.', 'Abduz o olho.', 'abducens-nerve-vi'],
      ['superior-oblique-muscle', 'Osso esfenoide.', 'Bulbo do olho, entre os retos superior e lateral.', 'Abaixa e abduz o olho.', 'trochlear-nerve-iv'],
      ['inferior-oblique-muscle', 'Assoalho da órbita (maxila).', 'Bulbo do olho, entre os retos inferior e lateral.', 'Eleva e abduz o olho.', 'oculomotor-nerve-iii'],
      ['levator-palpebrae-superioris', 'Teto da órbita (esfenoide).', 'Pele da pálpebra superior.', 'Eleva a pálpebra superior.', 'oculomotor-nerve-iii'],
    ] as const
  ).map(
    ([id, origin, insertion, fn, nerve]): StructureDraft => ({
      id,
      content: { origin, insertion, function: fn },
      relatedStructures: [nerve],
      references: [osMuscles(OS.muscleEye, 'origin', 'insertion', 'function')],
    }),
  ),
]

function osNervesHypoglossal() {
  return { sourceId: 'openstax-ap2e-13-4', locator: 'Seção 13.4 — Tabela 13.3 (XII, hipoglosso: músculos da língua)', fields: ['innervation' as const] }
}
function osNervesAccessory() {
  return { sourceId: 'openstax-ap2e-13-4', locator: 'Seção 13.4 — Tabela 13.3 (XI, acessório: músculos do pescoço)', fields: ['innervation' as const] }
}
