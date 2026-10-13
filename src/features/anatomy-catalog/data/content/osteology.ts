import type { RegionId } from '../../types'
import { GRAY, OS, gray, osSkull, type StructureDraft } from './helpers'

export const OSTEOLOGY: StructureDraft[] = [
  {
    id: 'mandible',
    content: {
      description: 'Único osso móvel do crânio; formado por um corpo horizontal e dois ramos verticais que se unem a ele no ângulo da mandíbula.',
      features: [
        'Corpo, com a protuberância e os tubérculos mentuais',
        'Processo alveolar — margem superior do corpo, onde se implantam os dentes inferiores',
        'Forame mentual — abaixo do segundo pré-molar, a meio caminho entre as margens superior e inferior do corpo',
        'Linha oblíqua — da região do tubérculo mentual até a margem anterior do ramo',
        'Espinhas genianas (mentuais) — na face interna da sínfise: superiores para os genioglossos, inferiores para os gênio-hióideos',
        'Linha milo-hióidea — origem do músculo milo-hióideo',
        'Ramo e ângulo da mandíbula',
        'Processo coronoide — projeção anterior do ramo, inserção do músculo temporal',
        'Processo condilar (côndilo) — articula-se com o temporal na ATM',
        'Forame mandibular — na face medial do ramo, abre o canal mandibular',
      ],
      articulations: 'Articula-se com os ossos temporais pelas articulações temporomandibulares.',
      clinicalRelevance:
        'O forame mandibular é o alvo do bloqueio do nervo alveolar inferior: o anestésico precisa ser depositado antes desse ponto para anestesiar os dentes inferiores.',
    },
    clinicalTerms: ['bloqueio do nervo alveolar inferior', 'implante', 'fratura de mandíbula'],
    relatedStructures: ['mandibular-foramen', 'mental-foramen', 'mandibular-canal', 'coronoid-process', 'condylar-process', 'temporomandibular-joint', 'inferior-alveolar-nerve', 'masseter', 'temporalis-muscle', 'medial-pterygoid-muscle', 'mylohyoid-muscle', 'genioglossus-muscle'],
    references: [
      osSkull(OS.mandible, 'description', 'features', 'articulations', 'clinicalRelevance'),
      gray(GRAY.mandible, 'features'),
    ],
  },
  {
    id: 'maxilla',
    content: {
      description: 'Osso par que forma a maior parte do terço médio da face, o assoalho da órbita, parte da parede lateral da cavidade nasal e a maior parte do palato duro.',
      features: [
        'Processo palatino — os dois processos unem-se na linha mediana e formam os três quartos anteriores do palato duro',
        'Processo alveolar — margem inferior curva com os alvéolos dos dentes superiores',
        'Forame infraorbital — abaixo da órbita, para o nervo e os vasos infraorbitais',
        'Eminência canina, separando a fossa incisiva da fossa canina',
        'Forame incisivo — na linha mediana do palato, logo atrás dos incisivos',
        'Túber da maxila e canais alveolares posteriores',
        'Seio maxilar — o maior dos seios paranasais',
      ],
      clinicalRelevance:
        'A proximidade dos ápices dos pré-molares e molares superiores com o seio maxilar é relevante em exodontias (comunicação bucossinusal), endodontia e implantodontia.',
    },
    clinicalTerms: ['comunicação bucossinusal', 'levantamento de seio', 'implante'],
    relatedStructures: ['maxillary-sinus', 'infra-orbital-foramen', 'incisive-canal', 'infra-orbital-nerve', 'posterior-superior-alveolar-nerves', 'palatine-bone', 'zygomatic-bone'],
    references: [osSkull(OS.maxilla, 'features'), gray(GRAY.maxilla, 'features'), osSkull(OS.sinuses, 'features')],
  },
  {
    id: 'maxillary-sinus',
    name: 'Seio maxilar',
    categories: ['bones'],
    subCategory: 'Seio paranasal',
    regions: ['maxilla', 'nasal-cavity'],
    functionTags: ['respiration'],
    side: 'bilateral',
    parentId: 'maxilla',
    content: {
      description: 'Espaço aéreo par no interior do corpo da maxila, abaixo da órbita; é o maior dos seios paranasais e comunica-se com a cavidade nasal.',
      anatomicalRelations:
        'Os ramos alveolares superiores posterior, médio e anterior correm nas paredes do seio (posterior, lateral e anterior) e dão ramos para sua mucosa.',
      clinicalRelevance: 'Dor de origem sinusal pode ser referida aos dentes posteriores superiores, e vice-versa; o assoalho do seio relaciona-se com os ápices desses dentes.',
    },
    relatedStructures: ['maxilla', 'posterior-superior-alveolar-nerves', 'infra-orbital-nerve', 'upper-first-molar-tooth-r'],
    references: [osSkull(OS.sinuses, 'description'), gray(GRAY.maxillaryNerve, 'anatomicalRelations')],
  },
  {
    id: 'temporal-bone',
    content: {
      features: [
        'Processo mastoide — grande projeção inferior, palpável atrás do lóbulo da orelha, para inserções musculares',
        'Processo estiloide — projeção alongada posterior à fossa mandibular, para pequenos músculos e para o ligamento que sustenta o hioide',
        'Processo zigomático — une-se ao processo temporal do zigomático para formar o arco zigomático',
        'Fossa mandibular — depressão oval à frente do meato acústico externo, onde a mandíbula se articula',
        'Tubérculo articular — crista lisa imediatamente anterior à fossa mandibular',
        'Meato acústico externo e meato acústico interno',
        'Parte petrosa, com o canal carótico',
        'Forame estilomastóideo — término do canal facial',
      ],
      articulations: 'Forma, com a mandíbula, a articulação temporomandibular (fossa mandibular e tubérculo articular).',
    },
    relatedStructures: ['mandibular-fossa', 'articular-tubercle', 'styloid-process', 'mastoid-process', 'stylomastoid-foramen', 'carotid-canal', 'internal-acoustic-meatus', 'temporomandibular-joint', 'temporalis-muscle'],
    references: [osSkull(OS.temporal, 'features', 'articulations'), gray(GRAY.temporal, 'features')],
  },
  {
    id: 'sphenoid-bone',
    content: {
      description: 'Osso "pedra angular" do crânio, por articular-se com quase todos os outros ossos cranianos.',
      features: [
        'Corpo, com a sela turca e a fossa hipofisial',
        'Asas menores — formam o limite entre as fossas cranianas anterior e média',
        'Asas maiores, com os forames redondo, oval e espinhoso',
        'Processos pterigoides — lâminas medial e lateral; a lâmina lateral ancora músculos da mastigação',
        'Hâmulo pterigóideo, na extremidade da lâmina medial',
        'Seio esfenoidal, no corpo',
      ],
    },
    relatedStructures: ['foramen-ovale', 'foramen-rotundum', 'foramen-spinosum', 'optic-canal', 'superior-orbital-fissure', 'lateral-pterygoid', 'medial-pterygoid-muscle', 'sinus-of-sphenoid-bone'],
    references: [osSkull(OS.sphenoid, 'description', 'features'), gray(GRAY.sphenoid, 'features')],
  },
  {
    id: 'hyoid-bone',
    content: {
      description: 'Pequeno osso em forma de U na parte superior do pescoço, com as pontas voltadas para trás; não se articula com nenhum outro osso.',
      function: 'Serve de base para a língua, liga-se inferiormente à laringe e é mantido em posição por pequenos músculos (supra e infra-hióideos).',
      features: ['Corpo', 'Cornos maiores', 'Cornos menores'],
    },
    relatedStructures: ['mylohyoid-muscle', 'geniohyoid-muscle', 'hyoglossus-muscle', 'digastric', 'stylohyoid-ligament', 'thyrohyoid-muscle', 'sternohyoid-muscle', 'omohyoid-muscle'],
    references: [osSkull(OS.hyoid, 'description', 'function'), gray(GRAY.hyoid, 'features')],
  },
  {
    id: 'zygomatic-bone',
    content: {
      description: 'Forma a proeminência da bochecha, a parte inferolateral da órbita e a parte anterior do arco zigomático.',
      articulations: 'Medialmente com a maxila, posteriormente com o processo zigomático do temporal e superiormente com a asa maior do esfenoide e o processo zigomático do frontal.',
      features: ['Forame zigomaticofacial, para o nervo zigomaticofacial'],
    },
    relatedStructures: ['maxilla', 'temporal-bone', 'masseter', 'zygomaticus-major-muscle'],
    references: [gray('Osteology — The skull: norma frontalis', 'description', 'articulations', 'features')],
  },
  {
    id: 'frontal-bone',
    content: { features: ['Forame (ou incisura) supraorbital, para o nervo sensitivo da fronte', 'Seio frontal, acima dos supercílios'] },
    relatedStructures: ['supra-orbital-foramen', 'sinus-of-frontal-bone'],
    references: [osSkull(OS.skullOpenings, 'features')],
  },
  {
    id: 'occipital-bone',
    content: { features: ['Forame magno', 'Côndilos occipitais, que se articulam com o atlas', 'Canal do nervo hipoglosso', 'Linhas nucais superior e inferior'] },
    relatedStructures: ['foramen-magnum', 'hypoglossal-canal', 'atlas-c1', 'sternocleidomastoid-muscle'],
    references: [osSkull(OS.skullOpenings, 'features'), gray(GRAY.skullBase, 'features')],
  },
  {
    id: 'sinus-of-frontal-bone',
    content: { description: 'Espaço aéreo no osso frontal, acima dos supercílios; o mais anterior dos seios paranasais.' },
    references: [osSkull(OS.sinuses, 'description')],
  },
  {
    id: 'sinus-of-sphenoid-bone',
    content: { description: 'Espaço aéreo no corpo do esfenoide, anterior e inferior à sela turca; o mais posterior dos seios paranasais.' },
    references: [osSkull(OS.sinuses, 'description')],
  },
  ...(['anterior', 'middle', 'posterior'] as const).map(
    (p): StructureDraft => ({
      id: `${p}-cells-of-ethmoid-bone`,
      content: { description: 'Parte das células etmoidais: pequenos espaços aéreos no etmoide, entre a parte superior da cavidade nasal e a parede medial da órbita.' },
      references: [osSkull(OS.sinuses, 'description')],
    }),
  ),

  // ------------------------------------------------------------ Acidentes ósseos (sem malha própria)
  feature('coronoid-process', 'Processo coronoide', 'mandible', ['mandible', 'infratemporal'], 'Projeção anterior, achatada, do ramo da mandíbula; dá inserção ao músculo temporal.', [osSkull(OS.mandible, 'description')], ['temporalis-muscle', 'masseter']),
  feature('condylar-process', 'Processo condilar', 'mandible', ['mandible', 'tmj'], 'Projeção posterior do ramo, encimada pelo côndilo, que se articula com o temporal na ATM; o pterigóideo lateral insere-se na fóvea do colo.', [osSkull(OS.mandible, 'description'), gray(GRAY.mastication, 'description')], ['temporomandibular-joint', 'lateral-pterygoid', 'mandibular-fossa']),
  feature('mandibular-fossa', 'Fossa mandibular', 'temporal-bone', ['tmj', 'temporal'], 'Depressão oval e profunda do temporal, à frente do meato acústico externo, que recebe o côndilo da mandíbula.', [osSkull(OS.temporal, 'description')], ['temporomandibular-joint', 'articular-tubercle', 'condylar-process']),
  feature('articular-tubercle', 'Tubérculo articular', 'temporal-bone', ['tmj', 'temporal'], 'Crista lisa imediatamente anterior à fossa mandibular; ambos formam a superfície temporal da ATM.', [osSkull(OS.temporal, 'description')], ['temporomandibular-joint', 'mandibular-fossa']),
  feature('styloid-process', 'Processo estiloide', 'temporal-bone', ['temporal', 'cervical'], 'Projeção alongada do temporal, posterior à fossa mandibular; dá origem aos músculos estiloglosso, estilo-hióideo e estilofaríngeo e aos ligamentos estilo-hióideo e estilomandibular.', [osSkull(OS.temporal, 'description'), gray(GRAY.skullBase, 'description')], ['stylohyoid-muscle', 'styloglossus', 'stylopharyngeus-muscle', 'stylohyoid-ligament', 'stylomandibular-ligament']),
  feature('mastoid-process', 'Processo mastoide', 'temporal-bone', ['temporal', 'cervical'], 'Grande projeção inferior do temporal, palpável atrás do lóbulo da orelha; dá inserção ao esternocleidomastóideo, ao esplênio da cabeça e ao longuíssimo da cabeça.', [osSkull(OS.temporal, 'description'), gray(GRAY.skullBase, 'description')], ['sternocleidomastoid-muscle', 'splenius-capitis-muscle', 'longissimus-capitis-muscle', 'posterior-belly-of-digastric-muscle']),
  feature('pterygomandibular-raphe', 'Rafe pterigomandibular', 'mandible', ['oral-cavity', 'infratemporal'], 'Faixa tendínea da fáscia bucofaríngea presa ao hâmulo pterigóideo e à extremidade posterior da linha milo-hióidea; separa o bucinador do constritor superior da faringe e é recoberta medialmente pela mucosa da boca.', [gray(GRAY.facial, 'description')], ['bucinator', 'superior-pharyngeal-constrictor', 'inferior-alveolar-nerve'], 'Referência intrabucal clássica na técnica do bloqueio do nervo alveolar inferior.'),

  // ------------------------------------------------------------ Forames, canais e fissuras
  opening('supra-orbital-foramen', 'Forame supraorbital', 'frontal-bone', ['orbit', 'face'], 'Nervo sensitivo da fronte (nervo supraorbital) e vasos supraorbitais.', [osSkull(OS.skullOpenings, 'contents')], ['supra-orbital-artery', 'frontal-bone'], ['incisura supraorbital']),
  opening('infra-orbital-foramen', 'Forame infraorbital', 'maxilla', ['maxilla', 'face'], 'Nervo infraorbital (sensibilidade do nariz, lábio superior e região anterior da bochecha) e vasos infraorbitais.', [osSkull(OS.skullOpenings, 'contents'), gray(GRAY.maxilla, 'contents')], ['infra-orbital-nerve', 'infra-orbital-artery', 'maxilla'], [], 'Ponto de referência e de deposição do anestésico no bloqueio infraorbital.'),
  opening('optic-canal', 'Canal óptico', 'sphenoid-bone', ['orbit', 'cranial-cavity'], 'Nervo óptico e artéria oftálmica.', [osSkull(OS.skullOpenings, 'contents'), gray(GRAY.sphenoid, 'contents')], ['optic-nerve-ii', 'ophthalmic-artery', 'sphenoid-bone'], ['forame óptico']),
  opening('superior-orbital-fissure', 'Fissura orbital superior', 'sphenoid-bone', ['orbit', 'cranial-cavity'], 'Nervos para os músculos extrínsecos do olho (III, IV, VI), nervos sensitivos (ramos do oftálmico, V1) e veias/artérias da órbita.', [osSkull(OS.skullOpenings, 'contents')], ['oculomotor-nerve-iii', 'trochlear-nerve-iv', 'abducens-nerve-vi', 'ophthalmic-nerve', 'superior-ophthalmic-vein']),
  opening('inferior-orbital-fissure', 'Fissura orbital inferior', 'maxilla', ['orbit', 'pterygopalatine', 'infratemporal'], 'Nervo maxilar (que entra na órbita e se continua como infraorbital).', [gray(GRAY.maxillaryNerve, 'contents')], ['maxillary-nerve', 'infra-orbital-nerve', 'inferior-ophthalmic-vein']),
  opening('foramen-rotundum', 'Forame redondo', 'sphenoid-bone', ['cranial-cavity', 'pterygopalatine'], 'Nervo maxilar (V2) — nervo sensitivo da bochecha, nariz e dentes superiores.', [osSkull(OS.skullOpenings, 'contents'), gray(GRAY.maxillaryNerve, 'contents')], ['maxillary-nerve', 'sphenoid-bone'], [], 'Comunica a fossa média do crânio com a fossa pterigopalatina; via de acesso do bloqueio do nervo maxilar (segunda divisão).'),
  opening('foramen-ovale', 'Forame oval', 'sphenoid-bone', ['cranial-cavity', 'infratemporal'], ['Nervo mandibular (V3)', 'Artéria meníngea acessória', 'Nervo petroso menor'], [gray(GRAY.sphenoid, 'contents'), osSkull(OS.skullOpenings, 'contents')], ['mandibular-nerve', 'accessory-branch-of-middle-meningeal-artery', 'sphenoid-bone', 'foramen-spinosum'], [], 'O bloqueio do nervo mandibular pela técnica de Gow-Gates deposita o anestésico no colo do côndilo, próximo à saída do V3 pelo forame oval.'),
  opening('foramen-spinosum', 'Forame espinhoso', 'sphenoid-bone', ['cranial-cavity', 'infratemporal'], ['Vasos meníngeos médios', 'Ramo recorrente (meníngeo) do nervo mandibular'], [gray(GRAY.sphenoid, 'contents'), osSkull(OS.skullOpenings, 'contents')], ['middle-meningeal-artery', 'mandibular-nerve', 'foramen-ovale']),
  opening('foramen-lacerum', 'Forame lacerado', 'sphenoid-bone', ['cranial-cavity'], 'Nenhuma estrutura importante o atravessa verticalmente: em vida sua parte inferior é preenchida por fibrocartilagem; a artéria carótida interna passa por sua parte superior ao sair do canal carótico.', [osSkull(OS.skullOpenings, 'contents'), gray(GRAY.sphenoid, 'contents')], ['internal-carotid-artery', 'carotid-canal']),
  opening('carotid-canal', 'Canal carótico', 'temporal-bone', ['cranial-cavity', 'ear'], 'Artéria carótida interna — principal artéria do encéfalo.', [osSkull(OS.skullOpenings, 'contents')], ['internal-carotid-artery', 'temporal-bone']),
  opening('internal-acoustic-meatus', 'Meato acústico interno', 'temporal-bone', ['cranial-cavity', 'ear'], 'Nervos da orelha interna (vestibulococlear, VIII) e nervo facial (VII).', [osSkull(OS.skullOpenings, 'contents')], ['vestibulocochlear-nerve-viii', 'facial-nerve-vii', 'temporal-bone']),
  opening('stylomastoid-foramen', 'Forame estilomastóideo', 'temporal-bone', ['ear', 'parotid'], ['Nervo facial (VII)', 'Artéria estilomastóidea'], [gray(GRAY.temporal, 'contents'), osSkull(OS.skullOpenings, 'contents')], ['facial-nerve-vii', 'temporal-bone', 'parotid-gland']),
  opening('jugular-foramen', 'Forame jugular', 'temporal-bone', ['cranial-cavity', 'cervical'], ['Nervos glossofaríngeo (IX), vago (X) e acessório (XI)', 'Início da veia jugular interna (compartimento posterior)'], [osSkull(OS.skullOpenings, 'contents'), gray(GRAY.neckVeins, 'contents')], ['glossopharyngeal-nerve-ix', 'vagus-nerve-x', 'accessory-nerve-xi', 'internal-jugular-vein', 'sigmoid-sinus', 'occipital-bone']),
  opening('hypoglossal-canal', 'Canal do nervo hipoglosso', 'occipital-bone', ['cranial-cavity', 'cervical'], 'Nervo hipoglosso (XII), nervo da língua.', [osSkull(OS.skullOpenings, 'contents')], ['hypoglossal-nerve-xii', 'occipital-bone']),
  opening('foramen-magnum', 'Forame magno', 'occipital-bone', ['cranial-cavity', 'cervical'], 'Transição bulbo-medula espinal (a fonte cita a medula espinal).', [osSkull(OS.skullOpenings, 'contents')], ['occipital-bone', 'vertebral-artery', 'accessory-nerve-xi']),
  opening('olfactory-foramina', 'Forames da lâmina cribriforme', 'ethmoid-bone', ['nasal-cavity', 'cranial-cavity'], 'Filamentos do nervo olfatório.', [osSkull(OS.skullOpenings, 'contents')], ['olfactory-nerve-i', 'ethmoid-bone']),
  opening('mandibular-foramen', 'Forame mandibular', 'mandible', ['mandible', 'infratemporal'], 'Nervo alveolar inferior e vasos alveolares inferiores, que seguem no canal mandibular.', [osSkull(OS.skullOpenings, 'contents'), gray(GRAY.mandibularNerve, 'contents')], ['inferior-alveolar-nerve', 'inferior-alveolar-artery', 'mandibular-canal', 'mandible', 'sphenomandibular-ligament'], [], 'Alvo do bloqueio do nervo alveolar inferior: o anestésico deve ser depositado antes de o nervo entrar no forame.'),
  opening('mandibular-canal', 'Canal mandibular', 'mandible', ['mandible'], 'Nervo e vasos alveolares inferiores, abaixo das raízes dos dentes, do forame mandibular ao forame mentual.', [gray(GRAY.mandibularNerve, 'contents')], ['inferior-alveolar-nerve', 'inferior-alveolar-artery', 'mandibular-foramen', 'mental-foramen'], [], 'Sua posição é avaliada em radiografias panorâmicas e tomografias antes de exodontias de terceiros molares e da instalação de implantes.'),
  opening('mental-foramen', 'Forame mentual', 'mandible', ['mandible', 'face'], 'Nervo e vasos mentuais.', [gray(GRAY.mandible, 'contents'), osSkull(OS.skullOpenings, 'contents')], ['mental-nerve', 'mental-branch-of-inferior-alveolar-artery', 'inferior-alveolar-nerve', 'mandible', 'lower-second-premolar-r'], ['forame mentoniano'], 'Fica abaixo do segundo pré-molar inferior, a meio caminho entre as margens do corpo da mandíbula; pode ser confundido com lesão periapical em radiografias.'),
  opening('incisive-canal', 'Canal incisivo / forame incisivo', 'maxilla', ['maxilla', 'oral-cavity', 'nasal-cavity'], 'Nervo nasopalatino e ramo terminal da artéria palatina descendente.', [gray(GRAY.maxilla, 'contents')], ['nasopalatine-nerve', 'descending-palatine-artery', 'maxilla'], ['forame incisivo', 'canal nasopalatino'], 'O forame incisivo fica na linha mediana, logo atrás dos incisivos centrais superiores, sob a papila incisiva.'),
  opening('greater-palatine-foramen', 'Forame palatino maior', 'palatine-bone', ['oral-cavity'], 'Nervo palatino maior e artéria palatina maior.', [], ['greater-palatine-nerve', 'greater-palatine-artery', 'palatine-bone']),
]

