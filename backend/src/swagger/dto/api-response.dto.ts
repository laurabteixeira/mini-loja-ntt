import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Electronics' })
  name: string;

  @ApiProperty({ example: 3, required: false })
  productCount?: number;
}

export class CategorySummaryDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Electronics' })
  name: string;
}

export class ProductResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Notebook Gamer' })
  name: string;

  @ApiProperty({ example: 'High performance laptop' })
  description: string;

  @ApiProperty({ example: 4999.9 })
  price: number;

  @ApiProperty({ example: 1 })
  categoryId: number;

  @ApiProperty({
    example: 'https://example.com/images/notebook.png',
    nullable: true,
    required: false,
  })
  imageUrl?: string | null;

  @ApiProperty({ type: CategorySummaryDto })
  category: CategorySummaryDto;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}

export class PaginatedProductsResponseDto {
  @ApiProperty({ type: [ProductResponseDto] })
  data: ProductResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
