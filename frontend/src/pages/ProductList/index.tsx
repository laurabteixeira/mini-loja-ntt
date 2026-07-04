import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pagination } from '../../components/Pagination';
import { ApiError } from '../../services/api';
import { listProducts } from '../../services/products';
import type { Product } from '../../types/product';

const PAGE_SIZE = 10;

function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function ProductListPage() {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async (currentPage: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await listProducts({
        page: currentPage,
        limit: PAGE_SIZE,
      });

      setProducts(response.data);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Não foi possível carregar os produtos. Verifique se o backend está no ar (http://localhost:3000/health).';
      setError(message);
      setProducts([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts(page);
  }, [loadProducts, page]);

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Produtos</h1>
        <Link
          to="/products/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Novo produto
        </Link>
      </div>

      {loading && (
        <p className="text-gray-600" role="status">
          Carregando produtos...
        </p>
      )}

      {!loading && error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="rounded-md border border-gray-200 bg-white px-4 py-8 text-center">
          <p className="text-gray-600">Nenhum produto cadastrado.</p>
          <Link
            to="/products/new"
            className="mt-4 inline-block text-sm font-medium text-gray-900 hover:underline"
          >
            Criar primeiro produto
          </Link>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Nome
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Preço
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Categoria
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {product.category?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <div className="flex justify-end gap-3">
                        <Link
                          to={`/products/${product.id}`}
                          className="font-medium text-gray-900 hover:underline"
                        >
                          Ver detalhes
                        </Link>
                        <Link
                          to={`/products/${product.id}/edit`}
                          className="font-medium text-gray-900 hover:underline"
                        >
                          Editar
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </section>
  );
}
