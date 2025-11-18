import { ROUTE_NAMES } from "../../constants/route-names";
import { USER_ROLES } from "../../constants/user-roles";
import AdminLayout from "../../layouts/AdminLayout.vue";
import CategoryManagementPage from "../../modules/category/CategoryManagementPage.vue";
import ProductManagementPage from "../../modules/products/ProductManagementPage.vue";
import CustomerManagementPage from "../../modules/account/CustomerManagementPage.vue";
import PromotionByCategoryPage from "../../modules/promotion/PromotionByCategoryPage.vue";
import PromotionByProductPage from "../../modules/promotion/PromotionByProductPage.vue";
import AddPromotionByCategoryPage from "../../modules/promotion/AddPromotionByCategoryPage.vue";
import AddPromotionByProductPage from "../../modules/promotion/AddPromotionByProductPage.vue";
import PromotionOrderPage from "../../modules/promotion/PromotionOrderPage.vue";
import AddPromotionOrderPage from "../../modules/promotion/AddPromotionOrderPage.vue";
import StaffManagementPage from "../../modules/account/StaffManagementPage.vue";
import TopicManagementPage from "../../modules/topic/TopicManagementPage.vue";
import TopicDifficultyManagementPage from "../../modules/topic-difficulty/TopicDifficultyManagementPage.vue";
import AwardManagementPage from "../../modules/award/AwardManagementPage.vue";
import QuestionManagementPage from "../../modules/question/QuestionManagementPage.vue";
import ShowQuestionsPage from "../../modules/question/components/ShowQuestionsPage.vue";
import AddQuestionsPage from "../../modules/question/components/AddQuestionsPage.vue";
import AdminOrderManagementPage from "../../modules/order/AdminOrderManagementPage.vue";
import AdminDashboard from "../../modules/dashboard/AdminDashboard.vue";
import ReviewManagementPage from "../../modules/review/ReviewManagementPage.vue";
import AboutUseImageManagement from "../../modules/image/AboutUseImageManagement.vue";
import QuizFeedbackManagementPage from "../../modules/quiz-feedback/QuizFeedbackManagementPage.vue";

export const adminRoutes = {
  path: "/admin",
  component: AdminLayout,
  meta: { requireAuth: true, roles: [USER_ROLES.ADMIN] },
  children: [
    {
      path: "",
      name: ROUTE_NAMES.ADMIN.DASHBOARD,
      component: AdminDashboard,
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
      path: "category/:categorySlug/manage-product",
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
    {
      path: "manage-orders",
      name: ROUTE_NAMES.ADMIN.ORDER_MANAGEMENT,
      component: AdminOrderManagementPage,
    },
    {
      path: "management-review",
      name: ROUTE_NAMES.ADMIN.REVIEW_MANAGEMENT,
      component: ReviewManagementPage,
    },
    {
      path: "manage-topic",
      name: ROUTE_NAMES.ADMIN.TOPIC_MANAGEMENT,
      component: TopicManagementPage,
    },
    {
      path: "manage-topic-difficulty/:slug",
      name: ROUTE_NAMES.ADMIN.TOPIC_DIFFICULTY_MANAGEMENT,
      component: TopicDifficultyManagementPage,
    },
    {
      path: "manage-award/:slug",
      name: ROUTE_NAMES.ADMIN.AWARD_MANAGEMENT,
      component: AwardManagementPage,
    },
    {
      path: "manage-question/:slug",
      name: ROUTE_NAMES.ADMIN.QUESTION_MANAGEMENT,
      component: QuestionManagementPage,
      redirect: { name: ROUTE_NAMES.ADMIN.SHOW_QUESTION_PAGE },
      children: [
        {
          path: "",
          name: ROUTE_NAMES.ADMIN.SHOW_QUESTION_PAGE,
          component: ShowQuestionsPage,
        },
        {
          path: "add",
          name: ROUTE_NAMES.ADMIN.ADD_QUESTION_PAGE,
          component: AddQuestionsPage,
        },
      ],
    },
    {
      path: "manage-quiz-feedback",
      name: ROUTE_NAMES.ADMIN.QUIZ_FEEDBACK_MANAGEMENT,
      component: QuizFeedbackManagementPage,
    },
    {
      path: "manage-image",
      name: ROUTE_NAMES.ADMIN.ABOUT_US_IMAGE_MANAGEMENT,
      component: AboutUseImageManagement,
    },
  ],
};
