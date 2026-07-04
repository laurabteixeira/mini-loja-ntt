import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CATEGORY_REPOSITORY } from '../categories/repositories/category.repository';
import { CacheService } from '../cache/cache.service';
import { ProductsService } from './products.service';
import { PRODUCT_REPOSITORY } from './repositories/product.repository';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: {
    create: jest.Mock;
    findManyPaginated: jest.Mock;
    findById: jest.Mock;
    existsById: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  let categoryRepository: {
    existsById: jest.Mock;
  };
  let cache: {
    get: jest.Mock;
    set: jest.Mock;
    del: jest.Mock;
    delByPattern: jest.Mock;
  };

  beforeEach(async () => {
    productRepository = {
      create: jest.fn(),
      findManyPaginated: jest.fn(),
      findById: jest.fn(),
      existsById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    categoryRepository = {
      existsById: jest.fn(),
    };

    cache = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      delByPattern: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PRODUCT_REPOSITORY, useValue: productRepository },
        { provide: CATEGORY_REPOSITORY, useValue: categoryRepository },
        { provide: CacheService, useValue: cache },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('60') },
        },
      ],
    }).compile();

    service = module.get(ProductsService);
  });

  it('returns cached product on cache hit without querying the database', async () => {
    const cachedProduct = { id: 1, name: 'Cached Product' };
    cache.get.mockResolvedValue(JSON.stringify(cachedProduct));

    const result = await service.findOne(1);

    expect(cache.get).toHaveBeenCalledWith('product:1');
    expect(result).toEqual(cachedProduct);
    expect(productRepository.findById).not.toHaveBeenCalled();
  });

  it('stores product in cache on cache miss', async () => {
    const product = {
      id: 1,
      name: 'Product',
      description: 'Desc',
      price: 10,
      categoryId: 1,
      category: { id: 1, name: 'Cat' },
    };

    cache.get.mockResolvedValue(null);
    productRepository.findById.mockResolvedValue(product);

    const result = await service.findOne(1);

    expect(result).toEqual(product);
    expect(cache.set).toHaveBeenCalledWith(
      'product:1',
      JSON.stringify(product),
      60,
    );
  });

  it('throws NotFoundException when product does not exist', async () => {
    cache.get.mockResolvedValue(null);
    productRepository.findById.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('uses paginated list cache key with filters', async () => {
    const listResult = {
      data: [],
      meta: { total: 0, page: 2, limit: 5, totalPages: 1 },
    };

    cache.get.mockResolvedValue(JSON.stringify(listResult));

    const result = await service.findAll({
      page: 2,
      limit: 5,
      categoryId: 3,
      search: 'phone',
    });

    expect(cache.get).toHaveBeenCalledWith(
      'products:list:page=2:limit=5:categoryId=3:search=phone',
    );
    expect(result).toEqual(listResult);
    expect(productRepository.findManyPaginated).not.toHaveBeenCalled();
  });

  it('invalidates product detail and list caches on update', async () => {
    productRepository.existsById.mockResolvedValue(true);
    productRepository.update.mockResolvedValue({
      id: 1,
      name: 'Updated',
      categoryId: 1,
      category: { id: 1, name: 'Cat' },
    });

    await service.update(1, { name: 'Updated' });

    expect(cache.del).toHaveBeenCalledWith('product:1');
    expect(cache.delByPattern).toHaveBeenCalledWith('products:list:*');
  });

  it('invalidates list cache on create', async () => {
    categoryRepository.existsById.mockResolvedValue(true);
    productRepository.create.mockResolvedValue({
      id: 1,
      name: 'New',
      categoryId: 1,
      category: { id: 1, name: 'Cat' },
    });

    await service.create({
      name: 'New',
      description: 'Desc',
      price: 10,
      categoryId: 1,
    });

    expect(cache.delByPattern).toHaveBeenCalledWith('products:list:*');
  });
});
