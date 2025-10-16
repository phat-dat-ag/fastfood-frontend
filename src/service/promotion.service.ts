import type { PromotionCategoryCreateRequest } from "../types/promotion.types";
import api from "../api/axios";

export const createPromotionCategory = (
  data: PromotionCategoryCreateRequest
) => {
  return api.post("/admin/promotion/category", data);
};

export const getPromotionCategory = () => {
  return api.get("/admin/promotion/category");
};

export const deletePromotionCategory = (promotionId: number) => {
  return api.delete("/admin/promotion/category", { params: { promotionId } });
};
