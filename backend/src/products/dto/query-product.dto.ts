import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { FIELD_LIMITS } from '../../common/validation/field-limits';

export class QueryProductDto {
  @ApiPropertyOptional({
    example: 1,
    default: 1,
    minimum: 1,
    maximum: FIELD_LIMITS.queryPageMax,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(FIELD_LIMITS.queryPageMax)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    minimum: 1,
    maximum: FIELD_LIMITS.queryLimitMax,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(FIELD_LIMITS.queryLimitMax)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 1,
    minimum: 1,
    description: 'Filter products by category id',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId?: number;

  @ApiPropertyOptional({
    example: 'notebook',
    maxLength: FIELD_LIMITS.querySearch,
    description: 'Search in product name and description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(FIELD_LIMITS.querySearch)
  search?: string;
}
