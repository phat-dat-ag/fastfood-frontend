import api from "../api/axios";
import type {
  CategoryCreateRequest,
  CategoryUpdateRequest,
} from "../types/category.types";
import type { PageRequest } from "../types/pagination.types";

function buildCategoryFormData(
  data: CategoryCreateRequest | CategoryUpdateRequest
): FormData {
  const formData = new FormData();
  if ("id" in data && data.id !== undefined) {
    formData.append("id", data.id.toString());
  }
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("activated", data.activated ? "true" : "false");

  if (data.imageUrl) {
    formData.append("imageUrl", data.imageUrl);
  }

  return formData;
}

export const createCategory = (data: CategoryCreateRequest) => {
  const formData = buildCategoryFormData(data);
  return api.post("/admin/category", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getCategories = (pageRequest: PageRequest) => {
  return api.get("/admin/category", { params: pageRequest });
};

export const updateCategory = (data: CategoryUpdateRequest) => {
  const formData = buildCategoryFormData(data);
  return api.put("/admin/category", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteCategory = (id: number) => {
  return api.delete("/admin/category", { params: { id } });
};
