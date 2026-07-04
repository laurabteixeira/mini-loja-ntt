export const CATEGORIES_CHANGED_EVENT = 'mini-loja:categories-changed';

export function dispatchCategoriesChanged() {
  window.dispatchEvent(new CustomEvent(CATEGORIES_CHANGED_EVENT));
}
