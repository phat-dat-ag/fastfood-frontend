import type { Category } from "./category.types";
import type { Product } from "./product.types";
import type { User } from "./user.types";

export interface PromotionCategoryCreateRequest {
  categoryId: number;
  type: string;
  value: number;
  startAt: string;
  endAt: string;
  quantity: number;
  maxDiscountAmount: number;
  minSpendAmount: number;
  isGlobal: boolean;
  isActivated: boolean;
  code: string;
}

export interface Promotion {
  id: number;
  type: string;
  value: number;
  startAt: string;
  endAt: string;
  quantity: number;
  usedQuantity: number;
  maxDiscountAmount: number;
  minSpendAmount: number;
  global: boolean;
  activated: boolean;
  createdAt: string;
  updatedAt: string;
  code: string;
  user: User | null;
  category: Category | null;
  product: Product | null;
}

export interface PromotionResponse {
  promotions: Promotion[];
}
