<template>
  <el-row>
    <el-col :span="12">
      <el-form :model="comRule" ref="ruleFrom" label-width="180px" label-position="right" class="orderReturnRule">
        <el-divider class="elDivider1"/>
        <el-divider content-position="center">
          <span style="color: #909399; font-weight: bold;">分销通用规则：当前版本</span>
        </el-divider>
        <el-divider/>
        <el-form-item label="下级分销提成比例" prop="p1" :rules="[{required: 'true', message: '下级分销提成比例不能为空'}]">
          <el-input-number v-model="comRule.p1" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;%
        </el-form-item>
        <el-form-item label="下下级分销提成比例" prop="p2" :rules="[{required: 'true', message: '下下级分销提成比例不能为空'}]">
          <el-input-number v-model="comRule.p2" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;%
        </el-form-item>
        <el-form-item label="有效时间" prop="num" :rules="[{required: 'true', message: '有效时间不能为空'}]">
          <el-input-number v-model="comRule.num" :min="0" :step="1" style="width: 45%;"/>
          <el-select v-model="comRule.unit" style="width: 25%;">
            <el-option label="年" :value="1"/>
            <el-option label="月" :value="2"/>
            <el-option label="日" :value="3"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="findDistributionComRule">还原</el-button>
          <el-button type="primary" @click="editDistributionComRule">确认编辑</el-button>
        </el-form-item>
      </el-form>
      <el-form :model="comRuleLog" label-width="180px" label-position="right" class="orderReturnRule">
        <el-divider class="elDivider1"/>
        <el-divider content-position="center">
          <span style="color: #909399; font-weight: bold;">分销通用规则：历史版本</span>
        </el-divider>
        <el-divider/>
        <el-row style="margin-bottom: 10px;">
          <el-button type="success" plain size="small" @click="findAllDistributionComRuleLogs([])" v-if="comEditDates.length > 0">最近修改</el-button>
          <el-button type="success" size="small" @click="findAllDistributionComRuleLogs([])" v-if="comEditDates.length == 0">最近修改</el-button>
          <el-date-picker type="daterange" size="small" v-model="comEditDates" @change="findAllDistributionComRuleLogs" style="width: 45%;"
                          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"/>
          <el-button type="primary" plain size="small" @click="logIndex--" :disabled="logIndex == 0" style="margin-left: 10px;">上一版</el-button>
          <el-button type="primary" plain size="small" @click="logIndex++" :disabled="logIndex + 1 == comRuleLogs.length">下一版</el-button>
        </el-row>
        <el-form-item label="下级分销提成比例" prop="percentage1" :rules="[{required: 'true', message: '下级分销提成比例不能为空'}]">
          <el-input-number v-model="comRuleLog.percentage1" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;%
        </el-form-item>
        <el-form-item label="下下级分销提成比例" prop="percentage2" :rules="[{required: 'true', message: '下下级分销提成比例不能为空'}]">
          <el-input-number v-model="comRuleLog.percentage2" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;%
        </el-form-item>
        <el-form-item label="有效时间" prop="num" :rules="[{required: 'true', message: '有效时间不能为空'}]">
          <el-input-number v-model="comRuleLog.num" :min="0" :step="1" style="width: 45%;"/>
          <el-select v-model="comRuleLog.unit" style="width: 25%;">
            <el-option label="年" :value="1"/>
            <el-option label="月" :value="2"/>
            <el-option label="日" :value="3"/>
          </el-select>
        </el-form-item>
        <el-form-item label="修改时间">
          <el-date-picker v-model="comRuleLog.editDate" type="datetime" disabled/>
        </el-form-item>
        <el-form-item label="修改用户">
          <el-input v-model="comRuleLog.operatorName" size="medium" disabled style="width: 50%;"/>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="11" :offset="1">
      <el-form :model="comRuleLog" label-width="180px" label-position="right" class="orderReturnRule">
        <el-divider class="elDivider1"/>
        <el-divider content-position="center"><span style="color: #909399; font-weight: bold;">分销个人规则：修改记录</span></el-divider>
        <el-divider/>
        <el-row style="margin-bottom: 10px;">
          <el-col :span="5">
            <el-image :src="userRuleLog.userInfo && userRuleLog.userInfo.headUrl" fit="fill" v-show="userRuleLog.userInfo"/>
            <el-image src="../container/images/maijiCat.png" fit="fill" v-show="! userRuleLog.userInfo"/>
          </el-col>
          <el-col :span="19">
            <el-row>
              <el-button type="primary" plain size="small" @click="appUserListShow = true;">选择用户</el-button>
              <el-input v-model="searchUserLog.nickName" placeholder="用户名关键词搜索" size="small" style="width: 70%;">
                <el-button slot="append" icon="el-icon-search" @click="findAllDistributionUserRuleLogs"/>
                <el-button slot="append" icon="el-icon-refresh-left" @click="searchUserLog.nickName = ''; findAllDistributionUserRuleLogs"/>
              </el-input>
            </el-row>
            <el-row style="margin: 10px 0;">
              <el-date-picker type="daterange" size="small" v-model="searchUserLog.userEditDates" @change="findAllDistributionUserRuleLogs"
                style="width: 91%;" range-separator="至" start-placeholder="修改日期开始" end-placeholder="修改日期结束" :picker-options="pickerOptions"/>
            </el-row>
            <el-row>
              <el-button style="width: 30%;" type="success" plain size="small" @click="findAllDistributionUserRuleLogs" v-if="userRuleLogs.length > 0">最近修改</el-button>
              <el-button style="width: 30%;" type="success" size="small" @click="findAllDistributionUserRuleLogs" v-if="userRuleLogs.length == 0">最近修改</el-button>
              <el-button style="width: 27%;" type="primary" plain size="small" @click="userLogIndex--" :disabled="userLogIndex == 0">上一版</el-button>
              <el-button style="width: 27%;" type="primary" plain size="small" @click="userLogIndex++" :disabled="userLogIndex + 1 == userRuleLogs.length">下一版</el-button>
            </el-row>
          </el-col>
        </el-row>
        <el-form-item label="用户名称" v-if="userRuleLog.userInfo">
          <el-input v-model="userRuleLog.userInfo.nickName" size="medium" disabled style="width: 50%;"/>
        </el-form-item>
        <el-form-item label="分销资格">
          <el-switch v-model="userRuleLog.isCancel == 0" active-text="有效" inactive-text="失效" disabled/>
        </el-form-item>
        <el-form-item label="有效时间">
          <el-date-picker v-model="userRuleLog.endTime" type="datetime" disabled/>
        </el-form-item>
        <el-form-item label="下级分销提成比例">
          <el-input-number v-model="userRuleLog.ratio" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;%
        </el-form-item>
        <el-form-item label="下下级分销提成比例">
          <el-input-number v-model="userRuleLog.ratio" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;%
        </el-form-item>
        <el-form-item label="修改时间">
          <el-date-picker v-model="userRuleLog.editDate" type="datetime" disabled/>
        </el-form-item>
        <el-form-item label="修改用户">
          <el-input v-model="userRuleLog.operatorName" size="medium" disabled style="width: 50%;"/>
        </el-form-item>
      </el-form>
    </el-col>
    <el-dialog title="用户列表" :visible.sync="appUserListShow" width="60%">
      <DistributionList :show="true" :chooseUser="chooseUser"/>
    </el-dialog>
  </el-row>
