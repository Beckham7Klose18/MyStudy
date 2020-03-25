<template>
  <div class="GoodsList">
    <el-tabs v-model="upDown" type="card">
        <el-tab-pane label="全部商品" name="all"/>
        <el-tab-pane label="上架商品" name="up"/>
        <el-tab-pane label="精选热卖" name="recommend"/>
        <el-tab-pane label="积分兑换" name="integral"/>
        <el-tab-pane label="新品推荐" name="new"/>
        <el-tab-pane label="特惠专区" name="preferential"/>
        <el-tab-pane label="售罄商品" name="sellOut"/>
        <el-tab-pane label="下架商品" name="down"/>
    </el-tabs>
    <el-row style="margin-bottom: 10px;">
      <router-link to="/goods/add"><el-button type="primary" size="mini">添加商品&nbsp;<i class="el-icon-plus"/></el-button></router-link>
      <el-button type="success" size="small"@click="resetSelect('all')">立即刷新&nbsp;<i class="el-icon-refresh"/></el-button>
      <el-input v-model="searchGoods.name" placeholder="商品名称关键词" size="small"style="width: 25%;">
        <el-button slot="append" icon="el-icon-search" @click="findAllGoods"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="resetSelect('rsName')"/>
      </el-input>
      <el-select v-model="goodsLabelId" placeholder="商品标签筛选：请选择" clearable
                 v-show="! ['recommend', 'integral', 'new', 'preferential'].includes(upDown)"
                 size="small"@change="findAllGoods" @clear="findAllGoods" style="width: 18%;">
        <el-option v-for="label in goodsLabels" :key="label.uuId" :label="label.name" :value="label.uuId"/>
      </el-select>
      <el-button type="success" size="small"@click="resetSelect(! showSearch)" style="margin: 0 10px;"
                 v-show="! ['recommend', 'new', 'preferential'].includes(upDown)">筛选&nbsp;
        <i class="el-icon-arrow-down" v-show="! showSearch"/>
        <i class="el-icon-arrow-up" v-show="showSearch"/>
      </el-button>
      <transition name="showSearch">
        <transition-group v-show="showSearch">
          <el-button type="primary" size="small"@click="findAllGoods" key="0">确认</el-button>
          <el-button type="info" size="small"@click="resetSelect" key="1">重置</el-button>
        </transition-group>
      </transition>
    </el-row>
    <transition name="showSearch">
        <div v-show="showSearch" style="background-color: #f2f9ff; padding: 10px 5%; margin: 10px 0; font-size: small;">
            <el-row>
                <el-col :span="8">
                    库存数量：
                    <el-input-number v-model="searchGoods.stockVolumes[0]" controls-position="right" size="mini"/>
                    至
                    <el-input-number v-model="searchGoods.stockVolumes[1]" controls-position="right" size="mini"/>
                </el-col>
                <el-col :span="8">
                    原售价格：
                    <el-input-number v-model="searchGoods.originalPrices[0]" controls-position="right" size="mini"/>
                    至
                    <el-input-number v-model="searchGoods.originalPrices[1]" controls-position="right" size="mini"/>
                </el-col>
                <el-col :span="8">
                    收藏数量：
                    <el-input-number v-model="searchGoods.collectionVolumes[0]" controls-position="right"
                                     size="mini"/>
                    至
                    <el-input-number v-model="searchGoods.collectionVolumes[1]" controls-position="right"
                                     size="mini"/>
                </el-col>
            </el-row>
            <el-row style="margin: 10px 0;">
                <el-col :span="8">
                    销售数量：
                    <el-input-number v-model="searchGoods.salesVolumes[0]" controls-position="right" size="mini"/>
                    至
                    <el-input-number v-model="searchGoods.salesVolumes[1]" controls-position="right" size="mini"/>
                </el-col>
                <el-col :span="8">
                    现售价格：
                    <el-input-number v-model="searchGoods.presentPrices[0]" controls-position="right" size="mini"/>
                    至
                    <el-input-number v-model="searchGoods.presentPrices[1]" controls-position="right" size="mini"/>
                </el-col>
                <el-col :span="8">
                    积分兑换：
                    <el-input-number v-model="searchGoods.integrals[0]" controls-position="right" size="mini"/>
                    至
                    <el-input-number v-model="searchGoods.integrals[1]" controls-position="right" size="mini"/>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">上架时间：
                    <el-date-picker  size="mini" style="width: 60%;"
                            type="daterange"
                            align="right"
                            v-model="searchGoods.upDates"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
                    />
                </el-col>
                <el-col :span="8">下架时间：
                    <el-date-picker size="mini" style="width: 60%;"
                            type="daterange"
                            align="right"
                            v-model="searchGoods.downDates"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"/>
                </el-col>
                <el-col :span="8">变更时间：
                    <el-date-picker size="mini" style="width: 60%;"
                            type="daterange"
                            align="right"
                            v-model="searchGoods.updateDates"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"/>
                </el-col>
            </el-row>
        </div>
    </transition>
    <el-table stripe v-if="defaultSort" v-loading="goodsTableLoading"
          :default-sort="defaultSort" :data="goodsTable" @sort-change="goodsSortChange"
          :header-cell-style="{backgroundColor: '#DCDFE6'}" :cell-style="{paddingTop: '7px', paddingBottom: '3px'}">
      <el-table-column type="index" fixed width="40" align="center"/>
      <el-table-column label="主图" fixed width="65">
          <template slot-scope="scope">
              <img :src="scope.row.mainImage && scope.row.mainImage.smallUrl" width="45" height="45"/>
          </template>
      </el-table-column>
      <el-table-column label="商品名称" fixed min-width="230"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <span style="font-weight: bold;">{{scope.row.name}}</span><br/>
          <span style="color: gray;">商品简称：{{scope.row.shortName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序权重" fixed width="150"
                       prop="sort_weight"
                       :sortable="sortable">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.sortWeight" style="width:60px"/>
          <el-button type="primary" size="mini" @click="updateGoods(scope.row, 1)" plain>修改</el-button>
        </template>
      </el-table-column>
      <el-table-column label="库存数量" fixed width="105"
                       prop="stock_volume"
                       :sortable="sortable">
          <template slot-scope="scope">
              <el-tag :type="scope.row.stockVolume > 100 && 'success' || (scope.row.stockVolume > 10 && 'warning' || 'danger')">
                  {{scope.row.stockVolume}} 件
              </el-tag>
              <el-badge :is-dot="scope.row.stockVolume < 10" style="margin-top: -13px; margin-left: -10px;"/>
          </template>
      </el-table-column>
      <el-table-column label="库存管理" fixed width="170" v-if="['up', 'down', 'sellOut'].includes(upDown)">
          <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.newStockVolume" placeholder="库存数量" style="width:80px"/>
              <el-button type="success" size="mini" @click="updateGoods(scope.row, 2)" plain>修改</el-button>
          </template>
      </el-table-column>
      <el-table-column label="销售数量" width="105"
                       prop="sales_volume"
                       :sortable="sortable">
          <template slot-scope="scope">
              <el-tag :type="scope.row.salesVolume>1000? 'danger': scope.row.salesVolume>500? 'success': 'warning'">
                  {{scope.row.salesVolume}} 件
              </el-tag>
          </template>
      </el-table-column>
      <el-table-column label="价格" width="90"
                       prop="present_price"
                       :sortable="sortable">
        <template slot-scope="scope">
          <span style="color: gray; text-decoration-line: line-through;">{{scope.row.originalPrice}} 元</span><br/>
          <span style="color: green; font-weight: bold">{{scope.row.presentPrice}} 元</span>
        </template>
      </el-table-column>
      <el-table-column label="商品信息" width="200" align="center">
        <template slot-scope="scope">
          <span style="color: gray;">收藏数：</span>{{scope.row.collectionVolume}}
          <span style="color: gray; margin-left: 20px;">评论数：</span>{{scope.row.commentVolume}}<br/>
          <el-tag type="success" size="mini" v-if="scope.row.upDate">{{'上架时间：' + dateFormatter(scope.row.upDate)}}</el-tag>
          <el-tag type="danger" size="mini" v-if="scope.row.downDate">{{'下架时间：' + dateFormatter(scope.row.downDate)}}</el-tag>
          <el-tag size="mini" v-if="scope.row.updateDate">{{'更新时间：' + dateFormatter(scope.row.updateDate)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="新品推荐" fixed="right" min-width="90" v-if="upDown == 'new'">
          <template slot-scope="scope">
              <el-tag v-show="scope.row.isNew">新品推荐 <i class="el-icon-star-on"/></el-tag>
              <el-tag type="info" v-show="! scope.row.isNew">未推荐</el-tag>
          </template>
      </el-table-column>
      <el-table-column label="特惠专区" fixed="right" min-width="90" v-if="upDown == 'preferential'">
          <template slot-scope="scope">
              <el-tag v-show="scope.row.isPreferential">特惠专区 <i class="el-icon-star-on"/></el-tag>
              <el-tag type="info" v-show="! scope.row.isPreferential">非专区</el-tag>
          </template>
      </el-table-column>
      <el-table-column label="是否精选" fixed="right" min-width="90" v-if="upDown == 'recommend'">
          <template slot-scope="scope">
              <el-tag v-show="scope.row.isRecommend">精选 <i class="el-icon-star-on"/></el-tag>
              <el-tag type="info" v-show="! scope.row.isRecommend">未精选</el-tag>
          </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="120" v-if="upDown != 'integral'">
          <template slot-scope="scope">
            <router-link :to="`/goods/edit/${scope.row.uuId}`">
                <el-button v-if="upDown == 'all'" type="primary" size="mini">编辑<i class="el-icon-edit"/>
                </el-button>
            </router-link>
            <el-button v-if="upDown == 'down'" type="success" size="mini" @click="upDownGoods(scope.row, 1)">
                上架 <i class="el-icon-top"/>
            </el-button>
            <el-button v-if="upDown == 'up' || upDown == 'sellOut'" type="danger" size="mini"
                       @click="upDownGoods(scope.row, 2)">下架 <i class="el-icon-bottom"/></el-button>
            <el-button v-if="upDown == 'recommend' && scope.row.isRecommend==false" type="success" size="mini"
                       @click="editLabelMidGoods(scope.row.uuId, '精选热卖', true)">添加精选 <i class="el-icon-plus"/></el-button>
            <el-button v-if="upDown == 'recommend' && scope.row.isRecommend==true" type="danger" size="mini"
                       @click="editLabelMidGoods(scope.row.uuId, '精选热卖', false)" style="margin:0">取消精选 <i class="el-icon-minus"/></el-button>
            <el-button v-if="upDown == 'new' && scope.row.isNew==false" type="success" size="mini"
                       @click="editLabelMidGoods(scope.row.uuId, '新品推荐', true)">添加推荐 <i class="el-icon-plus"/></el-button>
            <el-button v-if="upDown == 'new' && scope.row.isNew==true" type="danger" size="mini"
                       @click="editLabelMidGoods(scope.row.uuId, '新品推荐', false)" style="margin:0">取消推荐 <i class="el-icon-minus"/></el-button>
            <el-button v-if="upDown == 'preferential' && scope.row.isPreferential==false" type="success" size="mini"
                       @click="editLabelMidGoods(scope.row.uuId, '特惠专区', true)">加入专区 <i class="el-icon-plus"/></el-button>
            <el-button v-if="upDown == 'preferential' && scope.row.isPreferential==true" type="danger" size="mini"
                       @click="editLabelMidGoods(scope.row.uuId, '特惠专区', false)" style="margin:0">移出专区 <i class="el-icon-minus"/></el-button>
          </template>
      </el-table-column>
      <el-table-column label="积分兑换" fixed="right" min-width="80" v-if="upDown == 'integral'">
        <template slot-scope="scope">
          <el-tag size="small" v-show="scope.row.isExchange">{{scope.row.integral}} 分</el-tag>
          <el-tag size="small" type="info" v-show="!scope.row.isExchange">不可兑换</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="160" align="center" v-if="upDown == 'integral'">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.newIntegral" placeholder="请输入添加兑换积分"v-if="!scope.row.isExchange"/><br/>
          <el-button v-if="! scope.row.isExchange" type="success" size="mini" style="margin-top: 5px;"
                     @click="updateIntegralGoods(scope.row, true)">添加兑换 <i class="el-icon-plus"/></el-button>
          <el-input size="mini" v-model="scope.row.newIntegral" placeholder="请输入积分" v-if="scope.row.isExchange">
            <template slot="append"><el-button @click="updateIntegralGoods(scope.row)">修改</el-button></template>
          </el-input><br/>
          <el-button v-if="scope.row.isExchange" type="danger" size="mini" style="margin-top: 5px;"
                     @click="updateIntegralGoods(scope.row, false)">取消兑换 <i
                    class="el-icon-minus"/></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row v-show="goodsTable && goodsTable.length > 0" style="margin-top: 10px">
          <el-col style="text-align: right;">
              <MJ_Pagination/>
          </el-col>
      </el-row>
  </div>
</template>

<script>
    import {
        findAllGoodsAjax,
        findAllLabelBySourceAjax,
        updateGoodsAjax,
        getSelectGoodsAjax,
        editLabelMidGoodsAjax,
        getIntegralGoodsAjax,
        getNewGoodsAjax,
        getPreferentialGoodsAjax
    } from "../../api";
    import {mapState, mapActions} from "vuex";
    import {dateFormatter} from "../../util";
    const MJ_Pagination = () => import('../common/MJ_Pagination.vue')

    export default {
        components: {
            MJ_Pagination,
        },

        data() {
            return {
                userId: JSON.parse(localStorage.getItem("maijiUser")).uuId,
                defaultSort: false,
                goodsTable: [],
                goodsTableLoading: false,
                upDown: null,
                searchGoods: {
                    name: null,
                    stockVolumes: [1],
                    originalPrices: [],
                    presentPrices: [],
                    salesVolumes: [],
                    integrals: [],
                    collectionVolumes: [],
                    upDates: null,
                    downDates: null,
                    updateDates: null,
                    labelIds: null
                },
                showSearch: false,
                goodsLabelId: "",
                goodsLabels: []
            };
        },

        computed: {
            ...mapState(["loading", "loadingOptions", "pickerOptions", "metaData"]),

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
            $route: function () {
                this.watchRouter()
            },

            upDown: function (value) {
                this.defaultSort = false
                this.sortable = true
                switch (value) {
                    case "all":
                        this.$route.path != "/goods/list" && this.$router.push("/goods/list")
                        break;
                    case "up":
                        this.$route.path != "/goods/up" && this.$router.push("/goods/up")
                        break;
                    case "down":
                        this.$route.path != "/goods/down" && this.$router.push("/goods/down")
                        break;
                    case "recommend":
                        this.$route.path != "/goods/recommend" && this.$router.push("/goods/recommend")
                        break;
                    case "integral":
                        this.$route.path != "/goods/integral" && this.$router.push("/goods/integral")
                        break;
                    case "sellOut":
                        this.$route.path != "/goods/sellOut" && this.$router.push("/goods/sellOut")
                        break;
                    case "new":
                        this.$route.path != "/goods/new" && this.$router.push("/goods/new")
                        break;
                    case "preferential":
                        this.$route.path != "/goods/preferential" && this.$router.push("/goods/preferential")
                        break;
                }
                this.$nextTick(() => {
                    this.searchGoods.upDown = value == 'down' ? 2 : this.upDown == 'all' ? 0 : 1
                    this.searchGoods.stockVolumes = value == 'sellOut' ? [0, 0] : ['all', 'down'].includes(value) ? [] : [1]
                    this.sortable = ["integral", "recommend", "new", "preferential"].includes(value) ? false : 'custom'
                    switch (value) {
                        case "up":
                            this.defaultSort = {
                                prop: "sales_volume",
                                order: "ascending"
                            }
                            break;
                        case "down":
                            this.defaultSort = {
                                prop: "down_date",
                                order: "descending"
                            }
                            break;
                        case "sellOut":
                            this.defaultSort = {
                                prop: "sales_volume",
                                order: "descending"
                            }
                            break;
                        default :
                            this.defaultSort = {
                                prop: "sort_weight",
                                order: "descending"
                            }
                    }
                    this.searchGoods.orderBy = this.defaultSort.prop
                    this.searchGoods.order = this.defaultSort.order == "ascending" && "asc" || "desc"
                    this.findAllGoods(this.pageOne)
                })
            }
        },

        mounted() {
          this.watchRouter()
          this.findAllGoodsLabels("商品")
          PubSub.subscribe("updateMetaData", () => this.findAllGoods())
        },

        methods: {
            ...mapActions(["loadingOpen", "updateMetaData"]),
            ...mapActions("goods", ["IncreasestockVolumeCountChange"]),
            dateFormatter, // 日期格式化

            watchRouter() {
                if (this.$route.path == "/goods/list") this.upDown = "all"
                if (this.$route.path == "/goods/up") this.upDown = "up"
                if (this.$route.path == "/goods/down") this.upDown = "down"
                if (this.$route.path == "/goods/sellOut") this.upDown = "sellOut"
                if (this.$route.path == "/goods/integral") this.upDown = "integral"
                if (this.$route.path == "/goods/recommend") this.upDown = "recommend"
                if (this.$route.path == "/goods/new") this.upDown = "new"
                if (this.$route.path == "/goods/preferential") this.upDown = "preferential"
            },

            // 商品表格排序
            goodsSortChange({prop, order}) {
                this.searchGoods.orderBy = prop
                this.searchGoods.order = order == "ascending" ? "asc" : "desc"
                this.findAllGoods(this.pageOne)
            },

            // 获取所有商品相关标签
            async findAllGoodsLabels(source) {
                const result = await findAllLabelBySourceAjax(source);
                if (result.status == "SUCCESS") this.goodsLabels = result.data;
            },

            // 获取商品表格数据
            async findAllGoods(metaData) {
                this.goodsTableLoading = true
                let result = {}
                //获取精选商品
                if (this.upDown == "recommend") {
                    result = await getSelectGoodsAjax(this.searchGoods.name, metaData || this.metaData)
                    result.data.reverse()
                }
                //获取积分商品
                else if (this.upDown == "integral") {
                    result = await getIntegralGoodsAjax(this.searchGoods.name, metaData || this.metaData)
                    result.data.reverse()
                }
                //获取新品推荐商品列表
                else if (this.upDown == "new") {
                    result = await getNewGoodsAjax(this.searchGoods.name, metaData || this.metaData)
                    result.data.reverse()
                }
                //获取特惠专区商品列表
                else if (this.upDown == "preferential") {
                    result = await getPreferentialGoodsAjax(this.searchGoods.name, metaData || this.metaData)
                    result.data.reverse()
                }
                // 获取商品列表
                else result = await findAllGoodsAjax(Object.assign(this.searchGoods, {labelIds: [this.goodsLabelId]}), metaData || this.metaData)
                if (result.status == "SUCCESS") this.goodsTable = result.data
                this.updateMetaData({metaData: result.resMetaData, init: true})
                this.goodsTableLoading = false
                this.loading.close()
            },

            // 重置筛选条件
            resetSelect(showSearch) {
                if (showSearch == "rsName" || showSearch == "all") this.searchGoods.name = null
                if ((typeof showSearch) == 'boolean' || showSearch == "all") {
                    if (showSearch == "all") this.showSearch = false
                    else this.showSearch = showSearch
                    this.searchGoods = {
                        order: "desc",
                        stockVolumes: this.upDown == 'sellOut' ? [0, 0] : [1],
                        originalPrices: [],
                        presentPrices: [],
                        salesVolumes: [],
                        integrals: [],
                        collectionVolumes: [],
                        upDates: null,
                        downDates: null,
                        updateDates: null
                    }
                }
                this.IncreasestockVolumeCountChange()
                this.findAllGoods(this.pageOne)
            },

            // 上架或下架商品操作
            async upDownGoods(goods, upDown) {
                if (upDown == 1 && goods.stockVolume == 0) return this.$message.warning(`上架商品库存数量必须大于0`)
                const result = await updateGoodsAjax({uuId: goods.uuId, upDown}, this.userId)
                if (result.status == "SUCCESS") {
                    this.$message.success(`商品${upDown == 1 ? '上架' : '下架'}成功`)
                    this.findAllGoods()
                }
            },

            // 修改商品库存数量
            async updateGoods(goods, type) {
              const msg = type ==1 && '排序权重' || '库存数量'
              if ((type == 1 && goods.sortWeight <= 0) || (type == 2 && goods.newStockVolume <= 0))
                return this.$message.warning(`请先输入有效的商品${msg}`)
              const data = {uuId: goods.uuId}
              if (type == 1) data.sortWeight = goods.sortWeight
              if (type == 2) data.stockVolume = goods.newStockVolume
              const result = await updateGoodsAjax(data, this.userId)
              if (result.status != "SUCCESS") return this.$message.success(`修改商品${msg}失败，请稍后重试`)
              this.$message.success(`修改商品${msg}成功`)
              this.IncreasestockVolumeCountChange()
              this.findAllGoods()
            },

            //快捷添加/取消商品标签
            async editLabelMidGoods(uuId, labelName, labelAdd) {
                const result = await editLabelMidGoodsAjax({uuId, labelName, labelAdd});
                if (result.status != "SUCCESS") return this.$message.error(`操作失败，请稍后重试`)
                this.$message.success(`操作成功`)
                this.findAllGoods(this.pageOne)
            },

            //编辑积分商品
            async updateIntegralGoods(goods, add) {
                if ((typeof add) == 'boolean') { // 添加或取消积分兑换
                    let result = {}
                    if (add) if (goods.newIntegral > 0) // 添加积分兑换
                        result = await updateGoodsAjax({
                            isExchange: 1,
                            uuId: goods.uuId,
                            integral: goods.newIntegral
                        }, this.userId)
                    else return this.$message.warning(`请输入添加兑换积分`)
                    else result = await updateGoodsAjax({isExchange: 0, uuId: goods.uuId}, this.userId) // 取消积分兑换
                    if (result.status != "SUCCESS") return this.$message.error(`${add && '添加' || '取消'}积分商品失败，请稍等重试`)
                    this.$message.success(`${add && '添加' || '取消'}积分商品成功`)
                    this.findAllGoods()
                } else { // 修改兑换积分
                    const result = await updateGoodsAjax({uuId: goods.uuId, integral: goods.newIntegral}, this.userId);
                    if (result.status == "SUCCESS") {
                        this.findAllGoods()
                        this.$message.success(`修改兑换积分成功`)
                    }
                }
            },
        },

        beforeDestroy() {
            PubSub.unsubscribe("updateMetaData")
        }
    };
</script>

<style>
    .el-table .success-row {
        background-color: #f5faff;
        color: #409eff;
    }

    .GoodsList .el-input-number--mini {
        width: 100px !important;
        line-height: 26px !important;
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
