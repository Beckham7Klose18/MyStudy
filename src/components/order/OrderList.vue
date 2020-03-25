<template>
  <div class="orderList">
    <el-tabs v-model="selectOrder.status" type="card">
        <el-tab-pane label="全部" name="-1"/>
        <el-tab-pane label="代付款" name="0"/>
        <el-tab-pane label="待发货" name="1">
            <span slot="label" v-if="orderStatus1Count != 0"><el-badge :value="orderStatus1Count">待发货</el-badge></span>
            <span slot="label" v-if="orderStatus1Count == 0">待发货</span>
        </el-tab-pane>
        <el-tab-pane label="待收货" name="2"/>
        <el-tab-pane label="已收货" name="3"/>
        <el-tab-pane label="已评价" name="5"/>
        <el-tab-pane label="已完成" name="6"/>
        <el-tab-pane label="已取消" name="4"/>
        <el-tab-pane label="已退款" name="7"/>
    </el-tabs>
    <el-row style="margin-bottom: 10px;">
      <el-button type="success" size="small" @click="resetSelect('all')">
        立即刷新&nbsp;<i class="el-icon-refresh"/></el-button>
      <el-input v-model="selectOrder.nickName" placeholder="用户名关键词搜索" size="small" style="width: 17%;">
        <el-button slot="append" icon="el-icon-search" @click="findAllOrders"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="resetSelect('rsNickName')"/>
      </el-input>
      <el-input v-model="selectOrder.orderNo" placeholder="订单编号关键词搜索" size="small" style="width: 17%;">
        <el-button slot="append" icon="el-icon-search" @click="findAllOrders"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="resetSelect('rsOrderNo')"/>
      </el-input>
      <el-input v-model="selectOrder.tel" placeholder="收货电话关键词搜索" size="small" style="width: 17%;">
        <el-button slot="append" icon="el-icon-search" @click="findAllOrders"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="resetSelect('rsTel')"/>
      </el-input>
      <el-input v-model="selectOrder.expressNo" placeholder="运单编号关键词搜索" size="small" style="width: 17%;" v-if="! autoSetShow">
        <el-button slot="append" icon="el-icon-search" @click="findAllPrintInfos"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="resetSelect('rsexpressNo')"/>
      </el-input>
      <el-button type="success" size="small" @click="resetSelect(! showSelect)" v-if="! autoSetShow">
        筛选&nbsp;<i class="el-icon-arrow-down" v-show="! showSelect"/><i class="el-icon-arrow-up" v-show="showSelect"/></el-button>
      <transition name="showSelect">
        <transition-group v-show="showSelect">
          <el-button type="primary" size="small" @click="findAllOrders" key="0">确认</el-button>
          <el-button type="info" size="small" @click="resetSelect" key="1">重置</el-button>
        </transition-group>
      </transition>
      <el-button type="text" @click="autoSetShow = true" v-if="! autoSetShow && selectOrder.status == '2' && !showSelect"
                 style="margin-left: 10px;" >自动收货天数：{{autoSet.auto_receive}} 天 <i class="el-icon-edit"/></el-button>
      <el-input v-model="autoSet.auto_receive" size="small" style="width: 17%; margin-left: 10px;" v-show="autoSetShow">
        <template slot="prepend">自动收货天数</template>
        <el-button slot="append" @click="findAndSetOrderAutoSet()">设置</el-button>
        <el-button slot="append" @click="autoSetShow = false">取消</el-button>
      </el-input>
    </el-row>
    <transition name="showSelect">
        <div v-show="showSelect" style="background-color: #f2f9ff; padding: 10px 5%; margin: 10px 0; font-size: small;">
            <el-row>
                <el-col style="width: 33%;">
                    订单金额：
                    <el-input-number v-model="selectOrder.amounts[0]" controls-position="right" size="mini"/>
                    至
                    <el-input-number v-model="selectOrder.amounts[1]" controls-position="right" size="mini"/>
                </el-col>
                <el-col style="width: 33%;">
                    减肥基金：
                    <el-input-number v-model="selectOrder.funds[0]" controls-position="right" size="mini"/>
                    至
                    <el-input-number v-model="selectOrder.funds[1]" controls-position="right" size="mini"/>
                </el-col>
                <el-col style="width: 33%;">
                    优惠金额：
                    <el-input-number v-model="selectOrder.coupons[0]" controls-position="right" size="mini"/>
                    至
                    <el-input-number v-model="selectOrder.coupons[1]" controls-position="right" size="mini"/>
                </el-col>
            </el-row>
            <el-row style="margin: 10px 0;">
                <el-col style="width: 33%;">
                    积分金额：
                    <el-input-number v-model="selectOrder.integralMoneys[0]" controls-position="right" size="mini"/>
                    至
                    <el-input-number v-model="selectOrder.integralMoneys[1]" controls-position="right" size="mini"/>
                </el-col>
                <el-col style="width: 33%;">
                    配送费用：
                    <el-input-number v-model="selectOrder.deliveryFees[0]" controls-position="right" size="mini"/>
                    至
                    <el-input-number v-model="selectOrder.deliveryFees[1]" controls-position="right" size="mini"/>
                </el-col>
                <el-col style="width: 33%;">
                    配送方式：
                    <el-select v-model="selectOrder.delivery" size="small" placeholder="请选择" style="width: 56%;">
                        <el-option label="顺丰" value="顺丰"/>
                        <el-option label="申通" value="申通"/>
                    </el-select>
                </el-col>
            </el-row>
            <el-row style="margin: 10px 0;">
                <el-col style="width: 33%;">创建时间：
                    <el-date-picker size="mini" style="width: 60%;"
                            type="daterange"
                            align="right"
                            v-model="selectOrder.createDates"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"/>
                </el-col>
                <el-col style="width: 33%;">付款时间：
                    <el-date-picker size="mini" style="width: 60%;"
                            type="daterange"
                            align="right"
                            v-model="selectOrder.payDates"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"/>
                </el-col>
                <el-col style="width: 33%;">支付方式：
                    <el-select v-model="selectOrder.payType" size="small" placeholder="请选择" style="width: 56%;">
                        <el-option label="余额支付" value="1"/>
                        <el-option label="微信支付" value="2"/>
                        <el-option label="支付宝支付" value="3"/>
                    </el-select>
                </el-col>
            </el-row>
            <el-row>
                <el-col style="width: 33%;">发货时间：
                    <el-date-picker size="mini" style="width: 60%;"
                            type="daterange"
                            align="right"
                            v-model="selectOrder.sendDates"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"/>
                </el-col>
                <el-col style="width: 33%;">收货时间：
                    <el-date-picker size="mini" style="width: 60%;"
                            type="daterange"
                            align="right"
                            v-model="selectOrder.receiveDates"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"/>
                </el-col>
                <el-col style="width: 33%;">取消时间：
                    <el-date-picker size="mini" style="width: 60%;"
                            type="daterange"
                            align="right"
                            v-model="selectOrder.cancelDates"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"/>
                </el-col>
            </el-row>
        </div>
    </transition>
    <el-table stripe v-if="defaultSort" v-loading="tableLoading"
        @sort-change="orderSortChange" :data="orderTable" :default-sort="defaultSort"
        :header-cell-style="{backgroundColor: '#DCDFE6'}" :cell-style="{paddingTop: '7px', paddingBottom: '5px'}">
      <el-table-column type="index" fixed width="40" align="center"/>
      <el-table-column type="expand" fixed width="35">
          <template slot-scope="props">
              <el-table :data="props.row.shopingCarts"
                        :header-cell-style="{backgroundColor: '#f2f9ff'}"
                        :cell-style="{paddingTop: '7px', paddingBottom: 0, backgroundColor: '#f2f9ff'}">
                  <el-table-column label="商品图" fixed width="65">
                      <template slot-scope="scope">
                          <img :src="scope.row.goods.mainImage.url" width="45" height="45"/>
                      </template>
                  </el-table-column>
                  <el-table-column label="商品名称" fixed min-width="120"
                                   prop="goods.name">
                  </el-table-column>
                  <el-table-column label="商品单价" fixed width="90"
                                   :formatter="(row) => row.goods.presentPrice + ' 元'">
                  </el-table-column>
                  <el-table-column label="购买数量" fixed width="90"
                                   :formatter="(row) => row.purchaseQuantity + ' 件'">
                  </el-table-column>
                  <el-table-column label="应付金款" fixed width="105"
                                   :formatter="(row) => row.presentPayable + ' 元'">
                  </el-table-column>
                  <el-table-column label="物流单重" fixed width="90"
                                   :formatter="(row) => row.goods.weight + ' 克'">
                  </el-table-column>
                  <el-table-column label="物流总重" fixed width="90"
                                   :formatter="(row) => row.weightTotal + ' 克'">
                  </el-table-column>
              </el-table>
          </template>
      </el-table-column>
      <el-table-column label="订单编号" width="190" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-row><span>{{scope.row.orderNo}}</span></el-row>
            <el-row>
              <el-col :span="7">
                <img :src="scope.row.user.headUrl" v-show="scope.row.user.headUrl" width="45" height="45"/>
                <img src="../container/images/maijiCat.png" v-show="! scope.row.user.headUrl" width="45" height="45"/>
              </el-col>
              <el-col :span="17">
                <el-row style="line-height: 20px; margin-bottom: 3px;" v-if="selectOrder.status == 1 && scope.row.remindSend">
                  <el-tag type="danger" size="mini">提醒发货</el-tag></el-row>
                <el-row :style="{lineHeight: selectOrder.status == 1 && scope.row.remindSend && '20px' || '45px'}"
                  style="padding-left: 5px;" class="mjn">{{scope.row.user.nickName? scope.row.user.nickName: '麦吉用户'}}</el-row>
              </el-col>
            </el-row>
          </template>
      </el-table-column>
      <el-table-column label="订单金额" :width="selectOrder.status > 1 ? 125 : 140" align="center"
                       prop="amount" sortable="custom">
        <template slot-scope="scope">
          <el-tag type="danger" size="mini" v-if="selectOrder.status != 0 && scope.row.deliveryFee > 0">
            {{'配送费 +' + scope.row.deliveryFee + ' 元'}}</el-tag><br v-if="scope.row.deliveryFee > 0"/>
          <el-tag type="danger" size="mini" v-if="selectOrder.status == 0 && scope.row.deliveryFee > 0">
            <el-popover trigger="click" width="150" v-if="selectOrder.status == 0 && scope.row.amount > 0" popper-class="myPopper">
              <el-input size="mini" v-model="editOrder.deliveryFeeNew" placeholder="请输入配送费" style="width: 100%;"/>
              <el-button type="primary" size="mini" @click="editOrderMethod(scope.row)" style="width: 100%; margin-top: 10px;" plain>确定</el-button>
              <span slot="reference" style="color: #409EFF; cursor: pointer; font-weight: bold;">配送费：{{scope.row.deliveryFee}} 元 <i class="el-icon-edit"/></span>
            </el-popover></el-tag><br v-if="scope.row.deliveryFee > 0"/>
          <el-tag type="success" size="mini" v-if="scope.row.fund > 0">{{'减肥基金 -' + scope.row.fund + ' 元'}}</el-tag><br v-if="scope.row.fund > 0"/>
          <el-tag type="success" size="mini" v-if="scope.row.coupon > 0">{{'优惠券 -' + scope.row.coupon + ' 元'}}</el-tag><br v-if="scope.row.coupon > 0"/>
          <span v-if="selectOrder.status != 0 && scope.row.amount > 0" style="color: green; font-weight: bold;">{{scope.row.amount}} 元</span>
          <el-popover trigger="click" width="150" v-if="selectOrder.status == 0 && scope.row.amount > 0" popper-class="myPopper">
            <el-input size="mini" v-model="editOrder.amountNew" placeholder="请输入订单金额" style="width: 100%;"/>
            <el-button type="primary" size="mini" @click="editOrderMethod(scope.row)" style="width: 100%; margin-top: 10px;" plain>确定</el-button>
            <span slot="reference" style="color: #409EFF; cursor: pointer; font-weight: bold;">{{scope.row.amount}} 元 <i class="el-icon-edit"/></span>
          </el-popover>
          <el-tag type="danger" size="mini" v-if="scope.row.deliveryFee == 0">包邮</el-tag><br/>
          <el-tag :type="payTypeFormatter(scope.row.payType).type" size="mini">{{payTypeFormatter(scope.row.payType).name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="订单时间" width="220" :align="['0', '1'].includes(selectOrder.status) && 'center' || 'left'">
        <template slot-scope="scope">
          <span style="color: gray;" v-if="['0', '1'].includes(selectOrder.status)">{{scope.row.delivery}}</span>
          <el-tag size="mini" v-if="scope.row.createDate">{{'创建时间：' + dateFormatter(scope.row.createDate)}}</el-tag>
          <el-tag type="success" size="mini" v-if="scope.row.payDate">{{'支付时间：' + dateFormatter(scope.row.payDate)}}</el-tag>
          <el-tag size="mini" v-if="scope.row.printDate">{{'打印时间：' + dateFormatter(scope.row.printDate)}}</el-tag>
          <el-tag :type="['2'].includes(selectOrder.status) && 'danger' || 'success'" size="mini" v-if="scope.row.sendDate"
            :style="{fontWeight: ['2'].includes(selectOrder.status) && 'bold'}">{{'发货时间：' + dateFormatter(scope.row.sendDate)}}</el-tag>
          <el-tag size="mini" v-if="scope.row.receiveDate">{{'收货时间：' + dateFormatter(scope.row.receiveDate)}}</el-tag>
          <el-tag type="success" size="mini" v-if="scope.row.doneDate">{{'完成时间：' + dateFormatter(scope.row.doneDate)}}</el-tag>
          <el-tag type="danger" size="mini" v-if="scope.row.refundStatus != -1 && scope.row.refundDate">{{'申请退款：' + dateFormatter(scope.row.refundDate)}}</el-tag>
          <el-tag type="info" size="mini" v-if="scope.row.cancelDate">{{'取消时间：' + dateFormatter(scope.row.cancelDate)}}</el-tag>
          <el-tag type="info" size="mini" v-if="scope.row.cancelReason">{{'取消原因：' + scope.row.cancelReason}}</el-tag>
          <el-tag :type="orderStatusFormatter(scope.row).type" size="mini" v-if="['0', '1'].includes(selectOrder.status)">{{orderStatusFormatter(scope.row).statusName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" width="105" align="center" v-if="! ['0', '1'].includes(selectOrder.status)"
                       prop="status" sortable="custom">
        <template slot-scope="scope">
          <span style="color: gray;">{{scope.row.delivery}}</span><br/>
          <el-tag :type="orderStatusFormatter(scope.row).type" size="mini">{{orderStatusFormatter(scope.row).statusName}}</el-tag><br/>
          <span v-if="scope.row.status > 1 && scope.row.status !=4" style="color: #409EFF; cursor: pointer;" @click="showLogisticsM(scope.row.uuId)">查看物流</span>
          </template>
      </el-table-column>
      <el-table-column label="收货人/电话/地址/运单编号" min-width="250">
        <template slot-scope="scope">
          <span v-if="! ['0', '1'].includes(selectOrder.status)">{{scope.row.shopingAddress.consignee}}</span>
          <el-popover placement="bottom" trigger="click" width="150" v-if="['0', '1'].includes(selectOrder.status)" popper-class="myPopper">
            <el-input size="mini" v-model="editOrder.consigneeNew" placeholder="请输入收货人" style="width: 100%;"/>
            <el-button @click="editOrderMethod(scope.row, {shopingAddressId: scope.row.shopingAddress.uuId})"
                       type="primary" size="mini" style="width: 100%; margin-top: 10px;" plain>确定</el-button>
            <span slot="reference" style="color: #409EFF; cursor: pointer;">{{scope.row.shopingAddress.consignee}} <i class="el-icon-edit"/></span>
          </el-popover> &nbsp;
          <span v-if="! ['0', '1'].includes(selectOrder.status)">{{scope.row.shopingAddress.tel}}</span>
          <el-popover placement="bottom" trigger="click" width="150" v-if="['0', '1'].includes(selectOrder.status)" popper-class="myPopper">
            <el-input size="mini" v-model="editOrder.telNew" placeholder="请输入收货电话" style="width: 100%;"/>
            <el-button @click="editOrderMethod(scope.row, {shopingAddressId: scope.row.shopingAddress.uuId})"
                       type="primary" size="mini" style="width: 100%; margin-top: 10px;" plain>确定</el-button>
            <span slot="reference" style="color: #409EFF; cursor: pointer;">{{scope.row.shopingAddress.tel}} <i class="el-icon-edit"/></span>
          </el-popover><br/>
          <span v-if="! ['0', '1'].includes(selectOrder.status)">{{dealAdress(scope.row.shopingAddress.areaInfo)}}</span>
          <el-popover placement="bottom" trigger="click" width="250" v-if="['0', '1'].includes(selectOrder.status)" popper-class="myPopper">
            <el-input size="mini" v-model="editOrder.province" placeholder="请输入收货省/市" style="width: 100%;">
              <template slot="prepend">&nbsp; 省 / 市 </template>
            </el-input>
            <el-input size="mini" v-model="editOrder.city" placeholder="请输入收货市/区" style="width: 100%; margin: 10px 0;">
              <template slot="prepend">&nbsp; 市 / 区 </template>
            </el-input>
            <el-input size="mini" v-model="editOrder.county" placeholder="请输入收货县/市" style="width: 100%;">
              <template slot="prepend">&nbsp; 县 / 市 </template>
            </el-input>
            <el-input size="mini" v-model="editOrder.address" placeholder="请输入收货详细地址" style="width: 100%; margin: 10px 0;">
              <template slot="prepend">详细地址</template>
            </el-input>
            <el-input type="textarea" :value="shopingAddress" style="width: 100%;" disabled>
              <template slot="prepend">收货地址</template>
            </el-input>
            <el-button @click="editOrderMethod(scope.row, {areaInfoId: scope.row.shopingAddress.areaInfo.uuId})"
                       type="primary" size="mini" style="width: 100%; margin-top: 10px;" plain>确定</el-button>
            <span slot="reference" style="color: #409EFF; cursor: pointer;" @click="editShopingAddress(scope.row.shopingAddress.areaInfo)">
                                  {{dealAdress(scope.row.shopingAddress.areaInfo)}} <i class="el-icon-edit"/></span>
          </el-popover>
          <el-row v-if="scope.row.expressNos"><span style="color: gray;">运单编号：</span>{{scope.row.expressNos}}</el-row>
        </template>
      </el-table-column>
      <el-table-column label="买家/卖家留言" fixed="right" min-width="200" v-if="['0', '1'].includes(selectOrder.status)">
        <template slot-scope="scope">
          <span v-if="scope.row.remarks"><span style="color: gray">买家：</span>{{scope.row.remarks}}<br/></span>
          <el-popover placement="bottom" trigger="click" width="200" popper-class="myPopper">
            <el-input type="textarea" size="mini" v-model="scope.row.sellerRemarks" placeholder="请输入卖家留言" style="width: 100%;"/>
            <el-button type="primary" size="mini" @click="editOrderMethod(scope.row)" style="width: 100%; margin-top: 10px;" plain >确定</el-button>
            <span slot="reference" style="color: #409EFF; cursor: pointer;"><span style="color: gray">卖家：</span>{{scope.row.sellerRemarks}} <i class="el-icon-edit"/></span>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-row v-show="orderTable && orderTable.length > 0" style="margin-top: 10px; text-align: right;">
      <MJ_Pagination/>
    </el-row>
    <el-dialog title="实时物流" :visible.sync="showLogistics">
        <el-tabs v-model="expressNo" @tab-click="findLogisticsByExpressNo" type="card" v-if="expressNo">
            <el-tab-pane :label="'物流包裹' + (index + 1)" :name="e" v-for="(e, index) in expressNos"/>
        </el-tabs>
        <el-row v-if="! expressNo" style="text-align: center">暂无物流信息</el-row>
        <el-row style="margin-left: 68px; margin-bottom: 10px;">物流单号：{{expressNo}}</el-row>
        <el-timeline v-if="expressNo" v-loading="logLoading">
            <el-timeline-item v-for="(log, index) in logistics" icon="el-icon-arrow-up" type="success "
                              :key="index" :timestamp="log.ftime">{{log.context}}</el-timeline-item>
        </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
    import {
      findAllPrintInfosAjax,
      findAllOrdersAjax,
      findAllExpressNosByOrderIdAjax,
      findLogisticsByExpressNoAjax,
      editOrderAjax,
      findAndSetOrderAutoSetAjax
    } from "../../api"
    import {
      dateFormatter,
      dealAdress
    } from "../../util"
    import {mapState, mapActions} from "vuex"
    const MJ_Pagination = () => import('../common/MJ_Pagination.vue')

    export default {
        components: {
            MJ_Pagination
        },

        data() {
            return {
              orderTable: [],
              tableLoading: false,
              defaultSort: {
                  prop: "create_date",
                  order: "descending"
              },
              selectOrder: {
                  nickName: "",
                  tel: "",
                  orderNo: "",
                  orderNos: [],
                  amounts: [],
                  delivery: "",
                  deliveryFees: [],
                  funds: [],
                  integralMoneys: [],
                  coupons: [],
                  createDates: null,
                  sendDates: null,
                  receiveDates: null,
                  dealDates: null,
                  cancelDates: null,
                  payType: null,
                  status: '',
                  expressNo: ''
              },
              showSelect: false,
              showLogistics: false,
              expressNos: [],
              expressNo: null,
              logistics: [],
              logLoading: false,
              editOrder: {
                sellerRemarks: null,
                deliveryFeeNew: '',
                amountNew: '',
                consigneeNew: '',
                telNew: '',
                province: '',
                city: '',
                county: '',
                address: '',
              },
              autoSetShow: false,
              autoSet: {
                auto_receive: 0
              }
            }
        },

        computed: {
            ...mapState(["loading", "pickerOptions", "metaData", "maijiUser"]),
            ...mapState("order", ["orderStatus1Count"]),

            pageOne () {
              return {
                page: 1,
                size: this.metaData.size
              }
            },

            shopingAddress () {
              return "新收货地址：" + this.editOrder.province + this.editOrder.city + this.editOrder.county + this.editOrder.address
            },
        },

        watch: {
          $route: function () {
            if (this.$route.path == "/order/list/status0") this.selectOrder.status = '0'
            else {
              const status = this.$route.params.status
              this.selectOrder.status = status != ':status' && status || '-1'
            }
          },

          'selectOrder.status': {
          deep: true,
          handler: function (value) {
            this.defaultSort = false
            this.selectOrder.refundStatuses = [-1]
            this.$nextTick(() => {
              switch (value) {
                case "-1":
                  this.selectOrder.refundStatuses = null
                  this.defaultSort = {
                    prop: 'create_date',
                    order: "descending"
                  }
                  break;
                case "0":
                  this.defaultSort = {
                    prop: 'create_date',
                    order: "descending"
                  }
                  break;
                case "1":
                  this.defaultSort = {
                    prop: 'pay_date',
                    order: "descending"
                  }
                  break;
                case "2":
                  this.defaultSort = {
                    prop: 'send_date',
                    order: "descending"
                  }
                  break;
                case "3":
                  this.defaultSort = {
                    prop: 'receive_date',
                    order: "descending"
                  }
                  break;
                case "4":
                  this.defaultSort = {
                    prop: 'cancel_date',
                    order: "descending"
                  }
                  break;
                case "5":
                  this.defaultSort = {
                    prop: 'receive_date',
                    order: "descending"
                  }
                  break;
                case "6":
                  this.defaultSort = {
                    prop: 'done_date',
                    order: "descending"
                  }
                  break;
                case "7":
                  this.selectOrder.refundStatuses = [0, 1, 2, 3, 4, 5]
                  this.defaultSort = {
                    prop: 'create_date',
                    order: "descending"
                  }
                  break;
              }
              if (this.selectOrder.status == '0') this.$router.push("/order/list/status0")
              else this.$router.push(`/order/list/${this.selectOrder.status}`)
              this.findAllOrders(this.pageOne)
            })
          }
        },
      },

        mounted() {
          const status = this.$route.params.status
          this.selectOrder.status = status != ':status' && status || '-1'
          if (this.$route.path == "/order/list/status0") this.selectOrder.status = '0'
          this.findAndSetOrderAutoSet({})
          PubSub.subscribe("updateMetaData", () => this.findAllOrders())
        },

        methods: {
          ...mapActions(["updateMetaData"]),
          ...mapActions("order", ["orderStatusCountChange"]),
          dateFormatter, // 日期格式化
          dealAdress, // 收货地址格式化

          async findAndSetOrderAutoSet (autoSet) {
            const result = await findAndSetOrderAutoSetAjax(autoSet || this.autoSet)
            if (result.status == "SUCCESS") {
              this.autoSet = result.data
              if (! autoSet) this.$message.success(`设置自动收货天数成功`)
            } else if (autoSet) this.$message.error(`设置自动收货天数失败，请稍后重试`)
          },

          async findAllPrintInfos () {
            const result = await findAllPrintInfosAjax({expressNo: this.selectOrder.expressNo})
            if (result.status == "SUCCESS") {
              result.data.forEach(pis => this.selectOrder.orderNos.push(...pis.map(pi => pi.orderNo)))
              this.findAllOrders(this.pageOne)
            }
          },

          // 获取表格数据
          async findAllOrders(metaData) {
            this.tableLoading = true;
            const result = await findAllOrdersAjax(this.selectOrder, metaData || this.metaData);
            if (result.status == "USER_NOT_EXIST") {
              this.orderTable = [];
              this.$message.error(`搜索用户【${this.selectOrder.nickName}】不存在`)
            }
            if (result.status == "SUCCESS") {
              this.orderTable = result.data;
              this.updateMetaData({metaData: result.resMetaData, init: true});
            }
            this.tableLoading = false;
            this.loading.close();
          },

          // 编辑回显收货地址
          editShopingAddress (areaInfo) {
              this.editOrder = {
                province: areaInfo.province,
                city: areaInfo.city,
                county: areaInfo.county,
                address: areaInfo.address,
              }
          },

          // 编辑订单
          async editOrderMethod (row, {shopingAddressId, areaInfoId} = {}) {
            Object.assign(this.editOrder, {
              operatorId: this.maijiUser.uuId,
              operatorName: this.maijiUser.name,
              orderId: row.uuId,
              orderNo: row.orderNo,
            })
            let flag = false
            if (this.editOrder.deliveryFeeNew) {
              if (isNaN(this.editOrder.deliveryFeeNew - 0)) return this.$message.warning(`请输入正确的数字`)
              this.editOrder.deliveryFee = row.deliveryFee
              this.editOrder.amountNew = row.amount + (this.editOrder.deliveryFeeNew - this.editOrder.deliveryFee)
              flag = true
            }
            if (this.editOrder.amountNew) {
              if (isNaN(this.editOrder.amountNew - 0)) return this.$message.warning(`请输入正确的数字`)
              this.editOrder.amount = row.amount
              flag = true
            }
            if (row.sellerRemarks) {
              this.editOrder.sellerRemarks = row.sellerRemarks
              flag = true
            }
            if (shopingAddressId) this.editOrder.shopingAddressId = row.shopingAddress.uuId
            if (this.editOrder.consigneeNew) {
              this.editOrder.consignee = row.shopingAddress.consignee
              this.editOrder.telNew = null
              flag = true
            }
            if (this.editOrder.telNew) {
              this.editOrder.tel = row.shopingAddress.tel
              this.editOrder.consigneeNew = null
              flag = true
            }
            if (areaInfoId) {
              this.editOrder.areaInfoId = row.shopingAddress.areaInfo.uuId
              this.editOrder.shopingAddress = this.dealAdress(row.shopingAddress.areaInfo)
              this.editOrder.shopingAddressNew = this.editOrder.province + this.editOrder.city + this.editOrder.county + this.editOrder.address
              flag = true
            }
            if (! flag) return this.$message.warning(`请输入修改数据`)
            const result = await editOrderAjax(this.editOrder)
            if (result.status != "SUCCESS") return this.$message.error(`修改订单失败，请稍后重试`)
            this.editOrder = {
                deliveryFeeNew: '',
                amountNew: '',
                consigneeNew: '',
                telNew: '',
                province: '',
                city: '',
                county: '',
                address: '',
            }
            this.closePopper()
            this.findAllOrders()
            this.$message.success(`修改订单成功`)
          },

          // 显示物流信息
          async showLogisticsM(orderId) {
              this.showLogistics = true;
              const result = await findAllExpressNosByOrderIdAjax(orderId);
              if (result.status == "SUCCESS") {
                  this.expressNos = result.data;
                  if (this.expressNos.length > 0) this.expressNo = this.expressNos[0];
              }
              if (!this.expressNo) return;
              this.findLogisticsByExpressNo();
          },

          // 获取物流信息
          async findLogisticsByExpressNo() {
              this.logLoading = true;
              const result1 = await findLogisticsByExpressNoAjax(this.expressNo);
              if (result1.status == "SUCCESS") this.logistics = result1.data.data;
              this.logLoading = false;
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
                  type: "warning"
                }
              case 3:
                return {
                  name: "支付宝支付",
                  type: "primary"
                }
              case 4:
                return {
                  name: "积分兑换",
                  type: "info"
                }

            }
          },

          resetSelect(showSelect) {
              if (showSelect == "rsOrderNo" || showSelect == "all") {
                  this.selectOrder.orderNo = "";
                  if (showSelect == "rsOrderNo") return this.findAllOrders()
              }
              if (showSelect == "rsexpressNo" || showSelect == "all") {
                  this.selectOrder.expressNo = "";
                  this.selectOrder.orderNos = [];
                  if (showSelect == "rsexpressNo") return this.findAllOrders()
              }
              if (showSelect == "rsTel" || showSelect == "all") {
                  this.selectOrder.tel = "";
                  if (showSelect == "rsTel") return this.findAllOrders()
              }
              if (showSelect == "rsNickName" || showSelect == "all") {
                  this.selectOrder.nickName = "";
                  if (showSelect == "rsNickName") return this.findAllOrders()
              }
              if (showSelect == "all") {
                  this.showSelect = false;
                  this.orderStatusCountChange()
              }
              if (typeof showSelect == 'boolean') this.showSelect = showSelect;
              this.selectOrder = Object.assign(this.selectOrder, {
                  amount: [],
                  delivery: "",
                  deliveryFee: [],
                  fund: [],
                  integralMoney: [],
                  coupon: [],
                  createDate: null,
                  sendDate: null,
                  receiveDate: null,
                  payDate: null,
                  cancelDate: null,
                  payType: null,
              });
              this.findAllOrders(this.pageOne)
            },

          // 表格排序
          orderSortChange({prop, order}) {
            this.selectOrder.orderBy = prop;
            this.selectOrder.orderType = order == "ascending" ? "asc" : "desc";
            this.findAllOrders(this.pageOne)
          },

          closePopper () {
            Array.from(document.getElementsByClassName("myPopper"))
              .forEach(ep => ep.style.display = "none")
          },
        },

        beforeDestroy() {
            PubSub.unsubscribe("updateMetaData")
        }
    };
</script>

<style>
  .orderList .el-input-number--mini {
    width: 99px !important;
  }

  .orderList .el-input-group__append {
    padding: 0 10px !important;
  }
  .orderList .el-input-group__append .el-button {
    padding: 0 15px !important;
  }
  .orderList .el-input-group__prepend {
    padding: 0 10px !important;
  }
  .orderList .el-input-group__prepend .el-button {
    padding: 0 15px !important;
  }

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
