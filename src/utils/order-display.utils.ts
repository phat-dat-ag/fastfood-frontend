import { ORDER_STATUS } from "../constants/order-status";
import { PAYMENT_METHODS } from "../constants/payment-methods";
import { PAYMENT_STATUS } from "../constants/payment-status";

export const ORDER_STATUS_TEXT: Record<string, string> = {
  [ORDER_STATUS.PENDING]: "Chờ xác nhận",
  [ORDER_STATUS.CONFIRMED]: "Đã xác nhận",
  [ORDER_STATUS.DELIVERING]: "Đang giao",
  [ORDER_STATUS.DELIVERED]: "Đã giao",
  [ORDER_STATUS.CANCELLED]: "Đã hủy",
};

export const PAYMENT_METHOD_TEXT: Record<string, string> = {
  [PAYMENT_METHODS.BANK_TRANSFER]: "Chuyển khoản",
  [PAYMENT_METHODS.CASH_ON_DELIVERY]: "Thanh toán khi nhận hàng",
};

export const PAYMENT_STATUS_TEXT: Record<string, string> = {
  [PAYMENT_STATUS.PENDING]: "Chờ thanh toán",
  [PAYMENT_STATUS.PAID]: "Đã thanh toán",
  [PAYMENT_STATUS.FAILED]: "Thanh toán thất bại",
};

export const getOrderTagType = (
  status: string
): "success" | "info" | "warning" | "danger" => {
  switch (status) {
    case ORDER_STATUS.PENDING:
      return "info";
    case ORDER_STATUS.CONFIRMED:
      return "warning";
    case ORDER_STATUS.DELIVERING:
      return "info";
    case ORDER_STATUS.DELIVERED:
      return "success";
    case ORDER_STATUS.CANCELLED:
      return "danger";
    default:
      return "info";
  }
};

export const getPaymentTagType = (status: string) => {
  switch (status) {
    case PAYMENT_STATUS.PAID:
      return "success";
    case PAYMENT_STATUS.FAILED:
      return "danger";
    default:
      return "warning";
  }
};
