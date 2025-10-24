import api from "../api/axios";
import type { CartCreateRequest, CartUpdateRequest } from "../types/cart.types";
import type { DeliveryRequest } from "../types/delivery.types";

export const addProductToCart = (data: CartCreateRequest) => {
  return api.post("/cart", data);
};

export const getCartDetail = (
  promotionCode: string,
  data: DeliveryRequest | null
) => {
  const code: string = promotionCode ?? "";
  return api.post("/cart/my-cart", data, { params: { code } });
};

export const updateCart = (data: CartUpdateRequest) => {
  return api.put("/cart", data);
};

export const deleteProductFromCart = (productId: number) => {
  return api.delete("/cart", { params: { productId } });
};
