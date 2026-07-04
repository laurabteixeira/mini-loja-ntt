import { Category, Product as PrismaProduct } from '@prisma/client';
import {
  CategorySummary,
  Product,
  ProductWithCategory,
} from '../entities/product.entity';

type PrismaProductWithCategory = PrismaProduct & {
  category: Category;
};

export class ProductMapper {
  static toCategorySummary(category: Category): CategorySummary {
    return {
      id: category.id,
      name: category.name,
    };
  }

  static toProduct(record: PrismaProduct): Product {
    return {
      id: record.id,
      name: record.name,
      description: record.description,
      price: record.price,
      categoryId: record.categoryId,
      imageUrl: record.imageUrl,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  static toProductWithCategory(
    record: PrismaProductWithCategory,
  ): ProductWithCategory {
    return {
      ...ProductMapper.toProduct(record),
      category: ProductMapper.toCategorySummary(record.category),
    };
  }
}
