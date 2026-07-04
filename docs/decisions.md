# Decisions – Registro de Decisões Arquiteturais (ADR Simplificado)

> Este documento registra as decisões arquiteturais tomadas para o projeto Mini Loja. Cada entrada segue o formato: decisão, alternativas consideradas, motivo da escolha, vantagens e desvantagens.

---

## ADR-001 – Estrutura de Monorepo (backend + frontend no mesmo repositório)

- **Decisão tomada**: Manter backend e frontend em pastas separadas (`backend/`, `frontend/`) dentro de um único repositório.
- **Alternativas consideradas**:
  - Dois repositórios separados (um para backend, outro para frontend).
- **Motivo da escolha**: O desafio pede um único repositório entregável, e um monorepo simplifica a entrega, o versionamento e a execução via `docker-compose`.
- **Vantagens**:
  - Facilita a entrega e avaliação (um único link de repositório).
  - Simplifica orquestração via `docker-compose` na raiz.
  - Histórico de commits unificado.
- **Desvantagens**:
  - Menor isolamento entre times/deploys (irrelevante no escopo de um desafio técnico).

---

## ADR-002 – ORM: Prisma

- **Decisão tomada**: Usar Prisma como ORM para acesso ao banco de dados relacional.
- **Alternativas consideradas**:
  - TypeORM
  - Sequelize
- **Motivo da escolha**: Prisma é uma exigência explícita do desafio.
- **Vantagens**:
  - Migrations declarativas e simples via `schema.prisma`.
  - Tipagem forte gerada automaticamente (Prisma Client).
  - Boa integração com NestJS.
- **Desvantagens**:
  - Menor flexibilidade para queries muito complexas em comparação a SQL puro (não relevante para o escopo deste CRUD).

---

## ADR-003 – Banco de Dados Relacional

- **Decisão tomada**: Usar **PostgreSQL** como banco de dados relacional, executado via **Docker** no `docker-compose.yml` (serviço `postgres`).
- **Alternativas consideradas**:
  - PostgreSQL (via Docker)
  - SQLite (arquivo local, zero configuração)
  - MySQL
- **Motivo da escolha**: PostgreSQL é mais representativo de um ambiente de produção real, combina naturalmente com a orquestração via `docker-compose` (ADR-006) e atende ao requisito do desafio de banco relacional suportado pelo Prisma.
- **Vantagens**:
  - Ambiente consistente entre desenvolvimento e avaliação (container dedicado).
  - Integração madura com Prisma (migrations, tipagem via Prisma Client).
  - Alinhado ao fluxo de entrega com um único `docker compose up`.
- **Desvantagens**:
  - Exige um container adicional em relação ao SQLite (custo aceitável no escopo do desafio).
- **Impacto na implementação**:
  - `DATABASE_URL` apontando para o serviço `postgres` do compose (ex.: `postgresql://user:pass@postgres:5432/mini_loja`).
  - Serviço `postgres` no `docker-compose.yml` com volume persistente e healthcheck.

---

## ADR-004 – Cache: Redis com estratégia Cache-Aside

- **Decisão tomada**: Implementar cache com Redis utilizando o padrão Cache-Aside (Lazy Loading) para os endpoints `GET /products/:id` e `GET /products`, com invalidação explícita nas operações de escrita.
- **Alternativas consideradas**:
  - Write-Through (atualizar o cache diretamente a cada escrita).
  - Cache apenas com TTL, sem invalidação explícita.
- **Motivo da escolha**: Cache-Aside é o padrão mais simples e amplamente utilizado para esse tipo de cenário, exigido implicitamente pelo desafio ("cache com invalidação relacionada"). Evita a complexidade de manter o cache sempre sincronizado em toda escrita (Write-Through), delegando a repopulação para a próxima leitura.
- **Vantagens**:
  - Simplicidade de implementação.
  - Cache sempre consistente após invalidação, sem necessidade de replicar toda lógica de escrita no cache.
  - Fácil de explicar e testar.
