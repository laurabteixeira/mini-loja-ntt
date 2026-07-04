import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: {
    category: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      category: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(CategoriesService);
  });

  it('throws NotFoundException when category does not exist', async () => {
    prisma.category.findUnique.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('throws ConflictException when deleting category with linked products (ADR-007)', async () => {
    prisma.category.findUnique.mockResolvedValue({
      id: 1,
      name: 'Electronics',
      _count: { products: 2 },
    });

    await expect(service.remove(1)).rejects.toThrow(ConflictException);
    expect(prisma.category.delete).not.toHaveBeenCalled();
  });

  it('deletes category when it has no linked products', async () => {
    prisma.category.findUnique.mockResolvedValue({
      id: 1,
      name: 'Electronics',
      _count: { products: 0 },
    });
    prisma.category.delete.mockResolvedValue({ id: 1, name: 'Electronics' });

    await service.remove(1);

    expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
