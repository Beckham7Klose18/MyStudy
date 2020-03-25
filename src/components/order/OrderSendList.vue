<template>
  <div class="orderSend">
    <el-tabs v-model="elTabStatus" @tab-click="findAllPrintInfos" type="card">
        <el-tab-pane label="全部" name="5" disabled/>
        <el-tab-pane label="代付款" name="0" disabled/>
        <el-tab-pane label="待发货" name="1">
            <span slot="label" v-if="orderStatus1Count != 0"><el-badge :value="orderStatus1Count">待发货</el-badge></span>
            <span slot="label" v-if="orderStatus1Count == 0">待发货</span>
        </el-tab-pane>
        <el-tab-pane label="待收货" name="2"/>
        <el-tab-pane label="已收货" name="3" disabled/>
        <el-tab-pane label="已取消" name="4" disabled/>
    </el-tabs>
    <el-row style="margin-bottom: 10px;">
      <el-button type="success" size="small" @click="resetSelect('all')">立即刷新&nbsp;<i class="el-icon-refresh"></i></el-button>
      <el-switch v-model="searchPrintInfo.expressStatus" active-text="已发货" inactive-text="待发货" @change="findAllPrintInfos" style="margin: 0 10px;"/>
      <el-date-picker type="daterange" size="small" v-model="searchPrintInfo.sendDates"@change="findAllPrintInfos" v-if="searchPrintInfo.expressStatus"
          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" style="width: 17%;"/>
      <el-input v-model="searchPrintInfo.nickName" placeholder="用户昵称关键词搜索" size="small" style="width: 17%;">
        <el-button slot="append" icon="el-icon-search" @click="findAllPrintInfos"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="resetSelect('rsNickName')"/>
      </el-input>
      <el-input v-model="searchPrintInfo.tel" placeholder="收货电话关键词搜索" size="small" style="width: 17%;">
        <el-button slot="append" icon="el-icon-search" @click="findAllPrintInfos"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="resetSelect('rsTel')"/>
      </el-input>
      <el-input v-model="searchPrintInfo.expressNo" placeholder="运单编号关键词搜索" size="small" style="width: 17%;">
            <el-button slot="append" icon="el-icon-search" @click="findAllPrintInfos"/>
            <el-button slot="append" icon="el-icon-refresh-left" @click="resetSelect('rsExpressNo')"/>
          </el-input>
      <el-button type="success" size="small" @click="orderSendBatch(false)" v-if="! searchPrintInfo.expressStatus"><i class="el-icon-s-promotion"/> 批量立即发货</el-button>
    </el-row>
    <el-table @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave"
          v-loading="tableLoading" :data="printInfoTable" :row-class-name="rowClassNameMethod"
          :header-cell-style="{backgroundColor: '#DCDFE6'}" :cell-style="{paddingTop: '7px', paddingBottom: '5px'}">
        <el-table-column type="index" fixed width="45"/>
        <el-table-column label="用户名" fixed min-width="110">
          <template slot-scope="scope">
            <el-row v-if="scope.row.remindSend"><el-tag type="danger" size="mini">提醒发货</el-tag></el-row>
            {{scope.row.nickName? scope.row.nickName: '麦吉用户'}}
          </template>
        </el-table-column>
        <el-table-column label="合单/分单" width="110">
          <template slot-scope="scope">
            <el-tag size="mini" @click="shopingOrders = scope.row.pis; orderDetailId = scope.row.orderId; orderDetailShow = true;"
                    style="cursor: pointer;">合单：{{scope.row.merge}} 单 <i class="el-icon-search"/></el-tag><br/>
            <el-popover placement="bottom" :width="manualAdd && 450 || 150" trigger="click" popper-class="myPopper">
              <el-col :style="{width: manualAdd && '35%' || '100%'}">
                <el-input size="mini" :placeholder="`合单总重量：${scope.row.weightTotal}`" disabled><span slot="suffix" style="line-height: 28px; margin-right: 10px;">克</span></el-input>
                <el-input size="mini" :placeholder="`此包裹重量：${scope.row.weight}`" disabled style="width: 100%; margin-top: 10px;">
                  <span slot="suffix" style="line-height: 28px; margin-right: 10px;">克</span></el-input>
                <el-input size="mini" v-model="sendWeightAdd" placeholder="输入分单物流重量" style="width: 100%; margin: 10px 0;">
                  <span slot="suffix" style="line-height: 28px; margin-right: 10px;">克</span></el-input>
                <el-button @click="printOrderAdd(scope.row, false)" type="primary" size="mini" style="width: 100%;" plain v-if="! manualAdd">自动追加分单</el-button><br/>
                <el-button @click="manualAdd = true; updAddressMethod(scope.row); editOrder.expressNo = '';" type="primary" size="mini" style="width: 100%; margin-top: 10px;" plain v-if="! manualAdd">手动追加分单</el-button>
                <el-button @click="manualAdd = false;" type="text" size="mini" style="width: 100%;" plain v-if="manualAdd">取消手动追加分单</el-button><br/>
                <el-button @click="printOrderAdd(scope.row, true)" type="primary" size="mini" style="width: 100%; margin-top: 10px;" plain v-if="manualAdd">确定手动追加分单</el-button>
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
              <el-tag slot="reference" type="success" size="mini" style="cursor: pointer; margin-top: 5px;">
                分单：{{scope.row.expressCount}} 单 <i class="el-icon-plus"/></el-tag>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="收货人/电话/地址" min-width="300">
          <template slot-scope="scope">
            <el-row>{{scope.row.consignee}} &nbsp;{{scope.row.tel}}</el-row>
            <el-row>{{scope.row.sendAddress}}</el-row>
          </template>
        </el-table-column>
        <el-table-column label="重量/快递" width="105" align="center">
          <template slot-scope="scope">{{scope.row.weight + ' 克'}}<br/>{{dealCom(scope.row.companyCode)}}</template>
        </el-table-column>
        <el-table-column label="打印时间/运单编号" fixed="right" width="180" show-overflow-tooltip v-if="! searchPrintInfo.expressStatus">
          <template slot-scope="scope" v-if="! searchPrintInfo.expressStatus">
            <el-row><el-tag size="mini">{{dateFormatter(scope.row.printDate)}}</el-tag></el-row>
            <el-row>{{scope.row.expressNo}}</el-row>
          </template>
        </el-table-column>
        <el-table-column label="运单编号" fixed="right" width="180" prop="expressNo" v-if="searchPrintInfo.expressStatus"/>
      <el-table-column label="打印时间/发货时间" fixed="right" width="222" v-if="searchPrintInfo.expressStatus">
        <template slot-scope="scope">
          <el-row><el-tag size="mini">打印时间：{{dateFormatter(scope.row.printDate)}}</el-tag></el-row>
          <el-row><el-tag size="mini" type="success">发货时间：{{dateFormatter(scope.row.sendDate)}}</el-tag></el-row>
        </template>
      </el-table-column>
        <el-table-column label="重新打印" fixed="right" width="125" align="center" v-if="! searchPrintInfo.expressStatus">
            <template slot-scope="scope">
              <el-tag type="warning" size="mini" style="cursor: pointer; margin-bottom: 5px;"
                      @click="printOrdersSendAgain(scope.row)">重新打印出货单</el-tag><br/>
              <el-popover width="300" trigger="click" v-if="scope.row.companyCode != 'shentong'"
                          @show="updAddressMethod(scope.row)" popper-class="myPopper">
                <el-input size="mini" v-model="editOrder.consignee" clearable placeholder="请输入新收货人" clearable>
                  <template slot="prepend"> 收 货 人 </template>
                </el-input>
                <el-input size="mini" v-model="editOrder.tel" clearable placeholder="请输入新收货电话" style="margin: 10px 0;">
                  <template slot="prepend"> 收货电话 </template>
                </el-input>
                <el-input size="mini" v-model="editOrder.adr" clearable placeholder="请输入新收货地址">
                  <template slot="prepend">收货地址</template>
                </el-input>
                <el-select v-model="editOrder.companyCode" placeholder="物流快递：请选择" size="small" style="width: 100%; margin: 10px 0;">
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
                <el-button plain type="primary" size="small" @click="printOrderUpdate(scope.row)" style="width: 100%;">确认修改</el-button>
                <el-tag slot="reference" type="primary" size="mini" style="cursor: pointer;">手动发货修改</el-tag>
              </el-popover>
              <el-popover :width="updAddress && 300 || 200" trigger="click" v-if="scope.row.companyCode == 'shentong'" popper-class="myPopper">
                <el-button plain type="primary" size="small" @click="printOrder(scope.row)" style="width: 100%; margin-bottom: 10px;"><i class="el-icon-printer"/> 原单号重新打印</el-button>
                <el-row style="text-align: center; margin-bottom: 10px;"><span @click="updAddressMethod(scope.row, true)" style="color: #409EFF; cursor: pointer;">修改收货信息</span></el-row>
                <el-input v-if="updAddress" size="mini" v-model="editOrder.consignee" placeholder="请输入新收货人" clearable>
                  <template slot="prepend"> 收 货 人 </template>
                </el-input>
                <el-input v-if="updAddress" size="mini" v-model="editOrder.tel" clearable placeholder="请输入新收货电话" style="margin: 10px 0;">
                  <template slot="prepend"> 收货电话 </template>
                </el-input>
                <el-input v-if="updAddress" size="mini" v-model="editOrder.adr" clearable placeholder="请输入新收货地址" style="margin-bottom: 10px;">
                  <template slot="prepend">收货地址</template>
                </el-input>
                <el-button plain type="primary" size="small" @click="printOrderNew(scope.row)" style="width: 100%;"><i class="el-icon-printer"/> 新单号重新打印</el-button>
                <el-tag slot="reference" type="primary" size="mini" style="cursor: pointer;"><i class="el-icon-printer"/> 重新打印</el-tag>
              </el-popover>
            </template>
        </el-table-column>
        <el-table-column label="立即发货" fixed="right" min-width="120" v-if="! searchPrintInfo.expressStatus">
            <template slot-scope="scope">
                <el-button type="success" size="mini" v-show="! scope.row.expressStatus"
                           @click="orderSendBatch(scope.row)"><i class="el-icon-s-promotion"/> 立即发货
                </el-button>
                <el-button type="success" size="mini" v-show="scope.row.expressStatus">
                    <i class="el-icon-s-promotion"/> 已发货</el-button>
            </template>
        </el-table-column>
        <el-table-column fixed="right" min-width="35" v-if="! searchPrintInfo.expressStatus">
            <template slot="header" slot-scope="scope">
                <el-tooltip content="批量立即发货" placement="right" effect="light">
                    <el-checkbox :indeterminate="inSend" v-model="checkAllSend" @change="checked => selectionSendChange(checked)"/>
                </el-tooltip>
            </template>
            <template slot-scope="scope">
                <el-tooltip content="批量立即发货" placement="right" effect="light">
                    <el-checkbox v-model="scope.row.selectedSend" @change="checked => selectionSendChange(checked, scope.row)"/>
                </el-tooltip>
            </template>
        </el-table-column>
    </el-table>
    <OrderDetail :orderDetailShow="orderDetailShow" :orderDetailId="orderDetailId" :shopingOrders="shopingOrders"/>
  </div>
