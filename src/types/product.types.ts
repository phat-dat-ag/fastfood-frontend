import type { Promotion } from "./promotion.types";
import type { Review } from "./review.types";

export interface ProductCreateRequest {
  category_id: number;
  name: string;
  description: string;
  price: string;
  activated: boolean;
  imageUrl: File | null;
  modelUrl: File | null;
}

export interface ProductUpdateRequest {
  id: number;
  name: string;
  description: string;
  activated: boolean;
  imageUrl: File | null;
  modelUrl: File | null;
}

export interface Product {
  categoryId: number;
  categoryName: string;
  id: number;
  name: string;
  slug: string;
  price: string;
  description: string;
  imageUrl: string;
  modelUrl: string;
  activated: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  promotions: Promotion[];
  reviews: Review[];
  discountedPrice: string;
  promotionId: number;
}
