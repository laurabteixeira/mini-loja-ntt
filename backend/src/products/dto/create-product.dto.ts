import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { FIELD_LIMITS } from '../../common/validation/field-limits';

export class CreateProductDto {
  @ApiProperty({
    example: 'Notebook Gamer',
    minLength: 1,
    maxLength: FIELD_LIMITS.productName,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(FIELD_LIMITS.productName)
  name: string;

  @ApiProperty({
    example: 'High performance laptop for gaming',
    minLength: 1,
    maxLength: FIELD_LIMITS.productDescription,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(FIELD_LIMITS.productDescription)
  description: string;

  @ApiProperty({
    example: 4999.9,
    minimum: 0.01,
    maximum: FIELD_LIMITS.productPriceMax,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(FIELD_LIMITS.productPriceMax)
  price: number;

  @ApiProperty({ example: 1, minimum: 1, description: 'Existing category id' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  categoryId: number;

  @ApiPropertyOptional({
    example: 'https://example.com/images/notebook.png',
    maxLength: FIELD_LIMITS.productImageUrl,
    description: 'Optional product image URL (http/https)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(FIELD_LIMITS.productImageUrl)
  @IsUrl({ require_protocol: true })
  imageUrl?: string;
}
