<template>
  <el-dialog :visible.sync="commentGoodsShow" width="60%">
    <span slot="title">选择商品：<span style="color: gray;">回复 / 审核 / 屏蔽 商品评论</span></span>
    <el-row style="margin-bottom: 10px;">
        <el-col :span="10">
            <el-input v-model="searchGoodsName" placeholder="商品名称关键词搜索" class="input-with-select" size="small">
                <el-button slot="append" icon="el-icon-search" @click="searchGoods(false)" style="padding: 19px 20px;"/>
                <el-button slot="append" icon="el-icon-refresh-left" @click="searchGoods(true)" style="padding: 19px 20px;"/>
            </el-input>
        </el-col>
    </el-row>
    <el-table stripe :data="goodsTable" max-height="400" v-loading="goodsTableLoading"
        :header-cell-style="{backgroundColor: '#DCDFE6'}" :cell-style="{paddingTop: '7px', paddingBottom: 0}">
      <el-table-column label="主图" width="65"
                       prop="listImageUrl">
          <template slot-scope="scope">
              <img :src="scope.row.mainImage && scope.row.mainImage.url" width="45" height="45"/>
          </template>
      </el-table-column>
      <el-table-column label="商品名称" min-width="150"
                       prop="name"
                       show-overflow-tooltip/>
      <el-table-column label="库存数量" width="90"
                       :formatter="(row) => row.stockVolume + ' 件'"/>
      <el-table-column label="销售数量" width="90"
                       :formatter="(row) => row.salesVolume + ' 件'"/>
      <el-table-column label="现价格" width="85"
                       :formatter="(row) => row.presentPrice + ' 元'"/>
      <el-table-column label="未审核" width="85">
          <template slot-scope="scope">
              <el-tag :type="scope.row.commentCount && 'danger'">{{scope.row.commentCount}}</el-tag>
          </template>
      </el-table-column>
      <el-table-column label="选择"width="120">
          <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="checkComment(scope.row)">查看评论 <i class="el-icon-search"/></el-button>
          </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 10px">
      <el-col :span="12" :offset="4" style="text-align: right;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page.sync="metaData.page"  :page-sizes="[10, 25, 50, 100]" :page-size="metaData.size"
          :total="metaData.total" layout="total, sizes, prev, pager, next, jumper"/>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {findAllGoodsAjax} from '../../api'

    export default {
        data() {
            return {
                searchGoodsName: null,
                goodsTable: null,
                goodsTableLoading: false,
                metaData: {}
            }
        },

        computed: {
            ...mapState('goods', ['commentGoods']),

            commentGoodsShow: {
                get () {
                    return this.$store.state.goods.commentGoodsShow
                },
                set (value) {
                    this.commentGoodsShowChange(value)
                }
            },
        },

        watch: {
            commentGoodsShow: function (value) {
                if (value) this.findAllGoods()
            }
        },

        mounted () {
            this.findAllGoods()
        },

        methods: {
            ...mapActions('goods', ['commentGoodsShowChange', 'commentGoodsChange']),

            //查看评论
            checkComment(goods) {
                this.commentGoodsChange(goods)
                this.commentGoodsShowChange(false)
            },

            // 搜索商品
            searchGoods(reset) {
                if (reset) this.searchGoodsName = null
                this.metaData = {page: 1, size: 10}
                this.findAllGoods()
            },

            // 获取商品表格数据
            async findAllGoods() {
              this.goodsTableLoading = true
              const data = {
                name: this.searchGoodsName,
                upDown: 0,
                shield: true
              }
              const result = await findAllGoodsAjax(data, this.metaData);
              if (result.status == "SUCCESS") {
                  this.goodsTable = result.data
                  this.metaData = result.resMetaData
                  if (! this.commentGoods.uuId) this.commentGoodsChange(this.goodsTable[0])
                  this.goodsTableLoading = false
              }
            },

            // 监听分页数量改变
            handleSizeChange(val) {
                this.metaData.page = 1
                this.metaData.size = val
                this.findAllGoods()
            },

            // 监听分页页码改变
            handleCurrentChange(val) {
                this.metaData.page = val
                this.findAllGoods()
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
