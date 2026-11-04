# GDD – Sistemas (A Taverna do Fim do Mundo)

Atualizado em 2026-11-02 · Lucas Alcara

> Cópia em Markdown do documento editável no Claude. Ao mudar uma decisão, atualizar os dois.

## Visão geral

Idle RPG mobile de coleção de heróis, em fantasia medieval com tom equilibrado (aventura com humor e drama). O jogador herda uma taverna na fronteira do reino e contrata heróis para enfrentar monstros que saem de uma fenda no céu.

- **Gênero:** idle RPG de coleção (referências: Idle Heroes, Tap Tap Heroes)
- **Plataforma:** Android (Google Play), HTML5/JavaScript empacotado via PWABuilder
- **Arte:** cartoon gerado no GPT; protótipos com arte desenhada por código
- **Status:** pré-produção. Este documento define os sistemas antes de história e arte.
- **Orientação:** celular deitado (paisagem), como Idle Heroes (decidido em 02/11).
- **Tela principal:** ilustração do vilarejo (feita em 02/11) com áreas clicáveis: portal = Invocar, taverna/baú = ganhos AFK, portão = Campanha, quartel = Heróis, torre = Torre da Fenda (em breve), barraca = Loja (em breve).
- **Fluxo de arte da interface:** o visual é decidido no GPT (mockup a partir de print do jogo) e vem como peças separadas em fundo branco (molduras, placas, botões), aplicadas no jogo como imagens esticáveis. Originais em `docs/arte/originais/`.
- **Tela de invocação:** portal no centro, altar Comum à esquerda e Premium à direita (pergaminho primeiro, depois gemas), barra da garantia de 5★ e botão Chances sempre visível. Revelação: cartas viradas que giram uma a uma; a cor do portal antecipa o melhor resultado (azul 3★, roxo 4★, dourado 5★).
- **Tela da campanha:** mapa do capítulo com a trilha das 10 fases (a 10ª é chefe) e painel da fase à direita: inimigos, facção que leva vantagem, recompensa da primeira vitória, poder da equipe e ganho AFK. Fases vencidas podem ser jogadas de novo sem recompensa. Capítulos (provisórios): 1 Clareira da Fenda, 2 Muralhas Partidas, 3 Coração da Fenda.
- **Som:** música da taverna nas telas e da batalha na luta (troca com fade, pausa em segundo plano). Efeitos pelo Web Audio: ataque por função (espada, martelo, flecha, magia, cura), ultimate + som próprio do herói, vitória/derrota, portal, revelação e 5★, nível, evolução, moedas, botões. Liga/desliga separado para música e efeitos (salvo no aparelho).
- **Tela de heróis:** grade de cartas (borda na cor da raridade, brasão da facção, estrelas, nível, selo "Equipe") com filtro por facção. Ficha do herói: arte grande, setas para navegar entre heróis, atributos, subir nível (1 ou +10), ultimate e evolução com as cartas que serão consumidas escolhidas automaticamente (recrutas e mais fracos primeiro, equipe por último).
- **Batalha:** 6 heróis agrupados à esquerda (2 frente + 4 atrás, em diagonal), inimigos à direita, cenário ilustrado ao fundo.
- **Arte:** imagens inteiras do GPT (cenários, tela principal, heróis) animadas por código; teste em `docs/arte/prompts-teste.md`.

Todos os números abaixo são propostas iniciais, para ajustar na planilha de economia e nos testes.

## Ciclo principal

1. **Batalhar:** a equipe enfrenta a próxima fase da campanha automaticamente.
2. **Ganhar:** ouro, experiência de herói, fragmentos e pergaminhos de invocação (também ganhos enquanto o jogador está fora).
3. **Melhorar:** subir nível, evoluir estrelas, invocar heróis, equipar.
4. **Avançar:** passar de fase e capítulo, liberando novos cenários e modos.

- **Sessão típica (5–10 min):** coletar ganhos idle → invocar → evoluir heróis → tentar a próxima fase → missões diárias.
- **Ciclo diário:** missões diárias e invocação comum grátis por dia.
- **Ciclo longo:** juntar cópias e material para levar heróis a 5★ e 6★.

## Heróis

Cada herói tem uma facção, uma função e uma raridade inicial em estrelas.

### Facções (nomes próprios a definir com a história)

