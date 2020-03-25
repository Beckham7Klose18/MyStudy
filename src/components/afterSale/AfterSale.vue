<template>
  <div>
    <el-tabs v-model="selectRefundOrder.type" @tab-click="findAllOrderRefunds(pageOne)" type="card">
      <el-tab-pane label="仅退款" name="1" v-if="selectRefundOrder.status == 0">
          <span slot="label" v-if="refundType1Status0Count != 0">
            <el-badge :value="refundType1Status0Count">仅退款</el-badge>
          </span>
        <span slot="label" v-if="refundType1Status0Count == 0">仅退款</span>
      </el-tab-pane>
      <el-tab-pane label="退货退款" name="2" v-if="selectRefundOrder.status == 0">
          <span slot="label" v-if="refundType2Status0Count != 0">
            <el-badge :value="refundType2Status0Count">退货退款</el-badge>
          </span>
        <span slot="label" v-if="refundType2Status0Count == 0">退货退款</span>
      </el-tab-pane>
      <el-tab-pane label="仅退款" name="1" v-if="selectRefundOrder.status == 2">
          <span slot="label" v-if="refundType1Status2Count != 0">
            <el-badge :value="refundType1Status2Count">仅退款</el-badge>
          </span>
        <span slot="label" v-if="refundType1Status2Count == 0">仅退款</span>
      </el-tab-pane>
      <el-tab-pane label="确认收货" name="3" v-if="selectRefundOrder.status == 2">
          <span slot="label" v-if="refundType2Status1Count != 0">
            <el-badge :value="refundType2Status1Count">确认收货</el-badge>
          </span>
        <span slot="label" v-if="refundType2Status1Count == 0">确认收货</span>
      </el-tab-pane>
      <el-tab-pane label="退货退款" name="2" v-if="selectRefundOrder.status == 2">
          <span slot="label" v-if="refundType2Status2Count != 0">
            <el-badge :value="refundType2Status2Count">退货退款</el-badge>
          </span>
        <span slot="label" v-if="refundType2Status2Count == 0">退货退款</span>
      </el-tab-pane>
      <el-tab-pane label="仅退款" name="1" v-if="selectRefundOrder.status -3 > 0"/>
      <el-tab-pane label="退货退款" name="2" v-if="selectRefundOrder.status -3 > 0"/>
    </el-tabs>
    <el-row style="margin-bottom: 10px;">
      <el-col :span="2" v-if="selectRefundOrder.status == 0">
        <el-button type="success" size="small" @click="resetSelect('all')" style="width: 100%;">
          立即刷新&nbsp;<i class="el-icon-refresh"></i></el-button>
      </el-col>
      <el-col :span="5" :offset="selectRefundOrder.status==0 && 1 || 0">
        <el-input v-model="selectRefundOrder.orderNo" placeholder="订单编号搜索" size="small">
          <el-button slot="append" icon="el-icon-search" @click="findAllOrderRefunds"/>
          <el-button slot="append" icon="el-icon-refresh-left" @click="resetSelect('rsOrderNo')"/>
        </el-input>
      </el-col>
      <el-col :span="5" :offset="1"
              v-if="['2', '3'].includes(selectRefundOrder.type) && [2, 3, 4].includes(selectRefundOrder.status)">
        <el-input v-model="selectRefundOrder.refundNum" placeholder="退货运单号搜索" size="small">
          <el-button slot="append" icon="el-icon-search" @click="findAllOrderRefunds"/>
          <el-button slot="append" icon="el-icon-refresh-left" @click="resetSelect('rsRefundNum')"/>
        </el-input>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-input
          v-model="selectRefundOrder.nickName"
          placeholder="用户昵称关键词搜索"
          class="input-with-select"
          size="small"
        >
          <el-button slot="append" icon="el-icon-search" @click="findAllOrderRefunds"/>
          <el-button slot="append" icon="el-icon-refresh-left" @click="resetSelect('rsNickName')"/>
        </el-input>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-button type="success" size="small" @click="resetSelect(! showSelect)"
                   style="width: 100px; margin-right: 10px;">
          筛选&nbsp;<i class="el-icon-arrow-down" v-show="! showSelect"/><i class="el-icon-arrow-up" v-show="showSelect"/>
        </el-button>
        <transition name="showSelect">
          <transition-group v-show="showSelect">
            <el-button type="primary" size="small" @click="findAllOrderRefunds" key="0">确认</el-button>
            <el-button type="info" size="small" @click="resetSelect" key="1">重置</el-button>
          </transition-group>
        </transition>
      </el-col>
    </el-row>
    <transition name="showSelect">
      <div v-show="showSelect" style="background-color: #f2f9ff; padding: 10px 5%; margin: 10px 0; font-size: small;">
        <el-row>
          <el-col :span="8">
            退款金额：
            <el-input-number v-model="selectRefundOrder.refundManeys[0]" controls-position="right" size="mini"/>
            至
            <el-input-number v-model="selectRefundOrder.refundManeys[1]" controls-position="right" size="mini"/>
          </el-col>
          <el-col :span="8">
            订单金额：
            <el-input-number v-model="selectRefundOrder.amounts[0]" controls-position="right" size="mini"/>
            至
            <el-input-number v-model="selectRefundOrder.amounts[1]" controls-position="right" size="mini"/>
          </el-col>
          <el-col :span="8">
            减肥基金：
            <el-input-number v-model="selectRefundOrder.funds[0]" controls-position="right" size="mini"/>
            至
            <el-input-number v-model="selectRefundOrder.funds[1]" controls-position="right" size="mini"/>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-col :span="8">
            积分金额：
            <el-input-number v-model="selectRefundOrder.integralMoneys[0]" controls-position="right" size="mini"/>
            至
            <el-input-number v-model="selectRefundOrder.integralMoneys[1]" controls-position="right" size="mini"/>
          </el-col>
          <el-col :span="8">
            优惠金额：
            <el-input-number v-model="selectRefundOrder.coupons[0]" controls-position="right" size="mini"/>
            至
            <el-input-number v-model="selectRefundOrder.coupons[1]" controls-position="right" size="mini"/>
          </el-col>
          <el-col :span="8">
            支付方式：
            <el-select v-model="selectRefundOrder.payType" placeholder="请选择" size="mini" style="width: 54%;">
              <el-option label="余额支付" value="1"/>
              <el-option label="微信支付" value="2"/>
              <el-option label="支付宝支付" value="3"/>
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-col :span="8">申请退款：
            <el-date-picker size="mini" style="width: 60%;"
                            v-model="selectRefundOrder.inTimes"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
            />
          </el-col>
          <el-col :span="8">订单创建：
            <el-date-picker size="mini" style="width: 60%;"
                            v-model="selectRefundOrder.createDates"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
            />
          </el-col>
          <el-col :span="8">订单付款：
            <el-date-picker size="mini" style="width: 60%;"
                            v-model="selectRefundOrder.payDates"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
            />
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-col :span="8">订单发货：
            <el-date-picker size="mini" style="width: 60%;"
                            v-model="selectRefundOrder.sendDates"
                            :disabled="selectRefundOrder.type == 1"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
            />
          </el-col>
          <el-col :span="8">订单收货：
            <el-date-picker size="mini" style="width: 60%;"
                            v-model="selectRefundOrder.receiveDates"
                            :disabled="selectRefundOrder.type == 1"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
            />
          </el-col>
          <el-col :span="8">退款审核：
            <el-date-picker size="mini" style="width: 60%;"
                            v-model="selectRefundOrder.stayRefundTimes"
                            :disabled="selectRefundOrder.status == 0"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
            />
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-col :span="8">回收退货：
            <el-date-picker size="mini" style="width: 60%;"
                            v-model="selectRefundOrder.confirmReceivedTimes"
                            :disabled="selectRefundOrder.type % 2 == 1 || selectRefundOrder.status % 5 == 0"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
            />
          </el-col>
          <el-col :span="8">执行退款：
            <el-date-picker size="mini" style="width: 60%;"
                            v-model="selectRefundOrder.refundMiddleTimes"
                            :disabled="selectRefundOrder.status != 4"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
            />
          </el-col>
          <el-col :span="8">完成退款：
            <el-date-picker size="mini" style="width: 60%;"
                            v-model="selectRefundOrder.refundFinishTimes"
                            :disabled="selectRefundOrder.status != 4"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
            />
          </el-col>
        </el-row>
      </div>
    </transition>
    <el-table stripe v-if="defaultSort" v-loading="tableLoading"
              @sort-change="orderSortChange" @expand-change="findOrderById"
              :default-sort="defaultSort" :data="orderRefundTable"
              :header-cell-style="{backgroundColor: '#DCDFE6'}"
              :cell-style="{paddingTop: '7px', paddingBottom: 0}">
      <el-table-column type="index" fixed width="35"/>
      <el-table-column label="头像" fixed width="65" :key="Math.random().toString()">
        <template slot-scope="scope">
          <img :src="scope.row.shopingOrder.user.headUrl" v-if="scope.row.shopingOrder.user.headUrl" width="45"
               height="45"/>
          <img src="../container/images/maijiCat.png" v-if="! scope.row.shopingOrder.user.headUrl" width="45"
               height="45"/>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" fixed width="90"
                       :key="Math.random().toString()"
                       prop="shopingOrder.user.nickName"
                       :show-overflow-tooltip="true"/>
      <el-table-column label="订单编号" fixed width="120"
                       :key="Math.random().toString()"
                       prop="shopingOrder.orderNo"/>
      <el-table-column type="expand" fixed width="30">
        <template slot-scope="props">
          <el-table v-loading = "shopingCartsLoading"
                    :data="shopingCarts" :header-cell-style="{backgroundColor: '#f2f9ff'}"
                    :cell-style="{paddingTop: '7px', paddingBottom: 0, backgroundColor: '#f2f9ff'}">
            <el-table-column label="商品图" width="65">
              <template slot-scope="scope">
                <img :src="scope.row.goods.mainImage.url" width="45" height="45"/>
              </template>
            </el-table-column>
            <el-table-column label="商品名称" width="120"
                             prop="goods.name">
            </el-table-column>
            <el-table-column label="商品单价" width="90"
                             :formatter="(row) => row.goods.presentPrice + ' 元'">
            </el-table-column>
            <el-table-column label="购买数量" width="90"
                             :formatter="(row) => row.purchaseQuantity + ' 件'">
            </el-table-column>
            <el-table-column label="应付金款" width="105"
                             :formatter="(row) => row.presentPayable + ' 元'">
            </el-table-column>
            <el-table-column label="物流单重" width="90"
                             :formatter="(row) => row.goods.weight + ' 克'">
            </el-table-column>
            <el-table-column label="物流总重" width="90">
            </el-table-column>
            <el-table-column label="收货人" width="90" align="center"
                             :formatter="() => shopingOrder.shopingAddress.consignee">
            </el-table-column>
            <el-table-column label="收货电话" width="120"
                             :formatter="() => shopingOrder.shopingAddress.tel">
            </el-table-column>
            <el-table-column label="收货地址" width="180"
                             :formatter="() => shopingOrder.shopingAddress.areaInfo.province + shopingOrder.shopingAddress.areaInfo.city
                                                    + shopingOrder.shopingAddress.areaInfo.county + shopingOrder.shopingAddress.areaInfo.address">
            </el-table-column>
            <el-table-column label="买家留言" width="180"
                             :formatter="() => shopingOrder.remarks">
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" width="105"
                       prop="sor.in_time"
                       sortable="custom"
                       :formatter="(row) => dateFormatter(row.inTime)"/>
      <el-table-column label="审核时间" width="105" v-if="selectRefundOrder.status != 0"
                       prop="sor.stay_refund_time"
                       sortable="custom"
                       :formatter="(row) => dateFormatter(row.stayRefundTime)"/>
      <el-table-column label="退货运单号" width="120" v-if="selectRefundOrder.status != 0 && selectRefundOrder.type != 1"
                       :key="Math.random().toString()"
                       prop="refundNum"/>
      <el-table-column label="确认收退货" width="95" v-if="selectRefundOrder.status != 0 && selectRefundOrder.type != 1"
                       :key="Math.random().toString()">
        <template slot-scope="scope">
          <i class="el-icon-check" style="color: green;" v-if="scope.row.confirmReceived"/>
          <i class="el-icon-close" style="color: red;" v-if="! scope.row.confirmReceived"/>
        </template>
      </el-table-column>
      <el-table-column label="收退货时间" width="115" v-if="selectRefundOrder.status != 0 && selectRefundOrder.type != 1"
                       prop="sor.confirm_received_time"
                       sortable="custom"
                       :formatter="(row) => dateFormatter(row.confirmReceivedTime)"/>
      <el-table-column label="执行退款时间" width="130" v-if="selectRefundOrder.status == 4"
                       prop="sor.refund_middle_time"
                       sortable="custom"
                       class-name="paddingTime"
                       :formatter="(row) => dateFormatter(row.refundMiddleTime)"/>
      <el-table-column label="完成退款时间" width="130" v-if="selectRefundOrder.status == 4"
                       prop="sor.refund_finish_time"
                       sortable="custom"
                       class-name="paddingTime"
                       :formatter="(row) => dateFormatter(row.refundFinishTime)"/>
      <el-table-column label="拒绝原因" width="120" v-if="selectRefundOrder.status == 5"
                       :key="Math.random().toString()"
                       prop="refusalReason"
                       :show-overflow-tooltip="true"/>
      <el-table-column label="退款原因" width="120"
                       :key="Math.random().toString()"
                       prop="refundReason"
                       :show-overflow-tooltip="true"/>
      <el-table-column label="退款说明" width="120"
                       :key="Math.random().toString()"
                       prop="refundExplain"
                       :show-overflow-tooltip="true"/>
      <el-table-column label="退款金额" width="105" v-if="selectRefundOrder.status != 0"
                       prop="sor.refund_maney"
                       sortable="custom"
                       :formatter="(row) => row.refundManey + ' 元'"/>
      <el-table-column label="订单金额" width="105"
                       prop="so.amount"
                       sortable="custom"
                       :formatter="(row) => row.shopingOrder.amount + ' 元'"/>
      <el-table-column
        label="退回配送费"
        width="95"
        v-if="selectRefundOrder.status != 0"
        :key="Math.random().toString()"
      >
        <template slot-scope="scope">
          <i class="el-icon-check" style="color: green;" v-if="scope.row.returnDeliveryFee"/>
          <i class="el-icon-close" style="color: red;" v-if="! scope.row.returnDeliveryFee"/>
        </template>
      </el-table-column>
      <el-table-column
        label="退回减肥基金"
        width="105"
        v-if="selectRefundOrder.status != 0"
        :key="Math.random().toString()"
      >
        <template slot-scope="scope">
          <i class="el-icon-check" style="color: green;" v-if="scope.row.returnFund"/>
          <i class="el-icon-close" style="color: red;" v-if="! scope.row.returnFund"/>
        </template>
      </el-table-column>
      <el-table-column
        label="退回积分"
        width="80"
        v-if="selectRefundOrder.status != 0"
        :key="Math.random().toString()"
      >
        <template slot-scope="scope">
          <i class="el-icon-check" style="color: green;" v-if="scope.row.returnIntegral"/>
          <i class="el-icon-close" style="color: red;" v-if="! scope.row.returnIntegral"/>
        </template>
      </el-table-column>
      <el-table-column
        label="退回优惠券"
        width="95"
        v-if="selectRefundOrder.status != 0"
        :key="Math.random().toString()"
      >
        <template slot-scope="scope">
          <i class="el-icon-check" style="color: green;" v-if="scope.row.returnCoupon"/>
          <i class="el-icon-close" style="color: red;" v-if="! scope.row.returnCoupon"/>
        </template>
      </el-table-column>
      <el-table-column
        label="配送费"
        width="90"
        v-if="selectRefundOrder.type == 2"
        :key="Math.random().toString()"
        prop="so.delivery_fee"
        sortable="custom"
        :formatter="(row) => row.shopingOrder.deliveryFee + ' 元'"
      ></el-table-column>
      <el-table-column
        label="减肥基金"
        width="105"
        :key="Math.random().toString()"
        prop="so.fund"
        sortable="custom"
        :formatter="(row) => '-' + row.shopingOrder.fund + ' 元'"
      />
      <el-table-column
        label="优惠券"
        width="105"
        :key="Math.random().toString()"
        prop="so.coupon"
        sortable="custom"
        :formatter="(row) => '-' + row.shopingOrder.coupon + ' 元'"
      />
      <el-table-column
        label="使用积分"
        width="105"
        :key="Math.random().toString()"
        prop="so.integral"
        sortable="custom"
        :formatter="(row) => '-' + row.shopingOrder.integral + ' 分'"
      />
      <el-table-column
        label="积分减免"
        width="105"
        :key="Math.random().toString()"
        prop="so.integral_money"
        sortable="custom"
        :formatter="(row) => '-' + row.shopingOrder.integralMoney + ' 元'"
      />
      <el-table-column
        label="支付方式"
        width="105"
        :key="Math.random().toString()"
        prop="so.pay_type"
        sortable="custom"
        :formatter="(row) => row.shopingOrder.payType==1? '余额支付': row.shopingOrder.payType==2? '微信支付': row.shopingOrder.payType==3? '支付宝支付': '—'"
      />
      <el-table-column
        label="下单时间"
        width="105"
        :key="Math.random().toString()"
        prop="so.create_date"
        sortable="custom"
        :formatter="(row) => dateFormatter(row.shopingOrder.createDate)"
      />
      <el-table-column
        label="付款时间"
        width="105"
        :key="Math.random().toString()"
        prop="so.pay_date"
        sortable="custom"
        :formatter="(row) => dateFormatter(row.shopingOrder.payDate)"
      />
      <el-table-column
        label="发货时间"
        width="105"
        v-if="selectRefundOrder.type == 2"
        :key="Math.random().toString()"
        prop="so.send_date"
        sortable="custom"
        :formatter="(row) => dateFormatter(row.shopingOrder.sendDate)"
      />
      <el-table-column
        label="收货时间"
        width="105"
        v-if="selectRefundOrder.type == 2"
        :key="Math.random().toString()"
        prop="so.receive_date"
        sortable="custom"
        :formatter="(row) => dateFormatter(row.shopingOrder.receiveDate)"
      />
      <el-table-column label="订单状态" fixed="right" width="105"
        :key="Math.random().toString()" prop="so.status" sortable="custom"
        :formatter="(row) => orderStatusFormatter(row.shopingOrder.status)"/>
      <el-table-column label="操作" fixed="right" min-width="120" :key="Math.random().toString()">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="findOrderById(scope.row, true)"><i class="el-icon-s-check"/>{{orderRefundOperation()}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 10px">
      <el-col style="text-align: right;">
        <MJ_Pagination/>
      </el-col>
    </el-row>
    <el-dialog v-if="checkRefund" :visible.sync="checkRefundShow" width="70%">
      <span slot="title">{{elDialogTitle()}}</span>
      <el-row style="line-height: 32px; padding-left: 20px;">
          <span style="color: #909399; font-weight: bold;">退款金额(元)：</span>
          <el-input-number v-model="agreeApplayRefund.refundManey" size="small" :precision="2"
            :min="0" :max="refundManeyMax" :step="0.01" :disabled="selectRefundOrder.status % 5 != 0"/>
          <el-switch v-model="agreeApplayRefund.returnDeliveryFee" style="margin-left: 10px;"
             active-text="退回快递费" :disabled="selectRefundOrder.status % 5 != 0"/>
          <el-switch v-model="agreeApplayRefund.returnFund" style="margin-left: 10px;"
            active-text="退回减肥基金" :disabled="selectRefundOrder.status % 5 != 0"/>
          <el-switch v-model="agreeApplayRefund.returnCoupon" style="margin-left: 10px;"
            active-text="退回优惠卷" :disabled="selectRefundOrder.status % 5 != 0"/>
          <el-switch v-model="agreeApplayRefund.returnIntegral" style="margin-left: 10px;"
            active-text="退回积分" :disabled="selectRefundOrder.status % 5 != 0"/>
      </el-row>
      <el-divider>
        <span style="color: #909399; font-weight: bold;">退款申请详情</span>
      </el-divider>
      <el-row>
        <el-col :span="2" :offset="1">
          <el-row style="text-align: center;">{{checkRefund.shopingOrder.user.nickName}}</el-row>
          <el-row v-show="checkRefund.shopingOrder.user.headUrl">
            <el-image :src="checkRefund.shopingOrder.user.headUrl" width="45" height="45"/>
          </el-row>
          <el-row v-show="! checkRefund.shopingOrder.user.headUrl">
            <img src="../container/images/maijiCat.png" width="45" height="45"/>
          </el-row>
        </el-col>
        <el-col :span="14" :offset="1">
          <img
            src="../container/images/confirmReceived.png"
            v-if="checkRefund.type == 2"
            width="160"
            height="50"
            style="top: 20%; right: 50%; position: absolute; opacity: 0.5; transform: rotate(-45deg);"
          />
          <img
            src="../container/images/refundStatus1.png"
            v-if="checkRefund.status%5 != 0"
            width="160"
            height="50"
            style="top: 20%; right: 40%; position: absolute; opacity: 0.5; transform: rotate(-45deg);"
          />
          <img
            src="../container/images/refundStatus5.png"
            v-if="checkRefund.status == 5"
            width="160"
            height="50"
            style="top: 20%; right: 40%; position: absolute; opacity: 0.5; transform: rotate(-45deg);"
          />
          <img
            src="../container/images/refundType1.png"
            v-if="checkRefund.type == 1"
            width="160"
            height="50"
            style="top: 20%; right: 30%; position: absolute; opacity: 0.5; transform: rotate(-45deg);"
          />
          <img
            src="../container/images/refundType2.png"
            v-if="checkRefund.type == 2"
            width="160"
            height="50"
            style="top: 20%; right: 30%; position: absolute; opacity: 0.5; transform: rotate(-45deg);"
          />
          <el-row>
            <el-col :span="12">
              <span style="color: #909399;">订单编号：</span>
              {{checkRefund.shopingOrder.orderNo}}
            </el-col>
            <el-col :span="12">
              <span style="color: #909399;">申请时间：</span>
              {{dateFormatter(checkRefund.inTime)}}
            </el-col>
          </el-row>
          <el-row style="margin: 10px 0;" v-if="selectRefundOrder.status == 0">
            <span style="color: #909399;">退款原因：</span>
            {{checkRefund.refundReason}}
          </el-row>
          <el-row style="margin: 10px 0;" v-if="selectRefundOrder.status != 0">
            <el-col
              :span="12"
              style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
            >
              <span style="color: #909399;">退款原因：</span>
              <el-tooltip
                effect="light"
                :content="checkRefund.refundReason"
                placement="bottom-start"
              >
                <span>{{checkRefund.refundReason}}</span>
              </el-tooltip>
            </el-col>
            <el-col :span="12">
              <span style="color: #909399;">审核时间：</span>
              {{dateFormatter(checkRefund.stayRefundTime)}}
            </el-col>
          </el-row>
          <el-row v-if="selectRefundOrder.status == 0">退款说明：{{checkRefund.refundExplain}}</el-row>
          <el-row v-if="selectRefundOrder.status != 0">
            <el-col
              :span="12"
              style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
            >
              <span style="color: #909399;">退款说明：</span>
              <el-tooltip effect="light" placement="bottom-start">
                <div slot="content" style="width: 200px;">{{checkRefund.refundExplain}}</div>
                <span>{{checkRefund.refundExplain}}</span>
              </el-tooltip>
            </el-col>
            <el-col
              :span="12"
              style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
            >
              <span style="color: #909399;">退货运单号：</span>
              <el-tooltip effect="light" :content="checkRefund.refundNum" placement="bottom-start">
                <span>{{checkRefund.refundNum}}</span>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px;" v-if="selectRefundOrder.status == 5">
            <span style="color: #909399;">审核拒绝原因：</span>{{checkRefund.refusalReason}}
          </el-row>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-button
            type="success"
            size="small"
            @click="confirmReceived(checkRefund.uuId, checkRefund.shopingOrder.uuId)"
            v-if="selectRefundOrder.type == 3"
          >
            <i class="el-icon-s-check"/> 确认收货
          </el-button>
          <br v-if="selectRefundOrder.type == 3"/>
          <el-popover placement="bottom" trigger="click" width="150"  v-if="selectRefundOrder.status == 2 && selectRefundOrder.type != 3">
            <el-input size="mini" placeholder="请输入执行密码" v-model="executeRefund.executePwd"/>
            <el-button type="primary" size="mini" @click="executeRefundMethod(checkRefund.uuId)" style="width: 100%; margin-top: 10px;" plain>确定</el-button>
            <el-button type="success" size="small" slot="reference" icon="el-icon-s-check">执行退款</el-button>
          </el-popover>
          <br v-if="selectRefundOrder.status == 2 && selectRefundOrder.type != 3"/>
          <el-button
            type="success"
            size="small"
            @click="agreeApplyRefundM(2)"
            v-if="selectRefundOrder.status % 5 == 0 && selectRefundOrder.type == 1"
          >
            <i class="el-icon-check"/> 审核通过
          </el-button>
          <br v-if="selectRefundOrder.status % 5 == 0 && selectRefundOrder.type == 1"/>
          <el-button
            type="success"
            size="small"
            @click="agreeApplyRefundM(1)"
            v-if="selectRefundOrder.status % 5 == 0 && selectRefundOrder.type == 2"
          >
            <i class="el-icon-check"/> 审核通过
          </el-button>
          <br v-if="selectRefundOrder.status % 5 == 0 && selectRefundOrder.type == 2"/>
          <el-button
            type="danger"
            size="small"
            @click="agreeApplyRefundM(5)"
            v-if="selectRefundOrder.status % 5 == 0 && selectRefundOrder.type != 3"
            style="margin-top: 10px;"
          >
            <i class="el-icon-close"/> 审核拒绝
          </el-button>
        </el-col>
      </el-row>
      <el-divider>
        <span style="color: #909399; font-weight: bold;">退款订单详情</span>
      </el-divider>
      <el-table
        stripe
        max-height="425"
        :data="shopingCarts"
        :span-method="({rowIndex, columnIndex}) => objectSpanMethod(rowIndex, columnIndex, shopingCarts.length)"
        :header-cell-style="{backgroundColor: '#DCDFE6', fontSize: '12px'}"
        :cell-style="{paddingTop: '7px', paddingBottom: 0}"
      >
        <el-table-column label="商品" fixed width="65">
          <template slot-scope="scope">
            <img :src="scope.row.goods.mainImage.url" width="45" height="45"/>
          </template>
        </el-table-column>
        <el-table-column
          label="商品名称"
          fixed
          width="90"
          show-overflow-tooltip
          :formatter="(row) => row.goods.name"
        />
        <el-table-column label="数量" width="50" prop="purchaseQuantity"/>
        <el-table-column label="商品总价" width="70" :formatter="(row) => row.presentPayable + ' 元'"/>
        <el-table-column label="物流总重" width="70" :formatter="(row) => row.weightTotal + ' 克'"/>
        <el-table-column label="快递" width="60" :formatter="() => shopingOrder.delivery"/>
        <el-table-column label="快递费" width="70" :formatter="() => shopingOrder.deliveryFee + ' 元'"/>
        <el-table-column label="减肥基金" width="70" :formatter="() => '-' + shopingOrder.fund + ' 元'"/>
        <el-table-column
          label="优惠券"
          width="70"
          :formatter="() => '-' + shopingOrder.coupon + ' 元'"
        />
        <el-table-column
          label="积分减免"
          width="70"
          :formatter="() => '-' + shopingOrder.integralMoney + ' 元'"
        />
        <el-table-column label="订单金额" width="90" :formatter="() => shopingOrder.amount + ' 元'"/>
        <el-table-column
          label="支付方式"
          min-width="80"
          :formatter="() => shopingOrder.payType==1? '余额支付': shopingOrder.payType==2? '微信支付':
                                                shopingOrder.payType==3? '支付宝支付': '砍价免费拿'"
        />
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
        <el-step
          title="收货地址"
          :description="shopingOrder && shopingOrder.shopingAddress.areaInfo.province + shopingOrder.shopingAddress.areaInfo.city +
                                shopingOrder.shopingAddress.areaInfo.county + shopingOrder.shopingAddress.areaInfo.address"
          icon="el-icon-user"
        />
      </el-steps>
    </el-dialog>
  </div>
</template>

<script>
  import {
    findAllOrderRefundsAjax,
    findOrderByIdAjax,
    agreeApplyRefundAjax,
    confirmReceivedAjax,
    executeRefundAjax
  } from '../../api'
  import {mapState, mapActions} from 'vuex'
  import {dateFormatter} from '../../util'
  const MJ_Pagination = () => import('../common/MJ_Pagination.vue')

  export default {
    components: {
      MJ_Pagination
    },

    data () {
      return {
        defaultSort: {
          prop: 'sor.in_time',
          order: 'descending'
        },
        orderRefundTable: [],
        tableLoading: false,
        selectRefundOrder: {
          nickName: '',
          orderNo: '',
          refundNum: '',
          refundManeys: [],
          amounts: [],
          funds: [],
          integralMoneys: [],
          coupons: [],
          inTimes: null,
          stayRefundTimes: null,
          confirmReceivedTimes: null,
          refundMiddleTimes: null,
          refundFinishTimes: null,
          createDates: null,
          payDates: null,
          sendDates: null,
          receiveDates: null,
          orderStatus: null,
          payType: null,
          status: 0,
          type: '1',
        },
        showSelect: false,
        checkRefundShow: false,
        checkRefund: null,
        shopingOrder: null,
        shopingCarts: [],
        shopingCartsLoading: false,
        refundManeyMax: 0,
        agreeApplayRefund: {
          uuId: null,
          orderId: null,
          refundManey: 0,
          returnDeliveryFee: true,
          returnFund: true,
          returnIntegral: true,
          returnCoupon: true,
        },
        elDialogLoading: false,
        executeRefund: {
          uuId: '',
          userId: '',
          executePwd: ''
        }
      }
    },

    computed: {
      ...mapState(['loading', 'pickerOptions', 'metaData', 'maijiUser']),
      ...mapState('order', [
        'refundType1Status0Count',
        'refundType1Status2Count',
        'refundType2Status0Count',
        'refundType2Status1Count',
        'refundType2Status2Count'
      ]),

      pageOne () {
        return {
          page: 1,
          size: this.metaData.size
        }
      }
    },

    watch: {
      $route: function () {
        this.loadingOpen()
        this.defaultSort = false
        this.$nextTick(() => {
          if (this.$route.params.apply) {
            this.selectRefundOrder.status = 0
            this.defaultSort = {
              prop: 'sor.in_time',
              order: 'descending'
            }
          }
          if (this.$route.params.execute) {
            this.selectRefundOrder.status = 2
            this.defaultSort = {
              prop: 'sor.stay_refund_time',
              order: 'descending'
            }
          }
          if (this.$route.params.done) {
            this.selectRefundOrder.status = 4
            this.defaultSort = {
              prop: 'sor.refund_finish_time',
              order: 'descending'
            }
          }
          if (this.$route.params.refuse) {
            this.selectRefundOrder.status = 5
            this.defaultSort = {
              prop: 'sor.stay_refund_time',
              order: 'descending'
            }
          }
          this.orderStatusCountChange()
          this.orderRefundsTypeCountChange()
          this.findAllOrderRefunds({page: 1, size: this.metaData.size})
        })
      },

      'agreeApplayRefund.returnDeliveryFee': {
        deep: true,
        handler: function (value) {
          if (value) {
            this.agreeApplayRefund.refundManey += this.shopingOrder.deliveryFee
          } else {
            this.agreeApplayRefund.refundManey -= this.shopingOrder.deliveryFee
          }
        }
      }
    },

    mounted () {
      this.loadingOpen()
      if (this.$route.params.apply) this.selectRefundOrder.status = 0
      if (this.$route.params.execute) this.selectRefundOrder.status = 2
      if (this.$route.params.done) this.selectRefundOrder.status = 4
      if (this.$route.params.refuse) this.selectRefundOrder.status = 5
      this.orderStatusCountChange()
      this.orderRefundsTypeCountChange()
      this.findAllOrderRefunds({page: 1, size: this.metaData.size})
      PubSub.subscribe('updateMetaData', () => this.findAllOrderRefunds())
    },

    methods: {
      ...mapActions(['loadingOpen', 'updateMetaData']),
      ...mapActions('order', [
        'orderRefundsTypeCountChange',
        'orderStatusCountChange'
      ]),
      dateFormatter, // 日期格式化

      // 执行退款
      executeRefundMethod (orderRefundId) {
        let content = ''
        let tip = ''
        if (this.selectRefundOrder.type == 1) {
          content = '确认执行退款？请确认退款信息准确无误！'
          tip = '仅退款：执行退款'
        }
        if (this.selectRefundOrder.type == 2) {
          content = '确认执行退款？请确认已收到退货并确认其它退款信息准确无误！'
          tip = '退款退款：执行退款'
        }
        this.$confirm(content, tip, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'confirmER',
          type: 'warning'
        }).then(async () => {
          this.loadingOpen()
          this.executeRefund.uuId = orderRefundId
          this.executeRefund.userId = this.maijiUser.uuId
          const result = await executeRefundAjax(this.executeRefund)
          if (result.status != 'SUCCESS') {
            this.loading.close()
            if (result.status == 'EXECUTEPWDERROR')
              return this.$message.error(`执行密码错误，请确认后重试`)
            return this.$message.error(`执行退款失败，请稍后重试`)
          }
          this.checkRefundShow = false
          this.orderStatusCountChange()
          this.orderRefundsTypeCountChange()
          this.findAllOrderRefunds()
          this.$message.success(`执行退款成功！`)
        })
      },

      // 退货退款确认收货
      confirmReceived (uuId, orderId) {
        this.$confirm(
          `确认收货？请确认订单数据和退货退款申请数据和收货数据一致！`,
          '退货退款：确认收货',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'confirmER',
            type: 'warning'
          }
        ).then(async () => {
          this.loadingOpen()
          const result = await confirmReceivedAjax({uuId, orderId})
          if (result.status != 'SUCCESS') {
            this.$message.error(`确认收货失败，请稍后重试！`)
          }
          this.checkRefundShow = false
          this.orderStatusCountChange()
          this.orderRefundsTypeCountChange()
          this.findAllOrderRefunds()
          this.$message.success(`确认收货成功！`)
        })
      },

      // 不同场景下的操作按钮
      orderRefundOperation () {
        if (this.selectRefundOrder.type == 3) return '确认收货'
        if (this.selectRefundOrder.status == 4) return '查看详情'
        if (this.selectRefundOrder.status == 5) return '重新审核'
        return '审核'
      },

      agreeApplyRefundM (status) {
        if (status == 5) {
          this.$prompt('确认审核拒绝？', '审核退款申请', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /\S/,
            inputErrorMessage: '请输入内容',
            inputPlaceholder: '请输入拒绝原因'
          }).then(async ({value}) => {
            this.loadingOpen()
            this.agreeApplayRefund.refusalReason = value
            this.agreeApplayRefund.status = status
            const result = await agreeApplyRefundAjax(this.agreeApplayRefund)
            if (result.status != 'SUCCESS') {
              return this.$message.error(`退款申请审核失败，请稍后重试！`)
            }
            this.checkRefundShow = false
            this.orderStatusCountChange()
            this.orderRefundsTypeCountChange()
            this.findAllOrderRefunds()
            this.$message.success(`退款申请审核成功！`)
          })
        } else {
          this.$confirm(`确认审核通过？`, '审核退款申请', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'confirmAAR',
            type: 'warning'
          }).then(async () => {
            this.loadingOpen()
            this.agreeApplayRefund.status = status
            const result = await agreeApplyRefundAjax(this.agreeApplayRefund)
            if (result.status != 'SUCCESS') {
              return this.$message.error(`退款申请审核失败，请稍后重试！`)
            }
            this.checkRefundShow = false
            this.orderStatusCountChange()
            this.orderRefundsTypeCountChange()
            this.findAllOrderRefunds()
            this.$message.success(`退款申请审核成功！`)
          })
        }
      },

      // 对话框标题
      elDialogTitle () {
        let title = ''
        switch (this.selectRefundOrder.status) {
          case 0:
            title += '审核退款申请：'
            break
          case 1:
            title += '退款申请：确认收货'
            break
          case 2:
            title += '执行退款：'
            break
          case 4:
            title += '退款详情：'
            break
          case 5:
            title += '退款申请详情：'
            break
        }
        switch (this.selectRefundOrder.type) {
          case '1':
            title += '仅退款'
            break
          case '2':
            title += '退货退款'
            break
          case '3':
            title += '确认收货'
            break
        }
        return title
      },

      // 订单状态
      orderStatusFormatter (status) {
        switch (status) {
          case 0:
            return '待付款'
          case 1:
            return '待发货'
          case 2:
            return '待收货'
          case 3:
            return '已收货'
          case 4:
            return '已取消'
        }
      },

      // 审核：获取订单详情
      async findOrderById (row, show) {
        this.elDialogLoading = true
        this.shopingCartsLoading = true
        this.checkRefundShow = typeof show == 'boolean'
        this.checkRefund = row
        this.agreeApplayRefund.uuId = row.uuId
        this.agreeApplayRefund.orderId = row.orderId
        const result = await findOrderByIdAjax(row.orderId)
        if (result.status == 'SUCCESS') {
          this.shopingOrder = result.data
          this.shopingCarts = result.data.shopingCarts
          this.agreeApplayRefund.refundManey = this.shopingOrder.amount
          if (this.shopingOrder.shareOrder) this.agreeApplayRefund.refundManey -= this.shopingOrder.shareOrderMoney
          this.refundManeyMax = this.agreeApplayRefund.refundManey
          this.elDialogLoading = false
          this.shopingCartsLoading = false
        }
      },

      // 订单购物商品列表合并行
      objectSpanMethod (rowIndex, columnIndex, span) {
        if ([5, 6, 7, 8, 9, 10, 11].includes(columnIndex)) {
          if (rowIndex == 0) {
            return [span, 1]
          } else {
            return [0, 0]
          }
        }
      },

      // 表格排序
      orderSortChange ({prop, order}) {
        this.selectRefundOrder.orderBy = prop
        this.selectRefundOrder.orderType = order == 'ascending' ? 'asc' : 'desc'
        this.findAllOrderRefunds({page: 1, size: this.metaData.size})
      },

      // 获取表格数据
      async findAllOrderRefunds (metaData) {
        this.tableLoading = true
        let data = JSON.parse(JSON.stringify(this.selectRefundOrder))
        if (this.selectRefundOrder.type == '3') Object.assign(data, {status: 1, type: 2})
        const result = await findAllOrderRefundsAjax(data, metaData || this.metaData)
        if (result.status == 'SUCCESS') {
          this.orderRefundTable = result.data
          this.updateMetaData({metaData: result.resMetaData, init: true})
          this.tableLoading = false
        }
        this.loading.close()
      },

      // 重置筛选
      resetSelect (showSelect) {
        if (showSelect == 'rsOrderNo' || showSelect == 'all') {
          this.selectRefundOrder.orderNo = ''
          if (showSelect == 'rsOrderNo') return this.findAllOrderRefunds()
        }
        if (showSelect == 'rsNickName' || showSelect == 'all') {
          this.selectRefundOrder.nickName = ''
          if (showSelect == 'rsNickName') return this.findAllOrderRefunds()
        }
        if (showSelect == 'rsRefundNum') {
          this.selectRefundOrder.refundNum = ''
          return this.findAllOrderRefunds()
        }
        if (showSelect == 'all') {
          this.showSelect = false
          this.orderStatusCountChange()
          this.orderRefundsTypeCountChange()
        }
        if ((typeof showSelect) == 'boolean') this.showSelect = showSelect
        this.selectRefundOrder = Object.assign(this.selectRefundOrder, {
          amounts: [],
          funds: [],
          integralMoneys: [],
          coupons: [],
          inTimes: null,
          createDates: null,
          payDates: null,
          sendDates: null,
          receiveDates: null,
          orderStatus: null,
          payType: null
        })
        this.findAllOrderRefunds({page: 1, size: this.metaData.size})
      },
    },

    beforeDestroy () {
      PubSub.unsubscribe('updateMetaData')
    }
  }
</script>

<style>
  .el-table__body .paddingTime .cell {
    padding-right: 35px;
  }

  .confirmAAR {
    width: 18%;
  }

  .confirmER {
    width: 23%;
  }

  .confirmER .el-message-box__message {
    color: red;
  }

  .el-message-box__header {
    background-color: #f2f9ff;
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

  /*指定出现过渡样式*/
  .showSelect-enter-active {
    transition: all 1s;
  }

  /*指定离开过渡样式*/
  .showSelect-leave-active {
    transition: all 0.5s;
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

  .el-tabs .el-badge__content.is-fixed {
    position: absolute !important;
    top: 9px !important;
    right: 2px !important;
    transform: translateY(-50%) translateX(100%) !important;
  }
</style>
