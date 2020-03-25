<template>
  <div class="articleList">
    <el-tabs v-model="searchArticle.act" type="card" @tab-click="queryArticle(pageOne)" v-if="$route.path == '/community/actList'">
      <el-tab-pane v-for="act in actList" :key="act.uuId" :label="act.actName" :name="act.actName"/>
    </el-tabs>
    <el-tabs v-model="searchArticle.priority" type="card" @tab-click="queryArticle(pageOne)" v-if="$route.path != '/community/actList'">
      <el-tab-pane label="全部" name="-1"/>
      <el-tab-pane label="全局置顶动态" name="5"/>
      <el-tab-pane label="首页推荐动态" name="1"/>
      <el-tab-pane label="精选动态" name="3"/>
      <el-tab-pane label="案例动态" name="2"/>
      <el-tab-pane label="转发得积分" name="4"/>
      <el-tab-pane label="普通动态" name="0"/>
    </el-tabs>
    <el-row style="margin-bottom:15px">
      <router-link to="/community/publish">
        <el-button type="primary" size="small">动态发表 <i class="el-icon-plus"/></el-button>
      </router-link>
      <el-switch v-model="searchArticle.isolation" active-text="已屏蔽" inactive-text="未屏蔽"
                 style="margin: 0 10px;" @change="queryArticle(pageOne)"/>
      <el-input v-model="searchArticle.nickName" placeholder="用户名称关键词搜索"  size="small" style="width: 18%;">
        <el-button slot="append" icon="el-icon-search" @click="queryArticle"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="searchArticle.nickName = ''; queryArticle(pageOne);"/>
      </el-input>
      <el-input v-model="searchArticle.content" placeholder="动态内容关键词搜索"  size="small" style="width: 22%;">
        <el-button slot="append" icon="el-icon-search" @click="queryArticle"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="searchArticle.content = ''; queryArticle(pageOne);"/>
      </el-input>
      <el-select v-model="searchArticle.act" placeholder="动态话题：请选择" clearable size="small" v-if="$route.path != '/community/actList'"
                 @change="queryArticle(pageOne)" @clear="queryArticle(pageOne)" style="width: 13%;">
        <el-option v-for="act in actList" :key="act.uuId" :label="act.actName" :value="act.actName"/>
      </el-select>
      <el-date-picker v-model="searchArticle.publishTimes" size="small" style="width: 18%;" type="daterange" @change="queryArticle()"
                      range-separator="至" start-placeholder="发布时间开始" end-placeholder="发布时间结束" :picker-options="pickerOptions"/>
    </el-row>
    <el-table stripe v-loading="ArticleLoading":data="articleList"
        :header-cell-style="{backgroundColor: '#DCDFE6'}"
        :cell-style="{paddingTop: '7px', paddingBottom: '0'}">
      <el-table-column type="index" fixed width="45" align="center"/>
      <el-table-column label="头像" fixed width="65">
        <template slot-scope="scope">
          <img :src="scope.row.user.headUrl" v-show="scope.row.user.headUrl" width="45" height="45"/>
          <img src="../container/images/maijiCat.png" v-show="! scope.row.user.headUrl" width="45"
               height="45"/>
        </template>
      </el-table-column>
      <el-table-column label="用户名" fixed width="100"
                       show-overflow-tooltip
                       :formatter="(row) => row.user.nickName || '麦吉用户'">
      </el-table-column>
      <el-table-column label="动态标题/内容" fixed="left" min-width="345"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <span style="color: gray;">标题：</span><span>{{scope.row.title || '—'}}</span><br/>
          <span style="color: gray;">内容：</span><span>{{scope.row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column label="回复" width="80">
        <template slot-scope="scope">
          <el-popover width="250" trigger="click" popper-popper-class="myPopper" style="margin-left: 10px;">
            <el-input type="textarea" :rows="3" v-model="scope.row.rcontent" placeholder="请输入回复内容" style="width: 100%;"/>
            <el-button type="primary" size="mini" plain @click="commentMsg(scope.row)" style="width: 100%; margin-top: 10px;">确定</el-button>
            <span slot="reference" style="color: #409EFF; cursor: pointer;">回复 <i class="el-icon-edit"/></span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="详情/评论" width="85">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="showDialog(scope.row.msgId)">查看详情</el-button>
          <router-link :to="{path: '/community/comment', query:{msgId: scope.row.msgId, metaData, searchArticle}}" >
            <el-button type="text" size="mini" style="cursor: pointer;">查看评论</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" width="100"
                       :formatter="(row) => dateFormatter(row.publishTime)"/>
      <el-table-column label="动态标签" width="160">
        <template slot-scope="scope">
          <el-tag type="success" size="mini" v-if="scope.row.isTop == 1 && ! ['1', '2', '3'].includes(searchArticle.priority)">全局置顶</el-tag>
          <el-tag type="info"size="mini" v-if="scope.row.priority == 0">普通动态</el-tag>
          <el-tag type="success" size="mini" v-if="scope.row.labelIds.includes(1)">首页推荐</el-tag>
          <el-tag type="warning" size="mini" v-if="scope.row.labelIds.includes(3)">精选动态</el-tag>
          <el-tag type="danger" size="mini" v-if="scope.row.labelIds.includes(2)">案例动态</el-tag>
          <el-tag type="success" size="mini" v-if="scope.row.isIntegral == 1">转发得积分</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="积分值" width="80" v-if="searchArticle.priority == 4">
        <template slot-scope="scope" v-show="searchArticle.priority == 4">
          <el-popover trigger="click" width="180" popper-class="myPopper">
            <el-input size="mini" v-model="scope.row.integral" style="width: 100%; margin-bottom: 10px;">
              <template slot="prepend">转发得积分值</template></el-input>
            <el-button type="primary" size="mini" @click="editArticle(Object.assign(scope.row, {isIntegral: 1}), 1)" style="width: 100%;" plain>确定</el-button>
            <span slot="reference" style="color: green; cursor: pointer;" @click="findMsgTransmitRule">{{scope.row.integral || defaultIntegral}} <i class="el-icon-edit"/></span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="265" v-if="['-1', '0'].includes(searchArticle.priority)">
        <template slot-scope="scope" v-if="['-1', '0'].includes(searchArticle.priority)">
          <el-button type="text" size="mini" @click="editArticle(Object.assign(scope.row, {isTop: 1, topSort: 0, priority: 4}), 1)" v-if="! scope.row.isTop">设置全局置顶</el-button>
          <el-button type="text" size="mini" @click="editArticle(Object.assign(scope.row, {isTop: 0, topSort: 0, priority: 14}), 1)" v-if="scope.row.isTop" style="color: gray;">取消全局置顶</el-button>
          <el-button type="text" size="mini" @click="editArticle(Object.assign(scope.row, {priority: 1}), 1)" v-if="! scope.row.labelIds.includes(1)">设置首页推荐</el-button>
          <el-button type="text" size="mini" @click="editArticle(Object.assign(scope.row, {priority: 11}), 1)" v-if="scope.row.labelIds.includes(1)" style="color: gray;">取消首页推荐</el-button>
          <el-button type="text" size="mini" @click="editArticle(Object.assign(scope.row, {priority: 3}), 1)" v-if="! scope.row.labelIds.includes(3)">设置精选</el-button>
          <el-button type="text" size="mini" @click="editArticle(Object.assign(scope.row, {priority: 13}), 1)" v-if="scope.row.labelIds.includes(3)" style="color: gray;">取消精选</el-button>
          <el-button type="text" size="mini" @click="editArticle(Object.assign(scope.row, {priority: 2}), 1)" v-if="! scope.row.labelIds.includes(2)">设置案例</el-button>
          <el-button type="text" size="mini" @click="editArticle(Object.assign(scope.row, {priority: 12}), 1)" v-if="scope.row.labelIds.includes(2)" style="color: gray;">取消案例</el-button>
          <el-button type="text" size="mini" @click="" v-show="scope.row.isIntegral == 0">
            <el-popover trigger="click" width="180" popper-popper-class="myPopper">
              <el-input size="mini" v-model="defaultIntegral" style="width: 100%; margin-bottom: 10px;">
                <template slot="prepend">转发得积分值</template></el-input>
              <el-button type="primary" size="mini" @click="editArticle(Object.assign(scope.row, {isIntegral: 1, integral: defaultIntegral, priority: 5}), 1)" style="width: 100%;" plain>确定</el-button>
              <span slot="reference" style="color: green; cursor: pointer;" @click="findMsgTransmitRule">转发得积分</span>
            </el-popover></el-button>
          <el-button type="text" size="mini" @click="editArticle(Object.assign(scope.row, {isIntegral: 0, priority: 15}), 1)" v-if="scope.row.isIntegral == 1" style="color: gray;">取消得积分</el-button>
          <el-button type="text" size="mini" @click="editArticle(Object.assign(scope.row, {isolation: true, examined: 1}), 1)" v-if="! scope.row.isolation" style="color: red;">屏蔽</el-button>
          <el-button type="text" size="mini" @click="editArticle(Object.assign(scope.row, {isolation: false}), 1)" v-if="scope.row.isolation" style="color: red;">取消屏蔽</el-button>
          <el-button type="text" size="mini" v-clipboard:copy="scope.row.webUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</el-button>
        </template>
      </el-table-column>
      <el-table-column label="置顶序号" width="80" v-if="searchArticle.priority == 5">
      <template slot-scope="scope">
        <el-popover trigger="click" width="235" popper-class="myPopper">
            <el-input size="small" v-model="scope.row.topSort">
              <el-button slot="prepend">全局置顶序号</el-button>
              <el-button slot="append" @click="editArticle(Object.assign(scope.row, {isTop: 1}), 1)">确定</el-button>
            </el-input>
            <el-button type="text" size="mini" slot="reference">{{scope.row.topSort}} <i class="el-icon-edit"/></el-button>
          </el-popover>
      </template>
      </el-table-column>
      <el-table-column label="设置全局置顶" fixed="right" width="115" v-if="searchArticle.priority == 5">
        <template slot-scope="scope" v-if="searchArticle.priority == 5">
          <el-popover trigger="click" width="180" v-if="! scope.row.isTop" popper-class="myPopper">
            <el-input size="small" v-model="scope.row.topSort" placeholder="置顶排序编号">
              <el-button type="primary" slot="append" @click="editArticle(Object.assign(scope.row, {isTop: 1}), 1)">确定</el-button>
            </el-input>
            <el-button type="success" size="mini" slot="reference">动态置顶</el-button>
          </el-popover>
          <el-button type="warning" size="mini" @click="editArticle(Object.assign(scope.row, {isTop: 0, topSort: 0}), 1)" v-if="scope.row.isTop">取消置顶</el-button>
        </template>
      </el-table-column>
      <el-table-column label="置顶序号" width="95" align="center" v-if="['1', '2', '3'].includes(searchArticle.priority)">
        <template slot-scope="scope">
          <el-row v-if="scope.row.isTop == 1"><el-tag type="success" size="mini">全局置顶-{{scope.row.topSort}}</el-tag></el-row>
          <el-row v-show="scope.row.isTop == 0 && scope.row.label && scope.row.label.isTop == 1">
              <el-popover trigger="click" width="255" popper-class="myPopper">
              <el-input size="small" v-model="scope.row.label.topSort">
                <el-button slot="prepend">标签内置顶序号</el-button>
                <el-button slot="append" @click="editArticle(Object.assign(scope.row.label, {isTop: 1}), 2)">确定</el-button>
              </el-input>
              <el-tag type="warning" size="mini" slot="reference" style="cursor: pointer;">
                标签置顶-{{scope.row.label.topSort}} <i class="el-icon-edit"/></el-tag>
            </el-popover>
          </el-row>
          <el-row v-if="scope.row.isTop == 0 && scope.row.label && scope.row.label.isTop == 1">
            <span style="color: gray; cursor: pointer; font-size: 12px;" @click="editArticle(Object.assign(scope.row.label, {isTop: 0}), 2)">取消标签置顶</span></el-row>
          <el-row v-if="scope.row.isTop == 0 && scope.row.label && scope.row.label.isTop == 0"><el-tag type="info" size="mini">未置顶</el-tag></el-row>
          <el-row v-show="scope.row.isTop == 0 && scope.row.label && scope.row.label.isTop == 0">
            <el-popover trigger="click" width="255" popper-class="myPopper">
              <el-input size="small" v-model="scope.row.label.topSort">
                <el-button slot="prepend">标签内置顶序号</el-button>
                <el-button slot="append" @click="editArticle(Object.assign(scope.row.label, {isTop: 1}), 2)">确定</el-button>
              </el-input>
              <span slot="reference" style="color: #3a8ee6; cursor: pointer; font-size: 12px;">设置标签置顶</span>
            </el-popover>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="设置首页推荐" fixed="right" width="145" v-if="searchArticle.priority == 1">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="editArticle(Object.assign(scope.row, {priority: 1}), 1)" v-if="! scope.row.labelIds.includes(1)">设置首页推荐 <i class="el-icon-star-on"/></el-button>
          <el-button type="danger" size="mini" @click="editArticle(Object.assign(scope.row, {priority: 11}), 1)" v-if="scope.row.labelIds.includes(1)">取消首页推荐 <i class="el-icon-circle-close"/></el-button>
        </template>
      </el-table-column>
      <el-table-column label="设置精选" fixed="right" width="120" v-if="searchArticle.priority == 3">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="editArticle(Object.assign(scope.row, {priority: 3}), 1)" v-if="! scope.row.labelIds.includes(3)">设置精选 <i class="el-icon-star-on"/></el-button>
          <el-button type="danger" size="mini" @click="editArticle(Object.assign(scope.row, {priority: 13}), 1)" v-if="scope.row.labelIds.includes(3)">取消精选 <i class="el-icon-circle-close"/></el-button>
        </template>
      </el-table-column>
      <el-table-column label="设置案例" fixed="right" width="120" v-if="searchArticle.priority == 2">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="editArticle(Object.assign(scope.row, {priority: 2}), 1)" v-if="! scope.row.labelIds.includes(2)">设置案例 <i class="el-icon-s-flag"/></el-button>
          <el-button type="danger" size="mini" @click="editArticle(Object.assign(scope.row, {priority: 12}), 1)" v-if="scope.row.labelIds.includes(2)">取消案例 <i class="el-icon-circle-close"/></el-button>
        </template>
      </el-table-column>
      <el-table-column label="设置转发得积分" fixed="right" width="130" v-if="searchArticle.priority == 4">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="editArticle(Object.assign(scope.row, {isIntegral: 1}), 1)" v-if="scope.row.isIntegral == 0">转发得积分 <i class="el-icon-coin"/></el-button>
          <el-button type="danger" size="mini" @click="editArticle(Object.assign(scope.row, {isIntegral: 0}), 1)" v-if="scope.row.isIntegral == 1">取消得积分 <i class="el-icon-circle-close"/></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 10px; text-align: right;">
      <MJ_Pagination/>
    </el-row>
    <el-dialog title="动态详情" :visible.sync="articleDialogVisible" width="25%">
      <el-row>标题：<br/>{{dialogData.title}}</el-row>
      <el-row style="margin-top:10px">内容：<div v-html="dialogData.content" style="width: 300px"/></el-row>
      <el-row style="margin-top:10px">图片：<div v-if="dialogData.files">
          <img :src="img.smallUrl"  v-for="img in dialogData.files" :key="img.uuId" width="100%"/></div></el-row>
      <el-row style="margin-top:10px">
        动态类型：
        <el-tag v-if="dialogData.priority==0">普通动态</el-tag>
        <el-tag type="success" v-if="dialogData.priority==1">推荐动态</el-tag>
        <el-tag type="warning" v-if="dialogData.priority==2">精选动态</el-tag>
        <el-tag type="danger" v-if="dialogData.priority==3">案例</el-tag>
      </el-row>
      <el-row style="margin-top:10px">
        是否收藏：
        <el-tag type="success" v-if="dialogData.isCollect ==true">已收藏</el-tag>
        <el-tag type="danger" v-else>未收藏</el-tag>
        <!--<el-button
          v-show="dialogData.isCollect ==false"
          type="primary"
          size="mini"
          @click="isCollect(dialogData.msgId)"
          style="margin-left:20px"
        >
          收藏&nbsp;
          <i class="el-icon-star-on"/>
        </el-button>-->
      </el-row>
      <el-row style="margin-top:10px">
        是否点赞：
        <el-tag type="success" v-if="dialogData.isPraise ==true">已点赞</el-tag>
        <el-tag type="danger" v-else>未点赞</el-tag>
        <!--<el-button
          v-show="dialogData.isPraise ==false"
          type="success"
          size="mini"
          @click="isPraise(dialogData.msgId)"
          style="margin-left:20px"
        >
          点赞&nbsp;
          <i class="el-icon-thumb"/>
        </el-button>-->
      </el-row>
      <el-row style="margin-top:10px">
        是否显示地理位置：
        <el-tag type="success" v-if="dialogData.showLocation ==true">显示地理位置</el-tag>
        <el-tag type="danger" v-else>不显示地理位置</el-tag>
      </el-row>
      <el-row style="margin-top:10px">发布时间：{{dialogData.publishTime | formatDate}}</el-row>
      <el-row style="margin-top:10px">点赞量：{{dialogData.praise_count}}</el-row>
      <el-row style="margin-top:10px">访问量：{{dialogData.pu}}</el-row>
      <el-row style="margin-top:10px">收藏量：{{dialogData.collect_count}}</el-row>
      <el-row style="margin-top:10px">转发量：{{dialogData.transmit_count}}</el-row>
      <el-row style="margin-top:10px">评论数量：{{dialogData.commented_count}}</el-row>
      <el-row style="margin-top:10px">
        评论内容：
        <el-row v-for="(item,index) in dialogData.comments" :key="index">
          <el-row>item.content</el-row>
        </el-row>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="articleDialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="articleDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    findAllComMsgInfosAjax,
    editComMsgInfoAjax,
    findComMsgByIdAjax,
    isCollectAjax,
    isPraiseAjax,
    commentMsgAjax,
    findMsgTransmitRuleAjax,
    editComMiddleLabelAjax,
    getActDataAjax,
  } from '../../api'
  import {mapState, mapActions} from 'vuex'
  import {dateFormatter} from '../../util'
  const MJ_Pagination = () => import('../common/MJ_Pagination.vue')

  export default {
    components: {
      MJ_Pagination
    },

    data () {
      return {
        ArticleLoading: false,
        searchArticle: {
          nickName: null,
          content: null,
          act: null,
          isolation: false,
          priority: '-1',
          publishTimes: []
        },
        articleList: [],
        articleDialogVisible: false,
        dialogData: {},
        defaultIntegral: null,
        actList:[],
      }
    },

    computed: {
      ...mapState(['loading', 'metaData', 'pickerOptions']),

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
      $route: function () {
        this.searchArticle.act = ''
        if (this.$route.path == "/community/list") this.searchArticle.priority = '-1'
        if (this.$route.path == "/community/top") this.searchArticle.priority = '5'
        if (this.$route.path == "/community/integral") this.searchArticle.priority = '4'
        if (this.$route.path == "/community/actList") this.searchArticle.act = this.actList[0].actName
        this.queryArticle(this.pageOne)
      },

      'searchArticle.priority': {
        deep: true,
        handler: function (value) {
          const query = this.$route.query
          if (! query && value < 4) this.$router.push("/community/list")
          if (value == '4') this.$router.push("/community/integral")
          if (value == '5') this.$router.push("/community/top")
        }
      },
    },

    async mounted () {
      await this.getMaijiTokenVuex()
      if (this.$route.path == "/community/list") this.searchArticle.priority = '-1'
      if (this.$route.path == "/community/top") this.searchArticle.priority = '5'
      if (this.$route.path == "/community/integral") this.searchArticle.priority = '4'
      const {searchArticle, metaDataBack} = this.$route.query
      if (searchArticle) this.searchArticle = searchArticle
      this.findMsgTransmitRule()
      await this.getActData()
      this.queryArticle(metaDataBack || this.pageOne)
      PubSub.subscribe('updateMetaData', () => this.queryArticle())
    },

    methods: {
      ...mapActions(['loadingOpen', 'getMaijiTokenVuex', 'updateMetaData']),
      dateFormatter,

      async findMsgTransmitRule (integral) {
        const result = await findMsgTransmitRuleAjax()
        if (result.status == 'SUCCESS')
          this.defaultIntegral = result.data.defaultIntegral
      },

      async commentMsg (msg) {
        const data = {
          belongId: msg.msgId,
          content: msg.rcontent,
          status: 0
        }
        const result = await commentMsgAjax(data)
        if (result.status != 'SUCCESS') return this.$message.error(`回复失败，请稍后重试`)
        Array.from(document.getElementsByClassName("myPopper"))
          .forEach(ep => ep.style.display = "none")
        return this.$message.success(`回复成功，请点击查看评论`)
      },

      // 获取动态列表
      async queryArticle (metaData) {
        this.ArticleLoading = true
        const {publishTimes} = this.searchArticle
        if (publishTimes) this.searchArticle.publishTimes = publishTimes.map(time => time.getTime())
        const result = await findAllComMsgInfosAjax(this.searchArticle, metaData || this.metaData)
        if (result.status == 'SUCCESS') {
          this.articleList = result.data
          this.updateMetaData({metaData: result.resMetaData, init: true})
        }
        this.ArticleLoading = false
        this.loading.close()
      },

      // 编辑动态/标签
      async editArticle (row, type) {
        let result = {}
        if (type == 1) result = await editComMsgInfoAjax(row)
        if (type == 2) result = await editComMiddleLabelAjax(row)
        if (result.status != 'SUCCESS') return this.$message.error(`设置失败，请稍后重试`)
        this.queryArticle(this.pageOne)
        Array.from(document.getElementsByClassName("myPopper"))
          .forEach(ep => ep.style.display = "none")
        return this.$message.success(`设置成功`)
      },

      // 查看动态详情
      async showDialog (msgId) {
        this.dialogData = {}
        this.articleDialogVisible = true
        const result = await findComMsgByIdAjax(msgId)
        if (result.status == 'SUCCESS') {
          if (result.data.files.length == 0) result.data.files.push({smallUrl: ''})
          this.dialogData = result.data
        }
      },

      //活动列表
      async getActData() {
        const result = await getActDataAjax({page: 1, size: 99});
        if (result.status == "SUCCESS") {
          this.actList = result.data.map(act => Object.assign(act, {actName: `#${act.actName}#`}))
          if (this.$route.path == '/community/actList') this.searchArticle.act = this.actList[0].actName
        }
      },

      //收藏
      async isCollect (data) {
        const result = await isCollectAjax(data, this.metaData)
        if (result.status == 'SUCCESS') {
          this.queryArticle()
          this.articleDialogVisible = false
          this.$message({
            message: '收藏成功',
            type: 'success'
          })
        } else {
          this.$message.error('收藏失败')
        }
      },

      //点赞
      async isPraise (data) {
        const result = await isPraiseAjax(data, this.metaData)
        if (result.status == 'SUCCESS') {
          this.queryArticle()
          this.articleDialogVisible = false
          this.$message({
            message: '点赞成功',
            type: 'success'
          })
        } else {
          this.$message.error('点赞失败')
        }
      },

      onCopy (e) {
        this.$message({
          message: '复制成功，请转到新地址',
          type: 'success'
        })
      },

      onError (e) {
        this.$message.error('复制失败，请重试')
      },
    },

    filters: {
      formatDate (time) {
        let date = new Date(time)
        return dateFormatter(date)
      }
    },

    beforeDestroy () {
      PubSub.unsubscribe('updateMetaData')
    }
  }
</script>

<style>
  .articleContent img {
    width: 100%;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
    font-size: 16px;
    margin-left: 30px;
    line-height: 32px;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .el-tooltip__popper {
    max-width: 30%;
  }
</style>
