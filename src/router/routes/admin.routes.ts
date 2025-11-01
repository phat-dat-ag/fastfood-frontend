import { ROUTE_NAMES } from "../../constants/route-names";
import { USER_ROLES } from "../../constants/user-roles";
import AdminLayout from "../../layouts/AdminLayout.vue";
import CategoryManagementPage from "../../modules/category/CategoryManagementPage.vue";
import CategoryPage from "../../modules/products/CategoryPage.vue";
import ProductManagementPage from "../../modules/products/ProductManagementPage.vue";
import CustomerManagementPage from "../../modules/account/CustomerManagementPage.vue";
import PromotionByCategoryPage from "../../modules/promotion/PromotionByCategoryPage.vue";
import PromotionByProductPage from "../../modules/promotion/PromotionByProductPage.vue";
import AddPromotionByCategoryPage from "../../modules/promotion/AddPromotionByCategoryPage.vue";
import AddPromotionByProductPage from "../../modules/promotion/AddPromotionByProductPage.vue";
import ProductDetail from "../../modules/products/ProductDetail.vue";
import PromotionOrderPage from "../../modules/promotion/PromotionOrderPage.vue";
import AddPromotionOrderPage from "../../modules/promotion/AddPromotionOrderPage.vue";
import StaffManagementPage from "../../modules/account/StaffManagementPage.vue";
import ProductPage from "../../modules/products/ProductPage.vue";

export const adminRoutes = {
  path: "/admin",
  component: AdminLayout,
  meta: { requireAuth: true, roles: [USER_ROLES.ADMIN] },
  children: [
    {
      path: "",
      name: ROUTE_NAMES.ADMIN.HOME,
      component: CategoryPage,
      children: [
        {
          path: "category/:slug",
          name: ROUTE_NAMES.ADMIN.CATEGORY_DETAIL,
          component: ProductPage,
        },
      ],
    },
    {
      path: "product-detail/:slug",
      name: ROUTE_NAMES.ADMIN.PRODUCT_DETAIL,
      component: ProductDetail,
    },
    {
      path: "manage-customer",
      name: ROUTE_NAMES.ADMIN.CUSTOMER_MANAGEMENT,
      component: CustomerManagementPage,
    },
    {
      path: "manage-staff",
      name: ROUTE_NAMES.ADMIN.STAFF_MANAGEMENT,
      component: StaffManagementPage,
    },
    {
      path: "manage-category",
      name: ROUTE_NAMES.ADMIN.CATEGORY_MANAGEMENT,
      component: CategoryManagementPage,
    },
    {
      path: "manage-product",
      name: ROUTE_NAMES.ADMIN.PRODUCT_MANAGEMENT,
      component: ProductManagementPage,
    },
    {
      path: "manage-promotion-by-category",
      name: ROUTE_NAMES.ADMIN.PROMOTION_CATEGORY_MANAGEMENT,
      component: PromotionByCategoryPage,
    },
    {
      path: "add-category-promotion",
      name: ROUTE_NAMES.ADMIN.PROMOTION_CATEGORY_ADD,
      component: AddPromotionByCategoryPage,
    },
    {
      path: "manage-promotion-by-product",
      name: ROUTE_NAMES.ADMIN.PROMOTION_PRODUCT_MANAGEMENT,
      component: PromotionByProductPage,
    },
    {
      path: "add-product-promotion",
      name: ROUTE_NAMES.ADMIN.PROMOTION_PRODUCT_ADD,
      component: AddPromotionByProductPage,
    },
    {
      path: "manage-promotion-order",
      name: ROUTE_NAMES.ADMIN.PROMOTION_ORDER_MANAGEMENT,
      component: PromotionOrderPage,
    },
    {
      path: "add-order-promotion",
      name: ROUTE_NAMES.ADMIN.PROMOTION_ORDER_ADD,
      component: AddPromotionOrderPage,
    },
  ],
};
