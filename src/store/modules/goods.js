import {
    GC_SHIELD_COUNT,
    INCREASE_STOCK_VOLUME_COUNT,
    COMMENT_GOODS_SHOW_CHANGE,
    COMMENT_GOODS_CHANGE
} from '../types'
import {goodsCommentShieldCountAjax, IncreasestockVolumeCountAjax} from '../../api'

const state = {
    gcShieldCount: '',
    increasestockVolumeCount: '',
    commentGoodsShow: false,
    commentGoods: {},
}

const mutations = {
    [GC_SHIELD_COUNT] (state, {allCount}) {
      state.gcShieldCount = allCount
    },

    [INCREASE_STOCK_VOLUME_COUNT] (state, {allCount}) {
      state.increasestockVolumeCount = allCount
    },

    [COMMENT_GOODS_SHOW_CHANGE] (state, {isShow}) {
        state.commentGoodsShow = isShow
    },

    [COMMENT_GOODS_CHANGE] (state, {goods}) {
        state.commentGoods = goods
    },
}

const actions = {
    async gcShieldCountChange({commit}) {
        const result = await goodsCommentShieldCountAjax();
        if (result.status == "SUCCESS") {
            commit(GC_SHIELD_COUNT, {allCount: result.data})
        }
    },

    async IncreasestockVolumeCountChange({commit}) {
        const result = await IncreasestockVolumeCountAjax(10);
        if (result.status == "SUCCESS") {
            commit(INCREASE_STOCK_VOLUME_COUNT, {allCount: result.data})
        }
    },

    commentGoodsShowChange({commit}, isShow) {
        commit(COMMENT_GOODS_SHOW_CHANGE, {isShow})
    },

    commentGoodsChange({commit}, goods) {
        commit(COMMENT_GOODS_CHANGE, {goods})
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
