# Mini Loja NTT Data

Monorepo do desafio técnico Mini Loja: API REST (NestJS + Prisma + Redis) e SPA (React + Vite).

## Estrutura

```
backend/    # API NestJS
frontend/   # SPA React + Vite
docs/       # Especificação e decisões arquiteturais
```

Documentação completa em [`docs/`](docs/01-requirements.md).

## Como rodar

```bash
docker compose up --build
```

| Serviço   | URL |
|-----------|-----|
| Backend   | http://localhost:3000 (health: `/health`) |
| Frontend  | http://localhost:5173 |
| PostgreSQL| `localhost:5433` (host; evita conflito com Postgres local na 5432) |
| Redis     | `localhost:6379` |

Credenciais padrão do Postgres: `mini_loja` / `mini_loja` / database `mini_loja`. Ver `backend/.env.example`.

O backend aplica migrations automaticamente no startup (`prisma migrate deploy`). Seed opcional: `cd backend && npm run prisma:seed`.

Guia de testes manuais no Insomnia: [`docs/05-insomnia-testing.md`](docs/05-insomnia-testing.md).

> Frontend completo (Etapas 9–13). Integração: [`docs/06-integration-testing.md`](docs/06-integration-testing.md).

## Integração (docker-compose)

```bash
cp .env.example .env   # opcional
docker compose up --build -d
```

- Frontend: http://localhost:5173  
- Backend seed roda no startup do container (categorias/produtos demo)  
- Validação automatizada: `./scripts/validate-integration.sh`

## Estratégia de cache (Redis)

Cache-aside apenas em leituras de produtos (`docs/03-cache-strategy.md`):

| Endpoint | Chave Redis |
|----------|-------------|
| `GET /products/:id` | `product:{id}` |
| `GET /products` | `products:list:page={page}:limit={limit}` |

- **TTL:** `CACHE_TTL` no `.env` (padrão 60s).
- **Invalidação:** em create/update/delete de produto, remove `products:list:*`; em update/delete, remove também `product:{id}`.
- Detalhes e cenários de teste: [`docs/03-cache-strategy.md`](docs/03-cache-strategy.md) e [`docs/05-insomnia-testing.md`](docs/05-insomnia-testing.md).

## Testes

**Backend** — requer PostgreSQL e Redis (ex.: `docker compose up postgres redis`):

```bash
cd backend
cp .env.example .env   # se ainda não existir
npm install
npm run lint
npm run test
npm run test:e2e
```

> **e2e:** exige `docker compose up postgres redis` e `backend/.env` (copie de `.env.example`). Postgres do compose usa porta **5433** no host por padrão.

**Frontend:**

```bash
cd frontend
npm install
npm run lint
npm run build
```

## Stack

- **Backend:** NestJS, Prisma, PostgreSQL, Redis
- **Frontend:** React, Vite
- **Infra:** Docker Compose