</template>

<script>
    import {
      findAllDistributionComRuleLogsAjax,
      editDistributionComRuleAjax,
      findDistributionComRuleAjax,
      findAllDistributionUserRuleLogsAjax,
    } from "../../api"
    import {
      dateFormatter
    } from "../../util"
    import {mapActions, mapState} from "vuex"
    const DistributionList = () => import('./DistributionList.vue')

    export default {
      components: {
        DistributionList,
      },

      data() {
            return {
              comRule: {
                percentage1: null,
                percentage2: null,
                num: null,
                unit: null,
                updateDate: null,
                userId: null,
                name: null,
              },
              sectionsShow: false,
              type: 0,
              comEditDates: [],
              comRuleLogs: [{}],
              comRuleLog: {},
              logIndex: 0,
              userRuleLogs: [{}],
              userRuleLog: {},
              userLogIndex: 0,
              searchUserLog: {
                nickName: null,
                userEditDates: [],
              },
              appUserListShow: false,
            }
        },

        computed: {
            ...mapState(['loading', 'maijiUser', "pickerOptions"])
        },

        watch: {
          logIndex: function (value) {
            this.comRuleLog = this.comRuleLogs[value]
          },

          userLogIndex: function (value) {
            this.userRuleLog = this.userRuleLogs[value]
        }
      },

        mounted() {
          this.findDistributionComRule()
          this.findAllDistributionComRuleLogs()
          this.findAllDistributionUserRuleLogs()
        },

        methods: {
          ...mapActions(["loadingOpen"]),

          chooseUser (user) {
            this.searchUserLog.uuId = user.uuId
            this.findAllDistributionUserRuleLogs()
            this.appUserListShow = false
          },

          async findDistributionComRule() {
              const result = await findDistributionComRuleAjax()
              if (result.status == "SUCCESS") {
                this.comRule = result.data
                this.comRule.p1 = result.data.percentage1 * 100
                this.comRule.p2 = result.data.percentage2 * 100
              }
              this.loading.close()
          },

          editDistributionComRule() {
            this.loadingOpen()
            this.$refs.ruleFrom.validate(async valid => {
              if (!valid) {
                this.loading.close();
                return this.$message.error(`规则编辑失败，请确认编辑规范！`)
              }
              this.comRule.operatorId = this.maijiUser.uuId
              this.comRule.operatorName= this.maijiUser.name
              this.comRule.percentage1 = this.comRule.p1 / 100
              this.comRule.percentage2 = this.comRule.p2 / 100
              const result = await editDistributionComRuleAjax(this.comRule)
              if (result.status != "SUCCESS") {
                this.loading.close()
                return this.$message.error(`规则编辑失败，请稍后重试`)
              }
              this.findDistributionComRule()
              this.$message.success(`规则编辑成功`)
              this.loading.close()
            });
          },

          async findAllDistributionComRuleLogs() {
            const result = await findAllDistributionComRuleLogsAjax(this.comEditDates)
            if (result.status == "SUCCESS" && result.data.length > 0) {
              this.comRuleLogs = result.data.map(sl =>
                Object.assign(sl, {percentage1: sl.percentage1 * 100, percentage2: sl.percentage2 * 100}))
              this.comRuleLog = this.comRuleLogs[0]
            }
            this.logIndex = 0
            this.loading.close()
          },

          async findAllDistributionUserRuleLogs() {
            const result = await findAllDistributionUserRuleLogsAjax(this.searchUserLog)
            if (result.status == "SUCCESS" && result.data.length > 0) {
              this.userRuleLogs = result.data.map(sl => Object.assign(sl, {ratio: sl.ratio * 100}))
              this.userRuleLog = this.userRuleLogs[0]
            }
            this.logIndex = 0
            this.loading.close()
          },
        }
    }
</script>

<style>
  .orderReturnRule .elDivider1 {
    margin-top: 0 !important;
  }
</style>
