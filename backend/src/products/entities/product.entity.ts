export interface CategorySummary {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductWithCategory extends Product {
  category: CategorySummary;
}

export interface ProductListFilters {
  page: number;
  limit: number;
  categoryId?: number;
  search?: string;
}

export interface PaginatedProducts {
  data: ProductWithCategory[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
