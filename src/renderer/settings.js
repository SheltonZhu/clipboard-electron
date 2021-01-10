import Vue from "vue";
import Settings from "@/renderer/views/Settings";
import VueElectron from "vue-electron";
import "moment/locale/zh-cn";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import store from "@/renderer/store";
Vue.use(VueElectron);
Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(Settings)
}).$mount("#settings");
