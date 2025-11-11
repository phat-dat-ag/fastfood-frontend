import type { Address } from "./geocode.types";
import type { OrderDetail } from "./order-detail.types";
import type { OrderNote } from "./order-note.types";
import type { Promotion } from "./promotion.types";
import type { Review } from "./review.types";
import type { User } from "./user.types";

export interface OrderCreateRequest {
  userNote: string;
  promotionCode: string;
  addressId: number;
}

export interface Order {
  id: number;
  orderStatus: string;
  placedAt: string;
  confirmedAt: string | null;
  deliveringAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  paymentMethod: string;
  paymentStatus: string;
  originalPrice: string;
  subtotalPrice: string;
  deliveryFee: string;
  totalPrice: string;
  address: Address;
  user: User;
  orderNotes: OrderNote[];
  orderDetails: OrderDetail[];
  reviews: Review[];
  promotion: Promotion;
  clientSecret: string | null;
}

export interface OrderResponse {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  orders: Order[];
}
