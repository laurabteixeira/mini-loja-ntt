import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { FIELD_LIMITS } from '../../common/validation/field-limits';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    example: 'Electronics & Gadgets',
    minLength: 1,
    maxLength: FIELD_LIMITS.categoryName,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(FIELD_LIMITS.categoryName)
  name?: string;
}
