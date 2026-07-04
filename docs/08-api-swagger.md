# 08 – Swagger / OpenAPI

Documentação interativa da API REST do backend NestJS.

## Acesso

Com a stack rodando (`docker compose up --build` ou `npm run start:dev` no backend):

| Recurso | URL |
|---------|-----|
| **Swagger UI** | http://localhost:3000/docs |
| **OpenAPI JSON** | http://localhost:3000/docs-json |

No Docker Compose, a URL é a mesma — o backend expõe a porta `3000` no host.

## O que está documentado

- **health** — `GET /health` (Postgres + Redis)
- **categories** — CRUD completo (`/categories`)
- **products** — CRUD completo (`/products`), com query params de paginação e filtros

Cada endpoint inclui:

- Descrição e tags
- Schemas de request (DTOs com exemplos)
- Schemas de response (produto, categoria, listagem paginada, health)
- Códigos de erro relevantes (ex.: `404`, `409` ao deletar categoria com produtos)

## Cache Redis (leituras de produto)

Conforme [`03-cache-strategy.md`](03-cache-strategy.md), apenas estes endpoints usam cache:

| Método | Path | Cache |
|--------|------|-------|
| `GET` | `/products` | Sim — chave `products:list:...` |
| `GET` | `/products/:id` | Sim — chave `product:{id}` |
| `POST/PATCH/DELETE` | `/products` | Invalida cache |

O Swagger descreve isso nas tags e descrições dos endpoints de produto; o comportamento de invalidação não aparece na UI, mas está detalhado em `03-cache-strategy.md`.

## Como testar pela UI

1. Suba o projeto: `docker compose up --build`
2. Abra http://localhost:3000/docs
3. Expanda um endpoint (ex.: `GET /products`)
4. Clique **Try it out** → **Execute**
5. Para `POST`/`PATCH`, use os exemplos pré-preenchidos nos DTOs e ajuste `categoryId` conforme categorias existentes (seed ou `GET /categories`)

## Desenvolvimento local (sem Docker)

```bash
docker compose up -d postgres redis
cd backend
cp .env.example .env
npm ci
npm run start:dev
```

Swagger disponível em http://localhost:3000/docs assim que o Nest iniciar.

## Implementação

- Pacote: `@nestjs/swagger`
- Setup: `backend/src/swagger/setup-swagger.ts` (chamado em `main.ts`)
- DTOs: `@ApiProperty` / `@ApiPropertyOptional` nos DTOs de validação
- Controllers: `@ApiTags`, `@ApiOperation`, `@ApiOkResponse`, etc.

## Alternativas

- Coleção Insomnia e cenários de cache: [`05-insomnia-testing.md`](05-insomnia-testing.md)
- Script de integração: `./scripts/validate-integration.sh`
- `curl`: exemplos no [`README.md`](../README.md)
