import { ROUTE_NAMES } from "../../constants/route-names";
import { USER_ROLES } from "../../constants/user-roles";
import StaffLayout from "../../layouts/StaffLayout.vue";
import ProductsPage from "../../modules/products/ProductsPage.vue";
import ChangePasswordPage from "../../modules/profile/pages/ChangePasswordPage.vue";
import EditProfilePage from "../../modules/profile/pages/EditProfilePage.vue";
import ProfilePage from "../../modules/profile/pages/ProfilePage.vue";

export const staffRoutes = {
  path: "/staff",
  component: StaffLayout,
  meta: { requireAuth: true, roles: [USER_ROLES.STAFF] },
  children: [
    { path: "", name: ROUTE_NAMES.STAFF.HOME, component: ProductsPage },
    {
      path: "profile",
      name: ROUTE_NAMES.STAFF.PROFILE,
      component: ProfilePage,
    },
    {
      path: "edit-profile",
      name: ROUTE_NAMES.STAFF.EDIT_PROFILE,
      component: EditProfilePage,
    },
    {
      path: "change-password",
      name: ROUTE_NAMES.STAFF.CHANGE_PASSWORD,
      component: ChangePasswordPage,
    },
  ],
};
