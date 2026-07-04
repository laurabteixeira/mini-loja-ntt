import type { PaginatedProducts, Product } from '../types/product';
import { api } from './api';

export interface ListProductsParams {
  page?: number;
  limit?: number;
  categoryId?: number;
  search?: string;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrl?: string;
}

export type UpdateProductInput = Partial<CreateProductInput>;

export function listProducts(params: ListProductsParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set('page', String(params.page));
  }

  if (params.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }

  if (params.categoryId !== undefined) {
    searchParams.set('categoryId', String(params.categoryId));
  }

  if (params.search?.trim()) {
    searchParams.set('search', params.search.trim());
  }

  const query = searchParams.toString();
  const path = query ? `/products?${query}` : '/products';

  return api.get<PaginatedProducts>(path);
}

export function getProduct(id: number) {
  return api.get<Product>(`/products/${id}`);
}

export function createProduct(input: CreateProductInput) {
  return api.post<Product>('/products', input);
}

export function updateProduct(id: number, input: UpdateProductInput) {
  return api.patch<Product>(`/products/${id}`, input);
}

export function deleteProduct(id: number) {
  return api.delete<Product>(`/products/${id}`);
}
