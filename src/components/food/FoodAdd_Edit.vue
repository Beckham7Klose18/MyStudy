<template>
    <el-row>
        <el-form ref="foodFrom" :model="food" label-width="100px" label-position="right">
            <el-row>
                <el-col :span="10" ref="left">
                    <el-form-item label="食材名称" prop="name" :rules="[{required: 'true', message: '食材名称不能为空'}]">
                        <el-input v-model="food.name" placeholder="请输入食材名称"/>
                    </el-form-item>
                    <el-form-item label="食材别名" v-for="(alias, index) in aliases">
                        <el-input v-model="aliases[index]" placeholder="请输入食材别名">
                            <template slot="append">
                                <el-tooltip content="增加别名" placement="top" effect="light">
                                    <el-button @click="aliases.push('')"><i class="el-icon-plus"/></el-button>
                                </el-tooltip>
                                <el-tooltip content="减少别名" placement="top" effect="light" v-show="aliases.length > 1">
                                    <el-button @click="aliases.splice(index, 1)"><i class="el-icon-minus"/></el-button>
                                </el-tooltip>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="食材主图" prop="mainImageId" :rules="[{required: 'true', message: '食材主图不能为空'}]">
                        <span style="color: gray;">建议图片尺寸：345 * 345</span>
                        <el-upload action="" list-type="picture-card" :limit="1"
                                   :http-request="addFoodMainImage"
                                   :file-list="foodMainImage? [foodMainImage]: []"
                                   :on-exceed="() => $message.warning(`只能上传1张食材主图`)">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="食材分类" prop="typeLabelId" :rules="[{required: 'true', message: '食材分类不能为空'}]">
                        <el-cascader v-model="cascader" :options="foodTypes" placeholder="请选择食材分类"
                                     style="width: 100%;"/>
                    </el-form-item>
                    <el-form-item label="关联商品">
                        <el-button plain type="info" @click="relevantGoodsShowChange(true)"
                                   style="width: 100%; margin-bottom: 10px;"><i class="el-icon-plus"/></el-button>
                        <el-table stripe :data="relevantGoodsTable"
                                  :show-header="true" v-show="relevantGoodsTable.length != 0"
                                  :header-cell-style="{backgroundColor: '#DCDFE6'}"
                                  :cell-style="{paddingTop: '7px', paddingBottom: 0}">
                            <el-table-column label="主图" width="65">
                                <template slot-scope="scope">
                                    <img :src="scope.row.mainImage.url" width="45" height="45"/>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品名称" width="115"
                                             prop="name"
                                             show-overflow-tooltip/>
                            <el-table-column label="库存数量" width="90"
                                             :formatter="(row) => row.stockVolume + ' 件'"/>
                            <el-table-column label="现价格" width="80"
                                             :formatter="(row) => row.presentPrice + ' 元'"/>
                            <el-table-column label="操作" min-width="80">
                                <template slot-scope="scope">
                                    <el-button type="danger" size="small"
                                               @click="relevantGoodsTableChange(relevantGoodsTable.filter(g => g.uuId != scope.row.uuId))">
                                        取消
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                    <el-form-item label="麦吉阶段">
                      <el-checkbox-group v-model="food.maijiStageLabelIds" style="width: 350px;">
                        <el-checkbox v-for="label in allMaijiStageLabels" :label="label.uuId">{{label.name}}</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="食材标签">
                      <el-checkbox-group v-model="food.foodLabelIds" style="width: 350px;">
                        <el-checkbox v-for="label in foodLabels" :label="label.uuId">{{label.name}}</el-checkbox>
                        <el-button icon="el-icon-plus" circle size="mini" @click="addLabelShow(true)" style="margin-left: 20px;"></el-button>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item>
                            <el-button type="primary" @click="addFood" v-show="! isEditFood">确认添加</el-button>
                            <el-button type="primary" @click="editFood" v-show="isEditFood">确认修改</el-button>
                            <router-link :to="`/food/list`">
                                <el-button>取消</el-button>
                            </router-link>
                    </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item label="食材热量" prop="heat" :rules="[{required: 'true', message: '食材热量不能为空'}]">
                    <el-input placeholder="请输入食材热量" v-model="food.heat">
                      <template slot="append">千卡</template>
                    </el-input>
                  </el-form-item>
                  <div v-for="(nc, index) in ncs">
                    <el-form-item label="营养元素">
                      <el-autocomplete v-model="ncs[index].element" :fetch-suggestions="querySearch"
                                       placeholder="请输入元素名称" style="width: 100%;">
                        <template slot="prepend">名称</template>
                        <template slot="append">
                          <el-tooltip content="增加营养元素" placement="top" effect="light">
                            <el-button @click="ncs.push({element: '',value: ''})"><i class="el-icon-plus"/>
                            </el-button>
                          </el-tooltip>
                          <el-tooltip content="减少营养元素" placement="top" effect="light" v-show="ncs.length > 1">
                            <el-button @click="ncs.splice(index, 1)"><i class="el-icon-minus"/></el-button>
                          </el-tooltip>
                          <br/>
                        </template>
                      </el-autocomplete>
                      <el-input v-model="ncs[index].value" placeholder="请输入元素含量"
                                style="width: 100%; margin-top: 10px;">
                        <template slot="prepend">含量</template>
                        <template slot="append">克/100克</template>
                      </el-input>
                    </el-form-item>
                  </div>
                  <el-form-item label="食材简介">
                    <el-input type="textarea" v-model="food.description" placeholder="请输入食材简介"/>
                  </el-form-item>
                  <el-form-item label="注意事项">
                    <el-input type="textarea" v-model="food.remark" placeholder="请输入食材注意事项"/>
                  </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <Food_Goods/>
        <LabelAdd/>
    </el-row>
