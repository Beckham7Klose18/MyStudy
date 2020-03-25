// import Vue from "vue";
// import Vuex from "vuex";
// import PubSub from "pubsub-js";
import community from "./modules/community"
import goods from "./modules/goods"
import order from "./modules/order"
import food from "./modules/food"
import {Loading} from "element-ui"
import {
    FIND_ALL_LABEL_BY_SOURCE,
    ADDLABELSHOW,
    UPDATE_META_DATA,
    LOGIN,
    INIT_MENU,
    LOGOUT,
    LOADING,
    MAIJITOKEN
} from "./types"
import {
  findAllLabelBySourceAjax,
  getMaijiAppOfficialTokenAjax,
  initMenu} from "../api"
import {routesFormatter} from "../util"

Vue.use(Vuex);

const state = {
    maijiUser: {
        uuId:
            window.localStorage.getItem("maijiUser") == null
                ? ""
                : JSON.parse(window.localStorage.getItem("maijiUser")).uuId,
        name:
            window.localStorage.getItem("maijiUser") == null
                ? "未登录"
                : JSON.parse(window.localStorage.getItem("maijiUser")).name,
        roles:
            window.localStorage.getItem("maijiUser") == null
                ? ""
                : JSON.parse(window.localStorage.getItem("maijiUser")).roles,
      onlyRead:
            window.localStorage.getItem("maijiUser") == null
                ? true
                : JSON.parse(window.localStorage.getItem("maijiUser")).onlyRead
    },
    routes: [],
    addLabelIsShow: false,
    allLabels: null,
    addLabelModel: {
        name: "",
        source: ""
    },
    labelOptions: [],
    loadingOptions: {
        lock: true,
        text: "数据加载中 ··· ···",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
    },
    loading: {},
    pickerOptions: {
        shortcuts: [
            {
                text: "最近一周",
                onClick(picker) {
                    const start = new Date();
                    start.setDate(start.getDate() - 6);
                    picker.$emit("pick", [start, new Date()]);
                }
            },
            {
                text: "最近两周",
                onClick(picker) {
                    const start = new Date();
                    start.setDate(start.getDate() - 13);
                    picker.$emit("pick", [start, new Date()]);
                }
            },
            {
                text: "最近三周",
                onClick(picker) {
                    const start = new Date();
                    start.setDate(start.getDate() - 20);
                    picker.$emit("pick", [start, new Date()]);
                }
            },
            {
                text: "最近一月",
                onClick(picker) {
                    const start = new Date();
                    start.setMonth(start.getMonth() - 1);
                    picker.$emit("pick", [start, new Date()]);
                }
            },
            {
                text: "最近两月",
                onClick(picker) {
                    const start = new Date();
                    start.setMonth(start.getMonth() - 2);
                    picker.$emit("pick", [start, new Date()]);
                }
            },
            {
                text: "最近三月",
                onClick(picker) {
                    const start = new Date();
                    start.setMonth(start.getMonth() - 2);
                    picker.$emit("pick", [start, new Date()]);
                }
            },
            {
                text: "最近半年",
                onClick(picker) {
                    const start = new Date();
                    start.setMonth(start.getMonth() - 6);
                    picker.$emit("pick", [start, new Date()]);
                }
            },
            {
                text: "最近一年",
                onClick(picker) {
                    const start = new Date();
                    start.setFullYear(start.getFullYear() - 1);
                    picker.$emit("pick", [start, new Date()]);
                }
            }
        ]
    },
    metaData: {
        page: 1,
        size: 10,
        total: 0
    },
    searchData: {text: ""},
    maijiToken: ''
};

const mutations = {
    [LOGIN](state, {user}) {
        state.maijiUser = user;
        window.localStorage.setItem("maijiUser", JSON.stringify(user));
    },

    [LOGOUT](state) {
        state.routes = [];
        window.localStorage.removeItem("maijiUser");
    },

    [INIT_MENU](state, {fmtRoutes}) {
        state.routes = fmtRoutes;
    },

    [ADDLABELSHOW](state, {isShow}) {
        state.addLabelIsShow = isShow;
    },

    [FIND_ALL_LABEL_BY_SOURCE](state, {allLabels}) {
        state.allLabels = allLabels;
        state.labelOptions = new Set(allLabels.map(label => label.source));
    },

    [UPDATE_META_DATA](state, {metaData}) {
        state.metaData = metaData;
    },

    [LOADING](state) {
        state.loading = Loading.service(state.loadingOptions)
    },

    [MAIJITOKEN](state, {maijiToken}) {
        state.maijiToken = maijiToken
    },

    updateSearch(state, act) {
        state.searchData.text = act;
    }
};

const actions = {
    async getMaijiTokenVuex ({commit}, user) {
      const result = await getMaijiAppOfficialTokenAjax()
      if (result.status == "SUCCESS")
        commit(MAIJITOKEN, {maijiToken: result.data})
    },

    loginAction({commit}, user) {
        commit(LOGIN, {user});
    },

    logoutAction({commit}) {
        commit(LOGOUT);
    },

    loadingOpen({commit}) {
        commit(LOADING);
    },

    async initMenuAction({commit}, {router}) {
      if (state.routes.length > 0) return
      const result = await initMenu()
      if (result.status == "SUCCESS") {
          const routes = result.data
              .map(r => {
                  r.childrens = r.childrens.sort((rc1, rc2) => rc1.uuId - rc2.uuId)
                  return r
              })
              .sort((r1, r2) => r1.uuId - r2.uuId)
          var fmtRoutes = routesFormatter(routes)
          router.addRoutes(fmtRoutes)
          commit(INIT_MENU, {fmtRoutes})
      }
    },

    // 弹出添加标签对话框
    addLabelShow({commit}, isShow) {
        commit(ADDLABELSHOW, {isShow});
    },

    // 根据标签来源获取所有相关标签
    async findAllLabelBySourceVuex({commit}, source, listShow) {
        const result = await findAllLabelBySourceAjax(source, listShow);
        if (result.status == "SUCCESS")
            commit(FIND_ALL_LABEL_BY_SOURCE, {allLabels: result.data});
    },

    // 初始化分页信息
    updateMetaData({commit}, {metaData, init}) {
        if (metaData) {
          if (! init) PubSub.publish("updateMetaData");
          commit(UPDATE_META_DATA, {metaData});
        }
    }
};

const getters = {
    addLabelSuccess(state) {
        return state.addLabelSuccess;
    }
};

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    modules: {
        community,
        goods,
        order,
        food
    }
});
