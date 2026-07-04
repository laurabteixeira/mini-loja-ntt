import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import {
  Category,
  CategoryWithProductCount,
} from '../entities/category.entity';
import { CategoryMapper } from '../mappers/category.mapper';
import { CategoryRepository } from './category.repository';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto): Promise<Category> {
    const category = await this.prisma.category.create({ data });
    return CategoryMapper.toCategory(category);
  }

  async findAll(): Promise<CategoryWithProductCount[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { id: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return categories.map(CategoryMapper.toCategoryWithProductCount);
  }

  async findById(id: number): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    return category ? CategoryMapper.toCategory(category) : null;
  }

  async findByIdWithProductCount(
    id: number,
  ): Promise<CategoryWithProductCount | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return category
      ? CategoryMapper.toCategoryWithProductCount(category)
      : null;
  }

  async update(id: number, data: UpdateCategoryDto): Promise<Category> {
    const category = await this.prisma.category.update({
      where: { id },
      data,
    });

    return CategoryMapper.toCategory(category);
  }

  async delete(id: number): Promise<Category> {
    const category = await this.prisma.category.delete({ where: { id } });
    return CategoryMapper.toCategory(category);
  }

  async existsById(id: number): Promise<boolean> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      select: { id: true },
    });

    return category !== null;
  }
}
