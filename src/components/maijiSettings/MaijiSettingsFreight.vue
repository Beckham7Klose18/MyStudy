<template>
    <div>
      <el-row style="margin-bottom: 10px;">
        <el-col :span="3">
          <el-button type="primary" size="small" style="width: 100%;" @click="addRuleShow = true">添加规则&nbsp;<i class="el-icon-plus"/></el-button>
        </el-col>
        <el-col :span="3" :offset="1">
          <el-select v-model="ruleFreight.delivery" size="small" placeholder="请选择快递物流搜索" clearable @change="findAllRuleFreights(pageOne)" style="width: 100%;">
            <el-option label="申通快递" value="申通快递"/>
            <el-option label="顺丰次晨" value="顺丰次晨"/>
            <el-option label="顺丰航空" value="顺丰航空"/>
            <el-option label="顺丰陆运" value="顺丰陆运"/>
          </el-select>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-input v-model="ruleFreight.areaNames" placeholder="目的地区域搜索名称" class="input-with-select" size="small">
            <el-button slot="append" icon="el-icon-search" @click="findAllRuleFreights(pageOne)"/>
            <el-button slot="append" icon="el-icon-refresh-left" @click="areaNames = ''; findAllRuleFreights(pageOne)"/>
          </el-input>
        </el-col>
      </el-row>
      <el-table stripe max-height="688"
                v-loading="ruleFreightTableLoading"
                :data="ruleFreightTable"
                :header-cell-style="{backgroundColor: '#DCDFE6'}"
                :cell-style="{paddingTop: '7px', paddingBottom: '5px'}">
        <el-table-column type="index" width="40" align="center"/>
        <el-table-column label="快递物流" width="120"
                         prop="delivery"/>
        <el-table-column label="目的地区域" width="380"
                         prop="areaNames"/>
        <el-table-column label="首重" width="100"
                         :formatter="(row) => row.headWeight + ' 克'"/>
        <el-table-column label="首重费用" width="100"
                         :formatter="(row) => row.freight + ' 元'"/>
        <el-table-column label="增重" width="100"
                         :formatter="(row) => row.moreWeight + ' 克'"/>
        <el-table-column label="增重费用" width="100"
                         :formatter="(row) => row.moreFreight + ' 元'"/>
        <el-table-column label="免邮金额" width="100"
                         :formatter="(row) => row.freeFreight + ' 元'"/>
        <el-table-column label="是否有效" width="90">
          <template slot-scope="scope">
            <el-tag type="success" v-show="scope.row.userable">有效 <i class="el-icon-circle-check"/></el-tag>
            <el-tag type="info" v-show="! scope.row.userable">失效 <i class="el-icon-circle-close"/></el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="190">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="findRuleFreightById(scope.row.uuId)">编辑</el-button>
            <el-button size="mini" type="success" icon="el-icon-check" v-if="! scope.row.userable" @click="updRuleFreight(scope.row, {userable: true})">启用</el-button>
            <el-button size="mini" type="danger" icon="el-icon-close" v-if="scope.row.userable" @click="updRuleFreight(scope.row, {userable: false})">停用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="margin-top: 10px">
        <el-col style="text-align: right;">
          <MJ_Pagination/>
        </el-col>
      </el-row>
      <el-dialog :title="addRule.uuId && '编辑运费规则' || '添加运费规则'" :visible.sync="addRuleShow" width="30%" append-to-body>
        <el-form ref="addRuleFrom" :model="addRule" label-width="100px" label-position="right">
          <el-form-item label="快递物流" prop="delivery" :rules="[{required: 'true', message: '快递物流不能为空'}]">
            <el-select v-model="addRule.delivery" size="small" placeholder="请选择快递物流" clearable>
              <el-option label="申通快递" value="申通快递"/>
              <el-option label="顺丰次晨" value="顺丰次晨"/>
              <el-option label="顺丰航空" value="顺丰航空"/>
              <el-option label="顺丰陆运" value="顺丰陆运"/>
            </el-select>
          </el-form-item>
          <el-form-item label="目的地区域">
            <el-cascader v-model="provinceCities" :options="allProvinceCities" clearable
                         :props="{ multiple: true, checkStrictly: true }" placeholder="全国范围"/>
          </el-form-item>
          <el-form-item label="首重" prop="headWeight" :rules="[{required: 'true', message: '首重不能为空'}]">
            <el-input-number v-model="addRule.headWeight" :min="0" :step="100"/> 克
          </el-form-item>
          <el-form-item label="首重费用" prop="freight" :rules="[{required: 'true', message: '首重费用不能为空'}]">
            <el-input-number v-model="addRule.freight" :min="0" :step="1"/> 元
          </el-form-item>
          <el-form-item label="增重" prop="moreWeight" :rules="[{required: 'true', message: '增重不能为空'}]">
            <el-input-number v-model="addRule.moreWeight" :min="0" :step="100"/> 克
          </el-form-item>
          <el-form-item label="首重费用" prop="moreFreight" :rules="[{required: 'true', message: '首重费用不能为空'}]">
            <el-input-number v-model="addRule.moreFreight" :min="0" :step="0.1"/> 元 / {{addRule.moreWeight}}克
          </el-form-item>
          <el-form-item label="免邮金额" prop="moreWeight" :rules="[{required: 'true', message: '免邮金额不能为空'}]">
            <el-input-number v-model="addRule.freeFreight" :min="0" :step="1"/> 元
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="add_updRuleFreight">确认{{addRule.uuId && '编辑' || '添加'}}</el-button>
            <el-button @click="addRuleShow = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>

