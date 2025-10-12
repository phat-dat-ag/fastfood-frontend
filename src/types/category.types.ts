import type { Product } from "./product.types";

export interface CategoryCreateRequest {
  name: string;
  description: string;
  imageUrl: File | null;
}

export interface CategoryUpdateRequest {
  id: number;
  name: string;
  description: string;
  imageUrl: File | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  products: Product[];
}
