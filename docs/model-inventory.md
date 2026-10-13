# Inventário de modelos 3D

Consulta: 2026-10-13.

## Fontes avaliadas

| Fonte | O que oferece | Segmentação individual | Licença | Decisão |
|---|---|---|---|---|
| **Z-Anatomy** — [Models-of-human-anatomy](https://github.com/Z-Anatomy/Models-of-human-anatomy) (`Startup.blend`, Blender) | Corpo inteiro: 7.184 objetos (ossos, músculos, articulações, vasos e nervos como curvas, vísceras, linfonodos), com nomes em inglês da TA2 | Sim, um objeto por estrutura e por lado | CC BY-SA 4.0 (com exceções não comerciais, veja abaixo) | **Adotado** como base |
| **BodyParts3D** (DBCLS) — [download](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html) | Um OBJ por conceito FMA | Sim | CC BY 4.0 ([lic.html](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html)) | Usado indiretamente: o Z-Anatomy já o incorpora, corrigido e completado (nervos e vasos como curvas, dentes, nomes TA2) |
| **NIH 3D** — [3d.nih.gov](https://3d.nih.gov) | Crânios segmentados de TC (ex.: 3DPX-020591, Visible Human, CC BY) | Crânio inteiro, sem ossos ou dentes separados | Varia por entrada (há CC BY-NC-ND, ex.: 3DPX-022753) | Descartado: sem segmentação útil para seleção |
| **Sketchfab** | Muitos modelos de crânio e dentição | Raramente; licenças heterogêneas | Varia | Descartado: não havia modelo de cabeça e pescoço segmentado com licença livre verificável e escala compatível com o Z-Anatomy |
| **Anatomy of the Inner Ear** — Univ. de Dundee ([página](https://www.dundee.ac.uk/tilt/medical-illustration/anatomy-inner-ear)) | Membrana timpânica, ossículos, sistema vestibular, cóclea | Sim | **CC BY-NC-SA 4.0** | **Excluído** (cláusula não comercial). Já vem embutido no Z-Anatomy; veja "Exclusões" |

## Pipeline

1. **Extração** (`scripts/models/export_zanatomy.py`, Blender 4.2 em modo `-b --disable-autoexec --factory-startup`):
   - Seleciona por sistema (coleções `1:`–`8:` do Z-Anatomy) e por posição (acima de z = 1,40 m, cabeça e pescoço).
   - Exclui por nome: estruturas cerebrais, cintura escapular, vértebras torácicas, núcleos, linhas de rótulo (`.j`, `.t`, `.g` …) e as partes não comerciais (`NC_EXCL`).
   - Converte curvas (artérias, veias, nervos) em tubos de malha.
   - Renomeia cada nó para um ID estável (`kebab-case`, sufixo `__l`/`__r` para estruturas pares) e guarda o nome original em `extras.zanatomyName`.
   - Gera um GLB por módulo.
2. **Otimização** (`gltf-transform optimize`): meshopt, quantização, simplificação de 50% com erro máximo 0,0005. Usa `--join false --instance false`, porque fundir malhas quebraria a seleção individual.
3. **Manifesto** (`npm run models:manifest`): lê os GLB e grava `src/data/model-manifest.json` com IDs de malha, nome de origem e bounding box (usados no foco da câmera e nos testes).
4. **Integridade** (`tests/models.test.ts`): cada nó dos GLB tem registro no catálogo, e cada `meshId` do catálogo existe num GLB.

## Módulos publicados (`public/models/`)

Carregados sob demanda: só os módulos das camadas ativas são baixados (ossos e dentes por padrão).

| Módulo | Malhas | Tamanho | Conteúdo |
|---|---:|---:|---|
| `bones.glb` | 49 | 580 kB | Ossos do crânio e da face, vértebras cervicais, hioide, cartilagens laríngeas, células etmoidais e seios |
| `teeth.glb` | 28 | 244 kB | Dentição permanente sem terceiros molares (FDI 11–17, 21–27, 31–37, 41–47) |
| `muscles.glb` | 155 | 1,4 MB | Mastigação, expressão facial, língua, supra e infra-hióideos, faringe, laringe, palato, pescoço |
| `nerves.glb` | 49 | 541 kB | Pares cranianos e ramos do trigêmeo e do facial, plexo cervical, gânglios |
| `vessels.glb` | 143 | 1,1 MB | Carótidas e ramos, artéria maxilar por porção, veias e seios da dura-máter |
| `joints.glb` | 23 | 152 kB | ATM (disco, cápsula, ligamentos), articulações e ligamentos cervicais e laríngeos |
| `viscera.glb` | 24 | 198 kB | Glândulas salivares e ductos, tireoide, paratireoides, língua, palato mole, faringe, gengiva |
| `lymph.glb` | 36 | 113 kB | Linfonodos cervicais e tonsilas |
| **Total** | **507** | **≈ 4,3 MB** | |

## Exclusões e limitações do modelo

- **Conteúdo não comercial:** o README do Z-Anatomy lista "Anatomy of the Inner Ear — University of Dundee School of Medicine — CC BY-NC-SA 4.0" e "Kidney — Lissie Cowley — CC BY-NC 4.0". Segundo a Universidade de Dundee, o modelo da orelha inclui membrana timpânica, ossículos e sistema vestibular. Para que os GLB fiquem sob CC BY-SA 4.0 sem cláusula não comercial, foram excluídos:
  - **coleção `Ear` do Z-Anatomy:** labirinto ósseo (cóclea, vestíbulo, canais semicirculares) e membrana timpânica. Nunca foram exportados;
  - **martelo, bigorna, estribo e nervos coclear e vestibular:** removidos em 2026-10-13. Não existem no BodyParts3D, então a origem mais provável é o modelo de Dundee. Os registros continuam no catálogo como texto.
  - O tronco do nervo vestibulococlear (VIII) e a corda do tímpano foram mantidos. Fazem parte das curvas de nervos cranianos que o Z-Anatomy atribui a "Cranial Nerves and Foramina — University of Dundee, CAHID" (CC BY 4.0).
- **Marcadores de forames:** o Z-Anatomy tem linhas de rótulo (`.j`) para forames e canais. A extração calcula o osso mais próximo de cada ponta (`landmarks.json`, 187 pontos), mas o resultado é impreciso: forame redondo → osso lacrimal, canal óptico → concha nasal inferior, canal do hipoglosso → áxis, forame magno → atlas. Os marcadores foram descartados. Forames e canais são fichas textuais que apontam para o osso correspondente.
- **Ausentes no modelo:** dentes decíduos, terceiros molares, seio maxilar como volume próprio, nervo infraorbital, nervos alveolares superiores, nervo nasopalatino, nervo palatino maior, artéria lingual, plexo venoso pterigóideo e rafe pterigomandibular.
- **Vasos e nervos** são tubos de raio constante gerados a partir de curvas. O trajeto é representativo, mas o calibre não é.
- **Simplificação:** a geometria foi simplificada pela metade. Isso basta para o estudo, mas detalhes finos de superfície óssea foram suavizados.

## Regenerar

```bash
blender -b --disable-autoexec --factory-startup Startup.blend --python scripts/models/export_zanatomy.py -- out/
npx gltf-transform optimize out/<m>.glb public/models/<m>.glb --compress meshopt --join false --instance false \
  --palette false --simplify true --simplify-ratio 0.5 --simplify-error 0.0005
npm run models:manifest && npm run data:ta2 && npm test
```

Abrir o `Startup.blend` inteiro exige mais de 7 GB de RAM. Em máquinas com pouca memória, feche outros programas antes.