| Facção (provisório) | Tipo | Ideia de identidade |
| --- | --- | --- |
| Floresta | Comum | Druidas, elfos, feras |
| Fortaleza | Comum | Cavaleiros, soldados, anões |
| Abismo | Comum | Criaturas do mar profundo e dos túneis |
| Sombra | Comum | Ladrões, necromantes, mortos-vivos |
| Luz | Rara | Anjos, santos, campeões sagrados |
| Trevas | Rara | Demônios, cultistas, lordes sombrios |

Luz e Trevas aparecem menos na invocação e têm atributos cerca de 10% maiores.

### Funções

| Função | Papel | Posição |
| --- | --- | --- |
| Guerreiro | Dano físico corpo a corpo | Frente |
| Tanque | Absorve dano, protege aliados | Frente |
| Mago | Dano mágico em área | Trás |
| Arqueiro | Dano contínuo em alvo único | Trás |
| Assassino | Dano explosivo, mira o mais fraco | Trás |
| Suporte | Cura, escudos, bônus | Trás |

### Atributos

Vida, Ataque, Defesa e Velocidade. Secundários: chance e dano crítico, precisão, esquiva.

### Raridade de origem

O herói nasce com 1★ a 5★. Os de 1★ a 3★ servem principalmente como material de fusão; os de 4★ e 5★ são o objetivo da coleção.

### Raridade (decidido em 02/11)

Separada das estrelas: entre os heróis que nascem 5★ há quatro raridades, e a raridade mostra quem é mais forte. Os de origem 1★–4★ não têm raridade (são material de fusão).

| Raridade | Força base | Chance entre os 5★ |
| --- | --- | --- |
| Raro | 100% | 55% |
| Épico | 112% | 30% |
| Lendário | 125% | 12% |
| Mítico | 140% | 3% |

Limite de estrelas por origem: 1★–3★ vão até 4★; 4★ vai até 5★; só os que nascem 5★ chegam a 6★.

## Combate

Batalha automática por turnos, equipe de **6 heróis: 2 na frente e 4 atrás**. **Turnos por equipe** (decidido em 02/11): em cada turno, toda a equipe do jogador ataca e depois toda a equipe inimiga; dentro de cada equipe, maior Velocidade age primeiro. A ultimate dispara sozinha quando a energia chega a 100.

- **Turno:** ataque básico + 50 de energia; com 100 de energia, usa a habilidade ativa.
- **Habilidades:** 1 ativa + 2 passivas, liberadas ao subir de estrela.
- **Alvos:** a frente recebe ataques corpo a corpo primeiro; assassinos e alguns magos atingem a linha de trás.
- **Limite:** 15 rodadas; empate conta como derrota.
- **Velocidade:** 1x e 2x; pular batalhas já vencidas.

### Vantagem entre facções

Ciclo das comuns: Floresta → Abismo → Fortaleza → Sombra → Floresta. Luz e Trevas têm vantagem uma contra a outra. Vantagem: +30% de dano e +15% de precisão.

### Bônus de equipe

Vários heróis da mesma facção dão bônus (ex.: 4 da mesma facção = +10% de Ataque e Vida).

## Progressão

### Nível

Sobe com ouro e experiência. Nível máximo depende das estrelas (ex.: 5★ = 100, 6★ = 140).

### Estrelas (1★ a 6★)

| Evolução | O que consome |
| --- | --- |
| 1★ → 2★ → 3★ | 2 heróis iguais da mesma estrela viram 1 da estrela seguinte |
| 3★ → 4★ | O herói 3★ + 2 heróis 3★ da mesma facção |
| 4★ → 5★ | O herói 4★ + 1 cópia dele 4★ + 2 heróis 4★ da mesma facção |
| 5★ → 6★ | O herói 5★ + 1 cópia dele 5★ + 2 heróis 5★ da mesma facção |

Cada estrela aumenta os atributos base e libera uma passiva.

### Equipamentos

Arma, armadura, elmo e botas; peças de 1★ a 6★; 3 peças iguais viram 1 de estrela maior.

### Reciclar heróis

Heróis sem uso viram fragmentos para a loja da taverna.

## Invocação

| Chance por estrela | Comum | Premium |
| --- | --- | --- |
| 1★ | 40% | — |
| 2★ | 35% | — |
| 3★ | 20% | 60% |
| 4★ | 4,5% | 35% |
| 5★ | 0,5% | 5% |

