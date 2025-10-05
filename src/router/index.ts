import { createRouter, createWebHistory } from "vue-router";
import { setupAuthGuard } from "./guards/auth";
import { guestRoutes } from "./routes/guest";
import { userRoutes } from "./routes/user";
import { staffRoutes } from "./routes/staff";
import { adminRoutes } from "./routes/admin";

const routes = [guestRoutes, userRoutes, staffRoutes, adminRoutes];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

setupAuthGuard(router);

export default router;
