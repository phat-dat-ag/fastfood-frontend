import type { Product } from "./product.types";
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

export interface CartResponse {
  carts: Cart[];
}
