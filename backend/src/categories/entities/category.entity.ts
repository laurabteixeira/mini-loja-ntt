export interface Category {
  id: number;
  name: string;
}

export interface CategoryWithProductCount extends Category {
  productCount: number;
}
