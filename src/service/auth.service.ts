import api from "../api/axios";
import type {
  SignUpConfirmType,
  ForgetPasswordConfirmType,
  ForgetPasswordType,
  SignInType,
  SignUpType,
} from "../types/auth.types";

export const signUp = async (data: SignUpType) => {
  return await api.post("/auth/sign-up", data);
};

export const verifySignUp = async (data: SignUpConfirmType) => {
  return await api.post("/auth/verify-sign-up", data);
};

export const signIn = async (data: SignInType) => {
  return await api.post("/auth/sign-in", data);
};

export const forgetPassword = async (data: ForgetPasswordType) => {
  return await api.post("/auth/forget-password", data);
};

export const verifyForgetPassword = async (data: ForgetPasswordConfirmType) => {
  return await api.post("/auth/verify-forget-password", data);
};

export const verify = async () => {
  return await api.get("/auth/verify");
};
