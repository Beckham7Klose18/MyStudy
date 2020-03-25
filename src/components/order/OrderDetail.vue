<template>
  <el-dialog title="订单详情" :visible.sync="orderDetailShow" width="60%">
    <el-row style="margin-bottom: 10px;">
      <el-col :span="8" :offset="1" style="line-height: 32px;"><span style="color: gray;">订单编号：</span>{{shopingOrders[orderIndex].orderNo}}</el-col>
      <el-col :span="5"><el-button type="success" plain size="small" style="width: 100%;"
         @click="nextOrderDetail(false)">上一单 <i class="el-icon-caret-left"/></el-button></el-col>
      <el-col :span="2" style="text-align: center;"><el-tag>{{orderIndex + 1}} / {{shopingOrders.length}}</el-tag></el-col>
      <el-col :span="5"><el-button type="success" plain size="small" style="width: 100%;"
          @click="nextOrderDetail(true)"><i class="el-icon-caret-right"/> 下一单</el-button></el-col>
    </el-row>
    <el-table stripe max-height="425" v-loading="shopingCartsLoading"
              :data="shopingCarts" :span-method="objectSpanMethod"
              :header-cell-style="{backgroundColor: '#DCDFE6', fontSize: '12px'}"
              :cell-style="{paddingTop: '7px', paddingBottom: 0}">
      <el-table-column label="商品" fixed width="65">
        <template slot-scope="scope">
          <img :src="scope.row.goods.mainImage.url" width="45" height="45"/>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" fixed width="90"
                       show-overflow-tooltip
                       :formatter="(row) => row.goods.name"/>
      <el-table-column label="数量" width="50" prop="purchaseQuantity"/>
      <el-table-column label="商品总价" width="70" :formatter="(row) => row.presentPayable + ' 元'"/>
      <el-table-column label="物流总重" width="70" :formatter="(row) => row.weightTotal + ' 克'"/>
      <el-table-column label="快递" width="60" :formatter="() => shopingOrder.delivery"/>
      <el-table-column label="快递费" width="70" :formatter="() => shopingOrder.deliveryFee + ' 元'"/>
      <el-table-column label="减肥基金" width="70" :formatter="() => '-' + shopingOrder.fund + ' 元'"/>
      <el-table-column label="优惠券" width="70"
                       :formatter="() => '-' + shopingOrder.coupon + ' 元'" />
      <el-table-column label="积分减免" width="70"
                       :formatter="() => '-' + shopingOrder.integralMoney + ' 元'" />
      <el-table-column label="订单金额" width="90" :formatter="() => shopingOrder.amount + ' 元'"/>
      <el-table-column label="支付方式" min-width="80"
                       :formatter="() => payTypeFormatter(shopingOrder.payType)" />
    </el-table>
    <el-steps align-center style="margin-top: 20px;">
      <el-step title="创建订单" icon="el-icon-date"
        :description="dateFormatter(shopingOrder && shopingOrder.createDate)"/>
      <el-step title="支付时间" icon="el-icon-date"
        :description="dateFormatter(shopingOrder && shopingOrder.payDate)"/>
      <el-step title="发货时间" icon="el-icon-date"
        :description="dateFormatter(shopingOrder && shopingOrder.sendDate)"/>
      <el-step title="收货时间" icon="el-icon-date"
        :description="dateFormatter(shopingOrder && shopingOrder.receiveDate)"/>
      <el-step title="收货地址" icon="el-icon-user"
        :description="shopingOrder && dealAdress(shopingOrder.shopingAddress.areaInfo)"/>
    </el-steps>
  </el-dialog>
</template>

<script>
    import {
      findOrderByIdAjax,
    } from "../../api"
    import {
      dateFormatter,
      dealAdress
    } from "../../util"

    export default {
      props: {
        orderDetailShow: Boolean,
        orderDetailId: String,
        shopingOrders: Array,
      },

      data() {
        return {
          orderIndex: 0,
          shopingOrder: null,
          shopingCarts: [],
          shopingCartsLoading: false,
        }
      },

      watch: {
        orderDetailId: function (value) {
          this.findOrderById(value)
        },
      },

      methods: {
        dateFormatter,
        dealAdress,

        nextOrderDetail (plus) {
          if (plus) this.orderIndex = this.orderIndex + 1
          else this.orderIndex = this.orderIndex - 1
          if (this.orderIndex == this.shopingOrders.length) this.orderIndex = this.shopingOrders.length -1
          if (this.orderIndex == -1) this.orderIndex = 0
          const shopingOrder = this.shopingOrders[this.orderIndex]
          this.findOrderById(shopingOrder.orderId || shopingOrder.uuId)
        },

        async findOrderById(orderId) {
          this.shopingCartsLoading = true
          const result = await findOrderByIdAjax(orderId)
          if (result.status == "SUCCESS") {
            this.shopingOrder = result.data
            this.shopingCarts = result.data.shopingCarts
            this.shopingCartsLoading = false
          }
        },

        // 订单购物商品列表合并行
        objectSpanMethod ({rowIndex, columnIndex}) {
          if ([5, 6, 7, 8, 9, 10, 11].includes(columnIndex)) {
            if (rowIndex == 0) {
              return [this.shopingCarts.length, 1]
            } else {
              return [0, 0]
            }
          }
        },

        // 支付方式
        payTypeFormatter(payType) {
          switch (payType) {
            case 0:
              return {
                name: "砍价免费拿",
                type: "info"
              }
            case 1:
              return {
                name: "余额支付",
                type: ""
              }
            case 2:
              return {
                name: "微信支付",
                type: "success"
              }
            case 3:
              return {
                name: "支付宝支付",
                type: "success"
              }
            case 4:
              return {
                name: "积分兑换",
                type: "info"
              }

          }
        },
      },
    }
</script>

<style>

</style>
