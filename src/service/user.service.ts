import api from "../api/axios";
import type {
  ChangePasswordRequest,
  EidtUserRequest,
  SignUpConfirmRequest,
  SignUpRequest,
} from "../types/user.types";

export const signUp = (data: SignUpRequest) => {
  return api.post("/users", data);
};

export const verifySignUp = (data: SignUpConfirmRequest) => {
  return api.post("/users/verification", data);
};

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
