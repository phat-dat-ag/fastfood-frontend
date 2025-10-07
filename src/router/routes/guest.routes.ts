import { ROUTE_NAMES } from "../../constants/route-names";
import GuestLayout from "../../layouts/GuestLayout.vue";
import ForgetPasswordPage from "../../modules/auth/pages/ForgetPasswordPage.vue";
import SignInPage from "../../modules/auth/pages/SignInPage.vue";
import SignUpPage from "../../modules/auth/pages/SignUpPage.vue";
import ProductsPage from "../../modules/products/ProductsPage.vue";

export const guestRoutes = {
  path: "/",
  component: GuestLayout,
  children: [
    { path: "", name: ROUTE_NAMES.GUEST.HOME, component: ProductsPage },
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
