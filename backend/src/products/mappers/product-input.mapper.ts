import { assertHasUpdateFields } from '../../common/payload/partial-update.helper';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

export type ProductCreateInput = {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrl?: string;
};

export type ProductUpdateInput = {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: number;
  imageUrl?: string | null;
};

export class ProductInputMapper {
  static toCreateInput(dto: CreateProductDto): ProductCreateInput {
    return {
      name: dto.name,
      description: dto.description,
      price: dto.price,
      categoryId: dto.categoryId,
      ...(dto.imageUrl !== undefined ? { imageUrl: dto.imageUrl } : {}),
    };
  }

  static toUpdateInput(dto: UpdateProductDto): ProductUpdateInput {
    assertHasUpdateFields(dto);

    const input: ProductUpdateInput = {};

    if (dto.name !== undefined) {
      input.name = dto.name;
    }

    if (dto.description !== undefined) {
      input.description = dto.description;
    }

    if (dto.price !== undefined) {
      input.price = dto.price;
    }

    if (dto.categoryId !== undefined) {
      input.categoryId = dto.categoryId;
    }

    if (dto.imageUrl !== undefined) {
      input.imageUrl = dto.imageUrl === '' ? null : dto.imageUrl;
    }

    return input;
  }
}