- **Desvantagens**:
  - Primeira leitura após invalidação sempre é um cache miss (leve overhead).
  - Invalidação de listagem é feita de forma ampla (todas as páginas), não granular.

---

## ADR-005 – Framework de Frontend

- **Decisão tomada**: Usar **React** com **Vite** como bundler/dev server para o frontend em `frontend/`.
- **Alternativas consideradas**:
  - React + Vite
  - VueJS
  - Angular
- **Motivo da escolha**: React atende ao requisito do desafio (RF04/RNF04), Vite oferece setup rápido e DX moderna para um SPA simples com três telas, sem complexidade desnecessária.
- **Vantagens**:
  - Grande ecossistema e documentação; fácil integrar roteamento (`react-router-dom`) e client HTTP (axios/fetch).
  - Vite: build e HMR rápidos; variáveis de ambiente via `VITE_*` (ex.: `VITE_API_URL`).
  - Estrutura alinhada a `docs/02-architecture.md` (pages, components, services, types).
- **Desvantagens**:
  - Curva de aprendizado moderada se a equipe não tiver familiaridade com React (não aplicável se for a stack escolhida).
- **Impacto na implementação**:
  - Projeto criado com `npm create vite@latest frontend -- --template react-ts` (ou equivalente).
  - URL base da API via `VITE_API_URL` no `.env.example` do frontend.

---

## ADR-006 – Orquestração via Docker Compose

- **Decisão tomada**: Disponibilizar um `docker-compose.yml` na raiz do projeto para subir backend, frontend, banco de dados e Redis com um único comando.
- **Alternativas consideradas**:
  - Apenas instruções manuais de instalação (sem Docker).
- **Motivo da escolha**: O desafio indica preferência explícita por `docker-compose` como forma de entrega/execução.
- **Vantagens**:
  - Facilita a avaliação por terceiros (setup em um único comando).
  - Ambiente consistente entre diferentes máquinas.
- **Desvantagens**:
  - Exige Docker instalado na máquina de quem for rodar (mitigado por também fornecer instruções manuais como alternativa).

---

## ADR-007 – Regras de Modelagem: Produto e Categoria

- **Decisão tomada**:
  1. **`categoryId` obrigatório** — todo Produto deve estar vinculado a uma Categoria existente (`categoryId` não-nulo no schema e campo obrigatório no `CreateProductDto` / `UpdateProductDto`).
  2. **Impedir delete acidental de Categoria com produtos** — ao tentar remover uma Categoria que possui Produtos vinculados, a operação deve falhar (`onDelete: Restrict` no Prisma + tratamento de erro HTTP adequado, ex.: **409 Conflict** ou **400 Bad Request** com mensagem clara).
- **Alternativas consideradas**:
  - `categoryId` opcional (produto sem categoria).
  - `onDelete: Cascade` (remover categoria apaga todos os produtos vinculados).
  - `onDelete: SetNull` (produtos ficam sem categoria).
- **Motivo da escolha**: O desafio exige relação Produto → Categoria (RF03); tornar `categoryId` obrigatório reflete essa regra de negócio. `Restrict` evita perda acidental de dados ao deletar uma categoria ainda em uso — o usuário deve remover ou reatribuir os produtos antes.
- **Vantagens**:
  - Integridade referencial garantida no banco e na API.
  - Comportamento previsível e seguro para um CRUD de loja.
  - Mensagem de erro explícita orienta o fluxo correto (ex.: "Cannot delete category with linked products").
- **Desvantagens**:
  - Delete de categoria exige passo extra (esvaziar ou migrar produtos antes) — aceitável no escopo do desafio.
- **Impacto na implementação**:
  - `schema.prisma`: `categoryId Int` (sem `?`); relação com `onDelete: Restrict`.
  - `CreateProductDto`: `@IsInt()`, `@IsNotEmpty()` em `categoryId`; validar existência da categoria no service.
  - `CategoriesService.remove`: capturar erro Prisma `P2003` (foreign key) ou checar `_count.products` antes do delete e retornar 409.
