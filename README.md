# Atlas Odonto 3D

Atlas interativo de anatomia de cabeça e pescoço para estudantes de odontologia, com modelo 3D real, estruturas selecionáveis individualmente, filtros que controlam a cena, fichas com fontes citadas campo a campo e ferramentas de estudo.

> Ferramenta educacional **complementar**. Não substitui livros-texto, aulas práticas, orientação docente ou avaliação clínica. O conteúdo ainda não passou por revisão de docente de anatomia.

## O que já funciona

- **Visualizador 3D** (React Three Fiber + Three.js). Usa o modelo Z-Anatomy/BodyParts3D e tem 507 malhas individualizadas em 8 módulos carregados sob demanda.
  - **Câmera:** rotação, zoom, pan e foco/centralização na estrutura selecionada. Há vistas predefinidas (anterior, posterior, laterais, superior, inferior, oblíqua), reenquadramento e vista personalizada salva. Funciona por toque e por teclado.
  - **Seleção por raycasting** (BVH): o clique corresponde à malha efetivamente atingida. O destaque tem uma cópia "raio-X" para estruturas encobertas, como nervos dentro do osso.
  - **Visualização:** ocultar, isolar (com indicação visível do modo), transparência por camada e contexto translúcido fora do filtro.
- **Catálogo anatômico tipado** com 343 registros. Cada malha do modelo corresponde a exatamente um registro (garantido por teste). O nome latino e o ID vêm da FIPAT TA2.
- **Verificação calculada a partir dos dados:** um campo só conta como verificado quando uma citação o sustenta explicitamente. Campos sem fonte aparecem marcados como "sem fonte conferida".
- **Filtros** por camada (14 categorias combináveis), região, função e texto. Eles controlam a cena 3D e a lista ao mesmo tempo.
- **Pesquisa global** com sugestões por nome, sinônimo, latim, termo clínico, categoria e região. Ignora acentos e funciona por teclado (`/` ou `Ctrl+K`).
- **Ficha da estrutura** com abas pertinentes, relações navegáveis (pai, partes, estruturas relacionadas) e referências com localizador. Quando a estrutura não tem 3D, a ficha avisa explicitamente e indica o osso onde se localiza.
- **Estudo:** favoritos, histórico, anotações, progresso e modo de identificação com nome oculto. Há também questionário de múltipla escolha, gerado só com estruturas que estão no 3D e com conteúdo citado. Tudo é salvo no `localStorage`, sem conta e sem backend.
- **Responsivo:** três colunas recolhíveis no desktop; no celular, visualizador em tela cheia, navegação inferior e gavetas.
- **Acessibilidade:** navegação por teclado, foco visível, estados que não dependem só de cor, alvos de toque de 44 px e `prefers-reduced-motion`.
- **Compartilhamento:** `?s=<id>` abre direto uma estrutura (ex.: `/?s=inferior-alveolar-nerve`).

## Rodar localmente

Requisitos: Node 20+ (testado com Node 24) e npm.

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # Vitest + Testing Library (60 testes)
npm run lint         # oxlint
npm run build        # tsc -b (strict) + vite build → dist/
npm run preview      # serve o build de produção
```

## Deploy na Vercel

É um SPA estático gerado pelo Vite, sem SSR e sem backend.

1. Importe o repositório na Vercel. O preset **Vite** é detectado automaticamente.
2. Build command: `npm run build`. Output: `dist`. Já estão configurados em `vercel.json`, junto com o rewrite de SPA e o cache dos modelos.
3. Não há variáveis de ambiente nem serviços pagos.

Via CLI: `npx vercel` e depois `npx vercel --prod`.

## Estrutura

```text
src/
  app/                    App shell, layout responsivo, estado de UI
  components/             Primitivos (IconButton, Sheet, StatusBadge) e diálogo "Sobre"
  features/
    anatomy-catalog/      Tipos, esquema Zod, rótulos, catálogo, busca, filtros, verificação
      data/               Nomenclatura, conteúdo por sistema (content/*), referências, TA2, builder
    anatomy-viewer/       Canvas R3F, câmera, módulos GLB, estado da cena, sobreposições
    anatomy-details/      Ficha da estrutura
    anatomy-filters/      Painel de camadas e filtros
    search/               Pesquisa global (combobox)
    study-mode/           Questionário, flashcards, store persistido (favoritos, notas, progresso)
    library/              Favoritos, histórico e progresso
  lib/                    three (materiais, bounds), storage seguro, utilitários
  data/model-manifest.json  Malhas e bounding boxes de cada módulo (gerado)
public/models/            GLB otimizados (meshopt) — CC BY-SA 4.0
scripts/                  Pipeline de modelos (Blender) e de terminologia (TA2)
docs/                     Pesquisa, inventário de modelos, cobertura, fontes e arquitetura
tests/                    Testes unitários, de componentes e de integração dos GLB
```

## Regenerar modelos e terminologia

Veja [docs/model-inventory.md](docs/model-inventory.md). Em resumo:

1. `blender -b --disable-autoexec --factory-startup Startup.blend --python scripts/models/export_zanatomy.py -- out/`
2. `npx gltf-transform optimize out/<m>.glb public/models/<m>.glb --compress meshopt --join false --instance false --palette false --simplify true --simplify-ratio 0.5 --simplify-error 0.0005`
3. `npm run models:manifest`, depois `npm run data:ta2` e `npm test`

## Licenças e atribuição

- **Código:** do autor do projeto.
- **Modelos 3D (`public/models/`):** obra derivada de "Z-Anatomy — The libre 3D atlas of anatomy" (CC BY-SA 4.0), por sua vez derivado de "BodyParts3D, © The Database Center for Life Science" (CC BY 4.0). Distribuídos sob **CC BY-SA 4.0**; veja [public/models/LICENSE.md](public/models/LICENSE.md).
- **Terminologia:** FIPAT, Terminologia Anatomica 2ª ed. A lista de termos vem do projeto Z-Anatomy.
- **Fontes de conteúdo:** veja [docs/sources.md](docs/sources.md).

## Limitações conhecidas

Resumo; os detalhes estão em [docs/anatomy-coverage.md](docs/anatomy-coverage.md).

- 166 registros têm só nomenclatura (TA2), sem ficha descritiva. Linfonodos, faringe/laringe e boa parte dos vasos estão nesse grupo.
- Forames, canais e acidentes ósseos são fichas textuais, sem marcador 3D. Os marcadores do Z-Anatomy foram avaliados e descartados por imprecisão (veja o inventário).
- Ossículos da audição e nervos coclear/vestibular ficaram fora do 3D: no Z-Anatomy vêm do modelo "Anatomy of the Inner Ear" (Univ. de Dundee, CC BY-NC-SA 4.0), incompatível com a licença CC BY-SA declarada para os GLB.
- O modelo não tem dentes decíduos, terceiros molares, seio maxilar, nervo infraorbital, ramos alveolares superiores, nervo nasopalatino nem artéria lingual. Essas estruturas existem só como texto.
- A StatPearls/NCBI não pôde ser consultada (bloqueio por CAPTCHA). O conteúdo clínico odontológico sem fonte conferida está marcado como tal.
- A verificação foi feita durante a construção, com apoio de IA na leitura das fontes. Recomenda-se revisão docente.
