import type { DeliveryResponse } from "./delivery.types";
import type { Product } from "./product.types";
import type { Promotion } from "./promotion.types";
import type { User } from "./user.types";

export interface CartCreateRequest {
  productId: number;
  quantity: number;
}

export interface Cart {
  quantity: number;
  product: Product;
  user: User;
}

export interface CartDetailResponse {
  carts: Cart[];
  originalPrice: string;
  subtotalPrice: string;
  totalPrice: string;
  promotion: Promotion;
  deliveryInformation: DeliveryResponse;
  deliveryFee: string;
}
