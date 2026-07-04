import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CATEGORY_REPOSITORY,
  CategoryRepository,
} from '../categories/repositories/category.repository';
import { CacheService } from '../cache/cache.service';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductInputMapper } from './mappers/product-input.mapper';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from './repositories/product.repository';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
    private readonly cache: CacheService,
    private readonly configService: ConfigService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const input = ProductInputMapper.toCreateInput(createProductDto);

    await this.ensureCategoryExists(input.categoryId);

    const product = await this.productRepository.create(input);

    await this.invalidateProductLists();

    return product;
  }

  async findAll(query: QueryProductDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const cacheKey = this.buildProductListKey(query);

    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const { data, total } = await this.productRepository.findManyPaginated({
      page,
      limit,
      categoryId: query.categoryId,
      search: query.search,
    });

    const result = {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };

    await this.cache.set(
      cacheKey,
      JSON.stringify(result),
      this.getCacheTtl(),
    );

    return result;
  }

  async findOne(id: number) {
    const cacheKey = this.buildProductKey(id);
    const cached = await this.cache.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    await this.cache.set(
      cacheKey,
      JSON.stringify(product),
      this.getCacheTtl(),
    );

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const input = ProductInputMapper.toUpdateInput(updateProductDto);

    await this.ensureProductExists(id);

    if (input.categoryId !== undefined) {
      await this.ensureCategoryExists(input.categoryId);
    }

    const product = await this.productRepository.update(id, input);

    await this.invalidateProductCache(id);
    await this.invalidateProductLists();

    return product;
  }

  async remove(id: number) {
    await this.ensureProductExists(id);

    const product = await this.productRepository.delete(id);

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

  private buildProductListKey(query: QueryProductDto): string {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const parts = [`page=${page}`, `limit=${limit}`];

    if (query.categoryId !== undefined) {
      parts.push(`categoryId=${query.categoryId}`);
    }

    const search = query.search?.trim();
    if (search) {
      parts.push(`search=${encodeURIComponent(search)}`);
    }

    return `products:list:${parts.join(':')}`;
  }

  private async invalidateProductCache(id: number): Promise<void> {
    await this.cache.del(this.buildProductKey(id));
  }

  private async invalidateProductLists(): Promise<void> {
    await this.cache.delByPattern('products:list:*');
  }

  private async ensureProductExists(id: number): Promise<void> {
    const exists = await this.productRepository.existsById(id);

    if (!exists) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  }

  private async ensureCategoryExists(categoryId: number) {
    const exists = await this.categoryRepository.existsById(categoryId);

    if (!exists) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }
  }
}
