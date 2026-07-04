import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Electronics & Gadgets', minLength: 1 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name?: string;
}
