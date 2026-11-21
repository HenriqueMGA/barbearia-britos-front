# Britos Barbearia — Site (frontend)

Site institucional da **Britos Barbearia**, no Jardim Nordeste (Arthur Alvim), São Paulo/SP. Tem uma landing page e páginas de apoio: planos de assinatura, serviços avulsos, endereço, galeria de cortes, produtos, marcas parceiras e **agendamento online**, com o WhatsApp como canal alternativo.

É um projeto **estático**: HTML, CSS e JavaScript puro, sem framework e sem etapa de build. O agendamento consome a API do backend, que fica em outro repositório.

---

## Sumário

1. [Dados do negócio](#1-dados-do-negócio)
2. [Tecnologias e serviços externos](#2-tecnologias-e-serviços-externos)
3. [Estrutura de pastas](#3-estrutura-de-pastas)
4. [Páginas](#4-páginas)
5. [Seções da página inicial](#5-seções-da-página-inicial)
6. [CSS](#6-css)
7. [JavaScript](#7-javascript)
8. [Agendamento online e API](#8-agendamento-online-e-api)
9. [Formulário de atendimento (SAC)](#9-formulário-de-atendimento-sac)
10. [Acessibilidade](#10-acessibilidade)
11. [Performance e SEO](#11-performance-e-seo)
12. [Como rodar localmente](#12-como-rodar-localmente)
13. [Como publicar](#13-como-publicar)
14. [Guia de manutenção](#14-guia-de-manutenção)
15. [Pendências antes de ir ao ar](#15-pendências-antes-de-ir-ao-ar)
16. [Limitações conhecidas](#16-limitações-conhecidas)
17. [Direitos de imagem e marcas](#17-direitos-de-imagem-e-marcas)

---

## 1. Dados do negócio

| Item | Valor |
|---|---|
| Nome | Britos Barbearia |
| Endereço | Rua Brook Taylor, 471 — Jardim Nordeste (Arthur Alvim) |
| Coordenadas | -23.5539, -46.4592 |
| WhatsApp / telefone | (11) 96146-7020 (`https://wa.me/5511961467020`) |
| Instagram | @britos_barbearia_ |
| E-mail do SAC | sac@britosbarbearia.com.br |
| Domínio | https://barbearia-britos.vercel.app |

Esses dados se repetem em vários arquivos (cabeçalho, "Onde estamos", rodapé, SAC, páginas legais). Para trocar algum, veja o [guia de manutenção](#14-guia-de-manutenção).

---

## 2. Tecnologias e serviços externos

**Linguagens:** HTML5, CSS3 (variáveis, grid, flexbox, `clip-path`, `mask-image`, `aspect-ratio`) e JavaScript (ES5/ES6), sem dependências próprias.

| Serviço | Para quê | Onde |
|---|---|---|
| API Britos (Vercel) | Serviços, barbeiros, horários livres e criação de agendamentos | `assets/js/agendamento.js` |
| Google Fonts | *Big Shoulders Display* (títulos) e *Montserrat* (texto) | `<head>` de todas as páginas |
| cdnjs (Cloudflare) | **three.js r128** (elementos 3D) | script no fim do `index.html` |
| FormSubmit | Recebe o formulário do SAC e envia por e-mail | `sac.html` |
| WhatsApp (`wa.me`) | Botões dos planos e botão flutuante | todas as páginas |
| Instagram / Google Maps | Links externos | `index.html`, `sac.html`, rodapé |

O site **não** usa cookies de publicidade nem analytics (isso está declarado na Política de Privacidade; se adicionar, atualize o texto).

---

## 3. Estrutura de pastas

```
├── index.html              Página principal (landing page)
├── sac.html                Atendimento ao cliente (contatos + formulário)
├── privacidade.html        Política de Privacidade (LGPD)
├── termos.html             Termos de Uso
├── acessibilidade.html     Declaração de acessibilidade
├── 404.html                Página "não encontrada"
├── robots.txt              Regras para buscadores + endereço do sitemap
├── sitemap.xml             Lista das páginas para o Google
└── assets/
    ├── css/
    │   ├── site.css        Base comum + páginas internas
    │   └── home.css        Seções da página inicial
    ├── js/
    │   ├── hero-3d.js      Modelos 3D (placa, pomada, óleo, shampoo) com three.js
    │   └── agendamento.js  Modal de agendamento integrado à API
    └── img/
        ├── emblema-branco.png, logo-branco.png
        ├── fachada.webp, barbeiro-atendimento.webp
        ├── og-image.jpg              Prévia de compartilhamento (1200×630)
        ├── galeria/                  cabelo-1 … cabelo-6 (.webp usados; .jpg são os originais)
        └── parceiros/                Logos das marcas (.webp)
```

---

## 4. Páginas

| Página | Objetivo | CSS (nesta ordem) |
|---|---|---|
| `index.html` | Landing page com todas as seções | site, home |
| `sac.html` | Canais de contato e formulário de SAC | site |
| `privacidade.html` | Política de Privacidade (LGPD) | site |
| `termos.html` | Termos de Uso | site |
| `acessibilidade.html` | Compromisso e limitações de acessibilidade | site |
| `404.html` | Erro de página não encontrada (`noindex`) | site |

Todas compartilham o cabeçalho, o rodapé com links legais e o botão flutuante do WhatsApp.

---

## 5. Seções da página inicial

| # | Seção | Âncora | Conteúdo |
|---|---|---|---|
| 1 | Cabeçalho | — | Emblema + "Britos" e menu |
| 2 | Hero | `#topo` | Wordmark, **placa 3D**, chamada e botões "Agende seu horário" / "Ver planos" |
| 3 | Planos | `#planos` | Corte (R$ 60), Corte + Barba (R$ 140, "Mais escolhido") e Master (R$ 219), com botão para o WhatsApp |
| 4 | Serviços avulsos | `#servicos` | Corte, Barba, Corte + Barba, Sobrancelha, Pézinho, Pigmentação |
| 5 | Agendamento online | `#agendamento` | Modal em 4 etapas (veja a [seção 8](#8-agendamento-online-e-api)) |
| 6 | Onde estamos | `#onde` | Fachada, endereço, telefone, mapa e cálculo de distância |
| 7 | Sobre | `#sobre` | Texto institucional e foto com animação de revelação |
| 8 | Galeria | `#galeria` | 6 fotos de cortes |
| 9 | Produtos | — | 3 produtos em 3D (itens e valores de exemplo) |
| 10 | Parceiros | `#parceiros` | Carrossel com 6 marcas |
| 11 | Fale com a gente | `#contato` | Instagram e SAC |
| 12 | Rodapé | `#rodape` | Logo, navegação, contato e links legais |

---

## 6. CSS

São **dois arquivos**, para reduzir requisições bloqueantes. Dentro deles, as partes são separadas por comentários `/* ===================== nome ===================== */`.

| Arquivo | Partes |
|---|---|
| `site.css` | base (variáveis, reset, tipografia, faixas `.dark / .slate / .light / .mist`, `.tri`) → header → components (`.btn`, `.wa-float`) → footer → paginas-texto → sac → erro-404 |
| `home.css` | hero → planos → servicos → agendamento → onde-estamos → sobre → produtos → galeria → parceiros |

**Tokens** (no `:root` de `site.css`): `--ink`, `--slate`, `--ash`, `--mist`, `--paper`, `--mute-paper`, `--display`, `--body`.

**Convenções:** breakpoints em 820 px e 760 px, medidas fluidas com `clamp()`, e respeito a `prefers-reduced-motion` e `hover: none`.

> Ao alterar um CSS ou JS, aumente o `?v=` no `<link>`/`<script>` (ex.: `?v=1` → `?v=2`) para o navegador não usar a versão em cache.

---

## 7. JavaScript

| Script | O que faz |
|---|---|
| Carregador do three.js (fim do `index.html`) | Espera o `load` e o navegador ficar ocioso, carrega o three.js do cdnjs e depois o `hero-3d.js`. Se falhar, o site funciona sem o 3D |
| `assets/js/hero-3d.js` | Monta uma cena em cada `<canvas data-model="plaque|jar|oil|shampoo">`. O objeto inclina seguindo o ponteiro, só anima quando visível e fica estático com "reduzir movimento" |
| Revelação do Sobre (fim do `index.html`) | `IntersectionObserver` adiciona `.is-visible` à imagem uma única vez |
| Distância (fim do `index.html`) | Usa `navigator.geolocation` e a fórmula de Haversine. A localização não sai do navegador |
| `assets/js/agendamento.js` | Modal de agendamento (veja a próxima seção) |

---

## 8. Agendamento online e API

O modal `#booking-modal` tem quatro etapas: **serviço e barbeiro → data e horário → dados de contato → revisão**.

### URL da API

Definida no topo de `assets/js/agendamento.js`:

| Onde o site está aberto | API usada |
|---|---|
| `localhost` ou `127.0.0.1` | `http://localhost:3000` (backend rodando localmente) |
| Qualquer outro endereço (inclusive `file://`) | `https://barbearia-britos-back.vercel.app` |

### Endpoints consumidos

| Método | Rota | Uso no front |
|---|---|---|
| `GET` | `/api/servicos` | Lista os serviços (`id`, `nome`, `preco`, `duracaoMinutos`) |
| `GET` | `/api/barbeiros?servico=<id>` | Barbeiros que fazem o serviço e seus dias de trabalho |
| `GET` | `/api/horarios-disponiveis?data=YYYY-MM-DD&servico=<id>&barbeiro=<nome>` | Horários livres no dia escolhido |
| `POST` | `/api/agendar` | Cria o agendamento com `nome`, `telefone`, `servico`, `barbeiro`, `data`, `hora`. Retorna `409` se o horário acabou de ser ocupado |

Durante o envio o botão fica desativado para evitar pedidos duplicados. Se der erro, os dados preenchidos são mantidos para o cliente tentar de novo. A data pode ser escolhida até 2 meses à frente.

A documentação completa da API (tabelas, expediente, folgas, rotas administrativas) está no README do repositório do backend.

---

## 9. Formulário de atendimento (SAC)

Em `sac.html`. Campos: nome, e-mail, telefone (opcional), assunto, mensagem e consentimento (obrigatório).

O `<form>` faz `POST` para `https://formsubmit.co/sac@britosbarbearia.com.br`, que encaminha por e-mail. Campos ocultos: `_subject`, `_template=table`, `_captcha=false` e `_honey` (isca contra spam).

**Ativação:** no **primeiro** envio, o FormSubmit manda um e-mail de confirmação para `sac@britosbarbearia.com.br`. As mensagens só começam a chegar depois que esse e-mail for confirmado. Faça um envio de teste logo após publicar.

---

## 10. Acessibilidade

- HTML semântico (`header`, `nav` com `aria-label`, `main`, `footer`) e foco visível em toda a navegação por teclado.
- `alt` nas imagens informativas; imagens decorativas e cópias do carrossel ficam escondidas de leitores de tela.
- Formulários com `<label>` associado e `autocomplete`.
- `prefers-reduced-motion` desliga o 3D, a revelação e o carrossel.
- O menu do celular usa `aria-expanded` e fecha com Esc.
- `scroll-padding-top` evita que o header fixo cubra os títulos.

Limitação declarada em `acessibilidade.html`: os elementos 3D podem não ser lidos por todos os leitores de tela.

---

## 11. Performance e SEO

**Performance**
- three.js (~600 KB) carregado só depois da página pronta.
- Imagens em WebP, com `loading="lazy"`, `decoding="async"` e `width`/`height` definidos.
- 2 folhas de estilo na home e 1 nas demais; fontes pedidas só com os pesos usados.
- Canvas 3D pausam fora da tela; `preconnect` para Google Fonts e cdnjs.

**SEO**
- `description`, `canonical` e Open Graph/Twitter nas páginas indexáveis (`og:image` = `assets/img/og-image.jpg`).
- `robots.txt` e `sitemap.xml` na raiz. Ao criar ou remover páginas, atualize o sitemap.
- A 404 tem `noindex`.
- O site está publicado em `https://barbearia-britos.vercel.app`. Se mudar de endereço (ex.: domínio próprio), troque-o nos `.html` (`canonical`, `og:*`, `twitter:image`), no `robots.txt` e no `sitemap.xml`. As imagens de compartilhamento precisam de URL absoluta.

---

## 12. Como rodar localmente

```bash
# na raiz deste repositório
python -m http.server 8000
# abra http://localhost:8000
```

Ou use a extensão **Live Server** do VS Code.

Aberto em `localhost`, o agendamento procura a API em `http://localhost:3000`, então é preciso rodar o backend junto (instruções no repositório do backend). Para testar contra a API de produção, abra o site por outro endereço (por exemplo o IP da máquina na rede) ou altere temporariamente a condição no topo de `agendamento.js`.

Abrindo o `index.html` com duplo clique (`file://`) o site funciona e usa a API de produção, mas o three.js e as fontes precisam de internet.

---

## 13. Como publicar

O site é estático e roda em **GitHub Pages, Netlify, Vercel, Cloudflare Pages** ou em qualquer hospedagem comum.

Checklist:

1. Confirmar que a API em `https://barbearia-britos-back.vercel.app` responde e aceita (CORS) o domínio do site.
2. Manter o `404.html` na raiz.
3. Fazer um envio de teste do SAC e confirmar o e-mail de ativação do FormSubmit.
4. Conferir os links do WhatsApp, do Instagram e do mapa.
5. Resolver as [pendências](#15-pendências-antes-de-ir-ao-ar).
6. Conferir o domínio em `canonical`, `og:*`, `robots.txt` e `sitemap.xml`, e enviar o sitemap ao Google Search Console.
7. Depois de publicar, testar a prévia de compartilhamento em https://developers.facebook.com/tools/debug/ (clicar em "Extrair novamente" limpa o cache usado pelo WhatsApp/Facebook).

---

## 14. Guia de manutenção

| Quero mudar… | Onde |
|---|---|
| Preços e planos | `index.html`, seções `#planos` e `#servicos` (os serviços do agendamento vêm da API/banco) |
| Telefone, endereço, Instagram | Buscar `96146-7020`, `5511961467020`, `Brook Taylor`, `britos_barbearia_` em todos os `.html` |
| Mensagem pronta do WhatsApp | Parâmetro `?text=` dos links `wa.me` (codificado em URL) |
| Foto da galeria | Salvar em `assets/img/galeria/` (~760 px, WebP), copiar um `<figure class="gallery-item">` e ajustar `src`, `alt`, `width`/`height` e `--pos` (enquadramento). Use múltiplos de 3 |
| Marcas parceiras | Logo em `assets/img/parceiros/`. Editar **os 3** `.marquee-group` do `#parceiros` (só o primeiro tem `alt`; os outros têm `aria-hidden="true"` e `alt=""`). Logo com letras brancas recebe a classe `is-dark` |
| Velocidade do carrossel | `home.css`, parte `parceiros`: `marquee-scroll 30s` e `--tile-w` |
| Cores e fontes | `:root` de `site.css` |
| Fotos do Sobre / fachada | Substituir `barbeiro-atendimento.webp` / `fachada.webp` e atualizar `width`/`height`/`alt` |
| Textos legais | `privacidade.html`, `termos.html`, `acessibilidade.html`, atualizando a data "Última atualização" |
| Modelos 3D | `assets/js/hero-3d.js`, objeto `builders` |
| URL da API | Topo de `assets/js/agendamento.js` (lembre de aumentar o `?v=` no `index.html`) |

---

## 15. Pendências antes de ir ao ar

- [ ] `privacidade.html`: trocar `[RAZÃO SOCIAL]` pela razão social (e CNPJ, se quiser).
- [ ] `termos.html`: trocar `[CIDADE/UF]` pela comarca do foro.
- [ ] Confirmar a ativação do FormSubmit e que o e-mail `sac@britosbarbearia.com.br` existe e é monitorado.
- [ ] Conferir se preços e planos são os oficiais (os produtos estão marcados como exemplo).
- [ ] Confirmar a autorização de uso dos logos das marcas parceiras e das fotos de clientes.
- [ ] Revisar com um profissional os textos de Privacidade (LGPD) e Termos de Uso, que são modelos.

---

## 16. Limitações conhecidas

- **O agendamento depende da API.** Se ela estiver fora do ar, o modal mostra erro; WhatsApp e SAC continuam funcionando. O pedido não processa pagamento.
- **3D** depende de WebGL e de internet (three.js vem do cdnjs). Sem isso, os canvas ficam vazios e o resto funciona.
- **Fontes** dependem do Google Fonts; sem internet, entram as fontes de reserva.
- **SAC** depende do FormSubmit (serviço gratuito, sem garantia de disponibilidade).
- Alguns **logos de parceiros** têm baixa resolução (250–320 px).

---

## 17. Direitos de imagem e marcas

- Fotos de clientes exigem **autorização de uso de imagem**.
- Os logos de Coca-Cola, Fanta, Sprite, Pepsi, Guaraná Antarctica e Heineken pertencem a seus titulares; use-os só com autorização para divulgar a parceria.
- Marca, logotipo, emblema, textos e fotos próprios pertencem à Britos Barbearia.
- three.js: licença MIT. Big Shoulders Display e Montserrat: SIL Open Font License.
