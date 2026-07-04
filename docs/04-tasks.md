# 04 – Backlog de Implementação (Tasks)

> Ordem pensada para implementação incremental: infraestrutura → backend base → backend features → cache → frontend → integração → entrega.

## Etapa 0 – Setup do Repositório

- [ ] Criar estrutura de pastas do monorepo (`backend/`, `frontend/`, `docs/`)
- [ ] Inicializar repositório Git
- [ ] Criar `.gitignore` (node_modules, dist, .env, etc.)
- [ ] Criar `README.md` inicial (placeholder)

## Etapa 1 – Infraestrutura Base (Docker)

- [ ] Criar `docker-compose.yml` com serviços: backend, frontend, banco de dados, Redis
- [ ] Definir variáveis de ambiente no `docker-compose.yml`
- [ ] Criar `Dockerfile` do backend
- [ ] Criar `Dockerfile` do frontend
- [ ] Validar subida dos containers (`docker-compose up`) com serviços vazios

## Etapa 2 – Backend: Setup do NestJS

- [ ] Criar projeto NestJS em `backend/`
- [ ] Configurar `ConfigModule` para leitura de variáveis de ambiente (`.env`)
- [ ] Criar `.env.example` com variáveis necessárias (DB, Redis, porta)
- [ ] Configurar CORS para permitir acesso do frontend
- [ ] Configurar `ValidationPipe` global (para uso com DTOs)

## Etapa 3 – Backend: Prisma e Banco de Dados

- [ ] Instalar e configurar Prisma
- [ ] Definir `schema.prisma` com entidades `Product` e `Category`
- [ ] Definir relacionamento `Product.categoryId → Category.id`
- [ ] Rodar migration inicial
- [ ] Criar `PrismaModule` e `PrismaService` injetável
- [ ] (Opcional) Criar seed inicial de categorias/produtos para facilitar testes

## Etapa 4 – Backend: Módulo de Categorias

- [ ] Criar `CategoriesModule`
- [ ] Criar DTOs: `CreateCategoryDto`, `UpdateCategoryDto`
- [ ] Implementar `CategoriesService` (create, findAll, findOne, update, remove)
- [ ] Implementar `CategoriesController` com rotas REST
- [ ] Testar manualmente todos os endpoints de categoria

## Etapa 5 – Backend: Módulo de Produtos (sem cache ainda)

- [ ] Criar `ProductsModule`
- [ ] Criar DTOs: `CreateProductDto`, `UpdateProductDto`, `QueryProductDto` (paginação)
- [ ] Implementar `ProductsService` (create, findAll paginado, findOne, update, remove)
- [ ] Implementar `ProductsController` com rotas REST
- [ ] Garantir que o produto retornado inclua a categoria relacionada (include/relation)
- [ ] Testar manualmente todos os endpoints de produto (sem cache)

## Etapa 6 – Backend: Integração com Redis

- [ ] Instalar cliente Redis
- [ ] Criar `RedisModule` e `RedisService` (métodos: get, set, del, delByPattern)
- [ ] Configurar conexão via variáveis de ambiente
- [ ] Validar conexão do backend com o Redis (via docker-compose)

## Etapa 7 – Backend: Aplicar Cache em Produtos

- [ ] Implementar cache-aside em `GET /products/:id`
- [ ] Implementar cache-aside em `GET /products` (lista paginada), com chave incluindo página/limite/filtros
- [ ] Definir TTL padrão configurável via `.env`
- [ ] Implementar invalidação de `product:{id}` em update/delete
- [ ] Implementar invalidação de `products:list:*` em create/update/delete
- [ ] Testar cenários de cache hit/miss manualmente
- [ ] Testar se a invalidação ocorre corretamente após create/update/delete

## Etapa 8 – Backend: Revisão e Qualidade

- [ ] Revisar tratamento de erros (ex.: produto/categoria não encontrado → 404)
- [ ] Revisar validações dos DTOs (campos obrigatórios, tipos)
- [ ] Revisar nomes de rotas e verbos HTTP (padrão REST)
- [ ] Revisar organização de módulos/services/controllers

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
