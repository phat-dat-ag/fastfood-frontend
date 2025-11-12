import api from "../api/axios";
import type { PageRequest } from "../types/pagination.types";
import type {
  ChangePasswordRequest,
  EidtUserRequest,
} from "../types/user.types";

export const updateAvatar = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/user/update-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateUserInformation = (data: EidtUserRequest) => {
  return api.post("/user/update-information", data);
};

export const changePassword = (data: ChangePasswordRequest) => {
  return api.post("/user/change-password", data);
};

export const getAllCustomerAccounts = (pageRequest: PageRequest) => {
  return api.get("/user/manage/get/customers", { params: pageRequest });
};

export const getAllStaffAccounts = (pageRequest: PageRequest) => {
  return api.get("/user/manage/get/staff", { params: pageRequest });
};

export const activateAccount = (userId: number) => {
  return api.put("/user/manage/activate-account", null, { params: { userId } });
};

export const deactivateAccount = (userId: number) => {
  return api.put("/user/manage/deactivate-account", null, {
    params: { userId },
  });
};

export const deleteUser = (phone: string) => {
  return api.delete("/user/manage", { params: { phone } });
};
