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
  - Evolução de UI/UX: ver **ADR-008** e `docs/07-design-standards.md`.

---

## ADR-008 – UI: shadcn/ui e padrões de design

- **Decisão tomada**: Adotar **shadcn/ui** (Tailwind + Radix, componentes no repositório) como biblioteca de UI do frontend, seguindo `docs/07-design-standards.md` (UI minimalista preto/branco, skeletons, filtros, componentização).
- **Alternativas consideradas**:
  - Manter apenas Tailwind “manual” (estado atual pós-Etapa 14).
  - Material UI / Chakra UI (bibliotecas fechadas com tema próprio).
- **Motivo da escolha**: shadcn/ui oferece componentes acessíveis e customizáveis sem impor identidade visual saturada; alinha ao pedido de código limpo, separação de componentes e experiência fluida. Já previsto na stack do projeto (`docs/02-architecture.md` menciona Shadcn como opção).
- **Vantagens**:
  - Componentes copiados — controle total sobre estilo monocromático.
  - Skeleton, Dialog, Table, Badge prontos para filtros e estados de loading.
  - Integração natural com Tailwind já presente no Vite.
- **Desvantagens**:
  - Setup inicial (CLI, `components/ui/`, CSS variables).
  - Escopo extra pós-entrega do desafio (melhoria, não requisito do PDF).
- **Impacto na implementação**:
  - Pasta `frontend/src/components/ui/` para componentes shadcn.
  - Refatorar pages para `components/products/`, `hooks/`, `lib/`.
  - Backend: estender `QueryProductDto` se filtros (`categoryId`, `search`) forem expostos na API (cache keys em `03-cache-strategy.md`).

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

---

## ADR-009 – Campo opcional `imageUrl` em Produto

- **Decisão tomada**: Adicionar campo opcional `imageUrl String?` no model `Product`, exposto nos DTOs de create/update. No frontend, usar placeholder estático (`/placeholder.png`) quando `imageUrl` estiver vazio; upload real fica fora do escopo atual.
- **Alternativas consideradas**:
  - Manter apenas ícone genérico (sem asset).
  - Upload para S3 + URL persistida (escopo futuro).
- **Motivo da escolha**: Evolução de UI/UX pós-entrega; permite testar layout com imagens via URL sem implementar storage ainda.
- **Vantagens**:
  - API preparada para integração futura com S3/CDN.
  - UX consistente com placeholder visual enquanto upload não existe.
- **Desvantagens**:
  - Campo extra fora do PDF original do desafio.
  - URLs externas podem quebrar (sem validação de conteúdo).
- **Impacto na implementação**:
  - Migration `20260704180000_add_product_image_url`.
  - DTOs: `@IsOptional() @IsUrl()` em `imageUrl`.
  - Frontend: `lib/product-image.ts` com fallback para `/placeholder.png`.
  - Campo de URL no formulário permanece **disabled** até implementação de upload.

---

## ADR-010 – Abstração de cache via CacheClient

- **Decisão tomada**: Substituir o acoplamento direto a `RedisService` por uma camada `CacheModule → CacheService → CacheClient`, com Redis como provider concreto (`RedisCacheClient`) registrado via token de injeção NestJS (`CACHE_CLIENT`).
- **Alternativas consideradas**:
  - Manter `RedisModule`/`RedisService` expostos diretamente aos services de domínio.
  - Wrapper fino sem interface/token (classe concreta única).
