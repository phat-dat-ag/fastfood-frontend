import api from "../api/axios";

export const getOrderStats = () => {
  return api.get("/admin/orders/stats");
};
