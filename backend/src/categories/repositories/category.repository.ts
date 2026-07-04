import {
  CategoryCreateInput,
  CategoryUpdateInput,
} from '../mappers/category-input.mapper';
import {
  Category,
  CategoryWithProductCount,
} from '../entities/category.entity';

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');

export interface CategoryRepository {
  create(data: CategoryCreateInput): Promise<Category>;
  findAll(): Promise<CategoryWithProductCount[]>;
  findById(id: number): Promise<Category | null>;
  findByIdWithProductCount(id: number): Promise<CategoryWithProductCount | null>;
  update(id: number, data: CategoryUpdateInput): Promise<Category>;
  delete(id: number): Promise<Category>;
  existsById(id: number): Promise<boolean>;
}
