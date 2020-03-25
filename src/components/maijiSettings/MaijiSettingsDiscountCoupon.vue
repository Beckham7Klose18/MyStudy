<template>
  <div>
    <el-row style="margin-bottom: 10px;">
      <el-col :span="3">
        <el-button type="primary" size="small" style="width: 100%;" @click="addDiscount.uuId = null; addDiscountShow = true">添加规则&nbsp;<i class="el-icon-plus"/></el-button>
      </el-col>
      <el-col :span="20" :offset="1">
        <el-switch v-model="discount.type" active-text="积分兑换" active-value="1" inactive-text="免费领取" inactive-value="2" @change="findAllDiscounts(pageOne)" style="margin-right: 15px;"/>
        <el-switch v-model="discount.amount" active-text="有效" :active-value="1" inactive-text="失效" :inactive-value="0" @change="findAllDiscounts(pageOne)" style="margin-right: 15px;"/>
        <el-switch v-model="showLogs" active-text="编辑记录" inactive-text="使用规则" @change="findAllDiscounts(pageOne)" style="margin-right: 15px;"/>
        <el-date-picker type="daterange" align="right" size="small" v-model="discount.updateDates" @change="findAllDiscounts(pageOne)" v-if="showLogs"
                        unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"/>
      </el-col>
    </el-row>
    <el-table stripe max-height="688"
              v-loading="discountTableLoading"
              :data="discountTable"
              :header-cell-style="{backgroundColor: '#DCDFE6'}"
              :cell-style="{paddingTop: '7px', paddingBottom: '5px'}">
      <el-table-column type="index" width="60" align="center"/>
      <el-table-column label="优惠卷面额" width="110"
                       :formatter="(row) => row.faceValue + ' 元'"/>
      <el-table-column label="最低购物金额" width="110"
                       :formatter="(row) => row.money + ' 元'"/>
      <el-table-column label="优惠卷类型" width="110"
                       :formatter="(row) => row.type == 1&& '积分兑换' || '免费领取'"/>
      <el-table-column label="优惠卷数量" width="100"
                       :formatter="(row) => row.amount + ' 张'"/>
      <el-table-column label="兑换积分" width="110" v-if="discount.type == 1"
                       :formatter="(row) => row.integral + ' 分'"/>
      <el-table-column label="发放时间" width="100"
                       :formatter="(row) => dateFormatter(row.inTime)"/>
      <el-table-column label="有效期开始时间" width="100" v-if="discount.type == 2"
                       :formatter="(row) => dateFormatter(row.startTime)"/>
      <el-table-column label="有效期结束时间" width="100" v-if="discount.type == 2"
                       :formatter="(row) => dateFormatter(row.endTime)"/>
      <el-table-column label="有效时间" width="100" v-if="discount.type == 1"
                       :formatter="(row) => row.num + (row.unit == 1 && '年' || row.unit == 2 && '月' || '日')"/>
      <el-table-column label="编辑说明" width="120" v-if="showLogs"
                       prop="operationDesc"/>
      <el-table-column label="编辑时间" width="160" v-if="showLogs"
                       :formatter="(row) => dateFormatter(row.editDate)"/>
      <el-table-column label="编辑用户" min-width="120" v-if="showLogs"
                       prop="operatorName"/>
      <el-table-column label="操作" min-width="200" v-if="! showLogs">
        <template slot-scope="scope" v-if="! showLogs">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="addDiscount = scope.row; addDiscountShow = true;">编辑</el-button>
          <el-button size="mini" type="info" v-clipboard:copy="scope.row.url" v-clipboard:success="() => $message.success('复制成功')"
                     v-clipboard:error="() => $message.error('复制失败，请重试')">复制&nbsp;<i class="el-icon-document-copy"/></el-button>
          <el-button size="mini" type="danger" icon="el-icon-close" @click="delDiscount(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 10px">
      <el-col style="text-align: right;">
        <MJ_Pagination/>
      </el-col>
    </el-row>
    <el-dialog :title="addDiscount.uuId && `编辑优惠卷使用规则` || `添加优惠卷使用规则`"
             :visible.sync="addDiscountShow" width="35%" append-to-body>
      <el-form ref="addDiscountFrom" :model="addDiscount" label-width="150px" label-position="right">
        <el-form-item label="优惠卷类型" :discounts="[{required: 'true', message: '优惠卷类型不能为空'}]">
          <el-switch v-model="addDiscount.type" active-text="积分兑换" active-value="1" inactive-text="免费领取" inactive-value="2" @change="findAllDiscounts(pageOne)" style="margin-right: 15px;"/>
        </el-form-item>
        <el-form-item label="优惠卷面额" prop="faceValue" :discounts="[{required: 'true', message: '优惠卷面额不能为空'}]">
          <el-input-number v-model="addDiscount.faceValue" :min="0" :step="1"/> 元
        </el-form-item>
        <el-form-item label="最低购物金额" prop="money" :discounts="[{required: 'true', message: '最低购物金额不能为空'}]">
          <el-input-number v-model="addDiscount.money" :min="0" :step="1"/> 元
        </el-form-item>
        <el-form-item label="优惠卷数量" prop="amount" :discounts="[{required: 'true', message: '优惠卷数量不能为空'}]">
          <el-input-number v-model="addDiscount.amount" :min="0" :step="1"/> 张
        </el-form-item>
        <el-form-item label="兑换积分" v-if="addDiscount.type == 1">
          <el-input-number v-model="addDiscount.integral" :min="0" :step="1"/> 分
        </el-form-item>
        <el-form-item label="发放时间">
          <el-date-picker v-model="addDiscount.inTime" type="datetime" placeholder="选择发放日期时间"/>
        </el-form-item>
        <el-form-item label="有效期开始时间" v-if="addDiscount.type == 2">
          <el-date-picker v-model="addDiscount.startTime" type="datetime" placeholder="选择开始日期时间"/>
        </el-form-item>
        <el-form-item label="有效期结束时间" v-if="addDiscount.type == 2">
          <el-date-picker v-model="addDiscount.endTime" type="datetime" placeholder="选择结束日期时间"/>
        </el-form-item>
        <el-form-item label="有效时间" v-if="addDiscount.type == 1">
          <el-input-number v-model="addDiscount.num" :min="0" :step="1" style="width: 45%;"/>
          <el-select v-model="addDiscount.unit" style="width: 25%;">
            <el-option label="年" :value="1"/>
            <el-option label="月" :value="2"/>
            <el-option label="日" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editDiscount">确认{{addDiscount.uuId && '编辑' || '添加'}}</el-button>
          <el-button @click="addDiscountShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
    import {
      editDiscountCouponAjax,
      findAllDiscountCouponsAjax,
      findAllDiscountCouponLogsAjax
    } from "../../api"
    import {
      dateFormatter,
    } from "../../util"
    import {mapActions, mapState} from "vuex"
    const MJ_Pagination = () => import('../common/MJ_Pagination.vue')

    export default {
        components: {
        MJ_Pagination,
      },

        data() {
            return {
              discount: {
                type: 2,
                amount: 1,
                updateDates: [],
                operationDesc: ''
              },
              discountAmount: true,
              showLogs: false,
              discountTable: [],
              discountTableLoading: false,
              addDiscountShow: false,
              addDiscount: {
                uuId: null,
                faceValue: null,
                money: null,
                amount: null,
                inTime: null,
                type: null,
                integral: null,
                startTime: null,
                endTime: null,
                unit: 3,
                num: null,
              },
            }
        },

        computed: {
          ...mapState(['loading', 'maijiUser', "pickerOptions", "metaData"]),

          pageOne: {
            get () {
              return {
                page: 1,
                size: this.metaData.size
              }
            },
          },
        },

        watch: {
          addDiscountShow: function (value) {
            if (! value) {
              this.findAllDiscounts(this.pageOne)
              this.addDiscount = {
                uuId: null,
                faceValue: null,
                money: null,
                amount: null,
                inTime: null,
                type: null,
                integral: null,
                startTime: null,
                endTime: null,
                unit: 3,
                num: null,
              }
            }
          },
      },

        mounted() {
          this.findAllDiscounts(this.pageOne)
          PubSub.subscribe("updateMetaData", () => this.findAllDiscounts())
        },

        methods: {
          ...mapActions(["loadingOpen", "updateMetaData"]),
          dateFormatter,

          async findAllDiscounts(metaData) {
            this.discountTableLoading = true
            let result = {}
            if (this.showLogs) result = await findAllDiscountCouponLogsAjax(this.discount, metaData || this.metaData)
            else result = await findAllDiscountCouponsAjax(this.discount, metaData || this.metaData)
            if (result.status == "SUCCESS") {
              this.discountTable = result.data
              if (this.discount.type == 2) this.discountTable = this.discountTable.map(discount => Object.assign(discount, {discountIntegral: parseInt(discount.discountAmount * 1000 / discount.toMoneyRatio)}))
              this.updateMetaData({metaData: result.resMetaData, init: true})
            }
            this.discountTableLoading = false
            this.loading.close()
          },

          delDiscount (row) {
            this.$confirm(`是否确定删除优惠卷使用规则？`, `删除优惠卷使用规则`, {
              confirmButtonText: `确定删除`,
              cancelButtonText: `取消`,
              type: 'warning'
            }).then(async () => {
              this.loadingOpen()
              this.addDiscount = row
              this.addDiscount.amount = 0
              this.addDiscount.operatorId = this.maijiUser.uuId
              this.addDiscount.operatorName = this.maijiUser.name
              this.addDiscount.operationDesc = '删除规则'
              const result = await editDiscountCouponAjax(this.addDiscount)
              if (result.status != "SUCCESS") {
                this.loading.close()
                return this.$message.error(`规则删除失败，请稍后重试`)
              }
              this.findAllDiscounts(this.pageOne)
              this.$message.success(`规则删除成功`)
              this.loading.close()
            })
          },

          editDiscount () {
            this.loadingOpen()
            this.$refs.addDiscountFrom.validate(async valid => {
              if (!valid) {
                this.loading.close();
                return this.$message.error(`规则编辑失败，请确认编辑规范！`);
              }
              const msg = this.addDiscount.uuId && '编辑' || '添加'
              this.addDiscount.editDate = new Date()
              this.addDiscount.operatorId = this.maijiUser.uuId
              this.addDiscount.operatorName = this.maijiUser.name
              const result = await editDiscountCouponAjax(this.addDiscount)
              if (result.status != "SUCCESS") {
                this.loading.close()
                return this.$message.error(`规则${msg}失败，请稍后重试`)
              }
              this.addDiscountShow = false
              this.discount.amount = this.addDiscount.amount && 1 || 0
              this.discount.type = this.addDiscount.type
              this.findAllDiscounts(this.pageOne)
              this.$message.success(`规则${msg}成功`)
              this.loading.close()
            })
          },
        }
    }
</script>

<style>
  .orderReturnDiscount .elDivider1 {
    margin-top: 0 !important;
  }
</style>
