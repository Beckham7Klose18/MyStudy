/*
路由器对象模块
 */
// import Vue from "vue";
// import VueRouter from "vue-router";
import store from "../store";

const Login = () => import('../components/Login.vue')
const Home = () => import('../components/Home.vue')
const QueryOrder = () => import('../components/alone/QueryOrder.vue')
const QueryGoods = () => import('../components/alone/QueryGoods.vue')
const QueryDiet = () => import('../components/alone/QueryDiet.vue')
const QueryWeight = () => import('../components/alone/QueryWeight.vue')

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  if (this.app.$route.fullPath == location) store.state.loading.close()
  return originalPush.call(this, location).catch(err => err)
}

/*
声明使用vue-router插件
内部定义并注册了2个组件标签(router-link/router-view),
给组件对象添加了2个属性:
  1. $router: 路由器
  2. $route: 当前路由
 */
// Vue.use(VueRouter);

export default new VueRouter({
    // 注册应用中所有的路由
    routes: [
        {
            path: "/",
            name: "login",
            component: Login
        },
        {
            path: "/home",
            name: "home",
            component: Home
        },
        {
            path: "/queryOrder",
            name: "queryOrder",
            component: QueryOrder
        },
        {
            path: "/queryGoods",
            name: "queryGoods",
            component: QueryGoods
        },
        {
            path: "/queryDiet",
            name: "queryDiet",
            component: QueryDiet
        },
        {
            path: "/queryWeight",
            name: "queryWeight",
            component: QueryWeight
        }
    ]
});
