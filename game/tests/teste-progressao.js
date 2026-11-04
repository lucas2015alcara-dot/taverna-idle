// Bot simples: joga sessões a cada 4h, sobe nível, invoca, evolui e avança fases.
const TL = require('../logic.js');
const assert = (c, m) => { if (!c) { console.error('FALHOU:', m); process.exitCode = 1; } };

let e = TL.novoEstado();
assert(e.equipe.length >= 2, 'equipe inicial');
const r1 = TL.lutarFase(e, 1);
assert(r1.venceu, 'fase 1 deve ser vencível no início');
assert(e.fase === 1, 'avança fase');

// fusão: regra 4->5 exige cópia
const h4 = e.herois.find(h => h.def === 'rec_floresta_3');
assert(TL.regraFusao(h4).mesmaFac === 2, 'regra 3->4');

// invocação
const antes = e.herois.length;
const inv = TL.invocar(e, 'premium', 5);
assert(inv.length === 5 && e.herois.length === antes + 5, 'premium com pergaminhos');
assert(TL.chancesDetalhadas().reduce((a, c) => a + c.chance, 0).toFixed(2) === '5.00', 'chances somam 5%');

// pity
let e2 = TL.novoEstado(); e2.gemas = 1e6; e2.pity = 0;
let max = 0, sem = 0;
for (let i = 0; i < 400; i++) { const [h] = TL.invocar(e2, 'premium', 1); if (h.est === 5) { max = Math.max(max, sem + 1); sem = 0; } else sem++; }
assert(max <= TL.PITY, 'pity respeitado: ' + max);

// AFK
let e3 = TL.novoEstado(); e3.ultimoAfk = Date.now() - 20 * 3600e3;
const p = TL.afkPendente(e3);
assert(p.min === TL.AFK_MAX_MIN && p.cheio, 'AFK limita em 12h');

// progressão por dias
function sessao(e, horas) {
  e.ultimoAfk -= horas * 3600e3; TL.coletaAfk(e);
  e.gemas += 180 / 6; // missões etc. (aprox. por sessão)
  while (e.pergC > 0) TL.invocar(e, 'comum', 1);
  while (e.pergP > 0 || e.gemas >= TL.CUSTO_PREMIUM) TL.invocar(e, 'premium', 1);
  TL.fundirBasicos(e);
  for (let k = 0; k < 3; k++) for (const h of [...e.herois]) if (TL.heroi(e, h.uid) && TL.planoFusao(e, h.uid).ok && !TL.DEFS[h.def].recruta) TL.evoluir(e, h.uid);
  for (const h of [...e.herois]) if (TL.heroi(e, h.uid) && h.est === 3 && TL.DEFS[h.def].recruta && TL.planoFusao(e, h.uid).ok) TL.evoluir(e, h.uid);
  TL.autoEquipe(e, false);
  let subiu = true;
  while (subiu) { subiu = false; const eq = e.equipe.map(u => TL.heroi(e, u)).sort((a, b) => a.nv - b.nv); for (const h of eq) if (TL.subirNivel(e, h.uid).ok) { subiu = true; break; } }
  let lutas = 0;
  while (e.fase < TL.TOTAL_FASES && lutas < 5) { lutas++; const r = TL.lutarFase(e, e.fase + 1); if (!r.venceu) break; }
}
let bot = TL.novoEstado(); bot.seed = 4242;
const marcos = {};
for (let dia = 1; dia <= 14; dia++) {
  for (let s = 0; s < 6; s++) sessao(bot, 4);
  marcos[dia] = bot.fase;
}
console.log('fase por dia:', JSON.stringify(marcos));
console.log('equipe:', bot.equipe.map(u => { const h = TL.heroi(bot, u); return TL.DEFS[h.def].nome + ' ' + h.est + '★ nv' + h.nv; }).join(', '));
assert(marcos[1] >= 8 && marcos[1] <= 18, 'dia 1 entre fase 8 e 18');
assert(marcos[14] >= 25, 'dia 14 passa da fase 25');
// serialização
const t = TL.serializa(bot); const b2 = TL.carrega(t);
assert(b2 && b2.herois.length === bot.herois.length, 'salvar/carregar');
assert(TL.carrega('{lixo') === null, 'save corrompido não quebra');
console.log(process.exitCode ? 'COM FALHAS' : 'tudo ok');
// calendários
{
  const e = TL.novoEstado(); const t0 = Date.parse('2026-11-05T10:00');
  const ids = TL.calendarios(e, t0).map(c => c.id);
  assert(ids.includes('novato') && ids.includes('mensal') && !ids.includes('natal2026'), 'calendários ativos fora do Natal');
  assert(TL.resgataCalendario(e, 'novato', null, t0).ok, 'resgata dia 1');
  assert(!TL.resgataCalendario(e, 'novato', null, t0 + 3600e3).ok, 'só 1x por dia');
  // pula 3 dias: continua do dia 2 (não perde)
  const r2 = TL.resgataCalendario(e, 'novato', null, t0 + 4 * 86400e3);
  assert(r2.ok && r2.dia === 2, 'dia perdido continua de onde parou');
  for (let d = 5; d <= 9; d++) TL.resgataCalendario(e, 'novato', 'morgrath', t0 + d * 86400e3);
  assert(e.herois.some(h => h.def === 'morgrath' && h.est === 5), 'dia 7: herói à escolha');
  assert(!TL.calendarios(e, t0 + 10 * 86400e3).some(c => c.id === 'novato'), 'novato some depois do dia 7');
  assert(TL.calendarios(e, Date.parse('2026-12-20T10:00')).some(c => c.id === 'natal2026'), 'evento de Natal aparece na data');
  const e2 = TL.novoEstado(); const p7 = TL.resgataCalendario(e2, 'novato', null, t0);
  assert(p7.ok, 'ok'); for (let d = 1; d < 6; d++) TL.resgataCalendario(e2, 'novato', null, t0 + d * 86400e3);
  const sem = TL.resgataCalendario(e2, 'novato', null, t0 + 6 * 86400e3);
  assert(!sem.ok && sem.precisaEscolha, 'dia 7 exige escolha');
}
console.log(process.exitCode ? 'COM FALHAS (calendário)' : 'calendários ok');
