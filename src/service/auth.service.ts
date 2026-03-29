import api from "../api/axios";
import type { SignInRequest } from "../types/auth.types";

export const signIn = (data: SignInRequest) => {
  return api.post("/auth/sessions", data);
};

export const verify = () => {
  return api.get("/auth/sessions/me");
};
