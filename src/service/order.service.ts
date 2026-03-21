import api from "../api/axios";
import { ORDER_QUERY, type OrderQueryType } from "../constants/order-query";
import type {
  OrderCreateRequest,
  OrderStatusUpdateRequest,
} from "../types/order.types";
import type { PageRequest } from "../types/pagination.types";

export const createCashOnDeliveryOrder = (data: OrderCreateRequest) => {
  return api.post("/order/cash-on-delivery", data);
};

export const createStripePaymentOrder = (data: OrderCreateRequest) => {
  return api.post("/order/stripe-payment", data);
};

export const getPaymentIntent = (orderId: number) => {
  return api.get("/order/payment-intent", { params: { orderId } });
};

export const getOrderById = (orderId: number) => {
  return api.get("/order/by-order-id", { params: { orderId } });
};

export const getUnfinishedOrder = (orderId: number) => {
  return api.get("/order/staff/unfinished-order", { params: { orderId } });
};

export const updateOrderStatus = (
  orderId: number,
  orderStatusUpdateRequest: OrderStatusUpdateRequest,
) => {
  return api.patch(`/order/${orderId}/status`, orderStatusUpdateRequest);
};

export const getActiveOrder = (orderId: number) => {
  return api.get("/order/active-order", { params: { orderId } });
};

export const getOrderHistory = (orderId: number) => {
  return api.get("/order/order-history", { params: { orderId } });
};

export const getOrders = (
  pageRequest: PageRequest,
  orderQueryType: OrderQueryType = ORDER_QUERY.ACTIVE,
) => {
  return api.get("/order", {
    params: {
      ...pageRequest,
      orderQueryType,
    },
  });
};
