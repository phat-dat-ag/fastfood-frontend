import api from "../api/axios";
import type { ReviewCreateRequest } from "../types/review.types";

export const createProductReview = (
  orderId: number,
  reviews: ReviewCreateRequest[]
) => {
  const formData = new FormData();
  formData.append("orderId", orderId.toString());

  reviews.forEach((review, index) => {
    formData.append(`reviews[${index}].productId`, review.productId.toString());
    formData.append(`reviews[${index}].rating`, review.rating.toString());
    formData.append(`reviews[${index}].comment`, review.comment);

    review.images.forEach((image) => {
      formData.append(
        `reviews[${index}].images`,
        image.imageFile,
        image.name || image.imageFile.name
      );
    });
  });

  return api.post("/review", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getAllReviewsByProduct = (productId: number) => {
  return api.get("/review", { params: { productId } });
};
