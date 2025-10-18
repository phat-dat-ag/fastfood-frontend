import type {
  PromotionCategoryCreateRequest,
  PromotionOrderCreateRequest,
  PromotionProductCreateRequest,
} from "../types/promotion.types";
import api from "../api/axios";

export const createPromotionCategory = (
  data: PromotionCategoryCreateRequest
) => {
  return api.post("/admin/promotion/category", data);
};

export const getPromotionCategory = () => {
  return api.get("/admin/promotion/category");
};

export const createPromotionProduct = (data: PromotionProductCreateRequest) => {
  return api.post("/admin/promotion/product", data);
};

export const getPromotionProduct = () => {
  return api.get("/admin/promotion/product");
};

export const createPromotionOrder = (data: PromotionOrderCreateRequest) => {
  return api.post("/admin/promotion/order", data);
};

export const getPromotionOrder = () => {
  return api.get("/admin/promotion/order");
};

export const deletePromotion = (promotionId: number) => {
  return api.delete("/admin/promotion", { params: { promotionId } });
};
