import { defineStore } from "pinia";
import type { ForgetPasswordRequest } from "../types/auth.types";
import type { SignUpRequest } from "../types/user.types";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    signUpData: null as SignUpRequest | null,
    forgetPasswordData: null as ForgetPasswordRequest | null,
  }),
  actions: {
    setSignUpData(newSignUpData: SignUpRequest) {
      this.signUpData = newSignUpData;
    },
    setForgetPasswordData(newForgetPasswordData: ForgetPasswordRequest) {
      this.forgetPasswordData = newForgetPasswordData;
    },
  },
});
