# Mundo de Léo e Lucas — aplicativo completo

## Estrutura central

### Lucas
- alfabeto completo de A a Z;
- personagem-guia original;
- uma cena própria por letra;
- narração da letra, palavra e fato curto;
- animação e som específicos;
- progresso das letras exploradas.

### Léo
- laboratórios de ecossistemas;
- plantas carnívoras;
- invertebrados;
- axolotes;
- método científico;
- progressão adaptativa em três níveis;
- simulador de aquário.

### Recursos gerais
- salvamento automático no navegador;
- área dos responsáveis;
- exportação do progresso em JSON;
- controle de som;
- controle de narração;
- modo de movimento reduzido;
- PWA;
- funcionamento offline;
- compatível com GitHub Pages.

## Publicação

Extraia todo o conteúdo na raiz do repositório.

Estrutura principal:

```text
index.html
manifest.webmanifest
service-worker.js
.nojekyll
css/
js/
data/
assets/
```

## GitHub Pages

O endereço esperado será:

```text
https://ajudaanapolis-dev.github.io/App/
```

## Áudio e voz

Ao abrir, toque em **Começar**.

A narração usa a voz em português disponível no navegador por meio de
`SpeechSynthesis`. A qualidade da voz pode variar entre Windows, Android e iPhone.

## Limitação atual

As cenas usam ilustrações vetoriais originais e emojis para os objetos.
Para alcançar acabamento de estúdio, a próxima etapa é substituir os objetos
por ilustrações próprias e adicionar narração gravada profissionalmente.
