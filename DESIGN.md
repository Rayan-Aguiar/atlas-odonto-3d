---
name: Atlas Odonto 3D
colors:
  bg: "oklch(0.165 0.008 200)"        # vitrine escura em volta do espécime
  surface: "oklch(0.205 0.009 200)"   # painéis
  surface-2: "oklch(0.245 0.010 200)" # controles, hover
  line: "oklch(0.32 0.012 200)"
  ink: "oklch(0.95 0.006 200)"
  ink-muted: "oklch(0.76 0.012 200)"  # ≥ 4.5:1 sobre surface
  primary: "oklch(0.74 0.095 180)"    # pátina (seleção ativa, foco, ação primária)
  primary-ink: "oklch(0.18 0.03 180)"
  highlight: "oklch(0.85 0.12 178)"   # pátina clara — destaque da estrutura selecionada no 3D
  verified: "oklch(0.78 0.12 155)"
  partial: "oklch(0.82 0.12 85)"
  pending: "oklch(0.74 0.10 40)"
typography:
  ui: "Geist Variable, system-ui, sans-serif"
  specimen: "Newsreader Variable, Georgia, serif"  # só nomes de estruturas e marca
  scale: "12 / 13 / 14 / 16 / 18 / 22 / 28 (rem fixos, razão ~1.2)"
radius: { control: 8px, panel: 12px }
motion: { fast: 150ms, base: 220ms, ease: "cubic-bezier(0.22, 1, 0.36, 1)" }
---

# Design

## Tema
Escuro por escolha de cena: sessões longas à noite com um espécime iluminado no centro, como numa vitrine de museu. Neutros levemente tingidos para o hue da marca (200), nunca preto puro.

## Cor (estratégia: Restrained)
- Pátina teal para foco e ação primária; pátina clara e saturada (`highlight`) só para a estrutura selecionada no 3D e o item correspondente na UI. O âmbar foi descartado porque se confundia com o amarelo convencional dos nervos.
- Cores anatômicas no 3D seguem convenção de atlas: osso marfim, dente esmalte, músculo vermelho-terroso, artéria vermelha, veia azul, nervo amarelo, glândula rosada, linfonodo verde-oliva, ligamento cinza-azulado.
- Status de verificação: verde (verificado), âmbar (parcial), terracota (pendente), cinza (não disponível) — sempre com ícone e texto.

## Tipografia
Geist para toda a UI. Newsreader apenas para o nome da estrutura no painel de detalhes e para a marca — dá a voz de "atlas" sem invadir controles.

## Layout
Desktop: barra superior (marca, busca, ferramentas) · coluna esquerda recolhível (filtros) · visualizador central · coluna direita recolhível (detalhes) · barra de vistas flutuante sobre o canvas. Mobile: canvas em tela cheia, barra inferior com 3 ações (Filtros · Buscar · Detalhes) e gavetas inferiores.

## Componentes
Botões com estados default/hover/focus-visible/active/disabled; chips de categoria com contagem; abas no painel de detalhes; selo de verificação; banners de estado (isolamento ativo, modelo indisponível, estrutura sem 3D).

## Cores dos materiais 3D (sRGB, three.js)
Os materiais do visualizador usam equivalentes sRGB, definidos em `src/lib/three/materials.ts`: destaque da seleção `#5fe6d2` (= token `highlight`), com cópia translúcida sem teste de profundidade (“raio-X”) para estruturas encobertas, realce de hover com emissivo pátina `#1f5c57`, e as cores anatômicas convencionais por categoria (osso `#e6dbc3`, músculo `#a54a42`, artéria `#cf3a33`, veia `#4a6dc0`, nervo `#e9c84f` etc.).
