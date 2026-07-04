import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name?: string;
}
