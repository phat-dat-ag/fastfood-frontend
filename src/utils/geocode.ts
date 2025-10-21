import type { ParsedAddress } from "../types/geocode.types";

export function parseAddressComponents(components: any[]): ParsedAddress {
  if (!Array.isArray(components) || components.length === 0) {
    return { placeName: "", street: "", ward: "", district: "", city: "" };
  }

  return {
    placeName: components[0]?.long_name || "",
    street: components[1]?.long_name || "",
    ward: components[2]?.long_name || "",
    district: components[3]?.long_name || "",
    city: components[4]?.long_name || "",
  };
}
