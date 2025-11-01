import { ROUTE_NAMES } from "../../constants/route-names";
import GuestLayout from "../../layouts/GuestLayout.vue";
import ForgetPasswordPage from "../../modules/auth/pages/ForgetPasswordPage.vue";
import SignInPage from "../../modules/auth/pages/SignInPage.vue";
import SignUpPage from "../../modules/auth/pages/SignUpPage.vue";
import ChallengeIntroductionPage from "../../modules/challenge/ChallengeIntroductionPage.vue";
import AboutUsPage from "../../modules/introduction/AboutUsPage.vue";
import ProductDetail from "../../modules/products/ProductDetail.vue";
import CategoryPage from "../../modules/products/CategoryPage.vue";
import PromotionPage from "../../modules/promotion/PromotionPage.vue";
import ProductPage from "../../modules/products/ProductPage.vue";
import AllProductReviewsPage from "../../modules/review/AllProductReviewsPage.vue";

export const guestRoutes = {
  path: "/",
  component: GuestLayout,
  children: [
    {
      path: "",
      name: ROUTE_NAMES.GUEST.HOME,
      component: CategoryPage,
      children: [
        {
          path: "category/:slug",
          name: ROUTE_NAMES.GUEST.CATEGORY_DETAIL,
          component: ProductPage,
        },
      ],
    },
    {
      path: "product-detail/:slug",
      name: ROUTE_NAMES.GUEST.PRODUCT_DETAIL,
      component: ProductDetail,
    },
    {
      path: "product/:productId/all-review",
      name: ROUTE_NAMES.GUEST.ALL_PRODUCT_REVIEWS,
      component: AllProductReviewsPage,
    },
    {
      path: "promotion",
      name: ROUTE_NAMES.GUEST.PROMOTION,
      component: PromotionPage,
    },
    {
      path: "challenge",
      name: ROUTE_NAMES.GUEST.CHALLENGE,
      component: ChallengeIntroductionPage,
    },
    {
      path: "about",
      name: ROUTE_NAMES.GUEST.ABOUT,
      component: AboutUsPage,
    },
    {
      path: "sign-up",
      name: ROUTE_NAMES.AUTH.SIGN_UP,
      component: SignUpPage,
    },
    {
      path: "sign-in",
      name: ROUTE_NAMES.AUTH.SIGN_IN,
      component: SignInPage,
    },
    {
      path: "forget-password",
      name: ROUTE_NAMES.AUTH.FORGET_PASSWORD,
      component: ForgetPasswordPage,
    },
  ],
};
