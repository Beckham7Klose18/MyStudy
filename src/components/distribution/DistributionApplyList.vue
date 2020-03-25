<template>
  <div>
    <el-tabs v-model="searchApply.status" @tab-click="findAllDbApplys(pageOne)" type="card">
      <el-tab-pane label="待审核" name="0" />
      <el-tab-pane label="审核通过" name="1"/>
      <el-tab-pane label="审核拒绝" name="2"/>
    </el-tabs>
    <el-row style="margin-bottom: 10px;">
      <el-input v-model="searchApply.name" placeholder="用户名称搜索" size="small" style="width: 25%;">
        <el-button slot="append" icon="el-icon-search" @click="findAllDbApplys(pageOne)"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="searchApply.name = ''; findAllDbApplys(pageOne)"/>
      </el-input>
      <el-input v-model="searchApply.phone" placeholder="用户手机号搜索" size="small" style="width: 25%;">
        <el-button slot="append" icon="el-icon-search" @click="findAllDbApplys(pageOne)"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="searchApply.phone = ''; findAllDbApplys(pageOne)"/>
      </el-input>
      <el-input v-model="searchApply.wxNum" placeholder="用户微信号搜索" size="small" style="width: 25%;">
        <el-button slot="append" icon="el-icon-search" @click="findAllDbApplys(pageOne)"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="searchApply.wxNum = ''; findAllDbApplys(pageOne)"/>
      </el-input>
    </el-row>
    <el-table stripe v-loading="dbApplyTableLoading" :data="dbApplyTable"
        :header-cell-style="{backgroundColor: '#DCDFE6'}" :cell-style="{paddingTop: '7px', paddingBottom: '1px'}">
      <el-table-column type="index"/>
      <el-table-column label="头像" width="70">
        <template slot-scope="scope">
          <img :src="scope.row.userInfo.headUrl" v-show="scope.row.userInfo.headUrl" width="45" height="45"/>
          <img src="../container/images/maijiCat.png" v-show="! scope.row.userInfo.headUrl" width="45" height="45"/>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" min-width="120"
                       prop="userInfo.nickName"
                       show-overflow-tooltip/>
      <el-table-column label="申请实名"width="120"
                       prop="name"
                       show-overflow-tooltip/>
      <el-table-column label="用户手机号" width="120"
                       prop="phone" />
      <el-table-column label="用户微信号" width="120"
                       prop="wxNum"/>
      <el-table-column label="申请/审核时间" width="200">
        <template slot-scope="scope">
          <el-tag size="mini">{{'申请时间：' + dateFormatter(scope.row.inTime)}}</el-tag>
          <el-tag size="mini" type="success" v-if="searchApply.status > 0">{{'审核时间：' + dateFormatter(scope.row.examineTime)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="审核员"width="120" v-if="searchApply.status > 0"
                       prop="operatorName"
                       show-overflow-tooltip/>
      <el-table-column :label="searchApply.status == 0 && '审核申请' || '重新审核'" fixed="right" min-width="180">
        <template slot-scope="scope">
          <el-tag size="mini" type="success" @click="examineDbApply(scope.row.uuId, 1)" style="cursor: pointer;">审核通过 <i class="el-icon-check"/></el-tag>
          <el-tag size="mini" type="danger" @click="examineDbApply(scope.row.uuId, 2)" style="cursor: pointer;">审核拒绝 <i class="el-icon-close"/></el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 10px">
      <el-col style="text-align: right;">
        <MJ_Pagination/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    findAllDbApplysAjax,
    examineDbApplyAjax
  } from '../../api'
  import {mapState, mapActions} from 'vuex'
  import {dateFormatter} from '../../util'
  const MJ_Pagination = () => import('../common/MJ_Pagination.vue')

  export default {
    components: {
      MJ_Pagination,
    },

    data() {
      return {
        dbApplyTable: [],
        dbApplyTableLoading: false,
        searchApply: {
          status: '0',
          phone: '',
          wxNum: '',
        },
      }
    },

    computed: {
      ...mapState(['loading', 'maijiUser', 'metaData']),

      pageOne: {
        get () {
          return {
            page: 1,
            size: this.metaData.size
          }
        }
      },
    },

    mounted() {
      this.findAllDbApplys(this.pageOne)
      PubSub.subscribe('updateMetaData', () => this.findAllDbApplys())
    },

    methods: {
      ...mapActions(['updateMetaData', 'loadingOpen']),
      dateFormatter, // 日期格式化

      // 审核分销申请
      async examineDbApply (uuId, status) {
        this.loadingOpen()
        const data = {
          uuId,
          status,
          operatorId: this.maijiUser.uuId,
          operatorName: this.maijiUser.name
        }
        const result = await examineDbApplyAjax(data)
        if (result.status != "SUCCESS") return this.$message.error(`审核失败，请稍后重试`)
        this.findAllDbApplys(this.pageOne)
        this.$message.success(`审核成功`)
      },

        // 获取角色列表
        async findAllDbApplys(metaData) {
          this.dbApplyTableLoading = true
          const result = await findAllDbApplysAjax(this.searchApply, metaData || this.metaData)
          if (result.status == "SUCCESS") {
            this.dbApplyTable = result.data
            this.updateMetaData({metaData: result.resMetaData, init: true})
            this.dbApplyTableLoading = false
          }
          this.loading.close()
        }
      },

    beforeDestroy() {
      PubSub.unsubscribe("updateMetaData")
    }
  };
</script>

<style >

</style>
