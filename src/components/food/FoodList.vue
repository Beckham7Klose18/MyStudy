<template>
    <div>
        <el-tabs v-model="labelId" @tab-click="findAllFoods(pageOne)" type="card">
            <el-tab-pane v-for="label in foodLabels" :label="label.name" :name="label.uuId"/>
        </el-tabs>
        <el-row>
            <el-col :span="3">
              <el-row style="margin-bottom: 10px;">
                <el-button type="info" plain size="small" @click="elTreeReset" style="width: 90%;">清空筛选 <i class="el-icon-refresh-left"/></el-button>
              </el-row>
                <el-row style="margin-bottom: 10px;">
                    <el-button type="success" size="small" @click="findAllFoods(pageOne)" style="width: 90%;">分类筛选&nbsp;<i class="el-icon-search"/></el-button>
                </el-row>
                <el-row style="height: 623px; overflow: auto; margin-top: 14px;">
                    <el-tree :data="foodTypes" @check-change="elTreeCheckChange" :render-after-expand="false"
                                 show-checkbox node-key="value" ref="tree" highlight-current/>
                </el-row>
            </el-col>
            <el-col :span="21">
                <el-row style="margin-bottom: 10px;">
                    <router-link to="/food/add">
                          <el-button type="primary" size="small">添加食材&nbsp;<i class="el-icon-plus"></i></el-button>
                      </router-link>
                    <!--<el-upload action="" :http-request="uploadFoods" :show-file-list="false"
                               accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel">
                      <el-button size="small" type="success">导入食材 <i class="el-icon-upload2"/></el-button>
                    </el-upload>-->
                    <el-input v-model="searchFood.name" placeholder="食材名称或别名关键词搜索" size="small" style="width: 35%;">
                      <el-button slot="append" icon="el-icon-search" @click="findAllFoods"/>
                      <el-button slot="append" icon="el-icon-refresh-left" @click="resetSearch(true)"/>
                    </el-input>
                    <el-button type="danger" size="small" @click="delFoodsByIds(false)">批量删除&nbsp;<i class="el-icon-delete"/></el-button>
                </el-row>
                <el-table stripe max-height="678" :data="foodTable"
                          v-loading="foodTableLoading"
                          :header-cell-style="{backgroundColor: '#DCDFE6'}"
                          :cell-style="{paddingTop: '7px', paddingBottom: 0}"
                          @selection-change="val => this.delFoods = val">
                    <!--<el-table-column type="expand">
                        <template slot-scope="props">
                            <el-table stripe :data="dealWithNC(props.row.nutrientContentEntityList)"
                                      :header-cell-style="{backgroundColor: '#f2f9ff'}"
                                      :cell-style="{paddingTop: '7px', paddingBottom: '7px', backgroundColor: '#f2f9ff'}">
                                <el-table-column min-width="80"/>
                                <el-table-column label="营养元素" width="90"
                                                 :formatter="(row) => row.nc1.element"/>
                                <el-table-column label="元素含量" width="180"
                                                 :formatter="(row) => row.nc1.value +' 克/100克'"/>
                                <el-table-column label="营养元素" width="90"
                                                 :formatter="(row) => row.nc2 && row.nc2.element"/>
                                <el-table-column label="元素含量" width="180"
                                                 :formatter="(row) => row.nc2 && row.nc2.value +' 克/100克'"/>
                                <el-table-column label="营养元素" width="90"
                                                 :formatter="(row) => row.nc3 && row.nc3.element"/>
                                <el-table-column label="元素含量" width="120"
                                                 :formatter="(row) => row.nc3 && row.nc3.value +' 克/100克'"/>
                                <el-table-column min-width="80"/>
                            </el-table>
                        </template>
                    </el-table-column>-->
                    <el-table-column type="selection" fixed width="45"/>
                    <el-table-column label="主图" fixed width="65">
                        <template slot-scope="scope">
                            <img :src="scope.row.imgData && scope.row.imgData.smallUrl" width="45" height="45"/>
                        </template>
                    </el-table-column>
                    <el-table-column label="食材名称" width="165"
                                     prop="name" show-overflow-tooltip/>
                    <el-table-column label="食材别名" width="160"
                                     show-overflow-tooltip
                                     :formatter="(row) => row.alias? row.alias: '—'"/>
                    <el-table-column label="食材描述" width="180" show-overflow-tooltip
                                     :formatter="(row) => row.description? row.description: '—'"/>
                    <el-table-column label="注意事项" width="150" show-overflow-tooltip
                                     :formatter="(row) => row.remark? row.remark: '—'"/>
                    <el-table-column label="上传时间" width="100"
                                     :formatter="(row) => dateFormatter(row.inTime)"/>
                    <el-table-column label="操作" fixed="right" min-width="270">
                        <template slot-scope="scope">
                            <router-link :to="`/food/edit/${scope.row.uuId}`">
                                <el-button type="primary" size="small">编辑&nbsp;<i class="el-icon-edit-outline"/></el-button>
                            </router-link>
                            <el-button type="success" size="small" @clipboard:copy="scope.row.webUrl" @clipboard:success="onCopy"
                                @clipboard:error="onError">复制&nbsp;<i class="el-icon-document-copy"/></el-button>
                            <el-button type="danger" size="small" @click="delFoodsByIds (scope.row)">删除&nbsp;<i class="el-icon-delete"/></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row style="margin-top: 10px">
                    <el-col  style="text-align: right;">
                        <MJ_Pagination/>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {
      findAllFoodsAjax,
      findAllLabelBySourceAjax,
      delFoodsByIdsAjax,
      findAllFoodTypesAjax,
      uploadFoodsAjax
    } from '../../api'
    import { Loading } from 'element-ui'
    import {mapState, mapActions} from 'vuex'
    import {dateFormatter} from '../../util'
    const MJ_Pagination = () => import('../common/MJ_Pagination.vue')

    export default {
        components: {
            MJ_Pagination,
        },

        data() {
            return {
                foodTypes: null,
                foodTable: [],
                foodTableLoading: false,
                searchFood: {
                    name: null,
                    typeLabelIds: [],
                    labelIds: [],
                },
                showSelect: false,
                foodLabels: [],
                labelId: null,
                delFoods: [],
            }
        },

        computed: {
          ...mapState(['loadingOptions', 'pickerOptions', 'metaData']),

          pageOne: {
            get () {
              return {
                page: 1,
                size: this.metaData.size
              }
            }
          },
        },

        watch: {
            labelId: function (value) {
                if (value == '0') this.searchFood.labelIds = []
                else this.searchFood.labelIds = [value]
            }
        },

        mounted() {
            this.loading = Loading.service(this.loadingOptions)
            this.findAllFoodLabels()
            this.findAllFoodTypes()
            this.findAllFoods({page: 1, size: this.metaData.size})
            PubSub.subscribe('updateMetaData', () => this.findAllFoods())
        },

        methods: {
            ...mapActions(['updateMetaData']),
            dateFormatter,

            // 导入食材
            async uploadFoods(param) {
                this.loading = Loading.service(this.loadingOptions)
                const data = new FormData()
                data.append('uploadFile', param.file)
                const result = await uploadFoodsAjax(data);
                if (result.status != "SUCCESS") {
                    this.loading.close()
                    return this.$message.error(`导入食材失败，请稍后重试！`)
                }
                if (result.data) {
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(new Blob([result.data], {type: 'text/plain'}))
                    link.download = `导入食材错误提示(${dateFormatter(new Date().getTime())}).txt`
                    link.click()
                    this.$message.warning(`导入食材部分成功，请及时查看导入失败错误提示！`)
                } else this.$message.success(`导入食材成功！`)
                this.findAllFoods()
                this.loading.close()
            },

            dealWithNC(ncs) {
                const ncsNew = []
                ncs.forEach((nc, index) => {
                    if (index % 3 == 0) ncsNew.push({nc1: nc})
                    if (index % 3 == 1) ncsNew[ncsNew.length -1].nc2 = nc
                    if (index % 3 == 2) ncsNew[ncsNew.length -1].nc3 = nc
                })
                return ncsNew
            },

            elTreeCheckChange(node, isChecked) {
                if (node.children) return
                if (isChecked) this.searchFood.typeLabelIds.push(node.value)
                else this.searchFood.typeLabelIds = this.searchFood.labelIds.filter(id => id != node.value)
            },

            elTreeReset() {
                this.$refs.tree.setCheckedKeys([])
                this.searchFood.typeLabelIds = []
                this.findAllFoods({page: 1, size: this.metaData.size})
            },

            // 获取所有食材分类
            async findAllFoodTypes() {
                const result = await findAllFoodTypesAjax(false)
                if (result.status == "SUCCESS")
                    this.foodTypes = result.data.map(type => {
                        if (type.children && type.children.length >1)
                            type.children.sort((c1, c2) =>c1.label.length - c2.label.length)
                        return type
                    }).sort((t1, t2) => t1.label.length - t2.label.length)
            },

            // 获取所有食材相关标签
            async findAllFoodLabels() {
                const result = await findAllLabelBySourceAjax("食材");
                if (result.status == "SUCCESS") {
                    this.foodLabels = result.data;
                    this.foodLabels.unshift({
                        uuId: null,
                        name: '全部',
                    });
                }
            },

            // 获取食材表格数据
            async findAllFoods(metaData) {
                this.foodTableLoading = true
                const result = await findAllFoodsAjax(this.searchFood, metaData || this.metaData);
                if (result.status == "SUCCESS") {
                    this.foodTable = result.data
                    this.updateMetaData({metaData: result.resMetaData, init: true})
                    this.foodTableLoading = false
                }
                this.loading.close()
            },

            // (批量)删除食材
            delFoodsByIds (food) {
                let data = []
                if (food) data = [food]
                else data = this.delFoods
                const confirmHtml = data.reduce((html, food, index) => {
                    const width = Math.floor(100 / 2 / (data.length>3? 3: data.length))
                    if (index == 0) html = `<table style="width: 100%;">`
                    if (index % 3 == 0) html += `<tr>`
                    html +=`<td style="text-align: right; width: ${width}%;">
                                        <img src="${food.imgData.url}" width="45" height="45" style="margin-right: 10px;"/>
                                    </td>
                                    <td style="text-align: left; width: ${width}%;">${food.name}</td>`
                    if (index % 3 == 2) html += `</tr>`
                    if (index == this.delFoods.length -1) html += `</table>`
                    return html
                }, ``)
                this.$confirm(confirmHtml, '确认删除食材？', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    customClass: data.length == 1 ? 'MessageBox1': data.length == 2 ? 'MessageBox2': 'MessageBox3',
                    dangerouslyUseHTMLString: true
                }).then(async () => {
                    const result = await delFoodsByIdsAjax(data.map(food => food.uuId))
                    if (result.status != "SUCCESS") return this.$message.error(`删除失败，请稍后重试！`)
                    this.findAllFoods()
                    return this.$message.success(`删除成功！`)
                })
            },

            // 重置搜索
            resetSearch(isName) {
                if (isName) this.searchFood.name = null
                else this.searchFood.typeLabelIds = null
                this.findAllFoods()
            },
              onCopy(e) {
      this.$message({
        message: "复制成功，请转到新地址",
        type: "success"
      });
    },
    onError(e) {
      this.$message.error("复制失败，请重试");
    }
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

    .el-tooltip__popper {
        max-width: 20%;
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
