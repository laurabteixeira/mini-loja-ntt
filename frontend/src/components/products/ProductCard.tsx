import type { KeyboardEvent } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { categoryBadgeClassName } from '@/lib/category-colors';
import { formatPrice, truncateText } from '@/lib/formatters';
import {
  getProductImageSrc,
  hasCustomProductImage,
} from '@/lib/product-image';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onDelete: (product: Product) => void;
  isDeleting?: boolean;
}

export function ProductCard({
  product,
  onDelete,
  isDeleting = false,
}: ProductCardProps) {
  const navigate = useNavigate();
  const categoryName = product.category?.name ?? 'Sem categoria';

  function handleCardClick() {
    if (isDeleting) {
      return;
    }

    void navigate(`/products/${product.id}`);
  }

  function handleCardKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick();
    }
  }

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhes de ${product.name}`}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      className={cn(
        'group flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border-border p-0',
        'transform-gpu transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:scale-[1.02] hover:border-foreground/10 hover:shadow-lg',
        isDeleting && 'pointer-events-none opacity-60',
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={getProductImageSrc(product.imageUrl)}
          alt={
            hasCustomProductImage(product.imageUrl) ? product.name : ''
          }
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <Badge className={categoryBadgeClassName} variant="outline">
          {categoryName}
        </Badge>

        <div className="mt-4 flex flex-1 flex-col gap-2">
          <h3 className="text-base font-semibold leading-snug text-foreground group-hover:underline">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {truncateText(product.description, 120)}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <p className="text-lg font-semibold text-foreground">
            {formatPrice(product.price)}
          </p>

          <div
            className={cn(
              'flex items-center gap-0.5',
              'translate-y-1 opacity-0 transition-all duration-300 ease-out',
              'group-hover:translate-y-0 group-hover:opacity-100',
            )}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <Link
              to={`/products/${product.id}/edit`}
              aria-label={`Editar ${product.name}`}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </Link>

            <button
              type="button"
              aria-label={`Remover ${product.name}`}
              disabled={isDeleting}
              onClick={() => onDelete(product)}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
