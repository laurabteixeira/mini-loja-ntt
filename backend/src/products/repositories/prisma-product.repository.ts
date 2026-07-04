import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ProductCreateInput,
  ProductUpdateInput,
} from '../mappers/product-input.mapper';
import {
  ProductListFilters,
  ProductWithCategory,
} from '../entities/product.entity';
import { ProductMapper } from '../mappers/product.mapper';
import { ProductRepository } from './product.repository';

const productInclude = {
  category: true,
} as const;

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ProductCreateInput): Promise<ProductWithCategory> {
    const product = await this.prisma.product.create({
      data,
      include: productInclude,
    });

    return ProductMapper.toProductWithCategory(product);
  }

  async findManyPaginated(
    filters: ProductListFilters,
  ): Promise<{ data: ProductWithCategory[]; total: number }> {
    const where = this.buildListWhere(filters);
    const skip = (filters.page - 1) * filters.limit;

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: filters.limit,
        orderBy: { id: 'asc' },
        include: productInclude,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: data.map(ProductMapper.toProductWithCategory),
      total,
    };
  }

  async findById(id: number): Promise<ProductWithCategory | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });

    return product ? ProductMapper.toProductWithCategory(product) : null;
  }

  async existsById(id: number): Promise<boolean> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });

    return product !== null;
  }

  async update(
    id: number,
    data: ProductUpdateInput,
  ): Promise<ProductWithCategory> {
    const product = await this.prisma.product.update({
      where: { id },
      data,
      include: productInclude,
    });

    return ProductMapper.toProductWithCategory(product);
  }

  async delete(id: number): Promise<ProductWithCategory> {
    const product = await this.prisma.product.delete({
      where: { id },
      include: productInclude,
    });

    return ProductMapper.toProductWithCategory(product);
  }

  private buildListWhere(
    filters: ProductListFilters,
  ): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {};

    if (filters.categoryId !== undefined) {
      where.categoryId = filters.categoryId;
    }

    const search = filters.search?.trim();
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return where;
  }
}
