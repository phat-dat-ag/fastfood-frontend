import type { Product } from "./product.types";

export interface OrderDetail {
  quantity: number;
  discountedPrice: number;
  product: Product;
}
