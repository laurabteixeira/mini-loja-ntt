import { ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/product';

interface ProductDetailsHeaderProps {
  product: Product;
  onDelete: () => void;
  deleting?: boolean;
}

export function ProductDetailsHeader({
  product,
  onDelete,
  deleting = false,
}: ProductDetailsHeaderProps) {
  const categoryName = product.category?.name ?? 'Sem categoria';

  return (
    <div className="space-y-6">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Link to="/" className="transition-colors hover:text-foreground">
          Produtos
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
        <span className="truncate font-medium text-foreground">
          {product.name}
        </span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {product.name}
          </h1>
          <p className="text-sm text-muted-foreground">{categoryName}</p>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button asChild variant="secondary">
            <Link to={`/products/${product.id}/edit`}>
              <Pencil className="h-4 w-4" aria-hidden />
              Editar
            </Link>
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={deleting}
            onClick={onDelete}
            className="text-red-700 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            {deleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </div>
    </div>
  );
}
