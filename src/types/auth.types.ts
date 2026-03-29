import type { User } from "./user.types";

export interface OTPResponse {
  phone: string;
  expiredAt: string;
}

export interface SignInRequest {
  phone: string;
  password: string;
}

export interface SignInResponse {
  token: string;
  user: User;
}

export interface ForgetPasswordRequest {
  phone: string;
  newPassword: string;
}

export interface ForgetPasswordConfirmRequest {
  phone: string;
  otp: string;
  newPassword: string;
}
