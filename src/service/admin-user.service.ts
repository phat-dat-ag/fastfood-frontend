import api from "../api/axios";
import type { UserQueryType } from "../constants/user-query";
import type { PageRequest } from "../types/pagination.types";

export const getAccounts = (
  pageRequest: PageRequest,
  userQueryType: UserQueryType,
) => {
  const params = { ...pageRequest, userQueryType };
  return api.get(`/admin/users`, { params });
};

export const updateUserActivation = (userId: number, activated: boolean) => {
  return api.patch(`/admin/users/${userId}`, { activated });
};

export const deleteUser = (userId: number) => {
  return api.delete(`/admin/users/${userId}`);
};
