import { cn } from '@/lib/utils';
import {
  getProductImageSrc,
  hasCustomProductImage,
} from '@/lib/product-image';

interface ProductImagePreviewProps {
  imageUrl?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
}

export function ProductImagePreview({
  imageUrl,
  alt,
  className,
  imageClassName,
}: ProductImagePreviewProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-muted',
        className,
      )}
    >
      <div className="aspect-square">
        <img
          src={getProductImageSrc(imageUrl)}
          alt={hasCustomProductImage(imageUrl) ? alt : ''}
          className={cn('h-full w-full object-cover', imageClassName)}
        />
      </div>
    </div>
  );
}
