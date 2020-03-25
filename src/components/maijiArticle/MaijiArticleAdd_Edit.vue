<template>
  <el-form ref="maijiArticleFrom" :model="maijiArticle" label-width="100px" label-position="right">
    <el-row>
      <el-col :span="10">
          <el-form-item label="文章标题" prop="title" :rules="[{required: 'true', message: '文章标题不能为空'}]">
              <el-input v-model="maijiArticle.title" placeholder="请输入文章标题"/>
          </el-form-item>
          <el-form-item label="文章标签" prop="labelIds" :rules="[{required: 'true', message: '文章标签不能为空'}]">
              <el-cascader v-model="maijiArticle.labelIds" :options="allMaijiArticleLabels" placeholder="请选择文章标签" style="width: 100%;"/>
          </el-form-item>
          <el-form-item label="文章封面" prop="imageId" :rules="[{required: 'true', message: '文章封面不能为空'}]">
          <span style="color: gray;">建议图片尺寸：230 * 160</span>
          <el-upload action="" list-type="picture-card" :limit="1"
                     :http-request="addMaijiArticleImage"
                     :file-list="maijiArticleImages"
                     :on-exceed="() => $message.warning(`只能上传1张文章封面`)">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
          <el-form-item label="文章简述" prop="desc" :rules="[{required: 'true', message: '文章简述不能为空'}]">
              <el-input type="textarea" :rows="9"v-model="maijiArticle.desc" placeholder="请输入文章简述"/>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="add_editMaijiArticle" v-show="! maijiArticle.uuId">确认添加</el-button>
              <el-button type="primary" @click="add_editMaijiArticle" v-show="maijiArticle.uuId">确认修改</el-button>
          </el-form-item>
      </el-col>
      <el-col :span="14">
        <el-form-item label="文章正文"prop="content" :rules="[{required: 'true', message: '文章正文不能为空'}]">
          <Editor style="height: 598px;"/>
        </el-form-item>
      </el-col>
  </el-row>
  </el-form>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import Editor from '../common/Editor'
    import {dealImg} from "../../util"
    import {
        findAllLabelBySourceAjax,
        add_editMaijiArticleAjax,
        uploadArticleImagesAjax,
    } from '../../api'

    export default {
        components: {
            Editor,
        },

        data() {
            return {
                maijiArticle: {
                    uuId: null,
                    title: '',
                    desc: '',
                    imageId: '',
                    content: '',
                    labelIds: null,
                },
                allMaijiArticleLabels: null,
                maijiArticleImages: [],
            }
        },

        computed: {
            ...mapState(['loading', 'loadingOptions']),
        },

        watch: {
            $route: function () {
                const fullPath = this.$route.fullPath
                if (fullPath.includes('/maijiArticle/edit')) {
                    const maijiArticle = this.$route.query.maijiArticle
                    if (! maijiArticle) {
                        this.$message.warning(`请先选择要编辑的文章`)
                        return this.$router.push(`/maijiArticle/list`)
                    }
                } else {
                    this.maijiArticle = {
                        name: '',
                        uuId: null,
                        title: '',
                        desc: '',
                        imageId: '',
                        content: '',
                        labelIds: null,
                    },
                    this.maijiArticleImages = []
                    PubSub.publish("editorInit", '')
                    this.loading.close()
                }
            },
        },

        mounted () {
            this.findAllMaijiArticleLabels()
            const fullPath = this.$route.fullPath
            if (fullPath.includes('/maijiArticle/edit')) {
                const maijiArticle = this.$route.query.maijiArticle
                if (maijiArticle) {
                    this.maijiArticle.uuId = maijiArticle.uuId
                    this.maijiArticle.title = maijiArticle.title
                    this.maijiArticle.desc = maijiArticle.desc
                    this.maijiArticle.content = maijiArticle.content
                    this.maijiArticle.imageId = maijiArticle.img.uuId
                    this.maijiArticle.labelIds = [this.$route.query.labelId, maijiArticle.labelId]
                    this.maijiArticleImages = [maijiArticle.img]
                    PubSub.publish("editorInit", maijiArticle.content)
                } else {
                    this.$message.warning(`请先选择要编辑的文章`)
                    return this.$router.push(`/maijiArticle/list`)
                }
            }
            PubSub.subscribe('editorChange', (msg, value) => this.maijiArticle.content = value)
            this.loading.close()
        },

        methods: {
            ...mapActions(["loadingOpen"]),

            // 获取所有麦吉简介相关标签
            async findAllMaijiArticleLabels() {
                const result = await findAllLabelBySourceAjax("麦吉简介")
                if (result.status != "SUCCESS") return
                this.allMaijiArticleLabels = result.data.filter(label => label.listShow == 3).map(label => {
                    const newLabel = {value: label.uuId, label: label.name}
                    newLabel.children = result.data.filter(cl => cl.orderNo == label.orderNo)
                        .map(cl => {
                          if (cl.name == '置顶推荐') cl.name += '（封面700*275）'
                          else cl.name += '（封面378*278）'
                          return Object.assign({value: cl.uuId, label: cl.name == label.name && '普通文章（封面280*176）' || cl.name})
                        })
                    return newLabel
                })
            },

            // 上传文章封面图片
            async addMaijiArticleImage(param) {
                const imageData = new FormData()
                imageData.append('uploadFiles', param.file)
                const result = await uploadArticleImagesAjax(imageData)
                if (result.status != "SUCCESS") this.$message.error(`上传文章封面失败，请稍后重试！`)
                this.maijiArticleImages = [Object.assign(result.data[0], {isMain: 1})]
                this.maijiArticle.imageId = result.data[0].uuId
            },

            add_editMaijiArticle() {
              this.$refs.maijiArticleFrom.validate(async valid => {
                const msg = this.maijiArticle.uuId && '编辑' || '添加'
                if (! valid) return this.$message.warning(`${msg}文章失败，请确认添加规范！`)
                this.loadingOpen()
                this.maijiArticle.content = dealImg(this.maijiArticle.content)
                if (! this.maijiArticle.content.startsWith('<div class="ql-editor">'))
                    this.maijiArticle.content = '<div class="ql-editor">' + this.maijiArticle.content + '</div>'
                const result = await add_editMaijiArticleAjax(this.maijiArticle)
                this.loading.close()
                if (result.status != "SUCCESS") return this.$message.error(`${msg}文章失败，请稍后重试`)
                this.$message.success(`${msg}文章成功`)
                return this.$router.push(`/maijiArticle/list`)
              })
            },
        },
    }
</script>

<style>
    .el-form-item {
        text-align: left;
    }
</style>
