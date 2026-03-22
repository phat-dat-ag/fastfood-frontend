import api from "../api/axios";
import type { PromotionQueryType } from "../constants/promotion-query";
import type { PageRequest } from "../types/pagination.types";
import type { PromotionCreateRequest } from "../types/promotion.types";

export const createPromotion = (
  promotionCreateRequest: PromotionCreateRequest,
) => {
  return api.post("/admin/promotions", promotionCreateRequest);
};

export const getPromotions = (
  pageRequest: PageRequest,
  promotionQueryType: PromotionQueryType,
) => {
  const params = {
    ...pageRequest,
    promotionQueryType,
  };
  return api.get("/admin/promotions", { params });
};

export const updatePromotionActivation = (
  promotionId: number,
  activated: boolean,
) => {
  return api.patch(`/admin/promotions/${promotionId}`, { activated });
};

export const deletePromotion = (promotionId: number) => {
  return api.delete(`/admin/promotions/${promotionId}`);
};
