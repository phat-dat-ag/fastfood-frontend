import { ROUTE_NAMES } from "../../constants/route-names";
import { USER_ROLES } from "../../constants/user-roles";
import StaffLayout from "../../layouts/StaffLayout.vue";
import CartPage from "../../modules/cart/CartPage.vue";
import ChallengePage from "../../modules/challenge/ChallengePage.vue";
import AboutUsPage from "../../modules/introduction/AboutUsPage.vue";
import StaffOrderDetailPage from "../../modules/order/StaffOrderDetailPage.vue";
import ProductsPage from "../../modules/products/ProductsPage.vue";
import ChangePasswordPage from "../../modules/profile/pages/ChangePasswordPage.vue";
import EditProfilePage from "../../modules/profile/pages/EditProfilePage.vue";
import ProfilePage from "../../modules/profile/pages/ProfilePage.vue";
import PromotionPage from "../../modules/promotion/PromotionPage.vue";

export const staffRoutes = {
  path: "/staff",
  component: StaffLayout,
  meta: { requireAuth: true, roles: [USER_ROLES.STAFF] },
  children: [
    { path: "", name: ROUTE_NAMES.STAFF.HOME, component: ProductsPage },
    {
      path: "/promotion",
      name: ROUTE_NAMES.STAFF.PROMOTION,
      component: PromotionPage,
    },
    {
      path: "/challenge",
      name: ROUTE_NAMES.STAFF.CHALLENGE,
      component: ChallengePage,
    },
    {
      path: "/about",
      name: ROUTE_NAMES.STAFF.ABOUT,
      component: AboutUsPage,
    },
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
    {
      path: "/cart",
      name: ROUTE_NAMES.STAFF.CART,
      component: CartPage,
    },
    {
      path: "order-detail",
      name: ROUTE_NAMES.STAFF.ORDER_MANAGEMENT,
      component: StaffOrderDetailPage,
    },
  ],
};
