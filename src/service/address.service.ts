import api from "../api/axios";
import type { AddressCreateRequest } from "../types/geocode.types";

export const createAddress = (data: AddressCreateRequest) => {
  return api.post("/addresses", data);
};

export const getAddresses = () => {
  return api.get("/addresses");
};

export const deleteAddress = (addressId: number) => {
  return api.delete(`/addresses/${addressId}`);
};
