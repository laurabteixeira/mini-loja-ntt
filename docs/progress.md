# Progress – Acompanhamento do Projeto Mini Loja

> Este documento deve ser atualizado ao longo do desenvolvimento, refletindo o status real do projeto a cada etapa concluída.

## Status Geral do Projeto

- **Status**: 🟢 Concluído
- **Fase atual**: Etapa 14 concluída (Documentação e entrega)
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
- [x] Etapas 0–14 de `docs/04-tasks.md` (setup → entrega)
- [x] CI: backend (lint, unit, e2e) + frontend (lint, build)
- [x] Repositório publicado no GitHub

## Tarefas em Andamento

- Merge das PRs abertas (#3 frontend, #4 integração) em `main`.

## Tarefas Pendentes

- Nenhuma etapa do backlog pendente.

## Riscos

- **Estratégia de invalidação de listagem ampla** (invalida todas as páginas) — risco aceito conforme `03-cache-strategy.md`.
- **Dependência de Docker** para o fluxo recomendado — compose validado localmente.

## Observações

- Documentação baseada no PDF do desafio; detalhes em `docs/`.
- Backend: NestJS + Prisma + Redis cache-aside; testes unitários e e2e.
- Frontend: React + Vite; listagem, formulário, detalhes, integração via compose.
- Entrega validada: `docker compose up --build` + `./scripts/validate-integration.sh`.

## Próximos Passos

1. Merge PR #3 e PR #4 em `main`.
2. (Opcional) Deploy em ECS/S3 via Terraform — fora do escopo mínimo do desafio.
