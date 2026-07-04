# 03 – Estratégia de Cache (Redis)

## 1. Objetivo

Reduzir a carga sobre o banco de dados relacional para as operações de leitura de produtos mais frequentes, mantendo os dados servidos pelo cache consistentes com o banco através de invalidação nas operações de escrita.

## 2. Endpoints Cacheados

Conforme exigido pelo desafio, apenas os seguintes endpoints terão cache:

| Endpoint | Método | Descrição |
|---|---|---|
| `/products/:id` | GET | Detalhe de um produto específico |
| `/products` | GET | Listagem paginada de produtos (com filtros/paginação, se houver) |

Nenhum outro endpoint (categorias, escrita de produtos) será cacheado, pois isso não foi solicitado no desafio.

## 3. Formato das Chaves do Redis

Padrão de chave: `namespace:recurso:identificador`

- Detalhe de produto:
  ```
  product:{id}
  ```
  Exemplo: `product:42`

- Lista paginada de produtos (a paginação/filtros fazem parte da chave, pois cada combinação gera um resultado diferente):
  ```
  products:list:page={page}:limit={limit}
  ```
  Exemplo: `products:list:page=1:limit=10`

  Caso existam filtros adicionais (ex.: por categoria), eles devem compor a chave de forma determinística, por exemplo:
  ```
  products:list:page=1:limit=10:categoryId=3
  ```

> A chave deve ser sempre construída de forma determinística a partir dos mesmos parâmetros de entrada, para garantir que a mesma consulta sempre aponte para a mesma chave.

## 4. Fluxo de Leitura (Cache-Aside)

Estratégia adotada: **Cache-Aside (Lazy Loading)**.

1. Requisição chega ao `ProductsService`.
2. Service monta a chave do Redis correspondente à requisição (`product:{id}` ou `products:list:page=...`).
3. Service consulta o Redis:
   - **Cache hit**: retorna o valor armazenado (desserializado de JSON), sem consultar o banco.
   - **Cache miss**: consulta o Prisma/banco de dados, monta a resposta, grava no Redis com um TTL definido, e então retorna a resposta.
4. Resposta é enviada ao cliente (frontend) via controller.

## 5. Fluxo de Escrita e Invalidação

Estratégia adotada: **invalidação ativa (write-through de invalidação)** — a escrita não atualiza o cache diretamente, apenas remove as entradas afetadas, forçando a próxima leitura a repopular o cache (cache-aside).

Ao **criar**, **atualizar** ou **remover** um produto:

1. A operação de escrita é executada no banco via Prisma.
2. Em seguida, o service invalida:
   - A chave de detalhe específica: `product:{id}` (para update/delete; não se aplica a create, pois o id ainda não existia).
   - Todas as chaves de listagem: `products:list:*` (todas as páginas/combinações de filtros ficam potencialmente desatualizadas, pois a criação/remoção de um produto pode alterar a paginação e a contagem total).
3. A invalidação de múltiplas chaves de listagem (`products:list:*`) é feita via busca por padrão (`SCAN`/`KEYS` com prefixo) seguida de remoção (`DEL`), evitando o uso de `KEYS` em produção com bases muito grandes (preferindo `SCAN` de forma incremental).

## 6. TTL (Time To Live)

- Cada chave de cache possui um TTL configurável (ex.: 60 segundos, ajustável via variável de ambiente), como proteção adicional contra inconsistência em cenários não cobertos pela invalidação manual (ex.: alterações feitas diretamente no banco fora da aplicação).
- O TTL é uma camada de segurança complementar à invalidação explícita, não o mecanismo principal de consistência.

## 7. Cuidados Adotados

- Uso de chaves determinísticas e legíveis, facilitando debug e inspeção manual via `redis-cli`.
- Serialização/deserialização em JSON para armazenar objetos complexos (produto + categoria relacionada).
- Invalidação sempre executada **após** a confirmação da escrita no banco, para evitar invalidar o cache e, em seguida, falhar a escrita (o que deixaria o cache miss desnecessário, mas nunca inconsistente com dado incorreto).
- Separação de namespaces (`product:` vs `products:list:`) para permitir invalidação seletiva sem afetar chaves não relacionadas.

## 8. Limitações da Estratégia

- Ao criar/atualizar/remover um produto, **toda** a listagem em cache é invalidada (não apenas a página afetada), o que é uma simplificação aceitável para o escopo do desafio, mas gera mais cache misses do que uma invalidação granular por página.
- Uso de `SCAN`/`KEYS` por prefixo para invalidação de listagem tem custo proporcional ao número de chaves existentes; para o volume de dados de um desafio técnico isso é aceitável, mas não é a estratégia ideal para bases de produção em larga escala (onde se poderia usar, por exemplo, um versionamento de chave — cache key versioning).
- O TTL é uma rede de segurança, não substitui a invalidação explícita; em caso de falha na invalidação (ex.: Redis indisponível no momento da escrita), pode haver uma janela de inconsistência até o TTL expirar.
- Não há cache distribuído multi-região nem estratégia de cache warming — fora do escopo do desafio.
