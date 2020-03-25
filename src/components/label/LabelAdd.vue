<template>
  <el-dialog title="添加标签" :visible.sync="addLabelIsShow" width="40%" append-to-body @close="addLabelShow(false)">
    <el-form :model="addLabel" ref="addLabelFrom" label-width="100px" label-position="right">
      <el-form-item label="标签名称" prop="name" :rules="[{required: 'true', message: '标签名称不能为空'}]">
        <el-input v-model="addLabel.name" placeholder="请输标签名称" style="width: 300px;"/>
      </el-form-item>
      <el-form-item label="标签来源" prop="source" :rules="[{required: 'true', message: '标签来源不能为空'}]">
        <el-select v-model="addLabel.source" placeholder="请选择标签来源" allow-create filterable style="width: 300px;">
          <el-option label="食谱" value="食谱"/>
          <el-option label="食材" value="食材"/>
          <el-option label="商品" value="商品"/>
          <el-option label="商品评论" value="商品评论"/>
          <el-option label="麦吉简介" value="麦吉简介"/>
          <el-option label="取消订单" value="取消订单"/>
        </el-select>
      </el-form-item>
      <el-form-item label="标签描述">
        <el-input v-model="addLabel.desc" placeholder="请输标签描述" style="width: 300px;"/>
      </el-form-item>
      <el-form-item label="跳转地址">
        <el-input v-model="addLabel.url" placeholder="请输标签跳转地址" style="width: 300px;"/>
      </el-form-item>
      <el-form-item label="标签类型" prop="listShow" :rules="[{required: 'true', message: '标签类型不能为空'}]">
        <el-select v-model="addLabel.listShow" placeholder="请选择标签类型" allow-create filterable style="width: 300px;">
          <el-option label="0 - 普通标签" :value="0"/>
          <el-option label="1 - 列表标签" :value="1"/>
          <el-option label="2 - 分类标签" :value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="标签排序">
        <el-input v-model="addLabel.orderNo" placeholder="请输标签排序" style="width: 300px;"/>
      </el-form-item>
      <el-form-item label="标签图片">
        <span style="color: gray;">建议图片尺寸：88 * 88</span>
        <el-upload action="" list-type="picture-card" :limit="1" :http-request="uploadLabelImages" :file-list="labelImg && [labelImg] || []"
                   :on-exceed="() => $message.warning(`只能上传1张标签图片`)">
          <el-button size="small" type="success">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addEditLabel" v-if="! addLabel.uuId">立即添加</el-button>
        <el-button type="primary" @click="addEditLabel" v-if="addLabel.uuId">确认修改</el-button>
        <el-button @click="addLabelShow(false)">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import {
    addEditLabelAjax,
    uploadLabelImagesAjax
  } from '../../api'
  import {mapState, mapActions} from "vuex"

  export default {
    data() {
      return {
        addLabel: {
          uuId: '',
          name: '',
          source: '',
          desc: '',
          url: '',
          listShow: '',
          orderNo: '',
          imgId: ''
        },
        labelImg: null,
      }
    },

    computed: {
      ...mapState(["labelOptions", "loading", "addLabelIsShow"]),
    },

    mounted() {
      const editLabel = this.$route.query.editLabel
      if (editLabel) {
        this.addLabel = editLabel
        this.labelImg = editLabel.labelImage
        this.addLabel.imgId = editLabel.labelImage.uuId
      }
      this.loading.close()
    },

    methods: {
      ...mapActions(['addLabelShow']),

      // 上传标签图片
      async uploadLabelImages(param) {
        const imageData = new FormData()
        imageData.append('uploadFiles', param.file)
        const result = await uploadLabelImagesAjax(imageData)
        if (result.status != "SUCCESS")
          return this.$message.error(`上传标签图片失败，请稍后重试`)
        this.labelImg = result.data[0]
        this.addLabel.imgId = result.data[0].uuId
      },

      // 添加标签
      addEditLabel() {
        this.$refs.addLabelFrom.validate(async valid => {
          const msg = this.addLabel.uuId && '编辑' || '添加'
          if (! valid) return this.$message.warning(`${msg}标签失败，请确认${msg}规范`)
          const result = await addEditLabelAjax(this.addLabel)
          if (result.status != "SUCCESS")
            return this.$message.error(`${msg}标签失败，请稍后重试`)
          this.$message.success(`${msg}标签成功`)
          this.$router.push(`/label/list`)
        });
      },
    }
  }
</script>

<style>
.el-dialog__header {
  background-color: #f2f9ff;
}
</style>
