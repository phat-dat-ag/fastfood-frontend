import api from "../api/axios";
import type { ProductCreateRequest } from "../types/product.types";

export const createProduct = (data: ProductCreateRequest) => {
  const formData = new FormData();
  formData.append("category_id", data.category_id.toString());
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("price", data.price);
  formData.append("activated", data.activated ? "true" : "false");
  if (data.productImageUrl)
    formData.append("productImageUrl", data.productImageUrl);
  return api.post("/admin/product", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getProducts = () => {
  return api.get("/admin/product");
};

export const deleteProduct = (id: number) => {
  return api.delete("/admin/product", { params: { id } });
};
