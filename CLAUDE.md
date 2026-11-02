# Taverna Idle — instruções para o Claude

Idle RPG mobile (HTML5/JavaScript) para publicar na Google Play via GitHub Pages + PWABuilder.

## Como trabalhar
- Responder sempre em português, direto, com passos claros do que o Lucas precisa fazer.
- O Lucas trabalha só pelo celular (sem notebook): nada de passos que exijam terminal no PC.
- Este repositório é a fonte da verdade. Começar cada sessão lendo `docs/GDD-sistemas.md` e `docs/DIARIO.md`.
- Confirmar com o Lucas as decisões de design antes de construir algo grande.
- Testar o código antes de entregar e mandar uma prévia jogável.
- Ao fim de cada sessão: atualizar o GDD, registrar no `docs/DIARIO.md` e dizer o próximo passo.
- Avisar antes de sugerir qualquer gasto (orçamento total: R$ 300).

## Publicação (GitHub Pages)
- `game/index.html` é a fonte (também publicada como artifact no Claude).
- Depois de mudar o index.html, rodar `python3 tools/gera-app.py` para gerar `game/app.html` e `game/sw.js` (versão do app/Pages).
- Link do jogo: https://lucas2015alcara-dot.github.io/taverna-idle/ (redireciona para game/app.html).

## Estrutura
- `docs/` — GDD e diário de desenvolvimento
- `game/` — código do jogo (a criar no protótipo)
