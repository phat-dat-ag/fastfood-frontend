export interface OrderCreateRequest {
  userNote: string;
  promotionCode: string;
  addressId: number;
}

export interface Order {
  id: number;
  orderStatus: string;
  placedAt: string | null;
  confirmedAt: string | null;
  deliveringAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  paymentMethod: string;
  paymentStatus: string;
  originalPrice: string;
  subtotalPrice: string;
  deliveryFee: string;
  clientSecret: string | null;
}
