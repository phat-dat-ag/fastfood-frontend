export const PAYMENT_METHODS = {
  BANK_TRANSFER: "BANK_TRANSFER",
  CASH_ON_DELIVERY: "CASH_ON_DELIVERY",
} as const;

export type PaymentMethodType =
  (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];
