import { Card } from '@/components/ui/card';
import {
  getProductImageSrc,
  hasCustomProductImage,
} from '@/lib/product-image';
import { cn } from '@/lib/utils';

interface ProductFormPreviewProps {
  name: string;
  description: string;
  imageUrl: string;
  className?: string;
}

export function ProductFormPreview({
  name,
  description,
  imageUrl,
  className,
}: ProductFormPreviewProps) {
  const trimmedName = name.trim();
  const trimmedDescription = description.trim();
  return (
    <Card className={cn('p-6', className)}>
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Pré-visualização
      </p>

      <div className="overflow-hidden rounded-lg border border-border bg-muted">
        <div className="aspect-[4/3]">
          <img
            src={getProductImageSrc(imageUrl)}
            alt={
              hasCustomProductImage(imageUrl)
                ? trimmedName || 'Pré-visualização do produto'
                : ''
            }
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <p className="font-semibold text-foreground">
          {trimmedName || 'Nome do produto'}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {trimmedDescription || 'Sua descrição aparecerá aqui.'}
        </p>
      </div>
    </Card>
  );
}
