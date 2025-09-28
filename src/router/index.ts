import { createRouter, createWebHistory } from "vue-router";
import GuestLayout from "../layouts/GuestLayout.vue";
import GuestHome from "../pages/guest/GuestHome.vue";
import SignUp from "../pages/guest/SignUp.vue";
import SignIn from "../pages/guest/SignIn.vue";
import ForgetPassword from "../pages/guest/ForgetPassword.vue";
import UserLayout from "../layouts/UserLayout.vue";
import UserHome from "../pages/user/UserHome.vue";
import StaffLayout from "../layouts/StaffLayout.vue";
import StaffHome from "../pages/staff/StaffHome.vue";
import AdminLayout from "../layouts/AdminLayout.vue";
import AdminHome from "../pages/admin/AdminHome.vue";
import { useUserStore } from "../store/useUserStore";
import { ADMIN, STAFF, USER } from "../constants/user-role.constant";
import Account from "../pages/Account.vue";
import UpdateAccount from "../pages/UpdateAccount.vue";
import ChangePassword from "../pages/ChangePassword.vue";

const routes = [
  {
    path: "/",
    component: GuestLayout,
    children: [
      { path: "", name: "GuestHome", component: GuestHome },
      { path: "sign-up", name: "SignUp", component: SignUp },
      { path: "sign-in", name: "SignIn", component: SignIn },
      {
        path: "forget-password",
        name: "ForgetPassword",
        component: ForgetPassword,
      },
    ],
  },
  {
    path: "/user",
    component: UserLayout,
    meta: { requireAuth: true, roles: [USER] },
    children: [
      { path: "", name: "UserHome", component: UserHome },
      {
        path: "account",
        name: "UserAccount",
        component: Account,
      },
      {
        path: "update-infor",
        name: "UpdateUserAccount",
        component: UpdateAccount,
      },
      {
        path: "change-password",
        name: "ChangeUserPassword",
        component: ChangePassword,
      },
    ],
  },
  {
    path: "/staff",
    component: StaffLayout,
    meta: { requireAuth: true, roles: [STAFF] },
    children: [
      { path: "", name: "StaffHome", component: StaffHome },
      {
        path: "account",
        name: "StaffAccount",
        component: Account,
      },
      {
        path: "update-infor",
        name: "UpdateStaffAccount",
        component: UpdateAccount,
      },
      {
        path: "change-password",
        name: "ChangeStaffPassword",
        component: ChangePassword,
      },
    ],
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requireAuth: true, roles: [ADMIN] },
    children: [{ path: "", name: "AdminHome", component: AdminHome }],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.meta.requireAuth && !userStore.isSignedIn()) {
    return next({ name: "SignIn" });
  }

  if (to.meta.roles && userStore.user) {
    const roles = to.meta.roles as string[];
    const userRole: string = userStore.user.role;

    if (to.meta.roles && !roles.includes(userRole)) {
      switch (userStore.user?.role) {
        case ADMIN:
          return next({ name: "AdminHome" });
        case STAFF:
          return next({ name: "StaffHome" });
        case USER:
          return next({ name: "UserHome" });
        default:
          return next({ name: "UserHome" });
      }
    }
  }

  next();
});

export default router;
