# SKILL — Revisor de Código

Este skill contém os comandos, pipeline sugerido e o formato de report que a persona `revisor` deve usar.

## 0. Fonte da verdade (`docs/`)

Valide o código contra os documentos abaixo. Se este skill contradizer `docs/`, **`docs/` prevalece**.

| Documento | Uso na revisão |
|---|---|
| `docs/01-requirements.md` | Checklist obrigatório (seção 12) e critérios de avaliação (seção 10) |
| `docs/02-architecture.md` | Estrutura de pastas, separação Controller/Service, módulos |
| `docs/03-cache-strategy.md` | Chaves, TTL, fluxos cache-aside e invalidação |
| `docs/decisions.md` | Decisões registradas (ORM, cache-aside, docker-compose) |

## 1. Comandos de verificação (backend)

```bash
# Lint
npm run lint

# Testes unitários
npm run test

# Testes de integração / e2e
npm run test:e2e

# Cobertura
npm run test:cov

# Prisma — validar schema e migrations
npx prisma validate
npx prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-schema-datasource prisma/schema.prisma
```

## 2. Comandos de verificação (frontend)

```bash
npm run lint
npm run build   # garante que o build de produção não quebra
npm run test    # se houver testes de componente
```

## 3. Pipeline de CI/CD sugerido (GitHub Actions)

> Nota: CI/CD não está exigido em `docs/01-requirements.md`, mas é boa prática. Sugerir apenas se o usuário solicitar.

Estrutura recomendada em `.github/workflows/`:

```
.github/workflows/
├── ci.yml        # roda em todo PR: lint + testes unitários + integração (backend e frontend)
└── deploy.yml     # roda em merge na master: build + deploy (se aplicável)
```

`ci.yml` deve, no mínimo:
1. Subir serviços de teste (PostgreSQL e Redis via `services:` do GitHub Actions).
2. Rodar `prisma migrate deploy` no banco de teste.
3. Rodar lint.
4. Rodar testes unitários.
5. Rodar testes de integração/e2e.
6. Bloquear merge se qualquer etapa falhar.

## 4. Formato de report de revisão

Ao revisar um conjunto de mudanças, a persona `revisor` deve responder neste formato:

```
## Revisão — <escopo revisado>

Docs consultados: docs/01-requirements.md, docs/03-cache-strategy.md

✅ OK:
- <item verificado com sucesso>

⚠️ Atenção (não bloqueante):
- <item> — sugestão: <o que fazer>

⛔ Bloqueante:
- <item> — motivo: <por que impede o commit/PR> — ref: docs/<arquivo> seção <N>

Testes: <passando / falhando / ausentes>
Recomendação: <aprovado para commit | ajustar antes de prosseguir>
```

## 5. Critérios de avaliação (base: `docs/01-requirements.md`)

Use a seção 10 (Critérios de Avaliação) e a seção 12 (Checklist de Requisitos Obrigatórios) como base da revisão. Pontos-chave:

- Estrutura clara do projeto (conforme `docs/02-architecture.md`).
- Qualidade do código (boas práticas NestJS, DTOs, módulos, services).
- Uso correto do Prisma (modelagem coerente, migrations versionadas).
- Cache Redis em `GET /products/:id` e `GET /products` (paginado), com invalidação conforme `docs/03-cache-strategy.md`.
- README completo (máx. 1 página): subir projeto, testar endpoints, estratégia de cache.
- Frontend funcional: listagem, formulário, detalhes.
- `docker-compose` sobe backend + frontend + banco + Redis.

## 6. Regra de tamanho de PR

Antes de aprovar, sempre rodar:

```bash
git diff --stat master... | tail -1
```

Se o número de arquivos alterados exceder 30, marcar como ⛔ Bloqueante e sugerir a divisão do trabalho em PRs menores.
