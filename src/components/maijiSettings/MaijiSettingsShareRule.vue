<template>
  <el-row>
    <el-col :span="12">
      <el-form :model="shareRule" ref="ruleFrom" label-width="180px" label-position="right" class="orderReturnRule">
        <el-divider class="elDivider1"/>
        <el-divider content-position="center">
          <span style="color: #909399; font-weight: bold;" v-if="type == 1">记录体重获取基础减肥基金规则</span>
          <span style="color: #909399; font-weight: bold;" v-if="type == 2">减重分享助力规则</span>
          <span style="color: #909399; font-weight: bold;" v-if="type == 3">订单返现分享助力规则</span>
          <span style="color: #909399; font-weight: bold;" v-if="type == 4">分销提现规则</span>
          <span style="color: #909399; font-weight: bold;">：当前版本</span>
        </el-divider>
        <el-divider/>
        <!--        订单返现-->
        <el-form-item label="活动是否开启" v-if="type ==3" prop="isOpen" :rules="[{required: 'true', message: '活动是否开启不能为空'}]">
          <el-switch v-model="shareRule.isOpen" active-text="开启" inactive-text="关闭"/>
        </el-form-item>
        <div v-for="(section, index) in shareRule.sections" v-if="type ==3">
          <el-form-item label="订单金额" v-if="type ==3 && index + 1 == shareRule.sections.length || sectionsShow">
            <el-input-number v-model="shareRule.sections[index].orderMoney" :step="1" :min="0" size="medium"/>
            &nbsp;&nbsp;元 — {{shareRule.sections[index +1] && shareRule.sections[index +1].orderMoney + ' 元'}}
          </el-form-item>
          <el-form-item label="最大返现比例" v-if="type ==3 && index + 1 == shareRule.sections.length  || sectionsShow">
            <el-input-number v-model="shareRule.sections[index].maxReturRatio" :step="0.01" :min="0" size="medium" style="width: 35%;"/>&nbsp;&nbsp;%
            <el-button size="mini" v-show="sectionsShow" @click="shareRule.sections.splice(index, 1)" plain style="margin-left: 20px;"><i class="el-icon-minus"/></el-button>
            <el-button size="mini" v-show="sectionsShow" @click="shareRule.sections.splice(index, 0, {orderMoney: null, maxReturRatio: 0})" plain><i class="el-icon-plus"/></el-button>
            <el-button size="mini" v-show="! sectionsShow" @click="sectionsShow = true" plain style="margin-left: 20px;">展开</el-button>
            <el-button size="mini" v-show="sectionsShow" @click="sectionsShow = false" plain style="margin-left: 20px;">收起</el-button>
          </el-form-item>
        </div>
        <el-form-item label="是否可参与不同用户助力" v-if="type ==3" prop="isMore" :rules="[{required: 'true', message: '是否可参与不同用户助力不能为空'}]">
          <el-switch v-model="shareRule.isMore" active-text="可以" inactive-text="不可"/>
        </el-form-item>
        <el-form-item label="新用户最大可助力金额" v-if="type ==3" prop="maxNewUserHelpMoney" :rules="[{required: 'true', message: '新用户最大可助力金额不能为空'}]">
          <el-input-number v-model="shareRule.maxNewUserHelpMoney" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;元
        </el-form-item>
        <el-form-item label="新用户最小可助力金额" v-if="type ==3" prop="minNewUserHelpMoney" :rules="[{required: 'true', message: '新用户最小可助力金额不能为空'}]">
          <el-input-number v-model="shareRule.minNewUserHelpMoney" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;元
        </el-form-item>
        <el-form-item label="老用户最大可助力金额" v-if="type ==3" prop="maxOldUserHelpMoney" :rules="[{required: 'true', message: '老用户最大可助力金额不能为空'}]">
          <el-input-number v-model="shareRule.maxOldUserHelpMoney" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;元
        </el-form-item>
        <el-form-item label="老用户最小可助力金额" v-if="type ==3" prop="minOldUserHelpMoney" :rules="[{required: 'true', message: '老用户最小可助力金额不能为空'}]">
          <el-input-number v-model="shareRule.minOldUserHelpMoney" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;元
        </el-form-item>
        <el-form-item label="活动持续时长" v-if="type ==3" prop="hours" :rules="[{required: 'true', message: '活动持续时长不能为空'}]">
          <el-input-number v-model="shareRule.hours" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;小时
        </el-form-item>
        <!--        获取基础减肥基金-->
        <el-form-item label="活动是否开启" v-if="type ==1" prop="isOpen" :rules="[{required: 'true', message: '活动是否开启不能为空'}]">
          <el-switch v-model="shareRule.isOpen" active-text="开启" inactive-text="关闭"/>
        </el-form-item>
        <el-form-item label="减重范围最小体重" v-if="type == 1" prop="minWeight" :rules="[{required: 'true', message: '减重范围最小体重不能为空'}]">
          <el-input-number v-model="shareRule.minWeight" :step="0.1" :min="0.000" size="medium"/>&nbsp;&nbsp;KG
        </el-form-item>
        <el-form-item label="减重范围最大体重" v-if="type == 1" prop="maxWeight" :rules="[{required: 'true', message: '减重范围最大体重不能为空'}]">
          <el-input-number v-model="shareRule.maxWeight" :step="0.1" :min="0.000" size="medium"/>&nbsp;&nbsp;KG
        </el-form-item>
        <el-form-item label="每日领取减肥基金人数" v-if="type == 1" prop="peopleNum" :rules="[{required: 'true', message: '每日领取减肥基金人数不能为空'}]">
          <el-input-number v-model="shareRule.peopleNum" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;人
        </el-form-item>
        <el-form-item label="获取减肥基金概率" v-if="type == 1" prop="probability" :rules="[{required: 'true', message: '获取减肥基金概率不能为空'}]">
          <el-input-number v-model="shareRule.probability" :step="1" :min="0" size="medium"/> %
        </el-form-item>
        <el-form-item label="基础减肥基金倍数" v-if="type == 1" prop="baseFund" :rules="[{required: 'true', message: '基础减肥基金倍数不能为空'}]">
          <el-input-number v-model="shareRule.baseFund" :step="0.1" :min="0" size="medium"/>&nbsp;&nbsp;倍
        </el-form-item>
        <!--<el-form-item label="基础减肥基金最低" v-if="type == 1" prop="minBasicsFund" :rules="[{required: 'true', message: '基础减肥基金最低不能为空'}]">
          <el-input-number v-model="shareRule.minBasicsFund" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;元
        </el-form-item>
        <el-form-item label="基础减肥基金最高" v-if="type == 1" prop="maxBasicsFund" :rules="[{required: 'true', message: '基础减肥基金最高不能为空'}]">
          <el-input-number v-model="shareRule.maxBasicsFund" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;元
        </el-form-item>-->
        <!--        减重分享-->
        <el-form-item label="是否可参与不同用户助力" v-if="type == 2" prop="isNo" :rules="[{required: 'true', message: '是否可参与不同用户助力不能为空'}]">
          <el-switch v-model="shareRule.isNo" active-text="可以" inactive-text="不可"/>
        </el-form-item>
        <el-form-item label="新用户最大可助力金额" v-if="type == 2" prop="newUserMaxMoney" :rules="[{required: 'true', message: '新用户最大可助力金额不能为空'}]">
          <el-input-number v-model="shareRule.newUserMaxMoney" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;元
        </el-form-item>
        <el-form-item label="新用户最小可助力金额" v-if="type == 2" prop="newUserMinMoney" :rules="[{required: 'true', message: '新用户最小可助力金额不能为空'}]">
          <el-input-number v-model="shareRule.newUserMinMoney" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;元
        </el-form-item>
        <el-form-item label="老用户最大可助力金额" v-if="type == 2" prop="oldUserMaxMoney" :rules="[{required: 'true', message: '老用户最大可助力金额不能为空'}]">
          <el-input-number v-model="shareRule.oldUserMaxMoney" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;元
        </el-form-item>
        <el-form-item label="老用户最小可助力金额" v-if="type == 2" prop="oldUserMinMoney" :rules="[{required: 'true', message: '老用户最小可助力金额不能为空'}]">
          <el-input-number v-model="shareRule.oldUserMinMoney" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;元
        </el-form-item>
        <el-form-item label="活动结束时间点" v-if="type == 2" prop="time" :rules="[{required: 'true', message: '活动结束时间点不能为空'}]">
          <el-time-picker v-model="shareRule.time" arrow-control :picker-options="{ selectableRange: '00:00:00 - 23:59:59' }"/>
        </el-form-item>
        <!--        提现规则-->
        <el-form-item label="最低提现金额" v-if="type == 4" prop="amount" :rules="[{required: 'true', message: '最低提现金额不能为空'}]">
          <el-input-number v-model="shareRule.amount" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;元
        </el-form-item>
        <!--        转发得积分基本规则-->
        <el-form-item label="每个用户每天最多转发得积分数量" v-if="type == 5" prop="maxTransmitNum" :rules="[{required: 'true', message: '每个用户每天最多转发得积分数量不能为空'}]">
          <el-input-number v-model="shareRule.maxTransmitNum" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;元
        </el-form-item>
        <el-form-item label="默认积分重置天数" v-if="type == 5" prop="defaultRestartDay" :rules="[{required: 'true', message: '默认积分重置天数不能为空'}]">
          <el-input-number v-model="shareRule.defaultRestartDay" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;天
        </el-form-item>
        <el-form-item label="默认积分数值" v-if="type == 5" prop="defaultIntegral" :rules="[{required: 'true', message: '默认积分数值不能为空'}]">
          <el-input-number v-model="shareRule.defaultIntegral" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;分
        </el-form-item>
        <!--        修改记录-->
        <el-form-item label="修改时间">
          <el-date-picker v-model="shareRule.updateDate" type="datetime" disabled/>
        </el-form-item>
        <el-form-item label="修改用户">
          <el-input v-model="shareRule.name" size="medium" disabled style="width: 50%;"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="findShareRule">还原</el-button>
          <el-button type="primary" @click="updShareRule">确认编辑</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="11" :offset="1">
      <el-form :model="shareRuleLog" label-width="180px" label-position="right" class="orderReturnRule">
        <el-divider class="elDivider1"/>
        <el-divider content-position="center"><span style="color: #909399; font-weight: bold;">历史版本</span></el-divider>
        <el-divider/>
        <el-row style="margin-bottom: 10px;">
          <el-button type="success" plain size="small" @click="findAllShareRuleLogs([])" v-if="updateDates.length > 0">最近修改</el-button>
          <el-button type="success" size="small" @click="findAllShareRuleLogs([])" v-if="updateDates.length == 0">最近修改</el-button>
          <el-date-picker type="daterange" align="right" size="small" v-model="updateDates" @change="findAllShareRuleLogs" style="width: 45%;"
                          unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"/>
          <el-button type="primary" plain size="small" @click="logIndex--" :disabled="logIndex == 0" style="margin-left: 10px;">上一版</el-button>
          <el-button type="primary" plain size="small" @click="logIndex++" :disabled="logIndex + 1 == shareRuleLogs.length">下一版</el-button>
        </el-row>
        <el-form-item label="活动是否开启" v-if="type ==3" prop="isOpen" :rules="[{required: 'true', message: '活动是否开启不能为空'}]">
          <el-switch v-model="shareRuleLog.isOpen" active-text="开启" inactive-text="关闭" disabled/>
        </el-form-item>
        <div v-for="(section, index) in shareRuleLog.sections" v-if="type ==3">
          <el-form-item label="订单金额" v-if="type ==3 && index + 1 == shareRuleLog.sections.length || sectionsShow">
            <el-input-number v-model="shareRuleLog.sections[index].orderMoney" :step="1" :min="0" size="medium"/>
            &nbsp;&nbsp;元 — {{shareRuleLog.sections[index +1] && shareRuleLog.sections[index +1].orderMoney + ' 元'}}
          </el-form-item>
          <el-form-item label="最大返现比例" v-if="type ==3 && index + 1 == shareRuleLog.sections.length  || sectionsShow">
            <el-input-number v-model="shareRuleLog.sections[index].maxReturRatio" :step="0.01" :min="0" size="medium" style="width: 35%;"/>&nbsp;&nbsp;%
            <el-button size="mini" v-show="! sectionsShow" @click="sectionsShow = true" plain style="margin-left: 20px;">展开</el-button>
            <el-button size="mini" v-show="sectionsShow" @click="sectionsShow = false" plain style="margin-left: 20px;">收起</el-button>
          </el-form-item>
        </div>
        <el-form-item label="是否可参与不同用户助力" v-if="type ==3" prop="isMore" :rules="[{required: 'true', message: '是否可参与不同用户助力不能为空'}]">
          <el-switch v-model="shareRuleLog.isMore" active-text="可以" inactive-text="不可" disabled/>
        </el-form-item>
        <el-form-item label="新用户最大可助力金额" v-if="type ==3" prop="maxNewUserHelpMoney" :rules="[{required: 'true', message: '新用户最大可助力金额不能为空'}]">
          <el-input-number v-model="shareRuleLog.maxNewUserHelpMoney" :step="1" :min="0" size="medium" disabled/>&nbsp;&nbsp;元
        </el-form-item>
        <el-form-item label="新用户最小可助力金额" v-if="type ==3" prop="minNewUserHelpMoney" :rules="[{required: 'true', message: '新用户最小可助力金额不能为空'}]">
          <el-input-number v-model="shareRuleLog.minNewUserHelpMoney" :step="1" :min="0" size="medium" disabled/>&nbsp;&nbsp;元
        </el-form-item>
        <el-form-item label="老用户最大可助力金额" v-if="type ==3" prop="maxOldUserHelpMoney" :rules="[{required: 'true', message: '老用户最大可助力金额不能为空'}]">
          <el-input-number v-model="shareRuleLog.maxOldUserHelpMoney" :step="1" :min="0" size="medium" disabled/>&nbsp;&nbsp;元
        </el-form-item>
        <el-form-item label="老用户最小可助力金额" v-if="type ==3" prop="minOldUserHelpMoney" :rules="[{required: 'true', message: '老用户最小可助力金额不能为空'}]">
          <el-input-number v-model="shareRuleLog.minOldUserHelpMoney" :step="1" :min="0" size="medium" disabled/>&nbsp;&nbsp;元
        </el-form-item>
        <el-form-item label="活动持续时长" v-if="type ==3" prop="hours" :rules="[{required: 'true', message: '活动持续时长不能为空'}]">
          <el-input-number v-model="shareRuleLog.hours" :step="1" :min="0" size="medium" disabled/>&nbsp;&nbsp;小时
        </el-form-item>
        <!--        获取基础减肥基金-->
        <el-form-item label="活动是否开启" v-if="type ==1" prop="isOpen" :rules="[{required: 'true', message: '活动是否开启不能为空'}]">
          <el-switch v-model="shareRuleLog.isOpen" active-text="开启" inactive-text="关闭" disabled/>
        </el-form-item>
        <el-form-item label="减重范围最小体重" v-if="type == 1" prop="minWeight" :rules="[{required: 'true', message: '减重范围最小体重不能为空'}]">
          <el-input-number v-model="shareRuleLog.minWeight" :step="0.1" :min="0.000" size="medium"/>&nbsp;&nbsp;KG
        </el-form-item>
        <el-form-item label="减重范围最大体重" v-if="type == 1" prop="maxWeight" :rules="[{required: 'true', message: '减重范围最大体重不能为空'}]">
          <el-input-number v-model="shareRuleLog.maxWeight" :step="0.1" :min="0.000" size="medium"/>&nbsp;&nbsp;KG
        </el-form-item>
        <el-form-item label="每日领取减肥基金人数" v-if="type == 1" prop="peopleNum" :rules="[{required: 'true', message: '每日领取减肥基金人数不能为空'}]">
          <el-input-number v-model="shareRuleLog.peopleNum" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;人
        </el-form-item>
        <el-form-item label="获取减肥基金概率" v-if="type == 1" prop="probability" :rules="[{required: 'true', message: '获取减肥基金概率不能为空'}]">
          <el-input-number v-model="shareRuleLog.probability" :step="1" :min="0" size="medium"/> %
        </el-form-item>
        <el-form-item label="基础减肥基金倍数" v-if="type == 1" prop="baseFund" :rules="[{required: 'true', message: '基础减肥基金倍数不能为空'}]">
          <el-input-number v-model="shareRuleLog.baseFund" :step="0.1" :min="0" size="medium"/>&nbsp;&nbsp;倍
        </el-form-item>
