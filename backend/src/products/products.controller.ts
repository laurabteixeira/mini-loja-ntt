import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiProductByIdErrorResponses,
  ApiProductCreateErrorResponses,
  ApiProductDeleteErrorResponses,
  ApiProductListErrorResponses,
  ApiProductUpdateErrorResponses,
} from '../swagger/decorators/api-error-responses.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import {
  PaginatedProductsResponseDto,
  ProductResponseDto,
} from '../swagger/dto/api-response.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a product' })
  @ApiCreatedResponse({ type: ProductResponseDto })
  @ApiProductCreateErrorResponses()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List products (paginated, cached in Redis)',
    description:
      'Supports optional filters `categoryId` and `search`. Response is cached per query combination.',
  })
  @ApiOkResponse({ type: PaginatedProductsResponseDto })
  @ApiProductListErrorResponses()
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id (cached in Redis)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: ProductResponseDto })
  @ApiProductByIdErrorResponses()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: ProductResponseDto })
  @ApiProductUpdateErrorResponses()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiNoContentResponse({ description: 'Product deleted' })
  @ApiProductDeleteErrorResponses()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
