import {ORDER_STATUS_COUNT, ORDER_REFUND_TYPE_COUNT} from '../types'
import {shopingOrderStatusCountAjax, shopingOrderSendStatusCountAjax, findAllOrderRefundsTypeCountAjax} from '../../api'

const state = {
    orderStatus1Count: 0,
    orderPrintCount: 0,
    orderSendCount: 0,
    refundStatus0Count: 0,
    refundStatus1Count: 0,
    refundStatus2Count: 0,
    refundType1Status0Count: 0,
    refundType1Status2Count: 0,
    refundType2Status0Count: 0,
    refundType2Status1Count: 0,
    refundType2Status2Count: 0,
}

const mutations = {
    [ORDER_STATUS_COUNT] (state, {orderStatus1Count, orderPrintCount, orderSendCount, refundStatus0Count, refundStatus1Count, refundStatus2Count}) {
      state.orderStatus1Count = orderStatus1Count
      state.orderPrintCount = orderPrintCount
      state.orderSendCount = orderSendCount
      state.refundStatus0Count = refundStatus0Count
      state.refundStatus1Count = refundStatus1Count
      state.refundStatus2Count = refundStatus2Count
    },

    [ORDER_REFUND_TYPE_COUNT] (state, {refundType1Status0Count, refundType1Status2Count, refundType2Status0Count, refundType2Status1Count, refundType2Status2Count}) {
        state.refundType1Status0Count = refundType1Status0Count
        state.refundType1Status2Count = refundType1Status2Count
        state.refundType2Status0Count = refundType2Status0Count
        state.refundType2Status1Count = refundType2Status1Count
        state.refundType2Status2Count = refundType2Status2Count
    },
}

const actions = {
    async orderStatusCountChange({commit}) {
        const result = await shopingOrderStatusCountAjax();
        if (result.status == "SUCCESS") {
            const result1 = await shopingOrderSendStatusCountAjax();
            if (result1.status == "SUCCESS") {
                const orderStatus1 = result.data.find(order => order.status == 1)
                const refundStatus0 = result.data.find(rs => rs.refundStatus == 0)
                const refundStatus1 = result.data.find(rs => rs.refundStatus == 1)
                const refundStatus2 = result.data.find(rs => rs.refundStatus == 2)
                commit(ORDER_STATUS_COUNT, {
                    orderStatus1Count: orderStatus1? orderStatus1.count: 0,
                    orderPrintCount: orderStatus1? orderStatus1.count - result1.data: 0,
                    orderSendCount: result1.data,
                    refundStatus0Count: refundStatus0? refundStatus0.count: 0,
                    refundStatus1Count: refundStatus1? refundStatus1.count: 0,
                    refundStatus2Count: refundStatus2? refundStatus2.count: 0
                })
            }
        }
    },

    async orderRefundsTypeCountChange({commit}) {
        const result = await findAllOrderRefundsTypeCountAjax();
        if (result.status == "SUCCESS") {
            const refundType1Status0 = result.data.find(or => or.type == 1 && or.status == 0)
            const refundType1Status2 = result.data.find(or => or.type == 1 && or.status == 2)
            const refundType2Status0 = result.data.find(or => or.type == 2 && or.status == 0)
            const refundType2Status1 = result.data.find(or => or.type == 2 && or.status == 1)
            const refundType2Status2 = result.data.find(or => or.type == 2 && or.status == 2)
            commit(ORDER_REFUND_TYPE_COUNT, {
                refundType1Status0Count: refundType1Status0? refundType1Status0.count: 0,
                refundType1Status2Count: refundType1Status2? refundType1Status2.count: 0,
                refundType2Status0Count: refundType2Status0? refundType2Status0.count: 0,
                refundType2Status1Count: refundType2Status1? refundType2Status1.count: 0,
                refundType2Status2Count: refundType2Status2? refundType2Status2.count: 0,
            })
        }
    },
}

const getters = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
