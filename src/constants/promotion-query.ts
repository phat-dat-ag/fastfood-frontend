export const PROMOTION_QUERY = {
  CATEGORY: "CATEGORY",
  PRODUCT: "PRODUCT",
  GLOBAL: "GLOBAL",
} as const;

export type PromotionQueryType =
  (typeof PROMOTION_QUERY)[keyof typeof PROMOTION_QUERY];
