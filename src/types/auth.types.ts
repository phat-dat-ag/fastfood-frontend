import type { User } from "./user.types";

export interface OTPResponseType {
  phone: string;
  expiredAt: string;
}

export interface SignUpRequest {
  name: string;
  phone: string;
  birthdayString: string;
  email: string;
  password: string;
}

export interface SignUpConfirmRequest {
  phone: string;
  otp: string;
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
