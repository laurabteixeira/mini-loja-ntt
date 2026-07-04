import type { Category } from './category';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  category?: Category;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedProducts {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
