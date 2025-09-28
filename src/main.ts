import { createApp } from "vue";
import "./style.css";
import "./tailwind.css";
import App from "./App.vue";
import router from "./router";
// ElementPlus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// Pinia
import { createPinia } from "pinia";
import { initAuth } from "./utils/initAuth.utils";
const pinia = createPinia();

const app = createApp(App).use(pinia).use(ElementPlus);

initAuth(router).then(() => {
  app.use(router);
  app.mount("#app");
});
