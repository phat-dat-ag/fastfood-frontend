import { ROUTE_NAMES } from "../../constants/route-names";
import { USER_ROLES } from "../../constants/user-roles";
import AdminLayout from "../../layouts/AdminLayout.vue";
import CategoriesPage from "../../modules/category/CategoriesPage.vue";
import ProductsPage from "../../modules/products/ProductsPage.vue";
import ProductManagementPage from "../../modules/products/ProductManagementPage.vue";

export const adminRoutes = {
  path: "/admin",
  component: AdminLayout,
  meta: { requireAuth: true, roles: [USER_ROLES.ADMIN] },
  children: [
    { path: "", name: ROUTE_NAMES.ADMIN.HOME, component: ProductsPage },
    {
      path: "/manage-category",
      name: ROUTE_NAMES.ADMIN.CATEGORY_MANAGEMENT,
      component: CategoriesPage,
    },
    {
      path: "/manage-product",
      name: ROUTE_NAMES.ADMIN.PRODUCT_MANAGEMENT,
      component: ProductManagementPage,
    },
  ],
};
