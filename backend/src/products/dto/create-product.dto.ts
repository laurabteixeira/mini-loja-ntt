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
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Notebook Gamer', minLength: 1 })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 'High performance laptop for gaming', minLength: 1 })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  description: string;

  @ApiProperty({ example: 4999.9, minimum: 0.01 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiProperty({ example: 1, minimum: 1, description: 'Existing category id' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  categoryId: number;

  @ApiPropertyOptional({
    example: 'https://example.com/images/notebook.png',
    description: 'Optional product image URL (http/https)',
  })
  @IsOptional()
  @IsString()
  @IsUrl({ require_protocol: true })
  imageUrl?: string;
}
