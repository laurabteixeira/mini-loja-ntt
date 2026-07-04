# 02 – Arquitetura do Projeto: Mini Loja

## 1. Visão Geral

Arquitetura simples, dividida em dois projetos independentes (monorepo com duas pastas principais), comunicando-se via API REST:

- **backend/** – API REST em NestJS, responsável por regras de negócio, persistência (Prisma) e cache (Redis).
- **frontend/** – SPA que consome a API REST para exibir e gerenciar produtos e categorias.

A prioridade é **simplicidade, organização e facilidade de manutenção**, evitando complexidade desnecessária para um desafio técnico deste porte.

## 2. Estrutura do Repositório

```
mini-loja/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── test/
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
├── docs/
│   ├── 01-requirements.md
│   ├── 02-architecture.md
│   ├── 03-cache-strategy.md
│   ├── 04-tasks.md
│   ├── 05-insomnia-testing.md
│   ├── 06-integration-testing.md
│   ├── 07-design-standards.md
│   ├── 08-api-swagger.md
│   ├── decisions.md
│   └── progress.md
├── scripts/
│   └── validate-integration.sh
├── docker-compose.yml
└── README.md
```

## 3. Organização das Pastas (Backend)

```
backend/src/
├── main.ts
├── app.module.ts
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── redis/
│   ├── redis.module.ts
│   └── redis.service.ts
├── products/
│   ├── products.module.ts
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── dto/
│       ├── create-product.dto.ts
│       ├── update-product.dto.ts
│       └── query-product.dto.ts
├── categories/
│   ├── categories.module.ts
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   └── dto/
│       ├── create-category.dto.ts
│       └── update-category.dto.ts
└── common/
    ├── filters/
    ├── interceptors/
    └── pipes/

backend/prisma/
├── schema.prisma
└── migrations/
```

## 4. Arquitetura do Backend

O backend segue a arquitetura modular padrão do NestJS, organizada por domínio (feature modules), com separação clara de camadas:

- **Controller** – recebe requisições HTTP, valida entrada (via DTOs/pipes) e delega para o service. Não contém regra de negócio.
- **Service** – contém a regra de negócio: orquestra chamadas ao Prisma (persistência) e ao Redis (cache), aplica a lógica de invalidação de cache.
- **Prisma Module/Service** – encapsula o `PrismaClient`, expõe uma instância injetável para os demais módulos.
- **Redis Module/Service** – encapsula o cliente Redis, expõe métodos utilitários (`get`, `set`, `del`, `delByPattern`) para uso nos services.
- **DTOs** – definem o formato de entrada esperado e aplicam validação (via `class-validator`/`class-transformer`).
- **Modules** – `ProductsModule` e `CategoriesModule` isolam cada domínio, importados pelo `AppModule`.

### 4.1 Módulos

| Módulo | Responsabilidade |
|---|---|
| `AppModule` | Módulo raiz, importa demais módulos e configura variáveis de ambiente globais. |
| `PrismaModule` | Provê acesso ao banco de dados via Prisma Client. |
| `RedisModule` | Provê acesso ao Redis para cache. |
| `ProductsModule` | CRUD de produtos, regras de cache/invalidação. |
| `CategoriesModule` | CRUD de categorias. |

### 4.2 Responsabilidades por Camada

- **Controller**: roteamento HTTP, validação de entrada, resposta HTTP.
- **Service**: regra de negócio, orquestração entre Prisma e Redis.
- **Prisma (Repository implícito)**: acesso a dados, migrations, modelagem do schema.
- **Redis**: cache de leitura e invalidação em escrita.
- **DTOs**: contrato de entrada/saída e validação.

## 5. Arquitetura do Frontend

Aplicação SPA simples, estruturada por páginas/funcionalidades:

```
frontend/src/
├── components/
│   ├── ui/              # shadcn/ui (Button, Skeleton, Table, …)
│   ├── layout/          # AppHeader, Layout
│   ├── categories/      # CategoriesNavMenu, CategoryFormDialog
│   ├── products/        # ProductGrid, ProductFilters, modais, skeletons
│   └── shared/          # Pagination, EmptyState, ErrorAlert
├── hooks/               # useDebounce, …
├── lib/                 # cn(), formatters, category-events, product-image
├── pages/
│   ├── ProductList/
│   ├── ProductForm/
│   └── ProductDetails/
├── services/
│   └── api.ts
└── types/
```

Padrões visuais e de UX: **`docs/07-design-standards.md`**.

Camadas:
- **pages** – telas requeridas pelo desafio (listagem, formulário criar/editar, detalhes); orquestram hooks e componentes.
- **components/ui** – primitivos shadcn/ui.
- **components/** – composições de domínio (produtos, layout, shared).
- **hooks** – data fetching, filtros, debounce.
- **services** – camada HTTP com a API do backend.
- **types** – tipagem dos modelos de Produto e Categoria.

## 6. Comunicação Frontend/Backend

- Comunicação via **HTTP REST**, formato **JSON**.
- Frontend consome os endpoints expostos pelo `ProductsController` e `CategoriesController`.
- URL base da API configurada via variável de ambiente no frontend (ex: `VITE_API_URL` ou equivalente).
- CORS habilitado no backend para permitir chamadas do frontend.
- **Sincronização de categorias no frontend:** CRUD na navbar dispara o evento customizado `mini-loja:categories-changed` (`lib/category-events.ts`); `ProductList` e `ProductForm` escutam o evento e recarregam `GET /categories` sem reload da página.

## 7. Fluxo das Requisições

### Fluxo de leitura (ex.: listar produtos)
1. Frontend chama `GET /products?page=1&limit=10`.
2. `ProductsController` recebe a requisição e delega ao `ProductsService`.
3. `ProductsService` verifica se existe cache no Redis para a chave correspondente.
4. Se existir cache → retorna os dados do Redis.
5. Se não existir → consulta o Prisma/banco, monta a resposta, grava no Redis e retorna ao controller.
6. Controller responde ao frontend em JSON.

### Fluxo de escrita (ex.: criar produto)
1. Frontend envia `POST /products` com os dados no corpo da requisição.
2. Controller valida via DTO.
3. Service persiste o produto via Prisma.
4. Service invalida as chaves de cache relacionadas no Redis (detalhe/lista).
5. Controller responde com o produto criado.

## 8. Tecnologias Utilizadas

- **Backend**: NestJS, Prisma ORM, Redis, class-validator/class-transformer.
- **Banco de dados**: PostgreSQL (via Docker — ADR-003).
- **Frontend**: React + Vite (ADR-005), shadcn/ui (ADR-008) — ver `docs/07-design-standards.md`.
- **Infraestrutura**: Docker e docker-compose para orquestrar backend, frontend, banco e Redis.

## 9. Justificativa da Arquitetura Escolhida

- **Modularização por domínio no NestJS** facilita manutenção e é o padrão recomendado pelo próprio framework, além de ser um dos critérios de avaliação do desafio ("boas práticas NestJS, DTOs, módulos, services").
- **Separação Controller/Service** mantém a regra de negócio isolada da camada HTTP, facilitando testes e evolução.
- **Prisma** como ORM único simplifica modelagem, migrations e leitura/escrita, atendendo diretamente ao requisito do desafio.
- **Redis isolado em módulo próprio** permite reutilizar a lógica de cache em qualquer service sem acoplamento direto a uma biblioteca específica.
- **Frontend simples orientado a páginas** atende exatamente às 3 telas exigidas (listagem, formulário, detalhes), sem introduzir complexidade (state managers, roteamento avançado) não solicitada pelo desafio.
- **docker-compose** simplifica a entrega, atendendo à preferência explícita do desafio para subir o ambiente.