</template>

<script>
    import {
      printingOrder,
      printingOrderSend,
      dateFormatter
    } from '../../util'
    import {
      findAllOrdersAjax,
      findAllPrintInfosAjax,
      orderSend,
      orderPrintNewAjax,
      printOrderUpdateAjax,
      printOrderAddAjax,
      find_setPrinterModelAjax
    } from '../../api'
    import {mapState, mapActions} from 'vuex'
    const OrderDetail = () => import('./OrderDetail.vue')

    export default {
      components: {
        OrderDetail,
      },

      data() {
          return {
            elTabStatus: '1',
            printInfoTable: [],
            tableLoading: false,
            searchPrintInfo: {
                shipInfoIds: [],
                orderNo: '',
                tel: '',
                expressNo: '',
                expressStatus: false,
                imgBase64: null,
                sendDates: [new Date(new Date().getTime() - 1000*60*60*24), new Date()],
            },
            selectedPrints: [],
            inPrint: false,
            checkAllPrint: false,
            selectedSends: [],
            inSend: false,
            checkAllSend: false,
            sendWeight: '2500',
            updAddress: false,
            editOrder: {
              consignee: '',
              tel: '',
              adr: '',
              companyCode: '',
              companyName: '',
              expressNo: ''
            },
            sendWeightAdd: null,
            manualAdd: false,
            orderDetailShow: false,
            orderDetailId: null,
            shopingOrders: [{}],
            setPrinterModel: {
              bill: null,
              order: null,
            }
          }
      },

      computed: {
          ...mapState(['loading', 'pickerOptions']),
          ...mapState('order', ['orderStatus1Count']),
      },

      mounted() {
        this.findAllPrintInfos()
        this.find_setPrinterModel()
      },

      methods: {
        ...mapActions(['loadingOpen']),
        ...mapActions('order', ['orderStatusCountChange']),
        dateFormatter,  // 日期格式化

        async find_setPrinterModel () {
          const result = await find_setPrinterModelAjax({})
          if (result.status == "SUCCESS") this.setPrinterModel = result.data
        },

        // 重新打印出货单
        async printOrdersSendAgain (pi) {
          this.loadingOpen()
          const result = await findAllOrdersAjax({orderIds: pi.orderIds.split(';')}, {page: 1, size: 99})
          if (result.status == "SUCCESS") {
            let sendTable = `<style>tbody td{border: 1px solid gray;} td{font-size: 13px;}</style>
              <table cellSpacing=0 cellPadding=0 style="border: none; width: 100%;">
              <thead>
                <tr><td colspan="4" style="text-align: center;">麦吉出货单</td></tr>
                <tr><td colspan="4">收 货 人 &nbsp;：${pi.consignee} &nbsp; &nbsp; &nbsp;${pi.tel}</td></tr>
                <tr><td colspan="4">收货地址：${pi.sendAddress}</td></tr>
              </thead>
              <tbody>
               <tr><td style="text-align: center;">#</td><td style="text-align: center;">商品名称</td>
                <td style="text-align: center; width: 10%;">数量</td><td style="text-align: center;">总价</td></tr>`
            let purchaseQuantityTotal = 0
            let amountTotal = 0
            let sellerRemarks = ''
            let remarks = ''
            let index = 0
            result.data.forEach(o => {
              o.shopingCarts.forEach(sc => {
                purchaseQuantityTotal += sc.purchaseQuantity
                sendTable += `<tr><td style="text-align: center;">${++index}</td><td>${sc.goods.shortName}</td>
              <td style="text-align: center;">${sc.purchaseQuantity}</td><td style="text-align: center;">${sc.presentPayable} 元</td></tr>`
              })
              amountTotal += o.amount
              remarks += o.remarks && (o.remarks + ';') || ''
              sellerRemarks += o.sellerRemarks && (o.sellerRemarks + ';') || ''
            })
            sendTable += `<tr><td colspan="2" style="text-align: center;">合计</td>
              <td style="text-align: center;">${purchaseQuantityTotal}</td>
              <td style="text-align: center; width: 20%;">${amountTotal} 元</td></tr></tbody>
              <tfoot>
            <tr><td colspan="4">买家留言：${remarks || ''}</td></tr>
            <tr><td colspan="4">卖家留言：${sellerRemarks || ''}</td></tr></tfoot></table>`
            printingOrderSend(sendTable, this.setPrinterModel.bill)
          }
          this.$message.success(`重新打印出货单成功，正在连接打印机 ··· ···`)
          this.loading.close()
        },

        async printOrderAdd (pi, manualAdd) {
          if (! this.sendWeightAdd) return this.$message.warning(`请先输入分单物流重量`)
          if (isNaN(this.sendWeightAdd - 0)) return this.$message.warning(`请输入正确的数字`)
          if (manualAdd && ! this.editOrder.expressNo) return this.$message.warning(`请先输入运单号`)
          this.loadingOpen()
          const data = {
            'uuId': pi.uuIds,
            'nickName': pi.nickName,
            'orderId': pi.orderIds,
            'orderNo': pi.orderNos,
            'orderNoNew': pi.orderNos,
            'count': pi.expressCount + 1,
            'weightTotal': pi.weightTotal,
            'weight': pi.weight,
            'sendWeight': this.sendWeightAdd,
            'tel': manualAdd && this.editOrder.tel || pi.tel,
            'consignee': manualAdd && this.editOrder.consignee || pi.consignee,
            'adr': manualAdd && this.editOrder.adr || pi.sendAddress,
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

        // 修改手动发货
        async printOrderUpdate (row) {
          this.editOrder.orderNo = row.orderNos
          this.editOrder.uuId = row.uuIds
          this.editOrder.companyName = this.dealCom(this.editOrder.companyCode)
          const result = await printOrderUpdateAjax(this.editOrder)
          if (result.status == "ERROR") this.$message.error(`手动发货修改失败，请稍后重试！`)
          if (result.status == "SUCCESS") this.$message.success(`手动发货修改成功`)
          this.findAllPrintInfos()
          this.loading.close()
        },

        closePopper () {
          Array.from(document.getElementsByClassName("myPopper"))
            .forEach(ep => ep.style.display = "none")
        },

        // 获取表格数据
        async findAllPrintInfos() {
          this.tableLoading = true
          if (this.elTabStatus == 2) return this.$router.push(`/order/list/2`)
          const result = await findAllPrintInfosAjax(this.searchPrintInfo)
          if (result.status == "SUCCESS") this.printInfoTable = result.data && result.data.map(pis =>
              Object.assign(JSON.parse(JSON.stringify(pis[0])), { pis,
                remindSend: pis.filter(pi => pi.remindSend).length > 0,
                uuIds: pis.reduce((uuIds, pi) => uuIds + pi.uuId + ';', ''),
                orderIds: pis.reduce((orderIds, pi) => orderIds + pi.orderId + ';', ''),
                orderNos: pis.reduce((orderNos, pi) => orderNos + pi.orderNo + ';', ''),
                merge: pis.length,
              })).sort((p1, p2) => p1.orderNo - p2.orderNo) || []
          this.tableLoading = false
          this.orderStatusCountChange()
          this.loading.close()
        },

        // (批量)立即发货
        async orderSendBatch(printInfo) {
          const data = []
          if (printInfo) this.printInfoTable
            .filter(pi => pi.orderNos == printInfo.orderNos)
            .forEach(pi => data.push(...pi.pis))
          else if (this.selectedSends.length == 0) return this.$message.warning(`请先选择要发货的快递单！`)
          else this.selectedSends.forEach(pi => data.push(...pi.pis))
          const result = await orderSend(data)
          if (result.status != "SUCCESS") return this.$message.error(`发货失败，请稍后重试！`)
          this.selectedSends = []
          this.checkAllSend = false
          this.inSend = false
          this.findAllPrintInfos()
          return this.$message.success(`发货成功！`)
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

        cellMouseEnter (row, column) {
          if (column.label == '立即发货') {
            const orders = this.printInfoTable.filter(order => order.orderNos == row.orderNos)
            this.selectedSends.push(...orders)
          }
        },

        cellMouseLeave (row, column) {
          if (column.label == '立即发货') {
            const orders = this.printInfoTable.filter(order => order.orderNos == row.orderNos)
            orders.forEach(() => this.selectedSends.pop())
          }
        },

        updAddressMethod (pi, upd) {
          if (upd) this.updAddress = ! this.updAddress
          this.editOrder = {
            'uuId': pi.uuId,
            'tel': pi.tel,
            'consignee': pi.consignee,
            'adr': pi.sendAddress,
            'companyCode': pi.companyCode,
            expressNo: pi.expressNo
          }
        },

        // 新单号重新打印快递单
        async printOrderNew(pi) {
          this.loadingOpen()
          const data = {
              'uuId': pi.pis.map(si => si.uuId).join(";"),
              'nickName': pi.nickName,
              'orderId': pi.pis.map(si => si.orderId).join(";"),
              'orderNo': pi.pis.map(si => si.orderNo).join(";"),
              'orderNoNew': pi.pis.map(si => si.orderNo).join("；"),
              'count': pi.expressCount,
              'weightTotal': pi.weight,
              'sendWeight': pi.weight,
              'tel': this.editOrder.tel || pi.tel,
              'consignee': this.editOrder.consignee || pi.consignee,
              'adr': this.editOrder.adr || pi.sendAddress
            }
          const result = await orderPrintNewAjax(data)
          if (result.status != "SUCCESS") {
            this.loading.close()
            return this.$message.error(`重新打印请求失败，请稍后重试！`)
          }
          printingOrder(result.data.imgBase64, this.setPrinterModel.order)
          this.loading.close()
          this.$message.success(`重新打印快递单请求成功，正在连接打印机 ··· ···`)
          this.findAllPrintInfos()
        },

        // 原单号重新打印快递单
        async printOrder(order) {
            this.loadingOpen()
            this.searchPrintInfo.shipInfoIds = [order.uuId]
            this.searchPrintInfo.imgBase64 = true
            const result = await findAllPrintInfosAjax(this.searchPrintInfo)
            if (result.status != "SUCCESS") return this.$message.error(`重新打印请求失败，请稍后重试！`)
            result.data.forEach(pi => printingOrder(pi[0].imgBase64, this.setPrinterModel.order))
            this.$message.success({message: `重新打印请求成功，正在连接打印机 ··· ···`, duration: 10000})
            this.loading.close()
        },

        // 多选 - 立即发货
        selectionSendChange(checked, {orderNo, expressNo} = {}) {
          this.selectedSends = null
          if (orderNo) {  // 多选
                this.printInfoTable.forEach(printInfo => {
                  if (printInfo.orderNo == orderNo) printInfo.selectedSend = checked
                  if (printInfo.expressNo == expressNo) printInfo.selectedSend = checked
                })
                this.selectedSends = this.printInfoTable.filter(printInfo => printInfo.selectedSend)
                this.checkAllSend = this.selectedSends.length == this.printInfoTable.length && this.selectedSends.length != 0
                this.inSend = this.selectedSends.length > 0 && this.selectedSends.length != this.printInfoTable.length
            } else {  // 全选
                this.printInfoTable = this.printInfoTable.map(pi => Object.assign(pi, {selectedSend: checked}))
                this.selectedSends = checked ? this.printInfoTable : []
            }
        },

        // 动态设置选择行的样式
        rowClassNameMethod({row}) {
            if (this.selectedSends && this.selectedSends.map(pi => pi.expressNo).includes(row.expressNo))
                return 'success-row'
        },

        resetSelect(showSelect) {
            if (['rsNickName', 'all'].includes(showSelect)) this.searchPrintInfo.nickName = ''
            if (['rsTel', 'all'].includes(showSelect)) this.searchPrintInfo.tel = ''
            if (['rsOrderNo', 'all'].includes(showSelect)) this.searchPrintInfo.orderNo = ''
            if (['rsExpressNo', 'all'].includes(showSelect)) this.searchPrintInfo.expressNo = ''
            this.findAllPrintInfos();
        },
      }
    }
</script>

<style>
  .orderSend .el-input-group__append {
    padding: 0 10px !important;
  }
  .orderSend .el-input-group__append .el-button {
    padding: 0 15px !important;
  }

  .el-table .success-row {
      background-color: #f5faff;
      color: #409EFF;
  }

  .el-dialog__header {
      background-color: #f2f9ff;
  }

  .el-range-editor--small.el-input__inner {
      width: 250px;
  }

  .el-tabs__item.is-top {
      font-size: large;
  }

  .orderSend .el-tabs .el-badge__content.is-fixed {
      position: absolute !important;
      top: 9px !important;
      right: 2px !important;
      transform: translateY(-50%) translateX(100%) !important;
  }
</style>
