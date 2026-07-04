import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCatalogHeader } from '@/components/products/ProductCatalogHeader';
import { ProductDeleteDialog } from '@/components/products/ProductDeleteDialog';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductGridSkeleton } from '@/components/products/ProductGridSkeleton';
import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { CATEGORIES_CHANGED_EVENT } from '@/lib/category-events';
import { ApiError } from '@/services/api';
import { listCategories } from '@/services/categories';
import { listProducts, deleteProduct } from '@/services/products';
import type { Category } from '@/types/category';
import type { Product } from '@/types/product';

const PAGE_SIZE = 12;

function categoriesWithProducts(categories: Category[]): Category[] {
  return categories.filter((category) => (category.productCount ?? 0) > 0);
}

function resolveSelectedCategoryId(
  current: number | null,
  categories: Category[],
): number | null {
  if (current === null) {
    return null;
  }

  const selected = categories.find((category) => category.id === current);

  if (!selected || (selected.productCount ?? 0) === 0) {
    return null;
  }

  return current;
}

type DeleteProductModalState =
  | { open: false }
  | { open: true; product: Product };

export function ProductListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(
    null,
  );
  const [deleteProductModal, setDeleteProductModal] =
    useState<DeleteProductModalState>({ open: false });

  const debouncedSearch = useDebounce(search, 300);

  const reloadCategories = useCallback(async () => {
    try {
      const data = await listCategories();
      setCategories(data);
      setSelectedCategoryId((current) =>
        resolveSelectedCategoryId(current, data),
      );
    } catch {
      setCategories([]);
      setSelectedCategoryId(null);
    }
  }, []);

  useEffect(() => {
    void reloadCategories();
  }, [reloadCategories]);

  useEffect(() => {
    function handleCategoriesChanged() {
      void reloadCategories();
    }

    window.addEventListener(CATEGORIES_CHANGED_EVENT, handleCategoriesChanged);

    return () => {
      window.removeEventListener(
        CATEGORIES_CHANGED_EVENT,
        handleCategoriesChanged,
      );
    };
  }, [reloadCategories]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await listProducts({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        categoryId: selectedCategoryId ?? undefined,
      });

      setProducts(response.data);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Não foi possível carregar os produtos. Verifique se o backend está no ar.';
      setError(message);
      setProducts([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, selectedCategoryId]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const hasActiveFilters =
    debouncedSearch.length > 0 || selectedCategoryId !== null;

  const clearFilters = () => {
    setSearch('');
    setSelectedCategoryId(null);
    setPage(1);
  };

  function handleDeleteProductClick(product: Product) {
    setDeleteProductModal({ open: true, product });
  }

  function handleDeleteProductModalOpenChange(open: boolean) {
    if (!open && deletingProductId === null) {
      setDeleteProductModal({ open: false });
    }
  }

  async function handleConfirmDeleteProduct() {
    if (!deleteProductModal.open) {
      return;
    }

    const { product } = deleteProductModal;

    setDeletingProductId(product.id);
    setError(null);

    try {
      await deleteProduct(product.id);
      setDeleteProductModal({ open: false });
      await Promise.all([loadProducts(), reloadCategories()]);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Não foi possível remover o produto.';
      setError(message);
      setDeleteProductModal({ open: false });
    } finally {
      setDeletingProductId(null);
    }
  }

  return (
    <section className="space-y-8">
      <ProductCatalogHeader />

      <ProductFilters
        search={search}
        onSearchChange={handleSearchChange}
        categories={categoriesWithProducts(categories)}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={handleCategoryChange}
      />

      {loading && <ProductGridSkeleton count={8} />}

      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="rounded-lg border border-border bg-card px-6 py-12 text-center">
          <p className="text-muted-foreground">
            {hasActiveFilters
              ? 'Nenhum produto encontrado para estes filtros.'
              : 'Nenhum produto cadastrado.'}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {hasActiveFilters && (
              <Button variant="secondary" onClick={clearFilters}>
                Limpar filtros
              </Button>
            )}
            <Button asChild variant={hasActiveFilters ? 'secondary' : 'default'}>
              <Link to="/products/new">Criar produto</Link>
            </Button>
          </div>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <ProductGrid
            products={products}
            onDeleteProduct={handleDeleteProductClick}
            deletingProductId={deletingProductId}
          />

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {deleteProductModal.open && (
        <ProductDeleteDialog
          open={deleteProductModal.open}
          productName={deleteProductModal.product.name}
          deleting={deletingProductId === deleteProductModal.product.id}
          onOpenChange={handleDeleteProductModalOpenChange}
          onConfirm={() => void handleConfirmDeleteProduct()}
        />
      )}
    </section>
  );
}
