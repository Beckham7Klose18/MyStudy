<template>
    <div>
        <el-tabs v-model="labelId" type="card">
            <el-tab-pane v-for="label in recipeLabels" :label="label.name" :name="label.uuId"/>
        </el-tabs>
        <el-row style="margin-bottom: 10px;">
          <!--<el-upload action="" :http-request="uploadRecipes" :show-file-list="false"
                     accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel">
            <el-button size="small" type="success">导入食谱 <i class="el-icon-upload2"/></el-button>
          </el-upload>-->
          <router-link to="/recipe/add">
                <el-button type="primary" size="small">添加食谱&nbsp;<i class="el-icon-plus"></i>
                </el-button>
            </router-link>
          <el-input v-model="searchRecipe.name" placeholder="食谱名称或别名关键词" style="width: 30%; margin: 0 10px;" size="small">
            <el-button slot="append" icon="el-icon-search" @click="findAllRecipes"/>
            <el-button slot="append" icon="el-icon-refresh-left" @click="resetSelect('rsName')"/>
          </el-input>
          <el-button type="success" size="small" @click="resetSelect(! showSelect)">筛选&nbsp;<i class="el-icon-arrow-down"/></el-button>
          <transition name="showSelect">
            <transition-group v-show="showSelect">
              <el-button type="primary" size="small" @click="findAllRecipes" key="0">确认</el-button>
              <el-button type="info" size="small" @click="resetSelect" key="1">重置</el-button>
            </transition-group>
          </transition>
          <el-button type="danger" size="small" @click="delRecipesByIds(false)">批量删除&nbsp;<i class="el-icon-delete"/></el-button>
        </el-row>
        <transition name="showSelect">
            <div v-show="showSelect" style="background-color: #f2f9ff; padding: 10px 5%; margin: 10px 0; font-size: small;">
                <el-row>
                    <el-col :span="8">上传时间：
                        <el-date-picker size="mini" style="width: 60%;"
                            type="daterange"
                            align="right"
                            v-model="searchRecipe.uploadTimes"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"/>
                    </el-col>
                    <el-col :span="8">
                        收藏数量：
                        <el-input-number v-model="searchRecipe.collectionNos[0]" controls-position="right" size="mini"/>
                        至
                        <el-input-number v-model="searchRecipe.collectionNos[1]" controls-position="right" size="mini"/>
                    </el-col>
                    <el-col :span="8">
                        点赞数量：
                        <el-input-number v-model="searchRecipe.thumbsUpNos[0]" controls-position="right" size="mini"/>
                        至
                        <el-input-number v-model="searchRecipe.thumbsUpNos[1]" controls-position="right" size="mini"/>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 10px;">
                    <el-col :span="8">修改时间：
                        <el-date-picker size="mini" style="width: 60%;"
                                        type="daterange"
                                        align="right"
                                        v-model="searchRecipe.updateTimes"
                                        unlink-panels
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :picker-options="pickerOptions"/>
                    </el-col>
                    <el-col :span="8">
                        浏览数量：
                        <el-input-number v-model="searchRecipe.lookUpNos[0]" controls-position="right" size="mini"/>
                        至
                        <el-input-number v-model="searchRecipe.lookUpNos[1]" controls-position="right" size="mini"/>
                    </el-col>
                </el-row>
            </div>
        </transition>
        <el-table stripe
                  v-loading="recipeTableLoading"
                  :data="recipeTable"
                  :header-cell-style="{backgroundColor: '#DCDFE6'}"
                  :cell-style="{paddingTop: '7px', paddingBottom: 0}"
                  @sort-change="tableSortChange"
                  @selection-change="val => this.delRecipes = val">
            <el-table-column type="selection" fixed width="45"/>
            <el-table-column label="主图" fixed width="70">
                <template slot-scope="scope">
                    <img :src="scope.row.mainImage.smallUrl" width="45" height="45"/>
                </template>
            </el-table-column>
            <el-table-column label="食谱名称" width="170"
                             prop="name">
            </el-table-column>
            <el-table-column label="食谱别名" width="160"
                             :formatter="(row) => row.alias? row.alias: '—'">
            </el-table-column>
            <el-table-column label="浏览次数" width="105"
                             prop="look_up_no"
                             sortable="custom"
                             :formatter="(row) => row.lookUpNo">
            </el-table-column>
            <el-table-column label="收藏数量" width="105"
                             prop="collection_no"
                             sortable="custom"
                             :formatter="(row) => row.collectionNo">
            </el-table-column>
            <el-table-column label="点赞数量" width="105"
                             prop="thumbs_up_no"
                             sortable="custom"
                             :formatter="(row) => row.thumbsUpNo">
            </el-table-column>
            <el-table-column label="上传时间" width="105"
                             prop="upload_time"
                             sortable="custom"
                             :formatter="(row) => dateFormatter(row.uploadTime)">
            </el-table-column>
            <el-table-column label="修改时间" width="105"
                             prop="update_time"
                             sortable="custom"
                             :formatter="(row) => dateFormatter(row.updateTime)">
            </el-table-column>
            <el-table-column label="美食推荐" width="85" fixed="right" v-if="labelId == 1">
                <template slot-scope="scope">
                    <el-tag v-show="scope.row.isRecommend">推荐&nbsp;<i class="el-icon-star-on"/></el-tag>
                    <el-tag type="info" v-show="!scope.row.isRecommend">未推荐</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="推荐操作" width="120" fixed="right" v-if="labelId == 1">
                <template slot-scope="scope">
                    <el-button type="success" size="small" v-if="! scope.row.isRecommend"
                               @click="addOrCancelRecommend(scope.row.isRecommend, scope.row.uuId)">添加推荐&nbsp;<i class="el-icon-plus"/>
                    </el-button>
                    <el-button type="danger" size="small" v-if="scope.row.isRecommend"
                               @click="addOrCancelRecommend(scope.row.isRecommend, scope.row.uuId)">取消推荐&nbsp;<i class="el-icon-minus"/>
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="260" fixed="right" v-if="labelId != 1">
                <template slot-scope="scope" v-if="labelId != 1">
                    <router-link :to="`/recipe/edit/${scope.row.uuId}`">
                        <el-button type="primary" size="small">编辑&nbsp;<i class="el-icon-edit-outline"/></el-button>
                    </router-link>
                    <el-button type="info" size="small" v-clipboard:copy="scope.row.webUrl" v-clipboard:success="() => $message.success('复制成功')"
                               v-clipboard:error="() => $message.error('复制失败，请重试')">复制&nbsp;<i class="el-icon-document-copy"/></el-button>
                    <el-button type="danger" size="small" @click="delRecipesByIds (scope.row)">删除&nbsp;<i
                            class="el-icon-delete"/></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row style="margin-top: 10px">
            <el-col style="text-align: right;">
                <MJ_Pagination/>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {
        findAllRecipesAjax,
        findAllRecommendRecipesAjax,
        findAllLabelBySourceAjax,
        delRecipesByIdsAjax,
        uploadRecipesAjax,
        addOrCancelRecommendAjax
    } from '../../api'
    import {mapState, mapActions} from 'vuex'
    import {dateFormatter} from '../../util'
    const MJ_Pagination = () => import('../common/MJ_Pagination.vue')

    export default {
        components: {
            MJ_Pagination,
        },

        data() {
            return {
                recipeTable: [],
                recipeTableLoading: false,
                searchRecipe: {
                    name: null,
                    orderBy: 'update_time',
                    order: 'desc',
                    lookUpNos: [],
                    collectionNos: [],
                    thumbsUpNos: [],
                    uploadTimes: null,
                    updateTimes: null,
                    labelIds: [],
                },
                showSelect: false,
                labelId: null,
                delRecipes: [],
                recipeLabels: [],
            }
        },

        computed: {
            ...mapState(['loading', 'pickerOptions', 'metaData']),
        },

        watch: {
            $route: function () {
                if (this.$route.fullPath.includes('/recipe/recommend')) this.labelId = '1'
                else this.labelId = '0'
            },

            labelId: function (value) {
                if (value == 0 || value == 1) this.searchRecipe.labelIds = []
                else this.searchRecipe.labelIds = [value]
                this.findAllRecipes()
            }
        },

        mounted() {
            if (this.$route.fullPath.includes('/recipe/recommend')) this.labelId = '1'
            this.findAllRecipes()
            this.findAllRecipeLabels()
            PubSub.subscribe('updateMetaData', this.findAllRecipes)
        },

        methods: {
            ...mapActions(['loadingOpen', 'updateMetaData']),
            dateFormatter,  // 日期格式化

            // 导入食谱
            async uploadRecipes(param) {
                this.loadingOpen()
                const data = new FormData()
                data.append('uploadFile', param.file)
                const result = await uploadRecipesAjax(data);
                if (result.status != "SUCCESS") {
                    this.loading.close()
                    return this.$message.error(`导入食谱失败，请稍后重试！`)
                }
                if (result.data) {
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(new Blob([result.data], {type: 'text/plain'}))
                    link.download = `导入食谱错误提示(${dateFormatter(new Date().getTime())}).txt`
                    link.click()
                    this.$message.warning(`导入食谱部分成功，请及时查看导入失败错误提示！`)
                } else this.$message.success(`导入食谱成功！`)
                this.findAllRecipes()
                this.loading.close()
            },

            // 食谱表格排序
            tableSortChange({prop, order}) {
                this.searchRecipe.orderBy = prop
                this.searchRecipe.order = order == 'ascending' ? 'asc' : 'desc'
                this.findAllRecipes()
            },

            // 获取所有食谱相关标签
            async findAllRecipeLabels() {
                const result = await findAllLabelBySourceAjax("食谱", 1);
                if (result.status == "SUCCESS") {
                    this.recipeLabels = result.data;
                    this.recipeLabels.unshift({
                        uuId: '0',
                        name: '全部',
                    }, {
                        uuId: '1',
                        name: '美食推荐',
                    });
                }
            },

            // 获取食谱表格数据
            async findAllRecipes() {
                this.recipeTableLoading = true
                let result = {}
                if (this.labelId == 1) {
                    result = await findAllRecommendRecipesAjax(this.metaData);
                    this.$router.push("/recipe/recommend");
                } else {
                    result = await findAllRecipesAjax(this.searchRecipe, this.metaData);
                    this.$router.push("/recipe/list");
                }
                if (result.status == "SUCCESS") {
                    this.recipeTable = result.data
                    this.updateMetaData({metaData: result.resMetaData, init: true})
                    this.recipeTableLoading = false
                }
                this.loading.close()
            },

            // 重置筛选条件
            resetSelect(showSelect) {
                if (showSelect == 'rsName') this.searchRecipe.name = null
                else {
                    if (showSelect != undefined) this.showSelect = showSelect
                    this.searchRecipe = {
                        name: null,
                        orderBy: 'update_time',
                        order: 'desc',
                        lookUpNos: [],
                        collectionNos: [],
                        thumbsUpNos: [],
                        uploadTimes: null,
                        updateTimes: null,
                        labelIds: [],
                    }
                }
                this.findAllRecipes();
            },

            delMaijiArticleById(recipe) {
                let data = []
                if (recipe) data = [recipe]
                else data = this.delRecipes
                const confirmHtml = data.reduce((html, recipe, index) => {
                    const width = Math.floor(100 / 2 / (data.length > 3 ? 3 : data.length))
                    if (index == 0) html = `<table style="width: 100%;">`
                    if (index % 3 == 0) html += `<tr>`
                    html += `<td style="text-align: right; width: ${width}%;">
                                        <img src="${recipe.mainImage.url}" width="45" height="45" style="margin-right: 10px;"/>
                                    </td>
                                    <td style="text-align: left; width: ${width}%;">${recipe.name}</td>`
                    if (index % 3 == 2) html += `</tr>`
                    if (index == this.delRecipes.length - 1) html += `</table>`
                    return html
                }, ``)
                this.$confirm(confirmHtml, '确认删除食谱？', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    customClass: data.length == 1 ? 'MessageBox1' : data.length == 2 ? 'MessageBox2' : 'MessageBox3',
                    dangerouslyUseHTMLString: true
                }).then(async () => {
                    const result = await delRecipesByIdsAjax(data.map(recipe => recipe.uuId))
                    if (result.status != "SUCCESS") return this.$message.error(`删除失败，请稍后重试！`)
                    this.findAllRecipes()
                    return this.$message.success(`删除成功！`)
                })
            },

            async addOrCancelRecommend(isRecommend, recipeId) {
                const result = await addOrCancelRecommendAjax(recipeId)
                const msg = isRecommend? '取消': '添加';
                if (result.status != "SUCCESS") return this.$message.error(`${msg}美食推荐失败，请稍后重试`)
                this.findAllRecipes()
                this.$message.success(`${msg}美食推荐成功`)
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

    .selecte_name {
        /*width: 7.5%;*/
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

    .el-input-number--mini {
        width: 80px;
        line-height: 26px;
    }

    .el-input-number.is-controls-right .el-input__inner {
        padding-left: 0px;
        padding-right: 30px;
    }

    /*指定过渡样式*/
    .showSelect-enter-active, .showSelect-leave-active {
        transition: all 1s
    }

    /*指定隐藏时的样式*/
    .showSelect-enter, .showSelect-leave-to {
        opacity: 0;
        transform: translateX(32px)
    }

    .showSelect {
        margin-bottom: 10px;
        background-color: #f2f9ff;
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

    .MessageBox1 {
        width: 320px;
    }

    .MessageBox2 {
        width: 420px;
    }

    .MessageBox3 {
        width: 520px;
    }
</style>
