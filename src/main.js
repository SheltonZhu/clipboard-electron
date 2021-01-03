import Vue from "vue";
import App from "@/renderer/App.vue";
import router from "@/renderer/router";
import store from "@/renderer/store";
import VueElectron from "vue-electron";
import VueMoment from "vue-moment";
import Contextmenu from "vue-contextmenujs";
import moment from "moment";
import "moment/locale/zh-cn";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(VueElectron);
Vue.use(ElementUI);
Vue.use(Contextmenu);
Vue.use(VueMoment, {
  moment
});
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
