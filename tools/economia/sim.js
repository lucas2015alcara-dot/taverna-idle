// Simulador de economia — Taverna Idle
// Simula N jogadores grátis por D dias: ganhos diários, invocações e fusões.
(function (root) {
  const DEFAULTS = {
    dias: 30,
    jogadores: 200,
    pergComumDia: 5,
    gemasDia: 180,
    custoPremium: 250,
    premiumGratisDia: 0.5,
    pergPremiumDia: 0.3,
    eventoPremiumSemana: 2, // evento semanal: pergaminhos premium entregues no dia 7, 14, 21...
    eventoGemasSemana: 300,
    calendario: true, // calendário de login de 30 dias
    calendarioGemasDia: 30, // dias comuns do calendário
    calendarioPremiumDias: [5, 10, 15, 20, 25], // dias com 1 pergaminho premium
    calendario5Estrelas: 'aleatorio', // dia 30: herói 5★ — 'aleatorio', 'escolha' ou false
    comum: { 1: 40, 2: 35, 3: 20, 4: 4.5, 5: 0.5 },
    premium: { 3: 60, 4: 35, 5: 5 },
    luzTrevasNoPremium5: 12, // % dos 5★ da premium que são Luz/Trevas (0,6% de 5%)
    pity: 40,
    pool: { 1: 2, 2: 3, 3: 4, 4: 3, 5: 3 }, // heróis distintos por facção comum, por estrela de origem
    poolLT: 2, // heróis 5★ por facção rara (Luz, Trevas)
    maxEstrela: { 1: 4, 2: 4, 3: 4, 4: 5, 5: 6 }, // estrela máxima por estrela de origem
  };

  const FAC_COMUNS = [0, 1, 2, 3];
  const FAC_RARAS = [4, 5];

  function rng(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function sorteia(tabela, r) {
    const tot = Object.values(tabela).reduce((a, b) => a + b, 0);
    let x = r() * tot;
    for (const k of Object.keys(tabela)) {
      x -= tabela[k];
      if (x < 0) return +k;
    }
    return +Object.keys(tabela).pop();
  }

  // inventário: Map chave "fac|origem|id|estrela" -> quantidade
  function add(inv, fac, orig, id, est, n = 1) {
    const k = fac + '|' + orig + '|' + id + '|' + est;
    inv.set(k, (inv.get(k) || 0) + n);
    if (inv.get(k) <= 0) inv.delete(k);
  }
  function lista(inv) {
    return [...inv.entries()].map(([k, q]) => {
      const [fac, orig, id, est] = k.split('|').map(Number);
      return { fac, orig, id, est, q };
    });
  }

  function heroiAleatorio(cfg, est, r, raro) {
    if (raro) {
      const fac = FAC_RARAS[Math.floor(r() * 2)];
      return { fac, orig: 5, id: Math.floor(r() * cfg.poolLT) };
    }
    const fac = FAC_COMUNS[Math.floor(r() * 4)];
    return { fac, orig: est, id: Math.floor(r() * cfg.pool[est]) };
  }

  // Usa `n` heróis de estrela `est` e facção `fac` como material, sem tocar no alvo.
  // Prefere material sem cópia útil (heróis "sozinhos") e de origem mais baixa.
  function pegaMaterial(inv, fac, est, n, alvoKey) {
    const cands = lista(inv)
      .filter((h) => h.fac === fac && h.est === est)
      .map((h) => {
        const k = h.fac + '|' + h.orig + '|' + h.id + '|' + h.est;
        const disp = k === alvoKey ? h.q - 2 : h.q;
        return { ...h, k, disp };
      })
      .filter((h) => h.disp > 0)
      .sort((a, b) => a.orig - b.orig || a.disp - b.disp);
    const total = cands.reduce((a, h) => a + h.disp, 0);
    if (total < n) return false;
    let falta = n;
    for (const h of cands) {
      const usa = Math.min(h.disp, falta);
      inv.set(h.k, inv.get(h.k) - usa);
      if (inv.get(h.k) <= 0) inv.delete(h.k);
      falta -= usa;
      if (!falta) break;
    }
    return true;
  }

  function funde(inv, cfg) {
    let mudou = true;
    while (mudou) {
      mudou = false;
      // 5★ → 6★: herói + 1 cópia 5★ + 2 heróis 5★ da mesma facção
      for (const h of lista(inv).filter((h) => h.est === 5 && h.q >= 2 && cfg.maxEstrela[h.orig] >= 6).sort((a, b) => b.orig - a.orig)) {
        const k = h.fac + '|' + h.orig + '|' + h.id + '|5';
        if ((inv.get(k) || 0) < 2) continue;
        const snap = new Map(inv);
        if (pegaMaterial(inv, h.fac, 5, 2, k)) {
          add(inv, h.fac, h.orig, h.id, 5, -2);
          add(inv, h.fac, h.orig, h.id, 6);
          mudou = true;
        } else { inv.clear(); snap.forEach((v, kk) => inv.set(kk, v)); }
      }
      // 4★ → 5★: herói 4★ + 1 cópia 4★ + 2 heróis 4★ da mesma facção
      for (const h of lista(inv).filter((h) => h.est === 4 && h.q >= 2 && cfg.maxEstrela[h.orig] >= 5).sort((a, b) => b.orig - a.orig)) {
        const k = h.fac + '|' + h.orig + '|' + h.id + '|4';
        if ((inv.get(k) || 0) < 2) continue;
        const snap = new Map(inv);
        if (pegaMaterial(inv, h.fac, 4, 2, k)) {
          add(inv, h.fac, h.orig, h.id, 4, -2);
          add(inv, h.fac, h.orig, h.id, 5);
          mudou = true;
        } else { inv.clear(); snap.forEach((v, kk) => inv.set(kk, v)); }
      }
      // 3★ → 4★: herói 3★ + 2 heróis 3★ da mesma facção
      for (const fac of FAC_COMUNS) {
        const tres = lista(inv).filter((h) => h.fac === fac && h.est === 3);
        const tot = tres.reduce((a, h) => a + h.q, 0);
        const alvos = tres.filter((h) => cfg.maxEstrela[h.orig] >= 4);
        if (tot >= 3 && alvos.length) {
          const alvo = alvos.sort((a, b) => b.q - a.q)[0];
          add(inv, alvo.fac, alvo.orig, alvo.id, 3, -1);
          pegaMaterial(inv, fac, 3, 2, null);
          add(inv, alvo.fac, alvo.orig, alvo.id, 4);
          mudou = true;
        }
      }
      // 1★ → 2★ → 3★: 2 heróis iguais viram 1 da estrela seguinte
      for (const h of lista(inv).filter((h) => h.est <= 2 && h.q >= 2 && cfg.maxEstrela[h.orig] > h.est)) {
        const pares = Math.floor(h.q / 2);
        add(inv, h.fac, h.orig, h.id, h.est, -2 * pares);
        add(inv, h.fac, h.orig, h.id, h.est + 1, pares);
        mudou = true;
      }
    }
  }

  function conta(inv, est, origMin = 1) {
    return lista(inv).filter((h) => h.est >= est && h.orig >= origMin).reduce((a, h) => a + h.q, 0);
  }

  function simulaJogador(cfg, seed) {
    const r = rng(seed);
    const inv = new Map();
    let gemas = 0, premFrac = 0, semCinco = 0, nPrem = 0, nComum = 0;
    let dia5 = null, dia6 = null, diaInvoc5 = null;
    const serie5 = [], serie6 = [], serie5o5 = [];
    for (let d = 1; d <= cfg.dias; d++) {
      gemas += cfg.gemasDia;
      premFrac += cfg.premiumGratisDia + cfg.pergPremiumDia;
      let prem = Math.floor(premFrac);
      premFrac -= prem;
      if (d % 7 === 0) { prem += cfg.eventoPremiumSemana; gemas += cfg.eventoGemasSemana; }
      const dc = ((d - 1) % 30) + 1;
      if (cfg.calendario) {
        if (cfg.calendarioPremiumDias.includes(dc)) prem++;
        else if (dc !== 30) gemas += cfg.calendarioGemasDia;
        if (dc === 30 && cfg.calendario5Estrelas) {
          // jogador escolhe o 5★ de origem 5★ que mais ajuda: o que ele já tem mais cópias
          const meus = lista(inv).filter((h) => h.orig === 5 && h.est === 5 && h.fac < 4).sort((a, b) => b.q - a.q);
          const h = cfg.calendario5Estrelas === 'escolha' && meus.length ? meus[0] : heroiAleatorio(cfg, 5, r, false);
          add(inv, h.fac, 5, h.id, 5);
        }
      }
      while (gemas >= cfg.custoPremium) { gemas -= cfg.custoPremium; prem++; }
      for (let i = 0; i < prem; i++) {
        nPrem++;
        let est = sorteia(cfg.premium, r);
        semCinco++;
        if (semCinco >= cfg.pity) est = 5;
        if (est === 5) { semCinco = 0; if (!diaInvoc5) diaInvoc5 = d; }
        const raro = est === 5 && r() * 100 < cfg.luzTrevasNoPremium5;
        const h = heroiAleatorio(cfg, est, r, raro);
        add(inv, h.fac, h.orig, h.id, est);
      }
      for (let i = 0; i < cfg.pergComumDia; i++) {
        nComum++;
        const est = sorteia(cfg.comum, r);
        if (est === 5 && !diaInvoc5) diaInvoc5 = d;
        const h = heroiAleatorio(cfg, est, r, false);
        add(inv, h.fac, h.orig, h.id, est);
      }
      funde(inv, cfg);
      const c5 = conta(inv, 5), c6 = conta(inv, 6);
      if (c5 && !dia5) dia5 = d;
      if (c6 && !dia6) dia6 = d;
      serie5.push(c5);
      serie5o5.push(conta(inv, 5, 5));
      serie6.push(c6);
    }
    return { dia5, dia6, diaInvoc5, serie5, serie6, serie5o5, nPrem, nComum };
  }

  function mediana(arr) {
    const v = arr.filter((x) => x != null).sort((a, b) => a - b);
    if (!v.length) return null;
    return v[Math.floor(v.length / 2)];
  }

  function simula(cfgIn) {
    const cfg = Object.assign({}, DEFAULTS, cfgIn || {});
    const rs = [];
    for (let i = 0; i < cfg.jogadores; i++) rs.push(simulaJogador(cfg, 1234 + i * 7919));
    const n = rs.length;
    const media = (f) => rs.reduce((a, x) => a + f(x), 0) / n;
    const porDia = (key) => Array.from({ length: cfg.dias }, (_, d) => media((x) => x[key][d]));
    const pct = (f) => (100 * rs.filter(f).length) / n;
    return {
      cfg,
      premiumNoMes: media((x) => x.nPrem),
      comumNoMes: media((x) => x.nComum),
      diaPrimeiroInvoc5: mediana(rs.map((x) => x.diaInvoc5)),
      diaPrimeiro5: mediana(rs.map((x) => x.dia5)),
      diaPrimeiro6: mediana(rs.map((x) => x.dia6)),
      pctCom6: pct((x) => x.dia6 != null),
      pctCom5Dia7: pct((x) => x.serie5[Math.min(6, cfg.dias - 1)] > 0),
      media5: porDia('serie5'),
      media6: porDia('serie6'),
      media5o5: porDia('serie5o5'),
    };
  }

  root.TavernaSim = { simula, DEFAULTS };
  if (typeof module !== 'undefined') module.exports = root.TavernaSim;
})(typeof window !== 'undefined' ? window : globalThis);
