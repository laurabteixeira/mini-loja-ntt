# 01 – Requisitos do Projeto: Mini Loja (NTT Data)

> Fonte única de verdade: PDF "Desafio Técnico – Mini Loja NTT Data". Nenhum requisito adicional foi inventado além do que está descrito no documento original.

## 1. Objetivo do Projeto

Criar uma aplicação dividida em **backend (NestJS)** e **frontend (React, VueJS ou Angular)** para gerenciar **produtos** e **categorias** em uma "Mini Loja".

## 2. Requisitos Funcionais

### 2.1 Backend
- RF01 – CRUD completo para a entidade **Produto** (criar, listar, buscar por id, atualizar, remover).
- RF02 – CRUD completo para a entidade **Categoria** (criar, listar, buscar por id, atualizar, remover).
- RF03 – Relacionamento entre Produto e Categoria: um Produto pertence a uma Categoria.
- RF04 – Cache com Redis para:
  - `GET /products/:id`
  - `GET /products` (lista paginada)
- RF05 – Ao criar, atualizar ou remover um produto, o cache relacionado deve ser invalidado.
- RF06 – Validação mínima de dados de entrada via DTOs.
- RF07 – Persistência em banco de dados relacional (PostgreSQL ou SQLite) usando Prisma.

### 2.2 Frontend
- RF08 – Página para listar produtos (paginação opcional).
- RF09 – Formulário para criar ou editar produto.
- RF10 – Página para ver detalhes de um produto.

> Observação do desafio: o design não será avaliado – apenas a funcionalidade. Fica a critério do desenvolvedor deixar apenas funcional ou funcional e mais elegante.

## 3. Requisitos Não Funcionais

- RNF01 – Backend implementado obrigatoriamente com **NestJS**.
- RNF02 – ORM obrigatório: **Prisma**.
- RNF03 – Cache obrigatório: **Redis** (pode rodar local ou em Docker).
- RNF04 – Frontend implementado em **React, VueJS ou Angular** (uma dessas opções).
- RNF05 – Banco de dados relacional suportado pelo Prisma: **PostgreSQL, MySQL ou SQLite**.
- RNF06 – Uso de variáveis de ambiente em arquivos `.env`.
- RNF07 – Código deve seguir boas práticas (estrutura clara, DTOs, módulos, services).
- RNF08 – Foco em qualidade, clareza e boas práticas – não em design visual.

## 4. Entidades

### 4.1 Produto (`Product`)
| Campo | Tipo | Observação |
|---|---|---|
| id | auto | gerado automaticamente |
| name | string | nome do produto |
| description | string | descrição do produto |
| price | float | preço do produto |
| categoryId | relacionamento | referência à Categoria (**obrigatório** — ADR-007) |

### 4.2 Categoria (`Category`)
| Campo | Tipo | Observação |
|---|---|---|
| id | auto | gerado automaticamente |
| name | string | nome da categoria |

## 5. Relacionamentos

- Um **Produto** pertence a uma **Categoria** (relação N:1 de Produto para Categoria).
- **`categoryId` é obrigatório** — produto não pode existir sem categoria (ADR-007).
- **Delete de Categoria com produtos vinculados é bloqueado** — `onDelete: Restrict`; API retorna erro claro (ADR-007).

## 6. Requisitos do Backend (NestJS + Prisma + Redis)

1. CRUD completo para Produto e Categoria.
2. Relacionamento Produto → Categoria.
3. Cache com Redis para `GET /products/:id` e `GET /products` (lista paginada).
4. Invalidação de cache ao criar, atualizar ou remover produto.
5. Exemplo mínimo de validação via DTOs.
6. Banco de dados relacional (PostgreSQL ou SQLite) usando Prisma.

## 7. Requisitos do Frontend

1. Página para listar produtos (paginação opcional).
2. Formulário para criar ou editar produto.
3. Página para ver detalhes de um produto.

## 8. Requisitos de Cache

- Cache obrigatório para os endpoints:
  - `GET /products/:id`
  - `GET /products` (lista paginada)
- Invalidação obrigatória do cache relacionado em qualquer operação de escrita sobre Produto (create, update, delete).
- Detalhamento completo da estratégia em `03-cache-strategy.md`.

## 9. Entregáveis

- Código hospedado em repositório (GitHub ou similar).
- Instruções para rodar o projeto (preferencialmente via `docker-compose`, ou instruções manuais).
- README com no máximo 1 página contendo:
  - Como subir backend e frontend.
  - Como testar os endpoints.
  - Explicação da estratégia de cache implementada.

## 10. Critérios de Avaliação

- Estrutura clara do projeto.
- Qualidade do código (boas práticas NestJS, DTOs, módulos, services).
- Uso correto do Prisma (modelagem, migrations).
- Implementação do cache com Redis (incluindo invalidação).
- Organização geral (README, instruções).
- Frontend funcional.

## 11. Restrições do Desafio

- Banco de dados: qualquer banco suportado pelo Prisma (PostgreSQL, MySQL ou SQLite).
- Redis pode rodar local ou em Docker.
- Uso obrigatório de variáveis de ambiente em arquivos `.env`.
- Foco em qualidade, clareza e boas práticas – não em design.
- README deve ser objetivo e claro, com no máximo 1 página.
- Design não será avaliado.

## 12. Checklist de Requisitos Obrigatórios

- [x] Backend em NestJS
- [x] Prisma ORM configurado
- [x] Banco relacional (PostgreSQL ou SQLite) configurado via Prisma
- [x] Entidade Produto (id, name, description, price, categoryId)
- [x] Entidade Categoria (id, name)
- [x] Relacionamento Produto → Categoria
- [x] CRUD completo de Produto
- [x] CRUD completo de Categoria
- [x] DTOs com validação mínima
- [x] Redis configurado (local ou Docker)
- [x] Cache em `GET /products/:id`
- [x] Cache em `GET /products` (lista paginada)
- [x] Invalidação de cache em create/update/delete de produto
- [x] Frontend em React, VueJS ou Angular
- [x] Página de listagem de produtos
- [x] Formulário de criação/edição de produto
- [x] Página de detalhes de produto
- [x] Frontend consumindo a API do backend
- [x] Variáveis de ambiente em `.env`
- [x] Repositório hospedado (GitHub ou similar)
- [x] Instruções de execução (docker-compose ou manual)
- [x] README (máx. 1 página) com: subir projeto, testar endpoints, estratégia de cache
