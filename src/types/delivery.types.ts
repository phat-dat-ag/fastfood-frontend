export interface DeliveryRequest {
  customerLatitude: number;
  customerLongitude: number;
}

export interface DeliveryResponse {
  success: boolean;
  message: string;
  distanceKm: number;
  durationMinutes: number;
  fee: number;
}
