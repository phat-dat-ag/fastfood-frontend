import type { Router } from "vue-router";
import { verify } from "../service/auth.service";
import { useUserStore } from "../store/useUserStore";
import type { ApiResponse } from "../types/api.types";
import type { SignInResponseType } from "../types/auth.types";
import { ADMIN, STAFF } from "../constants/user-role.constant";

export async function initAuth(router: Router) {
  const token = localStorage.getItem("token");
  const userStore = useUserStore();

  if (!token) {
    userStore.clearUser();
    return;
  }

  try {
    const res = await verify();
    const resData: ApiResponse<SignInResponseType> = res.data;
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
    localStorage.removeItem("token");
    userStore.clearUser();
    console.log("Lỗi xử lý token", e);
    return router.push({ name: "GuestPage" });
  }
}
