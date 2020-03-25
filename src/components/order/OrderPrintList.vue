<template>
  <div class="orderPrint">
    <el-tabs v-model="selectOrder.status" type="card">
      <el-tab-pane label="全部" name="5" disabled/>
      <el-tab-pane label="代付款" name="0" disabled/>
      <el-tab-pane label="待发货" name="1">
          <span slot="label" v-if="orderStatus1Count != 0"><el-badge :value="orderStatus1Count">待发货</el-badge></span>
          <span slot="label" v-if="orderStatus1Count == 0">待发货</span>
      </el-tab-pane>
      <el-tab-pane label="待收货" name="2" disabled/>
      <el-tab-pane label="已收货" name="3" disabled/>
      <el-tab-pane label="已取消" name="4" disabled/>
    </el-tabs>
    <el-row style="margin-bottom: 10px ;line-height: 32px;">
      <el-col :span="20" v-if="! setPrinter">
        <el-button type="success" size="small" @click="resetSelect('all')">立即刷新&nbsp;<i class="el-icon-refresh"></i></el-button>
        <el-input v-model="selectOrder.nickName" placeholder="用户名关键词搜索" size="small" style="width: 22%;">
          <el-button slot="append" icon="el-icon-search" @click="findAllOrders1"/>
          <el-button slot="append" icon="el-icon-refresh-left" @click="resetSelect('rsNickName')"/>
        </el-input>
        <el-input v-model="selectOrder.tel" placeholder="收货电话关键词搜索" size="small" style="width: 22%;">
          <el-button slot="append" icon="el-icon-search" @click="findAllOrders1"/>
          <el-button slot="append" icon="el-icon-refresh-left" @click="resetSelect('rsTel')"/>
        </el-input>
        <el-input v-model="selectOrder.orderNo" placeholder="历史订单编号搜索" size="small" style="width: 22%;">
          <el-button slot="append" icon="el-icon-search" @click="findHistoryOrders"/>
          <el-button slot="append" icon="el-icon-refresh-left" @click="resetSelect('rsOrderNo')"/>
        </el-input>
        <el-button type="primary" size="small" @click="printAllOrdersSend" style="margin-left: 10px;">
          {{printAgain && '重新' || ''}}打印出货单&nbsp;<i class="el-icon-printer"></i></el-button>
        <el-tooltip content="请先打印出货单" placement="top" effect="light">
          <el-button type="success" size="small" @click="printingConfirm(false)">
            {{printAgain && '重新' || ''}}打印快递单&nbsp;<i class="el-icon-printer"></i></el-button></el-tooltip>
      </el-col>
      <el-col :span="20" v-if="setPrinter">
        <el-button type="success" size="small" @click="resetSelect('all')">立即刷新&nbsp;<i class="el-icon-refresh"></i></el-button>
        <el-input v-model="setPrinterModel.bill" size="small" style="width: 28%;">
          <el-button slot="prepend">出货单打印机型号</el-button>
        </el-input>
        <el-input v-model="setPrinterModel.order" size="small" style="width: 28%;">
          <el-button slot="prepend">快递单打印机型号</el-button>
        </el-input>
        <el-button type="primary" size="small" @click="find_setPrinterModel()" style="margin-left: 10px;">确定设置打印机型号</el-button>
        <el-button plain size="small" @click="setPrinter = false" style="margin-left: 10px;">取消</el-button>
      </el-col>
      <el-col :span="4" style="color: blue; font-size: 12px;">
        <el-row style="line-height: 16px; cursor: pointer;"><span @click="setPrinter = true">出货单打印机型号：TSC TTP-247 <i class="el-icon-edit"/></span></el-row>
        <el-row style="line-height: 16px; cursor: pointer;"><span @click="setPrinter = true">快递单打印机型号：HPRT D45 <i class="el-icon-edit"/></span></el-row>
      </el-col>
    </el-row>
    <el-table stripe v-loading="tableLoading"
          @selection-change="selectionChange" ref="printInfoTable"
          :data="printInfoTable" :row-class-name="rowClassNameMethod"
          :header-cell-style="{backgroundColor: '#DCDFE6'}"
          :cell-style="{paddingTop: '7px', paddingBottom: '5px'}">
      <el-table-column type="selection" width="45"/>
      <el-table-column label="用户名" fixed width="100" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag type="danger" size="mini" v-if="scope.row.remindSend" style="margin-bottom: 5px;">提醒发货</el-tag>
          <br v-if="scope.row.remindSend"/><span class="mjn">{{scope.row.nickName? scope.row.nickName: '麦吉用户'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="增减分单" fixed width="80">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.merge == 1" @click="shopingOrders = scope.row.orders; orderDetailId = scope.row.orders[0].uuId; orderDetailShow = true;"
              size="mini" style="cursor: pointer; margin-bottom: 5px;">{{scope.row.merge}} 单 <i class="el-icon-search"/></el-tag>
            <el-tag type="danger" v-if="scope.row.merge > 1" @click="shopingOrders = scope.row.orders; orderDetailId = scope.row.orders[0].uuId; orderDetailShow = true;"
              size="mini" style="cursor: pointer; margin-bottom: 5px;">{{scope.row.merge}} 单 <i class="el-icon-search"/></el-tag><br/>
            <el-button type="primary" icon="el-icon-plus" plain size="mini" @click="plusOrder(scope.row, true)" style="width: 20px; padding: 7px 0; margin-left: 0;"/>
            <el-button type="primary" icon="el-icon-minus" plain size="mini" @click="plusOrder(scope.row, false)" style="width: 20px; padding: 7px 0; margin-left: 0;"
                         :disabled="scope.row.sendWeights.length == 1" />
          </template>
      </el-table-column>
      <el-table-column label="物流重量" fixed width="80">
          <template slot-scope="scope">
              <el-input placeholder="物流重量" v-for="(nc, index) in scope.row.sendWeights" size="mini"
                  v-model="scope.row.sendWeights[index]"><span slot="suffix" style="line-height: 28px;">克</span></el-input>
          </template>
      </el-table-column>
      <el-table-column label="追加分单" width="255" v-if="printAgain">
        <template slot-scope="scope">
          <el-popover :width="manualAdd && 450 || 150" trigger="click" popper-class="myPopper" v-for="(pi, index) in printInfos">
            <el-col :style="{width: manualAdd && '35%' || '100%'}">
              <el-input size="mini" :placeholder="`合单总重量：${scope.row.weightTotal}`" disabled><span slot="suffix" style="line-height: 28px; margin-right: 10px;">克</span></el-input>
              <el-input size="mini" :placeholder="`此包裹重量：${printInfos[index][0].weight}`" disabled style="width: 100%; margin-top: 10px;">
                <span slot="suffix" style="line-height: 28px; margin-right: 10px;">克</span></el-input>
              <el-input size="mini" v-model="sendWeightAdd" placeholder="输入分单物流重量" style="width: 100%; margin: 10px 0;">
                <span slot="suffix" style="line-height: 28px; margin-right: 10px;">克</span></el-input>
              <el-button @click="printOrderAdd(printInfos[index], false)" type="primary" size="mini" style="width: 100%;" plain v-if="! manualAdd">
                <span style="font-weight: bold;">自动</span>追加分单</el-button><br/>
              <el-button @click="updAddressMethod(scope.row)" type="primary" size="mini" style="width: 100%; margin-top: 10px;" plain v-if="! manualAdd">
                <span style="font-weight: bold;">手动</span>追加分单</el-button>
              <el-button @click="manualAdd = false;" type="text" size="mini" style="width: 100%;" plain v-if="manualAdd">
                取消<span style="font-weight: bold;">手动</span>追加分单</el-button><br/>
              <el-button @click="printOrderAdd(printInfos[index], true)" type="primary" size="mini" style="width: 100%; margin-top: 10px;" plain v-if="manualAdd">
                确定<span style="font-weight: bold;">手动</span>追加分单</el-button>
            </el-col>
            <el-col style="width: 60%; margin-left: 20px;" v-if="manualAdd">
              <el-input size="mini" v-model="editOrder.consignee" placeholder="请输入新收货人"
                        clearable><template slot="prepend"> 收 货 人 </template></el-input>
              <el-input size="mini" v-model="editOrder.tel" placeholder="请输入新收货电话" clearable
                        style="margin: 10px 0;"><template slot="prepend"> 收货电话 </template></el-input>
              <el-input size="mini" v-model="editOrder.adr" clearable placeholder="请输入新收货地址">
                <template slot="prepend">收货地址</template></el-input>
              <el-select v-model="editOrder.companyCode" placeholder="手动发货快递：请选择" size="mini" style="width: 100%; margin: 10px 0;">
                <el-option label="手动发货快递：申通快递" value="shentong"/>
                <el-option label="手动发货快递：顺丰速运" value="shunfeng"/>
                <el-option label="手动发货快递：韵达快递" value="yunda"/>
                <el-option label="手动发货快递：圆通速递" value="yuantong"/>
                <el-option label="手动发货快递：中通快递" value="zhongtong"/>
                <el-option label="手动发货快递：德邦快递" value="debangkuaidi"/>
                <el-option label="手动发货快递：邮政标准快递" value="youzhengbk"/>
              </el-select>
              <el-input size="mini" v-model="editOrder.expressNo" clearable placeholder="请输入运单号" style="margin-bottom: 10px;">
                <template slot="prepend">运单号</template></el-input>
            </el-col>
            <el-tag slot="reference" :type="index % 4 % 3 == 0 && 'success' || 'primary'" size="small" style="cursor: pointer;"
                    :style="{marginLeft: index % 2 == 1 && '5px' || 0, marginTop: index > 1 && '5px' || 0}"plain>包裹{{index + 1}}：{{pi[0].weight}} 克 <i class="el-icon-plus"/></el-tag>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="收货人/电话" width="130" v-if="! printAgain">
        <template slot-scope="scope">
          <el-popover placement="bottom" width="150" trigger="click" popper-class="myPopper">
            <el-input size="mini" v-model="editOrder.consigneeNew" placeholder="请输入新收货人" style="width: 100%;"/>
            <el-button @click="editOrderMethod(scope.row, 1)" type="primary" size="mini" style="width: 100%; margin-top: 10px;" plain >确定</el-button>
            <span slot="reference" style="color: #409EFF; cursor: pointer;">{{scope.row.consignee}} <i class="el-icon-edit"/></span>
          </el-popover><br/>
          <el-popover placement="bottom" width="150" trigger="click" popper-class="myPopper">
            <el-input size="mini" v-model="editOrder.telNew" placeholder="请输入新收货电话" style="width: 100%;"/>
            <el-button @click="editOrderMethod(scope.row, 1)"
                       type="primary" size="mini" style="width: 100%; margin-top: 10px;" plain >确定</el-button>
            <span slot="reference" style="color: #409EFF; cursor: pointer;">{{scope.row.tel}} <i class="el-icon-edit"/></span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="创建时间/收货地址" min-width="220" v-if="! printAgain">
        <template slot-scope="scope">
          <el-row><el-tag type="success" size="mini">{{'创建时间：' + dateFormatter(scope.row.createDate)}}</el-tag></el-row>
          <el-row><el-popover placement="bottom" trigger="click" width="250" popper-class="myPopper">
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
            <el-button @click="editOrderMethod(scope.row, 2)"
                       type="primary" size="mini" style="width: 100%; margin-top: 10px;" plain>确定</el-button>
            <span slot="reference" style="color: #409EFF; cursor: pointer;" @click="editOrder = scope.row.areaInfo;">{{scope.row.adr}} <i class="el-icon-edit"/></span>
          </el-popover></el-row>
        </template>
      </el-table-column>
      <el-table-column label="收货人/电话/地址" min-width="300" v-if="printAgain">
        <template slot-scope="scope">
          <el-popover placement="bottom" width="150" trigger="click" popper-class="myPopper">
            <el-input size="mini" v-model="editOrder.consigneeNew" placeholder="请输入新收货人" style="width: 100%;"/>
            <el-button @click="editOrderMethod(scope.row, 1)" type="primary" size="mini" style="width: 100%; margin-top: 10px;" plain >确定</el-button>
            <span slot="reference" style="color: #409EFF; cursor: pointer;">{{scope.row.consignee}} <i class="el-icon-edit"/></span>
          </el-popover> &nbsp;
          <el-popover placement="bottom" width="150" trigger="click" popper-class="myPopper">
            <el-input size="mini" v-model="editOrder.telNew" placeholder="请输入新收货电话" style="width: 100%;"/>
            <el-button @click="editOrderMethod(scope.row, 1)"
                       type="primary" size="mini" style="width: 100%; margin-top: 10px;" plain >确定</el-button>
            <span slot="reference" style="color: #409EFF; cursor: pointer;">{{scope.row.tel}} <i class="el-icon-edit"/></span>
          </el-popover><br/>
          <el-popover placement="bottom" trigger="click" width="250" popper-class="myPopper">
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
            <el-button @click="editOrderMethod(scope.row, 2)"
                       type="primary" size="mini" style="width: 100%; margin-top: 10px;" plain>确定</el-button>
            <span slot="reference" style="color: #409EFF; cursor: pointer;" @click="editOrder = scope.row.areaInfo;">{{scope.row.adr}} <i class="el-icon-edit"/></span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="总订单金额" width="100" align="center">
        <template slot-scope="scope">
          <span style="color: green; font-weight: bold;">{{scope.row.amountTotal + ' 元'}}</span>
          <br/>{{scope.row.delivery}}
        </template>
      </el-table-column>
      <el-table-column label="买家/卖家留言" fixed="right" min-width="200" v-if="! printAgain">
        <template slot-scope="scope">
          <span v-if="scope.row.remarks"><span style="color: gray">买家：</span>{{scope.row.remarks}}<br/></span>
          <el-popover placement="bottom" trigger="click" width="200" popper-class="myPopper">
            <el-input type="textarea" size="mini" v-model="scope.row.sellerRemarksNew" placeholder="请输入卖家留言" style="width: 100%;"/>
            <el-button type="primary" size="mini" @click="editOrderMethod(scope.row, 3)" style="width: 100%; margin-top: 10px;" plain >确定</el-button>
            <span slot="reference" style="color: #409EFF; cursor: pointer;"><span style="color: gray">卖家：</span>{{scope.row.sellerRemarks}} <i class="el-icon-edit"/></span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="手动发货" fixed="right" min-width="105">
        <template slot-scope="scope">
          <el-popover placement="bottom" width="230" trigger="click" popper-class="myPopper">
            <el-select v-model="companyCode" placeholder="手动发货快递：请选择" size="small" style="width: 100%;">
              <el-option label="手动发货快递：申通快递" value="shentong"/>
              <el-option label="手动发货快递：顺丰速运" value="shunfeng"/>
              <el-option label="手动发货快递：韵达快递" value="yunda"/>
              <el-option label="手动发货快递：圆通速递" value="yuantong"/>
              <el-option label="手动发货快递：中通快递" value="zhongtong"/>
              <el-option label="手动发货快递：德邦快递" value="debangkuaidi"/>
              <el-option label="手动发货快递：邮政标准快递" value="youzhengbk"/>
            </el-select>
            <el-input size="mini" v-for="(eNo, index) in expressNo" v-model="expressNo[index]" clearable :placeholder="`请输入运单号${index + 1}`" style="margin-top: 10px;">
              <template slot="prepend">运单号{{index + 1}}</template>
            </el-input>
            <el-button plain type="primary" size="small" @click="printOrderManual(scope.row)" style="width: 100%; margin-top: 10px;">确定</el-button>
            <span slot="reference" style="color: #0066cc; cursor: pointer; text-decoration-line: underline;">{{printAgain && '重新' || ''}}手动发货</span>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <OrderDetail :orderDetailShow="orderDetailShow" :orderDetailId="orderDetailId" :shopingOrders="shopingOrders"/>
  </div>
</template>

<script>
    import {
      editOrderAjax,
      findAllOrders1Ajax,
      printOrderManualAjax,
      printAllOrdersAjax,
      printOrderAddAjax,
      find_setPrinterModelAjax
    } from '../../api'
    import {
      dateFormatter,
      dealAdress,
      printingOrder,
      printingOrderSend
    } from '../../util'
    import {mapState, mapActions} from 'vuex'
    const OrderDetail = () => import('./OrderDetail.vue')

    export default {
      components: {
        OrderDetail,
      },

      data() {
          return {
            printInfoTable: [],
            tableLoading: false,
            selectOrder: {
              nickName: '',
              tel: '',
              orderNo: '',
              amounts: [],
              deliveryFees: [],
              weightTotals: [],
              createDates: null,
              payType: null,
              status: '1',
              refundStatuses: [-1],
              printed: false,
            },
            showSelect: false,
            printOrders: [],
            expressNo: [''],
            companyCode: '',
            companyName: '',
            updAddress: false,
            editOrder: {
              consigneeNew: '',
              telNew: '',
              province: '',
              city: '',
              county: '',
              address: '',
              adr: '',
              companyCode: '',
              companyName: '',
              expressNo: '',
            },
            orderDetailShow: false,
            orderDetailId: null,
            shopingOrders: [{}],
            printAgain: false,
            sendWeightAdd: null,
            manualAdd: false,
            printInfos: [],
            setPrinter: true,
            setPrinterModel: {
              bill: null,
              order: null,
            }
          }
      },

      computed: {
          ...mapState(['loading', 'pickerOptions', 'metaData', 'maijiUser']),
          ...mapState('order', ['orderStatus1Count']),

          shopingAddress () {
            return "新收货地址：" + this.editOrder.province + this.editOrder.city
              + this.editOrder.county + this.editOrder.address
          },
      },

      mounted() {
        this.findAllOrders1()
        this.find_setPrinterModel({})
      },

      watch: {
        companyCode: function (value) {
            switch (value) {
                case "shentong":
                  this.companyName = '申通快递'
                  break;
                case "shunfeng":
                  this.companyName = '顺丰快递'
                  break;
                case "yunda":
                  this.companyName = '韵达快递'
                  break;
                case "yuantong":
                  this.companyName = '圆通速递'
                  break;
                case "zhongtong":
                  this.companyName = '中通快递'
                  break;
                case "debangkuaidi":
                  this.companyName = '德邦快递'
                  break;
                case "youzhengbk":
                  this.companyName = '邮政标准快递'
                  break;
              }
        },
      },

      methods: {
        ...mapActions(['loadingOpen']),
        ...mapActions('order', ['orderStatusCountChange']),
        dateFormatter,  // 日期格式化

        async find_setPrinterModel (data) {
          const result = await find_setPrinterModelAjax(data || this.setPrinterModel)
          if (data && result.status != "SUCCESS") this.$message.error(`设置打印机型号失败，请稍后重试`)
          this.setPrinterModel = result.data
          if (! data) this.$message.success(`设置打印机型号成功`)
          this.setPrinter = false
        },

        async printOrderAdd (piArr, manualAdd) {
          if (! this.sendWeightAdd) return this.$message.warning(`请先输入分单物流重量`)
          if (isNaN(this.sendWeightAdd - 0)) return this.$message.warning(`请输入正确的数字`)
          if (manualAdd && ! this.editOrder.expressNo) return this.$message.warning(`请先输入运单号`)
          this.loadingOpen()
          const data = {
            'uuId': piArr.reduce((uuIds, pi) => uuIds + pi.uuId + ';', ''),
            'nickName': piArr[0].nickName,
            'orderId': piArr.reduce((orderIds, pi) => orderIds + pi.orderId + ';', ''),
            'orderNo': piArr.reduce((orderNos, pi) => orderNos + pi.orderNo + ';', ''),
            'orderNoNew': piArr.reduce((orderNos, pi) => orderNos + pi.orderNo + ';', ''),
            'count': piArr[0].expressCount + 1,
            'weightTotal': piArr[0].weightTotal,
            'weight': piArr[0].weight,
            'sendWeight': this.sendWeightAdd,
            'tel': manualAdd && this.editOrder.tel || piArr[0].tel,
            'consignee': manualAdd && this.editOrder.consignee || piArr[0].consignee,
            'adr': manualAdd && this.editOrder.adr || piArr[0].sendAddress,
            'companyName': manualAdd && this.dealCom(this.editOrder.companyCode) || '申通快递'
          }
          if (manualAdd) {
            data.companyCode = this.editOrder.companyCode
            data.expressNo = this.editOrder.expressNo
            data.manualAdd = manualAdd
          }
          const result = await printOrderAddAjax(data)
          this.loading.close()
          if (result.status != "SUCCESS")
            return this.$message.error(`${manualAdd && '手动' || '自动'}增加分单失败，请稍后重试`)
          if (! manualAdd) printingOrder(result.data.imgBase64, this.setPrinterModel.order)
          this.$message.success(`${manualAdd && '手动' || '自动'}增加分单成功，${! manualAdd && '正在连接打印机 ··· ···'}`)
          this.closePopper()
          this.findAllPrintInfos()
        },

        dealCom(companyCode) {
          switch (companyCode) {
            case 'shentong':
              return '申通快递'
            case 'shunfeng':
              return '顺丰速运'
            case 'yunda':
              return '韵达快递'
            case 'yuantong':
              return '圆通速递'
            case 'debangkuaidi':
              return '德邦快递'
            case 'youzhengbk':
              return '邮政标准快递'
            case 'zhongtong':
              return '中通快递'
          }
        },

        updAddressMethod (pi, upd) {
          this.manualAdd = true
          this.editOrder.expressNo = ''
          if (upd) this.updAddress = ! this.updAddress
          this.editOrder = {
            'uuId': pi.uuId,
            'tel': pi.tel,
            'consignee': pi.consignee,
            'adr': pi.adr,
            'companyCode': pi.companyCode,
            expressNo: pi.expressNo
          }
        },

        async findHistoryOrders () {
          this.selectOrder.status = null
          this.selectOrder.printed = null
          await this.findAllOrders1()
          if (this.printInfoTable.length > 0) {
            const printOrders = this.printInfoTable[0].orders
            if (printOrders.length > 1 || printOrders[0].status > 1) {
              this.printAgain = true
              this.printInfos = printOrders[0].infoListList
            }
          }
        },

        async findAllOrders1 () {
          this.tableLoading = true
          const result = await findAllOrders1Ajax(this.selectOrder)
          if (result.status == "SUCCESS") this.printInfoTable = result.data.map((orders, index) => {
            return {
              index,
              orders,
              createDate: orders[0].createDate,
              sellerRemarks0: orders[0].sellerRemarks,
              sellerRemarks: orders.reduce((sellerRemarks, o) => {
                if (o.sellerRemarks) sellerRemarks += o.sellerRemarks + '；'
                return sellerRemarks
              }, ''),
              remindSend: orders.filter(order => order.remindSend).length > 0,
              nickName: orders[0].user.nickName,
              consignee: orders[0].shopingAddress.consignee,
              tel: orders[0].shopingAddress.tel,
              areaInfoId: orders[0].shopingAddress.areaInfo.uuId,
              areaInfo: orders[0].shopingAddress.areaInfo,
              adr: dealAdress(orders[0].shopingAddress.areaInfo),
              delivery: orders[0].delivery,
              amountTotal: orders.reduce((amountTotal, o) => {
                amountTotal += o.amount * 100
                return amountTotal
              }, 0) / 100,
              remarks: orders.reduce((remarks, o) => {
                if (o.remarks) remarks += o.remarks + '；'
                return remarks
              }, ''),
              sendWeights: [orders.reduce((sendWeights, o) => {
                sendWeights += o.weightTotal
                return sendWeights
              }, 0)],
              weightTotal: orders.reduce((sendWeights, o) => {
                sendWeights += o.weightTotal
                return sendWeights
              }, 0),
              deliveryFeeNew: false,
              dealAdress: false,
              merge: orders.length,
            }
          }).sort((o1, o2) => o2.createDate - o1.createDate)
          this.orderStatusCountChange()
          this.tableLoading = false
          this.loading.close()
        },

        // 编辑订单
        async editOrderMethod (row, type) {
          Object.assign(this.editOrder, {
            operatorId: this.maijiUser.uuId,
            operatorName: this.maijiUser.name
          })
          if (type == 3) {
            if (! row.sellerRemarksNew) return this.$message.warning(`请输入新的卖家留言`)
            Object.assign(this.editOrder, {
              orderId: row.orders[0].uuId,
              orderNo: row.orders[0].orderNo,
            })
            this.editOrder.sellerRemarks = row.sellerRemarks0 && (row.sellerRemarks0 + "；") || '' + row.sellerRemarksNew
            const result = await editOrderAjax(this.editOrder)
            if (result.status != "SUCCESS") return this.$message.error(`修改订单失败，请稍后重试`)
          } else await row.orders.forEach(async order => {
              Object.assign(this.editOrder, {
                orderId: order.uuId,
                orderNo: order.orderNo,
              })
              let flag = false
              if (type == 1) this.editOrder.shopingAddressId = order.shopingAddress.uuId
              if (this.editOrder.consigneeNew) {
                this.editOrder.consignee = order.shopingAddress.consignee
                this.editOrder.telNew = null
                flag = true
              }
              if (this.editOrder.telNew) {
                this.editOrder.tel = order.shopingAddress.tel
                this.editOrder.consigneeNew = null
                flag = true
              }
              if (type == 2) {
                this.editOrder.areaInfoId = order.shopingAddress.areaInfo.uuId
                this.editOrder.shopingAddress = dealAdress(order.shopingAddress.areaInfo)
                this.editOrder.shopingAddressNew = this.editOrder.province + this.editOrder.city + this.editOrder.county + this.editOrder.address
                flag = true
              }
              if (!flag) return this.$message.warning(`请输入修改数据`)
              const result = await editOrderAjax(this.editOrder)
              if (result.status != "SUCCESS") return this.$message.error(`修改订单失败，请稍后重试`)
            })
          this.editOrder = {
            consigneeNew: '',
            telNew: '',
            province: '',
            city: '',
            county: '',
            address: '',
          }
          this.closePopper()
          this.$message.success(`修改订单成功`)
          this.findAllOrders1()
        },

        closePopper () {
          Array.from(document.getElementsByClassName("myPopper"))
            .forEach(ep => ep.style.display = "none")
        },

        //批量打印出货单
        printAllOrdersSend() {
          if (this.printOrders.length == 0) return this.$message.warning(`请先选择要打印的订单`)
          this.printOrders.sort((p1, p2) => p2.tel - p1.tel).forEach(order => {
            let sendTable = `<style>tbody td{border: 1px solid gray;} td{font-size: 13px;}</style>
              <table cellSpacing=0 cellPadding=0 style="border: none; width: 100%;">
                <thead>
                  <tr><td colspan="4" style="text-align: center;">麦吉出货单</td></tr>
                  <tr><td colspan="4">收 货 人 &nbsp;：${order.consignee} &nbsp; &nbsp; &nbsp;${order.tel}</td></tr>
                  <tr><td colspan="4">收货地址：${order.adr}</td></tr>
                </thead>
                <tbody>
                 <tr><td style="text-align: center;">#</td><td style="text-align: center;">商品名称</td>
                  <td style="text-align: center; width: 10%;">数量</td><td style="text-align: center;">总价</td></tr>`
            let purchaseQuantityTotal = 0
            let index = 0
            let orderNos = ''
            order.orders.forEach(o => {
              orderNos += o.orderNo + '；'
              o.shopingCarts.forEach(sc => {
                purchaseQuantityTotal += sc.purchaseQuantity
                sendTable += `<tr><td style="text-align: center;">${++index}</td><td>${sc.goods.shortName}</td>
                <td style="text-align: center;">${sc.purchaseQuantity}</td><td style="text-align: center;">${sc.presentPayable} 元</td></tr>`
              })
            })
            sendTable += `<tr><td colspan="2" style="text-align: center;">合计</td>
                <td style="text-align: center;">${purchaseQuantityTotal}</td>
                <td style="text-align: center; width: 20%;">${order.amountTotal} 元</td></tr></tbody>
            <tfoot>
              <tr><td colspan="4">订单编号：${orderNos}</td></tr>
              <tr><td colspan="4">买家留言：${order.remarks || ''}</td></tr>
              <tr><td colspan="4">卖家留言：${order.sellerRemarks || ''}</td></tr></tfoot></table>`
            printingOrderSend(sendTable, this.setPrinterModel.bill)
          })
          this.$message.success(`打印出货单请求成功，正在连接打印机 ··· ···`)
        },

        // 手动发货
        async printOrderManual (pi) {
          this.loadingOpen()
          const data = {
            'nickName': pi.nickName,
            'orderId': pi.orders.map(order => order.uuId).join(";"),
            'orderNo': pi.orders.map(order => order.orderNo).join(";"),
            'count': pi.sendWeights.length,
            'weightTotal': pi.weightTotal,
            'sendWeightStrs': pi.sendWeights.join(';'),
            'tel': pi.tel,
            'consignee': pi.consignee,
            'adr': pi.adr,
            'expressNo': this.expressNo.join(';'),
            'companyCode': this.companyCode,
            'companyName': this.companyName,
          }
          const result = await printOrderManualAjax(data)
          if (result.status == "ORDERREFUND")
            this.$message.warning(`有订单已申请退款，请重新选择要打印的订单`)
          if (result.status == "ERROR") this.$message.error(`手动发货失败，请稍后重试！`)
          if (result.status == "SUCCESS") this.$message.success(`手动发货成功`)
          this.orderStatusCountChange()
          this.closePopper()
          this.findAllOrders1()
          this.loading.close()
        },

        printingConfirm() {
          const data = this.printOrders.map(pi => {
            return {
              'nickName': pi.nickName,
              'orderId': pi.orders.map(order => order.uuId).join(";"),
              'orderNo': pi.orders.map(order => order.orderNo).join(";"),
              'orderNoNew': pi.orders.map(order => order.orderNo).join("；"),
              'count': pi.sendWeights.length,
              'weightTotal': pi.weightTotal,
              'sendWeight': pi.sendWeight,
              'tel': pi.tel,
              'consignee': pi.consignee,
              'adr': pi.adr,
            }
          })
          this.$confirm('是否已打印出货单？', `打印快递单`, {
            confirmButtonText: `确定打印快递单`,
            cancelButtonText: `打印出货单 + 快递单`,
            type: 'warning'
          }).then(() => {
            this.loadingOpen()
            this.printOrder(data)
          }).catch(() => {
            this.loadingOpen()
            this.printAllOrdersSend()
            this.printOrder(data)
          })
        },

        // 批量打印快递单
        async printOrder(data) {
          data.forEach(po => po.companyName = '申通快递')
          const result = await printAllOrdersAjax(data)
          if (result.status == "ORDERREFUND")
            this.$message.warning(`有订单已申请退款，请立即刷新后重新选择要打印的订单`)
          if (result.status == "PRINTERROR") return this.$message.error(`打印请求失败：${result.message}`)
          if (result.status == "ERROR") return this.$message.error(`打印请求失败，请稍后重试`)
          if (result.status == "SUCCESS") {
            result.data.sort((p1, p2) => p2.tel - p1.tel).forEach(pi => printingOrder(pi.imgBase64, this.setPrinterModel.order))
            this.$message.success(`打印快递单请求成功，正在连接打印机 ··· ···`)
          }
          this.printOrders = []
          this.orderStatusCountChange()
          this.findAllOrders1()
          this.loading.close()
        },

        resetSelect(showSelect) {
            if (['rsOrderNo', 'all'].includes(showSelect)) {
                this.selectOrder.orderNo = ''
                this.selectOrder.status = 1
                if (showSelect == "rsOrderNo") return this.findAllOrders1()
            }
            if (['rsNickName', 'all'].includes(showSelect)) {
                this.selectOrder.nickName = ''
                if (showSelect == "rsNickName") return this.findAllOrders1()
            }
            if (['rsTel', 'all'].includes(showSelect)) {
                this.selectOrder.tel = ''
                if (showSelect == "rsTel") return this.findAllOrders1()
            }
            if (showSelect == "all") this.showSelect = false;
            if (typeof showSelect == 'boolean') this.showSelect = showSelect
            this.selectOrder = Object.assign(this.selectOrder, {
                    orderNo: '',
                    amounts: [],
                    deliveryFees: [],
                    weightTotals: [],
                    createDates: null,
                    payType: null,
                    status: '1',
                    printed: false,
                })
            this.orderStatusCountChange()
            this.findAllOrders1()
        },

        // 选择
        selectionChange(rows) {
          const newPrintOrders = []
          rows.forEach(row => {
            row.sendWeights.forEach(sw => {
              const newRow = JSON.parse(JSON.stringify(row))
              if (sw) newPrintOrders.push(Object.assign(newRow, {sendWeight: sw}))
              else {
                this.$refs.printInfoTable.toggleRowSelection(row, false)
                return this.$message.warning(`请先填写物流重量再选择！`)
              }
            })
          })
          this.printOrders = newPrintOrders
        },

        // 增减分单
        plusOrder(row, plus) {
          this.$refs.printInfoTable.toggleRowSelection(row, false)
          if (plus) {
            row.sendWeights.push(0)
            this.expressNo.push('')
          } else {
            row.sendWeights.pop()
            this.expressNo.pop()
          }
        },

        // 高亮显示选中行
        rowClassNameMethod({row}) {
          if (this.printOrders.map(order => order.index).includes(row.index))
            return 'success-row'
        },
      },
    }
</script>

<style>
    .orderPrint .el-input__inner {
      padding-right: 0 !important;
      padding-left: 8px !important;
    }

    .orderPrint .el-input-group__append {
        padding: 0 10px !important;
    }
    .orderPrint .el-input-group__append .el-button {
        padding: 0 15px !important;
    }

    .el-table .success-row {
        background-color: #f5faff;
        color: #409EFF;
    }

    .el-dialog__header {
        background-color: #f2f9ff;
    }

    .el-input-number--mini {
        width: 95px;
        line-height: 26px;
    }

    /*指定过渡样式*/
    .showSelect-enter-active, .showSelect-leave-active {
        transition: all 1s
    }

    /*指定隐藏时的样式*/
    .showSelect-enter, .showSelect-leave-to {
        opacity: 0;
        transform: translateX(32px)
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
