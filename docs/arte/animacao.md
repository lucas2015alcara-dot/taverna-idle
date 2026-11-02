# Animação

## Versão atual (02/11): sprite inteiro
- `poseAtaque()` (lógica): preparação 20% → avanço até 42% → golpe até 60% → retorno. Devolve deslocamento, giro e escala; não altera a posição real do herói.
- `criaEfeitos()` (visual): arco de energia, partículas de chama e tremor no alvo, no momento do impacto (50% da duração).
- Ajustes em `CFG_ATAQUE`: velocidade, distância do avanço e intensidade. Testar em Taverna → Teste de animação.
- Vale para todos os heróis corpo a corpo (Guerreiro, Tanque, Assassino); cor do efeito pela facção.

## Para animação esquelética (próximo nível)
Cada herói precisa ser entregue em **peças separadas**, em PNG com fundo transparente, todas na mesma escala e pose neutra:
- cabeça, tronco, quadril
- braço superior e antebraço/mão de cada lado
- coxa e perna/pé de cada lado
- arma (espada, arco, cajado) e acessórios soltos (capa, cabelo longo, auréola)

Mais:
- **Arquivo de esqueleto** (JSON): posição de cada peça, ponto de giro (pivô) de cada articulação e ordem de desenho.
- **Arquivo de animações** (JSON): para cada animação (parado, ataque, habilidade, dano, morte), os ângulos e posições das peças ao longo do tempo.
- Ferramenta: DragonBones (grátis) ou Spine (pago) exportam esses dois arquivos; o jogo lê com um leitor próprio ou uma biblioteca de leitura.

Custo: o GPT tem dificuldade de gerar peças que se encaixam perfeitamente. Caminho realista: pedir o herói em pose neutra (braços afastados do corpo) e recortar as peças manualmente num editor, ou contratar um artista só para o recorte.

## Decisão (02/11)
Lucas aprovou a animação por quadros do GPT: cada herói ganha uma folha de 4 quadros de ataque (e depois uma de ultimate), gerada anexando a imagem original.

## Teste quadro a quadro (feito em 02/11)
Resultado: os 4 quadros vieram consistentes. Separados da folha pela forma de cada quadro, na mesma escala e alinhados pelos pés (`QUADROS` no index.html). Modo escolhido em `CFG_ATAQUE.modo`: 'codigo' (imagem inteira com giro) ou 'quadros'. Nos quadros, o avanço continua por código e só a pose muda.

### Prompt usado
Prompt para o ChatGPT, com a imagem do Morgrath anexada:

> Usando o personagem da imagem anexada, sem mudar nada no visual dele (mesma armadura, cores, chifres, capa e espada), crie uma folha de animação (sprite sheet) de ataque com 4 quadros, lado a lado numa única linha horizontal, todos do mesmo tamanho e na mesma escala, com os pés na mesma altura em todos os quadros: 1. Preparação: inclinado para trás, espada erguida acima do ombro. 2. Avanço: corpo projetado para a frente, espada começando a descer. 3. Golpe: espada no meio do arco, à frente do corpo, capa esvoaçando. 4. Pós-golpe: espada baixa à frente, corpo ainda inclinado. Virado para a direita, fundo branco liso, sem texto, sem números, sem efeitos de impacto.

Se vier consistente: recortar os 4 quadros, alinhar pelos pés e comparar com a animação por código.

## Ultimates (proposta de efeito visual)
| Herói | Ultimate | Efeito |
| --- | --- | --- |
| Fen | Saraivada | Chuva de flechas de folhas caindo do alto |
| Brutus | Muralha | Batida do escudo no chão e barreira dourada na frente da equipe |
| Ondina | Chuva Arcana | Onda que atravessa o campo inimigo |
| Vex | Golpe nas Costas | Some em fumaça roxa e reaparece atrás do alvo |
| Irmã Rosa | Prece | Luz dourada e pétalas de rosa sobre os aliados |
| Morgrath | Golpe Brutal | Rachadura de fogo escuro no chão |

Monstros: uma "fúria" simples por tipo.

## Quadros de ataque dos outros heróis (prompts enviados em 02/11)
Anexar a imagem original do herói e pedir 4 quadros numa linha, mesma escala, pés na mesma altura, virado para a direita, fundo branco, sem efeitos (efeitos são por código).
- Brutus: preparação com escudo / investida / martelo descendo / defesa.
- Vex: agachado / investida / corte em X / adagas abertas.
- Fen (tiro): pega flecha / encaixa / arco puxado / após soltar.
- Ondina (feitiço): junta energia / gira / lança / recupera.
- Irmã Rosa (bênção): reza / ergue a mão / mão no alto / recupera.
Pendente no código: usar quadros também em ataques à distância e curas (hoje só corpo a corpo).
