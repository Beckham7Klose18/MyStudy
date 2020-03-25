<template>
    <el-row>
        <el-form ref="recipeFrom" :model="recipe" label-width="100px" label-position="right">
            <el-row>
                <el-col :span="10" ref="left">
                    <el-form-item label="食谱名称"
                                  prop="name"
                                  :rules="[{required: 'true', message: '食谱名称不能为空'}]">
                        <el-input v-model="recipe.name" placeholder="请输入食谱名称"/>
                    </el-form-item>
                    <el-form-item label="食谱别名" v-for="(alias, index) in aliases">
                        <el-input v-model="aliases[index]" placeholder="请输入食谱别名">
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
                    <el-form-item label="食谱主图" prop="mainImageId" :rules="[{required: 'true', message: '食谱主图不能为空'}]">
                        <span style="color: gray;">建议图片尺寸：345 * 345</span>
                        <el-upload action="" list-type="picture-card" :limit="1"
                                   :accept="'jpg'"
                                   :http-request="addRecipeImage"
                                   :file-list="recipeMainImage? [recipeMainImage]: []"
                                   :on-exceed="() => $message.warning(`只能上传1张食谱主图`)">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                    <div v-for="(food, index) in mainFoods">
                        <el-form-item label="食谱主料" prop="mainFoodId" :rules="[{required: 'true', message: '食谱主料不能为空'}]">
                            <el-cascader v-model="food.cascader" :options="foodTypes" placeholder="请选择食谱主料" ref="myMainElCascader"
                                         @change="value => ElCascaderChange(value, index, true)" style="width: 70%;"/>
                            <el-tooltip content="增加主料" placement="top" effect="light">
                                <el-button type="info" plain @click="mainFoods.push({foodId: '',consumption: '', main: true, cascader: []})"><i class="el-icon-plus"/></el-button>
                            </el-tooltip>
                            <el-tooltip content="减少主料" placement="top" effect="light" v-show="mainFoods.length > 1">
                                <el-button type="info" plain @click="mainFoods.splice(index, 1)"><i class="el-icon-minus"/></el-button>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="主料用量" prop="mainFoodConsumption" :rules="[{required: 'true', message: '食谱主料用量不能为空'}]">
                            <el-autocomplete v-model="mainFoods[index].consumption" :fetch-suggestions="querySearch" placeholder="请输入主料用量" style="width: 70%;"/>
                        </el-form-item>
                    </div>
                    <div v-for="(food, index) in foods">
                        <el-form-item label="食谱配料">
                            <el-cascader v-model="food.cascader" :options="foodTypes" placeholder="请选择食谱配料" ref="myElCascader"
                                         @change="value => ElCascaderChange(value, index, false)" style="width: 70%;"/>
                            <el-tooltip content="增加配料" placement="top" effect="light">
                                <el-button type="info" plain @click="foods.push({foodId: '',consumption: '', main: false, cascader: []})"><i class="el-icon-plus"/></el-button>
                            </el-tooltip>
                            <el-tooltip content="减少配料" placement="top" effect="light" v-show="foods.length > 1">
                                <el-button type="info" plain @click="foods.splice(index, 1)"><i class="el-icon-minus"/></el-button>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="配料用量">
                            <el-autocomplete v-model="foods[index].consumption" :fetch-suggestions="querySearch" placeholder="请输入配料用量" style="width: 70%;"/>
                        </el-form-item>
                    </div>
                    <el-form-item label="食谱地区">
                        <el-select v-model="recipe.areaLabelIds" multiple placeholder="全国范围" size="medium" style="width: 65%;">
                            <el-option v-for="areaLabel in foodAreaLabels" :label="areaLabel.name" :value="areaLabel.uuId"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="麦吉阶段" prop="maijiStageLabelId" :rules="[{required: 'true', message: '食谱麦吉阶段不能为空'}]">
                        <el-radio v-model="recipe.maijiStageLabelId" v-for="label in allMaijiStageLabels" :label="label.uuId">{{label.name}}</el-radio>
                    </el-form-item>
                    <el-form-item label="食谱标签">
                        <el-checkbox-group v-model="recipe.recipeLabelIds" style="width: 350px;">
                            <el-checkbox v-for="label in foodLabels" :label="label.uuId">{{label.name}}</el-checkbox>
                            <el-button icon="el-icon-plus" circle size="mini" @click="addLabelShow(true)" style="margin-left: 20px;"></el-button>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="注意事项">
                        <el-input type="textarea" v-model="recipe.note" placeholder="请输入食谱的注意事项"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addRecipe" v-show="! isEditRecipe">确认添加</el-button>
                        <el-button type="primary" @click="editRecipe" v-show="isEditRecipe">确认修改</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="14">
                    <el-form-item label="食谱详情"prop="detailsText" :rules="[{required: 'true', message: '食谱详情不能为空'}]">
                        <Editor :style="{height: editorHeight}"/>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <LabelAdd/>
    </el-row>
