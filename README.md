# Mini Loja NTT Data

API REST (NestJS + Prisma + PostgreSQL + Redis) e SPA (React + Vite) para gerenciar produtos e categorias.

**Repositório:** https://github.com/laurabteixeira/mini-loja-ntt

## Como rodar

```bash
cp .env.example .env   # opcional — defaults do compose já funcionam
docker compose up --build
```

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |
| Health | http://localhost:3000/health |
| PostgreSQL (host) | `localhost:5433` |
| Redis | `localhost:6379` |

O backend aplica `prisma migrate deploy` e **seed** no startup (`RUN_SEED=true` por padrão). Credenciais Postgres: `mini_loja` / `mini_loja`.

Variáveis de ambiente: `.env.example` (compose), `backend/.env.example`, `frontend/.env.example`.

## Como testar

**Endpoints (API):**

```bash
curl http://localhost:3000/health
curl 'http://localhost:3000/products?page=1&limit=10'
curl http://localhost:3000/products/1
```

Coleção e cenários de cache: [`docs/05-insomnia-testing.md`](docs/05-insomnia-testing.md).

**Integração (stack completo):**

```bash
docker compose up --build -d
./scripts/validate-integration.sh
```

Fluxo manual UI + cache: [`docs/06-integration-testing.md`](docs/06-integration-testing.md).

**Testes locais (CI):**

```bash
docker compose up -d postgres redis
cd backend && cp .env.example .env && npm ci && npm run lint && npm run test && npm run test:e2e
cd frontend && npm ci && npm run lint && npm run build
```

## Estratégia de cache (Redis)

Cache-aside apenas em leituras de produtos ([`docs/03-cache-strategy.md`](docs/03-cache-strategy.md)):

| Endpoint | Chave Redis |
|----------|-------------|
| `GET /products/:id` | `product:{id}` |
| `GET /products` | `products:list:page={page}:limit={limit}` |

- **TTL:** `CACHE_TTL` (padrão 60s).
- **Invalidação:** em create/update/delete de produto, remove `products:list:*`; em update/delete, remove também `product:{id}`.

Documentação detalhada em [`docs/`](docs/01-requirements.md).
