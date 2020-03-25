import {RELEVANT_GOODS_SHOW_CHANGE} from '../types'
import {RELEVANTGOODSTABLECHANGE} from '../types'

const state = {
    relevantGoodsShow: false,
    relevantGoodsTable: [],
}

const mutations = {
    [RELEVANT_GOODS_SHOW_CHANGE] (state, {isShow}) {
      state.relevantGoodsShow = isShow
    },

    [RELEVANTGOODSTABLECHANGE] (state, {goodsTable}) {
      state.relevantGoodsTable = goodsTable
    },
}

const actions = {
    relevantGoodsShowChange ({commit}, isShow) {
        commit(RELEVANT_GOODS_SHOW_CHANGE, {isShow})
    },

    relevantGoodsTableChange ({commit}, goodsTable) {
        commit(RELEVANTGOODSTABLECHANGE, {goodsTable})
    },
}

const getters = {
  checkoutStatus (state) {
    return state.checkoutStatus
  }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
