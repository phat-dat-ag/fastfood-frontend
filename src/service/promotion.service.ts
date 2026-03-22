import api from "../api/axios";
import type { PromotionQueryType } from "../constants/promotion-query";
import type { PageRequest } from "../types/pagination.types";
import type { PromotionCreateRequest } from "../types/promotion.types";

export const createPromotion = (
  promotionCreateRequest: PromotionCreateRequest,
) => {
  return api.post("/admin/promotion", promotionCreateRequest);
};

export const getPromotions = (
  pageRequest: PageRequest,
  promotionQueryType: PromotionQueryType,
) => {
  const params = {
    ...pageRequest,
    promotionQueryType,
  };
  return api.get("/admin/promotion", { params });
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
