import api from "../api/axios";
import type { CartCreateRequest } from "../types/cart.types";

export const addProductToCart = (data: CartCreateRequest) => {
  return api.post("/cart", data);
};

export const getCartDetail = () => {
  return api.get("/cart");
};

export const deleteProductFromCart = (productId: number) => {
  return api.delete("/cart", { params: { productId } });
};
