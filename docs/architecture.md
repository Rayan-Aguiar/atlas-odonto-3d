# Arquitetura

SPA estática (Vite + React 19 + TypeScript estrito), sem backend. O estado do usuário fica no `localStorage`.

## Fluxo de dados

```text
Z-Anatomy Startup.blend ──(scripts/models)──► public/models/*.glb ──► src/data/model-manifest.json
TA2.csv ─────────────────(scripts/data)────► data/ta2-terms.json
                                                     │
nomenclature.ts + content/*.ts + references.ts ──► data/build.ts ──► catalog.ts (STRUCTURES, índices, busca, filtros)
                                                                        │
                       ┌────────────────────────────────────────────────┼─────────────────────┐
                 anatomy-viewer (cena 3D)                      anatomy-details / filters / search    study-mode / library
```

- **`nomenclature.ts`:** nome em PT-BR, categoria, região, função e hierarquia de cada estrutura. As chaves coincidem com os IDs de malha sem o sufixo de lado.
- **`content/*.ts`:** texto por sistema (osteologia, miologia, neurologia, angiologia, esplancnologia), com citações por campo.
- **`build.ts`:** junta nomenclatura, TA2 (latim e ID), manifesto (malhas) e conteúdo; o resultado é validado pelo esquema Zod em `schema.ts`. Os tipos ficam em `types.ts`, e uma checagem em tempo de compilação garante que o esquema e os tipos sejam equivalentes.
- **`catalog.ts`:** índices (`STRUCTURE_BY_ID`, `MESH_OWNER`, `CHILDREN`), `isIn3D`, `verificationStatus`, busca (Fuse.js, sem acentos) e filtros.

## Visualizador

- **`Viewer.tsx`:** Canvas do R3F, iluminação e um `ModelModule` por módulo ativo, cada um dentro de seu próprio `Suspense` e error boundary. Um módulo que falha mostra erro com opção de tentar de novo, sem derrubar os outros.
- **`ModelModule.tsx`:** carrega o GLB com `useGLTF` (cache do drei, sem carregamento duplicado). Monta uma BVH por geometria (`three-mesh-bvh`) e aplica o material conforme o estado da malha.
- **`sceneState.ts`:** função pura que calcula o estado de cada malha (`solid`, `ghost` ou `hidden`) a partir de camadas, filtros, isolamento, ocultação e seleção. É testada sem WebGL.
- **`CameraRig.tsx`:** `CameraControls` do drei (`camera-controls`) para órbita, zoom, pan, vistas predefinidas, foco na estrutura (bounding box do manifesto) e vista salva.
- **Materiais (`lib/three/materials.ts`):** cores por categoria na convenção de atlas, além do material de seleção e de uma cópia "raio-X" desenhada por cima, para estruturas encobertas.
- **Estado (`store.ts`, Zustand):** camadas ativas, seleção, hover, ocultas, isolamento, status de cada módulo e comandos de câmera.

## Interface

- **`app/App.tsx`:** no desktop, três colunas recolhíveis (filtros | visualizador | ficha); no celular, visualizador em tela cheia, navegação inferior e gavetas (`Sheet`). Mantém `?s=<id>` sincronizado com a seleção.
- **Componentes:** primitivos Radix (Dialog, Tabs, Tooltip) com tokens próprios em Tailwind v4. A identidade visual está em `DESIGN.md`.

## Ferramentas de estudo

- **`studyStore.ts`** (Zustand `persist` sobre `safeStorage`, que tolera `localStorage` indisponível): favoritos, histórico, anotações, progresso e resultados.
- **`quiz.ts`:** gerador determinístico (semente) de questões. Usa só estruturas presentes no 3D e com conteúdo citado.

## Testes (`tests/`)

| Arquivo | Cobertura |
|---|---|
| `catalog.test.ts` | Esquema Zod, IDs únicos, malha ↔ registro, hierarquia sem ciclos, relações existentes, latim conferido com a TA2, citações válidas, notação FDI |
| `search-and-filters.test.ts` | Busca por nome, sinônimo, latim e termo clínico, sem acento; combinação de filtros; estado da cena (isolar, ocultar, translúcido); seleção no store |
| `study.test.tsx` | Gerador de questões, modo de estudo com nomes ocultos, histórico e anotações |
| `ui.test.tsx` | Ficha e abas, aviso de "sem 3D", relações navegáveis, favoritos persistidos, busca e filtros por teclado, módulo indisponível |
| `models.test.ts` | Leitura dos GLB reais: nós iguais ao manifesto, cada malha com registro, orçamento de tamanho, IDs compatíveis com o three.js |

## Adicionar uma estrutura

1. Malha: inclua o nó no GLB (pipeline em [model-inventory.md](model-inventory.md)) e rode `npm run models:manifest`.
2. Nomenclatura: acrescente a chave em `nomenclature.ts`. O latim e o ID TA2 são resolvidos automaticamente; rode `npm run data:ta2` se o termo for novo.
3. Conteúdo: escreva em `content/<sistema>.ts`, citando uma fonte de `references.ts` com os campos sustentados.
4. Rode `npm test`. Os testes acusam malha sem registro, relação quebrada ou citação inválida.
