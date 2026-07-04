import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { FIELD_LIMITS } from '../../common/validation/field-limits';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Electronics',
    minLength: 1,
    maxLength: FIELD_LIMITS.categoryName,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(FIELD_LIMITS.categoryName)
  name: string;
}
