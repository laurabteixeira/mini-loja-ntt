# Progress – Acompanhamento do Projeto Mini Loja

> Este documento deve ser atualizado ao longo do desenvolvimento, refletindo o status real do projeto a cada etapa concluída.

## Status Geral do Projeto

- **Status**: 🟡 Em andamento
- **Fase atual**: Etapa 8 concluída; próxima: Etapa 9 (Frontend setup)
- **Próxima fase**: Frontend React + Vite (Etapa 9 de `04-tasks.md`)

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

## Tarefas em Andamento

- Nenhuma tarefa de implementação em andamento no momento.

## Tarefas Pendentes

- Todas as etapas descritas em `04-tasks.md`, da Etapa 0 (Setup do Repositório) até a Etapa 14 (Documentação e Entrega).

## Riscos

- **Estratégia de invalidação de listagem ampla** (invalida todas as páginas) pode gerar mais cache misses do que o ideal em cenários com muitos produtos — risco aceito conforme `03-cache-strategy.md`.
- **Dependência de Docker** para o fluxo de execução recomendado — compose validado localmente (`docker compose up --build backend`).

## Observações

- Toda a documentação inicial foi baseada exclusivamente no PDF do desafio, sem inclusão de requisitos não solicitados.
- Nenhuma linha de código de aplicação foi escrita nesta etapa inicial de documentação.
- Após revisão (Etapa 8): ESLint configurado; testes unitários e e2e cobrindo cache Redis e ADR-007.

## Próximos Passos

1. Iniciar Etapa 9 – Frontend: Setup React + Vite (`04-tasks.md`).
2. Antes do primeiro PR: dividir commits em branches ≤ 30 arquivos (infra → CRUD → cache/qualidade).
