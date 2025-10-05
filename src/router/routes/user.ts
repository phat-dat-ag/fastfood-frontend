import { ROUTE_NAMES } from "../../constants/route-names";
import { USER_ROLES } from "../../constants/user-roles";
import UserLayout from "../../layouts/UserLayout.vue";
import ProductsPage from "../../modules/products/ProductsPage.vue";
import ChangePasswordPage from "../../modules/profile/pages/ChangePasswordPage.vue";
import EditProfilePage from "../../modules/profile/pages/EditProfilePage.vue";
import ProfilePage from "../../modules/profile/pages/ProfilePage.vue";

export const userRoutes = {
  path: "/user",
  component: UserLayout,
  meta: { requireAuth: true, roles: [USER_ROLES.USER] },
  children: [
    { path: "", name: ROUTE_NAMES.USER.HOME, component: ProductsPage },
    {
      path: "profile",
      name: ROUTE_NAMES.USER.PROFILE,
      component: ProfilePage,
    },
    {
      path: "edit-profile",
      name: ROUTE_NAMES.USER.EDIT_PROFILE,
      component: EditProfilePage,
    },
    {
      path: "change-password",
      name: ROUTE_NAMES.USER.CHANGE_PASSWORD,
      component: ChangePasswordPage,
    },
  ],
};
