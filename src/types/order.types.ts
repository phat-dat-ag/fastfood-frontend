import type { Address } from "./geocode.types";
import type { OrderNote } from "./order-note.types";
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
  address: Address;
  user: User;
  orderNotes: OrderNote[];
  clientSecret: string | null;
}

export interface OrderResponse {
  orders: Order[];
}
