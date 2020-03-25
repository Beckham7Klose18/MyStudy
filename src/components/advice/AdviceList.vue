<template>
  <div>
    <el-row style="margin-bottom: 10px;">
      <el-switch v-model="reply" active-text="已回复" inactive-text="未回复"/>
      <el-input v-model="searchAdvice.nickName" placeholder="用户名称关键词搜索" size="small"style="width: 23%; margin-left: 20px;">
        <el-button slot="append" icon="el-icon-search" @click="findAllAdviceFeedbacks(pageOne)"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="searchAdvice.nickName = ''; findAllAdviceFeedbacks(pageOne)"/>
      </el-input>
      <el-input v-model="searchAdvice.content" placeholder="意见内容关键词搜索" size="small"style="width: 23%;">
        <el-button slot="append" icon="el-icon-search" @click="findAllAdviceFeedbacks(pageOne)"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="searchAdvice.content = ''; findAllAdviceFeedbacks(pageOne)"/>
      </el-input>
      <el-date-picker v-model="searchAdvice.inTimes" size="small" @change="findAllAdviceFeedbacks(pageOne)" style="width: 23%;"
        type="daterange" range-separator="至" start-placeholder="反馈时间开始" end-placeholder="反馈时间结束" :picker-options="pickerOptions"/>
    </el-row>
    <el-table stripe v-loading="adviceTableLoading" :data="adviceTable"
          :header-cell-style="{backgroundColor: '#DCDFE6'}" :cell-style="{paddingTop: '7px', paddingBottom: 0}">
      <el-table-column type="index" width="45"/>
      <el-table-column label="头像" width="65">
        <template slot-scope="scope">
          <img :src="scope.row.userInfo.headUrl" v-if="scope.row.userInfo && scope.row.userInfo.headUrl" width="45" height="45"/>
          <img src="../container/images/maijiCat.png" v-if="! (scope.row.userInfo && scope.row.userInfo.headUrl)" width="45" height="45"/>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="120"
                       show-overflow-tooltip
                       :formatter="(row) => row.userInfo && row.userInfo.nickName || '麦吉用户'"/>
      <el-table-column label="意见内容/回复" min-width="230"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <span style="color: gray;">意见内容：</span><span>{{scope.row.content}}</span><br v-if="scope.row.reply"/>
          <div v-if="scope.row.reply"><span style="color: gray;">意见回复：</span><span>{{scope.row.reply}}</span></div>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="80">
        <template slot-scope="scope">
          <el-tag @click="afbImgsShow = true; afbImgs = scope.row.imgs;"  v-if="scope.row.imgs" type="success"
                  size="small" style="cursor: pointer;" >{{scope.row.imgs.length}} 张 <i class="el-icon-search"/></el-tag>
          <el-tag v-if="! scope.row.imgs" type="success" size="small">0 张</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="回复" width="80" v-if="! reply">
        <template slot-scope="scope" v-if="! reply">
          <el-popover width="250" trigger="click"popper-class="myPopper">
            <el-input type="textarea" :rows="3"v-model="replyContent" placeholder="请输入回复内容"/><br/>
            <el-button plain type="primary" size="small" @click="replyAdviceFeedback(scope.row.uuId)" style="width: 100%; margin-top: 10px;">确认回复</el-button>
            <el-tag slot="reference" type="primary" size="small" style="cursor: pointer;">回复</el-tag>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="反馈/回复时间" width="220">
        <template slot-scope="scope">
          <el-tag type="success" size="mini">{{'反馈时间：' + dateFormatter(scope.row.inTime)}}</el-tag><br v-if="scope.row.replyTime"/>
          <el-tag type="danger" size="mini" v-if="scope.row.replyTime">{{'回复时间：' + dateFormatter(scope.row.replyTime)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="回复者" width="100" v-if="reply"
                       prop="replyName" show-overflow-tooltip/>
    </el-table>
    <el-row style="margin-top: 10px; text-align: right;">
      <MJ_Pagination/>
    </el-row>
    <el-dialog :visible.sync="afbImgsShow" width="70%" title="意见反馈图片">
      <el-carousel :interval="3000" type="card" height="456px">
        <el-carousel-item v-for="img in afbImgs" :key="img.uuId">
          <el-image :src="img.url" fit="fill"/>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>

  </div>
</template>

<script>
    import {
        findAllAdviceFeedbacksAjax,
        replyAdviceFeedbackAjax,
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
              adviceTableLoading: false,
              adviceTable: [],
              searchAdvice: {
                replyTime: null,
                nickName: '',
                content: '',
              },
              reply: false,
              replyContent: '',
              afbImgsShow: false,
              afbImgs: [],
            }
        },

        computed: {
          ...mapState(['loading', 'maijiUser', 'pickerOptions', 'metaData']),

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
          reply: function (value) {
                if (! value) this.searchAdvice.replyTime = null
                else this.searchAdvice.replyTime = new Date()
                this.findAllAdviceFeedbacks(this.pageOne)
            }
        },

        mounted() {
            this.findAllAdviceFeedbacks()
            PubSub.subscribe('updateMetaData', () => this.findAllAdviceFeedbacks())
        },

        methods: {
          ...mapActions(['loadingOpen', 'updateMetaData']),
          dateFormatter,  // 日期格式化

          async replyAdviceFeedback (adviceId) {
            if (! this.replyContent) return this.$message.warning(`请先输入回复内容`)
            this.loadingOpen()
            const data = {
              uuId: adviceId,
              reply: this.replyContent,
              replyUserId: this.maijiUser.uuId,
              replyName: this.maijiUser.name
            }
            const result = await replyAdviceFeedbackAjax(data)
            if (result.status != "SUCCESS") return this.$message.error(`回复失败，请稍后重试`)
            this.$message.success(`回复成功`)
            Array.from(document.getElementsByClassName("myPopper"))
              .forEach(ep => ep.style.display = "none")
            this.findAllAdviceFeedbacks()
            this.loading.close()
          },

          // 获取食谱表格数据
          async findAllAdviceFeedbacks(metaData) {
            this.adviceTableLoading = true
            const result = await findAllAdviceFeedbacksAjax(this.searchAdvice, metaData || this.metaData);
            if (result.status == "SUCCESS") {
                this.adviceTable = result.data
                this.updateMetaData({metaData: result.resMetaData, init: true})
                this.adviceTableLoading = false
            }
            this.loading.close()
          },

        },

        beforeDestroy() {
            PubSub.unsubscribe("updateMetaData")
        }
    }
</script>

<style>
    .el-table .success-row {
        background-color: #f5faff;
        color: #409EFF;
    }

    .selecte_name {
        /*width: 7.5%;*/
        font-size: small;
        line-height: 32px;
        text-align: right;
    }

    .selecte_number {
        width: 80px;
    }

    .selecte_middle {
        width: 30px;
        font-size: small;
        line-height: 32px;
        text-align: center;
    }

    .el-input-number--mini {
        width: 80px;
        line-height: 26px;
    }

    .el-input-number.is-controls-right .el-input__inner {
        padding-left: 0px;
        padding-right: 30px;
    }

    /*指定过渡样式*/
    .showSelect-enter-active, .showSelect-leave-active {
        transition: all 1s
    }

    /*指定隐藏时的样式*/
    .showSelect-enter, .showSelect-leave-to {
        opacity: 0;
        transform: translateX(32px)
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

    .el-message-box__header {
        background-color: #f2f9ff;
    }

    .MessageBox1 {
        width: 320px;
    }

    .MessageBox2 {
        width: 420px;
    }

    .MessageBox3 {
        width: 520px;
    }
</style>
