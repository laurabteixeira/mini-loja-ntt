export const PRODUCT_IMAGE_PLACEHOLDER = '/placeholder.png';

export function getProductImageSrc(imageUrl?: string | null): string {
  const trimmed = imageUrl?.trim();
  return trimmed || PRODUCT_IMAGE_PLACEHOLDER;
}

export function hasCustomProductImage(imageUrl?: string | null): boolean {
  return Boolean(imageUrl?.trim());
}
