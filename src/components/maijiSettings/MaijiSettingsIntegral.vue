<template>
  <div>
    <el-row style="margin-bottom: 10px;">
        <el-switch v-model="showlogs" active-text="编辑记录" inactive-text="使用规则" @change="findAllRules()" style="margin-right: 15px;"/>
        <el-date-picker type="daterange" align="right" size="small" v-model="updateDates" @change="findAllRules()" v-if="showlogs"
                        unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"/>
    </el-row>
    <el-table stripe max-height="688"
              v-loading="ruleTableLoading"
              :data="ruleTable"
              :header-cell-style="{backgroundColor: '#DCDFE6'}"
              :cell-style="{paddingTop: '7px', paddingBottom: '5px'}">
      <el-table-column type="index" width="60" align="center"/>
      <el-table-column label="发放积分项目" width="120"
                       prop="taskName"/>
      <el-table-column label="项目描述" width="200"
                       prop="description"/>
      <el-table-column label="发放积分" width="120"
                       :formatter="(row) => row.integral + ' 分'"/>
      <el-table-column label="编辑时间" min-width="120" v-if="! showlogs"
                       :formatter="(row) => dateFormatter(row.inTime)"/>
      <el-table-column label="编辑说明" width="120" v-if="showlogs"
                       prop="operationDesc"/>
      <el-table-column label="编辑时间" width="120" v-if="showlogs"
                       :formatter="(row) => dateFormatter(row.editDate)"/>
      <el-table-column label="编辑用户" min-width="120" v-if="showlogs"
                       prop="operatorName"/>
      <el-table-column label="操作" min-width="190" v-if="! showlogs">
        <template slot-scope="scope" v-if="! showlogs">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRule = scope.row; editRuleShow = true;">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-close" @click="delRule(scope.row)">停用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑积分发放规则" :visible.sync="editRuleShow" width="30%" append-to-body>
      <el-form ref="editRuleFrom" :model="editRule" label-width="120px" label-position="right">
        <el-form-item label="发放积分项目" prop="taskName" :rules="[{required: 'true', message: '发放积分项目不能为空'}]">
          <el-input v-model="editRule.taskName" style="width: 70%;"/>
        </el-form-item>
        <el-form-item label="项目描述" prop="description" :rules="[{required: 'true', message: '项目描述不能为空'}]">
          <el-input v-model="editRule.description" style="width: 70%;"/>
        </el-form-item>
        <el-form-item label="连续签到天数" v-if="editRule.day">
          <el-input v-model="editRule.day" style="width: 70%;"/>
        </el-form-item>
        <el-form-item label="发放积分" prop="integral" :rules="[{required: 'true', message: '发放积分不能为空'}]">
          <el-input-number v-model="editRule.integral" :min="0" :step="1"/> 分
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editRuleMethod">确认编辑</el-button>
          <el-button @click="editRuleShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
    import {
      editTaskAjax,
      findAllTasksAjax,
      findAllTaskLogsAjax,
      editSignInDeployAjax,
      findAllSignInDeploysAjax,
      findAllSignInDeployLogsAjax
    } from "../../api"
    import {
      dateFormatter,
    } from "../../util"
    import {mapActions, mapState} from "vuex"

    export default {
        data() {
            return {
              updateDates: [],
              showlogs: false,
              ruleTable: [],
              ruleTableLoading: false,
              editRuleShow: false,
              editRule: {
                taskName: null,
                description: null,
                integral: null
              },
            }
        },

        computed: {
          ...mapState(['loading', 'maijiUser', "pickerOptions"]),
        },

        watch: {
          $route: function () {
            const fullPath = this.$route.fullPath
            if (fullPath.includes('fund')) this.rule.type=1
            if (fullPath.includes('integral')) this.rule.type=2
            this.findAllRules()
          },

          editRuleShow: function (value) {
            if (! value) {
              this.findAllRules()
              this.editRule = {
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
          this.findAllRules()
        },

        methods: {
          ...mapActions(["loadingOpen"]),
          dateFormatter,

          async findAllRules() {
            this.ruleTableLoading = true
            let result = {}
            if (! this.showlogs) result = await findAllTasksAjax({page: 1, size: 99})
            else result = await findAllTaskLogsAjax({page: 1, size: 99})
            if (result.status == "SUCCESS") {
              this.ruleTable = result.data.filter(task => task.taskName != '签到')
              let result0 = {}
              if (! this.showlogs) result0 = await findAllSignInDeploysAjax()
              else result0 = await findAllSignInDeployLogsAjax()
              if (result0.status == "SUCCESS") this.ruleTable.push(...result0.data.map(sd =>
                Object.assign(sd, {taskName: '每日签到', description: `连续签到${sd.day}天`})))
            }
            this.ruleTableLoading = false
            this.loading.close()
          },

          delRule (row) {
            this.$confirm(`是否确定停用积分发放规则？`, `停用积分发放规则`, {
              confirmButtonText: `确定停用`,
              cancelButtonText: `取消`,
              type: 'warning'
            }).then(async () => {
              this.loadingOpen()
              this.editRule = row
              this.editRule.integral = 0
              this.editRule.operatorId = this.maijiUser.uuId
              this.editRule.operatorName = this.maijiUser.name
              this.editRule.operationDesc = '停用规则'
              const result = await editTaskAjax(this.editRule)
              if (result.status != "SUCCESS") {
                this.loading.close()
                return this.$message.error(`规则停用失败，请稍后重试`)
              }
              this.findAllRules()
              this.$message.success(`规则停用成功`)
              this.loading.close()
            })
          },

          editRuleMethod () {
            this.loadingOpen()
            this.$refs.editRuleFrom.validate(async valid => {
              if (!valid) {
                this.loading.close()
                return this.$message.error(`规则编辑失败，请确认编辑规范！`)
              }
              this.editRule.operatorId = this.maijiUser.uuId
              this.editRule.operatorName = this.maijiUser.name

              let result = {}
              if (this.editRule.day) result = await editSignInDeployAjax(this.editRule)
              else result = await editTaskAjax(this.editRule)
              if (result.status != "SUCCESS") {
                this.loading.close()
                return this.$message.error(`规则编辑失败，请稍后重试`)
              }
              this.editRuleShow = false
              this.$message.success(`规则编辑成功`)
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
