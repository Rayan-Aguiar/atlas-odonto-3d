import { GRAY, OS, gray, osNerves, osSkull, type StructureDraft } from './helpers'

export const NEUROLOGY: StructureDraft[] = [
  {
    id: 'trigeminal-nerve-v',
    content: {
      description: 'Quinto par craniano; nervo misto, com grande componente sensitivo e pequena raiz motora.',
      function: 'Sensibilidade cutânea da face e controle dos músculos da mastigação.',
      branches: ['Nervo oftálmico (V1)', 'Nervo maxilar (V2)', 'Nervo mandibular (V3) — a maior das três divisões'],
      clinicalRelevance:
        'É o nervo da anestesia local odontológica: os bloqueios regionais em odontologia atuam sobre ramos de V2 (dentes superiores) e de V3 (dentes inferiores, língua e mucosas).',
    },
    clinicalTerms: ['anestesia local', 'neuralgia do trigêmeo'],
    relatedStructures: ['ophthalmic-nerve', 'maxillary-nerve', 'mandibular-nerve', 'sensory-root-of-trigeminal-nerve', 'motor-root-of-trigeminal-nerve', 'masseter', 'temporalis-muscle'],
    references: [
      osNerves(OS.cranialNerves, 'function', 'description'),
      gray(GRAY.trigeminal, 'branches', 'description'),
    ],
  },
  {
    id: 'sensory-root-of-trigeminal-nerve',
    content: { description: 'Raiz maior do trigêmeo, que se continua com o gânglio trigeminal (semilunar), de onde partem as três divisões.' },
    relatedStructures: ['trigeminal-nerve-v', 'motor-root-of-trigeminal-nerve'],
    references: [gray(GRAY.mandibularNerve, 'description')],
  },
  {
    id: 'motor-root-of-trigeminal-nerve',
    content: {
      description: 'Pequena raiz motora que passa por baixo do gânglio trigeminal e se une à raiz sensitiva logo após sua saída pelo forame oval, formando o nervo mandibular.',
      function: 'Conduz as fibras motoras para os músculos da mastigação.',
    },
    relatedStructures: ['trigeminal-nerve-v', 'mandibular-nerve', 'foramen-ovale'],
    references: [gray(GRAY.mandibularNerve, 'description', 'function')],
  },
  {
    id: 'ophthalmic-nerve',
    content: { description: 'Primeira divisão (V1) do nervo trigêmeo; sensitiva.' },
    relatedStructures: ['trigeminal-nerve-v', 'superior-orbital-fissure'],
    references: [gray(GRAY.trigeminal, 'description')],
  },
  {
    id: 'maxillary-nerve',
    content: {
      description: 'Segunda divisão (V2) do trigêmeo; nervo sensitivo, intermediário em posição e calibre entre o oftálmico e o mandibular.',
      course:
        'Origina-se no meio do gânglio trigeminal, sai do crânio pelo forame redondo, cruza a fossa pterigopalatina, inclina-se lateralmente sobre a face posterior da maxila e entra na órbita pela fissura orbital inferior; percorre o sulco e o canal infraorbitais e surge na face pelo forame infraorbital (como nervo infraorbital).',
      branches: [
        'Ramo meníngeo',
        'Ramos alveolares superiores posteriores',
        'Ramo alveolar superior médio',
        'Ramo alveolar superior anterior',
        'Nervo infraorbital (continuação terminal)',
        'Nervos nasopalatino e palatinos, por meio do gânglio pterigopalatino',
      ],
      territory: 'Bochecha, nariz, lábio superior e dentes superiores, além da mucosa do seio maxilar, do palato e da cavidade nasal.',
      clinicalRelevance:
        'Os bloqueios do nervo alveolar superior posterior, do infraorbital, do nasopalatino e do palatino maior anestesiam diferentes territórios de V2 para procedimentos na maxila.',
    },
    clinicalTerms: ['bloqueio do alveolar superior posterior', 'bloqueio infraorbital', 'anestesia maxilar'],
    relatedStructures: ['trigeminal-nerve-v', 'foramen-rotundum', 'inferior-orbital-fissure', 'infra-orbital-nerve', 'infra-orbital-foramen', 'posterior-superior-alveolar-nerves', 'nasopalatine-nerve', 'greater-palatine-nerve', 'meningeal-branch-of-maxillary-nerve', 'maxilla'],
    references: [
      gray(GRAY.maxillaryNerve, 'description', 'course', 'branches', 'territory'),
      osSkull(OS.skullOpenings, 'territory'),
    ],
  },
  {
    id: 'meningeal-branch-of-maxillary-nerve',
    content: { description: 'Pequeno ramo do nervo maxilar destinado à dura-máter, emitido antes de o nervo deixar o crânio.' },
    relatedStructures: ['maxillary-nerve'],
    references: [],
  },
  {
    id: 'mandibular-nerve',
    name: 'Nervo mandibular (V3)',
    categories: ['nerves'],
    regions: ['infratemporal', 'mandible', 'cranial-cavity'],
    functionTags: ['general-sensation', 'motor-innervation', 'mastication'],
    side: 'bilateral',
    parentId: 'trigeminal-nerve-v',
    synonyms: ['V3', 'terceira divisão do trigêmeo', 'nervo maxilar inferior'],
    content: {
      description:
        'A maior das três divisões do trigêmeo; formada por uma raiz sensitiva grande (do gânglio trigeminal) e pela raiz motora, que se unem logo após a saída pelo forame oval. É a única divisão do trigêmeo com fibras motoras.',
      territory:
        'Dentes e gengivas da mandíbula, pele da região temporal, aurícula, lábio inferior e parte inferior da face; músculos da mastigação; mucosa dos dois terços anteriores da língua (sensibilidade geral).',
      branches: [
        'Divisão anterior: nervo bucal, nervo massetérico, nervos temporais profundos e nervo pterigóideo lateral',
        'Divisão posterior: nervo auriculotemporal, nervo lingual e nervo alveolar inferior',
      ],
      clinicalRelevance: 'O bloqueio do nervo alveolar inferior (com frequência associado ao do lingual e do bucal) é a técnica básica de anestesia para os dentes inferiores.',
    },
    clinicalTerms: ['bloqueio do nervo alveolar inferior', 'técnica de Gow-Gates', 'anestesia mandibular'],
    relatedStructures: ['anterior-division-of-mandibular-nerve', 'posterior-division-of-mandibular-nerve', 'foramen-ovale', 'motor-root-of-trigeminal-nerve', 'inferior-alveolar-nerve', 'lingual-nerve', 'buccal-nerve', 'auriculotemporal-nerve'],
    references: [
      gray(GRAY.mandibularNerve, 'description', 'territory', 'branches'),
      osSkull(OS.skullOpenings, 'territory'),
    ],
  },
  {
    id: 'anterior-division-of-mandibular-nerve',
    content: {
      description: 'Tronco menor do nervo mandibular; predominantemente motor.',
      branches: ['Nervo bucal (sensitivo)', 'Nervo massetérico', 'Nervos temporais profundos', 'Nervo pterigóideo lateral'],
    },
    relatedStructures: ['mandibular-nerve', 'buccal-nerve', 'masseter', 'temporalis-muscle', 'lateral-pterygoid'],
    references: [gray(GRAY.mandibularNerve, 'branches')],
  },
  {
    id: 'posterior-division-of-mandibular-nerve',
    content: {
      description: 'Tronco maior do nervo mandibular; predominantemente sensitivo.',
      branches: ['Nervo auriculotemporal', 'Nervo lingual', 'Nervo alveolar inferior'],
    },
    relatedStructures: ['mandibular-nerve', 'auriculotemporal-nerve', 'lingual-nerve', 'inferior-alveolar-nerve'],
    references: [gray(GRAY.mandibularNerve, 'branches')],
  },
  {
    id: 'inferior-alveolar-nerve',
    content: {
      description: 'O maior ramo do nervo mandibular.',
      course:
        'Desce com a artéria alveolar inferior, primeiro sob o músculo pterigóideo lateral e depois entre o ligamento esfenomandibular e o ramo da mandíbula, até o forame mandibular. Percorre o canal mandibular, abaixo dos dentes, até o forame mentual, onde se divide nos ramos incisivo e mentual.',
      branches: [
        'Nervo milo-hióideo — emitido pouco antes do forame mandibular',
        'Ramos dentais — para molares e pré-molares, formando o plexo dental inferior',
        'Ramo incisivo — continua no osso para o canino e os incisivos',
        'Nervo mentual — sai pelo forame mentual',
      ],
      territory: 'Polpa e periodonto dos dentes inferiores; por meio do nervo mentual, pele do mento e pele e mucosa do lábio inferior.',
      clinicalRelevance: 'O anestésico deve ser depositado antes de o nervo entrar no forame mandibular para anestesiar os dentes inferiores.',
      anatomicalRelations:
        'Os ápices dos molares inferiores, sobretudo dos terceiros molares, podem situar-se próximos ao canal mandibular; por isso a parestesia do lábio e do mento é uma complicação possível de exodontias e da instalação de implantes.',
    },
    clinicalTerms: ['bloqueio do nervo alveolar inferior', 'BNAI', 'parestesia', 'terceiro molar', 'implante'],
    relatedStructures: ['posterior-division-of-mandibular-nerve', 'inferior-alveolar-artery', 'sphenomandibular-ligament', 'mandibular-foramen', 'mandibular-canal', 'mental-foramen', 'nerve-to-mylohyoid-muscle', 'mental-nerve', 'lingual-nerve', 'medial-pterygoid-muscle', 'mandible'],
    references: [
      gray(GRAY.mandibularNerve, 'description', 'course', 'branches', 'territory'),
      osSkull(OS.mandible, 'clinicalRelevance'),
    ],
  },
  {
    id: 'nerve-to-mylohyoid-muscle',
    content: {
      course: 'Deriva do nervo alveolar inferior pouco antes do forame mandibular e desce em um sulco na face profunda do ramo da mandíbula até a face inferior do milo-hióideo.',
      territory: 'Músculo milo-hióideo e ventre anterior do músculo digástrico.',
    },
    relatedStructures: ['inferior-alveolar-nerve', 'mylohyoid-muscle', 'anterior-belly-of-digastric-muscle', 'mylohyoid-branch-of-inferior-alveolar-artery'],
    references: [gray(GRAY.mandibularNerve, 'course', 'territory')],
  },
  {
    id: 'mental-nerve',
    content: {
      course: 'Emerge pelo forame mentual e divide-se, sob o músculo abaixador do ângulo da boca, em três ramos.',
      branches: ['Um ramo descendente para a pele do mento', 'Dois ramos ascendentes para a pele e a mucosa do lábio inferior'],
      territory: 'Pele do mento; pele e mucosa do lábio inferior.',
      communications: 'Comunica-se livremente com ramos do nervo facial (ramo marginal da mandíbula).',
      clinicalRelevance: 'O bloqueio mentual/incisivo anestesia o lábio inferior e, com difusão para o canal incisivo, os dentes anteriores e pré-molares do lado bloqueado.',
    },
    clinicalTerms: ['bloqueio mentual', 'bloqueio incisivo'],
    relatedStructures: ['inferior-alveolar-nerve', 'mental-foramen', 'depressor-anguli-oris', 'facial-nerve-vii', 'mental-branch-of-inferior-alveolar-artery'],
    references: [gray(GRAY.mandibularNerve, 'course', 'branches', 'territory', 'communications'), osSkull(OS.skullOpenings, 'territory')],
  },
  {
    id: 'lingual-nerve',
    content: {
      territory: 'Mucosa dos dois terços anteriores da língua (sensibilidade geral); conduz também as fibras gustativas e secretomotoras da corda do tímpano.',
      course:
        'Situa-se inicialmente sob o pterigóideo lateral, medial e anterior ao nervo alveolar inferior; recebe a corda do tímpano em ângulo agudo. Passa entre o pterigóideo medial e o ramo da mandíbula, cruza obliquamente para o lado da língua sobre o constritor superior da faringe e o estiloglosso, passa entre o hioglosso e a parte profunda da glândula submandibular, cruza o ducto submandibular e segue ao longo da língua até o ápice, logo abaixo da mucosa.',
      communications: 'Com o nervo facial (pela corda do tímpano), com os nervos alveolar inferior e hipoglosso e com o gânglio submandibular.',
      clinicalRelevance:
        'Fica próximo à cortical lingual na região do terceiro molar inferior; pode ser lesado em exodontias e é anestesiado de rotina no bloqueio do alveolar inferior.',
    },
    clinicalTerms: ['bloqueio do nervo lingual', 'terceiro molar', 'parestesia lingual'],
    relatedStructures: ['posterior-division-of-mandibular-nerve', 'chorda-tympani', 'inferior-alveolar-nerve', 'medial-pterygoid-muscle', 'hyoglossus-muscle', 'submandibular-gland', 'submandibular-duct', 'tongue', 'hypoglossal-nerve-xii'],
    references: [gray(GRAY.mandibularNerve, 'territory', 'course', 'communications')],
  },
  {
    id: 'buccal-nerve',
    content: {
      description: 'Ramo sensitivo da divisão anterior do nervo mandibular.',
      territory: 'Pele da bochecha e mucosa jugal; gengiva vestibular dos molares inferiores.',
      clinicalRelevance: 'Complementa o bloqueio do alveolar inferior para procedimentos na gengiva vestibular dos molares inferiores.',
    },
    clinicalTerms: ['bloqueio do nervo bucal'],
    relatedStructures: ['anterior-division-of-mandibular-nerve', 'bucinator', 'buccal-artery'],
    references: [gray(GRAY.mandibularNerve, 'description')],
  },
  {
    id: 'auriculotemporal-nerve',
    name: 'Nervo auriculotemporal',
    categories: ['nerves'],
    regions: ['infratemporal', 'tmj', 'parotid', 'temporal'],
    functionTags: ['general-sensation', 'salivation'],
    side: 'bilateral',
    parentId: 'posterior-division-of-mandibular-nerve',
    content: {
      course:
        'Origina-se geralmente por duas raízes que envolvem a artéria meníngea média; corre para trás sob o pterigóideo lateral até a face medial do colo da mandíbula, sobe com a artéria temporal superficial entre a aurícula e o côndilo, coberto pela parótida, cruza o arco zigomático e termina em ramos temporais superficiais.',
      communications: 'Com o nervo facial e com o gânglio ótico.',
      clinicalRelevance: 'Contribui para a inervação sensitiva da ATM e conduz fibras secretomotoras para a glândula parótida.',
    },
    relatedStructures: ['posterior-division-of-mandibular-nerve', 'middle-meningeal-artery', 'superficial-temporal-artery', 'parotid-gland', 'articular-capsule-of-temporomandibular-joint'],
    references: [gray(GRAY.mandibularNerve, 'course', 'communications')],
  },
  {
    id: 'infra-orbital-nerve',
    name: 'Nervo infraorbital',
    categories: ['nerves'],
    regions: ['maxilla', 'orbit', 'face'],
    functionTags: ['general-sensation'],
    side: 'bilateral',
    parentId: 'maxillary-nerve',
    content: {
      description: 'Continuação terminal do nervo maxilar após entrar no sulco infraorbital.',
      course: 'Percorre o sulco e o canal infraorbitais no assoalho da órbita e surge na face pelo forame infraorbital.',
      branches: ['Ramo alveolar superior médio (no canal infraorbital)', 'Ramo alveolar superior anterior (pouco antes do forame infraorbital)', 'Ramos terminais para pálpebra inferior, nariz e lábio superior'],
      territory: 'Nariz, lábio superior e região anterior da bochecha; por meio dos ramos alveolares superiores médio e anterior, pré-molares, canino e incisivos superiores.',
      clinicalRelevance: 'O bloqueio infraorbital anestesia os dentes anteriores e pré-molares superiores e os tecidos moles da região.',
    },
    clinicalTerms: ['bloqueio infraorbital', 'alveolar superior anterior'],
    relatedStructures: ['maxillary-nerve', 'infra-orbital-foramen', 'infra-orbital-artery', 'maxilla'],
    references: [gray(GRAY.maxillaryNerve, 'description', 'course', 'branches'), osSkull(OS.skullOpenings, 'territory')],
  },
  {
    id: 'posterior-superior-alveolar-nerves',
    name: 'Ramos alveolares superiores posteriores',
    categories: ['nerves'],
    regions: ['maxilla', 'infratemporal'],
    functionTags: ['general-sensation'],
    side: 'bilateral',
    parentId: 'maxillary-nerve',
    synonyms: ['nervo alveolar superior posterior', 'ASP'],
    content: {
      course:
        'Saem do tronco do nervo maxilar pouco antes de ele entrar no sulco infraorbital (geralmente dois); descem sobre o túber da maxila e entram nos canais alveolares posteriores da face infratemporal da maxila.',
      territory: 'Gengiva e mucosa jugal adjacente; mucosa do seio maxilar; molares superiores.',
      communications: 'Comunicam-se com o ramo alveolar superior médio, formando o plexo dental superior.',
      clinicalRelevance: 'O bloqueio do alveolar superior posterior, no túber da maxila, anestesia os molares superiores; a proximidade do plexo venoso pterigóideo exige aspiração prévia.',
    },
    clinicalTerms: ['bloqueio do alveolar superior posterior', 'túber da maxila'],
    relatedStructures: ['maxillary-nerve', 'posterior-superior-alveolar-artery', 'maxilla', 'pterygoid-venous-plexus'],
    references: [gray(GRAY.maxillaryNerve, 'course', 'territory', 'communications')],
  },
  {
    id: 'nasopalatine-nerve',
    name: 'Nervo nasopalatino',
    categories: ['nerves'],
    regions: ['nasal-cavity', 'oral-cavity', 'maxilla'],
    functionTags: ['general-sensation'],
    side: 'bilateral',
    parentId: 'maxillary-nerve',
    content: {
      course: 'Atravessa o canal incisivo, ao lado do ramo terminal da artéria palatina descendente, chegando à parte anterior do palato.',
      clinicalRelevance: 'O bloqueio nasopalatino, junto à papila incisiva, anestesia a mucosa palatina anterior (de canino a canino).',
    },
    clinicalTerms: ['bloqueio nasopalatino', 'papila incisiva'],
    relatedStructures: ['maxillary-nerve', 'incisive-canal', 'greater-palatine-nerve'],
    references: [gray(GRAY.maxilla, 'course')],
  },
  {
    id: 'greater-palatine-nerve',
    name: 'Nervo palatino maior',
    categories: ['nerves'],
    regions: ['oral-cavity', 'pterygopalatine'],
    functionTags: ['general-sensation'],
    side: 'bilateral',
    parentId: 'maxillary-nerve',
    synonyms: ['nervo palatino anterior'],
    content: {
      course: 'Corre em sulcos da face inferior do processo palatino da maxila (descrito no Gray como nervo palatino anterior, vindo do gânglio pterigopalatino).',
      clinicalRelevance: 'O bloqueio palatino maior anestesia a mucosa do palato duro posterior ao canino do lado bloqueado.',
    },
    clinicalTerms: ['bloqueio palatino maior'],
    relatedStructures: ['maxillary-nerve', 'greater-palatine-foramen', 'greater-palatine-artery', 'nasopalatine-nerve'],
    references: [gray(GRAY.maxilla, 'course')],
  },
  {
    id: 'chorda-tympani',
    content: {
      description: 'Ramo do nervo facial que atravessa a orelha média e une-se ao nervo lingual em ângulo agudo, na fossa infratemporal.',
      function: 'Conduz a gustação dos dois terços anteriores da língua e fibras secretomotoras para as glândulas submandibular e sublingual.',
    },
    relatedStructures: ['facial-nerve-vii', 'lingual-nerve', 'submandibular-gland', 'sublingual-gland'],
    references: [gray(GRAY.mandibularNerve, 'description')],
  },

  // ------------------------------------------------------------ Outros nervos cranianos
  {
    id: 'facial-nerve-vii',
    content: {
      description:
        'Sétimo par craniano; formado por uma parte motora e uma parte sensitiva (nervo intermédio), que emergem na margem inferior da ponte.',
      function: 'Controla os músculos da expressão facial, participa da gustação e da produção de saliva.',
      course: 'Sai do crânio pelo forame estilomastóideo, que é o término do canal facial.',
      anatomicalRelations: 'Após sair do forame estilomastóideo, atravessa a glândula parótida, onde se divide nos ramos terminais da face.',
      branches: [
        'Ramos temporais — músculos auriculares e região temporal',
        'Ramos zigomáticos — músculo orbicular do olho',
        'Ramos bucais — abaixo da órbita e ao redor da boca',
        'Ramo marginal da mandíbula — músculos do lábio inferior e do mento',
        'Ramo cervical — platisma',
        'Corda do tímpano — gustação e secreção salivar',
      ],
      clinicalRelevance:
        'Por atravessar a parótida, pode ser atingido por anestésico depositado muito posteriormente durante o bloqueio do alveolar inferior, causando paralisia facial transitória.',
    },
    clinicalTerms: ['paralisia facial', 'paralisia de Bell', 'paralisia facial transitória'],
    relatedStructures: ['stylomastoid-foramen', 'parotid-gland', 'chorda-tympani', 'orbicularis-oris-muscle', 'bucinator', 'posterior-belly-of-digastric-muscle', 'stylohyoid-muscle', 'platysma'],
    references: [
      gray('Neurology — The facial nerve', 'description', 'branches'),
      gray(GRAY.temporal, 'course'),
      osNerves(OS.cranialNerves, 'function'),
      osSkull(OS.skullOpenings, 'course'),
    ],
  },
  {
    id: 'glossopharyngeal-nerve-ix',
    content: {
      function: 'Controla músculos da cavidade oral e da parte superior da faringe; participa da gustação e da produção de saliva.',
      description: 'Contém fibras somáticas sensitivas, viscerais aferentes, gustativas, somáticas motoras e viscerais eferentes.',
    },
    relatedStructures: ['jugular-foramen', 'stylopharyngeus-muscle', 'parotid-gland', 'tongue'],
    references: [osNerves(OS.cranialNerves, 'function'), gray('Neurology — The glossopharyngeal nerve', 'description')],
  },
  {
    id: 'vagus-nerve-x',
    content: {
      function: 'Contribui para o controle homeostático das vísceras torácicas e abdominais superiores; participa das respostas viscerais ao paladar (reflexo do vômito).',
    },
    relatedStructures: ['jugular-foramen', 'internal-jugular-vein', 'internal-carotid-artery'],
    references: [osNerves(OS.cranialNerves, 'function')],
  },
  {
    id: 'accessory-nerve-xi',
    content: {
      function: 'Controla músculos do pescoço, juntamente com nervos espinais cervicais.',
      anatomicalRelations: 'Perfura o músculo esternocleidomastóideo e cruza obliquamente o trígono posterior do pescoço até a face profunda do trapézio.',
    },
    relatedStructures: ['sternocleidomastoid-muscle', 'jugular-foramen'],
    references: [osNerves(OS.cranialNerves, 'function'), gray(GRAY.neckTriangles, 'anatomicalRelations')],
  },
  {
    id: 'hypoglossal-nerve-xii',
    content: {
      function: 'Controla os músculos da língua (e, segundo a tabela da fonte, músculos da parte inferior da faringe e da laringe).',
      anatomicalRelations: 'Cruza a alça da artéria lingual no pescoço.',
      clinicalRelevance: 'Lesão unilateral causa desvio da língua para o lado lesado na protrusão.',
    },
    relatedStructures: ['hypoglossal-canal', 'genioglossus-muscle', 'hyoglossus-muscle', 'styloglossus', 'geniohyoid-muscle', 'lingual-artery', 'tongue'],
    references: [osNerves(OS.cranialNerves, 'function'), gray(GRAY.externalCarotid, 'anatomicalRelations')],
  },
  ...(
    [
      ['olfactory-nerve-i', 'Sensitivo: olfação, a partir do epitélio olfatório.', 'olfactory-foramina'],
      ['optic-nerve-ii', 'Sensitivo: visão, a partir da retina.', 'optic-canal'],
      ['oculomotor-nerve-iii', 'Motor: quatro músculos extrínsecos do olho e levantador da pálpebra superior; fibras autônomas para o gânglio ciliar.', 'superior-orbital-fissure'],
      ['trochlear-nerve-iv', 'Motor: músculo oblíquo superior.', 'superior-orbital-fissure'],
      ['abducens-nerve-vi', 'Motor: músculo reto lateral.', 'superior-orbital-fissure'],
      ['vestibulocochlear-nerve-viii', 'Sensitivo: audição (parte coclear) e equilíbrio (parte vestibular).', 'internal-acoustic-meatus'],
    ] as const
  ).map(
    ([id, fn, opening]): StructureDraft => ({
      id,
      content: { function: fn },
      relatedStructures: [opening],
      references: [osNerves(OS.cranialNerves, 'function')],
    }),
  ),
]
