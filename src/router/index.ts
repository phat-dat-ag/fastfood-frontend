import { createRouter, createWebHistory } from "vue-router";
import { setupAuthGuard } from "./guards/auth.guard";
import { guestRoutes } from "./routes/guest.routes";
import { userRoutes } from "./routes/user.routes";
import { staffRoutes } from "./routes/staff.routes";
import { adminRoutes } from "./routes/admin.routes";

const routes = [guestRoutes, userRoutes, staffRoutes, adminRoutes];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

setupAuthGuard(router);

export default router;
