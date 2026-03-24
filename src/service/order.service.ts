import api from "../api/axios";
import { ORDER_QUERY, type OrderQueryType } from "../constants/order-query";
import type {
  OrderCreateRequest,
  OrderStatusUpdateRequest,
} from "../types/order.types";
import type { PageRequest } from "../types/pagination.types";
import type { ReviewCreateRequest } from "../types/review.types";

export const createOrder = (orderCreateRequest: OrderCreateRequest) => {
  return api.post("/orders", orderCreateRequest);
};

export const getPaymentIntent = (orderId: number) => {
  return api.get(`/orders/${orderId}/payment-intent`);
};

export const updateOrder = (
  orderId: number,
  orderStatusUpdateRequest: OrderStatusUpdateRequest,
) => {
  return api.patch(`/orders/${orderId}`, orderStatusUpdateRequest);
};

export const getOrder = (orderId: number) => {
  return api.get(`/orders/${orderId}`);
};

export const getOrders = (
  pageRequest: PageRequest,
  orderQueryType: OrderQueryType = ORDER_QUERY.ACTIVE,
) => {
  return api.get("/orders", {
    params: {
      ...pageRequest,
      orderQueryType,
    },
  });
};

export const createProductReview = (
  orderId: number,
  reviews: ReviewCreateRequest[],
) => {
  const formData = new FormData();

  reviews.forEach((review, index) => {
    formData.append(`reviews[${index}].productId`, review.productId.toString());
    formData.append(`reviews[${index}].rating`, review.rating.toString());
    formData.append(`reviews[${index}].comment`, review.comment);

    review.images.forEach((image) => {
      formData.append(
        `reviews[${index}].images`,
        image.imageFile,
        image.name || image.imageFile.name,
      );
    });
  });

  return api.post(`/orders/${orderId}/reviews`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
