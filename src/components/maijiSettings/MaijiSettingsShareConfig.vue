<template>
  <el-form :model="shareRule" ref="configFrom" label-width="90px" label-position="right">
    <el-col :span="12">
      <el-form-item label="分享标题" prop="title" :rules="[{required: 'true', message: '分享标题不能为空'}]">
        <el-input v-model="shareRule.title" placeholder="请输入分享标题" style="width: 90%;"/>
      </el-form-item>
      <el-form-item label="分 享 卡 片 图片">
        <el-upload action="" list-type="picture-card" :limit="1" :http-request="(param) => addShareImage(param, 'cardImg')"
                   :file-list="shareRule.cardImg? [{url: shareRule.cardImg}]: []"
                   :on-exceed="() => $message.warning(`只能上传1张分享卡片图片`)">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="分享背景图片" prop="bgImg" :rules="[{required: 'true', message: '分享背景图片不能为空'}]">
        <el-upload action="" list-type="picture-card" :limit="1" :http-request="(param) => addShareImage(param, 'bgImg')"
                   :file-list="shareRule.bgImg? [{url: shareRule.bgImg}]: []"
                   :on-exceed="() => $message.warning(`只能上传1张分享背景图片`)">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="分享页面下部分" prop="textTwo" :rules="[{required: 'true', message: '分享页面下部分不能为空'}]">
        <Editor1 style="height: 398px;"/>
      </el-form-item>
      <el-form-item style="margin-top: 118px;">
        <el-button @click="findShareRuleConfig">还原</el-button>
        <el-button type="primary" @click="add_updShareRuleConfig">确认编辑</el-button>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="分享页面上部分" prop="text" :rules="[{required: 'true', message: '分享页面上部分不能为空'}]">
        <Editor style="height: 918px;"/>
      </el-form-item>
    </el-col>
  </el-form>
</template>

<script>
    import {
      findShareRuleConfigAjax,
      add_updShareRuleConfigAjax,
      uploadArticleImagesAjax
    } from "../../api"
    import {mapActions, mapState} from "vuex"
    import {dealImg} from "../../util"
    const Editor = () => import('../common/Editor')
    const Editor1 = () => import('../common/Editor1')

    export default {
        components: {
          Editor,
          Editor1,
        },

        data() {
            return {
              shareRule: {
                uuId: null,
                title: null,
                type: null,
                cardImg: null,
                bgImg: null,
                rule: null,
                text: null,
                textTwo: null,
              },
            }
        },

        computed: {
            ...mapState(['loading'])
        },

        watch: {
        $route: function () {
          const fullPath = this.$route.fullPath
          if (fullPath.includes('weightConfig')) this.shareRule.type=1
          if (fullPath.includes('orderConfig')) this.shareRule.type=2
          this.findShareRuleConfig()
        },
      },

        mounted() {
          const fullPath = this.$route.fullPath
          if (fullPath.includes('weightConfig')) this.shareRule.type=1
          if (fullPath.includes('orderConfig')) this.shareRule.type=2
          this.findShareRuleConfig()
          PubSub.subscribe('editorChange', (msg, value) => this.shareRule.text = value)
          PubSub.subscribe('editorChange1', (msg, value) => this.shareRule.textTwo = value)
        },

        methods: {
          ...mapActions(["loadingOpen"]),

          async addShareImage(param, img) {
            const imageData = new FormData()
            imageData.append('uploadFiles', param.file)
            const result = await uploadArticleImagesAjax(imageData)
            if (result.status != "SUCCESS") this.$message.error(`上传图片失败，请稍后重试！`)
            if (img == 'cardImg') {
              this.shareRule.cardImg = result.data[0].url
              this.shareRule.cardImgId = result.data[0].uuId
            }
            if (img == 'bgImg') {
              this.shareRule.bgImg = result.data[0].url
              this.shareRule.bgImg = result.data[0].uuId
            }
          },

          async findShareRuleConfig () {
              const result = await findShareRuleConfigAjax(this.shareRule.type)
              if (result.status == "SUCCESS") {
                this.shareRule= result.data
                const suffix = '?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,size_100,' +
                  'color_FFFFFF,shadow_50,order_0,align_2,interval_10,g_center,voffset_-20,text_'
                this.shareRule.bgImg = this.shareRule.bgImg.replace(suffix, '')
                this.shareRule.cardImg = this.shareRule.cardImg.replace(suffix, '')
                PubSub.publish('editorInit', result.data.text)
                PubSub.publish('editorInit1', result.data.textTwo)
              }
              this.loading.close()
          },

          add_updShareRuleConfig () {
            this.loadingOpen()
            this.$refs.configFrom.validate(async valid => {
              if (!valid) {
                this.loading.close();
                return this.$message.error(`配置编辑失败，请确认编辑规范！`);
              }
              const suffix = '?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,size_100,' +
                'color_FFFFFF,shadow_50,order_0,align_2,interval_10,g_center,voffset_-20,text_'
              this.shareRule.bgImg = this.shareRule.bgImg + suffix
              this.shareRule.cardImg = this.shareRule.cardImg + suffix
              this.shareRule.text = dealImg(this.shareRule.text)
              this.shareRule.textTwo = dealImg(this.shareRule.textTwo)
              const result = await add_updShareRuleConfigAjax(this.shareRule)
              if (result.status != "SUCCESS") {
                this.loading.close()
                return this.$message.error(`配置编辑失败，请稍后重试`)
              }
              this.findShareRuleConfig()
              this.$message.success(`配置编辑成功`)
              this.loading.close()
            });
          },
        }
    }
</script>

<style>
  .orderReturnRule .elDivider1 {
    margin-top: 0 !important;
  }
</style>
