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
- Pode aparecer uma **barra de endereço** do navegador no topo. É normal neste teste: some quando colocarmos o arquivo `assetlinks.json` na raiz do domínio. No GitHub Pages isso exige um segundo repositório chamado `lucas2015alcara-dot.github.io` (ou um domínio próprio). Fazemos isso perto da publicação.
- Funciona sem internet depois de aberto uma vez (as fontes podem trocar pela fonte padrão offline).

## Para atualizar o jogo depois
Não precisa gerar o app de novo para cada mudança: o app abre o site, então basta o Claude atualizar o repositório. Gerar de novo só quando mudar ícone, nome ou na hora de publicar.
