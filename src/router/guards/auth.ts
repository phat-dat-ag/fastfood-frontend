import type { Router } from "vue-router";
import { useUserStore } from "../../store/useUserStore";
import { ROUTE_NAMES } from "../../constants/route-names";
import { USER_ROLES } from "../../constants/user-roles";

export const setupAuthGuard = function (router: Router) {
  router.beforeEach((to, from, next) => {
    const userStore = useUserStore();

    if (to.meta.requireAuth && !userStore.isSignedIn()) {
      return next({ name: ROUTE_NAMES.AUTH.SIGN_IN });
    }

    if (to.meta.roles && userStore.user) {
      const roles = to.meta.roles as string[];
      const userRole: string = userStore.user.role;

      if (to.meta.roles && !roles.includes(userRole)) {
        switch (userStore.user?.role) {
          case USER_ROLES.ADMIN:
            return next({ name: ROUTE_NAMES.ADMIN.HOME });
          case USER_ROLES.STAFF:
            return next({ name: ROUTE_NAMES.STAFF.HOME });
          case USER_ROLES.USER:
            return next({ name: ROUTE_NAMES.USER.HOME });
          default:
            return next({ name: ROUTE_NAMES.USER.HOME });
        }
      }
    }

    next();
  });
};
