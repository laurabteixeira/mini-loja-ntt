import {
  ProductCreateInput,
  ProductUpdateInput,
} from '../mappers/product-input.mapper';
import {
  ProductListFilters,
  ProductWithCategory,
} from '../entities/product.entity';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductRepository {
  create(data: ProductCreateInput): Promise<ProductWithCategory>;
  findManyPaginated(
    filters: ProductListFilters,
  ): Promise<{ data: ProductWithCategory[]; total: number }>;
  findById(id: number): Promise<ProductWithCategory | null>;
  existsById(id: number): Promise<boolean>;
  update(id: number, data: ProductUpdateInput): Promise<ProductWithCategory>;
  delete(id: number): Promise<ProductWithCategory>;
}
