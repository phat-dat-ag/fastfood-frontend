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

const app = createApp(App).use(router).use(ElementPlus).use(pinia);

initAuth(router).then(() => {
  app.mount("#app");
});
