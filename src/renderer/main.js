import Vue from "vue";
import Home from "@/renderer/views/Home";
import store from "@/renderer/store";
import VueElectron from "vue-electron";
import Contextmenu from "vue-contextmenujs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(VueElectron);
Vue.use(ElementUI);
Vue.use(Contextmenu);

dayjs.extend(relativeTime);
dayjs.locale("zh-cn");
Object.defineProperties(Vue.prototype, {
  $date: {
    get() {
      return dayjs;
    }
  }
});

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(Home)
}).$mount("#home");
