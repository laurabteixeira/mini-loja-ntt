import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ProductImagePreview } from '@/components/products/ProductImagePreview';
import { categoryBadgeClassName } from '@/lib/category-colors';
import { formatDateShort, formatPrice } from '@/lib/formatters';
import type { Product } from '@/types/product';

interface ProductDetailsContentProps {
  product: Product;
}

export function ProductDetailsContent({ product }: ProductDetailsContentProps) {
  const categoryName = product.category?.name ?? 'Sem categoria';

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <ProductImagePreview
        imageUrl={product.imageUrl}
        alt={product.name}
      />

      <div className="flex flex-col gap-6">
        <Badge className={categoryBadgeClassName} variant="outline">
          {categoryName.toUpperCase()}
        </Badge>

        <div className="space-y-2">
          <h2 className="font-sans text-2xl font-bold tracking-tight text-foreground">
            {product.name}
          </h2>
          <p className="font-sans text-3xl font-bold text-foreground">
            {formatPrice(product.price)}
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-sans text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Descrição
          </p>
          <p className="font-sans text-sm leading-relaxed text-foreground">
            {product.description}
          </p>
        </div>

        <Card className="rounded-lg border-border bg-card p-5 shadow-sm">
          <dl className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Categoria
              </dt>
              <dd className="text-sm font-medium text-foreground">
                {categoryName}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Cadastrado em
              </dt>
              <dd className="text-sm font-medium text-foreground">
                {formatDateShort(product.createdAt)}
              </dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