<script>
    import {
      findAllRuleFreightsAjax,
      add_updRuleFreightAjax,
      findAllProvinceCityAjax
    } from "../../api"
    import {mapActions, mapState} from "vuex"
    const MJ_Pagination = () => import('../common/MJ_Pagination.vue')

    export default {
        components: {
        MJ_Pagination,
      },

        data() {
            return {
              ruleFreight: {
                uuId: '',
                areaNames: '',
                delivery: '',
              },
              ruleFreightTable: [],
              ruleFreightTableLoading: false,
              addRuleShow: false,
              addRule: {
                uuId: null,
                delivery: null,
                areaNames: '',
                headWeight: null,
                freight: null,
                moreWeight: 1000,
                moreFreight: null,
                freeFreight: 39,
                userable: true,
              },
              allProvinceCities: null,
              provinceCities: null,
            }
        },

        computed: {
          ...mapState(['loading', 'maijiUser', "pickerOptions", "metaData"]),

          pageOne: {
            get () {
              return {
                page: 1,
                size: this.metaData.size
              }
            },
          },
        },

        watch: {
          addRuleShow: function (value) {
            if (! value) {
              this.ruleFreight.uuId = ''
              this.findAllRuleFreights(this.pageOne)
              this.provinceCities = null
              this.addRule = {
                  uuId: null,
                  delivery: null,
                  areaNames: '',
                  headWeight: null,
                  freight: null,
                  moreWeight: 1000,
                  moreFreight: null,
                  freeFreight: 39,
                  userable: true,
              }
            }
          },

          provinceCities: function () {
            this.addRule.areaNames = this.provinceCities.map(p => {
              if (p.length == 1) return '@' +  p[0]
                return '#' + p.join('/')
            }).join('、')
        }
      },

        mounted() {
          this.findAllRuleFreights(this.pageOne)
          this.findAllProvinceCity()
          PubSub.subscribe("updateMetaData", () => this.findAllRuleFreights())
        },

        methods: {
          ...mapActions(["loadingOpen", "updateMetaData"]),

          async findRuleFreightById(uuId) {
            this.ruleFreight.uuId = uuId
            const result = await findAllRuleFreightsAjax(this.ruleFreight, this.pageOne)
            if (result.status == "SUCCESS") this.addRule = result.data[0]
            this.provinceCities = this.addRule.areaNames.split('、').map(a => a.replace('@', '').replace('#', '').split('\/'))
            this.addRuleShow = true
          },

          async findAllRuleFreights(metaData) {
            this.ruleFreightTableLoading = true
            const result = await findAllRuleFreightsAjax(this.ruleFreight, metaData || this.metaData)
            if (result.status == "SUCCESS") {
              this.ruleFreightTable = result.data
              this.updateMetaData({metaData: result.resMetaData, init: true})
            }
            this.ruleFreightTableLoading = false
            this.loading.close()
          },

          async updRuleFreight (row, {userable} = {}) {
            this.loadingOpen()
            Object.assign(row, {userable})
            const result = await add_updRuleFreightAjax(row)
            if (result.status != "SUCCESS") {
              this.loading.close()
              return this.$message.error(`规则编辑失败，请稍后重试`)
            }
            this.findAllRuleFreights()
            this.$message.success(`规则编辑成功`)
            this.loading.close()
          },

          add_updRuleFreight() {
            this.loadingOpen()
            this.$refs.addRuleFrom.validate(async valid => {
              if (!valid) {
                this.loading.close();
                return this.$message.error(`规则编辑失败，请确认编辑规范！`);
              }
              const msg = this.addRule.uuId && '编辑' || '添加'
              const result = await add_updRuleFreightAjax(this.addRule)
              if (result.status != "SUCCESS") {
                this.loading.close()
                return this.$message.error(`规则${msg}失败，请稍后重试`)
              }
              this.addRuleShow = false
              this.$message.success(`规则${msg}成功`)
              this.loading.close()
            })
          },

          async findAllProvinceCity () {
            const result = await findAllProvinceCityAjax()
            if (result.status == "SUCCESS") this.allProvinceCities = result.data.map(province => {
              const p = { value: province.name, label: province.name }
              if (province.childrenList) p.children = province.childrenList.map(city => {
                return { value: city.name, label: city.name, }
              }).sort((c1, c2) => c1.value.length - c2.value.length)
              return p
            }).sort((p1, p2) => p1.value.length - p2.value.length)
          },
        }
    }
</script>

<style>
  .orderReturnRule .elDivider1 {
    margin-top: 0 !important;
  }
</style>
