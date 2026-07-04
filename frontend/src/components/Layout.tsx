import { Link, Outlet } from 'react-router-dom';
import { API_URL } from '../services/api';

export function Layout() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-semibold text-gray-900">
            Mini Loja
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Produtos
            </Link>
            <Link
              to="/products/new"
              className="text-gray-600 hover:text-gray-900"
            >
              Novo produto
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <p className="mx-auto max-w-5xl px-4 py-3 text-xs text-gray-500">
          API: {API_URL}
        </p>
      </footer>
    </div>
  );
}
