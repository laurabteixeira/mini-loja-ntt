# 06 – Integração Final (Etapa 13)

Guia para validar o fluxo completo frontend + backend + cache via `docker-compose`.

## 1. Subir o stack

```bash
cp .env.example .env          # opcional — defaults do compose já funcionam
docker compose up --build -d
```

| Serviço  | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:3000 |
| Health   | http://localhost:3000/health |

O backend executa `prisma migrate deploy` e **seed** no startup (categorias/produtos iniciais).

## 2. Variáveis de ambiente

| Variável | Onde | Uso |
|----------|------|-----|
| `VITE_API_URL` | build do frontend | URL da API no browser (`http://localhost:3000`) |
| `CORS_ORIGIN` | backend | Origem principal; em dev, qualquer `http://localhost:<porta>` é aceita |
| `FRONTEND_PORT` | compose | Porta do frontend no host (padrão `5173`) |

Arquivos de referência: `.env.example` (raiz), `backend/.env.example`, `frontend/.env.example`.

## 3. Fluxo manual no frontend

1. Abrir http://localhost:5173
2. **Criar categoria** — em `/products/new`, campo "Nova categoria" → **Criar categoria**
3. **Criar produto** — preencher formulário → **Criar produto**
4. **Listar** — voltar à home `/`; produto aparece na tabela
5. **Detalhes** — **Ver detalhes**
6. **Editar** — **Editar** → alterar campos → **Salvar**
7. **Remover** — na tela de detalhes → **Remover** → confirmar

## 4. Validar cache (Redis)

Com o stack no ar:

```bash
# Popular cache
curl http://localhost:3000/products/1
curl 'http://localhost:3000/products?page=1&limit=10'

# Inspecionar chaves
docker exec mini-loja-redis redis-cli GET product:1
docker exec mini-loja-redis redis-cli GET 'products:list:page=1:limit=10'

# Editar produto no frontend ou:
curl -X PATCH http://localhost:3000/products/1 \
  -H 'Content-Type: application/json' \
  -d '{"name":"Updated"}'

# Chave de detalhe deve sumir
docker exec mini-loja-redis redis-cli GET product:1
# (nil)
```

Detalhes em [`03-cache-strategy.md`](03-cache-strategy.md) e [`05-insomnia-testing.md`](05-insomnia-testing.md).

## 5. Script automatizado (API + cache)

Requer backend + Redis acessíveis:

```bash
chmod +x scripts/validate-integration.sh
./scripts/validate-integration.sh
```

Variáveis opcionais: `API_URL`, `REDIS_HOST`, `REDIS_PORT`.

## 6. Checklist Etapa 13

- [ ] `docker compose up --build` sobe os 4 serviços
- [ ] Fluxo frontend completo (categoria → produto → listar → detalhes → editar → remover)
- [ ] Cache invalidado após create/update/delete (Redis ou script)
- [ ] CORS OK com frontend em `localhost:5173` (ou porta configurada em `FRONTEND_PORT`)
