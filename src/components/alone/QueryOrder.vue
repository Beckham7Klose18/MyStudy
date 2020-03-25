<template>
  <el-card>
    <el-row>
      <el-col :span="6" :offset="1">
        <img :src="userMsg.headUrl" alt width="50px" height="50px" />
      </el-col>
      <el-col :span="11" style="line-height:50px">用户名：{{userMsg.nickName}}</el-col>
      <el-col :span="6" style="line-height:50px">性别：{{userMsg.sex && (userMsg.sex==1?"男":'女') || "未填"}}</el-col>
    </el-row>
    <el-tabs v-model="data" @tab-click="queryUserOrder" v-loading="userLoading">
      <el-row>
        <el-input
          placeholder="请输入订单号"
          v-model="userInput"
          class="input-with-select"
          style="width:50%"
        ></el-input>
      </el-row>
      <el-tab-pane label="全部" name="null">
        <el-row v-for="(item,index) in orderList" :key="index" style="margin-top:10px">
          <el-card v-show="userInput==item.orderNo||userInput==''">
            <el-row style="border-bottom:1px solid #ccc">订单号：{{item.orderNo}}
              <el-tag :type="orderStatusFormatter(item).type" size="small" style="margin-left: 20px; margin-bottom: 5px;">{{orderStatusFormatter(item).statusName}}</el-tag>
            </el-row>
            <el-row
              v-for="(item1,index1) in item.shopingCarts"
              :key="index1"
              style="margin-top:10px"
            >
              <el-col :span="4">
                <img :src="item1.goods.mainImage.url" alt width="100%" />
              </el-col>
              <el-row :span="20">
                <el-row>
                  <el-col :span="10">
                    <div style="margin-left:10px">{{item1.goods.name}}</div>
                  </el-col>
                  <el-col :span="10" style="text-align: right">￥{{item1.goods.presentPrice}}</el-col>
                  <el-col :span="20" style="text-align: right">×{{item1.purchaseQuantity}}</el-col>
                </el-row>
              </el-row>
            </el-row>
            <el-row style="text-align: right">商品总价：{{item.amount}}</el-row>
            <!-- <el-row style="text-align: right;margin-top:10px">
              <el-button type="success">复制订单详情</el-button>
            </el-row>-->
          </el-card>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="待付款" name="0">
        <el-row v-for="(item,index) in orderList" :key="index" style="margin-top:10px">
          <el-card v-show="userInput==item.orderNo||userInput==''">
            <el-row style="border-bottom:1px solid #ccc">订单号：{{item.orderNo}}
              <el-tag :type="orderStatusFormatter(item).type" size="small" style="margin-left: 20px; margin-bottom: 5px;">{{orderStatusFormatter(item).statusName}}</el-tag>
            </el-row>
            <el-row
              v-for="(item1,index1) in item.shopingCarts"
              :key="index1"
              style="margin-top:10px"
            >
              <el-col :span="4">
                <img :src="item1.goods.mainImage.url" alt width="100%" />
              </el-col>
              <el-row :span="20">
                <el-row>
                  <el-col :span="10">
                    <div style="margin-left:10px">{{item1.goods.name}}</div>
                  </el-col>
                  <el-col :span="10" style="text-align: right">￥{{item1.goods.presentPrice}}</el-col>
                  <el-col :span="20" style="text-align: right">×{{item1.purchaseQuantity}}</el-col>
                </el-row>
              </el-row>
            </el-row>
            <el-row style="text-align: right">商品总价：{{item.amount}}</el-row>
            <!-- <el-row style="text-align: right;margin-top:10px">
              <el-button type="success">复制订单详情</el-button>
            </el-row>-->
          </el-card>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="待发货" name="1">
        <el-row v-for="(item,index) in orderList" :key="index" style="margin-top:10px">
          <el-card v-show="userInput==item.orderNo||userInput==''">
            <el-row style="border-bottom:1px solid #ccc">
              <el-col :span="20">订单号：{{item.orderNo}}
                <el-tag :type="orderStatusFormatter(item).type" size="small" style="margin-left: 20px; margin-bottom: 5px;">{{orderStatusFormatter(item).statusName}}</el-tag>
              </el-col>
              <el-col :span="4"><el-tag type="danger" v-if="item.remindSend">提醒发货</el-tag></el-col>
            </el-row>
            <el-row
              v-for="(item1,index1) in item.shopingCarts"
              :key="index1"
              style="margin-top:10px"
            >
              <el-col :span="4">
                <img :src="item1.goods.mainImage.url" alt width="100%" />
              </el-col>
              <el-row :span="20">
                <el-row>
                  <el-col :span="10">
                    <div style="margin-left:10px">{{item1.goods.name}}</div>
                  </el-col>
                  <el-col :span="10" style="text-align: right">￥{{item1.goods.presentPrice}}</el-col>
                  <el-col :span="20" style="text-align: right">×{{item1.purchaseQuantity}}</el-col>
                </el-row>
              </el-row>
            </el-row>
            <el-row style="text-align: right">商品总价：{{item.amount}}</el-row>
            <!-- <el-row style="text-align: right;margin-top:10px">
              <el-button type="success">复制订单详情</el-button>
            </el-row>-->
          </el-card>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="已收货" name="3">
        <el-row v-for="(item,index) in orderList" :key="index" style="margin-top:10px">
          <el-card v-show="userInput==item.orderNo||userInput==''">
            <el-row style="border-bottom:1px solid #ccc">订单号：{{item.orderNo}}
              <el-tag :type="orderStatusFormatter(item).type" size="small" style="margin-left: 20px; margin-bottom: 5px;">{{orderStatusFormatter(item).statusName}}</el-tag>
            </el-row>
            <el-row
              v-for="(item1,index1) in item.shopingCarts"
              :key="index1"
              style="margin-top:10px"
            >
              <el-col :span="4">
                <img :src="item1.goods.mainImage.url" alt width="100%" />
              </el-col>
              <el-row :span="20">
                <el-row>
                  <el-col :span="10">
                    <div style="margin-left:10px">{{item1.goods.name}}</div>
                  </el-col>
                  <el-col :span="10" style="text-align: right">￥{{item1.goods.presentPrice}}</el-col>
                  <el-col :span="20" style="text-align: right">×{{item1.purchaseQuantity}}</el-col>
                </el-row>
              </el-row>
            </el-row>
            <el-row style="text-align: right">商品总价：{{item.amount}}</el-row>
            <!-- <el-row style="text-align: right;margin-top:10px">
              <el-button type="success">复制订单详情</el-button>
            </el-row>-->
          </el-card>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <el-row style="margin-top: 10px; text-align: right;">
      <MJ_Pagination />
    </el-row>
  </el-card>
