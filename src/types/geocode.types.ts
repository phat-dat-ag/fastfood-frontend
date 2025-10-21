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
  city: string;
}
