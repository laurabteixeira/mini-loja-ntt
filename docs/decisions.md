# Decisions – Registro de Decisões Arquiteturais (ADR Simplificado)

> Este documento registra as decisões arquiteturais tomadas para o projeto Mini Loja. Cada entrada segue o formato: decisão, alternativas consideradas, motivo da escolha, vantagens e desvantagens.

---

## ADR-001 – Estrutura de Monorepo (backend + frontend no mesmo repositório)

- **Decisão tomada**: Manter backend e frontend em pastas separadas (`backend/`, `frontend/`) dentro de um único repositório.
- **Alternativas consideradas**:
  - Dois repositórios separados (um para backend, outro para frontend).
- **Motivo da escolha**: O desafio pede um único repositório entregável, e um monorepo simplifica a entrega, o versionamento e a execução via `docker-compose`.
- **Vantagens**:
  - Facilita a entrega e avaliação (um único link de repositório).
  - Simplifica orquestração via `docker-compose` na raiz.
  - Histórico de commits unificado.
- **Desvantagens**:
  - Menor isolamento entre times/deploys (irrelevante no escopo de um desafio técnico).

---

## ADR-002 – ORM: Prisma

- **Decisão tomada**: Usar Prisma como ORM para acesso ao banco de dados relacional.
- **Alternativas consideradas**:
  - TypeORM
  - Sequelize
- **Motivo da escolha**: Prisma é uma exigência explícita do desafio.
- **Vantagens**:
  - Migrations declarativas e simples via `schema.prisma`.
  - Tipagem forte gerada automaticamente (Prisma Client).
  - Boa integração com NestJS.
- **Desvantagens**:
  - Menor flexibilidade para queries muito complexas em comparação a SQL puro (não relevante para o escopo deste CRUD).

---

## ADR-003 – Banco de Dados Relacional

- **Decisão tomada**: A definir entre PostgreSQL ou SQLite no momento da implementação (ambos permitidos pelo desafio).
- **Alternativas consideradas**:
  - PostgreSQL (via Docker)
  - SQLite (arquivo local, zero configuração)
  - MySQL
- **Motivo da escolha**: Ambos atendem ao requisito do desafio; a escolha final impacta apenas a configuração do `docker-compose` e da `DATABASE_URL`. Recomenda-se PostgreSQL caso se deseje demonstrar uso mais próximo de produção (via Docker), ou SQLite para simplicidade máxima de execução local sem dependências externas.
- **Vantagens**:
  - PostgreSQL: mais próximo de um cenário de produção real, fácil de orquestrar via docker-compose.
  - SQLite: zero configuração, ideal para rodar rapidamente sem Docker.
- **Desvantagens**:
  - PostgreSQL: exige um container adicional.
  - SQLite: menos representativo de um ambiente de produção real.

---

## ADR-004 – Cache: Redis com estratégia Cache-Aside

- **Decisão tomada**: Implementar cache com Redis utilizando o padrão Cache-Aside (Lazy Loading) para os endpoints `GET /products/:id` e `GET /products`, com invalidação explícita nas operações de escrita.
- **Alternativas consideradas**:
  - Write-Through (atualizar o cache diretamente a cada escrita).
  - Cache apenas com TTL, sem invalidação explícita.
- **Motivo da escolha**: Cache-Aside é o padrão mais simples e amplamente utilizado para esse tipo de cenário, exigido implicitamente pelo desafio ("cache com invalidação relacionada"). Evita a complexidade de manter o cache sempre sincronizado em toda escrita (Write-Through), delegando a repopulação para a próxima leitura.
- **Vantagens**:
  - Simplicidade de implementação.
  - Cache sempre consistente após invalidação, sem necessidade de replicar toda lógica de escrita no cache.
  - Fácil de explicar e testar.
- **Desvantagens**:
  - Primeira leitura após invalidação sempre é um cache miss (leve overhead).
  - Invalidação de listagem é feita de forma ampla (todas as páginas), não granular.

---

## ADR-005 – Framework de Frontend

- **Decisão tomada**: A definir entre React, VueJS ou Angular no momento da implementação (todas as opções são aceitas pelo desafio).
- **Alternativas consideradas**:
  - React
  - VueJS
  - Angular
- **Motivo da escolha**: O desafio permite qualquer uma das três opções e avalia apenas funcionalidade, não design. A escolha final deve priorizar produtividade e familiaridade da equipe/desenvolvedor.
- **Vantagens/Desvantagens**: A ser detalhado no momento da escolha final, mas de forma geral:
  - React: grande ecossistema, flexibilidade, curva de aprendizado moderada.
  - Vue: simplicidade e curva de aprendizado suave.
  - Angular: mais estruturado, porém mais verboso para um projeto pequeno.

---

## ADR-006 – Orquestração via Docker Compose

- **Decisão tomada**: Disponibilizar um `docker-compose.yml` na raiz do projeto para subir backend, frontend, banco de dados e Redis com um único comando.
- **Alternativas consideradas**:
  - Apenas instruções manuais de instalação (sem Docker).
- **Motivo da escolha**: O desafio indica preferência explícita por `docker-compose` como forma de entrega/execução.
- **Vantagens**:
  - Facilita a avaliação por terceiros (setup em um único comando).
  - Ambiente consistente entre diferentes máquinas.
- **Desvantagens**:
  - Exige Docker instalado na máquina de quem for rodar (mitigado por também fornecer instruções manuais como alternativa).
