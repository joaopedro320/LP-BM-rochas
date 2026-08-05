# BM Rochas | Landing Page

Site estático, sem build e sem dependência de framework. É só subir a pasta.

## Estrutura

```
index.html          página inteira (HTML, CSS e JS no mesmo arquivo)
assets/             imagens em WebP e as duas versões da logo
og.jpg              imagem de compartilhamento (1200x630)
favicon.png
vercel.json         cache dos assets
apps-script.gs      código do Google Apps Script que recebe os leads
```

## Deploy na Vercel

**Pelo painel:** New Project > Deploy sem repositório > arraste esta pasta. Framework Preset: `Other`. Build Command: vazio. Output Directory: vazio (raiz).

**Pela CLI:**

```bash
cd bm-rochas-vercel
vercel --prod
```

Depois é só apontar o domínio em Settings > Domains.

## Antes de publicar, trocar 3 coisas no index.html

1. **GTM**: no `<head>` tem o comentário `<!-- GTM: cole o container aqui -->`. Cole o script do container e o `<noscript>` logo depois da abertura do `<body>`.
2. **ENDPOINT**: no final do `<script>`, a constante `var ENDPOINT = ""`. Cole a URL `/exec` do Apps Script (instruções dentro do `apps-script.gs`). Enquanto estiver vazia, o formulário continua funcionando e mandando para o WhatsApp, só não grava na planilha.
3. **Domínio**: o `<link rel="canonical">` e a `og:image` estão em `https://www.bmrochas.com.br/`. Ajuste para o domínio final.

## Eventos disparados no dataLayer

| Evento | Quando |
|---|---|
| `click_whatsapp_header` | botão do topo |
| `click_whatsapp_hero` | botão principal da primeira dobra |
| `click_whatsapp_fase` | botões dentro de "em que fase da sua obra você está" |
| `click_whatsapp_arquitetos` | bloco de parceria |
| `click_whatsapp_contato` | telefone na seção de contato |
| `click_whatsapp_flutuante` | botão flutuante |
| `submit_formulario` | envio do formulário (traz `fase` e `ambiente`) |
| `scroll_75` | leitura de 75% da página |

## Regras do formulário

O botão fica travado até o visitante preencher nome completo (com sobrenome), WhatsApp com no mínimo 10 dígitos e cidade. Fase da obra e ambiente já vêm preenchidos com a primeira opção. Ao enviar, grava na planilha e leva para o WhatsApp com os dados no corpo da mensagem.

## Onde mexer no conteúdo

- **Telefone**: buscar por `5527999100504` no index.html (aparece nos links) e `(27) 99910-0504` (texto visível).
- **Trocar uma foto**: substituir o arquivo dentro de `assets/` mantendo o mesmo nome. `hero.webp` é a primeira dobra em desktop, `hero_m.webp` a versão vertical de celular, `p0` a `p13` são a galeria.
- **Bloco de avaliações**: ainda não existe, porque não há link do Google Meu Negócio. Quando tiver, o lugar natural é entre a seção de dúvidas e a de contato.
