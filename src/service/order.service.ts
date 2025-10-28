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
