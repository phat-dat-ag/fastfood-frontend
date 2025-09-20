import { defineStore } from "pinia";
import type { ForgetPasswordType, SignUpType } from "../types/auth.types";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    signUpData: null as SignUpType | null,
    forgetPasswordData: null as ForgetPasswordType | null,
  }),
  actions: {
    setSignUpData(newSignUpData: SignUpType) {
      this.signUpData = newSignUpData;
    },
    setForgetPasswordData(newForgetPasswordData: ForgetPasswordType) {
      this.forgetPasswordData = newForgetPasswordData;
    },
  },
});
