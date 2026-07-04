/** Mirrors backend FIELD_LIMITS (ADR-013). Keep in sync with backend/src/common/validation/field-limits.ts */
export const FIELD_LIMITS = {
  categoryName: 100,
  productName: 200,
  productDescription: 400,
  productImageUrl: 2048,
  productPriceMax: 9_999_999.99,
} as const;
