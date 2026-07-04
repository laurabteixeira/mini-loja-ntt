import { Category as PrismaCategory } from '@prisma/client';
import {
  Category,
  CategoryWithProductCount,
} from '../entities/category.entity';

type PrismaCategoryWithCount = PrismaCategory & {
  _count: { products: number };
};

export class CategoryMapper {
  static toCategory(record: PrismaCategory): Category {
    return {
      id: record.id,
      name: record.name,
    };
  }

  static toCategoryWithProductCount(
    record: PrismaCategoryWithCount,
  ): CategoryWithProductCount {
    return {
      id: record.id,
      name: record.name,
      productCount: record._count.products,
    };
  }
}
