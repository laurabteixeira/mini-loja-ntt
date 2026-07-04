import type { Category } from '../types/category';
import { api } from './api';

export function listCategories() {
  return api.get<Category[]>('/categories');
}

export function createCategory(name: string) {
  return api.post<Category>('/categories', { name });
}

export function updateCategory(id: number, name: string) {
  return api.patch<Category>(`/categories/${id}`, { name });
}

export function deleteCategory(id: number) {
  return api.delete<Category>(`/categories/${id}`);
}
