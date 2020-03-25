<template>
    <el-form :model="goods" ref="goodsFrom" label-width="110px" label-position="right">
      <el-col :span="9" ref="left">
          <el-form-item label="商品名称" prop="name" :rules="[{required: 'true', message: '商品名称不能为空'}]">
              <el-input v-model="goods.name" placeholder="请输入商品名称" size="medium" style="width: 350px;"/>
          </el-form-item>
          <el-form-item label="商品简称" prop="name" :rules="[{required: 'true', message: '商品简称不能为空'}]">
              <el-input v-model="goods.shortName" placeholder="请输入商品简称" size="medium" style="width: 350px;"/>
          </el-form-item>
          <el-form-item label="商品主图">
              <span style="color: gray;">建议图片尺寸：345 * 345 * 3</span>
              <el-upload
                      action
                      list-type="picture-card"
                      :limit="1"
                      :http-request="param => addGoodsImages(param.file, 0)"
                      :on-remove="delGoodsImage"
                      :file-list="goodsMainImage? [goodsMainImage]: []"
                      :on-exceed="() => $message.warning(`只能上传1张商品主图`)">
                  <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
          </el-form-item>
          <el-form-item label="商品轮播图" v-show="goodsDetailImages[0] && goodsDetailImages[0].uuId">
              <p style="margin: 0; color: gray; font-size: small; text-align: center;">商品主图为商品轮播图第一张</p>
              <el-carousel height="150px" type="card">
                  <el-carousel-item v-for="(img, index) in goodsDetailImages">
                      <h4 style="text-align: center; margin-bottom: -10px; margin-top: 0;">{{index + 1}}</h4>
                      <el-image :src="img.url" v-show="img.url"/>
                  </el-carousel-item>
              </el-carousel>
              <el-button
                      type="primary"
                      size="small"
                      @click="egdiShow = true"
                      v-show="! egdiShow && isEditGoods">
                  编辑轮播图
                  <i class="el-icon-edit"/>
              </el-button>
              <el-button
                      type="info"
                      size="small"
                      @click="egdiShow = false"
                      v-show="egdiShow && isEditGoods"
              >
                  取消编辑
                  <i class="el-icon-circle-close"/>
              </el-button>
          </el-form-item>
          <div v-for="(img, index) in goodsDetailImages" :key="img.uuId" v-show="egdiShow">
              <el-form-item :label="'商品轮播图' + (index + 1)">
                  <span style="color: gray;">建议图片尺寸：345 * 345 * 3</span>
                  <el-upload
                          action
                          list-type="picture-card"
                          :file-list="img ? [img]:[]"
                          :limit="1"
                          :on-remove="delGoodsImage"
                          :http-request="param => addGoodsImages(param.file, index)"
                          :on-exceed="() => $message.warning(`请点击【添加图片】`)">
                      <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                  <el-button type="success" size="small" @click="goodsDetailImages.splice(index+1, 0, '')">
                      添加图片
                      <i class="el-icon-circle-plus-outline"/>
                  </el-button>
              </el-form-item>
          </div>
          <el-form-item
                  label="商品净含量"
                  prop="netWeight"
                  :rules="[{required: 'true', message: '商品净含量不能为空'}]"
          >
              <el-input-number type="weight" v-model="goods.netWeight" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;克
          </el-form-item>
          <el-form-item
                  label="商品物流重量"
                  prop="weight"
                  :rules="[{required: 'true', message: '商品物流重量不能为空'}]"
          >
              <el-input-number type="weight" v-model="goods.weight" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;克
          </el-form-item>
          <el-form-item
                  label="商品原价格"
                  prop="originalPrice"
                  :rules="[{required: 'true', message: '商品原价格不能为空'}]"
          >
              <el-input-number
                      type="originalPrice"
                      v-model="goods.originalPrice"
                      :precision="2"
                      :step="0.1"
                      :min="0.00"
                      size="medium"
              />&nbsp;&nbsp;元
          </el-form-item>
          <el-form-item
                  label="商品现价格"
                  prop="presentPrice"
                  :rules="[{required: 'true', message: '商品现价格不能为空'}]"
          >
              <el-input-number
                      type="presentPrice"
                      v-model="goods.presentPrice"
                      :precision="2"
                      :step="0.1"
                      :min="0.00"
                      size="medium"
              />&nbsp;&nbsp;元
          </el-form-item>
          <el-form-item label="库存" prop="stockVolume" :rules="[{required: 'true', message: '库存不能为空'}]">
              <el-input-number
                      type="stockVolume"
                      v-model="goods.stockVolume"
                      :step="1"
                      :min="0"
                      size="medium"
              />&nbsp;&nbsp;件
          </el-form-item>
          <el-form-item label="商品参数">
            <el-button size="small" @click="paramsShow = true"><i :class="{'el-icon-plus': ! editGoodsId, 'el-icon-edit': editGoodsId}"/> {{editGoodsId && '编辑' || '添加'}}</el-button>
          </el-form-item>
          <el-form-item label="积分兑换">
              <el-radio-group v-model="goods.isExchange">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item
                  label="积分兑换值"
                  v-if="goods.isExchange == 1"
                  prop="integral"
                  :rules="[{required: 'true', message: '积分兑换值不能为空'}]"
          >
              <el-input-number type="integral" v-model="goods.integral" :step="1" :min="0" size="medium"/>&nbsp;&nbsp;分
          </el-form-item>
          <el-form-item label="商品标签">
              <el-checkbox-group v-model="goodsLabelIds" style="width: 350px;">
                  <el-checkbox v-for="label in allLabels" :label="label.uuId">{{label.name}}</el-checkbox>
                  <el-button icon="el-icon-plus" circle size="mini" @click="addLabelShow(true)"></el-button>
              </el-checkbox-group>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="addGoods" v-show="! isEditGoods">确认添加</el-button>
              <el-button type="primary" @click="updateGoods" v-show="isEditGoods">确认编辑</el-button>
              <el-button>取消</el-button>
          </el-form-item>
      </el-col>
      <el-col :span="15">
          <el-form-item
                  label="商品详情"
                  prop="detailText"
                  :rules="[{required: 'true', message: '商品详情不能为空'}]"
          >
              <Editor :style="{height: editorHeight}"/>
          </el-form-item>
      </el-col>
      <el-dialog :title="editGoodsId && '编辑商品参数' || '添加商品参数'" :visible.sync="paramsShow" :width="editParamTypeShow && '40%' || '35%'">
        <el-form label-width="120px" label-position="right">
          <el-form-item :label="param.uuId && param.name || '添加商品参数'" v-for="(param, index) in goodsParams">
            <el-input v-model="param.value" v-if="param.uuId" placeholder="请输入参数值" clearable
                      :style="{width: editParamTypeShow && '40%' || '90%'}" :disabled="editParamTypeShow"/>
            <el-input v-model="param.name" v-if="! param.uuId" placeholder="请输入参数名称" clearable style="width: 55%;"/>
            <el-button size="small" type="success" @click="paramsSort(index, true)" v-if="editParamTypeShow" icon="el-icon-top">排序</el-button>
            <el-button size="small" type="warning" @click="paramsSort(index, false)" v-if="editParamTypeShow" icon="el-icon-bottom">排序</el-button>
            <el-button size="small" type="danger" @click="delParamType(param, index)" v-if="editParamTypeShow" icon="el-icon-delete">删除</el-button>
          </el-form-item>
          <el-form-item label="添加参数类型" v-if="editParamTypeShow">
            <el-button size="small" @click="goodsParams.push({sort: goodsParams.length})" v-if="editParamTypeShow" icon="el-icon-plus" style="width: 80px;"/>
          </el-form-item>
          <el-row style="text-align: center;">
            <el-button type="primary" @click="goods.params = goodsParams; paramsShow = false" v-if="! editParamTypeShow">确认{{editGoodsId && '编辑' || '添加'}}</el-button>
            <el-button @click="paramsShow = false" v-if="! editParamTypeShow">取消</el-button>
            <el-button type="warning" @click="editParamTypeShow = true" v-if="! editParamTypeShow">编辑参数类型</el-button>
            <el-button type="primary" @click="editParamType" v-if="editParamTypeShow">确认编辑参数类型</el-button>
            <el-button @click="editParamTypeShow = false" v-if="editParamTypeShow">取消</el-button>
          </el-row>
        </el-form>
      </el-dialog>
    </el-form>
