<template>
  <div class="DistributionRecordList">
    <el-row style="margin-bottom: -10px; font-size: 13px;">
      <el-col style="width: 10%;">
        <img :src="appUser.userInfo.headUrl" v-show="appUser.userInfo.headUrl" width="100" height="100"/>
        <img src="../container/images/maijiCat.png" v-show="! appUser.userInfo.headUrl" width="100" height="100"/>
      </el-col>
      <el-col style="width: 15%; margin-left: 10px;">
        <el-row>
          <el-col style="line-height: 50px;">
            <span style="color: #909399;">用户列表：</span>
            <span style="color: #409EFF; cursor: pointer;" @click="appUserListShow = true">选择用户</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="line-height: 50px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            <span style="color: #909399;">用户名称：{{appUser.userInfo && appUser.userInfo.nickName}}</span>
          </el-col>
        </el-row>
      </el-col>
      <el-col style="width: 19%;">
        <el-row>
          <el-col style="line-height: 50px;">
            <span style="color: #909399;">分销提成（冻结中）：</span>
            <span style="color: #e6a23c; font-size: 15px; font-weight: 900;">{{capitalMain.frozenCapital}} 元</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="line-height: 50px;">
            <span style="color: #909399;">分销提成（可提现）：</span>
            <span style="color: #19f013; font-size: 15px; font-weight: 900;">{{capitalMain.distributionMoney}} 元</span>
          </el-col>
        </el-row>
      </el-col>
      <el-col style="width: 13%;">
        <el-row>
          <el-col style="line-height: 50px;">
            <span style="color: #909399;">分销资格：</span>
            <el-tag type="success" size="mini" v-if="appUser.isCancel == 0">有效</el-tag>
            <el-tag type="danger" size="mini" v-if="appUser.isCancel == 1">失效</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="line-height: 50px;">
            <span style="color: #909399;">分销编号：{{appUser.distributionNum}}</span>
          </el-col>
        </el-row>
      </el-col>
      <el-col style="width: 11%;">
        <el-row>
          <el-col style="line-height: 50px;">
            <span style="color: #909399;">一级下级：{{appUser.pidCount}} 人</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="line-height: 50px;">
            <span style="color: #909399;">二级下级：{{appUser.pidCount}} 人</span>
          </el-col>
        </el-row>
      </el-col>
      <el-col style="width: 30%;">
        <el-row>
          <el-col style="line-height: 50px;">
            <span style="color: #909399;">分销比例：{{appUser.ratio && appUser.ratio * 100 + '%' || '—'}} </span>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="line-height: 50px;">
            <span style="color: #909399;">有效时间：{{dateFormatter(appUser.endTime)}}</span>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-divider/>
    <el-row style="margin-top: -10px; margin-bottom: 10px;">
      <el-input v-model="searchLog.nickName" placeholder="用户名关键词搜索" size="small" style="width: 20%;">
        <el-button slot="append" icon="el-icon-search" @click="findAllLogs(pageOne)"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="searchLog.nickName = ''; findAllLogs(pageOne)"/>
      </el-input>
      <el-input v-model="searchLog.orderNo" placeholder="订单编号关键词搜索" size="small" style="width: 20%; margin-right: 20px;" v-if="searchLog.type == 0">
        <el-button slot="append" icon="el-icon-search" @click="searchLog.nickName = ''; findAllLogs(pageOne)"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="searchLog.orderNo = ''; searchLog.userId = ''; appUser = {};findAllLogs(pageOne)"/>
      </el-input>
      <span style="color: #909399;">当前用户：</span>
      <el-date-picker v-model="searchLog.inTimes" size="small" @change="findAllLogs(pageOne)" style="width: 18%; margin-right: 20px;"
              type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions"/>
      <span style="color: #909399;">全部用户：</span>
      <el-date-picker v-model="searchLog.inTimes" size="small" @change="searchLog.userId = ''; findAllLogs(pageOne)" style="width: 18%;"
              type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions"/>
    </el-row>
    <el-table stripe v-loading="logTableLoading" :data="logTable"
          :header-cell-style="{backgroundColor: '#DCDFE6'}"
          :cell-style="{paddingTop: '7px', paddingBottom: '3px'}">
        <el-table-column type="index" width="45" align="center"/>
        <el-table-column label="头像" width="70">
          <template slot-scope="scope">
            <img :src="scope.row.userInfo.headUrl" v-show="scope.row.userInfo.headUrl" width="45" height="45"/>
            <img src="../container/images/maijiCat.png" v-show="! scope.row.userInfo.headUrl" width="45" height="45"/>
          </template>
        </el-table-column>
        <el-table-column label="用户名称" min-width="120"
                         prop="userInfo.nickName"
                         show-overflow-tooltip/>
        <el-table-column label="分销金额" width="120" v-if="searchLog.type == 0">
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.isRefund == 0 && 'success' || 'danger'">{{(scope.row.isRefund == 0 && '+ ' || '- ') + scope.row.money + ' 元'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="资金状态" width="105" v-if="searchLog.type == 0">
        <template slot-scope="scope">
          <el-tag :type="scope.row.shopingOrder.status == 6 && 'success' || 'danger'">
            {{scope.row.shopingOrder.status == 6 && '已到账' || '冻结中'}}</el-tag>
        </template>
      </el-table-column>
        <el-table-column label="来源用户等级" width="120" v-if="searchLog.type == 0"
                         :formatter="(row) => row.level == 1 && '下级用户' || '下下级用户'"/>
        <el-table-column label="来源订单编号" width="200" v-if="searchLog.type == 0">
          <template slot-scope="scope">
            <el-button type="text" @click="findOrderById(scope.row.shopingOrder.uuId)"
                            icon="el-icon-search">{{scope.row.shopingOrder.orderNo}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="来源订单状态" width="120" v-if="searchLog.type == 0">
        <template slot-scope="scope">
          <el-tag :type="orderStatusFormatter(scope.row.shopingOrder).type">{{orderStatusFormatter(scope.row.shopingOrder).statusName}}</el-tag>
        </template>
      </el-table-column>
        <el-table-column label="提现金额" width="120" v-if="searchLog.type == 2">
          <template slot-scope="scope">
            <el-tag size="small" type="success">{{scope.row.ioMoney + ' 元'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="提现方式" width="180"
                         :formatter="(row) => row.end == 1 && '支付宝提现' || '微信提现'"/>
        <el-table-column label="账户余额" width="180"
                       :formatter="(row) => row.money + ' 元'"/>
        <el-table-column label="记录时间" width="180"
                           :formatter="(row) => dateFormatter(row.inTime)"/>
    </el-table>
    <el-row style="margin-top: 10px">
      <el-col style="text-align: right;">
        <MJ_Pagination/>
      </el-col>
    </el-row>
    <el-dialog title="用户列表" :visible.sync="appUserListShow" width="70%">
      <DistributionList :show="true" :chooseUser="chooseUser"/>
    </el-dialog>
    <el-dialog title="订单详情" :visible.sync="orderDetailShow" width="60%">
      <el-row style="margin-top: -10px; margin-bottom: 10px;">
        <el-col :span="2" :offset="2"><img :src="shopingOrder.user && shopingOrder.user.headUrl" width="45" height="45"/></el-col>
        <el-col :span="20" style="line-height: 45px;">
          <span style="color: #909399;">用户名称：</span>{{shopingOrder.user && shopingOrder.user.nickName}}
          <span style="color: #909399; margin-left: 20px;">订单编号：</span>{{shopingOrder.orderNo}}
          <span style="color: #909399; margin-left: 20px;">订单状态：</span>
          <el-tag :type="orderStatusFormatter(shopingOrder).type">{{orderStatusFormatter(shopingOrder).statusName}}</el-tag>
        </el-col>
      </el-row>
      <el-table stripe max-height="425"
                v-loading="shopingCartsLoading"
                :data="shopingCarts"
                :span-method="objectSpanMethod"
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
                         :formatter="() => shopingOrder.payType==1? '余额支付': shopingOrder.payType==2? '微信支付':
                                                  shopingOrder.payType==3? '支付宝支付': '砍价免费拿'" />
      </el-table>
      <el-steps align-center style="margin-top: 20px;">
        <el-step
          title="创建订单"
          :description="dateFormatter(shopingOrder && shopingOrder.createDate)"
          icon="el-icon-date"
        />
        <el-step
          title="支付时间"
          :description="dateFormatter(shopingOrder && shopingOrder.payDate)"
          icon="el-icon-date"
        />
        <el-step
          title="发货时间"
          :description="dateFormatter(shopingOrder && shopingOrder.sendDate)"
          icon="el-icon-date"
        />
        <el-step
          title="收货时间"
          :description="dateFormatter(shopingOrder && shopingOrder.receiveDate)"
          icon="el-icon-date"
        />
        <el-step title="收货地址" :description="areaInfo.province + areaInfo.city + areaInfo.county + areaInfo.address" icon="el-icon-user"/>
      </el-steps>
    </el-dialog>
  </div>
</template>

<script>
  import {
    findAllDistributionLogsAjax,
    editDistributionUserAjax,
    findOrderByIdAjax,
    findAllDistributionUsersAjax,
    findCapitalMainByUserIdAjax,
    findAllWithdrawalRecordsAjax
  } from '../../api'
  import {mapState, mapActions} from 'vuex'
  import {dateFormatter} from '../../util'
  const DistributionList = () => import('./DistributionList.vue')
  const MJ_Pagination = () => import('../common/MJ_Pagination.vue')

  export default {
    components: {
      DistributionList,
      MJ_Pagination,
    },

    data() {
      return {
        logTable: [],
        logTableLoading: false,
        pidUser: {},
        pidUsers: [],
        searchLog: {
          userId: '',
          orderNo: '',
          nickName: '',
          inTimes: [],
          type: 2,
        },
        orderDetailShow: false,
        shopingCartsLoading: false,
        shopingOrder: {status: 0, refundStatus: 0},
        shopingCarts: [],
        areaInfo: {},
        appUser: {},
        appUserListShow: false,
        capitalMain: {},
      }
    },

    computed: {
      ...mapState(['loading', 'pickerOptions', 'metaData']),

      pageOne () {
        return {
          page: 1,
          size: this.metaData.size
        }
      },
    },

    watch: {
      $route: function () {
        const fullPath = this.$route.fullPath
        if (fullPath.includes('record')) this.searchLog.type = 0
        if (fullPath.includes('withdrawal')) this.searchLog.type = 2
        this.findAllUsers()
      },
    },

    mounted() {
      const fullPath = this.$route.fullPath
      if (fullPath.includes('record')) this.searchLog.type = 0
      if (fullPath.includes('withdrawal')) this.searchLog.type = 2
      this.findAllUsers()
      PubSub.subscribe('updateMetaData', () => this.findAllLogs())
    },

    methods: {
      ...mapActions(['updateMetaData']),
      dateFormatter, // 日期格式化

      // 获取分销用户列表
      async findAllUsers() {
        const result = await findAllDistributionUsersAjax({}, {page: 1, size: 1})
        this.logTableLoading = true
        if (result.status == "SUCCESS") {
          this.appUser = result.data[0]
          await this.findCapitalMain(this.appUser.uuId)
        }
      },

      async findCapitalMain (userId) {
        const result = await findCapitalMainByUserIdAjax(userId)
        if (result.status == "SUCCESS") {
          this.capitalMain = result.data
          this.searchLog.userId = userId
          this.findAllLogs(this.pageOne)
        }
      },

      async findAllLogs (metaData) {
        this.logTableLoading = true
        let result = {}
        // 获取分销流水列表
        if (this.searchLog.type == 0) result = await findAllDistributionLogsAjax(this.searchLog, metaData || this.metaData)
        // 获得用户分销提现记录列表
        if (this.searchLog.type == 2) result = await findAllWithdrawalRecordsAjax(this.searchLog, metaData || this.metaData)
        if (result.status == "SUCCESS") {
          this.logTable = result.data
          this.updateMetaData({metaData: result.resMetaData, init: true})
          this.logTableLoading = false
        }
        this.loading.close()
      },

      chooseUser (user) {
        this.appUser = user
        this.searchLog.userId = user.uuId
        this.findCapitalMain(user.uuId)
        this.appUserListShow = false
      },

      // 编辑分销用户
      async editDistributionUser (row) {
        row.editerUserId = this.maijiUser.uuId
        row.editerName = this.maijiUser.name
        if (row.ratioNew - 0)  row.ratio = row.ratioNew / 100
        const result = await editDistributionUserAjax(row)
        if (result.status != 'SUCCESS') return this.$message.error(`设置失败，请稍后重试`)
        row.ratioShow = false
        this.findAllLogs(this.pageOne)
        return this.$message.success(`设置成功`)
      },

      // 获取订单详情
      async findOrderById(orderId) {
        this.orderDetailShow = true
        this.shopingCartsLoading = true
        const result = await findOrderByIdAjax(orderId)
        if (result.status == "SUCCESS") {
          this.shopingOrder = result.data
          this.areaInfo = this.shopingOrder.shopingAddress.areaInfo
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

      // 订单状态
      orderStatusFormatter(row) {
        const {status, refundStatus} = row
        if (refundStatus > -1) return {
          statusName: "已退款",
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
    },

    beforeDestroy() {
      PubSub.unsubscribe("updateMetaData")
    }
  };
</script>

<style >
  .pid-row {
    background-color: #409EFF;
  }

  .DistributionRecordList .el-input-group__append button {
    padding: 12px 12px;
  }
</style>
