<template>
    <div>
        <el-tabs v-model="labelId" @tab-click="findAllMaijiArticles" type="card">
            <el-tab-pane v-for="label in maijiArticleLabels" :label="label.name" :name="label.uuId"/>
        </el-tabs>
        <el-table stripe v-loading="maijiArticleTableLoading" :data="maijiArticleTable"
                  :header-cell-style="{backgroundColor: '#DCDFE6'}" :cell-style="{paddingTop: '7px', paddingBottom: '3px'}">
            <el-table-column type="index" fixed width="50" align="center"/>
            <el-table-column label="文章封面" width="85">
                <template slot-scope="scope">
                    <img :src="scope.row.img.smallUrl" width="45" height="45"/>
                </template>
            </el-table-column>
            <el-table-column label="文章标题/描述" min-width="500"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <span style="color: gray;">标题：</span><span>{{scope.row.title}}</span><br/>
                <span style="color: gray;">描述：</span><span>{{scope.row.desc}}</span>
              </template>
            </el-table-column>
            <el-table-column label="文章评论" width="120">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="findAllArticleComments(scope.row.uuId, pageOne)">查看评论 <i class="el-icon-zoom-in"/></el-button>
              </template>
            </el-table-column>
            <el-table-column label="排序权重" width="150">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.sortWeight" style="width:60px"/>
                <el-button type="primary" size="mini" @click="del_updMaijiArticle(scope.row, 2)" plain>修改</el-button>
              </template>
            </el-table-column>
            <el-table-column label="文章标签" width="100" align="center">
            <template slot-scope="scope">
              <el-tag :type="elTagType(scope.row.labelName)" size="mini">{{scope.row.labelName}}</el-tag><br/>
              <el-popover trigger="click" width="175" popper-class="myPopper">
                <el-cascader v-model="updateLabels" :options="allMaijiArticleLabels" style="margin-bottom: 12px;"/>
                <el-button type="primary" size="mini" style="width: 100%; margin-top: 10px;" @click="updLabel(scope.row)">确定</el-button>
                <el-tag type="warning" slot="reference" @click="updateLabels = [labelId, scope.row.labelId]"
                        size="mini" style="cursor: pointer;">修改标签&nbsp;<i class="el-icon-edit-outline"/></el-tag>
              </el-popover>
            </template>
          </el-table-column>
            <!--<el-table-column label="文章推荐" width="120">
                <template slot-scope="scope">
                    <el-button type="success" size="mini" v-if="! scope.row.isRecommend" @click="updLabel(scope.row, [labelId, labelId0])">推荐置顶 <i class="el-icon-top"/></el-button>
                    <el-button type="info" size="mini" v-if="scope.row.isRecommend" @click="updLabel(scope.row, [labelId, labelId2])">取消推荐&nbsp;<i class="el-icon-bottom"/></el-button>
                </template>
            </el-table-column>-->
            <el-table-column label="操作" fixed="right" min-width="120">
              <template slot-scope="scope">
                <router-link :to="{path: '/maijiArticle/edit', query:{maijiArticle: scope.row, labelId}}" >
                  <el-button type="primary" size="mini">编辑&nbsp;<i class="el-icon-edit-outline"/></el-button>
                </router-link>
                <el-button type="danger" size="mini" style="margin-left: 10px;" @click="del_updMaijiArticle(scope.row, 1)">删除&nbsp;<i class="el-icon-delete"/></el-button>
              </template>
            </el-table-column>
        </el-table>
        <el-dialog title="麦吉简介：评论列表" :visible.sync="commentShow" width="60%" append-to-body>
          <el-table stripe v-loading="commentTableLoading" max-height="456" :data="commentTable"
                    :header-cell-style="{backgroundColor: '#DCDFE6'}" :cell-style="{paddingTop: '7px', paddingBottom: '5px'}">
            <el-table-column type="index" width="50" align="center"/>
            <el-table-column label="头像" width="70">
              <template slot-scope="scope">
                <img :src="scope.row.sourceUser.headUrl" v-show="scope.row.sourceUser.headUrl" width="45" height="45"/>
                <img src="../container/images/maijiCat.png" v-show="! scope.row.sourceUser.headUrl" width="45" height="45"/>
              </template>
            </el-table-column>
            <el-table-column label="用户名" width="110"
                             show-overflow-tooltip
                             :formatter="(row) => row.sourceUser.nickName? row.sourceUser.nickName: '麦吉用户'"/>
            <el-table-column label="评论/回复内容" min-width="500">
              <template slot-scope="scope">
                <el-row>
                  <el-col style="font-weight: bold; width: 55%;"><span style="line-height: 39px;">评论内容：{{scope.row.content}}</span></el-col>
                  <el-col style="width: 45%;">
                    <el-popover width="250" trigger="click" popper-class="myPopper">
                      <el-input type="textarea" :rows="3" v-model="scope.row.rcontent" placeholder="请输入回复内容" style="width: 100%;"/>
                      <el-button type="primary" size="mini" plain @click="articleComment(scope.row)" style="width: 100%; margin-top: 5px;">确定</el-button>
                      <span slot="reference" style="color: #409EFF; cursor: pointer;">回复 <i class="el-icon-edit"/></span>
                    </el-popover>
                    <span style="margin: 0 10px;">{{dateFormatter(scope.row.inTime)}}</span>
                    <el-button type="danger" size="mini" @click="delArticleComments(scope.row.uuId)">屏蔽 <i class="el-icon-circle-close"/></el-button>
                  </el-col>
                </el-row>
                <el-row v-for="cc in scope.row.list">
                  <el-col style="color: gray; width: 55%; line-height: 39px;">{{cc.sourceUser.nickName}} 回复 {{cc.targetUser.nickName}}：{{cc.content}}</el-col>
                  <el-col style="width: 45%;">
                    <el-popover width="250" trigger="click" popper-class="myPopper">
                      <el-input type="textarea" :rows="3" v-model="cc.rcontent" placeholder="请输入回复内容" style="width: 100%;"/>
                      <el-button type="primary" size="mini" plain @click="articleComment(cc)" style="width: 100%; margin-top: 5px;">确定</el-button>
                      <span slot="reference" style="color: #409EFF; cursor: pointer;">回复 <i class="el-icon-edit"/></span>
                    </el-popover>
                    <span style="margin: 0 10px;">{{dateFormatter(cc.inTime)}}</span>
                    <el-button type="danger" size="mini" @click="delArticleComments(cc.uuId)">屏蔽 <i class="el-icon-circle-close"/></el-button>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="margin-top: 10px; text-align: right;">
            <MJ_Pagination/>
          </el-row>
        </el-dialog>
    </div>
