<template>
  <div>
    <el-form :model="article" label-width="100px" ref="articleFrom">
      <el-form-item label="动态标题" prop="title" :rules="[{required: 'true', message: '动态标题不能为空'}]">
        <el-input v-model="article.title" placeholder="请输入标题" style="width: 90%;"/>
      </el-form-item>
      <el-form-item label="动态标签">
        <el-select v-model="article.priority" placeholder="请选择" style="width: 128px;">
          <el-option label="普通动态" :value="0"/>
          <el-option label="推荐动态" :value="1"/>
          <el-option label="精选动态" :value="2"/>
          <el-option label="案例动态" :value="3"/>
        </el-select>
        <el-checkbox v-model="article.isTop" border style="margin-left: 40px;">动态置顶</el-checkbox>
        <el-checkbox v-model="article.isIntegral" border>转发的积分</el-checkbox>
        <el-select v-model="article.act" placeholder="请选择动态话题" clearable style="width: 158px; margin-left: 40px;">
          <el-option v-for="act in actList" :label="act.actName"  :value="`#${act.actName}#`"/>
        </el-select>
      </el-form-item>
      <el-form-item label="动态内容" prop="content" :rules="[{required: 'true', message: '动态内容不能为空'}]">
        <Editor style="width: 90%; height: 438px;"/>
      </el-form-item>
      <el-form-item style="margin-top: 60px; margin-bottom: 0">
        <el-button type="primary" @click="articlePublish">发表动态</el-button>
        <router-link :to="`/community/List`"><el-button>取消</el-button></router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    articlePublishAjax,
    getActDataAjax
  } from "../../api"
  import {dealImg} from "../../util"
  import { mapActions, mapState } from "vuex"
  const Editor = () => import('../common/Editor')

  export default {
    components: {
      Editor,
    },

    data() {
      return {
        article: {
          priority: 0,
          isTop: null,
          isIntegral: null,
          content: "",
          type: 3,
          title: "",
          act: ''
        },
        actList: [],
      }
    },

    computed: {
      ...mapState(["loading", "metaData"])
    },

    watch: {
      'article.act': {
        deep: true,
        handler: function (newAct, oldAct) {
          this.article.content = newAct + this.article.content.replace(oldAct, '')
          PubSub.publish('editorInit', this.article.content)
        }
      }
    },

    mounted () {
      this.getMaijiTokenVuex()
      this.getActData()
      PubSub.subscribe('editorChange', (msg, value) => this.article.content = value)
    },

    methods: {
      ...mapActions(['loadingOpen', 'getMaijiTokenVuex']),
      dealImg,

      //发表动态
      articlePublish() {
        this.$refs.articleFrom.validate(async valid => {
          if (! valid) return this.$message.error("发表失败，请确认发表规范")
          this.loadingOpen()
          if (this.article.isTop) {
            this.article.isTop = 1
            this.article.topSort = 0
          }
          if (this.article.isIntegral) this.article.isIntegral = 1
          this.article.content = this.dealImg(this.article.content)
          const result = await articlePublishAjax(this.article)
          this.loading.close()
          if (result.status != "SUCCESS")
            return this.$message.error("发表失败，请稍后重试")
          this.$message.success("发表成功")
          return this.$router.push(`/community/list`)
        })
      },

      //活动列表
      async getActData() {
        const result = await getActDataAjax(this.metaData);
        if (result.status == "SUCCESS") this.actList = result.data
        this.loading.close()
      },
    }
  }
</script>

<style>
</style>
