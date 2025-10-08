import api from "../api/axios";
import type {
  ChangePasswordRequest,
  EidtUserRequest ,
} from "../types/user.types";

export const updateAvatar = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/user/update-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateUserInformation = (data: EidtUserRequest ) => {
  return api.post("/user/update-information", data);
};

export const changePassword = (data: ChangePasswordRequest) => {
  return api.post("/user/change-password", data);
};
