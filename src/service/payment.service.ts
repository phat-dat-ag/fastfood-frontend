import api from "../api/axios";
import type { DeliveryRequest } from "../types/delivery.types";

export const createPaymentIntentApi = (
  promotionCode: string,
  data: DeliveryRequest | null
) => {
  const code: string = promotionCode ?? "";
  return api.post("/payment/create-payment-intent", data, { params: { code } });
};
