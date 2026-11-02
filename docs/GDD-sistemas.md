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
- **Tela principal:** ilustração da taverna e arredores com áreas clicáveis (balcão = invocação, quadro de missões = campanha etc.).
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

Batalha automática por turnos, equipe de **6 heróis: 2 na frente e 4 atrás**. Maior Velocidade age primeiro.

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

### Eventos e calendário (decidido em 02/11)

- **Evento semanal:** ao fim de cada semana, 2 pergaminhos premium e 300 gemas.
- **Calendário de login (30 dias):** 1 pergaminho premium nos dias 5, 10, 15, 20 e 25; 30 gemas nos demais dias; no dia 30, um herói 5★ aleatório.
- **Ritmo base um pouco mais generoso:** 180 gemas por dia.

Resultado no simulador (`tools/economia`, jogador grátis): 1º herói 5★ por volta do dia 5; cerca de 50% chegam a um 6★ em 30 dias e quase todos em 60 dias; cerca de 66 invocações premium por mês.

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
