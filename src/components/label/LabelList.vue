<template>
  <div class="Label">
    <el-row style="margin-bottom: 10px;">
      <el-col :span="3">
        <router-link to="/label/add">
            <el-button type="primary" size="small" style="width: 100%;">添加标签<i class="el-icon-plus"/></el-button>
        </router-link>
      </el-col>
      <el-col :span="5" :offset="1">
      <el-select size="small" v-model="searchLabel.source" placeholder="请选择标签来源" allow-create filterable @change="findAllLabels(pageOne)">
        <el-option label="食谱" value="食谱"/>
        <el-option label="食材" value="食材"/>
        <el-option label="商品" value="商品"/>
        <el-option label="商品评论" value="商品评论"/>
        <el-option label="麦吉简介" value="麦吉简介"/>
        <el-option label="取消订单" value="取消订单"/>
      </el-select>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-input v-model="searchLabel.name" placeholder="标签名称关键词搜索" size="small">
          <el-button slot="append" icon="el-icon-search" @click="findAllLabels(pageOne)"/>
          <el-button slot="append" icon="el-icon-refresh-left" @click="searchLabel.name = ''; findAllLabels(pageOne)"/>
        </el-input>
      </el-col>
    </el-row>
    <el-table stripe
        v-loading="labelTableLoading"
        :data="labelTable"
        :header-cell-style="{backgroundColor: '#DCDFE6'}">
      <el-table-column type="index" width="60" align="center"/>
      <el-table-column label="标签图片" width="80">
        <template slot-scope="scope">
          <img :src="scope.row.labelImage.url" width="45" height="45" v-if="scope.row.labelImage"/>
          <span v-if="! scope.row.labelImage">--</span>
        </template>
      </el-table-column>
      <el-table-column label="标签名称" prop="name" width="135"/>
      <el-table-column label="标签来源" prop="source" width="135"/>
      <el-table-column label="标签描述" width="135"
                       show-overflow-tooltip
                       :formatter="(row) => row.desc || '---'"/>
      <el-table-column label="跳转地址" width="200"
                       show-overflow-tooltip
                       :formatter="(row) => row.url || '---'"/>
      <el-table-column label="标签类型" width="135"
                       :formatter="(row) => showLabelType(row.listShow)"/>
      <el-table-column label="标签排序" prop="orderNo" width="120"/>
      <el-table-column label="操作" fixed="right" min-width="100">
        <template slot-scope="scope">
          <router-link :to="{path: '/label/add', query:{editLabel: scope.row}}">
            <el-button size="mini" type="primary" icon="el-icon-check">编辑</el-button>
          </router-link>
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
    findAllLabelsAjax
  } from '../../api'
  import {mapState, mapActions} from 'vuex'
  const MJ_Pagination = () => import('../common/MJ_Pagination.vue')

  export default {
    components: {
      MJ_Pagination,
    },

    data() {
      return {
        labelTable: [],
        labelTableLoading: false,
        searchLabel: {
          name: '',
          source: '商品'
        },
      }
    },

    computed: {
      ...mapState(['loading', 'metaData']),

      pageOne () {
        return {
          page: 1,
          size: this.metaData.size
        }
      },
    },

    mounted() {
      this.findAllLabels(this.pageOne)
      PubSub.subscribe('updateMetaData', () => this.findAllLabels())
      this.loading.close()
    },

    methods: {
      ...mapActions(['updateMetaData']),

      showLabelType (listShow) {
        switch (listShow) {
          case 0:
            return '0 - 普通标签'
            break
          case 1:
            return '1 - 列表标签'
            break
          case 2:
            return '2 - 分类标签'
            break
          default:
            return `${listShow} - 其它标签`
            break
        }
      },

      // 获取用户列表
      async findAllLabels(metaData) {
          this.labelTableLoading = true
          const result = await findAllLabelsAjax(this.searchLabel, metaData || this.metaData)
          if (result.status == "SUCCESS") {
            this.labelTable = result.data
            this.updateMetaData({metaData: result.resMetaData, init: true})
            this.labelTableLoading = false
          }
        },
    },

    beforeDestroy() {
      PubSub.unsubscribe("updateMetaData")
    }
  };
</script>

<style >
  .Label .el-table tbody .cell {
    line-height: 35px !important;
  }
</style>