</template>

<script>
    import {
      findAllArticleCommentsAjax,
      del_updMaijiArticleByIdAjax,
      findAllMaijiArticleByLabelIdAjax,
      findAllLabelBySourceAjax,
      delMaijiArticleByIdAjax,
      updMaijiArticleLabelAjax,
      articleCommentAjax,
      delArticleCommentsAjax
    } from '../../api'
    import {dateFormatter} from "../../util"
    import {mapActions, mapState} from "vuex"
    const MJ_Pagination = () => import('../common/MJ_Pagination.vue')

    export default {
      components: {
        MJ_Pagination,
      },

      data() {
        return {
          maijiArticleTable: [],
          maijiArticleTableLoading: false,
          labelId: null,
          labelId0: null,
          labelId2: null,
          maijiArticleLabels: [],
          allMaijiArticleLabels: [],
          updateLabels: null,
          commentShow: false,
          articleId: null,
          commentTableLoading: false,
          commentTable: []
        }
      },

      computed: {
        ...mapState(['loading', 'loadingOptions', 'pickerOptions', "metaData"]),

        pageOne: {
          get () {
            return {
              page: 1,
              size: this.metaData.size
            }
          },
        },
      },

      watch: {
          labelId: function (value) {
              if (value) return
              const maijiArticleLabel = this.allMaijiArticleLabels.find(mLabel => mLabel.value == value);
              this.labelId0 = maijiArticleLabel.children.find(mLabel => mLabel.label == '推荐置顶').value
              this.labelId2 = maijiArticleLabel.children.find(mLabel => mLabel.label == '普通文章').value
          }
      },

      mounted() {
        this.findAllMaijiArticleLabels()
        this.getMaijiTokenVuex()
        PubSub.subscribe("updateMetaData", () => this.findAllArticleComments(this.articleId))
      },

      methods: {
        ...mapActions(["loadingOpen", "updateMetaData", 'getMaijiTokenVuex']),
        dateFormatter,

        async delArticleComments (articleId) {
          const result = await delArticleCommentsAjax([articleId])
          if (result.status != "SUCCESS") return this.$message.error(`屏蔽失败，请稍后重试`)
          this.findAllArticleComments(this.articleId)
          return this.$message.success(`屏蔽成功`)
        },

        async articleComment (article) {
          if (! article.rcontent) return this.$message.warning(`请先输入回复内容`)
          const data = {
            type: 1,
            content: article.rcontent,
            commentId: article.uuId,
          }
          const result = await articleCommentAjax(data)
          if (result.status != "SUCCESS") return this.$message.error(`回复失败，请稍后重试`)
          this.findAllArticleComments(this.articleId)
          Array.from(document.getElementsByClassName("myPopper"))
            .forEach(ep => ep.style.display = "none")
          return this.$message.success(`回复成功`)
        },

        async findAllArticleComments (articleId, metaData) {
          this.commentShow = true
          if (articleId) this.articleId = articleId
          this.commentTableLoading = true
          this.commentTable = []
          const result = await findAllArticleCommentsAjax(this.articleId, metaData || this.metaData)
          if (result.status == "SUCCESS") {
            this.commentTable = result.data
            this.updateMetaData({metaData: result.resMetaData, init: true})
          }
          this.commentTableLoading = false
        },

        async del_updMaijiArticle (maijiArticle, type) {
          const msg = type == 1 && '编辑排序权重' || '删除文章'
          if (type == 1 && goods.sortWeight <= 0)
            return this.$message.warning(`请先输入有效的文章排序权重`)
          maijiArticle.type = type
          const result = await del_updMaijiArticleByIdAjax(maijiArticle)
          if (result.status != "SUCCESS") return this.$message.error(`${msg}失败，请稍后重试！`)
          this.findAllMaijiArticles(this.pageOne)
          return this.$message.success(`${msg}成功！`)
        },

        elTagType(labelName) {
            switch (labelName) {
                case "推荐置顶":
                    return 'success'
                case "普通文章":
                    return 'info'
                default :
                    return ''
            }
        },

        async updLabel(maijiArticle, labels) {
            const updateLabels = labels || this.updateLabels
            const result = await updMaijiArticleLabelAjax([maijiArticle.uuId, this.labelId, ...updateLabels])
            if (result.status != "SUCCESS") return this.$message.error(`修改失败，请稍候重试`)
            Array.from(document.getElementsByClassName("myPopper"))
              .forEach(ep => ep.style.display = "none")
            this.findAllMaijiArticles()
            this.$message.success(`修改成功`)
        },

        // 获取所有食谱相关标签
        async findAllMaijiArticleLabels() {
            const result = await findAllLabelBySourceAjax("麦吉简介")
            if (result.status != "SUCCESS") return
            this.maijiArticleLabels = result.data.filter(label => label.listShow == 3)
            this.labelId = this.maijiArticleLabels[0].uuId
            this.allMaijiArticleLabels = this.maijiArticleLabels.map(label => {
                const newLabel = {value: label.uuId, label: label.name}
                newLabel.children = result.data.filter(cl => cl.orderNo == label.orderNo)
                    .map(cl => Object.assign({value: cl.uuId, label: cl.name == label.name && '普通文章' || cl.name}))
                return newLabel
            })
            this.findAllMaijiArticles()
        },

        // 获取食谱表格数据
        async findAllMaijiArticles() {
            this.maijiArticleTableLoading = true
            this.maijiArticleTable = []
            const result = await findAllMaijiArticleByLabelIdAjax(this.labelId)
            if (result.status == "SUCCESS" && result.data) {
                if (result.data[0].maijiArticles.length > 0)
                    this.maijiArticleTable = result.data[0].maijiArticles.map(ma =>
                        Object.assign(ma, {isRecommend: true, labelName: '推荐置顶', labelId: result.data[0].labelId}))
                if (result.data[1].maijiArticles.length > 0)
                    this.maijiArticleTable = [...this.maijiArticleTable, ...result.data[1].maijiArticles.map(ma =>
                        Object.assign(ma, {labelName: result.data[1].title, labelId: result.data[1].labelId}))]
                if (result.data[2].maijiArticles.length > 0)
                    this.maijiArticleTable = [...this.maijiArticleTable, ...result.data[2].maijiArticles.map(ma =>
                        Object.assign(ma, {labelName: '普通文章', labelId: this.labelId}))]
              this.maijiArticleTable = this.maijiArticleTable.sort((p1, p2) => p2.sortWeight - p1.sortWeight)
            }
            this.maijiArticleTableLoading = false
            this.loading.close()
        },

        delMaijiArticleById(maijiArticleId) {
            this.$confirm('确认删除该麦吉简介文章?', '删除文章', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const result = await delMaijiArticleByIdAjax(maijiArticleId)
                if (result.status != "SUCCESS") return this.$message.error(`删除失败，请稍后重试！`)
                this.maijiArticleTable = this.maijiArticleTable.filter(ma => ma.uuId != maijiArticleId)
                return this.$message.success(`删除成功！`)
            })
        },
      },
    }
</script>

<style>
    .el-message-box {
        width: 23%;
    }

    .el-input-number--mini {
        width: 80px;
        line-height: 26px;
    }

    .el-input-number.is-controls-right .el-input__inner {
        padding-left: 0px;
        padding-right: 30px;
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
</style>
