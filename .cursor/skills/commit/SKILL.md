# SKILL — Commit / Git Workflow

Este skill contém os comandos, templates e exemplos completos que a persona `commit` deve usar ao lidar com git.

## 0. Fonte da verdade (`docs/`)

| Documento | Uso no fluxo de git |
|---|---|
| `docs/01-requirements.md` | Escopo e entregáveis — commits devem avançar requisitos documentados |
| `docs/04-tasks.md` | Backlog — marcar checkboxes da etapa concluída após merge |
| `docs/progress.md` | Status geral — atualizar ao concluir etapas significativas |

Ao preparar um commit que conclui uma etapa de `docs/04-tasks.md`, sugira ao usuário atualizar os checkboxes e `docs/progress.md`.

## 1. Fluxo de comandos padrão

```bash
# 1. Confirmar branch atual
git branch --show-current

# 2. Se ainda na master/main, criar branch nova a partir dela
git checkout master
git pull origin master
git checkout -b feat/product-crud-endpoints

# 3. Rodar testes ANTES de commitar
npm run test && npm run test:e2e

# 4. Conferir quantidade de arquivos alterados (limite: 30)
git diff --stat master... | tail -1

# 5. Adicionar e commitar
git add <arquivos>
git commit -m "feat(products): add create product endpoint with DTO validation"

# 6. Confirmar novamente a branch antes do push
git branch --show-current
git push origin feat/product-crud-endpoints

# NUNCA:
git push origin master   # <-- proibido
```

## 2. Tabela de tipos de commit (Conventional Commits)

| Tipo | Uso |
|---|---|
| `feat` | nova funcionalidade (ex: endpoint, componente, tela) |
| `fix` | correção de bug |
| `refactor` | mudança interna sem alterar comportamento externo |
| `test` | adição/ajuste de testes |
| `docs` | documentação em `docs/` ou README |
| `chore` | dependências, configs, tarefas de manutenção |
| `ci` | pipelines GitHub Actions |
| `perf` | melhoria de performance (ex: cache) |
| `infra` | Docker, docker-compose, Dockerfiles |

## 3. Exemplos completos de commits

```
feat(categories): add category CRUD with validation DTOs
fix(products): correct pagination offset calculation
perf(cache): add redis caching to GET /products with TTL fallback
refactor(products): extract cache logic into redis service
test(products): add unit tests for product service business rules
ci(github-actions): add pipeline to run unit and integration tests on PR
infra(docker): add docker-compose with backend frontend postgres redis
docs(specs): add cache strategy documentation
```

## 4. Exemplos de nomes de branch

```
feat/product-crud-endpoints
feat/redis-cache-invalidation
feat/frontend-product-list-page
fix/category-relation-validation
infra/docker-compose-setup
ci/github-actions-test-pipeline
docs/cache-strategy-spec
```

## 5. Template de descrição de PR

```markdown
## What changed
<resumo objetivo em inglês>

## Why
<motivo/contexto — referenciar etapa de docs/04-tasks.md se aplicável>

## How to test
1. ...
2. ...

## Checklist
- [ ] Tests passing locally (unit + integration)
- [ ] CI pipeline green (if applicable)
- [ ] No more than 30 files changed
- [ ] Branch confirmed (not master)
- [ ] Reviewed by `revisor` persona
- [ ] docs/04-tasks.md and docs/progress.md updated (if stage completed)
```

## 6. Checklist final antes de qualquer `git push` ou abertura de PR

1. [ ] Branch atual confirmada com o usuário (não é `master`).
2. [ ] Testes unitários e de integração passando localmente.
3. [ ] `git diff --stat` ≤ 30 arquivos.
4. [ ] Mensagem de commit segue Conventional Commits, em inglês.
5. [ ] PR criado contra `master`, nunca commit direto nela.
6. [ ] Descrição da PR preenchida com o template acima.
7. [ ] Se etapa do backlog concluída: `docs/04-tasks.md` e `docs/progress.md` atualizados.
