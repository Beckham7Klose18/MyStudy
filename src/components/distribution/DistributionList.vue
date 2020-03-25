<template>
  <div>
    <el-row style="margin-bottom: 10px;">
      <el-input v-model="searchUser.nickName" placeholder="用户名关键词搜索" size="small" :style="{width: show && '39%' || '23%'}">
        <el-button slot="append" icon="el-icon-search" @click="pidUsers = []; pidUser = {}; Object.assign(searchUser, {pid: '', tel: ''}); findAllUsers(pageOne)"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="pidUsers = []; pidUser = {}; searchUser={pid: '', tel: '', nickName: ''}; findAllUsers(pageOne)"/>
      </el-input>
      <el-input v-model="searchUser.tel" placeholder="手机号关键词搜索" size="small" :style="{width: show && '39%' || '23%'}" style="margin-left: 20px;">
        <el-button slot="append" icon="el-icon-search" @click="pidUsers = []; pidUser = {}; Object.assign(searchUser, {pid: '', nickName: ''}); findAllUsers(pageOne)"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="pidUsers = []; pidUser = {}; searchUser={pid: '', tel: '', nickName: ''}; findAllUsers(pageOne)"/>
      </el-input>
    </el-row>
    <el-table stripe v-loading="appUserTableLoading"
        :data="appUserTable" :header-cell-style="headerCellStyle"
        :cell-style="{paddingTop: '7px', paddingBottom: '3px'}">
      <el-table-column label="上一级" align="center">
        <template slot="header" slot-scope="scope">
            <el-button type="primary" size="mini" @click="pidUsers = []; pidUser = {}; searchUser.pid = ''; findAllUsers(pageOne)"
                       :disabled="! searchUser.pid" icon="el-icon-d-arrow-left">回顶级</el-button>
            <el-button @click="pidUsers.pop(); pidUser = pidUsers.pop() || {}; searchUser.pid = pidUser.uuId; findAllUsers(pageOne)"
                       type="primary" size="mini":disabled="! searchUser.pid" icon="el-icon-arrow-left">上一级</el-button>
        </template>
        <el-table-column label="0" align="center">
          <el-table-column type="index" width="45" align="center"/>
          <el-table-column label="头像" width="80">
            <template slot-scope="scope">
              <img :src="scope.row.userInfo.headUrl" v-show="scope.row.userInfo.headUrl" width="45" height="45"/>
              <img src="../container/images/maijiCat.png" v-show="! scope.row.userInfo.headUrl" width="45" height="45"/>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="pidUser.userInfo && pidUser.userInfo.nickName || '—'">
          <el-table-column label="用户名称" min-width="120"
                           prop="userInfo.nickName"
                           show-overflow-tooltip/>
        </el-table-column>
      </el-table-column>
      <el-table-column label="上级用户" align="center">
        <el-table-column :label="pidUser.tel && pidUser.tel || '—'">
          <el-table-column label="用户手机号" width="120"
                           prop="tel"/>
        </el-table-column>
        <el-table-column label="—">
          <el-table-column label="注册时间" width="100"
                           :formatter="(row) => dateFormatter(row.userInfo.regDate)"/>
        </el-table-column>
        <el-table-column :label="pidUser.distributionNum && pidUser.distributionNum || '—'">
          <el-table-column label="分销码" width="80"
                           prop="distributionNum"/>
        </el-table-column>
        <el-table-column :label="pidUser.capitalMain && pidUser.capitalMain.distributionMoney + ' 元' || '—'">
          <el-table-column label="可提现" width="90"
                           :formatter="(row) => row.capitalMain.distributionMoney + ' 元'"/>
        </el-table-column>
        <el-table-column :label="pidUser.capitalMain && pidUser.capitalMain.frozenCapital + ' 元' || '—'">
          <el-table-column label="冻结中" width="90"
                           :formatter="(row) => row.capitalMain.frozenCapital + ' 元'"/>
        </el-table-column>
        <el-table-column :label="pidUser.pidCount && pidUser.pidCount.toString() || '—'">
          <el-table-column label="下级用户" width="120">
            <template slot-scope="scope">
              <el-tag size="small">{{scope.row.pidCount}}</el-tag>
              <el-button @click="pidUsers.push(scope.row); pidUser = scope.row; searchUser.pid = scope.row.uuId; findAllUsers(pageOne)"
                         type="text" :disabled="scope.row.pidCount == 0">查看用户</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="pidUser.ppidCount && pidUser.ppidCount.toString() || '—'">
          <el-table-column label="下下级用户" width="100"
                           prop="ppidCount"/>
        </el-table-column>
        <el-table-column :label="pidUser.ratio && ((pidUser.ratio * 100) + ' %') || '—'" v-if="! show">
          <el-table-column label="个人比例" width="80">
            <template slot-scope="scope">
              <el-popover placement="bottom" width="190" v-model="scope.row.ratioShow" trigger="manual">
                <el-input size="small" v-model="scope.row.ratioNew" placeholder="设置个人分销比例"><template slot="append">%</template>></el-input>
                <el-button size="mini" plain @click="scope.row.ratioShow = false" style="width: 40%;">取消</el-button>
                <el-button type="primary" size="mini" style="width: 50%; margin-top: 10px;" @click="editDistributionUser(scope.row)">确定</el-button>
                <span slot="reference" @click="scope.row.ratioShow = true" style="color: #409EFF; cursor: pointer;">{{scope.row.ratio && ((scope.row.ratio * 100) + ' %')}} <i class="el-icon-edit"/></span>
              </el-popover>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="—" v-if="! show">
          <el-table-column label="到期时间" width="100">
            <template slot-scope="scope">
              <el-popover placement="bottom" width="190" v-model="scope.row.endTimeShow" trigger="manual">
                <el-date-picker v-model="scope.row.endTime" type="datetime" placeholder="选择到期日期" size="small" style="width: 100%;"/>
                <el-button size="mini" plain @click="scope.row.endTimeShow = false;" style="width: 40%;">取消</el-button>
                <el-button type="primary" size="mini" style="width: 50%; margin-top: 10px;" @click="editDistributionUser(scope.row)">确定</el-button>
                <span slot="reference" @click="scope.row.endTimeShow = true;" style="color: #409EFF; cursor: pointer;">{{dateFormatter(scope.row.endTime)}} <i class="el-icon-edit"/></span>
              </el-popover>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="pidUser.isCancel == 0 && '有效' || pidUser.isCancel == 1 && '失效' || '—'">
          <el-table-column label="分销资格" width="90" v-if="! show">
            <template slot-scope="scope">
              <el-tag type="success" size="mini" v-if="scope.row.isCancel == 0">有效</el-tag>
              <el-tag type="danger" size="mini" v-if="scope.row.isCancel == 1">失效</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120" v-if="! show">
            <template slot-scope="scope">
              <el-button type="success" size="mini" @click="editDistributionUser(Object.assign(scope.row, {isCancel: 0}))" v-if="scope.row.isCancel == 1">添加资格 <i class="el-icon-circle-check"/></el-button>
              <el-button type="danger" size="mini" @click="editDistributionUser(Object.assign(scope.row, {isCancel: 1}))" v-if="scope.row.isCancel == 0">取消资格 <i class="el-icon-circle-close"/></el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120" v-if="show">
            <template slot-scope="scope">
              <el-button type="success" size="mini" @click="chooseUser(scope.row)">选择用户 <i class="el-icon-circle-check"/></el-button>
            </template>
          </el-table-column>
        </el-table-column>
    </el-table-column>
    </el-table>
    <el-row style="margin-top: 10px; text-align: right;">
      <MJ_Pagination/>
    </el-row>
  </div>
