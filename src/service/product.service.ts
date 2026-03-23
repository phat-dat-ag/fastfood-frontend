import api from "../api/axios";

export const getDisplayableProducts = (categorySlug: string) => {
  return api.get(`/products/category/${categorySlug}`);
};

export const getProductBySlug = (slug: string) => {
  return api.get(`/products/${slug}`);
};
