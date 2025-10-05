import api from "../api/axios";
import type {
  SignUpConfirmRequest,
  ForgetPasswordConfirmRequest,
  ForgetPasswordRequest,
  SignInRequest,
  SignUpRequest,
} from "../types/auth.types";

export const signUp = (data: SignUpRequest) => {
  return api.post("/auth/sign-up", data);
};

export const verifySignUp = (data: SignUpConfirmRequest) => {
  return api.post("/auth/verify-sign-up", data);
};

export const signIn = (data: SignInRequest) => {
  return api.post("/auth/sign-in", data);
};

export const forgetPassword = (data: ForgetPasswordRequest) => {
  return api.post("/auth/forget-password", data);
};

export const verifyForgetPassword = (data: ForgetPasswordConfirmRequest) => {
  return api.post("/auth/verify-forget-password", data);
};

export const verify = () => {
  return api.get("/auth/verify");
};
