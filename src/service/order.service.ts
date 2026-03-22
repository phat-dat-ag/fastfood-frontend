import api from "../api/axios";
import { ORDER_QUERY, type OrderQueryType } from "../constants/order-query";
import type {
  OrderCreateRequest,
  OrderStatusUpdateRequest,
} from "../types/order.types";
import type { PageRequest } from "../types/pagination.types";

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
