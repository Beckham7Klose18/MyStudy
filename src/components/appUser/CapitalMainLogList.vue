<template>
  <div>
    <el-row style="margin-bottom: 10px; margin-top: -15px;">
      变动时间搜索：<el-date-picker type="daterange" size="small" v-model="changeDates" @change="findAllCapitalMainLogs(pageOne)"
        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" style="width: 45%;"/>
    </el-row>
    <el-table stripe max-height="686"
              v-loading="tableLoading"
              :data="logTable"
              :header-cell-style="{backgroundColor: '#DCDFE6'}"
              :cell-style="{paddingTop: '7px', paddingBottom: '5px'}">
      <el-table-column type="index" width="50" align="center"/>
      <el-table-column label="头像" width="70">
        <template slot-scope="scope">
          <img :src="scope.row.headUrl" v-show="scope.row.headUrl" width="45" height="45"/>
          <img src="../container/images/maijiCat.png" v-show="! scope.row.headUrl" width="45"
               height="45"/>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="110"
                       show-overflow-tooltip
                       :formatter="(row) => row.nickName? row.nickName: '麦吉用户'"/>
      <el-table-column label="变动时间" min-width="150"
                       :formatter="(row) => dateFormatter(row.changeDate)"/>
      <el-table-column label="变动数量" width="100">
      <template slot-scope="scope">
        <el-tag type="success" v-if="scope.row.changeType == 1">+ {{scope.row.changeQuantity}}</el-tag>
        <el-tag type="danger" v-if="scope.row.changeType == 2">- {{scope.row.changeQuantity}}</el-tag>
      </template>
    </el-table-column>
      <el-table-column label="变动说明" min-width="120"
                       prop="remarkStr"/>
    </el-table>
    <el-row style="margin-top: 10px">
        <el-col style="text-align: right;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="metaData.page"
            :page-sizes="[10, 25, 50, 100]"
            :page-size="metaData.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="metaData.total">
          </el-pagination>
        </el-col>
    </el-row>
  </div>
</template>

<script>
    import {
      findAllCapitalMainLogsAjax
    } from "../../api";
    import {mapState, mapActions} from "vuex";
    import {dateFormatter} from "../../util";

    export default {
      props: {
        headUrl: String,
        nickName: String,
        userId: String,
        capitalType: Number
      },

      data() {
          return {
            logTable: [],
            tableLoading: false,
            changeDates: [],
            metaData: {
              page: 1,
              size: 10,
              total: 0
            },
          };
      },

      computed: {
        ...mapState(["loading", "pickerOptions"]),

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
        this.findAllCapitalMainLogs(this.pageOne)
      },

      methods: {
        dateFormatter, // 日期格式化

        // 获取表格数据
        async findAllCapitalMainLogs(metaData) {
          this.tableLoading = true
          const data = {
            userId: this.userId,
            capitalType: this.capitalType,
            changeDates: this.changeDates
          }
          const result = await findAllCapitalMainLogsAjax(data, metaData || this.metaData)
          if (result.status == "SUCCESS") {
            this.logTable = result.data.map(log => Object.assign(log, {headUrl: this.headUrl, nickName: this.nickName}))
            Object.assign(this.metaData, result.resMetaData)
          }
          this.tableLoading = false
          this.loading.close()
        },

        // 监听分页数量改变
        handleSizeChange(val) {
          this.metaData.page = 1
          this.metaData.size = val
          this.findAllGoods()
        },

        // 监听分页页码改变
        handleCurrentChange(val) {
          this.metaData.page = val
          this.findAllGoods()
        },
      },
    };
</script>

<style>

</style>
