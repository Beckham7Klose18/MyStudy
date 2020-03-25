<template>
    <el-row>
      <el-row style="margin-bottom: 10px;">
        <el-input v-model="foodType.label" placeholder="请输入一级分类名称" size="small" style="width: 35%;">
          <el-button slot="append" icon="el-icon-plus" @click="editFoodType()">添加一级分类</el-button>
        </el-input>
      </el-row>
      <el-table stripe :data="foodTypeTable"
                 v-loading="foodTypeTableLoading"
                 row-key="value"
                 :expand-row-keys="expandRowKeys"
                 :tree-props="{children: 'children'}"
                 :header-cell-style="{backgroundColor: '#DCDFE6'}"
                 :cell-style="{paddingTop: '7px', paddingBottom: '3px'}">
          <el-table-column type="index"/>
          <el-table-column label="分类名称" width="200"
                           prop="label" show-overflow-tooltip/>
          <el-table-column label="操作" min-width="200">
            <template slot-scope="scope">
              <el-input v-model="scope.row.newLabel" placeholder="请输入一级分类名称" size="small"
                       v-if="scope.row.children" style="width: 40%;">
                <el-button slot="append" icon="el-icon-edit" @click="editFoodType(scope.row)">修改一级分类名称</el-button>
              </el-input>
              <el-input v-model="scope.row.secondTypeLabel" placeholder="请输入二级分类名称" size="small"
                       v-if="scope.row.children" style="width: 35%;">
                <el-button slot="append" icon="el-icon-plus" @click="editSecondFoodType(scope.row, true)">添加二级分类</el-button>
              </el-input>
              <el-input v-model="scope.row.newSecondLabel" placeholder="请输入二级分类名称" size="small"
                        v-if="! scope.row.children" style="width: 40%;">
                <el-button slot="append" icon="el-icon-edit" @click="editSecondFoodType(scope.row, false)">修改二级分类名称</el-button>
              </el-input>
              <el-select v-model="scope.row.firstValue" placeholder="移动到一级分类" size="small"
                       v-if="! scope.row.children" style="width: 35%;" @change="moveSecondFoodType(scope.row)">
                <el-option v-for="item in foodTypeTable" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
    </el-row>
</template>

<script>
    import {
      findAllFoodTypesAjax,
      editFoodTypeAjax
    } from '../../api'
    import {mapState, mapActions} from 'vuex'

    export default {
        data() {
            return {
              foodTypeTable: [],
              foodTypeTableLoading: false,
              foodType: {
                value: '',
                label: '',
                children: null
              },
              expandRowKeys: []
            }
        },

      computed: {
        ...mapState(['loading']),
      },

        mounted() {
            this.findAllFoodTypes()
        },

        methods: {
          moveSecondFoodType (row) {
            const firstFoodType = this.foodTypeTable.find(foodType => foodType.value == row.firstValue)
            this.foodType.value = firstFoodType.value
            this.foodType.label = firstFoodType.label
            this.foodType.children = [{
              value: row.value,
              label: row.label
            }]
            this.expandRowKeys = [firstFoodType.value]
            this.editFoodType()
          },

          editSecondFoodType (row, add) {
            if (add) {
              if (! row.secondTypeLabel) return this.$message.warning(`请输入二级分类名称`)
              this.foodType.value = row.value
              this.foodType.label = row.label
              this.foodType.children = [{label: row.secondTypeLabel}]
              this.expandRowKeys = [row.value]
            } else {
              if (! row.newSecondLabel) return this.$message.warning(`请输入二级分类名称`)
              this.foodType.value = row.parent.value
              this.foodType.label = row.parent.label
              this.foodType.children = [{
                value: row.value,
                label: row.newSecondLabel
              }]
              this.expandRowKeys = [row.parent.value]
            }
            this.editFoodType()
          },

          async editFoodType (row) {
            if (row) {
              if (! row.newLabel) return this.$message.warning(`请输入一级分类名称`)
              this.foodType.value = row.value
              this.foodType.label = row.newLabel
            }
            if (! this.foodType.label) return this.$message.warning(`请输入一级分类名称`)
            const result = await editFoodTypeAjax(this.foodType)
            if (result.status == "SUCCESS") {
              this.foodType.label = ''
              this.findAllFoodTypes()
            }
          },

          // 获取所有食材分类
          async findAllFoodTypes() {
            this.foodTypeTableLoading = true
            const result = await findAllFoodTypesAjax(false)
            if (result.status == "SUCCESS")
                this.foodTypeTable = result.data.map(type => {
                    if (type.children && type.children.length >1)
                        type.children.sort((c1, c2) => c1.label.length - c2.label.length)
                    return type
                }).sort((t1, t2) => t1.label.length - t2.label.length)
                  .map(type => {
                    type.children.map(c => Object.assign(c, {parent: type}))
                    return type
                  })
            this.foodTypeTableLoading = false
            this.loading.close()
          },
        },
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
