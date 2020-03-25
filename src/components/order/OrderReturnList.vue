<template>
  <div>
    <el-tabs v-model="settlement" type="card">
            <el-tab-pane label="全部" name="2"/>
            <el-tab-pane label="进行中" name="0"/>
            <el-tab-pane label="已结算" name="1"/>
        </el-tabs>
    <el-row style="margin-bottom: 10px;">
      <el-button type="success" size="small" @click="resetSelect('all')">立即刷新&nbsp;<i class="el-icon-refresh"/></el-button>
      <el-switch v-model="searchOrderReturn.somebody" active-text="有人助力" inactive-text="无人助力"
                 style="margin: 0 10px;" @change="findAllShareOrderHelpLogs(pageOne)"/>
      <el-input v-model="searchOrderReturn.orderNo" placeholder="订单号" size="small" style="width: 23%;">
          <el-button slot="append" icon="el-icon-search" @click="findAllShareOrderHelpLogs(pageOne)"/>
          <el-button slot="append" icon="el-icon-refresh-left" @click="resetSelect('rsOrderNo')"/>
      </el-input>
      <el-input v-model="searchOrderReturn.nickName" placeholder="用户名关键词" size="small" style="width: 23%;">
          <el-button slot="append" icon="el-icon-search" @click="findAllShareOrderHelpLogs(pageOne)"/>
          <el-button slot="append" icon="el-icon-refresh-left" @click="resetSelect('rsNickName')"/>
      </el-input>
    </el-row>
    <el-table stripe v-if="defaultSort" v-loading="tableLoading"
        @sort-change="orderSortChange" :data="orderReturnTable" :default-sort="defaultSort"
        :header-cell-style="{backgroundColor: '#DCDFE6'}" :cell-style="{paddingTop: '7px', paddingBottom: 0}">
      <el-table-column type="expand" fixed>
          <template slot-scope="props">
              <el-table :data="[props.row.order]"
                        :header-cell-style="{backgroundColor: '#f2f9ff'}"
                        :cell-style="{paddingTop: '7px', paddingBottom: 0, backgroundColor: '#f2f9ff'}">
                <el-table-column label="订单号" fixed width="120"
                    prop="order_no"
                    sortable="custom"
                    :formatter="(row) => row.orderNo"/>
                <el-table-column label="配送方式" width="100"
                    prop="delivery"
                    sortable="custom"/>
                <el-table-column label="配送费" width="90"
                    prop="delivery_fee"
                    sortable="custom"
                    :formatter="(row) => row.deliveryFee + ' 元'"/>
                <el-table-column label="减肥基金" width="100"
                    prop="fund"
                    sortable="custom"
                    :formatter="(row) => '-' + row.fund + ' 元'"/>
                <el-table-column label="优惠券金额" width="115"
                    prop="coupon"
                    sortable="custom"
                    :formatter="(row) => '-' + row.coupon + ' 元'"/>
                <el-table-column label="订单金额" width="100"
                    prop="amount"
                    sortable="custom"
                    :formatter="(row) => row.amount + ' 元'"/>
                <el-table-column label="支付方式" width="110"
                    prop="pay_type"
                    sortable="custom">
                    <template slot-scope="scope">
                    <el-tag :type="payTypeFormatter(scope.row.payType).type">{{payTypeFormatter(scope.row.payType).name}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" width="100"
                    prop="create_date"
                    sortable="custom"
                    :formatter="(row) => dateFormatter(row.createDate)"/>
                <el-table-column label="付款时间" width="100"
                    prop="pay_date"
                    sortable="custom"
                    :formatter="(row) => dateFormatter(row.payDate)"/>
                <el-table-column label="发货时间" width="100"
                    prop="send_date"
                    sortable="custom"
                    :formatter="(row) => dateFormatter(row.sendDate)"/>
                <el-table-column label="收货时间" width="100"
                    prop="receive_date"
                    sortable="custom"
                    :formatter="(row) => dateFormatter(row.receiveDate)"/>
                <el-table-column label="完成时间" width="100"
                    prop="done_date"
                    sortable="custom"
                    :formatter="(row) => dateFormatter(row.doneDate)"/>
                <el-table-column label="订单状态" fixed="right" min-width="105"
                    prop="status"
                    sortable="custom">
                    <template slot-scope="scope">
                    <el-tag :type="orderStatusFormatter(scope.row.status).type">{{orderStatusFormatter(scope.row.status).statusName}}</el-tag>
                    </template>
                </el-table-column>
              </el-table>
          </template>
      </el-table-column>
      <el-table-column label="头像" fixed width="70">
          <template slot-scope="scope">
              <img :src="scope.row.order.user.headUrl" v-show="scope.row.order.user.headUrl" width="45" height="45"/>
              <img src="../container/images/maijiCat.png" v-show="! scope.row.order.user.headUrl" width="45"
                   height="45"/>
          </template>
      </el-table-column>
      <el-table-column label="用户名" fixed width="123"
                       prop="user_id"
                       show-overflow-tooltip
                       :formatter="(row) => row.order.user.nickName? row.order.user.nickName: '麦吉用户'"/>
      <el-table-column label="订单号" fixed width="190"
                       prop="order.orderNo"/>
      <el-table-column label="订单金额" width="105"
                       prop="order_money"
                       sortable="custom"
                       :formatter="(row) => row.orderMoney + ' 元'"/>
      <el-table-column label="最大返现金额" width="130"
                       prop="max_retur_money"
                       sortable="custom"
                       :formatter="(row) => row.maxReturMoney + ' 元'">
      </el-table-column>
      <el-table-column label="现已助力返现总金额" width="180"
                       prop="now_retur_money"
                       sortable="custom"
                       :formatter="(row) => (row.nowReturMoney || 0) + ' 元'"/>
      <el-table-column label="分享状态" width="100">
        <template slot-scope="scope">
          <el-tag type="danger" size="small" v-if="! scope.row.settlement">进行中</el-tag>
          <el-tag type="success" size="small" v-if="scope.row.settlement">已结算</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="分享订单返现时间" width="190"
                       prop="share_time"
                       sortable="custom"
                       :formatter="(row) => dateFormatter(row.shareTime)"/>
      <el-table-column label="订单返现结算时间" width="190"
                       prop="end_time"
                       sortable="custom"
                       :formatter="(row) => dateFormatter(row.endTime)"/>
      <el-table-column label="操作" fixed="right" min-width="100">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="findShareOrderHelpById(scope.row.orderId)">助力详情 <i class="el-icon-notebook-2"/></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 10px; text-align: right;">
      <MJ_Pagination/>
    </el-row>
    <el-dialog title="订单返现分享助力详情" :visible.sync="helpLogsShow" width="45%">
        <el-table stripe max-height="456" :data="helpLogsTable"
                :header-cell-style="{backgroundColor: '#DCDFE6'}"
                :cell-style="{paddingTop: '7px', paddingBottom: 0}">
        <el-table-column label="头像" fixed width="70">
          <template slot-scope="scope">
            <img :src="scope.row.headUrl" v-show="scope.row.headUrl" width="45" height="45"/>
            <img src="../container/images/maijiCat.png" v-show="! scope.row.headUrl" width="45"
                 height="45"/>
          </template>
        </el-table-column>
        <el-table-column label="用户名" fixed width="90"
                         :formatter="(row) => row.nickName? row.nickName: '麦吉用户'"/>
        <el-table-column label="助力金额" width="100"
                         :formatter="(row) => row.helpMoney + ' 元'"/>
        <el-table-column label="助力时间" width="190"
                         :formatter="(row) => dateFormatter(row.helpTime)"/>
        <el-table-column label="操作" fixed="right" min-width="100">
            <template slot-scope="scope">
              <el-tag type="success" v-show="scope.row.newUser">新用户 <i class="el-icon-user"/></el-tag>
              <el-tag v-show="! scope.row.newUser">老用户 <i class="el-icon-user"/></el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
    import {
        findAllShareOrderHelpLogsAjax,
        findShareOrderHelpByIdAjax
    } from "../../api";
    import {mapState, mapActions} from "vuex";
    import {dateFormatter} from "../../util";
    const MJ_Pagination = () => import('../common/MJ_Pagination.vue')

    export default {
        components: {
            MJ_Pagination
        },

        data() {
            return {
                orderReturnTable: [],
                tableLoading: false,
                defaultSort: {
                    prop: "share_time",
                    order: "descending"
                },
                searchOrderReturn: {
                  nickName: "",
                  orderNo: "",
                  settlement: null,
                  somebody: true,
                },
                settlement: '2',
                helpLogsTable: [],
                helpLogsShow: false,
            };
        },

        computed: {
            ...mapState(["loading", "metaData"]),

          pageOne: {
            get () {
              return {
                page: 1,
                size: this.metaData.size
              }
            }
          },
        },

        mounted() {
            this.findAllShareOrderHelpLogs({page: 1, size: this.metaData.size})
            PubSub.subscribe("updateMetaData", () => {
                this.findAllShareOrderHelpLogs()
            });
        },

        watch: {
            settlement: function (value) {
                this.defaultSort = false
                this.$nextTick(() => {
                    switch (value) {
                        case "0":
                            this.defaultSort = {
                                prop: 'share_time',
                                order: "descending"
                            }
                            this.searchOrderReturn.settlement = false
                            break;
                        case "1":
                            this.defaultSort = {
                                prop: 'end_time',
                                order: "descending"
                            }
                            this.searchOrderReturn.settlement = true
                            break;
                        case "2":
                            this.defaultSort = {
                                prop: 'share_time',
                                order: "descending"
                            }
                            this.searchOrderReturn.settlement = null
                            break;
                    }
                    this.findAllShareOrderHelpLogs({page: 1, size: this.metaData.size})
                })
            },
        },

        methods: {
          ...mapActions(["updateMetaData"]),
          dateFormatter, // 日期格式化

          // 订单返现助力详情
          async findShareOrderHelpById (data) {
            const result = await findShareOrderHelpByIdAjax(data)
            if (result.status != "SUCCESS") return this.$message.error(`请求助力详情失败，请稍后重试`)
            this.helpLogsTable = result.data.helpList
            this.helpLogsShow = true
          },

          // 订单状态
          orderStatusFormatter(status) {
              switch (status) {
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

          // 支付方式
          payTypeFormatter(status) {
            switch (status) {
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

          // 表格排序
          orderSortChange({prop, order}) {
              this.searchOrderReturn.orderBy = prop;
              this.searchOrderReturn.orderType = order == "ascending" ? "asc" : "desc";
              this.findAllShareOrderHelpLogs({page: 1, size: this.metaData.size})
          },

          // 获取表格数据
          async findAllShareOrderHelpLogs(metaData) {
              this.tableLoading = true
              const result = await findAllShareOrderHelpLogsAjax(this.searchOrderReturn, metaData || this.metaData)
              if (result.status == "SUCCESS") this.orderReturnTable = result.data
              result.resMetaData && this.updateMetaData({metaData: result.resMetaData, init: true})
              this.tableLoading = false
              this.loading.close()
          },

          resetSelect(showSelect) {
              if (showSelect == "rsOrderNo") this.searchOrderReturn.orderNo = ''
              if (showSelect == "rsNickName") this.searchOrderReturn.nickName = ''
              if (showSelect == "all") this.searchOrderReturn = {nickName: "", orderNo: ""}
              this.findAllShareOrderHelpLogs(this.pageOne)
          }
        },

        beforeDestroy() {
            PubSub.unsubscribe("updateMetaData")
        }
    };
</script>

<style>
    .el-tabs .el-badge__content.is-fixed {
        position: absolute !important;
        top: 9px !important;
        right: 2px !important;
        transform: translateY(-50%) translateX(100%) !important;
    }

    .el-table .success-row {
        background-color: #f2f9ff;
        color: #409eff;
    }

    .el-dialog__header {
        background-color: #f2f9ff;
    }

    .el-input-number--mini {
        width: 95px;
        line-height: 26px;
    }

    .el-input-number.is-controls-right .el-input__inner {
        padding-left: 0px;
        padding-right: 30px;
    }

    /*指定过渡样式*/
    .showSelect-enter-active,
    .showSelect-leave-active {
        transition: all 1s;
    }

    /*指定隐藏时的样式*/
    .showSelect-enter,
    .showSelect-leave-to {
        opacity: 0;
        transform: translateX(32px);
    }

    .showSelect {
        margin-bottom: 10px;
        background-color: #f2f9ff;
    }

    .el-range-editor--small.el-input__inner {
        width: 250px;
    }

    .el-tabs__item.is-top {
        font-size: large;
    }
</style>
