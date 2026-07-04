import { assertHasUpdateFields } from '../../common/payload/partial-update.helper';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

export type CategoryCreateInput = {
  name: string;
};

export type CategoryUpdateInput = {
  name?: string;
};

export class CategoryInputMapper {
  static toCreateInput(dto: CreateCategoryDto): CategoryCreateInput {
    return { name: dto.name };
  }

  static toUpdateInput(dto: UpdateCategoryDto): CategoryUpdateInput {
    assertHasUpdateFields(dto);

    const input: CategoryUpdateInput = {};

    if (dto.name !== undefined) {
      input.name = dto.name;
    }

    return input;
  }
}