- **Comum:** pergaminhos comuns; 1 grátis por dia.
- **Premium:** pergaminhos premium ou gemas; 1 grátis a cada 2 dias; pacote de 10 garante um 4★.
- **Garantia:** 5★ garantido na 40ª invocação premium sem 5★.
- **Luz e Trevas:** só na premium, 0,6% (dentro dos 5%), mais um portal especial depois.
- **Por facção:** invoca só da facção escolhida.

**Play Store:** mostrar as chances dentro do jogo; compras reais só via Google Play Billing (fase 5).

## Economia

| Recurso | De onde vem | Onde se gasta |
| --- | --- | --- |
| Ouro | Batalhas, ganhos idle | Nível, equipamentos |
| Experiência de herói | Ganhos idle, campanha | Nível |
| Gemas | Primeira vitória de fase, missões, conquistas | Invocação premium, acelerar idle, loja |
| Pergaminho comum | Missões diárias, campanha | Invocação comum |
| Pergaminho premium | Marcos da campanha, eventos | Invocação premium |
| Fragmentos | Reciclar heróis | Loja da taverna |

### Eventos e calendários (revisado em 04/11)

Diretriz do Lucas: jogo generoso em recompensas para ninguém desistir cedo, sem ficar fácil demais; eventos guiam o jogador grátis por um caminho mais tranquilo.

- **Calendários rodam juntos:** novato (7 dias), mensal (30 dias) e eventos com data (ex.: Natal). Cada um pode ser recebido 1x por dia.
- **Dia perdido não se perde:** o calendário continua de onde parou.
- **Novato (7 dias):** 1) 10 perg. comuns + 5.000 ouro · 2) 300 gemas + 3.000 XP · 3) 2 perg. premium · 4) 10.000 ouro + 6.000 XP · 5) 3 perg. premium · 6) 500 gemas · 7) **herói 5★ à escolha**.
- **Mensal (30 dias, recomeça):** dias 5/10/15/20/25: 2 perg. premium · dias 7/14/21/28: 5 perg. comuns + 60 gemas · outros pares: 80 gemas · ímpares: ouro e XP crescentes (2.200/1.320 no dia 1 até 7.800/4.680 no dia 29) · dia 30: herói 5★ surpresa.
- **Evento de Natal (Festival de Inverno, 15/12/2026 a 06/01/2027):** 11 dias com gemas, pergaminhos, ouro, XP e herói 5★ à escolha no último dia. Novos eventos entram na lista `EVENTOS` do `logic.js` com data de início e fim.
- **Evento semanal (2 perg. premium + 300 gemas):** decidido, ainda não implementado.
- **Tela:** botão "Calendário" na taverna (ponto vermelho quando há recompensa), abre sozinho 1x por dia; abas por calendário; escolha do herói em cartas.

### Ajuste de dificuldade (04/11)
- Ganho AFK dobrado: ouro 10 + 4×fase/min, XP 8 + 3×fase/min.
- Primeira vitória da fase: ouro 150 + 60×fase, XP 100 + 40×fase, 60 gemas (chefe 200 + 1 perg. premium).
- Inimigos um pouco mais fracos: força base 0,42 (era 0,5).
- Resultado no bot (jogador grátis com calendários): fase 10 (1º chefe) em ~1 hora de jogo; dia 1 ≈ fase 15; dia 3 ≈ 19–22; as 30 fases atuais em ~5 dias. Quando entrarem mais capítulos, a curva dos novos fica mais lenta.

## Ganhos idle e modos de jogo

Ganhos idle pela fase mais alta vencida, acumulando até 12 horas. Coleta rápida de 2 horas: grátis 1x/dia, depois por gemas.

| Modo | Libera | O que oferece |
| --- | --- | --- |
| Campanha | Início | História, capítulos, cenários |
| Torre da Fenda | Capítulo 2 | Andares difíceis, recompensas |
| Masmorras diárias | Capítulo 3 | Material de evolução por facção |
| Arena PvP | Depois do lançamento | Contra outros jogadores |

## Contas e jogador novato (decidido em 02/11)

- **Cadastro opcional:** começa como visitante; ao criar conta com e-mail ganha um herói 5★ exclusivo (uma vez por conta) e salvamento na nuvem. Servidor previsto: Supabase (plano grátis).
- **Calendário do novato (7 dias):** login diário com recompensas e missões, além do calendário normal de 30 dias.
- **Redes sociais:** sem recompensa por curtir/compartilhar (proibido pela Meta). Usar códigos de resgate postados no Facebook, TikTok e Discord, e recompensa por indicação.
- **Estúdio:** nome e página na fase 3, junto com a política de privacidade.

