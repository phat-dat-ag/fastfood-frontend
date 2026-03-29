import api from "../api/axios";
import type {
  ForgetPasswordConfirmRequest,
  ForgetPasswordRequest,
} from "../types/auth.types";

export const forgetPassword = (data: ForgetPasswordRequest) => {
  return api.post("/password-resets", data);
};

export const verifyForgetPassword = (data: ForgetPasswordConfirmRequest) => {
  return api.post("/password-resets/verification", data);
};
