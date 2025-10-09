import type { Product } from "./product.types";

export interface CategoryCreateRequest {
  name: string;
  description: string;
  categoryImageUrl: File | null;
}

export interface CategoryUpdateRequest {
  id: number;
  name: string;
  description: string;
  categoryImageUrl: File | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  categoryImageUrl: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  products: Product[];
}
