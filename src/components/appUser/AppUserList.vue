<template>
  <div>
    <el-row style="margin-bottom: 10px;">
      <el-button type="success" size="small" @click="findAllMaijiUsers(pageOne)">
        立即刷新&nbsp;<i class="el-icon-refresh"/></el-button>
      <el-input v-model="searchAppUser.nickName" placeholder="用户名关键词搜索" size="small" style="width: 25%;">
        <el-button slot="append" icon="el-icon-search" @click="findAllMaijiUsers"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="searchAppUser.nickName = ''; findAllMaijiUsers(pageOne)"/>
      </el-input>
      <el-input v-model="searchAppUser.tel" placeholder="手机号关键词搜索" size="small" style="width: 25%;">
        <el-button slot="append" icon="el-icon-search" @click="findAllMaijiUsers"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="searchAppUser.tel = ''; findAllMaijiUsers(pageOne)"/>
      </el-input>
      <el-date-picker v-model="searchAppUser.regDates" size="small" style="width: 20%;" type="daterange" @change="findAllMaijiUsers(pageOne)"
                clearable range-separator="至" start-placeholder="注册时间开始" end-placeholder="注册时间结束" :picker-options="pickerOptions"/>
      <el-button type="warning" size="small" @click="warningWeightUsers" v-if="path.includes('weightCheck')">
        重点监测用户&nbsp;<i class="el-icon-refresh"/></el-button>
      <el-button type="success" size="small" @click="warningWeightUsersShow = false; findAllMaijiUsers()"
         v-if="path.includes('weightCheck')">全部用户&nbsp;<i class="el-icon-refresh"/></el-button>
    </el-row>
    <el-table stripe v-loading="tableLoading" @sort-change="orderSortChange"
              :data="appUserTable" :default-sort="defaultSort" :row-class-name="rowClassNameMethod"
              :header-cell-style="{backgroundColor: '#DCDFE6'}" :cell-style="{paddingTop: '7px', paddingBottom: 0}">
        <el-table-column type="index" width="40" align="center"/>
        <el-table-column label="头像" width="65">
            <template slot-scope="scope">
                <img :src="scope.row.headUrl" v-show="scope.row.headUrl" width="45" height="45"/>
                <img src="../container/images/maijiCat.png" v-show="! scope.row.headUrl" width="45"
                     height="45"/>
            </template>
        </el-table-column>
        <el-table-column label="用户名" width="110"
                         show-overflow-tooltip
                         :formatter="(row) => row.nickName? row.nickName: '麦吉用户'"/>
        <el-table-column label="出生日期" width="105" v-if="path.includes('list') || path.includes('weightCheck')"
                       prop="birth"
                       sortable="custom"
                       :formatter="(row) => dateFormatter(row.birth).substr(0, 10)"/>
        <el-table-column label="性别" width="90" v-if="path.includes('list') || path.includes('weightCheck')">
          <template slot-scope="scope">
            <el-tag v-show="scope.row.sex == 0">女 <i class="el-icon-user"/></el-tag>
            <el-tag type="success" v-show="scope.row.sex == 1">男 <i class="el-icon-user-solid"/></el-tag>
            <el-tag type="info" v-show="! [0, 1].includes(scope.row.sex)">&nbsp;&nbsp;<i class="el-icon-s-custom"/>&nbsp;&nbsp;</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="手机号码" width="120" v-if="! path.includes('weightCheck')"
                         prop="appUser.tel"/>
        <el-table-column label="注册时间" min-width="100" v-if="path.includes('list')"
                         prop="reg_date"
                         sortable="custom"
                         :formatter="(row) => dateFormatter(row.regDate)"/>
        <el-table-column label="可用余额" width="90" v-if="! (path.includes('list') || path.includes('weightCheck'))"
                         :formatter="(row) => row.capitalMain && row.capitalMain.money + ' 元'"/>
        <el-table-column label="订单返现" width="90" v-if="! (path.includes('list') || path.includes('weightCheck'))"
                         :formatter="(row) => row.capitalMain && row.capitalMain.returnMoney + ' 元'"/>
        <el-table-column label="分销提成(可提现)" width="90" v-if="! (path.includes('list') || path.includes('weightCheck'))"
                         :formatter="(row) => row.capitalMain && row.capitalMain.distributionMoney + ' 元'"/>
        <el-table-column label="分销提成(冻结中)" width="90" v-if="! (path.includes('list') || path.includes('weightCheck'))"
                       :formatter="(row) => row.capitalMain && row.capitalMain.frozenCapital + ' 元'"/>
        <el-table-column label="减肥基金" width="90" v-if="! (path.includes('list') || path.includes('weightCheck'))"
                         :formatter="(row) => row.capitalMain && row.capitalMain.fund + ' 元'"/>
        <el-table-column label="积分" width="90" v-if="! (path.includes('list') || path.includes('weightCheck'))"
                         :formatter="(row) => row.capitalMain && row.capitalMain.integral + ' 分'"/>
        <el-table-column label="身高" width="90" v-if="path.includes('list') || path.includes('weightCheck')"
                         prop="height"
                         sortable="custom"
                         :formatter="(row) => row.height && row.height + ' cm' || '--'"/>
        <el-table-column label="原始体重" width="105" v-if="path.includes('list') || path.includes('weightCheck')"
                         prop="weight"
                         sortable="custom"
                         :formatter="(row) => row.weight && row.weight + ' kg' || '--'"/>
        <el-table-column label="记录时间1" width="100" v-if="path.includes('weightCheck')"
                         :formatter="(row) => row.wcls[2] && dateFormatter(row.wcls[2].recordTime).substr(0, 10) || '--'"/>
        <el-table-column label="记录体重1" width="100" v-if="path.includes('weightCheck')"
                           :formatter="(row) => row.wcls[2] && row.wcls[2].currentWeight + ' kg' || '--'"/>
        <el-table-column label="记录时间2" width="100" v-if="path.includes('weightCheck')"
                         :formatter="(row) => row.wcls[1] && dateFormatter(row.wcls[1].recordTime).substr(0, 10) || '--'"/>
        <el-table-column label="记录体重2" width="100" v-if="path.includes('weightCheck')"
                           :formatter="(row) => row.wcls[1] && row.wcls[1].currentWeight + ' kg' || '--'"/>
        <el-table-column label="记录时间3" width="100" v-if="path.includes('weightCheck')"
                         :formatter="(row) => row.wcls[0] && dateFormatter(row.wcls[0].recordTime).substr(0, 10) || '--'"/>
        <el-table-column label="记录体重3" width="100" v-if="path.includes('weightCheck')">
          <template slot-scope="scope">
            <span v-if="! scope.row.wcls[0]">--</span>
            <el-tag type="warning" v-if="scope.row.wcls[0] && scope.row.wcls[0].currentWeight > scope.row.weight">{{scope.row.wcls[0].currentWeight}} kg</el-tag>
            <el-tag v-if="scope.row.wcls[0] && scope.row.wcls[0].currentWeight < scope.row.weight && scope.row.wcls[0].currentWeight > scope.row.targetWeight">{{scope.row.wcls[0].currentWeight}} kg</el-tag>
            <el-tag type="success" v-if="scope.row.wcls[0] && scope.row.wcls[0].currentWeight < scope.row.targetWeight">{{scope.row.wcls[0].currentWeight}} kg</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="当前体重" width="105" v-if="path.includes('list') || path.includes('weightCheck')"
                         prop="current_weight"
                         sortable="custom">
          <template slot-scope="scope">
            <span v-show="! scope.row.currentWeight">-- </span>
            <el-tag type="warning" v-show="scope.row.currentWeight > scope.row.weight">{{scope.row.currentWeight}} kg</el-tag>
            <el-tag v-show="scope.row.currentWeight < scope.row.weight && scope.row.currentWeight > scope.row.targetWeight">{{scope.row.currentWeight}} kg</el-tag>
            <el-tag type="success" v-show="scope.row.currentWeight < scope.row.targetWeight">{{scope.row.currentWeight}} kg</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="目标体重" width="105" v-if="path.includes('list') || path.includes('weightCheck')"
                         prop="target_weight"
                         sortable="custom"
                         :formatter="(row) => row.targetWeight && row.targetWeight + ' kg' || '--'"/>
        <el-table-column label="操作" fixed="right" min-width="140" v-if="! path.includes('list')">
          <template slot-scope="scope" v-if="! path.includes('list')">
            <el-button type="primary" size="small" @click="weightLogsPreview(scope.row)" v-if="path.includes('weightCheck')">查看体重记录 <i class="el-icon-notebook-2"/></el-button>
            <el-button type="primary" size="small" @click="logsPreview(scope.row, 1)" v-if="path.includes('order')">订单返现流水 <i class="el-icon-notebook-2"/></el-button>
            <el-button type="primary" size="small" @click="logsPreview(scope.row, 2)" v-if="path.includes('fund')">减肥基金流水 <i class="el-icon-notebook-2"/></el-button>
            <el-button type="primary" size="small" @click="logsPreview(scope.row, 3)" v-if="path.includes('integral')">积分流水 <i class="el-icon-notebook-2"/></el-button>
            <el-button type="primary" size="small" @click="logsPreview(scope.row, 4)" v-if="path.includes('distribution')">分销提成流水 <i class="el-icon-notebook-2"/></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120" v-if="path.includes('/appUser/list')">
          <template slot-scope="scope" v-if="path.includes('/appUser/list')">
            <el-button type="danger" size="mini" @click="banAppUser(scope.row.appUser, 1)" v-if="scope.row.appUser.isBan == 0">禁止登录 <i class="el-icon-close"/></el-button>
            <el-button type="success" size="mini" @click="banAppUser(scope.row.appUser, 0)" v-if="scope.row.appUser.isBan == 1">解除禁止 <i class="el-icon-check"/></el-button>
          </template>
        </el-table-column>
      <el-table-column label="登录许可" fixed="right" width="100" v-if="path.includes('/appUser/list')">
        <template slot-scope="scope" v-if="path.includes('/appUser/list')">
          <el-tag type="success" size="mini" v-if="scope.row.appUser.isBan == 0">允许登录 <i class="el-icon-check"/></el-tag>
          <el-tag type="danger" size="mini" v-if="scope.row.appUser.isBan == 1">禁止登录 <i class="el-icon-close"/></el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 10px; text-align: right;">
      <MJ_Pagination/>
    </el-row>
    <el-dialog title="体重记录" :visible.sync="weightLogsShow" width="60%">
        <el-table stripe max-height="456"
                :data="weightLogsTable"
                :header-cell-style="{backgroundColor: '#DCDFE6'}"
                :cell-style="{paddingTop: '7px', paddingBottom: 0}">
        <el-table-column label="头像" width="70">
          <template slot-scope="scope">
            <img :src="weightLogsUser.headUrl" v-show="weightLogsUser.headUrl" width="45" height="45"/>
            <img src="../container/images/maijiCat.png" v-show="! weightLogsUser.headUrl" width="45" height="45"/>
          </template>
        </el-table-column>
        <el-table-column label="用户名" width="90"
                         show-overflow-tooltip
                         :formatter="() => weightLogsUser.nickName? weightLogsUser.nickName: '麦吉用户'"/>
          <el-table-column label="原始体重" width="100"
                           :formatter="() => weightLogsUser.weight && weightLogsUser.weight + ' kg' || '--'"/>
        <el-table-column label="记录体重" width="90"
                         :formatter="(row) => row.currentWeight + ' kg'">
          <template slot-scope="scope">
            <span v-show="! scope.row.currentWeight">-- </span>
            <el-tag type="warning" v-show="scope.row.currentWeight > weightLogsUser.weight">{{scope.row.currentWeight}} kg</el-tag>
            <el-tag v-show="scope.row.currentWeight < weightLogsUser.weight && scope.row.currentWeight > weightLogsUser.targetWeight">{{scope.row.currentWeight}} kg</el-tag>
            <el-tag type="success" v-show="scope.row.currentWeight < weightLogsUser.targetWeight">{{scope.row.currentWeight}} kg</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="目标体重" width="100"
                           :formatter="() => weightLogsUser.targetWeight && weightLogsUser.targetWeight + ' kg' || '--'"/>
        <el-table-column label="记录时间" min-width="100"
                         :formatter="(row) => dateFormatter(row.recordTime).substr(0, 10)"/>
      </el-table>
    </el-dialog>
    <el-dialog :title="dialogTitle(capitalType)" :visible.sync="logsShow" width="60%">
      <CapitalMainLogList :headUrl="headUrl" :nickName="nickName" :userId="userId" :capitalType="capitalType" v-if="logsShow"/>
    </el-dialog>
  </div>
