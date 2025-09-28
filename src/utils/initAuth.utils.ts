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
      return router.push({ name: "GuestHome" });
    }

    localStorage.setItem("token", resData.data.token);
    userStore.setUser(resData.data.user);

    router.isReady().then(async () => {
      const current = router.currentRoute.value;
      const guestEntryRoutes = [
        "GuestHome",
        "SignIn",
        "SignUp",
        "ForgetPassword",
      ];

      if (guestEntryRoutes.includes(current.name as string)) {
        switch (userStore.user?.role) {
          case ADMIN:
            await router.push({ name: "AdminHome" });
            break;
          case STAFF:
            await router.push({ name: "StaffHome" });
            break;
          default:
            await router.push({ name: "UserHome" });
        }
      }
    });
  } catch (e) {
    const err = e as AxiosError<any>;
    localStorage.removeItem("token");
    userStore.clearUser();
    console.log("Lỗi xử lý token", err.response?.data || err.message || err);
    return router.push({ name: "GuestHome" });
  }
}