</template>

<script>
    import {
      uploadGoodsImagesAjax,
      addGoods,
      updateGoodsAjax,
      findGoodsById,
      findAllLabelsByGoodsId,
      updateBelongLabels,
      updateGoodsImages,
      getParamConfigAjax,
      editParamConfigsAjax,
      delParamConfigsAjax
    } from "../../api"
    import {mapActions, mapState} from "vuex"
    import {dealImg} from "../../util"
    const Editor = () => import('../common/Editor.vue')
    const LabelAdd = () => import('../label/LabelAdd.vue')

    export default {
        components: {
            Editor,
            LabelAdd
        },

        data() {
            return {
                editorHeight: "865px",
                userId: JSON.parse(localStorage.getItem("maijiUser")).uuId,
                goods: {
                    name: "",
                    shortName: "",
                    netWeight: 0,
                    weight: 0,
                    originalPrice: 0.00,
                    presentPrice: 0.00,
                    stockVolume: 0,
                    isExchange: 0,
                    integral: 0,
                    detailText: ""
                },
                goodsMainImage: null,
                goodsDetailImages: [],
                goodsLabelIds: [],
                isEditGoods: false,
                editGoods: {},
                editGoodsId: null,
                editGoodsMainImage: null,
                editGoodsDetailImages: [],
                editGoodsLabelIds: [],
                egdiShow: false,
                dialogFormVisible: false,
                allGoodsLabels: [],
                addLabelModel: {
                    name: "",
                    source: ""
                },
                paramsShow: false,
                editParamTypeShow: false,
                editGoodsId: null,
                goodsParams: [{}],
            };
        },

        computed: {
            ...mapState(['loading', 'maijiUser', "allLabels", "loadingOptions"])
        },

        mounted() {
            const fullPath = this.$route.fullPath
            if (fullPath.includes('/goods/edit')) {
                this.editGoodsId = this.$route.params.goodsId
                if (this.editGoodsId == ':goodsId') {
                    this.$message.warning(`请先选择要编辑的商品`)
                    return this.$router.push(`/goods/list`)
                }
                this.isEditGoods = true
                this.findGoodsById(this.editGoodsId)
            } else {
                this.goodsDetailImages.push("")
                this.egdiShow = true
                this.loading.close()
            }
            this.findAllLabelBySourceVuex("商品")
            this.getParamConfig(this.editGoodsId)
            PubSub.subscribe("editorChange", (msg, value) => this.goods.detailText = value)
        },

        watch: {
            $route: function () {
                const fullPath = this.$route.fullPath
                if (fullPath.includes('/goods/edit')) {
                    const goodsId = this.$route.params.goodsId
                    if (goodsId == ':goodsId') {
                        this.$message.warning(`请先选择要编辑的商品`)
                        return this.$router.push(`/goods/list`)
                    }
                } else {
                    this.egdiShow = true
                    this.isEditGoods = false
                    this.goods = {
                        name: "",
                        netWeight: 0,
                        weight: 0,
                        originalPrice: 0.00,
                        presentPrice: 0.00,
                        stockVolume: 0,
                        isExchange: 0,
                        integral: 0,
                        detailText: ""
                    }
                    this.goodsMainImage = null
                    this.goodsDetailImages = ['']
                    this.goodsLabelIds = []
                    this.allGoodsLabels = []
                    PubSub.publish("editorInit", '')
                    this.loading.close()
                }
            }
        },

        updated() {
            this.editorHeight = this.$refs.left.$el.clientHeight - 80 + "px";
        },

        methods: {
            ...mapActions(["loadingOpen", "findAllLabelBySourceVuex", "addLabelShow"]),

            delParamType (param, index) {
              let {goodsParams} = this
              if (! param.uuId) return goodsParams.splice(index, 1)
              this.$confirm(`确认删除商品参数类型：${param.name} ？所有已添加的此类型商品参数将全部删除！`, '删除商品参数类型', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(async () => {
                const result = await delParamConfigsAjax(param.uuId)
                if (result.status != "SUCCESS") return this.$message.error(`删除商品参数类型失败，请稍后重试`)
                goodsParams.splice(index, 1)
                this.$message.success(`删除商品参数类型成功`)
              })
            },

            async editParamType () {
              let {goodsParams} = this
              goodsParams = goodsParams.filter(param => param.name).map((param, index) => Object.assign(param, {sort: index}))
              const result = await editParamConfigsAjax(goodsParams)
              if (result.status != "SUCCESS") return this.$message.error(`编辑商品参数类型失败，请稍后重试`)
              this.goodsParams = result.data
              this.$message.success(`编辑商品参数类型成功`)
              this.editParamTypeShow = false
            },

            paramsSort (index1, top) {
              const {goodsParams} = this
              if (index1 == 0 && top) return
              if (index1 == goodsParams.length - 1 && ! top) return
              this.goodsParams = [{}]
              let param1 = goodsParams[index1]
              const index2 = top && index1 - 1 + '' || index1 + 1
              let param2 = goodsParams[index2];
              [param1.sort, param2.sort] = [param2.sort, param1.sort];
              [goodsParams[index1], goodsParams[index2]] = [param2, param1]
              this.goodsParams = goodsParams
            },

            async getParamConfig (goodsId) {
              const result = await getParamConfigAjax(goodsId)
              if (result.status == "SUCCESS") this.goodsParams = result.data
            },

            async findGoodsById(goodsId) {
                const result = await findGoodsById({data: goodsId})
                if (result.status == "SUCCESS") {
                    this.editGoodsId = result.data.uuId
                    for (let key of Object.keys(this.goods))
                        this.goods[key] = result.data[key]
                    this.editGoods = JSON.parse(JSON.stringify(this.goods))
                    this.editGoodsDetailImages = result.data.detailImages
                    this.editGoodsMainImage = result.data.mainImage
                    this.goodsDetailImages = JSON.parse(
                        JSON.stringify(result.data.detailImages)
                    )
                    this.goodsMainImage = result.data.mainImage && JSON.parse(
                        JSON.stringify(result.data.mainImage)
                    )
                    PubSub.publish("editorInit", result.data.detailText)
                }
                const result1 = await findAllLabelsByGoodsId({data: goodsId})
                if (result1.status == "SUCCESS") {
                    this.editGoodsLabelIds = result1.data;
                    this.goodsLabelIds = result1.data;
                }
                this.loading.close()
            },

            async addGoodsImages(file, index) {
                const imageData = new FormData()
                imageData.append("uploadFiles", file)
                const result = await uploadGoodsImagesAjax(imageData)
                if (result.status == "SUCCESS") {
                    if (index == 0) {
                        this.goodsMainImage = result.data[0]
                        this.goodsMainImage.isMain = 1
                        this.goodsMainImage.no = index
                        if (this.goodsDetailImages[0]) this.goodsDetailImages.unshift(this.goodsMainImage)
                        else this.goodsDetailImages.splice(index, 1, this.goodsMainImage)
                    } else this.goodsDetailImages.splice(index, 1, Object.assign(result.data[0], {isMain: 1, no: index}))
                }
            },

            delGoodsImage(file) {
                if (file.no == 0) this.goodsMainImage = null
                this.goodsDetailImages = this.goodsDetailImages.filter(image => image.uuId != file.uuId)
                if (this.goodsDetailImages.length == 0) this.goodsDetailImages = ['']
            },

            addGoods() {
                this.loadingOpen()
                this.$refs.goodsFrom.validate(async valid => {
                    if (!valid) {
                        this.loading.close()
                        return this.$message.error(`商品添加失败，请确认添加规范`)
                    }
                    if (!this.goodsMainImage) {
                        this.loading.close()
                        return this.$message.error(`商品添加失败，商品主图不能为空`)
                    }
                    this.goods.mainImage = this.goodsMainImage
                    this.goods.detailImages = this.goodsDetailImages.filter(img => img)
                        .map((img, index) => Object.assign(img, {no: index}))
                    this.goods.labelIds = this.goodsLabelIds
                    this.goods.detailText = dealImg(this.goods.detailText)
                    this.goods.userId =  this.maijiUser.uuId
                    const result = await addGoods(this.goods)
                    if (result.status != "SUCCESS") {
                        this.loading.close()
                        return this.$message.error(`商品添加失败`)
                    }
                    this.$message.success(`商品添加成功`)
                    this.$router.push(`/goods/list`)
                });
            },

            updateGoods() {
                this.loadingOpen()
                this.$refs.goodsFrom.validate(async valid => {
                    if (!valid) {
                        this.loading.close();
                        return this.$message.error(`商品编辑失败，请确认编辑规范！`);
                    }
                    //编辑商品图片
                    if (!this.goodsMainImage) {
                        this.loading.close();
                        return this.$message.error(`商品主图不能为空`);
                    }
                    this.goodsDetailImages = this.goodsDetailImages.filter(img => img)
                        .map((img, index) => Object.assign(img, {no: index}))
                    const result = await updateGoodsImages(this.editGoodsId, this.goodsDetailImages)
                    if (result.status != "SUCCESS") {
                        this.loading.close()
                        return this.$message.error(`商品图片编辑失败`)
                    }

                    //编辑商品标签
                    const delLabelIds = this.editGoodsLabelIds.filter(labelId => !this.goodsLabelIds.includes(labelId))
                    const addLabelIds = this.goodsLabelIds.filter(labelId => !this.editGoodsLabelIds.includes(labelId))
                    if (delLabelIds.length > 0 || addLabelIds.length > 0) {
                        const result = await updateBelongLabels(this.maijiUser.uuId, this.editGoodsId, delLabelIds, addLabelIds)
                        if (result.status != "SUCCESS") {
                            this.loading.close()
                            return this.$message.error(`商品标签编辑失败`)
                        }
                    }

                    // 编辑商品数据
                    const data = {};
                    for (let key of Object.keys(this.goods))
                        if (this.editGoods[key] != this.goods[key])
                            data[key] = this.goods[key]
                    if (Object.keys(data).length > 0) {
                        data.uuId = this.editGoodsId
                        data.detailText = dealImg(data.detailText)
                        data.userId =  this.maijiUser.uuId
                        const result = await updateGoodsAjax(data, this.userId)
                        if (result.status != "SUCCESS") {
                            this.loading.close()
                            return this.$message.error(`商品编辑失败`)
                        }
                    }

                    //编辑商品成功
                    this.$message.success(`商品编辑成功`)
                    this.$router.push(`/goods/list`)
                });
            },
        }
    }
</script>

<style>

</style>
