# FLIM — Festival Literário de Martins

Landing page do Festival Literário de Martins (RN). Site estático (HTML + CSS + JS), sem dependências de build.

## Como configurar

Edite o objeto `CONFIG` no início de `script.js`:

| Campo           | O que é                                              |
| --------------- | ---------------------------------------------------- |
| `FORM_URL`      | Link do formulário de inscrição (Google Forms etc.) |
| `EVENT_DATE`    | Data do evento exibida no topo                      |
| `EVENT_PLACE`   | Local do evento                                     |
| `CONTACT_EMAIL` | E-mail de contato no rodapé                         |

Todos os botões de inscrição usam `FORM_URL` automaticamente.

## Visualizar localmente

Abra `index.html` no navegador, ou rode:

```bash
python3 -m http.server 8000
```

e acesse http://localhost:8000.

## Publicação

Por ser estático, pode ser publicado diretamente no GitHub Pages, Netlify ou Vercel apontando para a raiz do repositório.

## Imagens

A identidade visual (logo, marca e faixa de azulejos) foi extraída do arquivo oficial do logo e está em `assets/` (`logo.svg`, `logo-marca.svg`, `azulejos.svg`, `favicon.svg`). As cores ficam no início de `styles.css`.

As ilustrações das seções ficam em `assets/` (`sobre.svg`, `programacao.svg`). Para usar fotos,
coloque o arquivo em `assets/` (ex.: `hero.jpg`) e troque o `src` da imagem correspondente em `index.html`.
As imagens são recortadas automaticamente para o formato do bloco.
