import api from "../api/axios";
import type { CartCreateRequest } from "../types/cart.types";

export const addProductToCart = (data: CartCreateRequest) => {
  return api.post("/carts", data);
};

export const getCartDetail = (
  promotionCode: string,
  addressId: number | null,
) => {
  const code: string = promotionCode ?? "";
  return api.get("/carts/me", { params: { code, addressId } });
};

export const updateCart = (productId: number, quantity: number) => {
  return api.patch(`/carts/me/items/${productId}`, { quantity });
};

export const deleteProductFromCart = (productId: number) => {
  return api.delete(`/carts/me/items/${productId}`);
};