</template>

<script>
    import {
      findAllMaijiUsersAjax,
      banAppUserAjax,
    } from "../../api";
    import {mapState, mapActions} from "vuex";
    import {dateFormatter} from "../../util";
    const MJ_Pagination = () => import('../common/MJ_Pagination.vue')
    const CapitalMainLogList = () => import('./CapitalMainLogList.vue')

    export default {
      components: {
        MJ_Pagination,
        CapitalMainLogList
      },

      data() {
          return {
            appUserTable: [],
            tableLoading: false,
            defaultSort: {
                prop: "appUser.reg_date",
                order: "descending"
            },
            searchAppUser: {
              nickName: "",
              tel: "",
              regDates: null,
              capital: null,
            },
            path: '',
            weightLogsShow: false,
            weightLogsUser: {},
            weightLogsTable: [],
            warningWeightUsersShow: false,
            logsShow: false,
            headUrl: null,
            nickName: null,
            userId: null,
            capitalType: 0
          };
      },

      computed: {
        ...mapState(["loading", "metaData", 'pickerOptions']),

        pageOne: {
          get () {
            return {
              page: 1,
              size: this.metaData.size
            }
          }
        },
      },

      watch: {
        $route: function () {
          this.path = this.$route.path
          this.searchAppUser.capital = true
          if (this.path.includes('list')) this.searchAppUser.capital = null
          if (this.path.includes('weightCheck')) this.searchAppUser.capital = false
          this.findAllMaijiUsers(this.pageOne)
        },
      },

      mounted() {
        this.path = this.$route.path
        this.searchAppUser.capital = true
        if (this.path.includes('list')) this.searchAppUser.capital = null
        if (this.path.includes('weightCheck')) this.searchAppUser.capital = false
        this.findAllMaijiUsers(this.pageOne)
        PubSub.subscribe("updateMetaData", () => {
            this.findAllMaijiUsers()
        })
      },

      methods: {
        ...mapActions(["updateMetaData"]),
        dateFormatter, // 日期格式化

        async banAppUser (appUser, isBan) {
          const result = await banAppUserAjax(Object.assign(appUser, {isBan}))
          if (result.status == "SUCCESS") return this.$message.success(`操作成功`)
          return this.$message.error(`操作失败，请稍后重试`)
        },

        // 获取表格数据
        async findAllMaijiUsers(metaData) {
          this.tableLoading = true
          const result = await findAllMaijiUsersAjax(this.searchAppUser, metaData || this.metaData)
          if (result.status == "SUCCESS") {
            this.appUserTable = result.data
            if (this.warningWeightUsersShow) this.warningWeightUsers()
          }
          result.resMetaData && this.updateMetaData({metaData: result.resMetaData, init: true})
          this.tableLoading = false
          this.loading.close()
        },

        dialogTitle (capitalType) {
          switch (capitalType) {
            case 1:
              return '订单返现流水'
            case 2:
              return '减肥基金流水'
            case 3:
              return '积分流水'
            case 4:
              return '分销提成流水'
          }
        },

        logsPreview (row, capitalType) {
          this.headUrl = row.headUrl
          this.nickName = row.nickName
          this.userId = row.userId
          this.capitalType = capitalType
          this.logsShow = true
        },

        // 重点监测用户
        warningWeightUsers () {
            this.tableLoading = true
          this.warningWeightUsersShow = true
            this.appUserTable = this.appUserTable.filter(row => {
              const currentWeight2 = row.wcls[2] && row.wcls[2].currentWeight || 0
              const currentWeight1 = row.wcls[1] && row.wcls[1].currentWeight || 0
              const currentWeight0 = row.wcls[0] && row.wcls[0].currentWeight || 0
              if (currentWeight0 && currentWeight1 && currentWeight2)
                if (currentWeight0 < currentWeight1 && currentWeight1 < currentWeight2)
                  return false
                else return true
            })
            this.tableLoading = false
        },

        // 体重记录预览
        weightLogsPreview (row) {
            this.weightLogsShow = true
            this.weightLogsUser = row
            this.weightLogsTable = row.wcls
        },

        // 体重记录连续三次无变化或反弹的
        rowClassNameMethod({row}) {
          const currentWeight2 = row.wcls[2] && row.wcls[2].currentWeight || 0
          const currentWeight1 = row.wcls[1] && row.wcls[1].currentWeight || 0
          const currentWeight0 = row.wcls[0] && row.wcls[0].currentWeight || 0
          if (currentWeight0 && currentWeight1 && currentWeight2)
            if (currentWeight0 < currentWeight1 && currentWeight1 < currentWeight2)
              return 'success-row'
            else return 'warning-row'
        },

        // 表格排序
        orderSortChange({prop, order}) {
            this.searchAppUser.orderBy = prop;
            this.searchAppUser.orderType = order == "ascending" ? "asc" : "desc";
            this.findAllMaijiUsers(this.pageOne)
        },
      },

      beforeDestroy() {
          PubSub.unsubscribe("updateMetaData")
      }
    }
</script>

<style>
    .el-tabs .el-badge__content.is-fixed {
        position: absolute !important;
        top: 9px !important;
        right: 2px !important;
        transform: translateY(-50%) translateX(100%) !important;
    }

    .el-table .success-row {
        color: #67C23A;
    }

    .el-table .warning-row {
        color: #E6A23C;
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
