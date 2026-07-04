import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import {
  ProductListFilters,
  ProductWithCategory,
} from '../entities/product.entity';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductRepository {
  create(data: CreateProductDto): Promise<ProductWithCategory>;
  findManyPaginated(
    filters: ProductListFilters,
  ): Promise<{ data: ProductWithCategory[]; total: number }>;
  findById(id: number): Promise<ProductWithCategory | null>;
  existsById(id: number): Promise<boolean>;
  update(id: number, data: UpdateProductDto): Promise<ProductWithCategory>;
  delete(id: number): Promise<ProductWithCategory>;
}
