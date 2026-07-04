import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductDetailsSkeleton() {
  return (
    <div className="space-y-8" role="status" aria-busy="true" aria-label="Carregando produto">
      <div className="space-y-6">
        <Skeleton className="h-4 w-48" />
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64 max-w-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="space-y-6">
          <Skeleton className="h-6 w-20 self-start rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-9 w-40" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Card className="border-border p-5">
            <div className="grid gap-6 sm:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
