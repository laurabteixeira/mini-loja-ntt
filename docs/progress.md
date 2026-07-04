# Progress – Acompanhamento do Projeto Mini Loja

> Este documento deve ser atualizado ao longo do desenvolvimento, refletindo o status real do projeto a cada etapa concluída.

## Status Geral do Projeto

- **Status**: 🟡 Em andamento
- **Fase atual**: Etapa 13 concluída; próxima: Etapa 14 (Documentação e entrega)
- **Próxima fase**: README final e publicação (Etapa 14 de `04-tasks.md`)

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
- [x] Etapa 0 – Setup do Repositório (`04-tasks.md`)
- [x] Etapa 1 – Infraestrutura Base Docker (`04-tasks.md`; compose validado localmente)
- [x] Etapa 2 – Backend NestJS setup (`04-tasks.md`)
- [x] Etapa 3 – Prisma + schema + migration + seed (`04-tasks.md`)
- [x] Etapa 4 – Módulo de Categorias CRUD (`04-tasks.md`)
- [x] Etapa 5 – Módulo de Produtos CRUD (`04-tasks.md`)
- [x] Etapa 6 – Integração Redis (`04-tasks.md`)
- [x] Etapa 7 – Cache em Produtos (`04-tasks.md`)
- [x] Etapa 8 – Revisão e qualidade do backend (`04-tasks.md`; ESLint + testes unitários/e2e)
- [x] Etapa 9 – Frontend setup React + Vite (`04-tasks.md`)
- [x] Etapa 10 – ProductList com paginação (`04-tasks.md`)
- [x] Etapa 11 – ProductForm create/edit (`04-tasks.md`)
- [x] Etapa 12 – ProductDetails (`04-tasks.md`)
- [x] Etapa 13 – Integração final (`04-tasks.md`; script + guia `06-integration-testing.md`)

## Tarefas em Andamento

- Nenhuma tarefa de implementação em andamento no momento.

## Tarefas Pendentes

- Etapa 14 – Documentação e entrega (`04-tasks.md`): README final, revisão dos `.env.example`, validação completa do compose, publicação do repositório.

## Riscos

- **Estratégia de invalidação de listagem ampla** (invalida todas as páginas) pode gerar mais cache misses do que o ideal em cenários com muitos produtos — risco aceito conforme `03-cache-strategy.md`.
- **Dependência de Docker** para o fluxo de execução recomendado — compose validado localmente (`docker compose up --build backend`).

## Observações

- Toda a documentação inicial foi baseada exclusivamente no PDF do desafio, sem inclusão de requisitos não solicitados.
- Backend e frontend implementados (Etapas 2–13); CI cobre lint/testes do backend e lint/build do frontend.
- Após revisão (Etapa 8): ESLint configurado; testes unitários e e2e cobrindo cache Redis e ADR-007.

## Próximos Passos

1. Etapa 14 – README final e revisão de entrega (`04-tasks.md`).
