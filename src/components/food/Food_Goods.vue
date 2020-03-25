<template>
    <el-row>
        <el-dialog title="选择食材关联商品" :visible.sync="relevantGoodsShow" width="60%">
            <el-row style="margin-bottom: 10px;">
                <el-col :span="10">
                    <el-input v-model="searchGoodsName" placeholder="商品名称关键词搜索" class="input-with-select" size="small">
                        <el-button slot="append" icon="el-icon-search" @click="searchGoods(false)"/>
                        <el-button slot="append" icon="el-icon-refresh-left" @click="searchGoods(true)"/>
                    </el-input>
                </el-col>
                <el-col :span="10" :offset="2">
                    <el-button type="primary" size="small"@click="relevantGoodsBatch(false, true)">批量关联 <i class="el-icon-check"/></el-button>
                    <el-button type="danger" size="small"@click="relevantGoodsBatch(false, false)">批量取消 <i class="el-icon-close"/></el-button>
                </el-col>
            </el-row>
            <el-table ref="goodsTable" stripe :data="goodsTable" height="400"
                      v-loading="goodsTableLoading"
                      @selection-change="val => this.relevantGoods = val"
                      :row-class-name="rowClassNameMethod"
                      :header-cell-style="{backgroundColor: '#DCDFE6'}"
                      :cell-style="{paddingTop: '7px', paddingBottom: 0}">
                <el-table-column type="selection" fixed width="55"/>
                <el-table-column label="主图" width="65"
                                 prop="listImageUrl">
                    <template slot-scope="scope">
                        <img :src="scope.row.mainImage.url" width="45" height="45"/>
                    </template>
                </el-table-column>
                <el-table-column label="商品名称" width="180"
                                 prop="name"
                                 sortable="custom"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="库存数量" width="100"
                                 prop="stock_volume"
                                 sortable="custom"
                                 :formatter="(row) => row.stockVolume + ' 件'">
                </el-table-column>
                <el-table-column label="原价格" width="90"
                                 prop="original_price"
                                 sortable="custom"
                                 :formatter="(row) => row.originalPrice + ' 元'">
                </el-table-column>
                <el-table-column label="现价格" width="90"
                                 prop="present_price"
                                 sortable="custom"
                                 :formatter="(row) => row.presentPrice + ' 元'">
                </el-table-column>
                <el-table-column label="销售数量" width="100"
                                 prop="sales_volume"
                                 sortable="custom"
                                 :formatter="(row) => row.salesVolume + ' 件'">
                </el-table-column>
                <el-table-column label="选择" min-width="100">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="relevantGoodsBatch(scope.row, true)">关联 <i class="el-icon-check"/></el-button>
                        <el-button type="danger" size="small" @click="relevantGoodsBatch(scope.row, fase)">取消 <i class="el-icon-close"/></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row style="margin-top: 10px">
                <el-col  style="text-align: right;">
                    <MJ_Pagination/>
                </el-col>
            </el-row>
        </el-dialog>
    </el-row>
</template>

<script>
    import {mapActions, mapState} from 'vuex'
    import {findAllGoodsAjax} from '../../api'
    const MJ_Pagination = () => import('../common/MJ_Pagination.vue')

    export default {
        components: {
            MJ_Pagination
        },

        data() {
            return {
                searchGoodsName: null,
                relevantGoods: [],
                goodsTable: null,
                goodsTableLoading: false,
            }
        },

        computed: {
            ...mapState(['metaData']),
            ...mapState('food', ['relevantGoodsTable']),

            relevantGoodsShow: {
                get () {
                    return this.$store.state.food.relevantGoodsShow
                },
                set (value) {
                    this.relevantGoodsShowChange(value)
                    if (! value) this.$refs.goodsTable.clearSelection()
                }
            },
        },

        mounted () {
            this.findAllGoods()
            PubSub.subscribe('updateMetaData', this.findAllGoods)
            this.relevantGoods = []
        },

        methods: {
            ...mapActions(['updateMetaData']),
            ...mapActions('food', ['relevantGoodsShowChange', 'relevantGoodsTableChange']),

            // 关联商品选中状态
            rowClassNameMethod({row}) {
                if (this.relevantGoodsTable.reduce((total, goods) => total + ';' + goods.uuId, '').indexOf(row.uuId) != -1)
                    return 'success-row'
            },

            // 关联商品选择操作
            relevantGoodsBatch(goods, isRelevant) {
                if (goods && isRelevant && ! this.relevantGoodsTable.includes(goods)) this.relevantGoodsTableChange([...this.relevantGoodsTable, goods])
                if (goods && ! isRelevant) this.relevantGoodsTableChange(this.relevantGoodsTable.filter(g => g.uuId != goods.uuId))
                if (! goods && isRelevant) this.relevantGoods.forEach(g => {
                    if (! this.relevantGoodsTable.includes(g)) this.relevantGoodsTableChange([...this.relevantGoodsTable, g])
                })
                if (! goods && ! isRelevant) this.relevantGoodsTableChange(this.relevantGoodsTable.filter(g => ! this.relevantGoods.includes(g)))
                this.$message.success(`${isRelevant? '关联': '取消'}成功！`);
            },

            // 搜索关联商品
            searchGoods(reset) {
                if (reset) this.searchGoodsName = null
                this.updateMetaData({metaData: {page: 1, size: 10}})
                this.findAllGoods()
            },

            // 获取商品表格数据
            async findAllGoods() {
                this.goodsTableLoading = true
                const result = await findAllGoodsAjax({name: this.searchGoodsName}, this.metaData);
                if (result.status == "SUCCESS") {
                    this.goodsTable = result.data
                    this.updateMetaData({metaData: result.resMetaData, init: true})
                    this.goodsTableLoading = false
                }
            },

        },
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