</template>

<script>
  import {
    findAllDistributionUsersAjax,
    editDistributionUserAjax
  } from '../../api'
  import {mapState, mapActions} from 'vuex'
  import {dateFormatter} from '../../util'
  const MJ_Pagination = () => import('../common/MJ_Pagination.vue')

  export default {
    components: {
      MJ_Pagination,
    },

    props: {
      show: {
        type: Boolean,
        default: false,
      },
      chooseUser: Function,
    },

    data() {
      return {
        appUserTable: [],
        appUserTableLoading: false,
        pidUser: {},
        pidUsers: [],
        searchUser: {
          pid: '',
          nickName: '',
          tel: null,
        },
      }
    },

    computed: {
      ...mapState(['loading', 'maijiUser', 'metaData']),

      pageOne () {
        return {
          page: 1,
          size: this.metaData.size
        }
      },
    },

    mounted() {
      this.findAllUsers({page: 1, size: this.metaData.size})
      PubSub.subscribe('updateMetaData', () => this.findAllUsers())
      this.loading.close()
    },

    methods: {
      ...mapActions(['updateMetaData']),
      dateFormatter, // 日期格式化

      // 获取分销用户列表
      async findAllUsers(metaData) {
        this.appUserTableLoading = true
        const result = await findAllDistributionUsersAjax(this.searchUser, metaData || this.metaData)
        if (result.status == "SUCCESS") {
          this.appUserTable = result.data
          this.updateMetaData({metaData: result.resMetaData, init: true})
          this.appUserTableLoading = false
        }
      },

      // 编辑分销用户
      async editDistributionUser (row) {
        row.operatorId = this.maijiUser.uuId
        row.operatorName = this.maijiUser.name
        if (row.ratioNew - 0)  row.ratio = row.ratioNew / 100
        const result = await editDistributionUserAjax(row)
        if (result.status != 'SUCCESS') return this.$message.error(`设置失败，请稍后重试`)
        row.ratioShow = false
        this.findAllUsers(this.pageOne)
        return this.$message.success(`设置成功`)
      },

      headerCellStyle ({rowIndex}) {
        if (rowIndex == 1) return {backgroundColor: '#f5f5f5'}
        else return {backgroundColor: '#DCDFE6'}
      },
    },

    beforeDestroy() {
      PubSub.unsubscribe("updateMetaData")
    }
  };
</script>

<style >
  .pid-row {
    background-color: #409EFF;
  }
</style>
