import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const productInclude = {
  category: true,
} as const;

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    await this.ensureCategoryExists(createProductDto.categoryId);

    const product = await this.prisma.product.create({
      data: createProductDto,
      include: productInclude,
    });

    await this.invalidateProductLists();

    return product;
  }

  async findAll(query: QueryProductDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const cacheKey = this.buildProductListKey(page, limit);

    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' },
        include: productInclude,
      }),
      this.prisma.product.count(),
    ]);

    const result = {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };

    await this.redis.set(
      cacheKey,
      JSON.stringify(result),
      this.getCacheTtl(),
    );

    return result;
  }

  async findOne(id: number) {
    const cacheKey = this.buildProductKey(id);
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const product = await this.prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    await this.redis.set(
      cacheKey,
      JSON.stringify(product),
      this.getCacheTtl(),
    );

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    if (Object.keys(updateProductDto).length === 0) {
      throw new BadRequestException(
        'At least one field must be provided for update',
      );
    }

    await this.ensureProductExists(id);

    if (updateProductDto.categoryId !== undefined) {
      await this.ensureCategoryExists(updateProductDto.categoryId);
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: productInclude,
    });

    await this.invalidateProductCache(id);
    await this.invalidateProductLists();

    return product;
  }

  async remove(id: number) {
    await this.ensureProductExists(id);

    const product = await this.prisma.product.delete({
      where: { id },
      include: productInclude,
    });

    await this.invalidateProductCache(id);
    await this.invalidateProductLists();

    return product;
  }

  private getCacheTtl(): number {
    const ttl = this.configService.get<string>('CACHE_TTL', '60');
    const parsed = parseInt(ttl, 10);

    return Number.isNaN(parsed) ? 60 : parsed;
  }

  private buildProductKey(id: number): string {
    return `product:${id}`;
  }

  private buildProductListKey(page: number, limit: number): string {
    return `products:list:page=${page}:limit=${limit}`;
  }

  private async invalidateProductCache(id: number): Promise<void> {
    await this.redis.del(this.buildProductKey(id));
  }

  private async invalidateProductLists(): Promise<void> {
    await this.redis.delByPattern('products:list:*');
  }

  private async ensureProductExists(id: number): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  }

  private async ensureCategoryExists(categoryId: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }
  }
}