</template>

<script>
    import {
      findAllFoodTypesAjax,
      addRecipeAjax,
      uploadRecipeImages,
      findRecipeByIdAjax,
      findAllLabelsByRecipeIdAjax,
      editRecipeAjax} from '../../api'
    import {dealImg} from "../../util"
    import {mapActions, mapState} from 'vuex'
    const Editor = () => import('../common/Editor')
    const LabelAdd = () => import('../label/LabelAdd')

    export default {
        components: {
            LabelAdd,
            Editor,
        },

        data() {
            return {
                editorHeight: '865px',
                isEditRecipe: false,
                foodTypes: [],
                aliases: [''],
                mainFoods: [{
                    foodId: '',
                    foodName: '',
                    consumption: '',
                    main: true,
                    cascaderStr: '',
                    cascader: [],
                }],
                foods: [{
                    foodId: '',
                    foodName: '',
                    consumption: '',
                    main: false,
                    cascaderStr: '',
                    cascader: []
                }],
                recipe: {
                    name: '',
                    alias: '',
                    mainImageId: '',
                    mainFoodId: '',
                    mainFoodConsumption: '',
                    foodId: '',
                    foodConsumption: '',
                    detailsText: '',
                    note: '',
                    maijiStageLabelId: '',
                    areaLabelIds: [],
                    recipeLabelIds: [],
                },
                recipeImages: null,
                foodAreaLabels: [],
                allMaijiStageLabels: [],
                foodLabels: [],
            }
        },

        computed: {
            ...mapState(['allLabels', 'loading']),
        },

        watch: {
            $route: function () {
                const fullPath = this.$route.fullPath
                if (fullPath.includes('/recipe/edit')) {
                    const recipeId = this.$route.params.recipeId
                    if (recipeId == ':recipeId') {
                        this.$message.warning(`请先选择要编辑的食谱`)
                        return this.$router.push(`/recipe/list`)
                    }
                } else {
                    this.aliases = ['']
                    this.recipe = {
                        name: '',
                            alias: '',
                            mainImageId: '',
                            mainFoodId: '',
                            mainFoodConsumption: '',
                            foodId: '',
                            foodConsumption: '',
                            detailsText: '',
                            note: '',
                            maijiStageLabelId: '',
                            areaLabelIds: [''],
                            recipeLabelIds: [],
                    },
                    this.recipeMainImage = null,
                    this.mainFoods = [{
                        foodId: '',
                        foodName: '',
                        consumption: '',
                        main: true,
                        cascaderStr: '',
                        cascader: [],
                    }],
                    this.foods = [{
                        foodId: '',
                        foodName: '',
                        consumption: '',
                        main: false,
                        cascaderStr: '',
                        cascader: []
                    }],
                    PubSub.publish("editorInit", '')
                }
            },

            allLabels: function (value) {
                this.foodAreaLabels = value.filter(label => label.listShow == 2).sort((L1, L2) => L1.name.length - L2.name.length)
                this.allMaijiStageLabels = value.filter(label => label.listShow == 1).sort((L1, L2) => L1.orderNo - L2.orderNo)
                this.foodLabels = value.filter(label => label.listShow == 0).sort((L1, L2) => L1.orderNo - L2.orderNo)
            },

            mainFoods: {
                deep: true,
                handler: function (value) {
                    this.recipe.mainFoodConsumption = value[0].consumption
                }
            },
        },

        updated() {
            this.editorHeight = (this.$refs.left.$el.clientHeight - 80) + 'px'
        },

        mounted () {
            this.findAllLabelBySourceVuex("食谱")
            this.findAllFoodTypes()
            const fullPath = this.$route.fullPath
            if (fullPath.includes('/recipe/edit/')) {
                this.loadingOpen()
                const recipeId = this.$route.params.recipeId
                if (recipeId && recipeId != ':recipeId') {
                    this.isEditRecipe = true
                    this.findRecipeById(recipeId)
                } else {
                    this.$message.warning(`请先选择要编辑的食谱！`);
                    return this.$router.push(`/recipe/list`)
                }
            } else this.loading.close()
            PubSub.subscribe('editorChange', (msg, value) => this.recipe.detailsText = value)
        },

        methods: {
            ...mapActions(['loadingOpen', 'findAllLabelBySourceVuex', 'addLabelShow']),

            // 回显编辑食谱
            async findRecipeById(recipeId) {
                const result = await findRecipeByIdAjax({data: recipeId});
                if (result.status == "SUCCESS") {
                    this.recipe.uuId = result.data.uuId
                    this.recipe.name = result.data.name
                    this.recipe.note = result.data.note
                    if (result.data.mainFoods) {
                        this.mainFoods = result.data.mainFoods.map(food => Object.assign(food, {cascader: food.cascaderStr.split(',')}))
                        this.recipe.mainFoodId = this.mainFoods[0].foodId
                        this.recipe.mainFoodConsumption = this.mainFoods[0].consumption
                    }
                    if (result.data.foods) {
                        this.foods = result.data.foods.map(food => Object.assign(food, {cascader: food.cascaderStr.split(',')}))
                        this.recipe.foodId = this.foods[0].foodId
                        this.recipe.foodConsumption = this.foods[0].consumption
                    }
                    this.aliases = result.data.aliases
                    this.recipeMainImage = result.data.mainImage
                    this.recipe.mainImageId = result.data.mainImage.uuId
                    PubSub.publish('editorInit', result.data.detailsText)
                }
                const result1 = await findAllLabelsByRecipeIdAjax({data: recipeId})
                if (result1.status == "SUCCESS") {
                    this.recipe.areaLabelIds = result1.data.filter(label => label.listShow == 2).map(label => label.uuId)
                    this.recipe.maijiStageLabelId = result1.data.find(label => label.listShow == 1).uuId
                    this.recipe.recipeLabelIds = result1.data.filter(label => label.listShow == 0).map(label => label.uuId)
                }
                this.loading.close()
            },

            querySearch(queryString, cb) {
                const queryArr = [{value: '若干'}, {value: '适量'}, {value: '少许'}, {value: '或输入具体数值(克)'}]
                const results = queryString? queryArr.filter(query => query.value.includes(queryString)): queryArr
                cb(results)  // 调用 callback 返回建议列表的数据
            },

            async addRecipeImage(param) {
                const imageData = new FormData()
                imageData.append('uploadFiles', param.file)
                const result = await uploadRecipeImages(imageData)
                if (result.status != "SUCCESS") this.$message.error(`上传食谱主图失败，请稍后重试！`)
                this.recipeMainImage = Object.assign(result.data[0], {isMain: 1})
                this.recipe.mainImageId = this.recipeImages.uuId
            },

            async findAllFoodTypes() {
                const result = await findAllFoodTypesAjax(true)
                if (result.status == "SUCCESS")
                    this.foodTypes = result.data.map(type => {
                        if (type.children && type.children.length >1)
                            type.children.sort((c1, c2) =>c1.label.length - c2.label.length)
                        return type
                    }).sort((t1, t2) => t1.label.length - t2.label.length)
            },

            ElCascaderChange(value, index, isMain) {
                if (isMain) {
                    const foodName = this.$refs.myMainElCascader[index].getCheckedNodes(true)[0].data.label
                    this.mainFoods[index].foodId = value[2]
                    this.mainFoods[index].foodName = foodName
                    this.mainFoods[index].cascaderStr = value.join(',')
                    this.recipe.mainFoodId = value[2]
                } else {
                    const foodName = this.$refs.myElCascader[index].getCheckedNodes(true)[0].data.label
                    this.foods[index].foodId = value[2]
                    this.foods[index].foodName = foodName
                    this.foods[index].cascaderStr = value.join(',')
                    this.recipe.foodId = value[2]
                }
            },

            addRecipe() {
                this.loadingOpen()
                this.$refs.recipeFrom.validate(async valid => {
                    if (! valid) {
                        this.$message.error(`添加食谱失败，请确认添加规范！`)
                        return this.loading.close()
                    }
                    this.recipe.labels = [this.recipe.maijiStageLabelId, ...this.recipe.areaLabelIds, ...this.recipe.recipeLabelIds].map(id => Object.assign({labelId: id}))
                    this.recipe.alias = this.aliases.join('、')
                    this.recipe.foods = [...this.mainFoods, ...this.foods].filter(food => food.foodId)
                  this.recipe.detailsText = dealImg(this.recipe.detailsText)
                    const result = await addRecipeAjax(this.recipe)
                    if (result.status != "SUCCESS") {
                        this.$message.error(`添加食谱失败！`)
                        return this.loading.close()
                    }
                    this.$message.success(`添加食谱成功！`)
                    return this.$router.push(`/recipe/list`)
                });
            },

            editRecipe() {
                this.loadingOpen()
                this.$refs.recipeFrom.validate(async valid => {
                    if (! valid) {
                        this.$message.error(`编辑食谱失败，请确认编辑规范！`)
                        return this.loading.close()
                    }
                    this.recipe.labels = [this.recipe.maijiStageLabelId, ...this.recipe.areaLabelIds, ...this.recipe.recipeLabelIds].map(id => Object.assign({labelId: id}))
                    if (this.aliases != null) this.recipe.alias = this.aliases.join('、')
                    this.recipe.foods = [...this.mainFoods, ...this.foods]
                    this.recipe.detailsText = dealImg(this.recipe.detailsText)
                    const result = await editRecipeAjax(this.recipe);
                    if (result.status != "SUCCESS") {
                        this.$message.error(`编辑食谱失败！`)
                        return this.loading.close()
                    }
                    this.$message.success(`编辑食谱成功！`)
                    this.$router.push(`/recipe/list`)
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
