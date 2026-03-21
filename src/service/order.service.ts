import api from "../api/axios";
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

export const getAllUnfinishedOrders = (pageRequest: PageRequest) => {
  return api.get("/order/staff/unfinished-orders/all", { params: pageRequest });
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

export const getAllActiveOrders = (pageRequest: PageRequest) => {
  return api.get("/order/active-order/all", { params: pageRequest });
};

export const getActiveOrder = (orderId: number) => {
  return api.get("/order/active-order", { params: { orderId } });
};

export const getAllOrderHistory = (pageRequest: PageRequest) => {
  return api.get("/order/order-history/all", { params: pageRequest });
};

export const getOrderHistory = (orderId: number) => {
  return api.get("/order/order-history", { params: { orderId } });
};

export const getAllOrdersByAdmin = (pageRequest: PageRequest) => {
  return api.get("/order/admin/all", { params: pageRequest });
};
