import api from "../api/axios";
import type { OrderCreateRequest } from "../types/order.types";
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

export const confirmOrder = (orderId: number) => {
  return api.put("/order/confirm", null, { params: { orderId } });
};

export const markAsDelivering = (orderId: number) => {
  return api.put("/order/mark-delivering", null, { params: { orderId } });
};

export const markAsDelivered = (orderId: number) => {
  return api.put("/order/mark-delivered", null, { params: { orderId } });
};

export const cancelOrder = (orderId: number, reason: string) => {
  return api.put(
    "/order/user/cancel-order",
    { reason },
    { params: { orderId } }
  );
};

export const cancelOrderByStaff = (orderId: number, reason: string) => {
  return api.put(
    "/order/staff/cancel-order",
    { reason },
    { params: { orderId } }
  );
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
