import type {
  PromotionCategoryCreateRequest,
  PromotionOrderCreateRequest,
  PromotionProductCreateRequest,
} from "../types/promotion.types";
import api from "../api/axios";
import type { PageRequest } from "../types/pagination.types";

export const createPromotionCategory = (
  data: PromotionCategoryCreateRequest
) => {
  return api.post("/admin/promotion/category", data);
};

export const getPromotionCategory = (pageRequest: PageRequest) => {
  return api.get("/admin/promotion/category", { params: pageRequest });
};

export const createPromotionProduct = (data: PromotionProductCreateRequest) => {
  return api.post("/admin/promotion/product", data);
};

export const getPromotionProduct = (pageRequest: PageRequest) => {
  return api.get("/admin/promotion/product", { params: pageRequest });
};

export const createPromotionOrder = (data: PromotionOrderCreateRequest) => {
  return api.post("/admin/promotion/order", data);
};

export const getPromotionOrder = (pageRequest: PageRequest) => {
  return api.get("/admin/promotion/order", { params: pageRequest });
};

export const getValidPromotionOrder = () => {
  return api.get("/admin/promotion/order/valid");
};

export const deletePromotion = (promotionId: number) => {
  return api.delete("/admin/promotion", { params: { promotionId } });
};
