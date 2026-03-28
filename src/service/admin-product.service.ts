import api from "../api/axios";
import type { PageRequest } from "../types/pagination.types";
import type {
  ProductCreateRequest,
  ProductUpdateRequest,
} from "../types/product.types";

export const createProduct = (data: ProductCreateRequest) => {
  const formData = new FormData();
  formData.append("categoryId", data.categoryId.toString());
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("price", data.price);
  formData.append("activated", data.activated ? "true" : "false");
  if (data.imageUrl) formData.append("imageUrl", data.imageUrl);
  if (data.modelUrl) formData.append("modelUrl", data.modelUrl);
  return api.post("/admin/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateProduct = (data: ProductUpdateRequest) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("activated", data.activated ? "true" : "false");
  if (data.imageUrl) formData.append("imageUrl", data.imageUrl);
  if (data.modelUrl) formData.append("modelUrl", data.modelUrl);
  return api.put(`/admin/products/${data.id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getProductPage = (
  pageRequest: PageRequest,
  categorySlug: string,
) => {
  return api.get("/admin/products", {
    params: { ...pageRequest, categorySlug },
  });
};

export const getProductSelections = () => {
  return api.get("/admin/products/selection");
};

export const updateProductActivation = (
  productId: number,
  activated: boolean,
) => {
  return api.patch(`/admin/products/${productId}`, { activated });
};

export const deleteProduct = (productId: number) => {
  return api.delete(`/admin/products/${productId}`);
};

export const getProductStats = () => {
  return api.get("/admin/products/stats");
};
