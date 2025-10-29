import api from "../api/axios";
import type { OrderCreateRequest } from "../types/order.types";

export const createCashOnDeliveryOrder = (data: OrderCreateRequest) => {
  return api.post("/order/cash-on-delivery", data);
};

export const createStripePaymentOrder = (data: OrderCreateRequest) => {
  return api.post("/order/stripe-payment", data);
};

export const getUnfinishedOrder = () => {
  return api.get("/order/unfinished-orders/all");
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

export const getUnfinishedOrderByUser = () => {
  return api.get("/order/unfinished-orders/by-user");
};
