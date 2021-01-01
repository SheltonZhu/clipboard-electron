import Vue from "vue";
import VueRouter from "vue-router";
import Clipboard from "../views/Clipboard.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Clipboard",
    component: Clipboard
  }
];

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? "hash" : "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
