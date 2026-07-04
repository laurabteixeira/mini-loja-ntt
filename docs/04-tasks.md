# 04 – Backlog de Implementação (Tasks)

> Ordem pensada para implementação incremental: infraestrutura → backend base → backend features → cache → frontend → integração → entrega.

## Etapa 0 – Setup do Repositório

- [x] Criar estrutura de pastas do monorepo (`backend/`, `frontend/`, `docs/`)
- [x] Inicializar repositório Git
- [x] Criar `.gitignore` (node_modules, dist, .env, etc.)
- [x] Criar `README.md` inicial (placeholder)

## Etapa 1 – Infraestrutura Base (Docker)

- [x] Criar `docker-compose.yml` com serviços: backend, frontend, banco de dados, Redis
- [x] Definir variáveis de ambiente no `docker-compose.yml`
- [x] Criar `Dockerfile` do backend
- [x] Criar `Dockerfile` do frontend
- [x] Validar subida dos containers (`docker compose up --build`) — validado localmente (backend + Postgres + Redis)

## Etapa 2 – Backend: Setup do NestJS

- [x] Criar projeto NestJS em `backend/`
- [x] Configurar `ConfigModule` para leitura de variáveis de ambiente (`.env`)
- [x] Criar `.env.example` com variáveis necessárias (DB, Redis, porta)
- [x] Configurar CORS para permitir acesso do frontend
- [x] Configurar `ValidationPipe` global (para uso com DTOs)

## Etapa 3 – Backend: Prisma e Banco de Dados

- [x] Instalar e configurar Prisma
- [x] Definir `schema.prisma` com entidades `Product` e `Category`
- [x] Definir relacionamento `Product.categoryId → Category.id` (`onDelete: Restrict` — ADR-007)
- [x] Rodar migration inicial (`prisma/migrations/20260704132600_init`; aplicada via `prisma migrate deploy` no startup do container)
- [x] Criar `PrismaModule` e `PrismaService` injetável
- [x] (Opcional) Criar seed inicial de categorias/produtos para facilitar testes

## Etapa 4 – Backend: Módulo de Categorias

- [x] Criar `CategoriesModule`
- [x] Criar DTOs: `CreateCategoryDto`, `UpdateCategoryDto`
- [x] Implementar `CategoriesService` (create, findAll, findOne, update, remove)
- [x] Implementar `CategoriesController` com rotas REST
- [x] Testar manualmente todos os endpoints de categoria

## Etapa 5 – Backend: Módulo de Produtos (sem cache ainda)

- [x] Criar `ProductsModule`
- [x] Criar DTOs: `CreateProductDto`, `UpdateProductDto`, `QueryProductDto` (paginação)
- [x] Implementar `ProductsService` (create, findAll paginado, findOne, update, remove)
- [x] Implementar `ProductsController` com rotas REST
- [x] Garantir que o produto retornado inclua a categoria relacionada (include/relation)
- [x] Testar manualmente todos os endpoints de produto (sem cache)

## Etapa 6 – Backend: Integração com Redis

- [x] Instalar cliente Redis
- [x] Criar `RedisModule` e `RedisService` (métodos: get, set, del, delByPattern)
- [x] Configurar conexão via variáveis de ambiente
- [x] Validar conexão do backend com o Redis (via docker-compose)

## Etapa 7 – Backend: Aplicar Cache em Produtos

- [x] Implementar cache-aside em `GET /products/:id`
- [x] Implementar cache-aside em `GET /products` (lista paginada), com chave incluindo página/limite/filtros
- [x] Definir TTL padrão configurável via `.env` (`CACHE_TTL`)
- [x] Implementar invalidação de `product:{id}` em update/delete
- [x] Implementar invalidação de `products:list:*` em create/update/delete
- [x] Testar cenários de cache hit/miss manualmente
- [x] Testar se a invalidação ocorre corretamente após create/update/delete

## Etapa 8 – Backend: Revisão e Qualidade

- [x] Revisar tratamento de erros (ex.: produto/categoria não encontrado → 404)
- [x] Revisar validações dos DTOs (campos obrigatórios, tipos)
- [x] Revisar nomes de rotas e verbos HTTP (padrão REST)
- [x] Revisar organização de módulos/services/controllers
- [x] Configurar ESLint e script `npm run lint`
- [x] Adicionar testes unitários (cache, ADR-007) e e2e (`npm run test`, `npm run test:e2e`)

## Etapa 9 – Frontend: Setup

- [ ] Criar projeto frontend (React, VueJS ou Angular — conforme decisão registrada em `decisions.md`)
- [ ] Configurar variável de ambiente com a URL base da API
- [ ] Criar client HTTP (ex.: axios/fetch wrapper) em `services/api`
- [ ] Configurar roteamento entre as 3 páginas exigidas

## Etapa 10 – Frontend: Listagem de Produtos

- [ ] Criar página de listagem de produtos (`ProductList`)
- [ ] Consumir `GET /products` (com paginação, se implementada)
- [ ] Exibir nome, preço e categoria na listagem
- [ ] Link/botão para acessar detalhes de um produto
- [ ] Link/botão para criar novo produto

## Etapa 11 – Frontend: Formulário de Criar/Editar Produto

- [ ] Criar página/formulário de produto (`ProductForm`)
- [ ] Implementar criação de produto (`POST /products`)
- [ ] Implementar edição de produto (`PUT/PATCH /products/:id`)
- [ ] Carregar lista de categorias no formulário (`GET /categories`)
- [ ] Validações básicas de formulário (campos obrigatórios)

## Etapa 12 – Frontend: Detalhes do Produto

- [ ] Criar página de detalhes (`ProductDetails`)
- [ ] Consumir `GET /products/:id`
- [ ] Exibir todos os dados do produto, incluindo categoria

## Etapa 13 – Integração Final

- [ ] Validar fluxo completo: criar categoria → criar produto → listar → ver detalhes → editar → remover
- [ ] Validar que o cache é invalidado corretamente após as operações via frontend
- [ ] Ajustar CORS/URLs de ambiente para rodar tudo via docker-compose

## Etapa 14 – Documentação e Entrega

- [ ] Escrever `README.md` final (máx. 1 página): como subir backend/frontend, como testar endpoints, estratégia de cache
- [ ] Revisar `.env.example` de backend e frontend
- [ ] Validar subida completa via `docker-compose up`
- [ ] Revisar estrutura final do repositório
- [ ] Atualizar `docs/progress.md` com status final
- [ ] Publicar repositório (GitHub ou similar)
