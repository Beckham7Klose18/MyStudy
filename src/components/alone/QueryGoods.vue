<template>
  <div>
    <el-row style="margin: 10px 0;">
      <el-col :span="12">
        <el-input
          v-model="searchGoods.name"
          placeholder="商品名称关键词"
          class="input-with-select"
          size="small"
        >
          <el-button slot="append" icon="el-icon-search" @click="findAllGoods" />
        </el-input>
      </el-col>
    </el-row>
    <el-table stripe max-height="678"
      v-loading="goodsTableLoading"
      @sort-change="goodsSortChange"
      :data="goodsTable"
      :header-cell-style="{backgroundColor: '#DCDFE6'}"
      :cell-style="{paddingTop: '7px', paddingBottom: 0}">
      <el-table-column label="主图" fixed width="65" prop="listImageUrl">
        <template slot-scope="scope">
          <img :src="scope.row.mainImage.url" width="45" height="45" />
        </template>
      </el-table-column>
      <el-table-column
        label="商品名称"
        fixed
        width="100"
        prop="name"
        sortable="custom"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="物流重量"
        width="100"
        prop="weight"
        sortable="custom"
        :formatter="(row) => row.weight + ' 克'"
      ></el-table-column>
      <el-table-column
        label="库存数量"
        width="100"
        prop="stock_volume"
        sortable="custom"
        :formatter="(row) => row.stockVolume + ' 件'"
      ></el-table-column>
      <el-table-column
        label="销售数量"
        width="100"
        prop="sales_volume"
        sortable="custom"
        :formatter="(row) => row.salesVolume + ' 件'"
      ></el-table-column>
      <el-table-column
        label="原价格"
        width="90"
        prop="original_price"
        sortable="custom"
        :formatter="(row) => row.originalPrice + ' 元'"
      ></el-table-column>
      <el-table-column
        label="现价格"
        width="90"
        prop="present_price"
        sortable="custom"
        :formatter="(row) => row.presentPrice + ' 元'"
      ></el-table-column>
      <el-table-column
        label="收藏数"
        width="90"
        prop="collection_volume"
        sortable="custom"
        :formatter="(row) => row.collectionVolume"
      ></el-table-column>
      <el-table-column
        label="评论数"
        width="90"
        prop="comment_volume"
        sortable="custom"
        :formatter="(row) => row.commentVolume"
      ></el-table-column>
      <el-table-column
        label="积分兑换"
        width="100"
        prop="is_exchange"
        sortable="custom"
        :formatter="(row) => {
                          if (row.isExchange == 0) return '不可兑换'
                          else return row.integral + ' 分'
                      }"
      ></el-table-column>
      <el-table-column
        label="上架时间"
        width="100"
        prop="up_date"
        sortable="custom"
        :formatter="(row) => dateFormatter(row.upDate)"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        width="100"
        prop="update_date"
        sortable="custom"
        :formatter="(row) => dateFormatter(row.updateDate)"
      ></el-table-column>
      <el-table-column label="商品地址" min-width="100" fixed="right">
        <template slot-scope="scope">
          <el-button round type="success"
            v-clipboard:copy="scope.row.webUrl"
            v-clipboard:success="() => $message.success(`复制成功`)"
            v-clipboard:error="() => $message.error(`复制失败，请重试`)">复制</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 10px">
      <el-col style="text-align: right;">
        <MJ_Pagination />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Loading } from "element-ui"
import PubSub from "pubsub-js"
import { mapState, mapActions } from "vuex"
import { findAllGoodsAjax } from "../../api"
import { dateFormatter } from "../../util"
const MJ_Pagination = () => import('../common/MJ_Pagination.vue')

export default {
  components: {
    MJ_Pagination
  },

  data() {
    return {
      goodsTable: [],
      goodsTableLoading: false,
      searchGoods: {
        name: null,
        orderBy: "up_date",
        order: "desc",
        weights: [],
        stockVolumes: [],
        originalPrices: [],
        presentPrices: [],
        salesVolumes: [],
        integrals: [],
        collectionVolumes: [],
        commentVolumes: [],
        upDates: null,
        downDates: null,
        updateDates: null,
        labelIds: null
      },
      showSearch: false,
      upDown: "all",
      goodsLabelId: "",
      goodsLabels: []
    };
  },

  computed: {
    ...mapState(["loadingOptions", "pickerOptions", "metaData"])
  },

  watch: {
    upDown: function(value) {
      switch (value) {
        case "up":
          this.searchGoods.upDown = 1;
          this.searchGoods.orderBy = "up_date";
          break;
        case "down":
          this.searchGoods.upDown = 2;
          this.searchGoods.orderBy = "down_date";
          break;
        case "all":
          this.searchGoods.upDown = null;
          this.searchGoods.orderBy = "update_date";
          break;
      }
    }
  },

  mounted() {
    this.loading = Loading.service(this.loadingOptions);
    this.findAllGoods();

    PubSub.subscribe("updateMetaData", this.findAllGoods);
  },

  methods: {
    ...mapActions(["updateMetaData"]),
    dateFormatter, // 日期格式化

    // 商品表格排序
    goodsSortChange({ prop, order }) {
      this.searchGoods.orderBy = prop;
      this.searchGoods.order = order == "ascending" ? "asc" : "desc";
      this.findAllGoods();
    },

    // 获取商品表格数据
    async findAllGoods() {
      this.goodsTableLoading = true;
      if (!this.goodsLabelId) this.searchGoods.labelIds = null;
      else this.searchGoods.labelIds = [this.goodsLabelId];
      const result = await findAllGoodsAjax(this.searchGoods, this.metaData);
      if (result.status == "SUCCESS") {
        this.goodsTable = result.data;
        this.updateMetaData({ metaData: result.resMetaData, init: true });
      }
      this.loading.close();
      this.goodsTableLoading = false;
    },
  }
}
</script>

<style>
.el-table .success-row {
  background-color: #f5faff;
  color: #409eff;
}

.selecte_name {
  width: 7.5%;
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
.showSearch-enter-active,
.showSearch-leave-active {
  transition: all 1s;
}
/*指定隐藏时的样式*/
.showSearch-enter,
.showSearch-leave-to {
  opacity: 0;
  transform: translateX(32px);
}

.showSearch {
  margin-bottom: 10px;
  background-color: #f2f9ff;
}

.el-range-editor--small.el-input__inner {
  width: 250px;
}

.el-tabs__item.is-top {
  font-size: large;
}
</style>
