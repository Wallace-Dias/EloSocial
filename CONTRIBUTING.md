# Contribuindo com o EloSocial

Adotamos GitFlow, Conventional Commits e Versionamento Semântico para organizar o desenvolvimento.

## Fluxo de Branches (GitFlow)

- `main`: produção
- `develop`: integração de features
- `feature/<nome>`: novas funcionalidades a partir de `develop`
- `release/<versao>`: estabilização (testes/ajustes finais) a partir de `develop`
- `hotfix/<versao>`: correções urgentes a partir de `main`

## Commits (Conventional Commits)

Formato: `tipo(escopo opcional): mensagem`.

Tipos comuns:
- `feat`: nova funcionalidade
- `fix`: correção de bug
- `docs`: documentação
- `style`: formatação (semântica intacta)
- `refactor`: refatorações (sem mudanças de comportamento)
- `perf`: performance
- `test`: testes
- `build`: build, dependências
- `ci`: pipelines
- `chore`: tarefas diversas

Exemplos:
- `feat(router): ativar hash routing para GitHub Pages`
- `fix(links): corrigir CTAs quebrados no /projetos`

## Releases (SemVer)

- `MAJOR.MINOR.PATCH`
- Gere tags e mantenha um `CHANGELOG.md` (Keep a Changelog). Exemplos:
  - `v1.0.0`: primeira versão estável
  - `v1.1.0`: novos recursos sem breaking changes
  - `v1.1.1`: correções pontuais

## Pull Requests

- Descreva objetivo, mudanças e evidências (prints/gifs quando visual)
- Relacione Issues e Milestones
- Checklist de qualidade: build ok, lint ok, testes (quando houver) ok
