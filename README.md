# Patch de progressão

Substitua no repositório:

- `js/app.js`
- `js/storage.js`
- `service-worker.js`

Adicione:

- `data/progress.default.json`

## Nova lógica

- O Léo precisa concluir o nível atual em todas as cinco áreas.
- Depois disso, o próximo nível geral é liberado.
- Cada etapa concluída é registrada uma única vez.
- Atualizar a página mantém o progresso no mesmo navegador.
- O painel permite exportar e importar um arquivo JSON.

## Limitação do GitHub Pages

`progress.default.json` é um modelo estático. O navegador não pode alterar arquivos
do repositório GitHub sozinho. Para sincronizar automaticamente entre aparelhos,
é necessário um backend como Firebase ou Supabase.
