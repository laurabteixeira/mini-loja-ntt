import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import {
  Category,
  CategoryWithProductCount,
} from '../entities/category.entity';

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');

export interface CategoryRepository {
  create(data: CreateCategoryDto): Promise<Category>;
  findAll(): Promise<CategoryWithProductCount[]>;
  findById(id: number): Promise<Category | null>;
  findByIdWithProductCount(id: number): Promise<CategoryWithProductCount | null>;
  update(id: number, data: UpdateCategoryDto): Promise<Category>;
  delete(id: number): Promise<Category>;
  existsById(id: number): Promise<boolean>;
}
