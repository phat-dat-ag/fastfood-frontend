import type { DeliveryResponse } from "./delivery.types";
import type { Product } from "./product.types";
import type { Promotion } from "./promotion.types";
import type { User } from "./user.types";

export interface CartCreateRequest {
  productId: number;
  quantity: number;
}

export interface CartUpdateRequest {
  productId: number;
  quantity: number;
}

export interface Cart {
  quantity: number;
  product: Product;
  user: User;
}

export interface PromotionCodeCheckResult {
  success: boolean;
  message: string;
  promotion: Promotion | null;
}

export interface CartResponse {
  carts: Cart[];
  originalPrice: string;
  subtotalPrice: string;
  totalPrice: string;
  applyPromotionResult: PromotionCodeCheckResult | null;
  deliveryInformation: DeliveryResponse;
  deliveryFee: string;
}
