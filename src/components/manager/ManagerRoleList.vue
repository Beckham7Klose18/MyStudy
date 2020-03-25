<template>
  <div class="Manager">
    <el-row style="margin-bottom: 10px;">
      <el-col :span="3">
        <el-button type="primary" size="small" @click="addRoleShow = true" style="width: 100%;">添加角色&nbsp;<i class="el-icon-plus"/></el-button>
      </el-col>
      <el-col :span="6" :offset="1">
        <el-input v-model="roleName" placeholder="角色名称" class="input-with-select" size="small">
          <el-button slot="append" icon="el-icon-search" @click="findAllRoles"/>
          <el-button slot="append" icon="el-icon-refresh-left" @click="roleName = ''; findAllRoles()"/>
        </el-input>
      </el-col>
    </el-row>
    <el-table stripe
        v-loading="roleTableLoading"
        :data="roleTable"
        :header-cell-style="{backgroundColor: '#DCDFE6'}"
        :cell-style="{paddingTop: '7px', paddingBottom: '7px'}">
      <el-table-column type="index"/>
      <el-table-column label="角色名称" prop="name" width="120"
                       show-overflow-tooltip/>
      <el-table-column label="角色名称修改" width="222">
        <template slot-scope="scope">
          <el-input size="mini"v-model="scope.row.updName" placeholder="请输入角色名称">
            <el-button slot="append" size="mini" type="primary" icon="el-icon-edit" @click="updateRole(scope.row)">修改</el-button>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="角色描述" prop="describe" width="180"
                       show-overflow-tooltip/>
      <el-table-column label="角色描述修改" prop="describe" width="320">
        <template slot-scope="scope">
          <el-input size="mini"v-model="scope.row.updDescribe" placeholder="请输入角色描述">
            <el-button slot="append" size="mini" type="primary" icon="el-icon-edit" @click="updateRole(scope.row)">修改</el-button>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="用户列表" fixed="right" width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="role = scope.row; eqRoleId = true; userListShow = true;" icon="el-icon-user">用户列表</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="450">
        <template slot-scope="scope">
          <el-button size="mini" type="success" icon="el-icon-circle-plus-outline" @click="role = scope.row; eqRoleId = false; userListShow = true;">添加用户</el-button>
          <el-button size="mini" type="warning" icon="el-icon-remove-outline" @click="role = scope.row; eqRoleId = true; userListShow = true;">移除用户</el-button>
          <el-button size="mini" type="success" icon="el-icon-setting" @click="role = scope.row; findAllMenus(scope.row.uuId); paShow = true;">权限分配</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="delRoleMethod(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 10px">
      <el-col style="text-align: right;">
        <MJ_Pagination/>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="userListShow" width="61%">
      <span slot="title">{{role.name}}：用户列表</span>
      <ManagerUserList :roleId="role.uuId" :eqRoleId="eqRoleId" v-if="userListShow"/>
    </el-dialog>
    <el-dialog :visible.sync="paShow" width="60%">
      <span slot="title">{{role.name}}：权限分配</span>
      <el-transfer v-model="roleMenus" :data="allMenus" style="margin: 0 auto; width: fit-content;"
                   :titles="['角色未选权限菜单', '角色已选权限菜单']"
                   :button-texts="['移除权限', '添加权限']"
                   @change="editMenu"/>
    </el-dialog>
    <el-dialog title="添加角色" :visible.sync="addRoleShow" width="30%">
      <el-form ref="addRoleFrom" :model="addRole" label-width="90px" label-position="right">
        <el-form-item label="角色名称" prop="role.name" :rules="[{required: 'true', message: '角色名称不能为空'}]">
          <el-input v-model="addRole.role.name" placeholder="请输入角色名称"/>
        </el-form-item>
        <el-form-item label="角色描述" prop="role.describe" :rules="[{required: 'true', message: '角色描述不能为空'}]">
          <el-input v-model="addRole.role.describe" placeholder="请输入角色描述"/>
        </el-form-item>
        <el-form-item label="添加用户">
          <el-select v-model="addRole.userIds" multiple placeholder="请选择用户" style="width: 100%;">
            <el-option v-for="user in allUserList" :key="user.uuId" :label="user.name" :value="user.uuId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="分配权限">
          <el-button size="mini" type="primary" plain @click="paInnerShow = true;" icon="el-icon-circle-plus-outline" style="font-size: large; width: 100%;" v-if="addRole.menuIds.length == 0"/>
          <el-button size="mini" type="success" plain @click="paInnerShow = true;" icon="el-icon-circle-check" style="font-size: large; width: 100%;" v-if="addRole.menuIds.length > 0"/>
          <el-dialog :visible.sync="paInnerShow" width="50%" append-to-body>
            <span slot="title">{{addRole.role.name}}：权限分配</span>
            <el-transfer v-model="addRole.menuIds" :data="allMenus" style="margin: 0 auto; width: fit-content;"
                         :titles="['角色未选权限菜单', '角色已选权限菜单']"
                         :button-texts="['移除权限', '添加权限']"/>
          </el-dialog>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addRoleMethod">确认添加</el-button>
          <el-button @click="addRoleShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
    findAllRolesAjax,
    updRoleAjax,
    addRoleAjax,
    delRoleAjax,
    findAllMenusAjax,
    editRoleMenuAjax,
    findAllUsersAjax
  } from '../../api'
  import {mapState, mapActions} from 'vuex'
  const ManagerUserList = () => import('./ManagerUserList.vue')
  const MJ_Pagination = () => import('../common/MJ_Pagination.vue')

  export default {
    components: {
      MJ_Pagination,
      ManagerUserList
    },

    data() {
      return {
        userListShow: false,
        roleTable: [],
        roleTableLoading: false,
        roleName: '',
        role: {},
        eqRoleId: true,
        paShow: false,
        allMenus: [],
        roleMenus: [],
        addRoleShow: false,
        addRole: {
          role: {},
          menuIds: [],
          userIds: []
        },
        allUserList: [],
        paInnerShow: false
      }
    },

    computed: {
      ...mapState(['loading', 'metaData']),
    },

    mounted() {
      this.findAllRoles({page: 1, size: this.metaData.size})
      this.findAllMenus()
      this.findAllUsers()
      PubSub.subscribe('updateMetaData', () => this.findAllRoles())
      this.loading.close()
    },

    methods: {
      ...mapActions(['updateMetaData']),

      // 删除角色
      delRoleMethod (row) {
        this.$confirm(`确认删除角色：${row.name}`, '确认删除角色？', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const result = await delRoleAjax(row.uuId)
          if (result.status != "SUCCESS") return this.$message.error(`删除角色失败，请稍后重试`)
          this.findAllRoles({page: 1, size: this.metaData.size})
          return this.$message.success(`删除角色成功！`)
        })
      },

      // 添加角色
      async addRoleMethod () {
        this.$refs.addRoleFrom.validate(async valid => {
          if (! valid) return this.$message.error(`添加角色失败，请确认添加规范`)
          const result = await addRoleAjax(this.addRole)
          if (result.status != "SUCCESS") return this.$message.error(`添加角色失败，请稍后重试`)
          this.findAllRoles({page: 1, size: this.metaData.size})
          this.addRoleShow = false
          this.$message.success(`添加角色成功`)
        })
      },

      // 添加/移除角色权限菜单
      async editMenu (afterChange, direction, change) {
        const data = {
          roleId: this.role.uuId,
          menuIds: change,
        }
        if (direction == 'right') data.add = true
        if (direction == 'left') data.add = false
        const msg = direction == 'left' && '移除' || '添加'
        const result = await editRoleMenuAjax(data)
        if (result.status == "SUCCESS") return this.$message.success(`${msg}角色权限菜单成功`)
        this.$message.error(`${msg}角色权限菜单失败，请稍后重试`)
      },

      // 获取角色权限菜单
      async findAllMenus (roleId) {
        const result = await findAllMenusAjax(roleId)
        if (result.status == "SUCCESS") {
          if (roleId) this.roleMenus = result.data.map(menu => menu.uuId)
          else {
            const menu1s = result.data.filter(menu => menu.parentId == '001')
            menu1s.forEach(menu1 => {
              const menu2s = result.data.filter(menu2 => menu2.parentId == menu1.uuId)
                .map(menu2 => Object.assign({key: menu2.uuId, label: menu1.name + " - " + menu2.name}))
              this.allMenus.push(...menu2s)
            })
          }
        }
      },

      // 编辑角色数据
      async updateRole (row) {
        const data = {
          uuId: row.uuId,
          name: row.updName || null,
          describe: row.updDescribe || null
        }
        const result = await updRoleAjax(data)
        const msg = row.updName && '角色名称' || '角色描述'
        if (result.status != "SUCCESS") return this.$message.error(`修改${msg}失败，请稍后重试`)
        if (row.updName) {
          row.name = row.updName
          row.updName = ''
        }
        if (row.updDescribe) {
          row.describe = row.updDescribe
          row.updDescribe = ''
        }
        this.$message.success(`修改${msg}成功`)
      },

      // 获取角色列表
      async findAllRoles(metaData) {
          this.roleTableLoading = true
          const result = await findAllRolesAjax(this.roleName, metaData || this.metaData)
          if (result.status == "SUCCESS") {
            this.roleTable = result.data.map(role => Object.assign(role, {updName: '', updDescribe: ''}))
            this.updateMetaData({metaData: result.resMetaData, init: true})
            this.roleTableLoading = false
          }
        },

      // 获取用户列表
      async findAllUsers() {
        const result = await findAllUsersAjax({}, {page: 1, size: 99})
        if (result.status == "SUCCESS") this.allUserList = result.data
      },
    },

    beforeDestroy() {
      PubSub.unsubscribe("updateMetaData")
    }
  };
</script>

<style >
  .el-transfer-panel {
    width: 250px !important;
    height: 456px !important;
  }
  .el-transfer-panel__list {
    height: 456px !important;
  }
  .Manager .el-table tbody .cell {
    line-height: 35px !important;
  }
</style>
