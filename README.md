# Mundo de Léo e Lucas

Aplicativo infantil educativo (PWA) para dois irmãos, construído do zero. Uma
única experiência integrada com duas áreas: **Mundo do Lucas** (alfabeto
interativo para a primeira infância) e **Jornada do Léo** (laboratórios de
ciência para uma criança curiosa de ~4 anos).

Obra original. Nenhum material protegido de terceiros (personagens, músicas,
vozes, ilustrações, código ou identidade visual) foi copiado. A arquitetura de
experiência (guia, painel de letras, cena por letra, narração, toque → animação)
é inspirada em apps infantis comerciais do gênero, mas todo o conteúdo é próprio.

## Tecnologia e por que sem framework

TypeScript + Vite, sem framework de UI. Justificativa: a experiência é um
"brinquedo digital" fortemente baseado em **SVG + Web Animations API + Web
Audio**, com controle direto do DOM para animações e toque com latência mínima.
Um framework acrescentaria peso e uma camada de reconciliação sem benefício real
aqui. O resultado é um bundle pequeno (~13 kB gzip de JS) e simples de auditar.

- **PWA**: `manifest.webmanifest` + service worker (`public/sw.js`, cache-first
  do app shell → funciona offline após a primeira carga).
- **Fontes offline**: Baloo 2 (display) + Nunito (corpo), via `@fontsource`
  (empacotadas, sem CDN).
- **Persistência**: IndexedDB (progresso) + localStorage (preferências).
- **Base path**: `/App/` (configurável em `vite.config.ts`).

## Estrutura

```
mundo-leo-lucas/
├── index.html, vite.config.ts, tsconfig.json, package.json
├── public/
│   ├── manifest.webmanifest, sw.js, .nojekyll
│   └── assets/{icons,audio,characters,objects,backgrounds}
├── data/            # cópias de referência JSON (fonte canônica é o TS em src/)
├── src/
│   ├── main.ts, app/Router.ts
│   ├── core/        # dom, events, types
│   ├── styles/      # tokens.css (paleta pastel), base, components
│   ├── characters/  # Léo (moicano), Lucas, Professor Lume — SVG + poses
│   ├── audio/       # AudioEngine (voz + efeitos), narração
│   ├── storage/     # IndexedDB, export/import
│   ├── accessibility/settings.ts
│   ├── progress/progression.ts   # fórmula adaptativa documentada
│   ├── parent/      # portão de adulto + painel
│   ├── screens/HomeScreen.ts
│   ├── lucas/alphabet/           # painel + cena + scenes/ (por letra)
│   └── leo/         # LeoHome + labs/AquariumLab
└── tests/           # unit + integration (vitest, jsdom, fake-indexeddb)
```

## Personagens

- **Professor Lume** — guia adulto acolhedor. Poses: neutral, point, celebrate,
  think, lupa (`src/characters/lume.ts`).
- **Léo** — menino de ~4 anos com **moicano claramente visível**, curioso e
  investigativo. Poses: neutral, lupa, point, celebrate, think
  (`src/characters/leo.ts`). Aparece dentro dos laboratórios.
- **Lucas** — criança pequena, alegre. Poses: neutral, clap, point, dance
  (`src/characters/lucas.ts`).

## Mundo do Lucas — alfabeto (26 letras)

A–Axolote, B–Baleia, C–Caracol, D–Dionéia, E–Estrela-do-mar, F–Formiga,
G–Girafa, H–Helicóptero, I–Inseto, J–Joaninha, K–Kiwi, L–Leão, M–Macaco,
N–Navio, O–Ovelha, P–Pipoca, Q–Queijo, R–Robô, S–Sapo, T–Tartaruga, U–Urso,
V–Vulcão, W–Waffle, X–Xilofone, Y–Yak, Z–Zebra.

Cada letra: cena com letra grande, palavra, objeto animado, narração (letra +
"X de Palavra" + frase educativa) e controles **Repetir** / **Próxima**.

**Cenas com composição/interação próprias implementadas:** A (axolote nada, solta
bolhas), B (baleia sobe e expira pelo espiráculo), C (caracol percorre caminho e
recolhe na concha), D (dionéia fecha a armadilha sobre o inseto), X (xilofone
tocável, sete notas). As demais usam um template interativo compartilhado
(criatura pastel que reage ao toque), **marcado como pendente de arte dedicada**
via `hasBespokeScene: false`.

