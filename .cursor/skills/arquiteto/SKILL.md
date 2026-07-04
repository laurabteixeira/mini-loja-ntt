# SKILL — Arquiteto de Software

Este skill contém o fluxo de trabalho da persona `arquiteto`. **Os detalhes estruturais estão em `docs/` — não duplique nem contradiga.**

## 0. Fonte da verdade (`docs/`)

| Documento | Conteúdo |
|---|---|
| `docs/02-architecture.md` | Estrutura de pastas (backend/frontend), módulos NestJS, camadas, fluxo de requisições |
| `docs/01-requirements.md` | Entidades Product/Category, relacionamentos, requisitos de API |
| `docs/03-cache-strategy.md` | Chaves Redis (`product:{id}`, `products:list:...`), TTL, invalidação via SCAN |
| `docs/decisions.md` | ADRs: monorepo, Prisma, cache-aside, docker-compose; pendentes: banco e frontend |

**Regra:** se este skill contradizer `docs/`, **`docs/` prevalece**.

## 1. Fluxo de trabalho ao ser acionado

1. Ler `docs/02-architecture.md` e `docs/decisions.md`.
2. Identificar se a proposta altera algo já decidido (ADR) ou é decisão nova.
3. Apresentar proposta com tradeoffs (template abaixo), referenciando trechos de `docs/`.
4. Aguardar confirmação do usuário.
5. Se nova decisão → registrar ADR em `docs/decisions.md`.
6. Se alterar estrutura documentada → atualizar `docs/02-architecture.md` ou `docs/03-cache-strategy.md`.

## 2. Template de proposta estrutural

```
## Proposta — <tema>

Docs consultados: docs/02-architecture.md, docs/03-cache-strategy.md, docs/decisions.md

Contexto: <o que motivou a proposta>

Proposta (alinhada a docs/):
<descrever ou colar trecho relevante de docs/02-architecture.md>

Pontos a confirmar:
- <pergunta 1>
- <pergunta 2>

Tradeoffs (se houver alternativa):
Opção A: ... / Opção B: ...

Impacto em docs/:
- [ ] docs/decisions.md (nova ADR)
- [ ] docs/02-architecture.md
- [ ] docs/03-cache-strategy.md

Aguardando confirmação antes de implementar.
```

## 3. Referência rápida — o que está definido em `docs/`

### Backend (`docs/02-architecture.md`)

- Arquitetura modular NestJS por feature (`products/`, `categories/`).
- Camadas: Controller → Service → Prisma/Redis.
- Módulos compartilhados: `PrismaModule`, `RedisModule`.
- DTOs com `class-validator` em cada feature module.
- **Não** usar estrutura Clean Architecture com pastas `domain/application/infrastructure` — isso não está em `docs/`.

### Frontend (`docs/02-architecture.md`)

- SPA simples: `pages/` (ProductList, ProductForm, ProductDetails), `components/`, `services/api.ts`, `types/`.
- Framework: React, VueJS ou Angular — **pendente** (ADR-005).

### Modelagem (`docs/01-requirements.md`)

- Product: id, name, description, price, categoryId.
- Category: id, name.
- Relação: Product N:1 Category.

Pontos **não definidos** no PDF — confirmar com usuário antes de migration:
- `categoryId` obrigatório ou opcional?
- `onDelete` ao remover categoria com produtos vinculados?

### Cache (`docs/03-cache-strategy.md`)

- Endpoints cacheados: `GET /products/:id`, `GET /products` (paginado).
- Padrão Cache-Aside; invalidação ativa em create/update/delete.
- Chaves: `product:{id}`, `products:list:page={page}:limit={limit}`.
- Invalidação de listagem: `products:list:*` via SCAN (não KEYS em produção).
- TTL configurável via `.env` como rede de segurança.

### Infraestrutura (`docs/decisions.md` ADR-006)

- `docker-compose.yml` na raiz: backend, frontend, banco, Redis.
- Terraform/ECS/S3 **não fazem parte do escopo documentado**.

## 4. Regra geral de camadas (de `docs/02-architecture.md`)

- **Controller**: roteamento HTTP, validação de entrada, resposta HTTP — sem regra de negócio.
- **Service**: regra de negócio, orquestração Prisma + Redis (inclui invalidação de cache).
- **Prisma**: acesso a dados via `PrismaService` injetável.
- **Redis**: cache via `RedisService` (`get`, `set`, `del`, `delByPattern`).
- **Frontend**: componentes de UI não fazem fetch diretamente; usam `services/api.ts`.
