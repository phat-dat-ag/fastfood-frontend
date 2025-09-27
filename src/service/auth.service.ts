import api from "../api/axios";
import type {
  SignUpConfirmRequest,
  ForgetPasswordConfirmRequest,
  ForgetPasswordRequest,
  SignInRequest,
  SignUpRequest,
} from "../types/auth.types";

export const signUp = async (data: SignUpRequest) => {
  return await api.post("/auth/sign-up", data);
};

export const verifySignUp = async (data: SignUpConfirmRequest) => {
  return await api.post("/auth/verify-sign-up", data);
};

export const signIn = async (data: SignInRequest) => {
  return await api.post("/auth/sign-in", data);
};

export const forgetPassword = async (data: ForgetPasswordRequest) => {
  return await api.post("/auth/forget-password", data);
};

export const verifyForgetPassword = async (
  data: ForgetPasswordConfirmRequest
) => {
  return await api.post("/auth/verify-forget-password", data);
};

export const verify = async () => {
  return await api.get("/auth/verify");
};
