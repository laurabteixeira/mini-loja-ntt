import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '../../services/api';
import { deleteProduct, getProduct } from '../../services/products';
import type { Product } from '../../types/product';

function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatDate(value?: string) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function ProductDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const productId = id ? Number(id) : NaN;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  async function handleDelete() {
    if (!product || !window.confirm('Remover este produto?')) {
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
          : 'Não foi possível remover o produto.';
      setError(message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section>
      <div className="mb-6">
        <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
          ← Voltar para produtos
        </Link>
      </div>

      {loading && (
        <p className="text-gray-600" role="status">
          Carregando produto...
        </p>
      )}

      {!loading && error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && product && (
        <>
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">{product.name}</h1>
              <p className="mt-1 text-sm text-gray-500">ID #{product.id}</p>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/products/${product.id}/edit`}
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Editar
              </Link>
              <button
                type="button"
                disabled={deleting}
                onClick={() => void handleDelete()}
                className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? 'Removendo...' : 'Remover'}
              </button>
            </div>
          </div>

          <dl className="divide-y divide-gray-200 rounded-md border border-gray-200 bg-white">
            <div className="grid gap-1 px-4 py-4 sm:grid-cols-3">
              <dt className="text-sm font-medium text-gray-500">Preço</dt>
              <dd className="text-sm text-gray-900 sm:col-span-2">
                {formatPrice(product.price)}
              </dd>
            </div>
            <div className="grid gap-1 px-4 py-4 sm:grid-cols-3">
              <dt className="text-sm font-medium text-gray-500">Categoria</dt>
              <dd className="text-sm text-gray-900 sm:col-span-2">
                {product.category?.name ?? '—'}
              </dd>
            </div>
            <div className="grid gap-1 px-4 py-4 sm:grid-cols-3">
              <dt className="text-sm font-medium text-gray-500">Descrição</dt>
              <dd className="whitespace-pre-wrap text-sm text-gray-900 sm:col-span-2">
                {product.description}
              </dd>
            </div>
            <div className="grid gap-1 px-4 py-4 sm:grid-cols-3">
              <dt className="text-sm font-medium text-gray-500">Criado em</dt>
              <dd className="text-sm text-gray-900 sm:col-span-2">
                {formatDate(product.createdAt)}
              </dd>
            </div>
            <div className="grid gap-1 px-4 py-4 sm:grid-cols-3">
              <dt className="text-sm font-medium text-gray-500">
                Atualizado em
              </dt>
              <dd className="text-sm text-gray-900 sm:col-span-2">
                {formatDate(product.updatedAt)}
              </dd>
            </div>
          </dl>
        </>
      )}
    </section>
  );
}
