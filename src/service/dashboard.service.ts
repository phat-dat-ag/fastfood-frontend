import api from "../api/axios";

export const getUserStats = () => {
  return api.get("/dashboard/user");
};
