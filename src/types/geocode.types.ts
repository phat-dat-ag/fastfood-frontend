export interface GoongAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface ParsedAddress {
  placeName: string;
  street: string;
  ward: string;
  district: string;
  province: string;
  latitude?: number;
  longitude?: number;
}

export interface AddressCreateRequest {
  name: string;
  detail: string;
  latitude: number;
  longitude: number;
  street: string;
  ward: string;
  district: string;
  province: string;
}

export interface Address {
  id: number;
  name: string;
  detail: string;
  latitude: number;
  longitude: number;
  street: string;
  ward: string;
  district: string;
  province: string;
}

export interface AddressResponse {
  addresses: Address[];
}
