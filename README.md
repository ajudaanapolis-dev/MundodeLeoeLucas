# Mundo de Léo e Lucas

Aplicativo web infantil com duas experiências integradas:

- **Jornada do Léo:** aprendizagem adaptativa em ecossistemas, plantas carnívoras, invertebrados, axolotes e lógica científica.
- **Mundo do Lucas:** exploração sensorial livre com sons, movimento, luz, cores e ambientes interativos.

## Estrutura

```text
mundo-leo-lucas/
├── index.html
├── manifest.webmanifest
├── service-worker.js
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── audio.js
│   ├── data.js
│   └── storage.js
└── assets/
    ├── audio/
    └── icons/
```

## Publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todos os arquivos mantendo esta estrutura.
3. Abra **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Escolha a branch `main` e a pasta `/root`.
6. Salve.
7. O endereço ficará semelhante a:

```text
https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/
```

## Teste local

Na pasta do projeto:

```bash
python3 -m http.server 8000
```

Abra:

```text
http://localhost:8000
```

Não abra apenas o `index.html` pelo aplicativo Arquivos do iPhone. Recursos como módulos JavaScript, service worker e áudio funcionam corretamente quando o projeto é servido por HTTP/HTTPS.

## Evolução do conteúdo do Léo

Edite `js/data.js`.

Cada questão usa este formato:

```js
{
  lvl: 1,
  q: "Pergunta",
  ctx: "Pistas e contexto",
  a: "Resposta correta",
  o: [
    ["Resposta correta", "🔬"],
    ["Alternativa 2", "🧪"],
    ["Alternativa 3", "🐠"],
    ["Alternativa 4", "🌱"]
  ]
}
```

O campo `lvl` controla quando a pergunta aparece:

- `lvl: 1` — inicial
- `lvl: 2` — intermediário
- `lvl: 3` — avançado

O nível sobe automaticamente conforme os acertos acumulados em cada domínio.

## Evolução do Lucas

As cenas e interações ficam em `js/app.js`, nas funções:

- `sceneMarkup(scene)`
- `sensoryAction(action, event, element)`

Novos ambientes podem ser adicionados sem alterar a trilha do Léo.

## Áudio

Os sons locais ficam em `assets/audio/` e são carregados por `js/audio.js`.

Para substituir um som:

1. Use arquivo WAV.
2. Mantenha o mesmo nome.
3. Substitua o arquivo correspondente.

O iPhone exige um toque inicial em **Ativar sons**.

## Instalação como aplicativo

Depois de publicado no GitHub Pages:

1. Abra o site no Safari.
2. Toque em **Compartilhar**.
3. Escolha **Adicionar à Tela de Início**.

O service worker permite abrir partes já carregadas mesmo sem conexão.
