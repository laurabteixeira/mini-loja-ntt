import type { Category } from '@/types/category';
import { cn } from '@/lib/utils';

interface CategoryFilterPillsProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onChange: (categoryId: number | null) => void;
}

export function CategoryFilterPills({
  categories,
  selectedCategoryId,
  onChange,
}: CategoryFilterPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={cn(
          'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
          selectedCategoryId === null
            ? 'border-foreground bg-foreground text-background'
            : 'border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground',
        )}
      >
        Todos
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onChange(category.id)}
          className={cn(
            'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
            selectedCategoryId === category.id
              ? 'border-foreground bg-foreground text-background'
              : 'border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground',
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
