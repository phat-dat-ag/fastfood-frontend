import { ROUTE_NAMES } from "../../constants/route-names";
import { USER_ROLES } from "../../constants/user-roles";
import AdminLayout from "../../layouts/AdminLayout.vue";
import ProductsPage from "../../modules/products/ProductsPage.vue";

export const adminRoutes = {
  path: "/admin",
  component: AdminLayout,
  meta: { requireAuth: true, roles: [USER_ROLES.ADMIN] },
  children: [
    { path: "", name: ROUTE_NAMES.ADMIN.HOME, component: ProductsPage },
  ],
};
