<template>
  <el-dialog :visible.sync="commentMsgShow" width="60%">
    <span slot="title">选择动态：<span style="color: gray;">回复 / 审核 / 屏蔽 动态评论</span></span>
    <el-row style="margin-bottom: 10px;">
      <el-input v-model="searchMsg.nickName" placeholder="用户名关键词搜索" size="small" style="width: 29%;">
        <el-button slot="append" icon="el-icon-search" @click="findAllMsgs(pageOne)"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="searchMsg.nickName = ''; findAllMsgs(pageOne)"/>
      </el-input>
      <el-input v-model="searchMsg.title" placeholder="动态标题关键词搜索" size="small" style="width: 29%;">
        <el-button slot="append" icon="el-icon-search" @click="findAllMsgs(pageOne)"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="searchMsg.title = ''; findAllMsgs(pageOne)"/>
      </el-input>
      <el-input v-model="searchMsg.content" placeholder="动态内容关键词搜索" size="small" style="width: 29%;">
        <el-button slot="append" icon="el-icon-search" @click="findAllMsgs(pageOne)"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="searchMsg.content = ''; findAllMsgs(pageOne)"/>
      </el-input>
  </el-row>
    <el-table stripe v-loading="msgsTableLoading"
              max-height="432" :data="msgTable"
              :header-cell-style="{backgroundColor: '#DCDFE6'}"
              :cell-style="{paddingTop: '7px', paddingBottom: '3px'}">
      <el-table-column type="index" width="45" align="center"/>
      <el-table-column label="头像" width="75">
        <template slot-scope="scope">
          <img :src="scope.row.user.headUrl" v-show="scope.row.user.headUrl" width="45" height="45"/>
          <img src="../container/images/maijiCat.png" v-show="! scope.row.user.headUrl" width="45"
               height="45"/>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="150"
                       show-overflow-tooltip
                       :formatter="(row) => row.user.nickName || '麦吉用户'">
      </el-table-column>
      <el-table-column label="动态标题/内容" min-width="345"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <span style="color: gray;">标题：</span><span>{{scope.row.title || '—'}}</span><br/>
          <span style="color: gray;">内容：</span><span>{{scope.row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column label="评论数" width="68">
        <template slot-scope="scope">
          <el-tag type="primary">{{scope.row.allCCCount}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="未审核" width="68">
        <template slot-scope="scope">
          <el-tag type="danger">{{scope.row.notReadCount}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="选择动态" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="checkComment(scope.row)">查看评论 <i class="el-icon-search"/></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 10px; text-align: right;" v-if="metaData">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page.sync="metaData.page" :page-sizes="[10, 25, 50, 100]" :page-size="metaData.size"
          :total="metaData.total" layout="total, sizes, prev, pager, next, jumper"/>
    </el-row>
  </el-dialog>
</template>

<script>
  import {
    findAllMsgsAjax,
  } from '../../api'
    import {mapState, mapActions} from 'vuex'

    export default {
      data() {
          return {
              searchMsg: {
                nickName: '',
                title: '',
                content: '',
              },
              msgTable: null,
              msgsTableLoading: false,
              metaData: {}
          }
      },

      computed: {
          ...mapState(['loading']),
          ...mapState('community', ['commentMsg']),

          pageOne () {
            return {
              page: 1,
              size: this.metaData.size
            }
          },

          commentMsgShow: {
              get () {
                  return this.$store.state.community.commentMsgShow
              },
              set (value) {
                  this.commentMsgShowChange(value)
              }
          },
      },

      watch: {
          commentMsgShow: function (value) {
              if (value) this.findAllMsgs(this.pageOne)
          }
      },

      methods: {
          ...mapActions('community', ['commentMsgShowChange', 'commentMsgChange']),

        //查看评论
        checkComment(msgs) {
            this.commentMsgChange(msgs)
            this.commentMsgShowChange(false)
        },

        async findAllMsgs(metaData) {
          this.msgsTableLoading = true
          const result = await findAllMsgsAjax(this.searchMsg, metaData || this.metaData)
          if (result.status == "SUCCESS") {
            this.msgTable = result.data.sort((c1, c2) =>c2.notReadCount - c1.notReadCount)
            this.metaData = result.resMetaData
            this.commentMsgChange(this.msgTable[0])
            this.msgsTableLoading = false
          }
          this.loading.close()
        },

        // 监听分页数量改变
        handleSizeChange(val) {
            this.metaData.page = 1
            this.metaData.size = val
            this.findAllMsgs()
        },

        // 监听分页页码改变
        handleCurrentChange(val) {
            this.metaData.page = val
            this.findAllMsgs()
        },
      },

      beforeDestroy() {
        PubSub.unsubscribe("findAllMsgs")
      }
    }
</script>

<style>
    .el-table .success-row {
        color: #409EFF;
    }
    .el-form-item {
        text-align: left;
    }
    .el-dialog__body {
        padding-top: 10px;
    }

    .el-tooltip__popper {
      max-width: 30%;
    }
</style>
