import { createRouter, createWebHistory } from "vue-router";
import GuestLayout from "../layouts/GuestLayout.vue";
import Home from "../pages/guest/Home.vue";
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

const routes = [
  {
    path: "/",
    name: "GuestPage",
    component: GuestLayout,
    redirect: { name: "Home" },
    children: [
      { path: "", name: "Home", component: Home },
      { path: "/sign-up", name: "SignUp", component: SignUp },
      { path: "/sign-in", name: "SignIn", component: SignIn },
      {
        path: "/forget-password",
        name: "ForgetPassword",
        component: ForgetPassword,
      },
    ],
  },
  {
    path: "/user",
    name: "UserPage",
    component: UserLayout,
    meta: { requireAuth: true, roles: [USER] },
    redirect: { name: "UserHome" },
    children: [{ path: "", name: "UserHome", component: UserHome }],
  },
  {
    path: "/staff",
    name: "StaffPage",
    component: StaffLayout,
    meta: { requireAuth: true, roles: [STAFF] },
    redirect: { name: "StaffHome" },
    children: [{ path: "", name: "StaffHome", component: StaffHome }],
  },
  {
    path: "/admin",
    name: "AdminPage",
    component: AdminLayout,
    meta: { requireAuth: true, roles: [ADMIN] },
    redirect: { name: "AdminHome" },
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
          return next({ name: "AdminPage" });
        case STAFF:
          return next({ name: "StaffPage" });
        case USER:
          return next({ name: "UserPage" });
        default:
          return next({ name: "UserPage" });
      }
    }
  }

  next();
});

export default router;
