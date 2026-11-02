"""Gera game/app.html (página completa para o GitHub Pages / app Android) a partir de game/index.html.
Rodar depois de qualquer mudança no index.html:  python3 tools/gera-app.py
"""
import pathlib, re, json, hashlib
raiz = pathlib.Path(__file__).resolve().parent.parent
jogo = raiz / 'game'
corpo = (jogo / 'index.html').read_text(encoding='utf-8')
titulo = re.search(r'<title>(.*?)</title>', corpo).group(1)
corpo = re.sub(r'<title>.*?</title>\n?', '', corpo, count=1)
corpo = corpo.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '')
# separa o que vai no <head> (fontes e estilo) do resto
cabeca_extra = []
for padrao in (r'<link rel="preconnect"[^>]*>\n?', r'<link rel="stylesheet"[^>]*>\n?', r'<style>[\s\S]*?</style>\n?'):
    m = re.search(padrao, corpo)
    if m:
        cabeca_extra.append(m.group(0).strip()); corpo = corpo.replace(m.group(0), '', 1)
# versão do cache = hash dos arquivos do jogo
arquivos = ['app.html', 'logic.js', 'manifest.webmanifest'] + sorted('assets/' + p.name for p in (jogo / 'assets').iterdir())
h = hashlib.sha1(((jogo / 'index.html').read_text(encoding='utf-8') + (jogo / 'logic.js').read_text(encoding='utf-8') + pathlib.Path(__file__).read_text(encoding='utf-8')).encode()).hexdigest()[:10]
html = f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{titulo}</title>
<meta name="theme-color" content="#16130E">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icones/icone-192.png">
<link rel="apple-touch-icon" href="icones/icone-192.png">
{chr(10).join(cabeca_extra)}
</head>
<body>
{corpo.strip()}
<div id="gire" aria-live="polite"><div>Gire o celular<br><small>A Taverna se joga deitada.</small></div></div>
<style>
#gire {{ position: fixed; inset: 0; z-index: 99; display: none; align-items: center; justify-content: center; text-align: center;
  background: #16130E; color: #EFE7D6; font: 600 22px "Alegreya SC", Georgia, serif; padding: 24px; }}
#gire small {{ font: 400 14px "Work Sans", system-ui, sans-serif; color: #A99C84; }}
@media (orientation: portrait) {{ #gire {{ display: flex; }} }}
</style>
<script>
// trava a tela deitada no app instalado; no navegador comum, o aviso "Gire o celular" cobre a tela em pé
(function () {{
  const trava = () => {{ try {{ const p = screen.orientation && screen.orientation.lock && screen.orientation.lock('landscape'); if (p && p.catch) p.catch(() => {{}}); }} catch (_) {{}} }};
  trava();
  addEventListener('pointerdown', trava, {{ once: true }});
  document.addEventListener('visibilitychange', () => {{ if (!document.hidden) trava(); }});
}})();
if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {{}}));
</script>
</body>
</html>
'''
(jogo / 'app.html').write_text(html, encoding='utf-8')
sw = f'''// gerado por tools/gera-app.py — não editar à mão
const CACHE = 'taverna-{h}';
const ARQUIVOS = {json.dumps(['./'] + arquivos + ['icones/icone-192.png', 'icones/icone-512.png'], ensure_ascii=False)};
self.addEventListener('install', (e) => {{ e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())); }});
self.addEventListener('activate', (e) => {{ e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); }});
self.addEventListener('fetch', (e) => {{
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, {{ ignoreSearch: true }}).then((r) => r || fetch(e.request).then((resp) => {{
    if (resp.ok && new URL(e.request.url).origin === location.origin) {{ const copia = resp.clone(); caches.open(CACHE).then((c) => c.put(e.request, copia)); }}
    return resp;
  }}).catch(() => caches.match('app.html'))));
}});
'''
(jogo / 'sw.js').write_text(sw, encoding='utf-8')
print('app.html e sw.js gerados, cache', h)
