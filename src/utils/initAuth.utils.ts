import type { Router } from "vue-router";
import { verify } from "../service/auth.service";
import { useUserStore } from "../store/useUserStore";
import type { ApiResponse } from "../types/api.types";
import type { SignInResponse } from "../types/auth.types";
import type { AxiosError } from "axios";
import { ROUTE_NAMES } from "../constants/route-names";
import { USER_ROLES } from "../constants/user-roles";

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
      return router.push({ name: ROUTE_NAMES.GUEST.HOME });
    }

    localStorage.setItem("token", resData.data.token);
    userStore.setUser(resData.data.user);

    router.isReady().then(async () => {
      const current = router.currentRoute.value;
      const guestEntryRoutes = [
        ROUTE_NAMES.GUEST.HOME,
        ROUTE_NAMES.AUTH.SIGN_UP,
        ROUTE_NAMES.AUTH.SIGN_IN,
        ROUTE_NAMES.AUTH.FORGET_PASSWORD,
      ];

      if (guestEntryRoutes.includes(current.name as string)) {
        switch (userStore.user?.role) {
          case USER_ROLES.ADMIN:
            await router.push({ name: ROUTE_NAMES.ADMIN.HOME });
            break;
          case USER_ROLES.STAFF:
            await router.push({ name: ROUTE_NAMES.STAFF.HOME });
            break;
          default:
            await router.push({ name: ROUTE_NAMES.USER.HOME });
        }
      }
    });
  } catch (e) {
    const err = e as AxiosError<any>;
    localStorage.removeItem("token");
    userStore.clearUser();
    console.log("Lỗi xử lý token", err.response?.data || err.message || err);
    return router.push({ name: ROUTE_NAMES.GUEST.HOME });
  }
}
