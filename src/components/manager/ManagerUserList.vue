<template>
  <div class="Manager">
    <el-row style="margin-bottom: 10px;">
      <el-col :span="3">
        <el-button type="primary" size="small" style="width: 100%;" @click="addUserShow = true">添加用户&nbsp;<i class="el-icon-plus"/></el-button>
      </el-col>
      <el-col :span="roleId && 7 || 5" :offset="1">
        <el-input v-model="searchUser.name" placeholder="用户名称" class="input-with-select" size="small">
          <el-button slot="append" icon="el-icon-search" @click="findAllUsers"/>
          <el-button slot="append" icon="el-icon-refresh-left" @click="searchUser.name = ''; findAllUsers()"/>
        </el-input>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-select v-model="searchUser.roleId" size="small" placeholder="请选择角色筛选用户" clearable @change="findAllUsers()" :disabled="!! roleId">
          <el-option v-for="role in roleList" :key="role.uuId" :label="role.name" :value="role.uuId"/>
        </el-select>
      </el-col>
    </el-row>
    <el-table stripe
        v-loading="userTableLoading"
        :data="userTable"
        :header-cell-style="{backgroundColor: '#DCDFE6'}"
        :cell-style="{paddingTop: '7px', paddingBottom: '7px'}">
      <el-table-column type="index" width="40" align="center"/>
      <el-table-column label="用户名称" prop="name" width="125"
                       show-overflow-tooltip/>
      <el-table-column label="用户名称修改" width="210" v-if="! roleId">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.updName" placeholder="请输入用户名称">
            <el-button slot="append" size="mini" type="primary" icon="el-icon-edit" @click="updateUser(scope.row)">修改</el-button>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="修改密码" width="140" v-if="! roleId">
        <template slot-scope="scope">
          <el-popover placement="bottom" trigger="click" width="185" title="修改用户密码">
            <el-input size="mini" placeholder="请输入原密码" v-model="scope.row.pwdOld">
              <template slot="prepend">原密码</template>
            </el-input>
            <el-input size="mini" placeholder="请输入新密码" v-model="scope.row.pwdNew" style="margin: 5px 0;">
              <template slot="prepend">新密码</template>
            </el-input>
            <el-button type="primary" size="mini" @click="updateUser(scope.row)" style="width: 100%;" plain>确定</el-button>
            <el-button type="warning" size="mini" slot="reference">修改</el-button>
          </el-popover>
          <el-button slot="append" size="mini" type="primary" @click="updateUser(scope.row, {resetPwd: true})">重置</el-button>
        </template>
      </el-table-column>
      <el-table-column label="执行密码" width="140" v-if="! roleId">
        <template slot-scope="scope">
          <el-popover placement="bottom" trigger="click" width="150">
            <el-input size="mini" placeholder="请输入执行密码" v-model="scope.row.executePwdNew"/>
            <el-button type="primary" size="mini" @click="updateUser(scope.row)" style="width: 100%; margin-top: 10px;" plain>确定</el-button>
            <el-button type="warning" size="mini" slot="reference" v-if="scope.row.executePwd">修改</el-button>
            <el-button type="success" size="mini" slot="reference" v-if="! scope.row.executePwd">添加</el-button>
          </el-popover>
          <el-button slot="append" size="mini" type="danger" @click="updateUser(scope.row, {delEPwd: true})" v-if="scope.row.executePwd">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="读写权限" width="95" v-if="! roleId">
        <template slot-scope="scope">
          <el-tag type="warning" v-if="scope.row.onlyRead">只读权限</el-tag>
          <el-tag type="success" v-if="! scope.row.onlyRead">读写权限</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="修改权限" width="80" v-if="! roleId">
        <template slot-scope="scope">
          <el-button type="success" plain icon="el-icon-top" size="mini"  v-if="scope.row.onlyRead"  @click="updateUser(scope.row, {onlyRead: false})"/>
          <el-button type="warning" plain icon="el-icon-bottom" size="mini" v-if="! scope.row.onlyRead" @click="updateUser(scope.row, {onlyRead: true})"/>
        </template>
      </el-table-column>
      <el-table-column label="用户角色" width="360">
        <template slot-scope="scope">
          <el-select v-model="scope.row.roleIds" multiple placeholder="请选择用户角色" style="width: 100%;"
                     @change="(roleIds) => editUserRole(roleIds, scope.row.uuId)" :disabled="!! roleId">
            <el-option v-for="role in roleList" :key="role.uuId" :label="role.name" :value="role.uuId"/>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" width="160"
                       :formatter="(row) => dateFormatter(row.addDate)"/>
      <el-table-column label="启用" fixed="right" width="70">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.usable" style="font-size: large;"><i class="el-icon-circle-check"/></el-tag>
          <el-tag type="danger" v-if="! scope.row.usable" style="font-size: large;"><i class="el-icon-circle-close"/></el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="100" v-if="! roleId">
        <template slot-scope="scope">
          <el-button size="mini" type="success" icon="el-icon-check" v-if="! scope.row.usable" @click="updateUser(scope.row, {usable: true})">启用</el-button>
          <el-button size="mini" type="danger" icon="el-icon-close" v-if="scope.row.usable" @click="updateUser(scope.row, {usable: false})">停用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="100" v-if="roleId">
        <template slot-scope="scope">
          <el-button size="mini" type="success" icon="el-icon-plus" v-if="eqRoleId == false" @click="editRoleUser(scope.row.uuId, true)">添加</el-button>
          <el-button size="mini" type="danger" icon="el-icon-minus" v-if="eqRoleId == true" @click="editRoleUser(scope.row.uuId, false)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 10px">
      <el-col style="text-align: right;">
        <MJ_Pagination/>
      </el-col>
    </el-row>
    <el-dialog title="添加用户" :visible.sync="addUserShow" width="30%" append-to-body>
      <el-form ref="addUserFrom" :model="addUser" label-width="80px" label-position="right">
        <el-form-item label="账号" prop="name" :rules="[{required: 'true', message: '账号不能为空'}]">
          <el-input v-model="addUser.name" placeholder="请输入账号"/>
        </el-form-item>
        <el-form-item label="密码" prop="pwd" :rules="[{required: 'true', message: '密码不能为空'}]">
          <el-input v-model="addUser.pwd" placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item label="执行密码">
          <el-input v-model="addUser.executePwd" placeholder="请输入执行密码"/>
        </el-form-item>
        <el-form-item label="权限模式" prop="onlyRead" :rules="[{required: 'true', message: '权限模式不能为空'}]">
          <el-radio v-model="addUser.onlyRead" :label="false">读写权限</el-radio>
          <el-radio v-model="addUser.onlyRead" :label="true">只写权限</el-radio>
        </el-form-item>
        <el-form-item label="角色分配">
          <el-checkbox-group v-model="addUser.roleIds">
            <el-checkbox v-for="role in roleList" :label="role.uuId" :key="role.uuId">{{role.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addUserMethod">确认添加</el-button>
          <el-button @click="addUserShow = false">取消</el-button>
      </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
    findAllUsersAjax,
    updUserAjax,
    addUserAjax,
    findAllRolesAjax,
    editUserRoleAjax,
    editRoleUserAjax
  } from '../../api'
  import {mapState, mapActions} from 'vuex'
  import {dateFormatter} from '../../util'
  const MJ_Pagination = () => import('../common/MJ_Pagination.vue')

  export default {
    components: {
      MJ_Pagination,
    },

    props: {
      roleId: String,
      eqRoleId: {
        type: Boolean,
        default: true,
      }
    },

    data() {
      return {
        userTable: [],
        userTableLoading: false,
        searchUser: {
          name: '',
          roleId: ''
        },
        addUserShow: false,
        addUser: {
          name: '',
          pwd: '',
          roleIds: [],
          onlyRead: false,
        },
        roleList: []
      }
    },

    computed: {
      ...mapState(['loading', 'metaData']),
    },

    mounted() {
      if (this.roleId) {
        this.searchUser.roleId = this.roleId
        this.addUser.roleIds = [this.roleId]
      }
      this.findAllUsers({page: 1, size: this.metaData.size})
      this.findAllRoles()
      PubSub.subscribe('updateMetaData', () => this.findAllUsers())
      this.loading.close()
    },

    methods: {
      ...mapActions(['updateMetaData']),
      dateFormatter,

      // 编辑角色用户
      async editRoleUser (userId, add) {
        const msg = add && '添加' || '移除'
        const result = await editRoleUserAjax({roleId: this.roleId, userIds: [userId], add})
        if (result.status != "SUCCESS") return this.$message.error(`${msg}角色用户失败，请确认后重试`)
        this.findAllUsers({page: 1, size: this.metaData.size})
        this.$message.success(`${msg}角色用户成功`)
      },

      // 编辑用户角色
      async editUserRole (roleIds, userId) {
        const result = await editUserRoleAjax({userId, roleIds})
        if (result.status == "SUCCESS") return this.$message.success(`编辑用户角色成功`)
        this.$message.error(`编辑用户角色失败，请确认后重试`)
      },

      // 添加用户
      async addUserMethod () {
        this.$refs.addUserFrom.validate(async valid => {
          if (!valid) return this.$message.error(`添加用户失败，请确认添加规范！`)
          const result = await addUserAjax(this.addUser)
          if (result.status != "SUCCESS")
            return this.$message.error(`添加用户失败，请稍后重试`)
          this.addUserShow = false
          this.addUser = {
            name: '',
            pwd: '',
            roleIds: [],
            onlyRead: false,
          }
          this.findAllUsers({page: 1, size: this.metaData.size})
          this.$message.success(`添加用户成功`)
        })
      },

      // 获取角色列表
      async findAllRoles() {
        const result = await findAllRolesAjax(this.roleName, {page: 1, size: 99})
        if (result.status == "SUCCESS") this.roleList = result.data
      },

      // 修改用户数据
      async updateUser (row, {resetPwd, delEPwd, usable, onlyRead} = {}) {
        const data = {
          uuId: row.uuId,
          name: row.updName || null,
          pwdOld: row.pwdOld || null,
          pwdNew: row.pwdNew || null,
          executePwd: row.executePwdNew || null,
          resetPwd,
          delEPwd,
          usable,
          onlyRead
        }
        const result = await updUserAjax(data)
        let msg = '修改用户账号'
        if (data.pwdOld) msg = '修改用户密码'
        if (data.resetPwd) msg = '重置用户密码'
        if (data.executePwd) msg = `${row.executePwd && '修改' || '添加'}执行密码`
        if (typeof data.usable == 'boolean') msg = `${data.usable && '启用' || '停用'}用户`
        if (typeof data.onlyRead == 'boolean') msg = `${data.onlyRead && '降低' || '提升'}用户权限`
        if (result.status != "SUCCESS")
          if (result.status == "PWDOLDERROR")
            return this.$message.error(`修改用户密码失败：原密码错误，请确认后重试`)
          else return this.$message.error(`${msg}失败，请稍后重试`)
        this.findAllUsers()
        this.$message.success(`${msg}成功`)
      },

      // 获取用户列表
      async findAllUsers(metaData) {
          this.userTableLoading = true
          this.searchUser.eqRoleId = this.eqRoleId
          const result = await findAllUsersAjax(this.searchUser, metaData || this.metaData)
          if (result.status == "SUCCESS") {
            this.userTable = result.data.map(user => {
              user.roleIds = user.roles.map(role => role.uuId)
              return user
            })
            this.updateMetaData({metaData: result.resMetaData, init: true})
            this.userTableLoading = false
          }
        },
    },

    beforeDestroy() {
      PubSub.unsubscribe("updateMetaData")
    }
  };
</script>

<style >
  .Manager .el-table tbody .cell {
    line-height: 35px !important;
  }
</style>
