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
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Notebook Gamer Pro', minLength: 1 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name?: string;

  @ApiPropertyOptional({
    example: 'Updated description',
    minLength: 1,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  description?: string;

  @ApiPropertyOptional({ example: 5299.9, minimum: 0.01 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price?: number;

  @ApiPropertyOptional({ example: 2, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId?: number;

  @ApiPropertyOptional({
    example: 'https://example.com/images/notebook-v2.png',
    nullable: true,
    description: 'Set null or empty string to clear the image URL',
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== '')
  @IsString()
  @IsUrl({ require_protocol: true })
  imageUrl?: string | null;
}