- **Motivo da escolha**: Desacoplar services de negócio da implementação de cache, facilitando troca futura de provider (ex.: Memcached, in-memory) alterando apenas o registro no `CacheModule`, sem mudanças em `ProductsService` ou estratégia de chaves/TTL em `docs/03-cache-strategy.md`.
- **Vantagens**:
  - Padrão alinhado ao [NestJS Providers](https://docs.nestjs.com/providers) (custom provider com `useClass`).
  - Testes mockam `CacheService` sem conhecer ioredis.
  - Estratégia de cache (chaves, TTL, invalidação) permanece inalterada.
- **Desvantagens**:
  - Pequeno aumento de arquivos (`cache.client.ts`, `cache.constants.ts`, provider).
- **Impacto na implementação**:
  - Pasta `backend/src/cache/` substitui `backend/src/redis/`.
  - `ProductsService` e `AppService` injetam `CacheService`.
  - Health check mantém campo `redisConnected` (status da infra Redis subjacente).

---

## ADR-011 – Rate limiting com `@nestjs/throttler`

- **Decisão tomada**: Aplicar rate limiting in-memory via `@nestjs/throttler` com guard global (`AppThrottlerGuard`). Limite generoso para a API de negócio (120 req/min por IP) e limite mais restrito para `GET /health` (10 req/min), pois esse endpoint consulta DB + Redis a cada request.
- **Alternativas consideradas**:
  - Storage Redis para throttling distribuído.
  - Middleware Express manual.
  - Sem rate limiting.
- **Motivo da escolha**: Proteção leve contra abuso sem complexidade extra; in-memory é suficiente para o escopo single-node (docker-compose). Limites configuráveis via `.env` (`THROTTLE_TTL`, `THROTTLE_LIMIT`, `THROTTLE_HEALTH_LIMIT`). Desabilitado automaticamente quando `NODE_ENV=test` (e2e), salvo `THROTTLE_ENABLED=true`.
- **Vantagens**:
  - Integração nativa NestJS (guard global + override por rota no guard).
  - Resposta HTTP 429 padronizada.
  - Swagger documenta 429 em `/health`.
- **Desvantagens**:
  - Contadores in-memory não compartilhados entre réplicas (aceitável no escopo atual).
- **Impacto na implementação**:
  - Dependência `@nestjs/throttler`.
  - `backend/src/common/throttle/` (`AppThrottlerGuard`, config).
  - Variáveis em `backend/.env.example`.

---

## ADR-012 – Repository + Mapper Pattern por feature module

- **Decisão tomada**: Introduzir camadas `Repository` (interface + `Prisma*Repository`) e `Mapper` (Prisma → entity) dentro de cada feature module (`products/`, `categories/`). Services de domínio injetam repositórios via tokens NestJS (`PRODUCT_REPOSITORY`, `CATEGORY_REPOSITORY`) e não acessam `PrismaService` diretamente.
- **Alternativas consideradas**:
  - Manter acesso direto ao `PrismaService` nos services (repository implícito).
  - Clean Architecture com pastas globais `domain/application/infrastructure`.
  - Mapper apenas pontual, sem entities.
- **Motivo da escolha**: Desacoplar regra de negócio da persistência Prisma, facilitando testes (mock de repository) e evolução do ORM, sem over-engineering de Clean Architecture — alinhado a [NestJS Database](https://docs.nestjs.com/techniques/database) e à modularização por domínio em `docs/02-architecture.md`.
- **Vantagens**:
  - Services focados em regra de negócio + cache.
  - Mappers centralizam transformações (ex.: `_count` → `productCount`).
  - Padrão de injeção consistente com `CacheClient` (ADR-010).
- **Desvantagens**:
  - Mais arquivos por feature module.
  - `AppService` (health) ainda usa `PrismaService` para `$queryRaw` — fora do escopo CRUD.
- **Impacto na implementação**:
  - Pastas `entities/`, `repositories/`, `mappers/` em `products/` e `categories/`.
  - `CategoriesModule` exporta `CATEGORY_REPOSITORY` para uso em `ProductsService`.
  - Testes unitários mockam repositories em vez de `PrismaService`.

---

## ADR-013 – Limites de validação de campos (DTO layer)

- **Decisão tomada**: Definir limites máximos de entrada nos DTOs via `class-validator` (`@MaxLength`, `@Max`), centralizados em `backend/src/common/validation/field-limits.ts`, com paridade Swagger (`minLength`/`maxLength`/`maximum`). Descrição de produto limitada a **400 caracteres** (alinhada ao frontend). Enforcement apenas na camada API — **sem** `@db.VarChar` no Prisma nesta etapa.
- **Alternativas consideradas**:
  - Limites apenas no frontend (rejeitado — bypass via API direta).
  - Descrição com 2000 caracteres no backend (rejeitado — diverge do UX atual).
  - Migration Prisma com `@db.VarChar(n)` (adiado — pode ser ADR futuro).
- **Motivo da escolha**: Fechar gaps apontados pela persona `pentester` (RF06): prevenir payloads oversized e documentar contrato OpenAPI. Opção A (400 chars) mantém paridade com o formulário React existente.
- **Limites adotados**:

| Campo | Máximo |
|---|---|
| `Category.name` | 100 caracteres |
| `Product.name` | 200 caracteres |
| `Product.description` | 400 caracteres |
| `Product.imageUrl` | 2048 caracteres |
| `Product.price` | 9 999 999,99 |
| `QueryProductDto.search` | 100 caracteres |
| `QueryProductDto.limit` | 100 |
| `QueryProductDto.page` | 10 000 |

- **Vantagens**:
  - Proteção contra strings/valores extremos na API.
  - Constantes reutilizáveis; frontend espelha em `frontend/src/lib/field-limits.ts`.
  - Path `:id` rejeita valores `< 1` via `PositiveIntPipe`.
- **Desvantagens**:
  - Banco Postgres ainda aceita textos maiores se dados forem inseridos fora da API.
- **Impacto na implementação**:
  - DTOs de products/categories atualizados.
  - Testes e2e em `backend/test/validation.e2e-spec.ts`.
  - Formulários frontend com `maxLength` alinhado.

