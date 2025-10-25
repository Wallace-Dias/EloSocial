
# EloSocial



EloSocial é uma plataforma web que nasceu para aproximar voluntários, ONGs e doadores de projetos que realmente fazem a diferença. Aqui, cada pessoa encontra seu lugar para contribuir, aprender e crescer junto com quem acredita em um futuro mais justo.

## Por que EloSocial?

- **Fácil de usar:** navegação fluida, sem recarregar páginas, com tudo acessível em poucos cliques.
- **Acessível de verdade:** pensado para todos — navegação por teclado, alto contraste, modo escuro, leitores de tela e foco visível.
- **Conectado com o impacto:** encontre projetos, conheça histórias reais, cadastre-se e acompanhe resultados.
- **Aberto à colaboração:** qualquer pessoa pode sugerir melhorias, reportar problemas ou criar novas funcionalidades.

## Principais recursos

- SPA (Single Page Application): navegação instantânea entre páginas e seções.
- Roteamento por hash (`#/rota`): funciona perfeitamente no GitHub Pages, sem erros 404.
- Formulário inteligente: validação em tempo real, máscaras para CPF/telefone/CEP e armazenamento local.
- Acessibilidade AA (WCAG 2.1): skip link, landmarks, ARIA, foco visível, modo escuro e alto contraste.
- Design responsivo: bonito e funcional em qualquer dispositivo.
- Otimização para produção: scripts prontos para minificar arquivos e comprimir imagens.

## Como usar

1. **Acesse o site** — basta abrir o link do GitHub Pages ou rodar localmente:
  - `index.html` é o ponto de entrada.
  - Para testar local, recomendo usar um servidor estático:
    ```bash
    python3 -m http.server 8080
    # ou
    npx http-server -p 8080
    ```
    Depois, acesse http://localhost:8080

2. **Navegue e participe** — explore projetos, leia depoimentos, cadastre-se e entre em contato.
  - Use o menu para acessar as páginas principais.
  - Experimente os controles de acessibilidade no topo: modo escuro e alto contraste.

3. **Contribua** — sugestões, correções e novas ideias são sempre bem-vindas!
  - Veja o arquivo `CONTRIBUTING.md` para saber como colaborar.

## Deploy e produção

O EloSocial está pronto para ser publicado no GitHub Pages. O roteamento por hash garante que tudo funcione mesmo ao recarregar páginas internas.

Quer uma versão ainda mais rápida? Rode os scripts de build para minificar arquivos e otimizar imagens:

```bash
npm install
npm run build
```

O resultado estará na pasta `dist/` — basta publicar esse conteúdo no Pages ou em qualquer servidor estático.

## Para desenvolvedores

- Estrutura modular: HTML em `templates/`, JS em `js/`, CSS em `css/`.
- Scripts de build e dependências no `package.json`.
- Versionamento organizado: GitFlow, Conventional Commits e changelog.

## Dúvidas, ideias ou problemas?

Abra uma issue, mande um pull request ou entre em contato pelo e-mail do rodapé. O EloSocial é feito para crescer junto com quem acredita no poder da colaboração!

---

**EloSocial — juntos, criamos elos que mudam vidas.**
## Acessibilidade (WCAG 2.1 AA)

- Navegação por teclado
  - Submenus visíveis também com foco (`:focus-within`)
  - Menu hambúrguer acessível: `role="button"`, `aria-expanded`, toggle via Enter/Espaço
  - Modal com trap de foco e fechamento por ESC
- Estrutura semântica e landmarks
  - `header`, `nav[role=navigation]`, `main[role=main]`, `footer`
  - Link “Pular para conteúdo” (`.skip-link`)
- Foco visível consistente (`*:focus-visible`) com alto contraste
- Contraste mínimo: paleta revisada; opção de Alto Contraste
- Suporte a leitores de tela
  - `aria-label` em navegação e botões
  - Imagens com `alt` descritivo
- Modo escuro e Alto Contraste
  - Botões no cabeçalho: “Modo escuro” e “Alto contraste”
  - Preferências persistidas em `localStorage`

## Estrutura

- `index.html` — shell que carrega o SPA
- `templates/` — fragmentos HTML das páginas
- `js/router.js` — roteador hash, carrega templates e executa scripts por rota
- `js/main.js` — inicializações (filtros, métricas, depoimentos, formulário) e acessibilidade global
- `js/formValidator.js` — validação e máscaras
- `css/style.css` — design system e estilos

## Executando localmente

1. Abra `index.html` no navegador ou use um servidor estático (recomendado para fetch dos templates):

```bash
# Python 3
python3 -m http.server 8080
# ou
# Node (http-server)
npx http-server -p 8080
```

Acesse http://localhost:8080.

## Build de produção (minificação e imagens)

Pré-requisitos: Node 18+.

```bash
npm install
npm run build
```

Saída em `dist/`:

- `dist/css/style.min.css` (minificado)
- `dist/js/app.min.js` (bundle minificado)
- `dist/templates/` (HTML minificado)
- `dist/index.html` (minificado)
- `dist/img/` (imagens otimizadas)

Dica: Para publicar no GitHub Pages, ative Pages apontando para a pasta `dist` via GitHub Actions ou use um branch dedicado com o conteúdo de `dist`.

## Deploy no GitHub Pages

- Projeto usa hash routing para evitar 404 em recarregamentos
- Publicação recomendada: conteúdo de `dist/` como site
- Alternativamente, publique a raiz (não minificada) durante o desenvolvimento

## Versionamento (GitFlow, Conventional Commits e Releases)

- Branches
  - `main`: produção
  - `develop`: integração
  - `feature/*`: novas funcionalidades
  - `release/*`: estabilização de release
  - `hotfix/*`: correções urgentes em produção
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `build:`, `ci:`, `chore:`)
- Releases: versionamento semântico (SemVer) e CHANGELOG seguindo Keep a Changelog

Consulte `CONTRIBUTING.md` para o fluxo detalhado.

## Troubleshooting

- 404 ao recarregar rota interna no Pages: use links `#/rota` e hash routing (já implementado)
- Preferências de tema/contraste não persistem: verifique bloqueio de `localStorage` no navegador
- Problemas de CORS local: sirva via HTTP local (ver seção Executando localmente)

## Licença

Projeto acadêmico/demonstração. Ajuste conforme a necessidade do curso.
