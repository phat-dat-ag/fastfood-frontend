import api from "../api/axios";
import type { ImageCreateRequest } from "../types/image.types";

export const uploadImage = (imageCreateRequest: ImageCreateRequest) => {
  const formData = new FormData();
  formData.append("imageFile", imageCreateRequest.imageFile);
  formData.append("alternativeText", imageCreateRequest.alternativeText);
  formData.append("pageType", imageCreateRequest.pageType);
  formData.append("sectionType", imageCreateRequest.sectionType);
  return api.post("/admin/images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteImage = (imageId: number) => {
  return api.delete(`/admin/images/${imageId}`);
};
