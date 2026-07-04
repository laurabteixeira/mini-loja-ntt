# 05 – Testes de API no Insomnia

> Guia para testar manualmente os endpoints do backend Mini Loja usando [Insomnia](https://insomnia.rest/).  
> **Alternativa:** documentação interativa em http://localhost:3000/docs — ver [`08-api-swagger.md`](08-api-swagger.md).  
> **Escopo atual:** Health + Categorias + Produtos com **cache Redis** (Etapas 4–7).

## 1. Pré-requisitos

1. Backend rodando localmente:

   ```bash
   docker compose up --build backend
   ```

   Ou, sem Docker:

   ```bash
   cd backend
   cp .env.example .env
   npm run start:dev
   ```

2. (Opcional) Dados iniciais via seed:

   ```bash
   cd backend
   npm run prisma:seed
   ```

   Cria 2 categorias (`Eletrônicos`, `Roupas`) e 2 produtos vinculados — útil para testar o bloqueio de delete (ADR-007).

3. Insomnia instalado ([download](https://insomnia.rest/download)).

## 2. Configurar ambiente no Insomnia

1. Abra o Insomnia → **Environments** (ícone de olho) → **Manage Environments**.
2. Crie um ambiente, ex.: `Mini Loja — Local`.
3. Adicione a variável:

   ```json
   {
     "base_url": "http://localhost:3000"
   }
   ```

4. Selecione esse ambiente antes de enviar as requisições.

Nas URLs abaixo, use `{{ base_url }}` como prefixo (Insomnia substitui automaticamente).

## 3. Organização sugerida no Insomnia

Crie uma **Collection** chamada `Mini Loja API` com pastas:

```
Mini Loja API/
├── Health
├── Categories
└── Products
```

Para cada requisição: **New HTTP Request** → escolha o método → URL → aba **Body** (JSON) quando aplicável.

---

## 4. Health

### GET — Health check

| Campo | Valor |
|---|---|
| **Método** | `GET` |
| **URL** | `{{ base_url }}/health` |
| **Body** | *(nenhum)* |

**Resposta esperada (200):**

```json
{
  "status": "ok",
  "service": "mini-loja-api",
  "databaseConnected": true,
  "redisConnected": true,
  "databaseUrlConfigured": true,
  "redisUrlConfigured": true
}
```

**O que validar:**

- `databaseConnected: true` — Postgres acessível.
- `redisConnected: true` — Redis acessível (Etapa 6).
- Se algum for `false`, confira se os containers `postgres` e `redis` estão up.

---

## 5. Categories

Base path: `{{ base_url }}/categories`

### 5.1 POST — Criar categoria

| Campo | Valor |
|---|---|
| **Método** | `POST` |
| **URL** | `{{ base_url }}/categories` |
| **Header** | `Content-Type: application/json` |
| **Body (JSON)** | ver abaixo |

```json
{
  "name": "Livros"
}
```

**Resposta esperada (201 Created):**

```json
{
  "id": 3,
  "name": "Livros"
}
```

**Erros comuns:**

| Status | Causa | Body de exemplo |
|---|---|---|
| `400` | `name` ausente ou inválido | `{ "message": [...], "error": "Bad Request" }` |

---

### 5.2 GET — Listar categorias

| Campo | Valor |
|---|---|
| **Método** | `GET` |
| **URL** | `{{ base_url }}/categories` |
| **Body** | *(nenhum)* |

**Resposta esperada (200):**

```json
[
  { "id": 1, "name": "Eletrônicos" },
  { "id": 2, "name": "Roupas" }
]
```

*(IDs e nomes variam conforme seed/dados criados.)*

---

### 5.3 GET — Buscar categoria por ID

| Campo | Valor |
|---|---|
| **Método** | `GET` |
| **URL** | `{{ base_url }}/categories/1` |
| **Body** | *(nenhum)* |

Substitua `1` pelo id desejado.

**Resposta esperada (200):**

```json
{
  "id": 1,
  "name": "Eletrônicos"
}
```

**Erros comuns:**

| Status | Causa |
|---|---|
| `404` | Categoria não existe |
| `400` | ID não numérico (ex.: `/categories/abc`) |

---

### 5.4 PATCH — Atualizar categoria

| Campo | Valor |
|---|---|
| **Método** | `PATCH` |
| **URL** | `{{ base_url }}/categories/1` |
| **Header** | `Content-Type: application/json` |
| **Body (JSON)** | ver abaixo |

```json
{
  "name": "Eletrônicos Premium"
}
```

**Resposta esperada (200):**

```json
{
  "id": 1,
  "name": "Eletrônicos Premium"
}
```

**Erros comuns:**

| Status | Causa |
|---|---|
| `404` | Categoria não existe |
| `400` | Body inválido (ex.: `name` vazio) |

---

### 5.5 DELETE — Remover categoria

| Campo | Valor |
|---|---|
| **Método** | `DELETE` |
| **URL** | `{{ base_url }}/categories/3` |
| **Body** | *(nenhum)* |

Use um id de categoria **sem produtos vinculados** (ex.: categoria criada no POST 5.1).

**Resposta esperada (200):**

```json
{
  "id": 3,
  "name": "Livros"
}
```

**Cenário ADR-007 — delete bloqueado (409):**

Tente deletar uma categoria que ainda possui produtos (ex.: id `1` ou `2` após o seed):

| Campo | Valor |
|---|---|
| **Método** | `DELETE` |
| **URL** | `{{ base_url }}/categories/1` |

**Resposta esperada (409):**

```json
{
  "message": "Cannot delete category with linked products",
  "error": "Conflict",
  "statusCode": 409
}
```

**Erros comuns:**

| Status | Causa |
|---|---|
| `404` | Categoria não existe |
| `409` | Categoria com produtos vinculados (ADR-007) |

---

## 6. Products

Base path: `{{ base_url }}/products`

Todas as respostas de produto incluem o objeto `category` aninhado.

### 6.1 POST — Criar produto

| Campo | Valor |
|---|---|
| **Método** | `POST` |
| **URL** | `{{ base_url }}/products` |
| **Header** | `Content-Type: application/json` |
| **Body (JSON)** | ver abaixo |

```json
{
  "name": "Mouse Gamer",
  "description": "Mouse óptico 6400 DPI",
  "price": 129.99,
  "categoryId": 1
}
```

**Resposta esperada (201 Created):**

```json
{
  "id": 3,
  "name": "Mouse Gamer",
  "description": "Mouse óptico 6400 DPI",
  "price": 129.99,
  "categoryId": 1,
  "createdAt": "2026-07-04T13:00:00.000Z",
  "updatedAt": "2026-07-04T13:00:00.000Z",
  "category": {
    "id": 1,
    "name": "Eletrônicos"
  }
}
```

**Erros comuns:**

| Status | Causa |
|---|---|
| `400` | Campos inválidos ou ausentes |
| `404` | `categoryId` não existe |

---

### 6.2 GET — Listar produtos (paginado)

| Campo | Valor |
|---|---|
| **Método** | `GET` |
| **URL** | `{{ base_url }}/products?page=1&limit=10` |
| **Body** | *(nenhum)* |

Query params opcionais:

| Param | Default | Descrição |
|---|---|---|
| `page` | `1` | Página (≥ 1) |
| `limit` | `10` | Itens por página (1–100) |

**Resposta esperada (200):**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Notebook",
      "description": "Notebook 15 polegadas",
      "price": 3499.99,
      "categoryId": 1,
      "createdAt": "...",
      "updatedAt": "...",
      "category": { "id": 1, "name": "Eletrônicos" }
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### 6.3 GET — Buscar produto por ID

| Campo | Valor |
|---|---|
| **Método** | `GET` |
| **URL** | `{{ base_url }}/products/1` |
| **Body** | *(nenhum)* |

**Resposta esperada (200):** produto com `category` aninhada.

**Erros comuns:**

| Status | Causa |
|---|---|
| `404` | Produto não existe |
| `400` | ID não numérico |

---

### 6.4 PATCH — Atualizar produto

| Campo | Valor |
|---|---|
| **Método** | `PATCH` |
| **URL** | `{{ base_url }}/products/1` |
| **Header** | `Content-Type: application/json` |
| **Body (JSON)** | ver abaixo |

```json
{
  "name": "Notebook Pro",
  "price": 3999.99
}
```

Todos os campos são opcionais (`name`, `description`, `price`, `categoryId`).

**Resposta esperada (200):** produto atualizado com `category`.

**Erros comuns:**

| Status | Causa |
|---|---|
| `404` | Produto ou `categoryId` informado não existe |
| `400` | Body inválido |

---

### 6.5 DELETE — Remover produto

| Campo | Valor |
|---|---|
| **Método** | `DELETE` |
| **URL** | `{{ base_url }}/products/1` |
| **Body** | *(nenhum)* |

**Resposta esperada (200):** produto removido (com `category` na resposta).

**Erros comuns:**

| Status | Causa |
|---|---|
| `404` | Produto não existe |

> Após deletar produtos de uma categoria, o **DELETE** `/categories/:id` passa a funcionar (ADR-007).

---

## 7. Fluxo de teste recomendado (ordem)

Execute nesta sequência para validar o CRUD completo:

1. **GET** `/health` — confirmar `databaseConnected: true`
2. **GET** `/categories` — ver estado inicial (seed ou vazio)
3. **POST** `/categories` — criar `"Livros"` (anote o `id` retornado)
4. **GET** `/categories/:id` — buscar a categoria criada
5. **PATCH** `/categories/:id` — renomear para `"Livros e Revistas"`
6. **DELETE** `/categories/1` — deve retornar **409** (categoria com produtos do seed)
7. **DELETE** `/categories/:id` — deletar a categoria vazia criada no passo 3 → **200**
8. **GET** `/categories/:id` — confirmar **404** após delete

**Produtos:**

9. **GET** `/products?page=1&limit=10` — listar com paginação
10. **POST** `/products` — criar produto com `categoryId` válido
11. **GET** `/products/:id` — confirmar `category` aninhada
12. **PATCH** `/products/:id` — atualizar nome/preço
13. **DELETE** `/products/:id` — remover produto

**Cache (Etapa 7):**

14. **GET** `/products/1` duas vezes — segunda leitura deve vir do Redis (chave `product:1`)
15. **PATCH** `/products/1` — invalida `product:1` e `products:list:*`
16. **GET** `/products/1` — deve refletir dados atualizados (cache repopulado)
17. Verificar chaves no Redis: `docker compose exec redis redis-cli KEYS '*product*'`

---

## 8. Testes de cache Redis (Etapa 7)

Estratégia documentada em `docs/03-cache-strategy.md`.

### Chaves utilizadas

| Endpoint | Chave Redis |
|---|---|
| `GET /products/:id` | `product:{id}` |
| `GET /products?page=X&limit=Y` | `products:list:page=X:limit=Y` |

TTL padrão: `CACHE_TTL` (60s no `.env` / docker-compose).

### Cenário 1 — Cache hit em detalhe

1. **GET** `{{ base_url }}/products/1` — primeira vez (cache miss → grava no Redis)
2. Repita a mesma requisição — cache hit (resposta idêntica, sem nova query ao banco)
3. No terminal:

   ```bash
   docker compose exec redis redis-cli GET product:1
   ```

   Deve retornar JSON do produto.

### Cenário 2 — Cache hit em listagem

1. **GET** `{{ base_url }}/products?page=1&limit=10`
2. Repita — cache hit na chave `products:list:page=1:limit=10`

   ```bash
   docker compose exec redis redis-cli KEYS 'products:list:*'
   ```

### Cenário 3 — Invalidação em update

1. **GET** `/products/1` — popula cache
2. **PATCH** `/products/1` com novo nome
3. **GET** `/products/1` — deve retornar o nome **atualizado**
4. `redis-cli GET product:1` — JSON com o nome novo

### Cenário 4 — Invalidação em create/delete

- **POST** `/products` → invalida todas as chaves `products:list:*` (listagem desatualizada)
- **DELETE** `/products/:id` → remove `product:{id}` e invalida `products:list:*`

Após create ou delete, repita **GET** `/products?page=1&limit=10` — a contagem/lista deve refletir a mudança.

---

## 9. Dicas no Insomnia

- **Duplicar requisição:** clique direito → Duplicate — útil para testar outro id sem recriar tudo.
- **Histórico:** aba **Timeline** mostra requests/responses anteriores.
- **Exportar collection:** **Collection → Import/Export** — compartilhe com o time ou versionize depois.
- **Variáveis de path:** crie `category_id` / `product_id` no environment.

---

## Referências

- Requisitos: `docs/01-requirements.md`
- Estratégia de cache: `docs/03-cache-strategy.md`
- Regras de delete de categoria: ADR-007 em `docs/decisions.md`
- Backlog: `docs/04-tasks.md`