<!--        <el-form-item label="基础减肥基金最低" v-if="type == 1" prop="minBasicsFund" :rules="[{required: 'true', message: '基础减肥基金最低不能为空'}]">-->
<!--          <el-input-number v-model="shareRuleLog.minBasicsFund" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;元-->
<!--        </el-form-item>-->
<!--        <el-form-item label="基础减肥基金最高" v-if="type == 1" prop="maxBasicsFund" :rules="[{required: 'true', message: '基础减肥基金最高不能为空'}]">-->
<!--          <el-input-number v-model="shareRuleLog.maxBasicsFund" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;元-->
<!--        </el-form-item>-->
        <!--        减重分享-->
        <el-form-item label="是否可参与不同用户助力" v-if="type == 2" prop="isNo" :rules="[{required: 'true', message: '是否可参与不同用户助力不能为空'}]">
          <el-switch v-model="shareRuleLog.isNo" active-text="可以" inactive-text="不可"/>
        </el-form-item>
        <el-form-item label="新用户最大可助力金额" v-if="type == 2" prop="newUserMaxMoney" :rules="[{required: 'true', message: '新用户最大可助力金额不能为空'}]">
          <el-input-number v-model="shareRuleLog.newUserMaxMoney" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;元
        </el-form-item>
        <el-form-item label="新用户最小可助力金额" v-if="type == 2" prop="newUserMinMoney" :rules="[{required: 'true', message: '新用户最小可助力金额不能为空'}]">
          <el-input-number v-model="shareRuleLog.newUserMinMoney" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;元
        </el-form-item>
        <el-form-item label="老用户最大可助力金额" v-if="type == 2" prop="oldUserMaxMoney" :rules="[{required: 'true', message: '老用户最大可助力金额不能为空'}]">
          <el-input-number v-model="shareRuleLog.oldUserMaxMoney" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;元
        </el-form-item>
        <el-form-item label="老用户最小可助力金额" v-if="type == 2" prop="oldUserMinMoney" :rules="[{required: 'true', message: '老用户最小可助力金额不能为空'}]">
          <el-input-number v-model="shareRuleLog.oldUserMinMoney" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;元
        </el-form-item>
        <el-form-item label="活动结束时间点" v-if="type == 2" prop="time" :rules="[{required: 'true', message: '活动持续时长不能为空'}]">
          <el-time-picker v-model="shareRuleLog.time" :picker-options="{ selectableRange: '00:00:00 - 24:00:00' }" placeholder="任意时间点"/>
        </el-form-item>
        <!--        提现记录-->
        <el-form-item label="最低提现金额" v-if="type == 4" prop="amount" :rules="[{required: 'true', message: '最低提现金额不能为空'}]">
          <el-input-number v-model="shareRuleLog.amount" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;元
        </el-form-item>
        <!--        转发得积分基本规则-->
        <el-form-item label="每个用户每天最多转发得积分数量" v-if="type == 5" prop="maxTransmitNum" :rules="[{required: 'true', message: '每个用户每天最多转发得积分数量不能为空'}]">
          <el-input-number v-model="shareRuleLog.maxTransmitNum" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;次
        </el-form-item>
        <el-form-item label="默认积分重置天数" v-if="type == 5" prop="defaultRestartDay" :rules="[{required: 'true', message: '默认积分重置天数不能为空'}]">
          <el-input-number v-model="shareRuleLog.defaultRestartDay" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;天
        </el-form-item>
        <el-form-item label="默认积分数值" v-if="type == 5" prop="defaultIntegral" :rules="[{required: 'true', message: '默认积分数值不能为空'}]">
          <el-input-number v-model="shareRuleLog.defaultIntegral" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;分
        </el-form-item>
        <!--        修改记录-->
        <el-form-item label="修改时间">
          <el-date-picker v-model="shareRuleLog.updateDate" type="datetime" disabled/>
        </el-form-item>
        <el-form-item label="修改用户">
          <el-input v-model="shareRuleLog.name" size="medium" disabled style="width: 50%;"/>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
    import {
      findAllShareOrderRuleLogsAjax,
      updShareOrderRuleAjax,
      findShareOrderRuleAjax,
      findAllShareWeightRuleLogsAjax,
      updShareWeightRuleAjax,
      findShareWeightRuleAjax,
      findAllShareWeightHelpRuleLogsAjax,
      updShareWeightHelpRuleAjax,
      findShareWeightHelpRuleAjax,
      findAllWithdrawalAmountLimitConfigLogsAjax,
      findWithdrawalAmountLimitConfigAjax,
      editWithdrawalAmountLimitConfigAjax,
      findAllComMsgTransmitRuleLogsAjax,
      editComMsgTransmitRuleAjax,
      findMsgTransmitRuleAjax,
    } from "../../api"
    import {
      dateFormatter
    } from "../../util"
    import {mapActions, mapState} from "vuex"

    export default {
      data() {
        return {
          shareRule: {
            // 订单返现
            sections: [],
            isOpen: true,
            orderMoney: null,
            maxReturRatio: null,
            isMore: false,
            maxNewUserHelpMoney: null,
            minNewUserHelpMoney: null,
            maxOldUserHelpMoney: null,
            minOldUserHelpMoney: null,
            hours: null,
            // 基础减肥基金
            minWeight: null,
            maxWeight: null,
            peopleNum: null,
            probability: null,
            baseFund: null,
            // minBasicsFund: null,
            // maxBasicsFund: null,
            // 基础减肥基金
            isNo: 0,
            newUserMinMoney: null,
            newUserMaxMoney: null,
            oldUserMaxMoney: null,
            oldUserMinMoney: null,
            time: null,
            // 提现规则
            amount: null,
            // 转发得积分基本规则
            maxTransmitNum: null,
            defaultRestartDay: null,
            defaultIntegral: null,
            // 修改记录
            updateDate: null,
            userId: null,
            name: null,
          },
          sectionsShow: false,
          type: 0,
          updateDates: [],
          shareRuleLogs: [{}],
          shareRuleLog: {},
          logIndex: 0,
        }
      },

      computed: {
          ...mapState(['loading', 'maijiUser', "pickerOptions"])
      },

      watch: {
        $route: function () {
          const fullPath = this.$route.fullPath
          if (fullPath.includes('weightShare')) this.type=1
          if (fullPath.includes('weightHelp')) this.type=2
          if (fullPath.includes('orderReturn')) this.type=3
          if (fullPath.includes('withdrawal')) this.type=4
          this.findShareRule()
        },

        logIndex: function (value) {
          this.shareRuleLog = this.shareRuleLogs[value]
      }
    },

      async mounted () {
        const fullPath = this.$route.fullPath
        if (fullPath.includes('weightShare')) this.type = 1
        if (fullPath.includes('weightHelp')) this.type = 2
        if (fullPath.includes('orderReturn')) this.type = 3
        if (fullPath.includes('withdrawal')) this.type = 4
        if (fullPath.includes('transmit')) {
          this.type = 5
          await this.getMaijiTokenVuex()
        }
        this.findShareRule()
      },

      methods: {
        ...mapActions(["loadingOpen", 'getMaijiTokenVuex']),

        async findShareRule() {
            let result = {}
            if (this.type == 1) result = await findShareWeightRuleAjax()
            if (this.type == 2) result = await findShareWeightHelpRuleAjax()
            if (this.type == 3) result = await findShareOrderRuleAjax()
            if (this.type == 4) result = await findWithdrawalAmountLimitConfigAjax(1)
            if (this.type == 5) result = await findMsgTransmitRuleAjax(1)
            if (result.status == "SUCCESS") {
              this.shareRule= result.data || {}
              if (this.type == 1) this.shareRule.probability = this.shareRule.probability * 100
              if (this.type == 2) {
                this.shareRule.isNo = this.shareRule.isNo && true || false
                const times = this.shareRule.time.split(':')
                this.shareRule.time =new Date(2018, 5, 18, times[0], times[1], times[2])
              }
              if (this.type == 3) this.shareRule.sections = this.shareRule.sections
                .map(s => Object.assign(s, {maxReturRatio: s.maxReturRatio * 100}))
              this.findAllShareRuleLogs()
            }
            this.loading.close()
        },

        async findAllShareRuleLogs(updateDates) {
          if (updateDates) this.updateDates = updateDates
          let result = {}
          if (this.type == 1) result = await findAllShareWeightRuleLogsAjax(this.updateDates)
          if (this.type == 2) result = await findAllShareWeightHelpRuleLogsAjax(this.updateDates)
          if (this.type == 3) result = await findAllShareOrderRuleLogsAjax(this.updateDates)
          if (this.type == 4) result = await findAllWithdrawalAmountLimitConfigLogsAjax(this.updateDates)
          if (this.type == 5) result = await findAllComMsgTransmitRuleLogsAjax(this.updateDates)
          if (result.status == "SUCCESS") {
            if (result.data.length > 0) this.shareRuleLogs = result.data
            else this.shareRuleLogs = [this.shareRule]
            if (this.type == 1) this.shareRuleLogs = this.shareRuleLogs.map(sl =>
              Object.assign(sl, {probability: sl.probability * 100}))
            if (this.type == 2) this.shareRuleLogs = this.shareRuleLogs.map(sl => Object.assign(sl,
              {time: new Date(2018, 5, 18, sl.time.split(':')[0], sl.time.split(':')[1], sl.time.split(':')[2])}))
            if (this.type == 3) this.shareRuleLogs = this.shareRuleLogs.map(sl => Object.assign(sl,
              {sections: sl.sections.map(s => Object.assign(s, {maxReturRatio: sl.maxReturRatio * 100}))}))
            this.shareRuleLog = this.shareRuleLogs[0]
          }
          this.logIndex = 0
          this.loading.close()
        },

        updShareRule() {
          this.loadingOpen()
          this.$refs.ruleFrom.validate(async valid => {
            if (!valid) {
              this.loading.close();
              return this.$message.error(`规则编辑失败，请确认编辑规范！`)
            }
            this.shareRule.updateDate= new Date()
            this.shareRule.userId = this.maijiUser.uuId
            this.shareRule.name= this.maijiUser.name
            if (this.type == 1) this.shareRule.probability = this.shareRule.probability / 100
            if (this.type == 2) {
              this.shareRule.isNo = this.shareRule.isNo && 1 || 0
              this.shareRule.time =dateFormatter(this.shareRule.time, true)
            }
            if (this.type == 3) this.shareRule.sections= this.shareRule.sections
                .filter(s => s.orderMoney != null && s.maxReturRatio > 0)
                .map(s => Object.assign(s, {maxReturRatio: s.maxReturRatio / 100}))
            if (this.type == 4) this.shareRule.type = 1
            let result = {}
            if (this.type == 1) result = await updShareWeightRuleAjax(this.shareRule)
            if (this.type == 2) result = await updShareWeightHelpRuleAjax(this.shareRule)
            if (this.type == 3) result = await updShareOrderRuleAjax(this.shareRule)
            if (this.type == 4) result = await editWithdrawalAmountLimitConfigAjax(this.shareRule)
            if (this.type == 5) result = await editComMsgTransmitRuleAjax(this.shareRule)
            if (result.status != "SUCCESS") {
              this.loading.close()
              return this.$message.error(`规则编辑失败，请稍后重试`)
            }
            this.findShareRule()
            this.findAllShareRuleLogs()
            this.$message.success(`规则编辑成功`)
            this.loading.close()
          });
        },
      }
    }
</script>

<style>
  .orderReturnRule .elDivider1 {
    margin-top: 0 !important;
  }
</style>
