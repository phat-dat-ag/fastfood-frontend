import api from "../api/axios";

export const getUserStats = () => {
  return api.get("/dashboard/user");
};

export const getOrderStats = () => {
  return api.get("/dashboard/order");
};

export const getCategoryStats = () => {
  return api.get("/dashboard/category");
};

export const getProductStats = () => {
  return api.get("/dashboard/product");
};
