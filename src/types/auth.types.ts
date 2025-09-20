import type { User } from "./user.types";

// response for sign up and forget password
export interface OTPResponseType {
  phone: string;
  expiredAt: string;
}

// sign up
export interface SignUpFormType {
  name: string;
  phone: string;
  birthdayString: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignUpType {
  name: string;
  phone: string;
  birthdayString: string;
  email: string;
  password: string;
}

export interface SignUpConfirmType {
  phone: string;
  otp: string;
}

// sign in
export interface SignInType {
  phone: string;
  password: string;
}

export interface SignInResponseType {
  token: string;
  user: User;
}

// forget password
export interface ForgetPasswordFormType {
  phone: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgetPasswordType {
  phone: string;
  newPassword: string;
}

export interface ForgetPasswordConfirmType {
  phone: string;
  otp: string;
  newPassword: string;
}
