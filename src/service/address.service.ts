import api from "../api/axios";
import type { AddressCreateRequest } from "../types/geocode.types";

export const createAddress = (data: AddressCreateRequest) => {
  return api.post("/address", data);
};

export const getAddresses = () => {
  return api.get("/address");
};

export const deleteAddress = (id: number) => {
  return api.delete("/address", { params: { id } });
};
