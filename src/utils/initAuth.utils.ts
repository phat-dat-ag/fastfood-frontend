import type { Router } from "vue-router";
import { verify } from "../service/auth.service";
import { useUserStore } from "../store/useUserStore";
import type { ApiResponse } from "../types/api.types";
import type { SignInResponse } from "../types/auth.types";
import { ADMIN, STAFF } from "../constants/user-role.constant";
import type { AxiosError } from "axios";

export async function initAuth(router: Router) {
  const token = localStorage.getItem("token");
  const userStore = useUserStore();

  if (!token) {
    userStore.clearUser();
    return;
  }

  try {
    const res = await verify();
    const resData: ApiResponse<SignInResponse> = res.data;
    if (!resData.data) {
      localStorage.removeItem("token");
      userStore.clearUser();
      return router.push({ name: "GuestPage" });
    }

    localStorage.setItem("token", resData.data.token);
    userStore.setUser(resData.data.user);
    switch (userStore.user?.role) {
      case ADMIN:
        router.push({ name: "AdminPage" });
        break;
      case STAFF:
        router.push({ name: "StaffPage" });
        break;
      default:
        router.push({ name: "UserPage" });
    }
  } catch (e) {
    const err = e as AxiosError<any>;
    localStorage.removeItem("token");
    userStore.clearUser();
    console.log("Lỗi xử lý token", err.response?.data || err.message || err);
    return router.push({ name: "GuestPage" });
  }
}
