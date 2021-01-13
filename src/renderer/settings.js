import Vue from "vue";
import Settings from "@/renderer/views/Settings";
import VueElectron from "vue-electron";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(VueElectron);
Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  render: h => h(Settings)
}).$mount("#settings");
