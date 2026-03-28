import api from "../api/axios";
import type {
  CategoryCreateRequest,
  CategoryUpdateRequest,
} from "../types/category.types";
import type { PageRequest } from "../types/pagination.types";

function buildCategoryFormData(
  data: CategoryCreateRequest | CategoryUpdateRequest,
): FormData {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("activated", data.activated ? "true" : "false");

  if (data.imageUrl) {
    formData.append("imageUrl", data.imageUrl);
  }

  return formData;
}

export const createCategory = (
  categoryCreateRequest: CategoryCreateRequest,
) => {
  const formData = buildCategoryFormData(categoryCreateRequest);
  return api.post("/admin/categories", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateCategory = (
  categoryUpdateRequest: CategoryUpdateRequest,
) => {
  const formData = buildCategoryFormData(categoryUpdateRequest);
  return api.put(`/admin/categories/${categoryUpdateRequest.id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getCategoryPage = (pageRequest: PageRequest) => {
  return api.get("/admin/categories", { params: pageRequest });
};

export const getCategorySelections = () => {
  return api.get("/admin/categories/selection");
};

export const updateCategoryActivation = (
  categoryId: number,
  activated: boolean,
) => {
  return api.patch(`/admin/categories/${categoryId}`, {
    activated,
  });
};

export const deleteCategory = (categoryId: number) => {
  return api.delete(`/admin/categories/${categoryId}`);
};

export const getCategoryStats = () => {
  return api.get("/admin/categories/stats");
};
