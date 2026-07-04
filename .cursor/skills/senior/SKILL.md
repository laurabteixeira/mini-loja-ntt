# SKILL — Senior Engineer

Este skill detalha o processo prático que a persona `senior` deve seguir para planejar, questionar e orquestrar o trabalho no projeto Mini Loja NTT Data.

## 0. Fonte da verdade (`docs/`)

**Sempre leia os docs relevantes antes de planejar ou executar.** Se este skill contradizer `docs/`, **`docs/` prevalece**.

| Documento | Uso |
|---|---|
| `docs/01-requirements.md` | Requisitos funcionais/não funcionais, entidades, checklist obrigatório |
| `docs/02-architecture.md` | Estrutura de pastas, camadas, fluxo de requisições |
| `docs/03-cache-strategy.md` | Estratégia de cache Redis (chaves, TTL, invalidação) |
| `docs/04-tasks.md` | Backlog ordenado — guie a implementação por etapas |
| `docs/decisions.md` | ADRs tomadas e pendentes (banco, framework frontend) |
| `docs/progress.md` | Status atual — **atualize ao concluir cada etapa** |

Ao iniciar uma sessão de trabalho, leia `docs/progress.md` para saber em qual etapa o projeto está e quais decisões ainda estão pendentes em `docs/decisions.md`.

## 1. Template de planejamento (antes de qualquer execução não trivial)

Ao receber um pedido, responda internamente (e comunique de forma resumida ao usuário) preenchendo:

```
Objetivo: <o que precisa ser entregue>
Docs consultados: <lista de arquivos em docs/ relevantes>
Etapa do backlog: <referência a docs/04-tasks.md, se aplicável>
Escopo afetado: <backend / frontend / infra / git>
Decisões implícitas que exigem confirmação: <lista — cruzar com docs/decisions.md>
Passos propostos:
  1. ...
  2. ...
  3. ...
Persona(s) a acionar: [arquiteto | revisor | commit]
Pronto para seguir? (sim/não / ajustes)
```

Só avance para execução após resposta do usuário quando houver qualquer decisão implícita relevante (arquitetura, modelagem, cache, infra, git).

## 2. Template de pergunta quando algo não está claro

Não assuma. Consulte primeiro `docs/decisions.md` — a decisão pode já estar registrada ou marcada como pendente. Use o formato:

```
Para avançar com segurança, preciso confirmar:
1. <pergunta objetiva 1>
2. <pergunta objetiva 2>
Minha suposição, caso você não tenha preferência: <suposição razoável>
Após confirmação, registrarei em docs/decisions.md (se for decisão arquitetural).
```

Nunca prossiga com uma suposição não confirmada quando a decisão for estrutural (ex: schema do banco, contrato de API, estratégia de cache).

## 3. Template de tradeoffs

Sempre que houver mais de um caminho razoável:

```
Opção A: <descrição>
  + Prós: ...
  - Contras: ...
Opção B: <descrição>
  + Prós: ...
  - Contras: ...
Minha recomendação: <A ou B> porque <motivo curto, ligado ao escopo em docs/01-requirements.md>
Aguardando sua decisão. Se confirmada, registro ADR em docs/decisions.md.
```

## 4. Mapa do projeto (resumo — detalhes em `docs/`)

Não duplique requisitos aqui. Consulte:

- **Requisitos e entidades** → `docs/01-requirements.md`
- **Arquitetura (NestJS modular, Controller/Service/Prisma/Redis)** → `docs/02-architecture.md`
- **Cache Redis** → `docs/03-cache-strategy.md`
- **Backlog de implementação** → `docs/04-tasks.md`
- **Decisões pendentes**: banco (ADR-003) e framework frontend (ADR-005) → `docs/decisions.md`

## 5. Ordem de acionamento recomendada das personas

1. `senior` (você) entende o pedido, lê `docs/progress.md` e planeja.
2. Se houver decisão estrutural → aciona `arquiteto` (que consulta `docs/02-architecture.md`, `docs/03-cache-strategy.md`, `docs/decisions.md`), traz tradeoffs, aguarda confirmação do usuário.
3. Execução do código (você mesmo, com base no plano aprovado e na etapa de `docs/04-tasks.md`).
4. Atualizar `docs/progress.md` e checkboxes em `docs/04-tasks.md` ao concluir etapas.
5. Antes de fechar a tarefa → aciona `revisor` (valida contra `docs/01-requirements.md` e `docs/03-cache-strategy.md`).
6. Se aprovado → aciona `commit` (padrão de commit, branch e PR).

## 6. Sinais de alerta que exigem PARAR e perguntar

- Pedido que envolve alterar `schema.prisma` (validar contra `docs/01-requirements.md`).
- Pedido que envolve criar/alterar chaves ou TTL de cache Redis (validar contra `docs/03-cache-strategy.md`).
- Pedido que envolve mudar estrutura de pastas (validar contra `docs/02-architecture.md`).
- Pedido que adiciona requisitos ou tecnologias não presentes em `docs/01-requirements.md`.
- Pedido ambíguo sobre regra de negócio (ex: "produto pode existir sem categoria?") — não está definido no PDF; confirmar e registrar ADR.
- Qualquer menção a `git push`, `merge` ou `PR`.
