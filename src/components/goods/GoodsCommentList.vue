<template>
  <div class="GoodsCommentList">
    <el-row style="margin-bottom: 10px; font-size: 13px;">
        <el-col style="width: 10%;">
            <img :src="commentGoods.mainImage && commentGoods.mainImage.url" style="width: 100%;"/>
        </el-col>
        <el-col style="width: 16%; margin: 0 10px;">
            <el-row>
                <el-col style="line-height: 50px;">
                    <span style="color: #909399;">商品评论：</span>
                    <el-badge :value="gcShieldCount">
                        <span style="color: #409EFF; cursor: pointer;"
                              @click="commentGoodsShowChange(true)">选择商品</span>
                    </el-badge>
                </el-col>
            </el-row>
            <el-row>
                <el-col style="line-height: 50px;" class="mjn">
                    <span style="color: #909399;">商品名称：</span>
                    <el-tooltip effect="light" :content="commentGoods.name" placement="bottom-start">
                        <span>{{commentGoods.name}}</span>
                    </el-tooltip>
                </el-col>
            </el-row>
        </el-col>
        <el-col style="width: 14%;">
            <el-row>
                <el-col style="line-height: 50px;"><span style="color: #909399;">库存数量：</span>{{commentGoods.stockVolume}}
                    件
                </el-col>
            </el-row>
            <el-row>
                <el-col style="line-height: 50px;"><span style="color: #909399;">销售数量：</span>{{commentGoods.salesVolume}}
                    件
                </el-col>
            </el-row>
        </el-col>
        <el-col style="width: 12%;">
            <el-row>
                <el-col style="line-height: 50px;"><span style="color: #909399;">原价格：</span>{{commentGoods.originalPrice}}
                    元
                </el-col>
            </el-row>
            <el-row>
                <el-col style="line-height: 50px;"><span style="color: #909399;">现价格：</span>{{commentGoods.presentPrice}}
                    元
                </el-col>
            </el-row>
        </el-col>
        <el-col style="width: 9%;">
            <el-row>
                <el-col style="line-height: 50px;"><span style="color: #909399;">收藏数：</span>{{commentGoods.collectionVolume}}
                </el-col>
            </el-row>
            <el-row>
                <el-col style="line-height: 50px;"><span style="color: #909399;">评论数：</span>{{commentGoods.commentVolume}}
                </el-col>
            </el-row>
        </el-col>
        <el-col style="width: 13%;">
            <el-row>
                <el-col style="line-height: 50px;"><span style="color: #909399;">物流重量：</span>{{commentGoods.weight}}
                    克
                </el-col>
            </el-row>
            <el-row>
                <el-col style="line-height: 50px;"><span style="color: #909399;">积分兑换：</span>{{commentGoods.isExchange==0?
                    '不可兑换': commentGoods.isExchange+' 分'}}
                </el-col>
            </el-row>
        </el-col>
        <el-col style="width: 23%;">
            <el-row>
                <el-col style="line-height: 50px;"><span style="color: #909399;">上架时间：</span>{{dateFormatter(commentGoods.upDate)}}
                </el-col>
            </el-row>
            <el-row>
                <el-col style="line-height: 50px;"><span style="color: #909399;">更新时间：</span>{{dateFormatter(commentGoods.updateDate)}}
                </el-col>
            </el-row>
        </el-col>
    </el-row>
    <el-divider/>
    <el-row style="margin-bottom: 10px;">
      <el-button type="success" size="small" @click="refreshNow">立即刷新&nbsp;<i class="el-icon-refresh"></i></el-button>
      <el-select v-model="searchGoodsComment.shield" size="small" @change="findAllGoodsComment" style="width: 12.8%;">
        <el-option label="评论状态：未审核" :value="0"/>
        <el-option label="评论状态：审核通过" :value="1"/>
        <el-option label="评论状态：审核未通过" :value="2"/>
      </el-select>
      <el-input v-model="searchGoodsComment.orderNo" placeholder="订单编号关键词"  size="small" style="width: 20%;">
        <el-button slot="append" icon="el-icon-search" type="primary" @click="findAllGoodsComment" class="searchButton"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="searchGoodsComment.orderNo = ''; findAllGoodsComment();" class="searchButton"/>
      </el-input>
      <el-input v-model="searchGoodsComment.userName" placeholder="用户名称关键词"  size="small" style="width: 20%;">
        <el-button slot="append" icon="el-icon-search" @click="findAllGoodsComment" class="searchButton"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="searchGoodsComment.userName = ''; findAllGoodsComment();" class="searchButton"/>
      </el-input>
      <el-input v-model="searchGoodsComment.content" placeholder="用评论内容关键词"  size="small" style="width: 20%;">
        <el-button slot="append" icon="el-icon-search" @click="findAllGoodsComment" class="searchButton"/>
        <el-button slot="append" icon="el-icon-refresh-left" @click="searchGoodsComment.content = ''; findAllGoodsComment();" class="searchButton"/>
      </el-input>
    </el-row>
    <el-table stripe v-loading="goodsCommentTableLoading" @sort-change="gcSortChange"
        :default-sort="defaultSort" :data="goodsCommentTable" :row-class-name="rowClassNameMethod"
        :header-cell-style="{backgroundColor: '#DCDFE6'}" :cell-style="{paddingTop: '7px', paddingBottom: 0}">
      <el-table-column label="头像" fixed width="65">
        <template slot-scope="scope">
          <img :src="scope.row.userInfo.headUrl" width="45" height="45"/>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" fixed width="100"
                       show-overflow-tooltip
                       :formatter="(row) => row.userInfo.nickName"/>
      <el-table-column label="订单编号" fixed width="125"
                       prop="orderNo"/>
      <el-table-column label="五星评价" width="110"
                       prop="star"
                       sortable="custom">
        <template slot-scope="scope">
          <i class="el-icon-star-off" v-for="index in scope.row.star" :key="index"/>
        </template>
      </el-table-column>
      <el-table-column label="评论内容" min-width="130"
                       show-overflow-tooltip
                       prop="content"/>
      <el-table-column label="评论时间" width="105"
                       prop="comment_date"
                       sortable="custom"
                       :formatter="(row) => dateFormatter(row.commentDate)"/>
      <el-table-column label="操作" fixed="right" min-width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="goodsComment = scope.row; commentDetailShow = true;">查看 <i
            class="el-icon-search"/></el-button>
          <el-button type="success" size="small" @click="goodsComment = scope.row; shieldGoodsComment(1)"
                     v-show="searchGoodsComment.shield != 1">审核通过 <i class="el-icon-circle-check"/></el-button>
          <el-button type="warning" size="small" @click="goodsComment = scope.row; shieldGoodsComment(2)"
                     v-show="searchGoodsComment.shield != 2">屏蔽 <i class="el-icon-remove-outline"/></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 10px; text-align: right;">
      <MJ_Pagination/>
    </el-row>
    <Goods_Comment_Goods/>
    <el-dialog title="商品评论详情" :visible.sync="commentDetailShow" width="38%">
      <div v-if="! goodsComment" style="text-align: center;">暂无评论</div>
      <div v-if="goodsComment">
          <el-row class="gcDetail">
              <el-col :span="5" style="color: #909399;">评论用户：</el-col>
              <el-col :span="6">
                  <el-image :src="goodsComment.userInfo && goodsComment.userInfo.headUrl"
                            style="width: 45px; height: 45px;"/>
              </el-col>
              <el-col :span="5" style="color: #909399;">用户昵称：</el-col>
              <el-col :span="8" style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  {{goodsComment.userInfo && goodsComment.userInfo.nickName}}
              </el-col>
          </el-row>
          <el-row class="gcDetail">
              <el-col :span="5" style="color: #909399;">星级评价：</el-col>
              <el-col :span="6"><i class="el-icon-star-off" v-for="index in goodsComment.star"/></el-col>
              <el-col :span="5" style="color: #909399;">浏览次数：</el-col>
              <el-col :span="8">{{goodsComment.lookUpNo + ' 次'}}</el-col>
          </el-row>
          <el-row class="gcDetail" v-show="goodsComment.commentImages && goodsComment.commentImages.length">
              <el-col :span="5" style="color: #909399;">评论图片：</el-col>
              <el-col :span="19" style="height: 100px; overflow: auto;">
                  <el-image v-for="img in goodsComment.commentImages" :key="img.uuId" :src="img.url"
                            :preview-src-list="[img.url]" style="width: 100px; height: 100px; cursor: pointer;"
                            @click="commentImgsShow = ! commentImgsShow"/>
              </el-col>
          </el-row>
          <el-dialog title="商品评论图片" :visible.sync="commentImgsShow" :modal="false" width="60%">
              <el-carousel height="425px" type="card">
                  <el-carousel-item v-for="img in goodsComment.commentImages" :key="img.uuId">
                      <el-image :src="img.url"/>
                  </el-carousel-item>
              </el-carousel>
          </el-dialog>
          <el-row class="gcDetail">
              <el-col :span="5" style="color: #909399;">评论内容：</el-col>
              <el-col :span="19" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  <el-tooltip effect="light" :content="goodsComment.content" placement="bottom-start">
                      <span>{{goodsComment.content}}</span>
                  </el-tooltip>
              </el-col>
          </el-row>
          <el-row class="gcDetail">
              <el-col :span="5" style="color: #909399;">订单编号：</el-col>
              <el-col :span="19"><span style="cursor: pointer; color: #409EFF" @click="findOrderById">{{goodsComment.orderNo}}</span>
              </el-col>
          </el-row>
          <el-dialog title="用户订单详情" :visible.sync="orderDetailShow" :modal="false" width="60%">
              <el-row style="line-height: 45px;">
                  <el-col :span="2" :offset="1" class="orderDetail">订单用户：</el-col>
                  <el-col :span="2">
                      <el-image :src="goodsComment.userInfo && goodsComment.userInfo.headUrl"
                                style="width: 45px; height: 45px;"/>
                  </el-col>
                  <el-col :span="5" class="orderDetail">用户昵称：{{goodsComment.userInfo &&
                      goodsComment.userInfo.nickName}}
                  </el-col>
                  <el-col style="width: 10%;" class="orderDetail">收货人：{{shopingOrder &&
                      shopingOrder.shopingAddress.consignee}}
                  </el-col>
                  <el-col :span="5" class="orderDetail">收货电话：{{shopingOrder &&
                      shopingOrder.shopingAddress.tel}}
                  </el-col>
                  <el-col :span="5" class="orderDetail">备注：{{shopingOrder && shopingOrder.remarks}}</el-col>
              </el-row>
              <el-table stripe max-height="425"
                        :data="shopingCarts"
                        :span-method="objectSpanMethod"
                        :header-cell-style="{backgroundColor: '#DCDFE6', fontSize: '12px'}"
                        :cell-style="{paddingTop: '7px', paddingBottom: 0}">
                  <el-table-column label="商品" fixed width="65">
                      <template slot-scope="scope">
                          <img :src="scope.row.goods.mainImage.url" width="45" height="45"/>
                      </template>
                  </el-table-column>
                  <el-table-column label="商品名称" fixed width="90"
                                   show-overflow-tooltip
                                   :formatter="(row) => row.goods.name"/>
                  <el-table-column label="购买数量" width="70"
                                   prop="purchaseQuantity"/>
                  <el-table-column label="商品总价" width="70"
                                   :formatter="(row) => row.presentPayable + ' 元'"/>
                  <el-table-column label="物流总重" width="70"
                                   :formatter="(row) => row.weightTotal + ' 克'"/>
                  <el-table-column label="快递" width="60"
                                   :formatter="() => shopingOrder.delivery"/>
                  <el-table-column label="快递费" width="70"
                                   :formatter="() => shopingOrder.deliveryFee + ' 元'"/>
                  <el-table-column label="减肥基金" width="70"
                                   :formatter="() => '-' + shopingOrder.fund + ' 元'"/>
                  <el-table-column label="优惠券" width="70"
                                   :formatter="() => '-' + shopingOrder.coupon + ' 元'"/>
                  <el-table-column label="积分减免" width="70"
                                   :formatter="() => '-' + shopingOrder.integralMoney + ' 元'"/>
                  <el-table-column label="订单金额" width="70"
                                   :formatter="() => shopingOrder.amount + ' 元'"/>
                  <el-table-column label="支付方式" min-width="80"
                                   :formatter="() => shopingOrder.payType==1? '余额支付': shopingOrder.payType==2? '微信支付':
                                          shopingOrder.payType==3? '支付宝支付': '砍价免费拿'"/>
              </el-table>
              <el-steps align-center style="margin-top: 20px;">
                  <el-step title="创建订单" :description="dateFormatter(shopingOrder && shopingOrder.createDate)"
                           icon="el-icon-date"/>
                  <el-step title="支付时间" :description="dateFormatter(shopingOrder && shopingOrder.payDate)"
                           icon="el-icon-date"/>
                  <el-step title="发货时间" :description="dateFormatter(shopingOrder && shopingOrder.sendDate)"
                           icon="el-icon-date"/>
                  <el-step title="收货时间" :description="dateFormatter(shopingOrder && shopingOrder.receiveDate)"
                           icon="el-icon-date"/>
                  <el-step title="收货地址" :description="shopingOrder && shopingOrder.shopingAddress.areaInfo.province + shopingOrder.shopingAddress.areaInfo.city +
                          shopingOrder.shopingAddress.areaInfo.county + shopingOrder.shopingAddress.areaInfo.address"
                           icon="el-icon-user"/>
              </el-steps>
          </el-dialog>
          <el-row class="gcDetail">
              <el-col :span="5" style="color: #909399;">评论时间：</el-col>
              <el-col :span="19">{{dateFormatter(goodsComment.commentDate)}}</el-col>
          </el-row>
          <div  v-for="gcc in goodsComment.commentComments">
              <el-row class="gcDetail">
                  <el-col :span="5" style="color: #909399;">{{gcc.sellerReply? '卖家': '用户'}}回复：</el-col>
                  <el-col :span="19" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                      <el-tooltip effect="light" :content="gcc.content" placement="bottom-start">
                          <span>{{gcc.content}}</span>
                      </el-tooltip>
                  </el-col>
              </el-row>
              <el-row style="text-align: right; color: #909399;">{{dateFormatter(gcc.commentDate)}}</el-row>
          </div>
          <el-row class="gcDetail">
              <el-col :span="19" :offset="5">
                  <el-button type="primary" size="small" @click="replyGoodsComment">确认回复 <i class="el-icon-s-promotion"/></el-button>
                  <el-button type="success" size="small" @click="shieldGoodsComment(1)"
                             v-show="searchGoodsComment.shield != 1">审核通过 <i class="el-icon-circle-check"/></el-button>
                  <el-button type="warning" size="small" @click="shieldGoodsComment(2)"
                             v-show="searchGoodsComment.shield != 2">屏蔽 <i class="el-icon-remove-outline"/></el-button>
                  <el-button type="danger" size="small" @click="delGoodsComment">删除 <i class="el-icon-delete"/></el-button>
              </el-col>
          </el-row>
          <el-row class="gcDetail">
              <el-col :span="5" style="color: #909399;">卖家回复：</el-col>
              <el-col :span="19">
                  <el-input v-model="content" type="textarea" :rows="10" placeholder="请输入回复内容"/>
              </el-col>
          </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import {Loading} from 'element-ui';
    import {
        findAllGoodsCommentAjax,
        delGoodsCommentAjax,
        shieldGoodsCommentAjax,
        replyGoodsCommentAjax,
        findOrderByIdAjax
    } from '../../api'
    import {mapState, mapActions} from 'vuex'
    import {dateFormatter} from '../../util'
    const Goods_Comment_Goods = () => import('./Goods_Comment_Goods.vue')
    const MJ_Pagination = () => import('../common/MJ_Pagination.vue')

    export default {
        components: {
            Goods_Comment_Goods,
            MJ_Pagination,
        },

        data() {
            return {
              defaultSort: {
                  prop: "comment_date",
                  order: "descending"
              },
              commentImgsShow: false,
              goodsComment: {},
              goodsCommentTable: [],
              goodsCommentTableLoading: false,
              searchGoodsComment: {
                  goodsId: null,
                  orderNo: null,
                  userName: '',
                  content: '',
                  shield: 0,
                  orderBy: "comment_date",
                  orderType: "desc",
              },
              content: '',
              orderDetailShow: false,
              shopingOrder: null,
              shopingCarts: null,
              commentDetailShow: false,
            }
        },

        computed: {
            ...mapState(['loadingOptions', 'pickerOptions', 'metaData']),
            ...mapState('goods', ['commentGoods', 'gcShieldCount']),
        },

        watch: {
            commentGoods: function (value) {
                if (value.uuId) this.findAllGoodsComment()
            }
        },

        mounted() {
            this.loading = Loading.service(this.loadingOptions)
            PubSub.subscribe('updateMetaData', this.findAllGoodsComment)
        },

        methods: {
            ...mapActions(['updateMetaData']),
            ...mapActions('goods', ['commentGoodsShowChange', 'gcShieldCountChange']),
            dateFormatter,  // 日期格式化

            // 合并行
            objectSpanMethod({rowIndex, columnIndex}) {
                if ([5, 6, 7, 8, 9, 10, 11].includes(columnIndex)) {
                    if (rowIndex == 0) return [this.shopingCarts.length, 1]
                    else return [0, 0]
                }
            },

            // 商品评论选中状态
            rowClassNameMethod({row}) {
                if (Object.is(row, this.goodsComment))
                    return 'success-row'
            },

            // 商品评论表格排序
            gcSortChange({prop, order}) {
                this.searchGoodsComment.orderBy = prop
                this.searchGoodsComment.orderType = order == 'ascending' ? 'asc' : 'desc'
                this.updateMetaData({metaData: {page: 1, size: this.metaData.size}, init: true})
                if (this.commentGoods.uuId) this.findAllGoodsComment()
            },

            // 获取商品表格数据
            async findAllGoodsComment() {
                this.goodsCommentTableLoading = true
                this.searchGoodsComment.goodsId = this.commentGoods.uuId
                const result = await findAllGoodsCommentAjax(this.searchGoodsComment, this.metaData)
                if (result.status == "SUCCESS") {
                    this.goodsCommentTable = result.data
                    this.goodsComment = result.data[0]
                }
                this.goodsCommentTableLoading = false
                this.updateMetaData({metaData: result.resMetaData, init: true})
                this.loading.close()
            },

            async delGoodsComment() {
                const result = await delGoodsCommentAjax(this.goodsComment.uuId);
                if (result.status != "SUCCESS") return this.$message.error(`商品评论删除失败！`)
                this.findAllGoodsComment()
                return this.$message.success(`商品评论删除成功！`)
            },

            // 审核商品评论
            async shieldGoodsComment(shield) {
                const result = await shieldGoodsCommentAjax(this.commentGoods.uuId, this.goodsComment.uuId, shield);
                if (result.status != "SUCCESS") return this.$message.error(`商品评论审核失败！`)
                this.gcShieldCountChange()
                this.findAllGoodsComment()
                return this.$message.success(`商品评论审核成功！`)
            },

            async replyGoodsComment() {
                const result = await replyGoodsCommentAjax({gcId: this.goodsComment.uuId, content: this.content});
                if (result.status != "SUCCESS") return this.$message.error(`回复评论失败！`)
                const gcc = {sellerReply: true, content: this.content, commentDate: new Date().getMinutes()}
                if (this.goodsComment.commentComments) this.goodsComment.commentComments.push(gcc)
                else this.goodsComment.commentComments = [gcc]
                this.content = ''
                return this.$message.success(`回复评论成功！`)
            },

            async findOrderById() {
                const result = await findOrderByIdAjax(this.goodsComment.orderId);
                if (result.status == "SUCCESS") {
                    this.shopingOrder = result.data
                    this.shopingCarts = result.data.shopingCarts
                    this.orderDetailShow = true
                }
            },

            refreshNow() {
                this.searchGoodsComment.orderNo = ''
                this.searchGoodsComment.userName = ''
                this.searchGoodsComment.content = ''
                this.updateMetaData({metaData: {page: 1, size: this.metaData.size}, init: true})
                this.gcShieldCountChange()
                this.findAllGoodsComment()
            }
        },

        beforeDestroy() {
            PubSub.unsubscribe("updateMetaData")
        }
    }
</script>

<style>
  .GoodsCommentList .el-input-group__append {
    padding: 0 15px !important;
  }
  .GoodsCommentList .el-input-group__append .el-button {
    padding: 0 15px !important;
  }

  .el-table .success-row {
      background-color: #f5faff;
      color: #409EFF;
  }

  .el-divider {
      margin-top: 0;
  }

  .gcDetail {
      margin-bottom: 10px;
  }

  .el-step.is-center .el-step__description {
      padding: 0;
  }

  .orderDetail {
      color: #909399;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
  }

  .el-switch__label {
      color: #909399;
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
</style>
