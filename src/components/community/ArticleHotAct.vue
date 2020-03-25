<template>
  <div>
    <el-row style="margin-bottom:20px">
      <el-col :span="4">
        <el-button
          type="primary"
          size="small"
          style="width: 100%;"
          @click="addDialogVisible = true"
        >
          添加活动&nbsp;
          <i class="el-icon-plus"></i>
        </el-button>
      </el-col>

      <el-col :span="7" :offset="1">
        <el-input
          v-model="searchAct.text"
          placeholder="搜索活动"
          class="input-with-select"
          size="small"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchActData" />
          <el-button slot="append" icon="el-icon-refresh-left" @click="resetSearchActData" />
        </el-input>
      </el-col>
    </el-row>
    <el-table stripe v-loading="actLoading" :data="actList"
        :header-cell-style="{backgroundColor: '#DCDFE6'}"
        :cell-style="{paddingTop: '7px', paddingBottom: '5px'}" >
      <el-table-column type="index"></el-table-column>
      <el-table-column label="活动名称">
        <template slot-scope="scope">
          <el-row>
            <el-tag>{{scope.row.actName}}</el-tag>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="排序">
        <template slot-scope="scope">
          <el-row>
            <el-tag type="success">{{scope.row.sort}}</el-tag>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="热门活动">
        <template slot-scope="scope">
          <el-row>
            <el-tag type="danger" v-if="scope.row.status">
              热门活动
              <i class="el-icon-s-opportunity" />
            </el-tag>
            <el-tag type="warning" v-else>
              普通活动
              <i class="el-icon-edit" />
            </el-tag>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="查询动态" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="goArticle(scope.row.actName)">
            查询动态&nbsp;
            <i class="el-icon-edit-outline" />
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="更改活动" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="updateActDialogVisible(scope.row)">
            更改活动&nbsp;
            <i class="el-icon-s-tools" />
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="删除" fixed="right" width="100px">
          <template slot-scope="scope">
            <el-button type="info" size="mini" @click="deleteAct(scope.row)">
              删除&nbsp;
              <i class="el-icon-delete" />
            </el-button>
          </template>
        </el-table-column>
    </el-table>
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="30%">
      <el-row>
        <el-col :span="4">活动名称：</el-col>
        <el-col :span="20">
          <el-input v-model="addAct.actName" placeholder="请输入活动名称" size="small" />
        </el-col>
      </el-row>
      <el-row style="margin-top:15px">
        <el-col :span="4">序号：</el-col>
        <el-col :span="20">
          <el-input v-model="addAct.sort" placeholder="请输入序号" size="small" />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addActData">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="updateDialogVisible" width="30%">
      <el-row>
        <el-col :span="4">活动名称：</el-col>
        <el-col :span="20">
          <el-input v-model="updateAct.actName" placeholder="请输入活动名称" size="small" disabled />
        </el-col>
      </el-row>
      <el-row style="margin-top:15px">
        <el-col :span="4">序号：</el-col>
        <el-col :span="20">
          <el-input v-model="updateAct.sort" placeholder="请输入序号" size="small" />
        </el-col>
      </el-row>
      <el-row style="margin-top:15px">
        <el-col :span="4">活动状态：</el-col>
        <el-col :span="20">
          <el-select v-model="updateAct.status" placeholder="请选择活动状态">
            <el-option label="普通活动" :value="0"></el-option>
            <el-option label="热门活动" :value="1"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateActData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getActDataAjax,
    searchActDataAjax,
    addActDataAjax,
    deleteActAjax,
    updateActAjax
  } from "../../api";
  import { mapState, mapActions, mapMutations } from "vuex";
  const MJ_Pagination = () => import('../common/MJ_Pagination.vue')

  export default {
    data() {
      return {
        addDialogVisible: false,
        addAct: { actName: "", sort: "" },
        searchAct: { text: "" },
        actList: [],
        actLoading: false,
        updateAct: { actName: "", sort: "" },
        updateDialogVisible: false
      };
    },

    mounted () {
      this.getActData();
    },

    computed: {
      ...mapState(['loading', 'metaData'])
    },

    methods: {
      ...mapMutations(["updateSearch"]),
      ...mapActions(['loadingOpen']),

      //活动列表
      async getActData() {
        this.actLoading = true;
        const result = await getActDataAjax(this.metaData);
        if (result.status == "SUCCESS") {
          this.actList = result.data;
          this.actLoading = false;
        }
        this.loading.close()
      },

      //搜索活动
      async searchActData() {
        const result = await searchActDataAjax(this.searchAct, this.metaData);

        if (result.status == "SUCCESS") {
          this.actList = result.data;
        }
      },

      resetSearchActData() {
        this.searchAct.text = "";
        this.getActData();
      },

      //添加活动
      async addActData() {
        const result = await addActDataAjax(this.addAct, this.metaData);

        if (result.status == "SUCCESS") {
          this.getActData();
          this.$message({
            message: "添加成功",
            type: "success"
          });
        } else {
          this.$message.error("添加失败");
        }

        this.addDialogVisible = false;
      },

      //删除活动
      async deleteAct(data) {
        const result = await deleteActAjax(data, this.metaData);
        if (result.status == "SUCCESS") {
          this.getActData();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        } else {
          this.$message.error("删除失败");
        }
      },

      //更改活动
      async updateActData() {
        const result = await updateActAjax(this.updateAct, this.metaData);
        if (result.status == "SUCCESS") {
          this.getActData();
          this.$message({
            message: "更新成功",
            type: "success"
          });
        } else {
          this.$message.error("更新失败");
        }
        this.updateDialogVisible = false;
      },

      //根据活动搜索动态
      goArticle(data) {
        this.updateSearch(data);
        this.$router.push("/community/List");
      },

      //修改活动对话框
      updateActDialogVisible(data) {
        this.updateAct = data;
        this.updateDialogVisible = true;
        // console.log(this.updateAct);
      }
    },

    beforeDestroy() {
      PubSub.unsubscribe("updateMetaData")
    }
  }
</script>

<style >
</style>
