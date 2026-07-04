# Progress – Acompanhamento do Projeto Mini Loja

> Este documento deve ser atualizado ao longo do desenvolvimento, refletindo o status real do projeto a cada etapa concluída.

## Status Geral do Projeto

- **Status**: 🟢 Entrega concluída (Etapas 0–14) · 🟢 Melhoria UI/UX em PRs #6–#9
- **Fase atual**: UI shadcn concluída; PRs divididas abertas para merge
- **Repositório**: https://github.com/laurabteixeira/mini-loja-ntt

## Tarefas Concluídas

- [x] Leitura e interpretação do PDF do desafio técnico
- [x] Criação de `docs/01-requirements.md`
- [x] Criação de `docs/02-architecture.md`
- [x] Criação de `docs/03-cache-strategy.md`
- [x] Criação de `docs/04-tasks.md`
- [x] Criação de `docs/decisions.md`
- [x] ADR-003 confirmada: PostgreSQL via Docker
- [x] ADR-005 confirmada: React + Vite no frontend
- [x] ADR-007 confirmada: `categoryId` obrigatório; delete de categoria com produtos bloqueado (`Restrict`)
- [x] ADR-008 confirmada: shadcn/ui + `docs/07-design-standards.md`
- [x] ADR-009 confirmada: campo opcional `imageUrl` + placeholder estático
- [x] Etapas 0–14 de `docs/04-tasks.md` (setup → entrega)
- [x] CI: backend (lint, unit, e2e) + frontend (lint, build)
- [x] Repositório publicado no GitHub
- [x] Setup shadcn/ui (`components/ui/`, tokens Tailwind, alias `@/`)
- [x] ProductList: grid, filtros (busca + categoria), skeletons, modais de delete
- [x] ProductDetails: layout two-column, badges, modais de delete
- [x] ProductForm: layout mockup, pré-visualização, select de categoria
- [x] Navbar: menu Categorias (Popover) com CRUD, busca e scroll
- [x] Backend: filtros `categoryId`/`search` na listagem + chaves de cache
- [x] Backend: `productCount` em `GET /categories`; campo `imageUrl` opcional
- [x] Swagger / OpenAPI em `GET /docs` (`docs/08-api-swagger.md`)

## Tarefas em Andamento

- Merge das PRs #6 (backend), #7 (shadcn), #8 (catálogo), #9 (detalhes/form/navbar).

## Tarefas Pendentes

- (Opcional) Deploy ECS/S3 via Terraform.
- (Futuro) Upload de imagem de produto para S3 (campo `imageUrl` via URL no form; placeholder em `/placeholder.png`).

## Riscos

- **Estratégia de invalidação de listagem ampla** (invalida todas as páginas) — risco aceito conforme `03-cache-strategy.md`.
- **Dependência de Docker** para o fluxo recomendado — compose validado localmente.
- **Volume de arquivos** — mitigado com split em 4 PRs (≤ 30 arquivos cada).

## Observações

- Documentação baseada no PDF do desafio; detalhes em `docs/`.
- Backend: NestJS + Prisma + Redis cache-aside; testes unitários e e2e; Swagger em `/docs`.
- Frontend: React + Vite + shadcn/ui; listagem, formulário, detalhes, navbar de categorias.
- Entrega validada: `docker compose up --build` + `./scripts/validate-integration.sh`.
- Alterações de categoria na navbar disparam evento `mini-loja:categories-changed` para sincronizar filtros/formulário.

## Próximos Passos

1. Merge PRs #6 → #7 → #8 → #9 (ordem recomendada).
2. Validar `docker compose up --build` na `main` após merges.
