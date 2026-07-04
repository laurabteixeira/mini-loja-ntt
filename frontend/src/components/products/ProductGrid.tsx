import type { Product } from '@/types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onDeleteProduct: (product: Product) => void;
  deletingProductId?: number | null;
}

export function ProductGrid({
  products,
  onDeleteProduct,
  deletingProductId = null,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onDelete={onDeleteProduct}
          isDeleting={deletingProductId === product.id}
        />
      ))}
    </div>
  );
}
