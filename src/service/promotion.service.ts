import api from "../api/axios";

export const getItemPromotionImages = () => {
  return api.get("/promotions/items");
};