</template>

<script>
  import PubSub from "pubsub-js";
  import { mapState, mapActions } from "vuex";
  import { getUrlParams } from "../../util";
  import {
    queryStepDateAjax,
    queryUserOrderAjax
  } from "../../api";
  const MJ_Pagination = () => import('../common/MJ_Pagination.vue')

  export default {
    components: {
      MJ_Pagination
    },

    data() {
      return {
        userInput: "",
        activeName: "9",
        data: "null",
        userMsg: {},
        orderList: [],
        userLoading: false
      };
    },

    computed: {
      ...mapState(["metaData"])
    },

    mounted() {
      this.queryUserMsg();
      this.queryUserOrder();
      PubSub.subscribe("updateMetaData", this.queryUserOrder);
    },

    methods: {
      ...mapActions(["updateMetaData"]),
      getUrlParams,

      //用户信息
      async queryUserMsg() {
        const result = await queryStepDateAjax(getUrlParams());
        if (result.status == "SUCCESS") {
          this.userMsg = result.data;
        }
      },

      //用户订单
      async queryUserOrder() {
        this.userLoading = true;
        const result = await queryUserOrderAjax(
          this.data,
          this.metaData,
          getUrlParams()
        );
        if (result.status == "SUCCESS") {
          this.orderList = result.data;
          if (result.resMetaData) {
            this.updateMetaData({ metaData: result.resMetaData, init: true });
          }
        }
        this.userLoading = false;
      },

      // 订单状态
      orderStatusFormatter(row) {
        const {status, refundStatus} = row
        if (refundStatus > -1) return {
          statusName: "已申请退款",
          type: "danger"
        }
        else switch (status) {
          case 0:
            return {
              statusName: "待付款",
              type: "warning"
            };
          case 1:
            return {
              statusName:  "待发货",
              type: "warning"
            };
          case 2:
            return {
              statusName:  "待收货",
              type: "warning"
            };
          case 3:
            return {
              statusName:  "已收货",
              type: "success"
            };
          case 4:
            return {
              statusName:  "已取消",
              type: "info"
            };
          case 5:
            return {
              statusName:  "已评价",
              type: "success"
            };
          case 6:
            return {
              statusName:  "订单完成",
              type: "success"
            };
        }
      },
    }
  }
</script>

<style >
</style>