function feature(
  id: string,
  name: string,
  bone: string,
  regions: RegionId[],
  description: string,
  references: StructureDraft['references'],
  related: string[],
  clinicalRelevance?: string,
): StructureDraft {
  return {
    id,
    name,
    categories: ['bones'],
    subCategory: 'Acidente ósseo',
    regions,
    functionTags: ['support'],
    side: 'bilateral',
    parentId: bone,
    content: { description, ...(clinicalRelevance ? { clinicalRelevance } : {}) },
    relatedStructures: [bone, ...related],
    references: (references ?? []).map((r) => ({ ...r, fields: ['description'] })),
  }
}

function opening(
  id: string,
  name: string,
  bone: string,
  regions: RegionId[],
  contents: string | string[],
  references: StructureDraft['references'],
  related: string[],
  synonyms: string[] = [],
  clinicalRelevance?: string,
): StructureDraft {
  return {
    id,
    name,
    categories: ['foramina'],
    regions,
    functionTags: [],
    side: id === 'foramen-magnum' ? 'median' : id === 'incisive-canal' ? 'median' : 'bilateral',
    parentId: bone,
    synonyms,
    content: { contents, ...(clinicalRelevance ? { clinicalRelevance } : {}) },
    relatedStructures: [bone, ...related.filter((r) => r !== bone)],
    references: (references ?? []).map((r) => ({ ...r, fields: ['contents'] })),
  }
}
