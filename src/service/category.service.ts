import api from "../api/axios";

export const getAllDisplayableCategories = () => {
  return api.get("/categories");
};
