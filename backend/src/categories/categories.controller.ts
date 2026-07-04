import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { positiveIntPipe } from '../common/validation/positive-int.pipe';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiCategoryByIdErrorResponses,
  ApiCategoryCreateErrorResponses,
  ApiCategoryDeleteErrorResponses,
  ApiCategoryUpdateErrorResponses,
} from '../swagger/decorators/api-error-responses.decorator';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from '../swagger/dto/api-response.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a category' })
  @ApiCreatedResponse({ type: CategoryResponseDto })
  @ApiCategoryCreateErrorResponses()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all categories' })
  @ApiOkResponse({ type: CategoryResponseDto, isArray: true })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: CategoryResponseDto })
  @ApiCategoryByIdErrorResponses()
  findOne(@Param('id', positiveIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: CategoryResponseDto })
  @ApiCategoryUpdateErrorResponses()
  update(
    @Param('id', positiveIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a category',
    description:
      'Returns 409 when the category still has associated products (ADR-007).',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiNoContentResponse({ description: 'Category deleted' })
  @ApiCategoryDeleteErrorResponses()
  remove(@Param('id', positiveIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
