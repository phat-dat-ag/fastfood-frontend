import api from "../api/axios";
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

export const getProducts = () => {
  return api.get("/admin/product");
};

export const getProductBySlug = (slug: string) => {
  return api.get("/admin/product/detail", { params: { slug } });
};

export const deleteProduct = (id: number) => {
  return api.delete("/admin/product", { params: { id } });
};
