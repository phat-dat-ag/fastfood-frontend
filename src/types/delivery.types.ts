export interface DeliveryRequest {
  addressId: number;
}

export interface DeliveryResponse {
  success: boolean;
  message: string;
  distanceKm: number;
  durationMinutes: number;
  fee: number;
}
