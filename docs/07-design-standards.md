# 07 – Padrões de Design e UI/UX (Frontend)

> Documento de referência para a evolução visual e de experiência do frontend Mini Loja, **após** a entrega funcional (Etapas 0–14). Toda implementação de UI deve seguir estas regras antes de merge.

## 1. Objetivo

Elevar a qualidade da interface mantendo simplicidade: UI **limpa, minimalista e intuitiva**, com código frontend **organizado**, componentes **reutilizáveis** e biblioteca **shadcn/ui** sobre Tailwind CSS.

## 2. Princípios de UX (prioridade máxima)

1. **Fluidez** — transições suaves; evitar saltos de layout (CLS); feedback imediato em ações (loading nos botões, toasts discretos).
2. **Simplicidade** — uma ação principal por tela; textos curtos; hierarquia visual clara (título → conteúdo → ações).
3. **Intuitividade** — padrões web conhecidos (tabela/lista, formulário vertical, breadcrumbs ou voltar explícito); estados vazios com CTA claro.
4. **Previsibilidade** — destrutivo (ex.: deletar) sempre com confirmação; erros de API exibidos em linguagem humana.
5. **Acessibilidade mínima** — contraste adequado preto/branco; labels em inputs; `aria-busy` / `role="status"` em skeletons e carregamentos.

## 3. Identidade visual

### 3.1 Paleta base (monocromática)

| Token | Uso | Valor sugerido (Tailwind) |
|-------|-----|---------------------------|
| Fundo | página, cards | `white`, `gray-50` |
| Texto primário | títulos, corpo | `gray-900`, `black` |
| Texto secundário | hints, metadados | `gray-500`, `gray-600` |
| Bordas / divisores | cards, inputs, tabela | `gray-200`, `gray-300` |
| Superfície elevada | cards, modais | `white` + borda sutil |

**Regra:** a interface é essencialmente **preto e branco** (escala de cinzas). Não usar cores saturadas em fundos, textos ou bordas decorativas.

### 3.2 Cores de destaque (uso restrito)

Cores **leves, não saturadas e claras** — **somente** para:

| Contexto | Exemplo | Tom sugerido |
|----------|---------|--------------|
| Botão de ação destrutiva | Remover produto | `red-50` fundo, `red-700` texto, hover `red-100` |
| Tag / badge de categoria | Nome da categoria na listagem | `slate-100`, `blue-50`, `emerald-50` (pastéis) |
| Botão primário de ação importante | Salvar, Criar produto | `gray-900` (preto) — preferir monocromático |

**Proibido:** gradientes coloridos, múltiplas cores de marca, ícones multicoloridos, badges saturados (`red-500` sólido como fundo de tag).

### 3.3 Forma e espaçamento

- **Bordas arredondadas** em cards, inputs, botões e modais: `rounded-lg` (8px) ou `rounded-md` (6px) — consistente em todo o app.
- **Espaçamento:** escala Tailwind (`4`, `6`, `8`); padding generoso em cards (`p-4` / `p-6`).
- **Sombras:** discretas (`shadow-sm`) ou apenas borda — evitar `shadow-xl`.

## 4. shadcn/ui

### 4.1 Decisão

Adotar **shadcn/ui** (componentes copiados para o repo, Radix + Tailwind) — ver **ADR-008** em `docs/decisions.md`.

### 4.2 Componentes base a utilizar

| Componente shadcn | Uso no Mini Loja |
|-------------------|------------------|
| `Button` | ações primárias, secundárias, destructive |
| `Input`, `Textarea`, `Label` | formulário de produto |
| `Select` | categoria no formulário |
| `Table` | listagem de produtos |
| `Skeleton` | estados de carregamento |
| `Badge` | tags de categoria |
| `Card` | agrupamento de conteúdo (detalhes, formulário) |
| `Alert` | erros de API |
| `Dialog` | confirmação de exclusão |
| `DropdownMenu` ou `Select` | filtros |

Instalar apenas o necessário (`npx shadcn@latest add <component>`). Customizar tokens no `tailwind.config` / CSS variables para manter paleta preto/branco.

### 4.3 Theming

- Tema **light** apenas (escopo do desafio).
- CSS variables shadcn alinhadas à escala de cinzas (`--background`, `--foreground`, `--muted`, `--destructive` em tons suaves).

## 5. Estados de carregamento (Skeletons)

**Obrigatório** substituir textos genéricos (“Carregando…”) por **skeletons** que espelhem o layout final:

| Tela | Skeleton |
|------|----------|
| ProductList | linhas da tabela (3–5 rows) + retângulo para filtros |
| ProductDetails | blocos para título, preço, descrição, categoria |
| ProductForm | campos do formulário (labels + inputs) |

Regras:

