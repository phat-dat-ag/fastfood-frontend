import api from "../api/axios";
import type { PageRequest } from "../types/pagination.types";

export const getAllReviewsByAdmin = (pageRequest: PageRequest) => {
  return api.get(`/admin/reviews`, { params: pageRequest });
};

export const deleteReview = (reviewId: number) => {
  return api.delete(`/admin/reviews/${reviewId}`);
};
