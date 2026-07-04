import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, Pencil, Plus, Tags, Trash2 } from 'lucide-react';
import { CategoryDeleteDialog } from '@/components/products/CategoryDeleteDialog';
import { CategoryFormDialog } from '@/components/categories/CategoryFormDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { dispatchCategoriesChanged } from '@/lib/category-events';
import { ApiError } from '@/services/api';
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from '@/services/categories';
import type { Category } from '@/types/category';

type DeleteModalState =
  | { open: false }
  | {
      open: true;
      mode: 'confirm' | 'blocked';
      category: Category;
    };

type FormModalState =
  | { open: false }
  | { open: true; mode: 'create' }
  | { open: true; mode: 'edit'; category: Category };

export function CategoriesNavMenu() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [listError, setListError] = useState<string | null>(null);
  const [formModal, setFormModal] = useState<FormModalState>({ open: false });
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    open: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setListError(null);

    try {
      const data = await listCategories();
      setCategories(data);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Não foi possível carregar as categorias.';
      setListError(message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      void loadCategories();
    } else {
      setSearch('');
    }
  }, [open, loadCategories]);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return categories;
    }

    return categories.filter((category) =>
      category.name.toLowerCase().includes(query),
    );
  }, [categories, search]);

  function handleOpenCreate() {
    setOpen(false);
    setFormError(null);
    setFormModal({ open: true, mode: 'create' });
  }

  function handleOpenEdit(category: Category) {
    setOpen(false);
    setFormError(null);
    setFormModal({ open: true, mode: 'edit', category });
  }

  function handleOpenDelete(category: Category) {
    setOpen(false);
    const hasProducts = (category.productCount ?? 0) > 0;
    setDeleteModal({
      open: true,
      mode: hasProducts ? 'blocked' : 'confirm',
      category,
    });
  }

  async function handleFormSubmit(name: string) {
    setSubmitting(true);
    setFormError(null);

    try {
      if (formModal.open && formModal.mode === 'edit') {
        const updated = await updateCategory(formModal.category.id, name);
        setCategories((current) =>
          current.map((item) =>
            item.id === updated.id
              ? { ...updated, productCount: item.productCount }
              : item,
          ),
        );
      } else {
        const created = await createCategory(name);
        setCategories((current) => [
          ...current,
          { ...created, productCount: 0 },
        ]);
      }

      setFormModal({ open: false });
      dispatchCategoriesChanged();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : formModal.open && formModal.mode === 'edit'
            ? 'Não foi possível atualizar a categoria.'
            : 'Não foi possível criar a categoria.';
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteModal.open || deleteModal.mode !== 'confirm') {
      return;
    }

    const { category } = deleteModal;

    setDeleting(true);

    try {
      await deleteCategory(category.id);
      setCategories((current) =>
        current.filter((item) => item.id !== category.id),
      );
      setDeleteModal({ open: false });
      dispatchCategoriesChanged();
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 409
          ? 'Essa categoria não pode ser deletada pois há produtos associados.'
          : err instanceof ApiError
            ? err.message
            : 'Não foi possível excluir a categoria.';
      setListError(message);
      setDeleteModal({ open: false });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            size="sm"
            aria-expanded={open}
            aria-haspopup="dialog"
          >
            <Tags className="h-4 w-4" />
            Categorias
            <ChevronDown className="h-4 w-4 opacity-70" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="end" className="w-64 p-0">
          <div className="flex items-center gap-2 border-b border-border p-3">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar categoria..."
              className="h-9"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="h-9 w-9 shrink-0 transition-colors duration-300 ease-out"
                  onClick={handleOpenCreate}
                  aria-label="Nova categoria"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Nova categoria</TooltipContent>
            </Tooltip>
          </div>

          <div className="max-h-64 overflow-y-auto p-2">
            {loading && (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                Carregando...
              </p>
            )}

            {!loading && listError && (
              <p className="px-2 py-4 text-center text-sm text-red-600">
                {listError}
              </p>
            )}

            {!loading && !listError && filteredCategories.length === 0 && (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                {search.trim()
                  ? 'Nenhuma categoria encontrada.'
                  : 'Nenhuma categoria cadastrada.'}
              </p>
            )}

            {!loading &&
              !listError &&
              filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between gap-2 rounded-md px-2 py-2 transition-colors duration-300 ease-out hover:bg-muted"
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {category.name}
                  </span>

                  <div className="flex shrink-0 items-center gap-0.5">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 transition-colors duration-300 ease-out"
                          aria-label={`Editar ${category.name}`}
                          onClick={() => handleOpenEdit(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Editar categoria</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-700 transition-colors duration-300 ease-out hover:bg-red-50 hover:text-red-700"
                          aria-label={`Excluir ${category.name}`}
                          onClick={() => handleOpenDelete(category)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Deletar categoria</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))}
          </div>
        </PopoverContent>
      </Popover>

      {formModal.open && (
        <CategoryFormDialog
          open={formModal.open}
          mode={formModal.mode}
          initialName={
            formModal.mode === 'edit' ? formModal.category.name : ''
          }
          submitting={submitting}
          error={formError}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) {
              setFormModal({ open: false });
              setFormError(null);
            }
          }}
          onSubmit={(name) => void handleFormSubmit(name)}
        />
      )}

      {deleteModal.open && (
        <CategoryDeleteDialog
          open={deleteModal.open}
          mode={deleteModal.mode}
          categoryName={deleteModal.category.name}
          deleting={deleting}
          onOpenChange={(nextOpen) => {
            if (!nextOpen && !deleting) {
              setDeleteModal({ open: false });
            }
          }}
          onConfirm={() => void handleConfirmDelete()}
        />
      )}
    </>
  );
}