- Usar `Skeleton` do shadcn/ui.
- Manter dimensões próximas ao conteúdo real (evitar layout shift ao carregar dados).
- Desabilitar ações (botões) enquanto `loading === true` ou exibir skeleton no lugar do conteúdo — não ambos sobrepostos.

## 6. Filtros (produtos e categorias)

### 6.1 ProductList — filtros de produtos

| Filtro | Comportamento UX | Parâmetro API (a implementar no backend) |
|--------|------------------|------------------------------------------|
| Busca por nome | debounce ~300ms; ícone de busca; limpar filtro | `search` ou `name` (query string) |
| Categoria | select ou chips; opção “Todas” | `categoryId` |
| Paginação | mantida; resetar para página 1 ao mudar filtro | `page`, `limit` |

UI: barra de filtros **acima da tabela**, em card ou linha horizontal, com bordas arredondadas.

Estado vazio filtrado: mensagem clara (“Nenhum produto encontrado para estes filtros”) + botão limpar filtros.

### 6.2 Filtros de categorias (contexto)

- Na listagem: filtro por categoria (select alimentado por `GET /categories`).
- Tags de categoria na tabela: `Badge` com cor pastel; clicável opcional para filtrar por aquela categoria.

### 6.3 Cache (backend)

Se o backend filtrar por `categoryId` ou `search`, a chave Redis deve seguir `docs/03-cache-strategy.md`:

```
products:list:page={page}:limit={limit}:categoryId={id}
products:list:page={page}:limit={limit}:search={term}
```

Invalidação continua via `products:list:*`.

## 7. Organização de código (frontend)

### 7.1 Estrutura de pastas alvo

```
frontend/src/
├── components/
│   ├── ui/              # shadcn/ui (Button, Skeleton, Table, …)
│   ├── layout/          # Layout, Header, PageContainer
│   ├── products/        # ProductTable, ProductFilters, ProductRowSkeleton
│   └── shared/          # Pagination, EmptyState, ErrorAlert
├── pages/
│   ├── ProductList/
│   ├── ProductForm/
│   └── ProductDetails/
├── hooks/               # useProducts, useCategories, useDebounce
├── lib/                 # utils (cn), formatters (formatPrice)
├── services/
└── types/
```

### 7.2 Regras de código limpo

1. **Pages enxutas** — orquestram hooks + composição de componentes; sem lógica de formatação inline repetida.
2. **Um componente, uma responsabilidade** — tabela separada de filtros; skeletons em arquivos próprios.
3. **Hooks para data fetching** — encapsular `loading`, `error`, `refetch` (ex.: `useProductList(filters)`).
4. **Utilitários compartilhados** — `formatPrice`, `formatDate` em `lib/formatters.ts`.
5. **Tipagem estrita** — props explícitas; evitar `any`.
6. **Sem estilos ad hoc** — preferir classes Tailwind + variantes shadcn; extrair padrões repetidos para componentes.

### 7.3 Nomenclatura

- Componentes: `PascalCase` (`ProductFilters.tsx`).
- Hooks: `use` prefix (`useProductList.ts`).
- Arquivos shadcn: kebab-case em `components/ui/` (padrão da CLI).

## 8. Padrões por tela

### ProductList

- Header: título + botão “Novo produto” (preto).
- Filtros + tabela em `Card` com `rounded-lg`.
- Skeleton na carga inicial; spinner só em ações pontuais (ex.: paginação se necessário).
- Paginação abaixo da tabela, discreta.

### ProductForm

- Formulário em `Card`; labels visíveis; erros de validação abaixo do campo.
- Categoria: `Select` shadcn; bloco “Nova categoria” colapsável ou secundário.
- Botões: Salvar (primário preto), Cancelar (outline cinza).

### ProductDetails

- Informações em grid/lista legível; categoria como `Badge` pastel.
- Ações: Editar (outline), Remover (destructive suave + `Dialog` de confirmação).

## 9. Checklist de revisão UI (antes de PR)

- [ ] Paleta preto/branco respeitada; cores pastel só em tags e destructive
- [ ] Bordas arredondadas consistentes
- [ ] Skeletons em todas as telas com fetch assíncrono
- [ ] Filtros de produto (e categoria) funcionais e com estado vazio tratado
- [ ] Componentes shadcn/ui usados (não reinventar Button/Input)
- [ ] Pages delegam para `components/` e `hooks/`
- [ ] Sem regressão funcional (CRUD + paginação)
- [ ] `npm run lint` e `npm run build` passando

## 10. Referências

- `docs/02-architecture.md` — estrutura geral do frontend
- `docs/03-cache-strategy.md` — chaves de cache ao adicionar filtros na API
- `docs/decisions.md` — ADR-005 (React + Vite), ADR-008 (shadcn/ui)
- [shadcn/ui docs](https://ui.shadcn.com/)
