import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  CATEGORY_REPOSITORY,
  CategoryRepository,
} from './repositories/category.repository';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.create(createCategoryDto);
  }

  findAll() {
    return this.categoryRepository.findAll();
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    if (Object.keys(updateCategoryDto).length === 0) {
      throw new BadRequestException(
        'At least one field must be provided for update',
      );
    }

    await this.findOne(id);

    return this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    const category =
      await this.categoryRepository.findByIdWithProductCount(id);

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    if (category.productCount > 0) {
      throw new ConflictException(
        'Cannot delete category with linked products',
      );
    }

    return this.categoryRepository.delete(id);
  }
}
