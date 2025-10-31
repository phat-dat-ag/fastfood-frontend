import { ROUTE_NAMES } from "../../constants/route-names";
import { USER_ROLES } from "../../constants/user-roles";
import StaffLayout from "../../layouts/StaffLayout.vue";
import CartPage from "../../modules/cart/CartPage.vue";
import ChallengePage from "../../modules/challenge/ChallengePage.vue";
import AboutUsPage from "../../modules/introduction/AboutUsPage.vue";
import OrderHistoryPage from "../../modules/order/OrderHistoryPage.vue";
import OrderTrackingPage from "../../modules/order/OrderTrackingPage.vue";
import StaffOrderManagementPage from "../../modules/order/StaffOrderManagementPage.vue";
import ProductDetail from "../../modules/products/ProductDetail.vue";
import ProductsPage from "../../modules/products/ProductsPage.vue";
import ChangePasswordPage from "../../modules/profile/pages/ChangePasswordPage.vue";
import EditProfilePage from "../../modules/profile/pages/EditProfilePage.vue";
import ProfilePage from "../../modules/profile/pages/ProfilePage.vue";
import PromotionPage from "../../modules/promotion/PromotionPage.vue";
import AllProductReviewsPage from "../../modules/review/AllProductReviewsPage.vue";
import ProductReviewPage from "../../modules/review/ProductReviewPage.vue";

export const staffRoutes = {
  path: "/staff",
  component: StaffLayout,
  meta: { requireAuth: true, roles: [USER_ROLES.STAFF] },
  children: [
    { path: "", name: ROUTE_NAMES.STAFF.HOME, component: ProductsPage },
    {
      path: "product-detail/:slug",
      name: ROUTE_NAMES.STAFF.PRODUCT_DETAIL,
      component: ProductDetail,
    },
    {
      path: "promotion",
      name: ROUTE_NAMES.STAFF.PROMOTION,
      component: PromotionPage,
    },
    {
      path: "challenge",
      name: ROUTE_NAMES.STAFF.CHALLENGE,
      component: ChallengePage,
    },
    {
      path: "about",
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
      path: "cart",
      name: ROUTE_NAMES.STAFF.CART,
      component: CartPage,
    },
    {
      path: "order-tracking",
      name: ROUTE_NAMES.STAFF.ORDER_TRACKING,
      component: OrderTrackingPage,
    },
    {
      path: "order-history",
      name: ROUTE_NAMES.STAFF.ORDER_HISTORY,
      component: OrderHistoryPage,
    },
    {
      path: "review-product/:orderId",
      name: ROUTE_NAMES.STAFF.PRODUCT_REVIEW,
      component: ProductReviewPage,
    },
    {
      path: "product/:productId/all-review",
      name: ROUTE_NAMES.STAFF.ALL_PRODUCT_REVIEWS,
      component: AllProductReviewsPage,
    },
    {
      path: "order-management",
      name: ROUTE_NAMES.STAFF.ORDER_MANAGEMENT,
      component: StaffOrderManagementPage,
    },
  ],
};
