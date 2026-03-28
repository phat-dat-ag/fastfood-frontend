export interface PromotionCreateRequest {
  categoryId?: number;
  productId?: number;
  type: string;
  value: number;
  startAt: string;
  endAt: string;
  quantity: number;
  maxDiscountAmount: number;
  minSpendAmount: number;
  activated: boolean;
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
  name: string;
}

export interface PromotionOrderResponse {
  promotionOrders: Promotion[];
}

export interface PromotionPageResponse {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  promotions: Promotion[];
}

export interface ItemPromotionImage {
  name: string;
  url: string;
  type: string;
  value: number;
  code: string;
  startAt: string;
  endAt: string;
}

export interface ItemPromotionImageResponse {
  categoryPromotions: ItemPromotionImage[];
  productPromotions: ItemPromotionImage[];
}
