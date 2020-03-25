<template>
  <div>
    <el-row style="margin-bottom: 10px; font-size: 13px;">
        <el-col style="width: 12%;">
            <img :src="commentMsg.user.headUrl" v-if="commentMsg.user.headUrl" width="100" height="100"/>
            <img src="../container/images/maijiCat.png" v-if="! commentMsg.user.headUrl" width="100" height="100"/>
        </el-col>
        <el-col style="width: 18%; margin-right: 10px;">
            <el-row>
                <el-col style="line-height: 50px;">
                    <span style="color: #909399;">未读评论：</span>
                    <el-badge :value="commentMsg.notReadCount">
                        <span style="color: #409EFF; cursor: pointer;"
                              @click="commentMsgShowChange(true)">选择动态</span>
                    </el-badge>
                </el-col>
            </el-row>
            <el-row>
                <el-col style="line-height: 50px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    <span style="color: #909399;">用户名称：{{commentMsg.user && commentMsg.user.nickName}}</span>
                </el-col>
            </el-row>
        </el-col>
        <el-col style="width: 20%;">
          <el-row><el-col style="line-height: 50px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical;"><span style="color: #909399;">动态标题：</span>{{commentMsg.title || '—'}}</el-col></el-row>
          <el-row><el-col style="line-height: 50px;"><span style="color: #909399;">发布时间：</span>{{dateFormatter(commentMsg.publishTime)}}</el-col></el-row>
        </el-col>
        <el-col style="width: 45%;">
          <el-row><el-col style="line-height: 50px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
            <span style="color: #909399;">动态内容：</span>{{commentMsg.content}}</el-col></el-row>
        </el-col>
    </el-row>
    <el-divider/>
    <el-row style="margin-bottom: 10px;">
      <router-link :to="{path: '/community/list', query:{metaDataBack, searchArticle}}" v-if="metaDataBack">
        <el-button type="text" size="small" style="margin-right: 10px;"><i class="el-icon-d-arrow-left"/> 动态列表</el-button>
      </router-link>
      <el-select v-model="examine" size="small">
        <el-option label="评论状态：全部评论" :value="2"/>
        <el-option label="评论状态：未审核" :value="0"/>
        <el-option label="评论状态：审核通过" :value="1"/>
        <el-option label="评论状态：审核拒绝" :value="3"/>
      </el-select>
      <el-input v-model="searchComment.nickName" placeholder="用户名关键词搜索" size="small" style="width: 25%;">
        <el-button slot="append" icon="el-icon-search" @click="findAllComments(pageOne)"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="searchComment.nickName = ''; findAllComments(pageOne)"/>
      </el-input>
      <el-input v-model="searchComment.content" placeholder="评论内容关键词搜索" size="small" style="width: 25%; margin-right: 20px;">
        <el-button slot="append" icon="el-icon-search" @click="findAllComments(pageOne)"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="searchComment.content = ''; findAllComments(pageOne)"/>
      </el-input>
      <el-button type="primary" size="small" @click="readCommentBatch(0)">审核通过 <i class="el-icon-check"/></el-button>
      <el-button type="danger" size="small" @click="readCommentBatch(3)">审核拒绝 <i class="el-icon-close"/></el-button>
    </el-row>
    <el-table stripe v-loading="commentTableLoading" :data="commentTable"
              @selection-change="(rows) => comments = rows"
              :header-cell-style="{backgroundColor: '#DCDFE6'}"
              :cell-style="{paddingTop: '7px', paddingBottom: '3px'}">
      <el-table-column type="selection" width="45"/>
      <el-table-column label="头像" width="70">
          <template slot-scope="scope">
              <img :src="scope.row.sourceUser.headUrl" v-if="scope.row.sourceUser.headUrl" width="45" height="45"/>
              <img src="../container/images/maijiCat.png" v-if="! scope.row.sourceUser.headUrl" width="45" height="45"/>
          </template>
      </el-table-column>
      <el-table-column label="用户昵称" width="100"
                       show-overflow-tooltip
                       :formatter="(row) => row.sourceUser.nickName"/>
      <el-table-column label="评论/回复内容" min-width="400">
        <template slot-scope="scope">
          <el-row>
            <el-tooltip :content="scope.row.content" placement="top-start">
              <el-col style="font-weight: bold; width: 55%; padding-right: 10px;" class="mjn"><span style="line-height: 39px;">评论内容：{{scope.row.content}}</span></el-col>
            </el-tooltip>
            <el-col style="width: 45%;">
              <el-tag type="info" size="mini" v-if="scope.row.readAlready == 0">未审核</el-tag>
              <el-tag type="success" size="mini" v-if="scope.row.readAlready == 1 && scope.row.delete == 0">审核通过</el-tag>
              <el-tag type="danger" size="mini" v-if="scope.row.readAlready == 1 && scope.row.delete != 0">审核拒绝</el-tag>
              <el-popover width="250" trigger="click" popper-class="myPopper" style="margin-left: 10px;">
                <el-input type="textarea" :rows="3" v-model="comment.content" placeholder="请输入回复内容" style="width: 100%;"/>
                <el-button type="primary" size="mini" plain @click="replyComment(scope.row, 2)" style="width: 100%; margin-top: 10px;">确定</el-button>
                <span slot="reference" style="color: #409EFF; cursor: pointer;">回复 <i class="el-icon-edit"/></span>
              </el-popover>
              <span style="margin: 0 10px;">{{dateFormatter(scope.row.publishTime)}}</span>
              <el-button type="text" style="color: green;" @click="comments = [scope.row]; readComment(0);">{{scope.row.readAlready == 1 && '重新' || ''}}审核通过 <i class="el-icon-check"/></el-button>
              <el-button type="text" style="color: red;" @click="comments = [scope.row]; readComment(3);">{{scope.row.readAlready == 1 && '重新' || ''}}审核拒绝 <i class="el-icon-close"/></el-button>
            </el-col>
          </el-row>
          <el-row v-for="cc in scope.row.commentList">
            <el-tooltip :content="cc.content" placement="top-start">
              <el-col style="color: gray; width: 55%; line-height: 39px; padding-right: 10px;" class="mjn">{{cc.sourceUser.nickName}} 回复 {{cc.targetUser.nickName}}：{{cc.content}}</el-col>
            </el-tooltip>
            <el-col style="width: 45%;">
              <el-tag type="info" size="mini" v-if="cc.readAlready == 0">未审核</el-tag>
              <el-tag type="success" size="mini" v-if="cc.readAlready == 1 && cc.delete == 0">审核通过</el-tag>
              <el-tag type="danger" size="mini" v-if="cc.readAlready == 1 && cc.delete != 0">审核拒绝</el-tag>
              <el-popover width="250" trigger="click" popper-class="myPopper" style="margin-left: 10px;">
                <el-input type="textarea" :rows="3" v-model="comment.content" placeholder="请输入回复内容" style="width: 100%;"/>
                <el-button type="primary" size="mini" plain @click="replyComment(cc, 1)" style="width: 100%; margin-top: 10px;">确定</el-button>
                <span slot="reference" style="color: #409EFF; cursor: pointer;">回复 <i class="el-icon-edit"/></span>
              </el-popover>
              <span style="margin: 0 10px;">{{dateFormatter(cc.publishTime)}}</span>
              <el-button type="text" style="color: green;" @click="comments = [cc]; readComment(0);">{{cc.readAlready == 1 && '重新' || ''}}审核通过 <i class="el-icon-check"/></el-button>
              <el-button type="text" style="color: red;" @click="comments = [cc]; readComment(3);">{{cc.readAlready == 1 && '重新' || ''}}审核拒绝 <i class="el-icon-close"/></el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 10px; text-align: right;">
      <MJ_Pagination/>
    </el-row>
    <CommentMsgList/>
  </div>
