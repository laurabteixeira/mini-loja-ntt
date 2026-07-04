import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { HttpErrorResponseDto } from '../dto/error-response.dto';

export const ApiErrorDescriptions = {
  validation:
    'Invalid request payload or query parameters (class-validator / ValidationPipe)',
  invalidIdParam: 'Invalid numeric id in path parameter',
  emptyUpdateBody: 'No fields provided for partial update (PATCH)',
  productNotFound: 'Product with the given id does not exist',
  categoryNotFound: 'Category with the given id does not exist',
  categoryNotFoundOnProductWrite:
    'Referenced categoryId does not exist when creating or updating a product',
  categoryDeleteConflict:
    'Category has associated products and cannot be deleted (ADR-007)',
} as const;

function apiBadRequest(description: string) {
  return ApiBadRequestResponse({
    description,
    type: HttpErrorResponseDto,
  });
}

function apiNotFound(description: string) {
  return ApiNotFoundResponse({
    description,
    type: HttpErrorResponseDto,
  });
}

function apiConflict(description: string) {
  return ApiConflictResponse({
    description,
    type: HttpErrorResponseDto,
  });
}

/** POST/PATCH body or query validation failures */
export function ApiValidationErrorResponse() {
  return apiBadRequest(ApiErrorDescriptions.validation);
}

/** PATCH with `{}` or no updatable fields */
export function ApiEmptyUpdateBodyErrorResponse() {
  return apiBadRequest(ApiErrorDescriptions.emptyUpdateBody);
}

/** Invalid `:id` path parameter (ParseIntPipe) */
export function ApiInvalidIdParamErrorResponse() {
  return apiBadRequest(ApiErrorDescriptions.invalidIdParam);
}

export function ApiProductCreateErrorResponses() {
  return applyDecorators(
    ApiValidationErrorResponse(),
    apiNotFound(ApiErrorDescriptions.categoryNotFoundOnProductWrite),
  );
}

export function ApiProductListErrorResponses() {
  return applyDecorators(ApiValidationErrorResponse());
}

export function ApiProductByIdErrorResponses() {
  return applyDecorators(
    ApiInvalidIdParamErrorResponse(),
    apiNotFound(ApiErrorDescriptions.productNotFound),
  );
}

export function ApiProductUpdateErrorResponses() {
  return applyDecorators(
    ApiValidationErrorResponse(),
    ApiEmptyUpdateBodyErrorResponse(),
    ApiInvalidIdParamErrorResponse(),
    apiNotFound(
      `${ApiErrorDescriptions.productNotFound}; ${ApiErrorDescriptions.categoryNotFoundOnProductWrite}`,
    ),
  );
}

export function ApiProductDeleteErrorResponses() {
  return applyDecorators(
    ApiInvalidIdParamErrorResponse(),
    apiNotFound(ApiErrorDescriptions.productNotFound),
  );
}

export function ApiCategoryCreateErrorResponses() {
  return applyDecorators(ApiValidationErrorResponse());
}

export function ApiCategoryByIdErrorResponses() {
  return applyDecorators(
    ApiInvalidIdParamErrorResponse(),
    apiNotFound(ApiErrorDescriptions.categoryNotFound),
  );
}

export function ApiCategoryUpdateErrorResponses() {
  return applyDecorators(
    ApiValidationErrorResponse(),
    ApiEmptyUpdateBodyErrorResponse(),
    ApiInvalidIdParamErrorResponse(),
    apiNotFound(ApiErrorDescriptions.categoryNotFound),
  );
}

export function ApiCategoryDeleteErrorResponses() {
  return applyDecorators(
    ApiInvalidIdParamErrorResponse(),
    apiNotFound(ApiErrorDescriptions.categoryNotFound),
    apiConflict(ApiErrorDescriptions.categoryDeleteConflict),
  );
}
