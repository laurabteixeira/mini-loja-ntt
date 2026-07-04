import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics', minLength: 1 })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;
}