## Jornada do Léo — laboratórios

Fluxo: escolher → observar → interagir → mudar variável → testar → observar
resultado → registrar conclusão.

- **Aquário** (implementado): variáveis temperatura, oxigênio, limpeza e comida,
  com consequências reais (água turva, peixe na superfície, algas). Registra
  experimentos e alimenta a progressão adaptativa. O Léo aparece na cena.
- Plantas carnívoras, invertebrados, axolotes e método científico: planejados.

## Progressão adaptativa (fórmula)

`mastery = 0.55·accRecent + 0.30·accOverall − 0.25·hintRatio + 0.05·expBonus`
(limitada a 0..1). Sobe de nível (1→4) só com `mastery ≥ 0.80`, acerto recente
≥ 0.75 e razão de dicas ≤ 0.5, após um mínimo de tentativas — **não sobe por
volume de cliques**. Rebaixa com `mastery < 0.35`. Ver `src/progress/progression.ts`
e os testes em `tests/unit/progression.test.ts`.

## Áudio e narração

Três categorias de voz por letra (nome, "X de Palavra", frase educativa). O motor
prefere `.wav` gravado quando existe em `public/assets/audio/voice/{letters,words,facts}/`;
enquanto não houver gravação, usa **síntese de fala pt-BR** (voz falada real) como
placeholder — **nunca bip**. Roteiros completos em `data/narration-scripts.json`.
Instruções de substituição em `public/assets/audio/voice/README.md`. Efeitos e
notas musicais são sintetizados via Web Audio. Desbloqueio no primeiro toque
(compatível com Safari/iPhone).

## Acessibilidade

Redução de movimento (respeita `prefers-reduced-motion` e toggle próprio),
controle de som/narração/volume, alto contraste, foco visível, `aria-label`s,
áreas de toque grandes (≥72px), orientação livre.

## Área dos responsáveis

Protegida por desafio de adulto (multiplicação). Mostra letras exploradas do
Lucas e níveis/experimentos do Léo; permite exportar/importar JSON, apagar
progresso e ajustar som, narração, movimento, contraste e volume.

## Rodando

```bash
npm install
npm run dev        # desenvolvimento (http://localhost:5173/App/)
npm run typecheck  # tsc --noEmit
npm run lint
npm test           # vitest
npm run build      # dist/ pronto para publicação
npm run preview    # servir o build
```

Para servir na raiz local em vez de `/App/`: `VITE_BASE=/ npm run build`.

## GitHub Pages

1. Crie o repositório e envie a branch `main`.
2. Em *Settings → Pages*, selecione *GitHub Actions* como fonte.
3. O workflow `.github/workflows/deploy.yml` roda typecheck + testes + build e
   publica `dist/`.
4. `vite.config.ts` usa `base: '/App/'`; a URL esperada é
   `https://<usuario>.github.io/App/`. Ajuste o `base` se o caminho for outro.
5. `public/.nojekyll` impede o processamento Jekyll.

## Limitações (estado atual — leia com atenção)

- 5 das 26 cenas têm arte/interação dedicadas; 21 usam o template compartilhado
  (funcional, mas não é a arte final única exigida).
- 1 dos 5 laboratórios do Léo está implementado (aquário).
- Narração é voz sintetizada pt-BR (placeholder); gravações profissionais ainda
  não foram adicionadas.
- Sem testes E2E/acessibilidade automatizados de navegador (Playwright/axe) —
  há testes unitários, de integração e de renderização (jsdom).

## Revisão pronta para publicação

Esta revisão adiciona:

- cenas vetoriais específicas para as 26 letras;
- 78 narrações WAV em português brasileiro com timbre sintético infantilizado;
- quatro laboratórios adicionais do Léo: plantas carnívoras, invertebrados, axolotes e método científico;
- registro correto das interações do Lucas;
- importação dos eventos do backup e validação mais rígida do JSON;
- service worker de publicação com precache completo.

A pasta `dist/` contém os arquivos estáticos prontos para GitHub Pages.