## Protótipo cinza (game/)

6 heróis, um por facção: Fen (Floresta, Arqueiro, Raro), Brutus (Fortaleza, Tanque, Épico), Ondina (Abismo, Mago, Raro), Vex (Sombra, Assassino, Épico), Irmã Rosa (Luz, Suporte, Lendário), Morgrath (Trevas, Guerreiro, Mítico). Mais recrutas genéricos 1★–4★ por facção comum como material de fusão. Inclui: taverna com AFK, campanha de 30 fases (chefe a cada 10), combate por turnos com vantagem de facção, subir nível, evolução por fusão, invocação comum/premium com garantia e tabela de chances, salvamento local.

## Kit visual (02/11)

- Fontes: Lilita One (títulos, números, botões) e Nunito (textos), embutidas no jogo.
- Cores: madeira escura da taverna, molduras douradas, texto creme; botão principal laranja-dourado com contorno.
- Ícones do GPT em `game/assets/ui`: ouro, xp, gema, pergaminho comum/premium, estrela, estrela especial, baú, 6 brasões de facção, poder, engrenagem.
- Regra: toda tela nova usa esses painéis, botões e ícones.

## Ideias para depois

- Calibrar velocidade e quem começa o turno (hoje o jogador sempre começa).
- Crítico como atributo de cada herói (hoje: 15% de chance, +50% de dano para todos).
- Animação de ultimate para cada herói e fúria para cada monstro.

## Servidores e PvP (plano para depois do lançamento)

Servidor = mundo lógico, não máquina separada: todos os jogadores no mesmo banco (Supabase), cada um com uma etiqueta de mundo. Abre-se um mundo novo a cada X dias ou X jogadores; arena, ranking e eventos competitivos só cruzam jogadores do mesmo mundo. Mundos vazios podem ser fundidos depois.

- Supabase grátis comporta o início: 50 mil usuários ativos/mês, 500 MB de banco, 500 mil execuções de funções. Pausa após 1 semana sem uso.
- Pro: a partir de US$ 25/mês. Fora do orçamento; só se o jogo crescer.
- Antitrapaça: no PvP, a luta é calculada no servidor (função do Supabase) com o mesmo `logic.js`.

## Monetização (rascunho, fase 5)

- Sem propaganda forçada. Só anúncio opcional premiado (assistir para ganhar gemas), com limite diário.
- Pacote inicial ~US$ 1 (uma vez), passe mensal, pacotes de gemas.
- Regra: tudo que se compra também se consegue jogando, mais devagar.
- Google Play: US$ 25 uma vez, sem mensalidade; taxa de 15% sobre compras até US$ 1M/ano (exige inscrição). Compras só via Google Play Billing.
- **Alerta legal (Brasil):** ECA Digital (Lei 15.211/2025, em vigor desde 17/03/2026) restringe caixas de recompensa em jogos acessíveis a menores e exige verificação de idade. A invocação paga se enquadra. Decidir antes da fase 5: jogo 18+ com verificação de idade, ou invocação aleatória só com moeda ganha jogando e venda de itens sem sorteio. Confirmar com fonte jurídica.

## Divulgação (plano)

Começar grátis: vídeos de gameplay narrados (ElevenLabs) no TikTok/Shorts, Discord para os primeiros jogadores, grupos de jogos idle. Anúncio pago só depois de medir retenção, com aprovação do Lucas.
Expectativa realista: 80% dos apps/jogos com downloads ficam abaixo de 10 mil/mês (Appfigures, 2023); em RPGs ~3% dos jogadores pagam por dia nos jogos que vão bem. Objetivo: jogo terminado e jogado; lucro não é meta.

## Decisões

### Decidido em 02/11

- 5★ → 6★ usa 2 cópias do herói no total, mais 2 heróis 5★ da mesma facção.
- As facções terão nomes próprios, definidos junto com a história.
- Equipe de 6 heróis: 2 na frente e 4 atrás.
- Arena PvP fica para depois do lançamento.

### Próximos passos da pré-produção

1. ~~Criar o repositório no GitHub~~ (feito em 02/11).
2. ~~Simulador de economia dos primeiros 30 dias~~ (feito em 02/11).
3. Protótipo cinza (arte de código): 10 heróis de teste, combate com facções, invocação e fusão.
4. Testar GitHub Pages → PWABuilder → instalar no celular.
5. Só então: história, lista final de heróis e ficha de estilo para o GPT.
