import { ApiPropertyOptional } from '@nestjs/swagger';
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
  ValidateIf,
} from 'class-validator';
import { FIELD_LIMITS } from '../../common/validation/field-limits';

export class UpdateProductDto {
  @ApiPropertyOptional({
    example: 'Notebook Gamer Pro',
    minLength: 1,
    maxLength: FIELD_LIMITS.productName,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(FIELD_LIMITS.productName)
  name?: string;

  @ApiPropertyOptional({
    example: 'Updated description',
    minLength: 1,
    maxLength: FIELD_LIMITS.productDescription,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(FIELD_LIMITS.productDescription)
  description?: string;

  @ApiPropertyOptional({
    example: 5299.9,
    minimum: 0.01,
    maximum: FIELD_LIMITS.productPriceMax,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(FIELD_LIMITS.productPriceMax)
  price?: number;

  @ApiPropertyOptional({ example: 2, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId?: number;

  @ApiPropertyOptional({
    example: 'https://example.com/images/notebook-v2.png',
    maxLength: FIELD_LIMITS.productImageUrl,
    nullable: true,
    description: 'Set null or empty string to clear the image URL',
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== '')
  @IsString()
  @MaxLength(FIELD_LIMITS.productImageUrl)
  @IsUrl({ require_protocol: true })
  imageUrl?: string | null;
}
