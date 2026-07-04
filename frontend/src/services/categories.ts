import type { Category } from '../types/category';
import { api } from './api';

export function listCategories() {
  return api.get<Category[]>('/categories');
}

export function createCategory(name: string) {
  return api.post<Category>('/categories', { name });
}
