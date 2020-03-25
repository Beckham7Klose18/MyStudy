import {
    INCREASE_STOCK_VOLUME_COUNT,
    COMMENT_MSG_SHOW_CHANGE,
    COMMENT_MGS_CHANGE
} from '../types'
import {goodsCommentShieldCountAjax, IncreasestockVolumeCountAjax} from '../../api'

const state = {
    increasestockVolumeCount: '',
    commentMsgShow: false,
    commentMsg: {
      user: {}
    },
}

const mutations = {

    [INCREASE_STOCK_VOLUME_COUNT] (state, {allCount}) {
      state.increasestockVolumeCount = allCount
    },

    [COMMENT_MSG_SHOW_CHANGE] (state, {isShow}) {
        state.commentMsgShow = isShow
    },

    [COMMENT_MGS_CHANGE] (state, {msg}) {
        state.commentMsg = msg
    },
}

const actions = {
    async IncreasestockVolumeCountChange({commit}) {
        const result = await IncreasestockVolumeCountAjax(10);
        if (result.status == "SUCCESS") {
            commit(INCREASE_STOCK_VOLUME_COUNT, {allCount: result.data})
        }
    },

    commentMsgShowChange({commit}, isShow) {
        commit(COMMENT_MSG_SHOW_CHANGE, {isShow})
    },

    commentMsgChange ({commit}, msg) {
        commit(COMMENT_MGS_CHANGE, {msg})
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
