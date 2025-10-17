import { ROUTE_NAMES } from "../../constants/route-names";
import { USER_ROLES } from "../../constants/user-roles";
import UserLayout from "../../layouts/UserLayout.vue";
import CartPage from "../../modules/cart/CartPage.vue";
import ChallengePage from "../../modules/challenge/ChallengePage.vue";
import AboutUsPage from "../../modules/introduction/AboutUsPage.vue";
import ProductDetail from "../../modules/products/ProductDetail.vue";
import ProductsPage from "../../modules/products/ProductsPage.vue";
import ChangePasswordPage from "../../modules/profile/pages/ChangePasswordPage.vue";
import EditProfilePage from "../../modules/profile/pages/EditProfilePage.vue";
import ProfilePage from "../../modules/profile/pages/ProfilePage.vue";
import PromotionPage from "../../modules/promotion/PromotionPage.vue";

export const userRoutes = {
  path: "/user",
  component: UserLayout,
  meta: { requireAuth: true, roles: [USER_ROLES.USER] },
  children: [
    { path: "", name: ROUTE_NAMES.USER.HOME, component: ProductsPage },
    {
      path: "product-detail/:slug",
      name: ROUTE_NAMES.USER.PRODUCT_DETAIL,
      component: ProductDetail,
    },
    {
      path: "promotion",
      name: ROUTE_NAMES.USER.PROMOTION,
      component: PromotionPage,
    },
    {
      path: "challenge",
      name: ROUTE_NAMES.USER.CHALLENGE,
      component: ChallengePage,
    },
    {
      path: "about",
      name: ROUTE_NAMES.USER.ABOUT,
      component: AboutUsPage,
    },
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
    {
      path: "cart",
      name: ROUTE_NAMES.USER.CART,
      component: CartPage,
    },
  ],
};
