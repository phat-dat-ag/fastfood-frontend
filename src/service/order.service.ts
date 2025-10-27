import api from "../api/axios";
import type { OrderCreateRequest } from "../types/order.types";

export const createCashOnDeliveryOrder = (data: OrderCreateRequest) => {
  return api.post("/order/cash-on-delivery", data);
};
