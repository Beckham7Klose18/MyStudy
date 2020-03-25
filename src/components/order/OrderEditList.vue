<template>
    <div>
        <el-row style="margin-bottom: 10px;">
            <el-col :span="3">
              <el-select size="small" v-model="searchLog.editType" clearable placeholder="请选择修改内容" @change="findAlllogs(pageOne)">
                <el-option label="配送费" value="1"/>
                <el-option label="订单金额" value="2"/>
                <el-option label="收货人" value="3"/>
                <el-option label="收货电话" value="4"/>
                <el-option label="收货地址" value="5"/>
              </el-select>
            </el-col>
            <el-col :span="6" :offset="1">
                <el-input v-model="searchLog.orderNo" placeholder="订单编号关键词搜索" class="input-with-select" size="small">
                    <el-button slot="append" icon="el-icon-search" @click="findAlllogs"/>
                    <el-button slot="append" icon="el-icon-refresh-left" @click="searchLog.orderNo = ''; findAlllogs(pageOne)"/>
                </el-input>
            </el-col>
            <el-col :span="5" :offset="1">
                <el-input v-model="searchLog.operatorName" placeholder="操作用户账号关键词搜索" class="input-with-select" size="small">
                    <el-button slot="append" icon="el-icon-search" @click="findAlllogs"/>
                    <el-button slot="append" icon="el-icon-refresh-left" @click="searchLog.orderNo = ''; findAlllogs(pageOne)"/>
                </el-input>
            </el-col>
            <el-col :span="7" :offset="1">
            <el-date-picker size="small"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="修改时间-开始"
                            end-placeholder="修改时间-结束"
                            v-model="searchLog.editDates"
                            @change="findAlllogs(pageOne)"
                            :picker-options="pickerOptions"/>
          </el-col>
        </el-row>
        <el-table stripe max-height="678"
                  v-loading="tableLoading"
                  @sort-change="orderSortChange"
                  :data="logsTable"
                  :default-sort="{prop: 'edit_date', order: 'descending'}"
                  :header-cell-style="{backgroundColor: '#DCDFE6'}">
            <el-table-column type="index" width="60" align="center"/>
            <el-table-column label="操作用户" width="150"
                             prop="operatorName"/>
            <el-table-column label="订单号" width="200"
                             prop="orderNo"/>
            <el-table-column label="修改内容" width="150"
                             :formatter="(row) => showEditContent(row).name"/>
            <el-table-column label="修改原值" width="200" show-overflow-tooltip
                             :formatter="(row) => showEditContent(row).old"/>
            <el-table-column label="修改新值" width="200" show-overflow-tooltip
                             :formatter="(row) => showEditContent(row).new"/>
            <el-table-column label="修改时间" min-width="180"
                             prop="edit_date"
                             sortable="custom"
                             :formatter="(row) => dateFormatter(row.editDate)"/>
        </el-table>
        <el-row v-show="logsTable && logsTable.length > 0" style="margin-top: 10px">
            <el-col style="text-align: right;">
                <MJ_Pagination/>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {
        findAllShopingOrderEditLogsAjax,
    } from "../../api"
    import {mapState, mapActions} from "vuex"
    import {dateFormatter} from "../../util"
    const MJ_Pagination = () => import('../common/MJ_Pagination.vue')

    export default {
        components: {
            MJ_Pagination
        },

        data() {
            return {
                logsTable: [],
                tableLoading: false,
                searchLog: {
                    orderNo: "",
                    operatorName: "",
                    editDates: [],
                    editType: '',
                },
            };
        },

        computed: {
            ...mapState(["loading", "pickerOptions", "metaData", "maijiUser"]),

            pageOne () {
              return {
                page: 1,
                size: this.metaData.size
              }
            },
        },

        mounted() {
          this.findAlllogs(this.pageOne)
          PubSub.subscribe("updateMetaData", () => this.findAlllogs())
        },

        methods: {
            ...mapActions(["updateMetaData"]),
            dateFormatter, // 日期格式化

            // 显示编辑内容
            showEditContent(row) {
              if (row.deliveryFeeNew) return {
                name: '配送费',
                old: row.deliveryFee + ' 元',
                new: row.deliveryFeeNew + ' 元',
              }
              if (row.amountNew) return {
                name: '订单金额',
                old: row.amount + ' 元',
                new: row.amountNew + ' 元',
              }
              if (row.consigneeNew) return {
                name: '收货人',
                old: row.consignee,
                new: row.consigneeNew,
              }
              if (row.telNew) return {
                name: '收货电话',
                old: row.tel,
                new: row.telNew,
              }
              if (row.shopingAddressNew) return {
                name: '收货地址',
                old: row.shopingAddress,
                new: row.shopingAddressNew,
              }
              return {}
            },

            // 获取表格数据
            async findAlllogs(metaData) {
                this.tableLoading = true;
                const result = await findAllShopingOrderEditLogsAjax(this.searchLog, metaData || this.metaData);
                if (result.status == "SUCCESS") this.logsTable = result.data;
                this.updateMetaData({metaData: result.resMetaData, init: true});
                this.tableLoading = false;
                this.loading.close();
            },

            // 表格排序
            orderSortChange({prop, order}) {
              this.searchLog.orderBy = prop
              this.searchLog.asc = order == "ascending" ? true : false
              this.findAlllogs(this.pageOne)
            },
        },

        beforeDestroy() {
            PubSub.unsubscribe("updateMetaData")
        }
    };
</script>

<style>
    .el-tabs .el-badge__content.is-fixed {
        position: absolute !important;
        top: 9px !important;
        right: 2px !important;
        transform: translateY(-50%) translateX(100%) !important;
    }

    .el-table .success-row {
        background-color: #f2f9ff;
        color: #409eff;
    }

    .el-dialog__header {
        background-color: #f2f9ff;
    }

    .el-input-number--mini {
        width: 95px;
        line-height: 26px;
    }

    .el-input-number.is-controls-right .el-input__inner {
        padding-left: 0px;
        padding-right: 30px;
    }

    .el-range-editor--small.el-input__inner {
        width: 250px;
    }

    .el-tabs__item.is-top {
        font-size: large;
    }
</style>
