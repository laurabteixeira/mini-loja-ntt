import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CATEGORY_REPOSITORY } from './repositories/category.repository';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryRepository: {
    create: jest.Mock;
    findAll: jest.Mock;
    findById: jest.Mock;
    findByIdWithProductCount: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    existsById: jest.Mock;
  };

  beforeEach(async () => {
    categoryRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByIdWithProductCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: CATEGORY_REPOSITORY, useValue: categoryRepository },
      ],
    }).compile();

    service = module.get(CategoriesService);
  });

  it('throws NotFoundException when category does not exist', async () => {
    categoryRepository.findById.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('throws ConflictException when deleting category with linked products (ADR-007)', async () => {
    categoryRepository.findByIdWithProductCount.mockResolvedValue({
      id: 1,
      name: 'Electronics',
      productCount: 2,
    });

    await expect(service.remove(1)).rejects.toThrow(ConflictException);
    expect(categoryRepository.delete).not.toHaveBeenCalled();
  });

  it('deletes category when it has no linked products', async () => {
    categoryRepository.findByIdWithProductCount.mockResolvedValue({
      id: 1,
      name: 'Electronics',
      productCount: 0,
    });
    categoryRepository.delete.mockResolvedValue({
      id: 1,
      name: 'Electronics',
    });

    await service.remove(1);

    expect(categoryRepository.delete).toHaveBeenCalledWith(1);
  });
});
