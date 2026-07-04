import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductFormSkeleton() {
  return (
    <div className="space-y-8" role="status" aria-busy="true" aria-label="Carregando formulário">
      <div className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="space-y-6 p-6 lg:col-span-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-28 w-full" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </Card>

        <Card className="space-y-4 p-6">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="aspect-[4/3] w-full rounded-lg" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </Card>
      </div>
    </div>
  );
}
