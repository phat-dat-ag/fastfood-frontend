import api from "../api/axios";

export const getDisplayableTopics = () => {
  return api.get("/topics");
};
