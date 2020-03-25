<template>
  <div>
    <el-row style="margin-bottom: 10px;">
      <el-col :span="3">
        <el-button type="primary" size="small" style="width: 100%;" @click="addRule.uuId = null; addRuleShow = true">添加规则&nbsp;<i class="el-icon-plus"/></el-button>
      </el-col>
      <el-col :span="20" :offset="1">
        <el-switch v-model="showlogs" active-text="编辑记录" inactive-text="使用规则" @change="findAllRules(pageOne)" style="margin-right: 15px;"/>
        <el-date-picker type="daterange" align="right" size="small" v-model="rule.updateDates" @change="findAllRules(pageOne)" v-if="showlogs"
                        unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"/>
      </el-col>
    </el-row>
    <el-table stripe max-height="688"
              v-loading="ruleTableLoading"
              :data="ruleTable"
              :header-cell-style="{backgroundColor: '#DCDFE6'}"
              :cell-style="{paddingTop: '7px', paddingBottom: '5px'}">
      <el-table-column type="index" width="60" align="center"/>
      <el-table-column label="最低购物金额" width="120"
                       :formatter="(row) => row.purchaseAmount + ' 元'"/>
      <el-table-column label="减免比例" width="120"
                       :formatter="(row) => row.discountRatio + ' %'"/>
      <el-table-column label="最低减免金额" width="120"
                       :formatter="(row) => row.discountAmount + ' 元'"/>
      <el-table-column label="积分兑换减免金额比例" width="180" v-if="rule.type == 2"
                       :formatter="(row) => row.toMoneyRatio + ' ‰'"/>
      <el-table-column label="最高可用积分" width="120" v-if="rule.type == 2"
                       :formatter="(row) => row.discountIntegral + ' 分'"/>
      <el-table-column label="编辑说明" width="120" v-if="showlogs"
                       prop="operationDesc"/>
      <el-table-column label="编辑时间" width="120" v-if="showlogs"
                       :formatter="(row) => dateFormatter(row.editDate)"/>
      <el-table-column label="编辑用户" min-width="120" v-if="showlogs"
                       prop="operatorName"/>
      <el-table-column label="操作" min-width="190" v-if="! showlogs">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="addRule = scope.row; addRuleShow = true;">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-close" @click="delRule(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 10px">
      <el-col style="text-align: right;">
        <MJ_Pagination/>
      </el-col>
    </el-row>
    <el-dialog :title="addRule.uuId && `编辑${rule.type == 1 && '基金' || '积分'}使用规则` || `添加${rule.type == 1 && '基金' || '积分'}使用规则`"
             :visible.sync="addRuleShow" width="40%" append-to-body>
      <el-form ref="addRuleFrom" :model="addRule" label-width="170px" label-position="right">
        <el-form-item label="最低购物金额" prop="purchaseAmount" :rules="[{required: 'true', message: '最低购物金额不能为空'}]">
          <el-input-number v-model="addRule.purchaseAmount" :min="0" :step="1"/> 元
        </el-form-item>
        <el-form-item label="减免比例" prop="discountRatio" :rules="[{required: 'true', message: '减免比例不能为空'}]">
          <el-input-number v-model="addRule.discountRatio" :min="0" :step="1"/> %
        </el-form-item>
        <el-form-item label="最高减免金额">
          <el-input-number :value="addRule.purchaseAmount * addRule.discountRatio / 100" disabled/> 元
        </el-form-item>
        <el-form-item label="积分兑换减免金额比例" prop="toMoneyRatio" :rules="[{required: 'true', message: '积分兑换减免金额比例不能为空'}]" v-if="rule.type == 2">
          <el-input-number v-model="addRule.toMoneyRatio" :min="0" :step="1"/> ‰
        </el-form-item>
        <el-form-item label="最高可用积分" v-if="rule.type == 2">
          <el-input-number :value="parseInt(addRule.purchaseAmount * addRule.discountRatio * 10 / addRule.toMoneyRatio)" disabled/> 分
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editRule">确认{{addRule.uuId && '编辑' || '添加'}}</el-button>
          <el-button @click="addRuleShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
    import {
      editRuleFundIntegralAjax,
      findAllRuleFundIntegralsAjax,
      findAllRuleFundIntegral_logsAjax
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
              rule: {
                type: '',
                updateDates: [],
                operationDesc: ''
              },
              showlogs: false,
              ruleTable: [],
              ruleTableLoading: false,
              addRuleShow: false,
              addRule: {
                uuId: null,
                purchaseAmount: null,
                discountRatio: null,
                discountAmount: '',
                toMoneyRatio: null,
                type: null,
                operatorId: null,
                operatorName: ''
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
          $route: function () {
            const fullPath = this.$route.fullPath
            if (fullPath.includes('fund')) this.rule.type=1
            if (fullPath.includes('integral')) this.rule.type=2
            this.findAllRules(this.pageOne)
          },

          addRuleShow: function (value) {
            if (! value) {
              this.findAllRules(this.pageOne)
              this.addRule = {
                uuId: null,
                purchaseAmount: null,
                discountRatio: null,
                discountAmount: null,
                toMoneyRatio: null,
                type: null,
                operatorId: null,
                operatorName: null
              }
            }
          },
      },

        mounted() {
          const fullPath = this.$route.fullPath
          if (fullPath.includes('fund')) this.rule.type=1
          if (fullPath.includes('integral')) this.rule.type=2
          this.findAllRules(this.pageOne)
          PubSub.subscribe("updateMetaData", () => this.findAllRules())
        },

        methods: {
          ...mapActions(["loadingOpen", "updateMetaData"]),
          dateFormatter,

          async findAllRules(metaData) {
            this.ruleTableLoading = true
            let result = {}
            if (this.showlogs) result = await findAllRuleFundIntegral_logsAjax(this.rule, metaData || this.metaData)
            else result = await findAllRuleFundIntegralsAjax(this.rule.type, metaData || this.metaData)
            if (result.status == "SUCCESS") {
              this.ruleTable = result.data
              if (this.rule.type == 2) this.ruleTable = this.ruleTable.map(rule => Object.assign(rule, {discountIntegral: parseInt(rule.discountAmount * 1000 / rule.toMoneyRatio)}))
              this.updateMetaData({metaData: result.resMetaData, init: true})
            }
            this.ruleTableLoading = false
            this.loading.close()
          },

          delRule (row) {
            const msg = row.type == 1 && '基金' || '积分'
            this.$confirm(`是否确定删除${msg}使用规则？`, `删除${msg}使用规则`, {
              confirmButtonText: `确定删除`,
              cancelButtonText: `取消`,
              type: 'warning'
            }).then(async () => {
              this.loadingOpen()
              this.addRule = row
              this.addRule.operatorId = this.maijiUser.uuId
              this.addRule.operatorName = this.maijiUser.name
              this.addRule.operationDesc = '删除规则'
              const result = await editRuleFundIntegralAjax(this.addRule)
              if (result.status != "SUCCESS") {
                this.loading.close()
                return this.$message.error(`规则删除失败，请稍后重试`)
              }
              this.findAllRules(this.pageOne)
              this.$message.success(`规则删除成功`)
              this.loading.close()
            })
          },

          editRule () {
            this.loadingOpen()
            this.$refs.addRuleFrom.validate(async valid => {
              if (!valid) {
                this.loading.close();
                return this.$message.error(`规则编辑失败，请确认编辑规范！`);
              }
              const msg = this.addRule.uuId && '编辑' || '添加'
              this.addRule.operatorId = this.maijiUser.uuId
              this.addRule.operatorName = this.maijiUser.name
              this.addRule.type = this.rule.type
              this.addRule.discountAmount = this.addRule.purchaseAmount * this.addRule.discountRatio / 100
              const result = await editRuleFundIntegralAjax(this.addRule)
              if (result.status != "SUCCESS") {
                this.loading.close()
                return this.$message.error(`规则${msg}失败，请稍后重试`)
              }
              this.addRuleShow = false
              this.$message.success(`规则${msg}成功`)
              this.loading.close()
            })
          },
        }
    }
</script>

<style>
  .orderReturnRule .elDivider1 {
    margin-top: 0 !important;
  }
</style>