</template>

<script>
    import {
      findAllFoodTypesAjax,
      addFoodAjax,
      uploadFoodImages,
      findFoodByIdAjax,
      findAllLabelsByFoodIdAjax,
      editFoodAjax,
      findAllGoodsByFoodIdAjax
    } from '../../api'
    import {mapActions, mapState} from 'vuex'
    import {dealImg} from "../../util"
    const Food_Goods = () => import('./Food_Goods')
    const LabelAdd = () => import('../label/LabelAdd')

    export default {
        components: {
            LabelAdd,
            Food_Goods
        },

        data() {
            return {
                editorHeight: '865px',
                isEditFood: false,
                foodTypes: [],
                aliases: [''],
                ncs: [{element: '脂肪', value: ''}, {element: '蛋白质', value: ''}, {element: '膳食纤维', value: ''}, {element: '碳水化合物', value: ''}],
                cascader: [],
                food: {
                    uuId: '',
                    name: '',
                    alias: '',
                    mainImageId: '',
                    detailText: '',
                    description: '',
                    remark: '',
                    heat: '',
                    goods: [],
                    typeLabelId: '',
                    cascaderStr: '',
                    maijiStageLabelIds: [],
                    foodLabelIds: [],
                },
                foodMainImage: null,
                foodAreaLabels: [],
                allMaijiStageLabels: [],
                foodLabels: [],
            }
        },

        computed: {
            ...mapState(['allLabels', 'loading']),
            ...mapState('food', ['relevantGoodsTable']),
        },

        watch: {
            $route: function () {
                const fullPath = this.$route.fullPath
                if (fullPath.includes('/food/edit')) {
                    const foodId = this.$route.params.foodId
                    if (foodId == ':foodId') {
                        this.$message.warning(`请先选择要编辑的食材`)
                        return this.$router.push(`/food/list`)
                    }
                } else {
                    this.isEditFood = false
                    this.food = {
                        uuId: '',
                        name: '',
                        alias: '',
                        mainImageId: '',
                        detailText: '',
                        description: '',
                        remark: '',
                        heat: '',
                        goods: [],
                        typeLabelId: '',
                        cascaderStr: '',
                        maijiStageLabelIds: [],
                        foodLabelIds: [],
                    }
                    this.foodMainImage = null
                    this.cascader = []
                    this.ncs = [{
                        element: '',
                        value: '',
                    }]
                    this.relevantGoodsTableChange([])
                    PubSub.publish("editorInit", '')
                    this.loading.close()
                }
            },

            allLabels: function (value) {
              this.foodAreaLabels = value.filter(label => !label.orderNo).sort((L1, L2) => L1.name.length - L2.name.length)
              this.allMaijiStageLabels = value.filter(label => label.orderNo && label.orderNo < 3).sort((L1, L2) => L1.orderNo - L2.orderNo)
              this.foodLabels = value.filter(label => label.orderNo > 2).sort((L1, L2) => L1.orderNo - L2.orderNo)
            },

            cascader: {
                deep: true,
                handler: function (value) {
                    this.food.cascaderStr = value.join(",")
                    this.food.typeLabelId = value[1]
                }
            },
        },

        mounted() {
            this.findAllLabelBySourceVuex("食材")
            this.findAllFoodTypes()
            const fullPath = this.$route.fullPath
            if (fullPath.includes('/food/edit/')) {
                this.loadingOpen()
                const foodId = this.$route.params.foodId
                if (foodId && foodId != ':foodId') {
                    this.isEditFood = true
                    this.findFoodById(foodId)
                } else {
                    this.$message.warning(`请先选择要编辑的食材`);
                    return this.$router.push(`/food/list`)
                }
            } else {
              this.relevantGoodsTableChange([])
              this.loading.close()
            }
            PubSub.subscribe('editorChange', (msg, value) => this.food.detailText = value)
        },

        updated() {
            this.editorHeight = (this.$refs.left.$el.clientHeight - 80) + 'px'
        },

        methods: {
            ...mapActions(['loadingOpen', 'findAllLabelBySourceVuex', 'addLabelShow']),
            ...mapActions('food', ['relevantGoodsShowChange', 'relevantGoodsTableChange']),

            // 回显编辑食材
            async findFoodById(foodId) {
                const result = await findFoodByIdAjax(foodId);
                if (result.status == "SUCCESS") {
                    Object.assign(this.food, result.data)
                    this.aliases = result.data.alias && result.data.alias.split("、") || ['']
                    this.cascader = result.data.cascaderStr.split(",")
                    this.foodMainImage = result.data.imgData
                    this.food.mainImageId = result.data.imgData && result.data.imgData.uuId
                    const result2 = await findAllGoodsByFoodIdAjax(foodId);
                    if (result2.status == "SUCCESS") this.relevantGoodsTableChange(result2.data || [])
                    const heatNC = result.data.nutrientContentEntityList.filter(nc => nc.element == '热量')
                    if (heatNC.length > 0) this.food.heat = heatNC[0].value
                    this.ncs = result.data.nutrientContentEntityList.filter(nc => nc.element != '热量')
                    PubSub.publish('editorInit', result.data.detailText)
                }
                const result1 = await findAllLabelsByFoodIdAjax(foodId)
                if (result1.status == "SUCCESS" && result1.data.length > 0) {
                    const maijiStageLabelIds = result1.data.filter(label => label.orderNo && label.orderNo < 3)
                    if (maijiStageLabelIds && maijiStageLabelIds.length > 0) this.food.maijiStageLabelIds = maijiStageLabelIds.map(label => label.uuId)
                    const foodLabelIds = result1.data.filter(label => label.orderNo > 2)
                    if (foodLabelIds && foodLabelIds.length > 0) this.food.foodLabelIds = foodLabelIds.map(label => label.uuId)
                }
                this.loading.close()
            },

            // 提示选择营养元素
            querySearch(queryString, cb) {
                const queryArr = [{value: '脂肪'}, {value: '蛋白质'}, {value: '膳食纤维'}, {value: '碳水化合物'}, {value: '或输入自定义'}]
                const results = queryString ? queryArr.filter(query => query.value.includes(queryString)) : queryArr
                cb(results)  // 调用 callback 返回建议列表的数据
            },

            // 上传食材主图
            async addFoodMainImage(param) {
                const imageData = new FormData()
                imageData.append('uploadFiles', param.file)
                const result = await uploadFoodImages(imageData)
                if (result.status != "SUCCESS") this.$message.error(`上传食材主图失败，请稍后重试！`)
                this.foodMainImage = Object.assign(result.data[0], {isMain: 1})
                this.food.mainImageId = this.foodMainImage.uuId
            },

            // 获取食材分类列表
            async findAllFoodTypes() {
                const result = await findAllFoodTypesAjax(false)
                if (result.status == "SUCCESS")
                    this.foodTypes = result.data.map(type => {
                        if (type.children && type.children.length > 1)
                            type.children.sort((c1, c2) => c1.label.length - c2.label.length)
                        return type
                    }).sort((t1, t2) => t1.label.length - t2.label.length)
            },

            // 添加食材
            addFood() {
                this.$refs.foodFrom.validate(async valid => {
                    if (!valid) return this.$message.error(`添加食材失败，请确认添加规范！`)
                    this.loadingOpen()
                    this.food.labels = [...this.food.maijiStageLabelIds, ...this.food.foodLabelIds].map(labelId => Object.assign({labelId}))
                    this.food.alias = this.aliases.join('、')
                    this.food.goods = this.relevantGoodsTable.map(goods => Object.assign({goodsId: goods.uuId}))
                    this.food.ncs = [...this.ncs, {element: '热量', value: this.food.heat}]
                    if (this.food.detailText) this.food.detailText = dealImg(this.food.detailText)
                    const result = await addFoodAjax(this.food)
                    if (result.status != "SUCCESS") {
                      this.loading.close()
                      return this.$message.error(`添加食材失败！`)
                    }
                    this.$message.success(`添加食材成功！`)
                    return this.$router.push(`/food/list`)
                });
            },

            // 编辑食材
            editFood() {
                this.$refs.foodFrom.validate(async valid => {
                    if (!valid) return this.$message.error(`添加食材修改失败，请确认编辑规范`)
                    this.loadingOpen()
                    this.food.labels = [...this.food.maijiStageLabelIds, ...this.food.foodLabelIds].map(labelId => Object.assign({labelId}))
                    this.food.alias = this.aliases && this.aliases.join('、')
                    this.food.goods = this.relevantGoodsTable.map(goods => Object.assign({goodsId: goods.uuId}))
                    this.food.ncs = [...this.ncs, {element: '热量', value: this.food.heat}]
                    if (this.food.detailText) this.food.detailText = dealImg(this.food.detailText)
                    const result = await editFoodAjax(this.food)
                    if (result.status != "SUCCESS") {
                      this.loading.close()
                      return this.$message.error(`食材编辑失败`)
                    }
                    this.$message.success(`食材编辑成功`)
                    this.$router.push(`/food/list`)
                })
            },
        },

        beforeDestroy() {
          this.relevantGoodsTableChange([])
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
</style>
