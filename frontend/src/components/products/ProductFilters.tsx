import { Search } from 'lucide-react';
import type { Category } from '@/types/category';
import { Input } from '@/components/ui/input';
import { CategoryFilterPills } from './CategoryFilterPills';

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categories: Category[];
  selectedCategoryId: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

export function ProductFilters({
  search,
  onSearchChange,
  categories,
  selectedCategoryId,
  onCategoryChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por nome ou descrição..."
          className="pl-9"
          aria-label="Buscar produtos"
        />
      </div>

      <CategoryFilterPills
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onChange={onCategoryChange}
      />
    </div>
  );
}
