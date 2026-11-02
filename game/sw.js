// gerado por tools/gera-app.py — não editar à mão
const CACHE = 'taverna-5821781bf4';
const ARQUIVOS = ["./", "app.html", "logic.js", "manifest.webmanifest", "assets/brutus-q1.webp", "assets/brutus-q2.webp", "assets/brutus-q3.webp", "assets/brutus-q4.webp", "assets/brutus.webp", "assets/cenario-clareira.webp", "assets/fen-q1.webp", "assets/fen-q2.webp", "assets/fen-q3.webp", "assets/fen-q4.webp", "assets/fen.webp", "assets/mon-cria.webp", "assets/mon-espectro.webp", "assets/mon-espinhoso.webp", "assets/mon-golem.webp", "assets/mon-lodo.webp", "assets/mon-sentinela.webp", "assets/morgrath-q1.webp", "assets/morgrath-q2.webp", "assets/morgrath-q3.webp", "assets/morgrath-q4.webp", "assets/morgrath.webp", "assets/ondina-q1.webp", "assets/ondina-q2.webp", "assets/ondina-q3.webp", "assets/ondina-q4.webp", "assets/ondina.webp", "assets/rec-abismo.webp", "assets/rec-floresta.webp", "assets/rec-fortaleza.webp", "assets/rec-sombra.webp", "assets/rosa-q1.webp", "assets/rosa-q2.webp", "assets/rosa-q3.webp", "assets/rosa-q4.webp", "assets/rosa.webp", "assets/vex-q1.webp", "assets/vex-q2.webp", "assets/vex-q3.webp", "assets/vex-q4.webp", "assets/vex.webp", "icones/icone-192.png", "icones/icone-512.png"];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((r) => r || fetch(e.request).then((resp) => {
    if (resp.ok && new URL(e.request.url).origin === location.origin) { const copia = resp.clone(); caches.open(CACHE).then((c) => c.put(e.request, copia)); }
    return resp;
  }).catch(() => caches.match('app.html'))));
});
