import { GRAY, gray, type StructureDraft } from './helpers'

export const ANGIOLOGY: StructureDraft[] = [
  {
    id: 'common-carotid-artery',
    name: 'Artéria carótida comum',
    categories: ['arteries'],
    regions: ['cervical', 'neck-triangles'],
    functionTags: ['arterial-supply'],
    side: 'bilateral',
    content: {
      branches: ['Artéria carótida externa', 'Artéria carótida interna'],
    },
    relatedStructures: ['right-common-carotid-artery', 'left-common-carotid-artery', 'external-carotid-artery', 'internal-carotid-artery', 'internal-jugular-vein'],
    references: [gray(GRAY.externalCarotid, 'branches')],
  },
  {
    id: 'external-carotid-artery',
    content: {
      course:
        'Começa na altura da margem superior da cartilagem tireóidea, sobe em trajeto levemente curvo para cima e para a frente e depois inclina-se para trás até o espaço posterior ao colo da mandíbula, onde termina. Diminui rapidamente de calibre pelo grande número de ramos.',
      branches: [
        'Artéria tireóidea superior',
        'Artéria lingual',
        'Artéria facial',
        'Artéria faríngea ascendente',
        'Artéria occipital',
        'Artéria auricular posterior',
        'Ramos terminais: artéria temporal superficial e artéria maxilar',
      ],
      territory: 'Estruturas da face, do couro cabeludo, da cavidade oral, da faringe e do pescoço (exceto o encéfalo e a órbita, supridos pela carótida interna).',
    },
    relatedStructures: ['common-carotid-artery', 'internal-carotid-artery', 'lingual-artery', 'facial-artery', 'maxillary-artery', 'superficial-temporal-artery', 'occipital-artery', 'ascending-pharyngeal-artery', 'parotid-gland'],
    references: [gray(GRAY.externalCarotid, 'course', 'branches')],
  },
  {
    id: 'maxillary-artery',
    content: {
      description: 'O maior dos dois ramos terminais da carótida externa; supre as estruturas profundas da face.',
      course:
        'Origina-se atrás do colo da mandíbula, inicialmente imersa na glândula parótida; passa para a frente entre o ramo da mandíbula e o ligamento esfenomandibular e segue, superficial ou profundamente ao músculo pterigóideo lateral, até a fossa pterigopalatina.',
      branches: [
        '1ª parte (mandibular): auricular profunda, timpânica anterior, meníngea média, meníngea acessória e alveolar inferior',
        '2ª parte (pterigóidea): temporais profundas, pterigóideas, massetérica e bucal',
        '3ª parte (pterigopalatina): alveolar superior posterior, infraorbital, palatina descendente, do canal pterigóideo, faríngea e esfenopalatina',
      ],
      territory: 'Mandíbula e maxila com seus dentes, músculos da mastigação, palato, cavidade nasal e dura-máter (pela meníngea média).',
      clinicalRelevance:
        'Seus ramos acompanham os nervos alveolares; a punção acidental de ramos da artéria ou do plexo pterigóideo durante bloqueios na fossa infratemporal pode causar hematoma.',
    },
    clinicalTerms: ['hematoma', 'bloqueio do alveolar superior posterior'],
    relatedStructures: ['external-carotid-artery', 'sphenomandibular-ligament', 'lateral-pterygoid', 'inferior-alveolar-artery', 'middle-meningeal-artery', 'posterior-superior-alveolar-artery', 'infra-orbital-artery', 'descending-palatine-artery', 'buccal-artery', 'maxillary-veins', 'pterygoid-venous-plexus'],
    references: [gray(GRAY.maxillaryArtery, 'description', 'course', 'branches')],
  },
  {
    id: 'inferior-alveolar-artery',
    content: {
      course:
        'Ramo da primeira parte da artéria maxilar; desce com o nervo alveolar inferior até o forame mandibular e percorre o canal mandibular; emite o ramo milo-hióideo antes de entrar no forame e o ramo mentual, que sai pelo forame mentual com o nervo.',
      territory: 'Mandíbula, dentes inferiores e periodonto; mento e lábio inferior pelo ramo mentual.',
    },
    relatedStructures: ['maxillary-artery', 'inferior-alveolar-nerve', 'mandibular-foramen', 'mandibular-canal', 'mental-foramen', 'mylohyoid-branch-of-inferior-alveolar-artery', 'mental-branch-of-inferior-alveolar-artery'],
    references: [gray(GRAY.mandibularNerve, 'course'), gray(GRAY.mandible, 'course'), gray(GRAY.maxillaryArtery, 'course')],
  },
  {
    id: 'superficial-temporal-artery',
    content: {
      description: 'O menor dos dois ramos terminais da carótida externa; parece, pela direção, continuar o tronco.',
      course:
        'Começa na glândula parótida, atrás do colo da mandíbula; cruza a raiz posterior do processo zigomático do temporal e, cerca de 5 cm acima dele, divide-se em ramos frontal e parietal.',
      branches: ['Artéria transversa da face', 'Ramo frontal', 'Ramo parietal'],
      anatomicalRelations: 'Ao cruzar o processo zigomático, é coberta por fáscia densa e cruzada pelos ramos temporais e zigomáticos do nervo facial; acompanha o nervo auriculotemporal.',
      clinicalRelevance: 'Seu pulso é palpável anteriormente ao trago, referência útil no exame da região da ATM.',
    },
    relatedStructures: ['external-carotid-artery', 'frontal-branch-of-superficial-temporal-artery', 'transverse-facial-artery', 'facial-nerve-vii', 'auriculotemporal-nerve', 'superficial-temporal-veins'],
    references: [gray(GRAY.externalCarotid, 'description', 'course', 'branches', 'anatomicalRelations'), gray(GRAY.mandibularNerve, 'anatomicalRelations')],
  },
  {
    id: 'lingual-artery',
    name: 'Artéria lingual',
    categories: ['arteries', 'tongue'],
    regions: ['tongue', 'floor-of-mouth', 'cervical'],
    functionTags: ['arterial-supply'],
    side: 'bilateral',
    parentId: 'external-carotid-artery',
    content: {
      course:
        'Origina-se da carótida externa entre a tireóidea superior e a facial; sobe obliquamente até o corno maior do hioide, forma uma alça cruzada pelo nervo hipoglosso, passa sob o digástrico e o estilo-hióideo, segue horizontalmente sob o hioglosso e, por fim, sobe à língua e corre em sua face inferior até o ápice como artéria profunda da língua.',
      territory: 'Língua, assoalho da boca e glândula sublingual.',
      clinicalRelevance: 'Lesões no assoalho da boca (por exemplo, perfuração da cortical lingual em implantes na região anterior da mandíbula) podem atingir ramos linguais e sublinguais e causar hemorragia grave.',
    },
    clinicalTerms: ['hemorragia do assoalho bucal', 'implante'],
    relatedStructures: ['external-carotid-artery', 'hypoglossal-nerve-xii', 'hyoglossus-muscle', 'tongue', 'lingual-vein', 'hyoid-bone'],
    references: [gray(GRAY.externalCarotid, 'course')],
  },
  {
    id: 'facial-artery',
    content: {
      description: 'Ramo da carótida externa (denominado "artéria maxilar externa" no Gray de 1918) que irriga a face superficial.',
      branches: ['Artéria submentual', 'Artéria labial inferior', 'Artéria labial superior', 'Artéria angular (ramo terminal)'],
    },
    relatedStructures: ['external-carotid-artery', 'submental-artery', 'inferior-labial-artery', 'superior-labial-artery', 'angular-artery', 'facial-vein', 'submandibular-gland', 'masseter'],
    references: [gray(GRAY.externalCarotid, 'description')],
  },
  {
    id: 'internal-carotid-artery',
    content: {
      description: 'Ramo terminal da carótida comum que irriga o encéfalo e a órbita; entra no crânio pelo canal carótico.',
    },
    relatedStructures: ['common-carotid-artery', 'carotid-canal', 'ophthalmic-artery', 'cavernous-sinus', 'internal-jugular-vein'],
    references: [],
  },
  {
    id: 'middle-meningeal-artery',
    content: {
      course: 'Ramo da primeira parte da artéria maxilar; entra no crânio pelo forame espinhoso; é envolvida pelas duas raízes do nervo auriculotemporal.',
    },
    relatedStructures: ['maxillary-artery', 'foramen-spinosum', 'auriculotemporal-nerve'],
    references: [gray(GRAY.sphenoid, 'course'), gray(GRAY.mandibularNerve, 'course')],
  },

  {
    id: 'sphenopalatine-artery',
    name: 'Artéria esfenopalatina',
    categories: ['arteries'],
    regions: ['pterygopalatine', 'nasal-cavity'],
    functionTags: ['arterial-supply'],
    side: 'bilateral',
    parentId: 'maxillary-artery',
    content: { description: 'Ramo terminal da terceira parte da artéria maxilar, destinado à cavidade nasal.' },
    relatedStructures: ['maxillary-artery', 'posterior-septal-branches-of-sphenopalatine-artery', 'posterior-lateral-nasal-branches-of-sphenopalatine-artery', 'nasopalatine-nerve'],
    references: [gray(GRAY.maxillaryArtery, 'description')],
  },

  // ------------------------------------------------------------ Veias
  {
    id: 'internal-jugular-vein',
    content: {
      description: 'Coleta o sangue do encéfalo, das partes superficiais da face e do pescoço.',
      course:
        'Continua o seio sigmóideo (incluído no "seio transverso" na descrição de 1918) e começa no compartimento posterior do forame jugular, onde apresenta uma dilatação (bulbo superior). Desce verticalmente na lateral do pescoço, primeiro lateral à carótida interna e depois à carótida comum, e une-se à veia subclávia para formar a veia braquiocefálica.',
      clinicalRelevance: 'Os linfonodos cervicais profundos dispõem-se ao longo dela; é referência no estudo da drenagem linfática de cabeça e pescoço.',
    },
    relatedStructures: ['sigmoid-sinus', 'jugular-foramen', 'internal-carotid-artery', 'common-carotid-artery', 'common-facial-vein', 'jugulodigastric-node', 'vagus-nerve-x'],
    references: [gray(GRAY.neckVeins, 'description', 'course')],
  },
  {
    id: 'facial-vein',
    content: {
      course:
        'Começa na lateral da raiz do nariz como continuação da veia angular; segue posteriormente à artéria facial, com trajeto menos tortuoso, sob os músculos zigomáticos; desce ao longo da margem anterior e depois sobre a face superficial do masseter, cruza o corpo da mandíbula e passa, sob o platisma, superficialmente à glândula submandibular, ao digástrico e ao estilo-hióideo, unindo-se à divisão anterior da veia retromandibular.',
      clinicalRelevance:
        'Comunica-se, pela veia angular e pelas veias oftálmicas, com o seio cavernoso; por isso infecções da região do lábio superior e do nariz exigem atenção quanto à disseminação intracraniana.',
    },
    clinicalTerms: ['triângulo perigoso da face', 'trombose do seio cavernoso'],
    relatedStructures: ['angular-vein', 'facial-artery', 'masseter', 'submandibular-gland', 'common-facial-vein', 'anterior-division-of-retromandibular-vein', 'superior-ophthalmic-vein', 'cavernous-sinus'],
    references: [gray(GRAY.neckVeins, 'course')],
  },
  {
    id: 'retromandibular-vein',
    content: {
      description: 'Formada pela união das veias temporal superficial e maxilar (chamada "veia facial posterior" no Gray de 1918).',
      course: 'Desce dentro da glândula parótida, superficialmente à carótida externa e profundamente ao nervo facial, entre o ramo da mandíbula e o esternocleidomastóideo.',
      branches: [
        'Divisão anterior — une-se à veia facial para formar a veia facial comum',
        'Divisão posterior — recebe a veia auricular posterior e forma a veia jugular externa',
      ],
    },
    relatedStructures: ['superficial-temporal-veins', 'maxillary-veins', 'parotid-gland', 'external-carotid-artery', 'facial-nerve-vii', 'anterior-division-of-retromandibular-vein', 'posterior-division-of-retromandibular-vein', 'external-jugular-vein'],
    references: [gray(GRAY.neckVeins, 'description', 'course', 'branches')],
  },
  {
    id: 'anterior-division-of-retromandibular-vein',
    content: { description: 'Passa para a frente e une-se à veia facial, formando a veia facial comum.' },
    relatedStructures: ['retromandibular-vein', 'facial-vein', 'common-facial-vein'],
    references: [gray(GRAY.neckVeins, 'description')],
  },
  {
    id: 'posterior-division-of-retromandibular-vein',
    content: { description: 'Recebe a veia auricular posterior e torna-se a veia jugular externa.' },
    relatedStructures: ['retromandibular-vein', 'posterior-auricular-vein', 'external-jugular-vein'],
    references: [gray(GRAY.neckVeins, 'description')],
  },
  {
    id: 'pterygoid-venous-plexus',
    name: 'Plexo venoso pterigóideo',
    categories: ['veins'],
    subCategory: 'Plexo venoso',
    regions: ['infratemporal'],
    functionTags: ['venous-drainage'],
    side: 'bilateral',
    content: {
      location: 'Fossa infratemporal, entre os músculos temporal e pterigóideos, acompanhando os ramos da artéria maxilar.',
      communications: 'Drena para as veias maxilares; comunica-se com o seio cavernoso e com a veia facial.',
      clinicalRelevance:
        'Pode ser puncionado no bloqueio do nervo alveolar superior posterior ou do alveolar inferior, produzindo hematoma; a comunicação com o seio cavernoso é via potencial de disseminação de infecções.',
    },
    clinicalTerms: ['hematoma', 'bloqueio do alveolar superior posterior'],
    relatedStructures: ['maxillary-veins', 'maxillary-artery', 'cavernous-sinus', 'facial-vein', 'lateral-pterygoid', 'posterior-superior-alveolar-nerves'],
    references: [],
  },
]
