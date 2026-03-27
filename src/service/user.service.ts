import api from "../api/axios";
import type {
  ChangePasswordRequest,
  EidtUserRequest,
} from "../types/user.types";

export const updateAvatar = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.put(`/users/me/avatar`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateUserInformation = (data: EidtUserRequest) => {
  return api.patch(`/users/me`, data);
};

export const changePassword = (data: ChangePasswordRequest) => {
  return api.patch(`/users/me/password`, data);
};

export const getValidPromotions = () => {
  return api.get(`/users/me/promotions/valid`);
};
