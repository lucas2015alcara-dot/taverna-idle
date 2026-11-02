// Taverna Idle — lógica do jogo (sem DOM). Usada pela página e pelos testes.
(function (root) {
  'use strict';

  // ---------- Facções e vantagem ----------
  const FACCOES = {
    floresta: { nome: 'Floresta', cor: '#3B6D11', claro: '#97C459', rara: false },
    fortaleza: { nome: 'Fortaleza', cor: '#5F5E5A', claro: '#B4B2A9', rara: false },
    abismo: { nome: 'Abismo', cor: '#185FA5', claro: '#85B7EB', rara: false },
    sombra: { nome: 'Sombra', cor: '#3C3489', claro: '#AFA9EC', rara: false },
    luz: { nome: 'Luz', cor: '#BA7517', claro: '#FAC775', rara: true },
    trevas: { nome: 'Trevas', cor: '#A32D2D', claro: '#F09595', rara: true },
  };
  const FAC_COMUNS = ['floresta', 'fortaleza', 'abismo', 'sombra'];
  // quem vence quem
  const VENCE = { floresta: 'abismo', abismo: 'fortaleza', fortaleza: 'sombra', sombra: 'floresta', luz: 'trevas', trevas: 'luz' };
  const temVantagem = (a, b) => VENCE[a] === b;

  // ---------- Funções ----------
  const FUNCOES = {
    guerreiro: { nome: 'Guerreiro', hp: 1000, atk: 110, def: 40, vel: 95, frente: true, hab: 'Golpe Brutal', habDesc: '220% de dano em um inimigo da frente' },
    tanque: { nome: 'Tanque', hp: 1500, atk: 70, def: 70, vel: 85, frente: true, hab: 'Muralha', habDesc: '130% de dano e recebe 40% menos dano por 2 rodadas' },
    mago: { nome: 'Mago', hp: 750, atk: 125, def: 25, vel: 100, frente: false, hab: 'Chuva Arcana', habDesc: '110% de dano em todos os inimigos' },
    arqueiro: { nome: 'Arqueiro', hp: 800, atk: 120, def: 30, vel: 110, frente: false, hab: 'Saraivada', habDesc: '3 flechas de 90% em inimigos aleatórios' },
    assassino: { nome: 'Assassino', hp: 700, atk: 140, def: 25, vel: 120, frente: false, hab: 'Golpe nas Costas', habDesc: '280% de dano no inimigo com menos vida' },
    suporte: { nome: 'Suporte', hp: 850, atk: 80, def: 35, vel: 105, frente: false, hab: 'Prece', habDesc: 'Cura todos os aliados em 150% do ataque' },
  };

  // ---------- Raridade (só heróis de origem 5★) ----------
  const RARIDADES = {
    raro: { nome: 'Raro', mult: 1.0, chance: 55, cor: '#185FA5' },
    epico: { nome: 'Épico', mult: 1.12, chance: 30, cor: '#534AB7' },
    lendario: { nome: 'Lendário', mult: 1.25, chance: 12, cor: '#BA7517' },
    mitico: { nome: 'Mítico', mult: 1.4, chance: 3, cor: '#A32D2D' },
  };

  // ---------- Heróis ----------
  const CAMPEOES = [
    { id: 'fen', nome: 'Fen', fac: 'floresta', funcao: 'arqueiro', rar: 'raro', origem: 5 },
    { id: 'brutus', nome: 'Brutus', fac: 'fortaleza', funcao: 'tanque', rar: 'epico', origem: 5 },
    { id: 'ondina', nome: 'Ondina', fac: 'abismo', funcao: 'mago', rar: 'raro', origem: 5 },
    { id: 'vex', nome: 'Vex', fac: 'sombra', funcao: 'assassino', rar: 'epico', origem: 5 },
    { id: 'rosa', nome: 'Irmã Rosa', fac: 'luz', funcao: 'suporte', rar: 'lendario', origem: 5 },
    { id: 'morgrath', nome: 'Morgrath', fac: 'trevas', funcao: 'guerreiro', rar: 'mitico', origem: 5 },
  ];
  // recrutas genéricos (material de fusão) por facção comum e estrela de origem
  const TITULOS = { 1: 'Aldeão', 2: 'Miliciano', 3: 'Recruta', 4: 'Veterano' };
  const FUNCAO_RECRUTA = { floresta: 'arqueiro', fortaleza: 'guerreiro', abismo: 'mago', sombra: 'assassino' };
  const DEFS = {};
  CAMPEOES.forEach((c) => (DEFS[c.id] = c));
  FAC_COMUNS.forEach((f) => {
    for (let s = 1; s <= 4; s++) {
      const id = 'rec_' + f + '_' + s;
      DEFS[id] = { id, nome: TITULOS[s] + ' ' + (f === 'floresta' ? 'da' : f === 'fortaleza' ? 'da' : 'do') + ' ' + FACCOES[f].nome, fac: f, funcao: FUNCAO_RECRUTA[f], rar: null, origem: s, recruta: true };
    }
  });

  const ESTRELA_MAX = { 1: 4, 2: 4, 3: 4, 4: 5, 5: 6 };
  const NIVEL_MAX = { 1: 20, 2: 30, 3: 40, 4: 60, 5: 100, 6: 140 };
  const MULT_ESTRELA = { 1: 0.5, 2: 0.6, 3: 0.72, 4: 0.86, 5: 1.0, 6: 1.25 };

  function atributos(h) {
    const d = DEFS[h.def];
    const f = FUNCOES[d.funcao];
    let m = MULT_ESTRELA[h.est] * (1 + (h.nv - 1) * 0.06);
    if (d.rar) m *= RARIDADES[d.rar].mult;
    else m *= 0.85;
    if (FACCOES[d.fac].rara) m *= 1.1;
    return {
      hp: Math.round(f.hp * m),
      atk: Math.round(f.atk * m),
      def: Math.round(f.def * Math.sqrt(m)),
      vel: f.vel + h.est * 2,
    };
  }
  function poder(h) {
    const a = atributos(h);
    return Math.round(a.hp * 0.2 + a.atk * 4 + a.def * 5 + a.vel);
  }

  // ---------- Custos ----------
  const custoNivel = (nv) => ({ ouro: Math.round(20 * nv + 0.8 * nv * nv), xp: Math.round(12 * nv + 0.5 * nv * nv) });

  // ---------- RNG ----------
  function criaRng(seed) {
    let s = (seed >>> 0) || 1;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function sorteia(tab, r) {
    const tot = Object.values(tab).reduce((a, b) => a + b, 0);
    let x = r() * tot;
    for (const k in tab) { x -= tab[k]; if (x < 0) return k; }
    return Object.keys(tab).pop();
  }
  const escolhe = (arr, r) => arr[Math.floor(r() * arr.length)];

  // ---------- Estado ----------
  const VERSAO = 1;
  function novoEstado() {
    const e = {
      v: VERSAO, ouro: 300, xp: 200, gemas: 500, pergC: 10, pergP: 5,
      herois: [], equipe: [], fase: 0, ultimoAfk: Date.now(), pity: 0, seq: 1, seed: (Date.now() % 100000) + 7,
      tutorial: true,
    };
    const fen = criaHeroi(e, 'fen', 5);
    const brutus = criaHeroi(e, 'brutus', 5);
    criaHeroi(e, 'rec_floresta_3', 3);
    criaHeroi(e, 'rec_abismo_3', 3);
    e.equipe = [brutus.uid, fen.uid];
    autoEquipe(e, true);
    return e;
  }
  function criaHeroi(e, def, est) {
    const h = { uid: e.seq++, def, est, nv: 1 };
    e.herois.push(h);
    return h;
  }
  const heroi = (e, uid) => e.herois.find((h) => h.uid === uid);
  function rngDo(e) {
    const r = criaRng(e.seed);
    return () => { const x = r(); e.seed = (e.seed * 1103515245 + 12345 + Math.floor(x * 1e6)) >>> 0; return x; };
  }

  // Monta a equipe: completa até 6 com os mais fortes (mantém os escolhidos se `manter`)
  function autoEquipe(e, manter) {
    let ids = manter ? e.equipe.filter((u) => heroi(e, u)) : [];
    const resto = e.herois.filter((h) => !ids.includes(h.uid)).sort((a, b) => poder(b) - poder(a));
    // um herói por definição na equipe
    const defsUsadas = new Set(ids.map((u) => heroi(e, u).def));
    for (const h of resto) {
      if (ids.length >= 6) break;
      if (defsUsadas.has(h.def)) continue;
      ids.push(h.uid); defsUsadas.add(h.def);
    }
    e.equipe = ids;
  }
  function posicoes(e) {
    // frente: até 2 heróis de função de frente; o resto atrás
    const hs = e.equipe.map((u) => heroi(e, u)).filter(Boolean);
    const frente = hs.filter((h) => FUNCOES[DEFS[h.def].funcao].frente).slice(0, 2);
    const tras = hs.filter((h) => !frente.includes(h));
    while (frente.length < 2 && tras.length) frente.push(tras.shift());
    return { frente, tras };
  }

  // ---------- Fases ----------
  const MONSTROS = {
    floresta: { nome: 'Espinhoso', funcao: 'arqueiro' },
    fortaleza: { nome: 'Golem de Pedra', funcao: 'tanque' },
    abismo: { nome: 'Lodo Abissal', funcao: 'mago' },
    sombra: { nome: 'Espectro', funcao: 'assassino' },
    luz: { nome: 'Sentinela Caída', funcao: 'suporte' },
    trevas: { nome: 'Cria da Fenda', funcao: 'guerreiro' },
  };
  const TOTAL_FASES = 30;
  // força dos inimigos: acompanha o nível que o jogador precisa ter (~3,5 níveis por fase)
  let K = { base: 0.5, nvPorFase: 3.5, cap: 0.12 };
  function forcaFase(n) { const cap = Math.ceil(n / 10) - 1; return K.base * (1 + 0.06 * (K.nvPorFase * n - 1)) * (1 + K.cap * cap); }
  function infoFase(n) { // n = 1..30
    const cap = Math.ceil(n / 10);
    const chefe = n % 10 === 0;
    const qtd = n <= 2 ? 3 : n <= 5 ? 4 : n <= 8 ? 5 : 6;
    return { n, cap, idx: ((n - 1) % 10) + 1, chefe, qtd, nome: 'Capítulo ' + cap + ' · Fase ' + (((n - 1) % 10) + 1) };
  }
  function inimigosDaFase(n) {
    const info = infoFase(n);
    const r = criaRng(n * 977 + 13);
    const facsCap = [['floresta', 'abismo'], ['fortaleza', 'sombra', 'abismo'], ['sombra', 'trevas', 'luz', 'floresta']][info.cap - 1];
    const forca = forcaFase(n);
    const lista = [];
    for (let i = 0; i < info.qtd; i++) {
      const fac = escolhe(facsCap, r);
      const mo = MONSTROS[fac];
      const f = FUNCOES[mo.funcao];
      const chefe = info.chefe && i === 0;
      const m = forca * (chefe ? 2.0 : 1) * (0.92 + r() * 0.16);
      lista.push({
        nome: chefe ? 'Chefe ' + mo.nome : mo.nome, fac, funcao: mo.funcao, chefe, monstro: true,
        hp: Math.round(f.hp * m), atk: Math.round(f.atk * m), def: Math.round(f.def * Math.sqrt(m)), vel: f.vel - 5,
      });
    }
    // frente: tanques/guerreiros primeiro
    lista.sort((a, b) => (FUNCOES[b.funcao].frente ? 1 : 0) - (FUNCOES[a.funcao].frente ? 1 : 0));
    return lista;
  }
  function recompensaFase(n) {
    return { ouro: 60 + n * 25, xp: 40 + n * 18, gemas: infoFase(n).chefe ? 150 : 50, pergC: n % 3 === 0 ? 2 : 0, pergP: infoFase(n).chefe ? 1 : 0 };
  }

  // ---------- Combate ----------
  function unidade(lado, pos, base) {
    return {
      lado, pos, frente: pos < 2, nome: base.nome, fac: base.fac, funcao: base.funcao, chefe: !!base.chefe,
      def: base.def, atk: base.atk, vel: base.vel, hpMax: base.hp, hp: base.hp, en: 0, escudo: 0,
      ref: base.ref,
    };
  }
  function montaLado(e) {
    const p = posicoes(e);
    const hs = [...p.frente, ...p.tras];
    return hs.map((h, i) => {
      const d = DEFS[h.def], a = atributos(h);
      return unidade(0, i, { nome: d.nome, fac: d.fac, funcao: d.funcao, ...a, ref: h.def });
    });
  }
  function batalha(time, inimigos, seed) {
    const r = criaRng(seed);
    const A = time.map((u, i) => ({ ...u, id: 'a' + i }));
    const B = inimigos.map((m, i) => ({ ...unidade(1, i, m), id: 'b' + i }));
        const eventos = [];
    const vivos = (l) => l.filter((u) => u.hp > 0);
    const inimigosDe = (u) => vivos(u.lado === 0 ? B : A);
    const aliadosDe = (u) => vivos(u.lado === 0 ? A : B);
    function alvoBasico(u) {
      const ini = inimigosDe(u);
      if (u.funcao === 'assassino') return [...ini].sort((a, b) => a.hp - b.hp)[0];
      const fr = ini.filter((x) => x.frente);
      return escolhe(fr.length ? fr : ini, r);
    }
    function golpe(u, alvo, pct) {
      let dano = u.atk * pct * (100 / (100 + alvo.def)) * (0.9 + r() * 0.2);
      const vant = temVantagem(u.fac, alvo.fac);
      if (vant) dano *= 1.3;
      const crit = r() < 0.15;
      if (crit) dano *= 1.5;
      if (alvo.escudo > 0) dano *= 0.6;
      dano = Math.max(1, Math.round(dano));
      alvo.hp = Math.max(0, alvo.hp - dano);
      alvo.en = Math.min(100, alvo.en + 10);
      return { alvo: alvo.id, dano, crit, vant, morreu: alvo.hp === 0 };
    }
    let rodada = 0;
    while (rodada < 15 && vivos(A).length && vivos(B).length) {
      rodada++;
      eventos.push({ t: 'rodada', n: rodada });
      // turnos por equipe: primeiro toda a equipe do jogador, depois toda a equipe inimiga.
      // Dentro de cada equipe, quem tem mais velocidade age primeiro.
      const ordemDe = (l) => vivos(l).sort((a, b) => b.vel - a.vel || r() - 0.5);
      const ordem = [...ordemDe(A).map((u) => ['A', u]), ...ordemDe(B).map((u) => ['B', u])];
      let ladoAtual = null;
      for (const [lado, u] of ordem) {
        if (u.hp <= 0) continue;
        if (lado !== ladoAtual) { ladoAtual = lado; eventos.push({ t: 'lado', lado: lado === 'A' ? 0 : 1 }); }
        if (!vivos(A).length || !vivos(B).length) break;
        if (u.escudo > 0) u.escudo--;
        const ev = { t: 'acao', de: u.id, hab: false, golpes: [], curas: [] };
        if (u.en >= 100) {
          ev.hab = true; ev.nomeHab = u.monstro ? 'Fúria' : FUNCOES[u.funcao].hab;
          u.en = 0;
          const ini = inimigosDe(u);
          if (u.funcao === 'guerreiro') ev.golpes.push(golpe(u, alvoBasico(u), 2.2));
          else if (u.funcao === 'tanque') { ev.golpes.push(golpe(u, alvoBasico(u), 1.3)); u.escudo = 2; ev.escudo = true; }
          else if (u.funcao === 'mago') ini.forEach((x) => ev.golpes.push(golpe(u, x, 1.1)));
          else if (u.funcao === 'arqueiro') for (let i = 0; i < 3; i++) { const v = inimigosDe(u); if (v.length) ev.golpes.push(golpe(u, escolhe(v, r), 0.9)); }
          else if (u.funcao === 'assassino') ev.golpes.push(golpe(u, [...ini].sort((a, b) => a.hp - b.hp)[0], 2.8));
          else if (u.funcao === 'suporte') aliadosDe(u).forEach((x) => { const c = Math.round(u.atk * 1.5); const antes = x.hp; x.hp = Math.min(x.hpMax, x.hp + c); ev.curas.push({ alvo: x.id, cura: x.hp - antes }); });
        } else {
          ev.golpes.push(golpe(u, alvoBasico(u), 1));
          u.en = Math.min(100, u.en + 50);
        }
        eventos.push(ev);
      }
    }
    const venceu = vivos(B).length === 0 && vivos(A).length > 0;
    return { venceu, rodadas: rodada, eventos, A: A.map(limpa), B: B.map(limpa) };
  }
  const limpa = (u) => ({ id: u.id, nome: u.nome, fac: u.fac, funcao: u.funcao, chefe: u.chefe, hpMax: u.hpMax, frente: u.frente, ref: u.ref, monstro: u.lado === 1 });

  function lutarFase(e, n) {
    const res = batalha(montaLado(e), inimigosDaFase(n), e.seed + n * 31);
    e.seed = (e.seed * 48271 + 11) >>> 0;
    let rec = null;
    if (res.venceu && n === e.fase + 1) {
      rec = recompensaFase(n);
      e.ouro += rec.ouro; e.xp += rec.xp; e.gemas += rec.gemas; e.pergC += rec.pergC; e.pergP += rec.pergP;
      e.fase = n;
    }
    return { ...res, rec };
  }

  // ---------- AFK ----------
  const AFK_MAX_MIN = 12 * 60;
  function taxaAfk(e) { const s = Math.max(1, e.fase); return { ouro: 5 + 2 * s, xp: 4 + 1.5 * s }; }
  function afkPendente(e, agora = Date.now()) {
    const min = Math.min(AFK_MAX_MIN, Math.max(0, (agora - e.ultimoAfk) / 60000));
    const t = taxaAfk(e);
    return { min, ouro: Math.floor(t.ouro * min), xp: Math.floor(t.xp * min), cheio: min >= AFK_MAX_MIN };
  }
  function coletaAfk(e, agora = Date.now()) {
    const p = afkPendente(e, agora);
    e.ouro += p.ouro; e.xp += p.xp; e.ultimoAfk = agora;
    return p;
  }

  // ---------- Subir nível ----------
  function podeSubir(e, h) {
    if (h.nv >= NIVEL_MAX[h.est]) return { ok: false, motivo: 'Nível máximo para ' + h.est + '★. Evolua para subir mais.' };
    const c = custoNivel(h.nv);
    if (e.ouro < c.ouro || e.xp < c.xp) return { ok: false, motivo: 'Faltam recursos.', custo: c };
    return { ok: true, custo: c };
  }
  function subirNivel(e, uid) {
    const h = heroi(e, uid); const p = podeSubir(e, h);
    if (!p.ok) return p;
    e.ouro -= p.custo.ouro; e.xp -= p.custo.xp; h.nv++;
    return { ok: true };
  }

  // ---------- Invocação ----------
  const CHANCE_COMUM = { 1: 40, 2: 35, 3: 20, 4: 4.5, 5: 0.5 };
  const CHANCE_PREMIUM = { 3: 60, 4: 35, 5: 5 };
  const CUSTO_PREMIUM = 250;
  const PITY = 40;
  function heroiDe(est, r) {
    if (est === 5) {
      const rar = sorteia(Object.fromEntries(Object.entries(RARIDADES).map(([k, v]) => [k, v.chance])), r);
      return escolhe(CAMPEOES.filter((c) => c.rar === rar), r).id;
    }
    return 'rec_' + escolhe(FAC_COMUNS, r) + '_' + est;
  }
  function invocar(e, tipo, qtd) {
    const r = rngDo(e);
    const res = [];
    for (let i = 0; i < qtd; i++) {
      if (tipo === 'comum') {
        if (e.pergC < 1) break;
        e.pergC--;
        const est = +sorteia(CHANCE_COMUM, r);
        res.push(criaHeroi(e, heroiDe(est, r), est));
      } else {
        if (e.pergP >= 1) e.pergP--;
        else if (e.gemas >= CUSTO_PREMIUM) e.gemas -= CUSTO_PREMIUM;
        else break;
        let est = +sorteia(CHANCE_PREMIUM, r);
        e.pity++;
        if (e.pity >= PITY) est = 5;
        // pacote de 10 garante pelo menos um 4★
        if (qtd === 10 && i === 9 && est < 4 && !res.some((h) => h.est >= 4)) est = 4;
        if (est === 5) e.pity = 0;
        res.push(criaHeroi(e, heroiDe(est, r), est));
      }
    }
    autoEquipe(e, true);
    return res;
  }
  // chances finais de cada herói 5★ na premium (para mostrar ao jogador)
  function chancesDetalhadas() {
    const p5 = CHANCE_PREMIUM[5];
    return CAMPEOES.map((c) => {
      const mesmos = CAMPEOES.filter((x) => x.rar === c.rar).length;
      return { nome: c.nome, rar: RARIDADES[c.rar].nome, chance: (p5 * RARIDADES[c.rar].chance) / 100 / mesmos };
    });
  }

  // ---------- Fusão ----------
  function regraFusao(h) {
    const d = DEFS[h.def];
    if (h.est >= ESTRELA_MAX[d.origem]) return null;
    if (h.est <= 2) return { copias: 1, mesmaFac: 0 };
    if (h.est === 3) return { copias: 0, mesmaFac: 2 };
    return { copias: 1, mesmaFac: 2 }; // 4★→5★ e 5★→6★
  }
  // Escolhe material automaticamente, preferindo recrutas e os mais fracos; nunca usa heróis da equipe se houver alternativa.
  function planoFusao(e, uid) {
    const h = heroi(e, uid);
    const regra = regraFusao(h);
    if (!regra) return { ok: false, motivo: 'Este herói já está na estrela máxima.' };
    const d = DEFS[h.def];
    const usados = new Set([uid]);
    const ordem = (a, b) => (e.equipe.includes(a.uid) ? 1 : 0) - (e.equipe.includes(b.uid) ? 1 : 0) || a.nv - b.nv;
    const copias = e.herois.filter((x) => !usados.has(x.uid) && x.def === h.def && x.est === h.est).sort(ordem).slice(0, regra.copias);
    copias.forEach((x) => usados.add(x.uid));
    const mat = e.herois.filter((x) => !usados.has(x.uid) && DEFS[x.def].fac === d.fac && x.est === h.est)
      .sort((a, b) => (DEFS[b.def].recruta ? 1 : 0) - (DEFS[a.def].recruta ? 1 : 0) || ordem(a, b)).slice(0, regra.mesmaFac);
    const ok = copias.length === regra.copias && mat.length === regra.mesmaFac;
    const falta = [];
    if (copias.length < regra.copias) falta.push((regra.copias - copias.length) + ' cópia de ' + d.nome + ' ' + h.est + '★');
    if (mat.length < regra.mesmaFac) falta.push((regra.mesmaFac - mat.length) + ' herói(s) ' + h.est + '★ de ' + FACCOES[d.fac].nome);
    return { ok, regra, copias, mat, falta, motivo: ok ? '' : 'Falta: ' + falta.join(' e ') + '.' };
  }
  function evoluir(e, uid) {
    const p = planoFusao(e, uid);
    if (!p.ok) return p;
    const rem = new Set([...p.copias, ...p.mat].map((x) => x.uid));
    // o nível mais alto entre os usados é mantido
    const h = heroi(e, uid);
    [...p.copias, ...p.mat].forEach((x) => { if (x.nv > h.nv) h.nv = x.nv; });
    e.herois = e.herois.filter((x) => !rem.has(x.uid));
    e.equipe = e.equipe.filter((u) => !rem.has(u));
    h.est++;
    h.nv = Math.min(h.nv, NIVEL_MAX[h.est]);
    autoEquipe(e, true);
    return { ok: true, heroi: h };
  }
  // Funde automaticamente todos os 1★ e 2★ em pares
  function fundirBasicos(e) {
    let n = 0, mudou = true;
    while (mudou) {
      mudou = false;
      for (const h of [...e.herois].sort((a, b) => a.est - b.est)) {
        if (h.est > 2 || !heroi(e, h.uid)) continue;
        const par = e.herois.find((x) => x.uid !== h.uid && x.def === h.def && x.est === h.est && !e.equipe.includes(x.uid));
        if (par && !e.equipe.includes(h.uid)) { evoluir(e, h.uid); n++; mudou = true; break; }
      }
    }
    return n;
  }

  // ---------- Salvamento ----------
  function serializa(e) { return JSON.stringify(e); }
  function carrega(txt) {
    try {
      const e = JSON.parse(txt);
      if (!e || e.v !== VERSAO || !Array.isArray(e.herois)) return null;
      return e;
    } catch (_) { return null; }
  }

  const API = {
    FACCOES, FAC_COMUNS, VENCE, FUNCOES, RARIDADES, CAMPEOES, DEFS, NIVEL_MAX, ESTRELA_MAX, TOTAL_FASES,
    CHANCE_COMUM, CHANCE_PREMIUM, CUSTO_PREMIUM, PITY, AFK_MAX_MIN,
    temVantagem, atributos, poder, custoNivel, novoEstado, heroi, autoEquipe, posicoes,
    infoFase, inimigosDaFase, recompensaFase, montaLado, batalha, lutarFase,
    taxaAfk, afkPendente, coletaAfk, podeSubir, subirNivel, invocar, chancesDetalhadas,
    forcaFase, ajustaFases: (k) => Object.assign(K, k),
    regraFusao, planoFusao, evoluir, fundirBasicos, serializa, carrega, criaRng,
  };
  root.TL = API;
  if (typeof module !== 'undefined') module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
