import api from "../api/axios";
import type { PageRequest } from "../types/pagination.types";
import type {
  ProductCreateRequest,
  ProductUpdateRequest,
} from "../types/product.types";

export const createProduct = (data: ProductCreateRequest) => {
  const formData = new FormData();
  formData.append("category_id", data.category_id.toString());
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("price", data.price);
  formData.append("activated", data.activated ? "true" : "false");
  if (data.imageUrl) formData.append("imageUrl", data.imageUrl);
  if (data.modelUrl) formData.append("modelUrl", data.modelUrl);
  return api.post("/admin/product", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateProduct = (data: ProductUpdateRequest) => {
  const formData = new FormData();
  formData.append("id", data.id.toString());
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("activated", data.activated ? "true" : "false");
  if (data.imageUrl) formData.append("imageUrl", data.imageUrl);
  if (data.modelUrl) formData.append("modelUrl", data.modelUrl);
  return api.put("/admin/product", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getProducts = (pageRequest: PageRequest, categorySlug: string) => {
  return api.get("/admin/product", {
    params: { ...pageRequest, categorySlug },
  });
};

export const getAllDisplayableProductsByCategory = (categorySlug: string) => {
  return api.get("/admin/product/display/all/by-category", {
    params: { categorySlug },
  });
};

export const getAllDisplayableProducts = () => {
  return api.get("/admin/product/display/all");
};

export const getProductBySlug = (slug: string) => {
  return api.get("/admin/product/display/detail", { params: { slug } });
};

export const activateProduct = (id: number) => {
  return api.put("/admin/product/activate", null, { params: { id } });
};

export const deactivateProduct = (id: number) => {
  return api.put("/admin/product/deactivate", null, { params: { id } });
};

export const deleteProduct = (id: number) => {
  return api.delete("/admin/product", { params: { id } });
};
