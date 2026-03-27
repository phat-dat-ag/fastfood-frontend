import api from "../api/axios";
import type { PageRequest } from "../types/pagination.types";

export const getAllQuizFeedbacks = (request: PageRequest) => {
  return api.get(`/admin/quizzes/feedback`, { params: request });
};
