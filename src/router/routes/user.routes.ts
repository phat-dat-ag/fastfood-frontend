import { ROUTE_NAMES } from "../../constants/route-names";
import { USER_ROLES } from "../../constants/user-roles";
import UserLayout from "../../layouts/UserLayout.vue";
import CartPage from "../../modules/cart/CartPage.vue";
import ChallengePage from "../../modules/challenge/ChallengePage.vue";
import AboutUsPage from "../../modules/introduction/AboutUsPage.vue";
import OrderHistoryPage from "../../modules/order/OrderHistoryPage.vue";
import OrderTrackingPage from "../../modules/order/OrderTrackingPage.vue";
import ProductDetail from "../../modules/products/ProductDetail.vue";
import CategoryPage from "../../modules/products/CategoryPage.vue";
import ChangePasswordPage from "../../modules/profile/pages/ChangePasswordPage.vue";
import EditProfilePage from "../../modules/profile/pages/EditProfilePage.vue";
import ProfilePage from "../../modules/profile/pages/ProfilePage.vue";
import PromotionPage from "../../modules/promotion/PromotionPage.vue";
import AllProductReviewsPage from "../../modules/review/AllProductReviewsPage.vue";
import ProductReviewPage from "../../modules/review/ProductReviewPage.vue";
import ProductPage from "../../modules/products/ProductPage.vue";
import OrderHistoryDetail from "../../modules/order/OrderHistoryDetail.vue";
import OrderTrackingDetail from "../../modules/order/OrderTrackingDetail.vue";
import QuizzPage from "../../modules/challenge/QuizzPage.vue";
import ChallengeHistoryPage from "../../modules/challenge/ChallengeHistoryPage.vue";
import ChallengeHistoryDetailPage from "../../modules/challenge/ChallengeHistoryDetailPage.vue";

export const userRoutes = {
  path: "/user",
  component: UserLayout,
  meta: { requireAuth: true, roles: [USER_ROLES.USER] },
  children: [
    {
      path: "",
      name: ROUTE_NAMES.USER.HOME,
      component: CategoryPage,
      children: [
        {
          path: "category/:slug",
          name: ROUTE_NAMES.USER.CATEGORY_DETAIL,
          component: ProductPage,
        },
      ],
    },
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
      path: "challenge/:slug",
      name: ROUTE_NAMES.USER.QUIZZ,
      component: QuizzPage,
    },
    {
      path: "challenge-history",
      name: ROUTE_NAMES.USER.CHALLENGE_HISTORY,
      component: ChallengeHistoryPage,
    },
    {
      path: "challenge-history/:quizId",
      name: ROUTE_NAMES.USER.CHALLENGE_HISTORY_DETAIL,
      component: ChallengeHistoryDetailPage,
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
    {
      path: "order-tracking",
      name: ROUTE_NAMES.USER.ORDER_TRACKING,
      component: OrderTrackingPage,
    },
    {
      path: "order-tracking/:orderId",
      name: ROUTE_NAMES.USER.ORDER_TRACKING_DETAIL,
      component: OrderTrackingDetail,
    },
    {
      path: "order-history",
      name: ROUTE_NAMES.USER.ORDER_HISTORY,
      component: OrderHistoryPage,
    },
    {
      path: "order-history/:orderId",
      name: ROUTE_NAMES.USER.ORDER_HISTORY_DETAIL,
      component: OrderHistoryDetail,
    },
    {
      path: "review-product/:orderId",
      name: ROUTE_NAMES.USER.PRODUCT_REVIEW,
      component: ProductReviewPage,
    },
    {
      path: "product/:productId/all-review",
      name: ROUTE_NAMES.USER.ALL_PRODUCT_REVIEWS,
      component: AllProductReviewsPage,
    },
  ],
};
