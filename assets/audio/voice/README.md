# Narração — placeholders

Enquanto NÃO houver arquivos `.wav` gravados nestas pastas, o app usa
síntese de fala pt-BR (voz falada real, via Web Speech API) como placeholder.
**Nunca** é usado bip no lugar de narração.

## Como substituir por voz gravada
Grave um arquivo por letra em cada categoria, com estes nomes (A..Z):

- `letters/<L>.wav` — nome da letra (ex.: "A")
- `words/<L>.wav`   — "A de Axolote"
- `facts/<L>.wav`   — frase educativa

Os roteiros completos estão em `data/narration-scripts.json`.
O motor de áudio (`src/audio/AudioEngine.ts`) detecta automaticamente o arquivo
(HEAD request) e prefere a gravação quando ela existe.

Voz recomendada: infantil/jovem, pt-BR, clara, ritmo moderado.