</template>

<script>
    import {
      findAllCommentsAjax,
      readCommentAjax,
      commentCommentAjax,
      commentReplyAjax,
      findComMsgByIdAjax,
      findAllMsgsAjax
    } from '../../api'
    import {mapState, mapActions} from 'vuex'
    import {dateFormatter} from '../../util'
    const CommentMsgList = () => import('./CommentMsgList.vue')
    const MJ_Pagination = () => import('../common/MJ_Pagination.vue')

    export default {
        components: {
            CommentMsgList,
            MJ_Pagination,
        },

        data() {
            return {
              commentImgsShow: false,
              commentTable: [],
              commentTableLoading: false,
              searchComment: {
                nickName: null,
                content: null,
                msgId: null,
                readAlready: null,
                delete: null,
              },
              comments: [],
              comment: {
                belongId: null,
                content: null,
                status: 3,
                readAlready: 1,
              },
              examine: 2,
              msgId: null,
              metaDataBack: null,
              searchArticle: null,
            }
        },

        computed: {
            ...mapState(['loading', 'metaData']),
            ...mapState('community', ['commentMsg']),

            pageOne () {
              return {
                page: 1,
                size: this.metaData.size
              }
            },
        },

        watch: {
          commentMsg: function (value) {
                if (value.msgId) this.findAllComments(this.pageOne)
            },

          examine: function (value) {
            this.searchComment.readAlready = 1
              if (value == 2) {
                this.searchComment.readAlready = null
                this.searchComment.delete = null
              }
              if (value == 0) {
                this.searchComment.readAlready = 0
                this.searchComment.delete = 0
              }
              if (value == 1) this.searchComment.delete = 0
              if (value == 3) this.searchComment.delete = 3
              this.findAllComments(this.pageOne)
          }
        },

        mounted() {
          this.msgId = this.$route.query.msgId
          this.searchArticle = this.$route.query.searchArticle
          this.metaDataBack = this.$route.query.metaData
          if (this.msgId) this.findComMsgById(this.msgId)
          if (! this.msgId) this.findAllMsgs()
          this.getMaijiTokenVuex()
          PubSub.subscribe('updateMetaData', () => this.findAllComments())
        },

        methods: {
            ...mapActions(['updateMetaData', 'getMaijiTokenVuex']),
            ...mapActions('community', ['commentMsgShowChange', 'commentMsgChange']),
            dateFormatter,  // 日期格式化

          async findAllMsgs() {
            const result = await findAllMsgsAjax({nickName: '', title: '', content: ''}, {page: 1, size: 1})
            if (result.status == "SUCCESS")
              this.commentMsgChange(result.data[0])
            this.loading.close()
          },

          async findComMsgById (msgId) {
            const result = await findComMsgByIdAjax(msgId)
            if (result.status == "SUCCESS")
              this.commentMsgChange(result.data)
          },

          // 获取评论表格数据
          async findAllComments(metaData) {
              this.commentTableLoading = true
              this.searchComment.msgId = this.commentMsg.msgId
              const result = await findAllCommentsAjax(this.searchComment, metaData || this.metaData)
              if (result.status == "SUCCESS") this.commentTable = result.data
              this.commentTableLoading = false
              this.updateMetaData({metaData: result.resMetaData, init: true})
              this.loading.close()
          },

          // 审批量核评论
          async readCommentBatch (read) {
            if (this.comments.length == 0) return this.$message.warning(`请先选择要审核的评论`)
            const type = read == 0 && '通过' || '拒绝'
            this.$confirm('确定审核通过所选评论及其所有回复？', `动态评论审核`, {
              confirmButtonText: `确定审核${type}`,
              cancelButtonText: `取消审核`,
              type: 'warning'
            }).then(() => {
              const commentsAll = [];
              this.comments.forEach(c => {
                commentsAll.push(c)
                if (c.commentList) commentsAll.push(...c.commentList)
              })
              this.comments = commentsAll
              this.readComment(read)
            })
          },

          // 审核评论
          async readComment (read) {
            this.comments = this.comments.map(c => Object.assign(c,
              {delete: read, deleteReason: read == 3 && '审核不通过', readAlready: 1}))
            this.commentTableLoading = true
            const result = await readCommentAjax(this.comments);
            if (result.status != "SUCCESS") return this.$message.error(`操作失败，请稍后重试`)
            this.findAllComments(this.pageOne)
            return this.$message.success(`操作成功`)
          },

          // 回复评论
          async replyComment (row, type) {
            this.commentTableLoading = true
            if (! this.comment.content) return this.$message.warning(`请先输入回复内容`)
            this.comment.belongId = row.commentId
            let result = {}
            if (type == 1) result = await commentReplyAjax(this.comment)
            if (type == 2) result = await commentCommentAjax(this.comment)
            if (result.status != "SUCCESS") return this.$message.error(`回复评论失败，请稍后重试`)
            Array.from(document.getElementsByClassName("myPopper"))
              .forEach(ep => ep.style.display = "none")
            this.findAllComments(this.pageOne)
            return this.$message.success(`回复评论成功`)
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

    .el-divider {
        margin-top: 0;
    }

    .gcDetail {
        margin-bottom: 10px;
    }

    .el-step.is-center .el-step__description {
        padding: 0;
    }

    .orderDetail {
        color: #909399;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .el-switch__label {
        color: #909399;
    }

    .selecte_name {
        width: 7.5%;
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
</style>
