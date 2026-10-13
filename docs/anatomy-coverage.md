# Cobertura anatômica

Números calculados a partir do catálogo em 2026-10-13. Cada estrutura conta uma única vez, pela categoria principal; estruturas pares (direita/esquerda) são um único registro com duas malhas.

## Resumo

| | Quantidade |
|---|---:|
| Registros no catálogo | **343** |
| Com malha própria selecionável no 3D | **289** |
| Agrupamentos exibidos pelas suas partes (ex.: masseter = partes superficial + profunda) | 9 |
| Somente texto (sem representação 3D) | 45 |
| Malhas nos GLB | 507 |

## Por categoria

"Verificado", "Parcial", "Pendente" e "Só nomenclatura" são os estados de verificação, calculados automaticamente (veja abaixo).

| Categoria | Registros | Malha própria | Via partes | Verificado | Parcial | Pendente | Só nomenclatura |
|---|---:|---:|---:|---:|---:|---:|---:|
| Músculos | 86 | 78 | 5 | 38 | 10 | 0 | 38 |
| Artérias | 47 | 44 | 2 | 3 | 6 | 1 | 37 |
| Ossos e cartilagens | 45 | 34 | 0 | 18 | 3 | 0 | 24 |
| Nervos | 33 | 25 | 1 | 13 | 17 | 1 | 2 |
| Veias e seios venosos | 33 | 32 | 0 | 3 | 2 | 1 | 27 |
| Dentes | 29 | 28 | 0 | 28 | 1 | 0 | 0 |
| Forames, canais e fissuras | 21 | 0 | 0 | 13 | 7 | 1 | 0 |
| Linfonodos e tonsilas | 18 | 18 | 0 | 0 | 0 | 0 | 18 |
| Articulações e ligamentos | 14 | 13 | 1 | 1 | 4 | 0 | 9 |
| Glândulas | 8 | 8 | 0 | 2 | 3 | 0 | 3 |
| Faringe e laringe | 4 | 4 | 0 | 0 | 0 | 0 | 4 |
| Cavidade oral | 3 | 3 | 0 | 0 | 0 | 0 | 3 |
| Língua | 1 | 1 | 0 | 0 | 1 | 0 | 0 |
| Outras | 1 | 1 | 0 | 0 | 0 | 0 | 1 |
| **Total** | **343** | **289** | **9** | **119** | **54** | **4** | **166** |

Os filtros por camada contam também as categorias secundárias (ex.: músculos da língua aparecem em "Língua"), por isso os números da interface podem ser maiores que os desta tabela.

## Estados de verificação

Cada campo de uma ficha (origem, inserção, inervação, irrigação, ação, trajeto, conteúdo, relevância clínica…) só conta como verificado se uma citação o sustentar explicitamente (`references[].fields`, apontando para uma fonte registrada em `data/references.ts`). O estado da ficha é derivado disso em `verificationStatus()`:

- **Verificado em fonte:** todos os campos descritivos presentes têm citação.
- **Parcialmente verificado:** parte dos campos tem citação; os demais aparecem marcados como "sem fonte conferida".
- **Pendente de validação:** há conteúdo, mas nenhum campo citado.
- **Informação não disponível:** a ficha tem só nomenclatura (nome em PT-BR, latim e ID TA2). Não há texto inventado para preencher.

O nome latino e o ID TA2 de **todos** os 343 registros foram conferidos automaticamente contra a lista TA2 (`scripts/data/build_ta2_subset.py`; testado em `tests/catalog.test.ts`).

## Estruturas só em texto (45)

- **Forames, canais e fissuras (21):** forames redondo, oval, espinhoso, magno, lacerado, jugular, mentual, mandibular, infraorbital, supraorbital, estilomastóideo e palatino maior; forames olfatórios; canais carótico, óptico, do hipoglosso, incisivo e mandibular; fissuras orbitais superior e inferior; meato acústico interno.
- **Acidentes ósseos:** processos condilar, coronoide, estiloide e mastoide; fossa mandibular; tubérculo articular.
- **Ausentes no modelo:** seio maxilar; nervos infraorbital, alveolares superiores posteriores, nasopalatino, palatino maior e auriculotemporal; artéria lingual; plexo venoso pterigóideo; rafe pterigomandibular; músculos estiloglosso e palatoglosso; parte oblíqua do cricotireóideo; dentição permanente como agrupamento.
- **Excluídas por licença:** martelo, bigorna, estribo, nervo coclear e nervo vestibular (veja [model-inventory.md](model-inventory.md)).

Quando uma estrutura não tem 3D, a ficha avisa e, se houver, mostra o ancestral representado (ex.: forame oval → esfenoide), com botão para focá-lo.

## Lacunas de conteúdo mais relevantes para odontologia

1. **Vasos:** 37 das 47 artérias e 27 das 33 veias têm só nomenclatura. A carótida externa e a artéria maxilar (ramos por porção) estão citadas.
2. **Linfonodos, faringe e laringe:** sem ficha descritiva.
3. **Relevância clínica odontológica:** StatPearls/NCBI não pôde ser consultada (bloqueio por reCAPTCHA). Por isso, notas clínicas (bloqueios anestésicos, por exemplo) aparecem como "sem fonte conferida" ou não foram escritas.
4. **Dentes decíduos e terceiros molares** não existem no modelo.

## Próximas etapas recomendadas

1. Revisão por docente de anatomia, começando pelos campos "parcialmente verificados".
2. Completar vasos e linfonodos com Gray (1918) e OpenStax, e dentes decíduos com um livro de anatomia dental.
3. Marcadores 3D de forames posicionados manualmente sobre cada osso, com conferência visual.
4. Modelo de dentição decídua com licença livre (ou modelagem própria) registrado como módulo `teeth-deciduous`.
5. Fonte clínica acessível (ex.: artigos de acesso aberto no PubMed Central) para notas de anestesia local.
