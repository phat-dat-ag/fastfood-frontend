import api from "../api/axios";
import type { PageRequest } from "../types/pagination.types";
import type { PromotionCreateRequest } from "../types/promotion.types";

export const createPromotion = (
  promotionCreateRequest: PromotionCreateRequest,
) => {
  return api.post("/admin/promotion", promotionCreateRequest);
};

export const getPromotionCategory = (pageRequest: PageRequest) => {
  return api.get("/admin/promotion/category", { params: pageRequest });
};

export const getPromotionProduct = (pageRequest: PageRequest) => {
  return api.get("/admin/promotion/product", { params: pageRequest });
};

export const getPromotionOrder = (pageRequest: PageRequest) => {
  return api.get("/admin/promotion/order", { params: pageRequest });
};

export const getValidPromotionOrder = () => {
  return api.get("/admin/promotion/order/valid");
};

export const activatePromotion = (promotionId: number) => {
  return api.put("/admin/promotion/activate", null, {
    params: { promotionId },
  });
};

export const deactivatePromotion = (promotionId: number) => {
  return api.put("/admin/promotion/deactivate", null, {
    params: { promotionId },
  });
};

export const deletePromotion = (promotionId: number) => {
  return api.delete("/admin/promotion", { params: { promotionId } });
};
