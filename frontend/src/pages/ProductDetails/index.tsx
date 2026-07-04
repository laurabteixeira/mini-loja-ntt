import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ProductDetailsContent } from '@/components/products/ProductDetailsContent';
import { ProductDeleteDialog } from '@/components/products/ProductDeleteDialog';
import { ProductDetailsHeader } from '@/components/products/ProductDetailsHeader';
import { ProductDetailsSkeleton } from '@/components/products/ProductDetailsSkeleton';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/services/api';
import { deleteProduct, getProduct } from '@/services/products';

export function ProductDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const productId = id ? Number(id) : NaN;

  const [product, setProduct] = useState<Awaited<
    ReturnType<typeof getProduct>
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (Number.isNaN(productId)) {
      setError('Produto inválido.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      setError(null);

      try {
        const response = await getProduct(productId);
        if (!cancelled) {
          setProduct(response);
        }
      } catch (err) {
        if (cancelled) {
          return;
        }

        const message =
          err instanceof ApiError && err.status === 404
            ? 'Produto não encontrado.'
            : err instanceof ApiError
              ? err.message
              : 'Não foi possível carregar o produto.';
        setError(message);
        setProduct(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProduct();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  function handleDeleteClick() {
    setDeleteModalOpen(true);
  }

  function handleDeleteModalOpenChange(open: boolean) {
    if (!open && !deleting) {
      setDeleteModalOpen(false);
    }
  }

  async function handleConfirmDelete() {
    if (!product) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      await deleteProduct(product.id);
      navigate('/');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Não foi possível excluir o produto.';
      setError(message);
      setDeleteModalOpen(false);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="space-y-8">
      {loading && <ProductDetailsSkeleton />}

      {!loading && error && (
        <div className="space-y-4">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
          <Button asChild variant="secondary">
            <Link to="/">Voltar para produtos</Link>
          </Button>
        </div>
      )}

      {!loading && !error && product && (
        <>
          <ProductDetailsHeader
            product={product}
            onDelete={handleDeleteClick}
            deleting={deleting}
          />
          <ProductDetailsContent product={product} />

          <ProductDeleteDialog
            open={deleteModalOpen}
            productName={product.name}
            deleting={deleting}
            onOpenChange={handleDeleteModalOpenChange}
            onConfirm={() => void handleConfirmDelete()}
          />
        </>
      )}
    </section>
  );
}
