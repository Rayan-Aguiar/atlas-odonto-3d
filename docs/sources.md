# Fontes

Registro das fontes efetivamente consultadas. As referências citadas nas fichas ficam em `src/features/anatomy-catalog/data/references.ts`, e um teste garante que toda citação aponta para uma delas.

## Fontes de conteúdo anatômico

| Fonte | URL | Uso | Licença | Consulta |
|---|---|---|---|---|
| Henry Gray, *Anatomy of the Human Body*, 20ª ed. (1918, rev. W. H. Lewis) | https://archive.org/details/101532328.nlm.nih.gov | Origem, inserção, inervação, ação, trajeto, ramos e conteúdo de forames. Citado com seção e, quando confirmada pelo cabeçalho do trecho lido, página | Domínio público (digitalização da U.S. National Library of Medicine) | 2026-10-13 |
| OpenStax, *Anatomy and Physiology 2e*, 7.2 The Skull | https://openstax.org/books/anatomy-and-physiology-2e/pages/7-2-the-skull | Ossos do crânio, aberturas e estruturas que passam por elas | CC BY 4.0 | 2026-10-13 |
| OpenStax, *Anatomy and Physiology 2e*, 11.3 Axial Muscles of the Head, Neck, and Back | https://openstax.org/books/anatomy-and-physiology-2e/pages/11-3-axial-muscles-of-the-head-neck-and-back | Músculos da mastigação, expressão facial, língua e pescoço | CC BY 4.0 | 2026-10-13 |
| OpenStax, *Anatomy and Physiology 2e*, 13.4 The Peripheral Nervous System (Tabela 13.3) | https://openstax.org/books/anatomy-and-physiology-2e/pages/13-4-the-peripheral-nervous-system | Função e tipo dos nervos cranianos | CC BY 4.0 | 2026-10-13 |
| FIPAT, *Terminologia Anatomica*, 2ª ed. (TA2) | https://fipat.library.dal.ca/ta2/ | Nome latino e identificador TA2 de cada estrutura. A lista de termos (`scripts/data/sources/TA2.csv`) vem do projeto Z-Anatomy | Lista distribuída pelo Z-Anatomy sob CC BY-SA 4.0 | 2026-10-13 |

**Observação sobre o Gray (1918):** parte da nomenclatura é BNA. Na conversão para a TA atual: *Pterygoideus externus* = pterigóideo lateral, *submaxillary* = submandibular, *internal maxillary artery* = artéria maxilar. Fatos que mudaram desde 1918 não foram tirados dessa fonte.

## Fontes de modelos 3D

| Fonte | URL | Uso | Licença |
|---|---|---|---|
| Z-Anatomy, *The libre 3D atlas of anatomy* | https://github.com/Z-Anatomy/Models-of-human-anatomy | Malhas de todos os módulos | CC BY-SA 4.0 |
| BodyParts3D, © The Database Center for Life Science | https://dbarchive.biosciencedbc.jp/en/bodyparts3d/ | Base de grande parte das malhas do Z-Anatomy | CC BY 4.0 (o Z-Anatomy cita a versão original CC BY-SA 2.1 Japão) |
| Cranial Nerves and Foramina, University of Dundee (CAHID) | citado no README do Z-Anatomy | Referência para as curvas de nervos cranianos | CC BY 4.0 |
| Anatomy of the Inner Ear, University of Dundee School of Medicine | https://www.dundee.ac.uk/tilt/medical-illustration/anatomy-inner-ear | **Não usado.** As partes correspondentes foram excluídas | CC BY-NC-SA 4.0 |

Detalhes em [model-inventory.md](model-inventory.md) e [../public/models/LICENSE.md](../public/models/LICENSE.md).

## Fontes consultadas e não utilizadas

| Fonte | Motivo |
|---|---|
| StatPearls (NCBI Bookshelf, ex.: NBK541027) | Bloqueada por reCAPTCHA no acesso automatizado. O espelho no Europe PMC não trouxe o texto integral necessário. Nenhum conteúdo foi citado a partir de resumos de busca |
| NIH 3D (3d.nih.gov) | Sem crânio com ossos e dentes segmentados individualmente. Licenças variam por entrada |
| Sketchfab | Não havia modelo segmentado de cabeça e pescoço com licença livre verificável |

## Metodologia

1. Os trechos foram lidos no texto original (OCR do Internet Archive para o Gray; páginas do OpenStax), nunca a partir de resumos de busca.
2. Cada campo escrito recebe uma citação que indica explicitamente quais campos ela sustenta. Campos sem citação são exibidos como "sem fonte conferida".
3. Quando o texto da fonte não sustentava uma afirmação, o campo foi reescrito ou removido.
4. A conferência teve apoio de IA na leitura e organização das fontes. **Não houve revisão por docente de anatomia**, recomendada antes de uso formal.
