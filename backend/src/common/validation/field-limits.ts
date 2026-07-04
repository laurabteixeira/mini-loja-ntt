/** Input limits (ADR-013). Enforced in DTOs via class-validator; not in Prisma schema.
 *  Keep in sync with frontend/src/lib/field-limits.ts (subset used by forms). */
export const FIELD_LIMITS = {
  categoryName: 100,
  productName: 200,
  productDescription: 400,
  productImageUrl: 2048,
  productPriceMax: 9_999_999.99,
  querySearch: 100,
  queryLimitMax: 100,
  queryPageMax: 10_000,
} as const;
