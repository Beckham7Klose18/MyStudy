// import Vue from "vue";
// import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
import App from "./App";
import router from "./router";
import store from "./store";
// import PubSub from "pubsub-js";
import {authentication} from "./util";
import Print from "vue-print-nb";
import "./assets/css/global.css";
import VueClipboard from "vue-clipboard2";

Vue.prototype.$echarts = echarts;
Vue.use(VueClipboard);
// Vue.use(ElementUI);
Vue.use(Print);

router.beforeEach(async (to, from, next) => {
  if (to.path == "/") return next()
  if (to.name == "queryOrder") return next()
  if (to.name == "queryGoods") return next()
  if (to.name == "queryDiet") return next()
  if (to.name == "queryWeight") return next()
  if (from.path == "/" && to.path != "/home") next({path: "/home"})
  if (store.state.maijiUser.name == "未登录") return next({path: "/"})
  else {
    await store.dispatch("initMenuAction", {router})
    if (to.path == "/home") return next()
    else if (authentication(store.state.routes, to.path)) return next()
    else return PubSub.publish("permissionDenied")
  }
});

new Vue({
    el: "#app",
    render: createElement => createElement(App),
    router,
    store
});
