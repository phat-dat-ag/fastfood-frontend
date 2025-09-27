import type { User } from "./user.types";

// response for sign up and forget password
export interface OTPResponseType {
  phone: string;
  expiredAt: string;
}

// sign up
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

// sign in
export interface SignInRequest {
  phone: string;
  password: string;
}

export interface SignInResponse {
  token: string;
  user: User;
}

// forget password
export interface ForgetPasswordRequest {
  phone: string;
  newPassword: string;
}

export interface ForgetPasswordConfirmRequest {
  phone: string;
  otp: string;
  newPassword: string;
}
