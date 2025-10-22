import type { ParsedAddress } from "../types/geocode.types";

export function parseAddressComponents(
  components: any[],
  lat?: number,
  lng?: number
): ParsedAddress {
  if (!Array.isArray(components) || components.length === 0) {
    return {
      placeName: "",
      street: "",
      ward: "",
      district: "",
      province: "",
      latitude: lat,
      longitude: lng,
    };
  }

  return {
    placeName: components[0]?.long_name || "Không xác định",
    street: components[1]?.long_name || "Không xác định",
    ward: components[2]?.long_name || "Không xác định",
    district: components[3]?.long_name || "Không xác định",
    province: components[4]?.long_name || "Không xác định",
    latitude: lat,
    longitude: lng,
  };
}
