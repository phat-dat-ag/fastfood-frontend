import { defineStore } from "pinia";
import type { User } from "../types/user.types";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
  }),
  actions: {
    setUser(newUser: User) {
      this.user = newUser;
    },
    isSignedIn(): boolean {
      return this.user !== null;
    },
    clearUser() {
      this.user = null;
    },
  },
});
