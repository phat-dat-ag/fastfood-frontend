import api from "../api/axios";
import type { CartCreateRequest, CartUpdateRequest } from "../types/cart.types";

export const addProductToCart = (data: CartCreateRequest) => {
  return api.post("/cart", data);
};

export const getCartDetail = (promotionCode: string) => {
  const code: string = promotionCode ?? "";
  return api.get("/cart", { params: { code } });
};

export const updateCart = (data: CartUpdateRequest) => {
  return api.put("/cart", data);
};

export const deleteProductFromCart = (productId: number) => {
  return api.delete("/cart", { params: { productId } });
};
