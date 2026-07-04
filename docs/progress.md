# Progress – Acompanhamento do Projeto Mini Loja

> Este documento deve ser atualizado ao longo do desenvolvimento, refletindo o status real do projeto a cada etapa concluída.

## Status Geral do Projeto

- **Status**: 🔴 Não iniciado
- **Fase atual**: Documentação inicial concluída (specs em `docs/`)
- **Próxima fase**: Setup de infraestrutura (Etapa 0 e 1 de `04-tasks.md`)

## Tarefas Concluídas

- [x] Leitura e interpretação do PDF do desafio técnico
- [x] Criação de `docs/01-requirements.md`
- [x] Criação de `docs/02-architecture.md`
- [x] Criação de `docs/03-cache-strategy.md`
- [x] Criação de `docs/04-tasks.md`
- [x] Criação de `docs/decisions.md`

## Tarefas em Andamento

- Nenhuma tarefa de implementação em andamento no momento.

## Tarefas Pendentes

- Todas as etapas descritas em `04-tasks.md`, da Etapa 0 (Setup do Repositório) até a Etapa 14 (Documentação e Entrega).

## Riscos

- **Escolha do banco de dados e do framework de frontend ainda não confirmada** (ver ADR-003 e ADR-005 em `decisions.md`) — pode impactar o setup inicial se decidido tardiamente.
- **Estratégia de invalidação de listagem ampla** (invalida todas as páginas) pode gerar mais cache misses do que o ideal em cenários com muitos produtos — risco aceito conforme `03-cache-strategy.md`.
- **Dependência de Docker** para o fluxo de execução recomendado — mitigado com instruções manuais alternativas no README final.

## Observações

- Toda a documentação inicial foi baseada exclusivamente no PDF do desafio, sem inclusão de requisitos não solicitados.
- Nenhuma linha de código de aplicação foi escrita nesta etapa, conforme solicitado.

## Próximos Passos

1. Confirmar decisões pendentes (banco de dados e framework de frontend) em `decisions.md`.
2. Iniciar Etapa 0 – Setup do Repositório (`04-tasks.md`).
3. Iniciar Etapa 1 – Infraestrutura Base (Docker).
4. Atualizar este documento a cada etapa concluída.
