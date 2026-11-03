# Fase 3 — do repositório até o celular

## 1. Ligar o GitHub Pages (uma vez só)
1. No navegador, abra github.com/lucas2015alcara-dot/taverna-idle.
2. Toque em **Settings** (se não aparecer, use o menu "⋯" ou peça a versão para computador no navegador).
3. No menu, toque em **Pages**.
4. Em **Build and deployment → Source**, deixe **Deploy from a branch**.
5. Em **Branch**, escolha **main** e a pasta **/ (root)**. Toque em **Save**.
6. Espere 1 a 3 minutos. O jogo fica em: **https://lucas2015alcara-dot.github.io/taverna-idle/**

Teste: abra o link no Chrome do celular. Ele deve abrir o jogo direto.

## 2. Gerar o app no PWABuilder
1. Abra **pwabuilder.com** no Chrome.
2. Cole o link do jogo e toque em **Start**.
3. Ignore os avisos do relatório (são sugestões) e toque em **Package for stores**.
4. Escolha **Android** (Google Play).
5. Nas opções:
   - **Package ID**: para este teste, pode deixar o sugerido. O definitivo escolhemos na publicação, junto com o nome do estúdio.
   - **App name**: Taverna Idle.
   - **Signing key**: **New** (primeira vez).
6. Toque em **Download** e salve o arquivo .zip.

## 3. Guardar a chave (importante)
Dentro do .zip vem a **chave de assinatura** (arquivo `.keystore`) e um arquivo de texto com as senhas.
**Guarde o .zip inteiro num lugar seguro** (Google Drive, por exemplo). Para o teste não faz diferença, mas na versão que for para a Play Store, perder a chave significa nunca mais conseguir atualizar o app.

## 4. Instalar no celular
1. Abra o .zip pelo app de arquivos do celular e extraia.
2. Toque no arquivo **.apk**.
3. O Android vai pedir permissão para "instalar apps desconhecidos" do app de arquivos ou do Chrome: permita só para esta instalação.
4. Abra o **Taverna Idle** pela tela inicial.

## O que é esperado neste teste
- O jogo abre em tela cheia e deitado.
- **Barra do navegador:** resolvida com `.well-known/assetlinks.json` no repositório `lucas2015alcara-dot.github.io` (raiz do domínio). Pacote do teste: `io.github.lucas2015alcara_dot.twa`. Se gerar o app com outra chave ou outro pacote, atualizar esse arquivo. Na Play Store, adicionar também a impressão digital do Google (Play Console → App integrity → App signing).
- Funciona sem internet depois de aberto uma vez (as fontes podem trocar pela fonte padrão offline).

## Na próxima vez que gerar o app
- Use o link direto: https://lucas2015alcara-dot.github.io/taverna-idle/game/app.html
- Apague o campo **Monochrome icon URL** e use **BR** em Key country code.
- Se aparecer um campo **Orientation**, escolha **Landscape**. O jogo já trava deitado sozinho, mas assim fica garantido.

## Para atualizar o jogo depois
Não precisa gerar o app de novo para cada mudança: o app abre o site, então basta o Claude atualizar o repositório. O app confere se há versão nova ao abrir, ao voltar do segundo plano e a cada 30 minutos; quando há, aparece o aviso "Nova versão disponível — Toque para atualizar". Gerar de novo só quando mudar ícone, nome ou na hora de publicar.

## Outras lojas e testes (pesquisa de 02/11/2026)
- Desde 30/09/2026 (Brasil na primeira fase), celulares Android certificados só instalam apps de desenvolvedores verificados pelo Google, venha o app de qualquer loja ou APK. Conta completa: US$ 25. Conta gratuita (estudante/hobby): até 20 aparelhos.
- Xiaomi GetApps pede verificação com documentos; Samsung Galaxy Store exige status de vendedor comercial e DUNS. Amazon fechou a loja para celulares Android em 2025.
- Teste grátis: mandar o link do GitHub Pages e instalar pelo Chrome ("Adicionar à tela inicial"); não é APK, não depende da verificação.
- Portais web (Playgama, CrazyGames, GameDistribution, itch.io): exigem versão própria com o SDK do portal e sem invocação paga. Fica para depois.
- TikTok Minis (pesquisa de 02/11/2026): conta por organização e verificação de empresa registrada para monetizar; não aceita jogo em HTML/DOM (só Cocos Creator, LayaAir ou Unity), pacote até 30 MB com principal de 4 MB. Brasil liberado sem requisito extra. Decisão: usar o TikTok só para divulgar (vídeos de invocação, ultimates, evolução) com link na bio.
