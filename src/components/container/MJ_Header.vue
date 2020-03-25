<template>
  <div>
    <el-row class="header_bg">
      <el-col :span="2" style="text-align: right; width:150px">
        <router-link to="/home">
          <img src="./images/maijiLogo.png" width="90" height="60"/>
        </router-link>
      </el-col>
      <el-col :span="8" style="color: #fff; font-size: 35px; font-family: 'Lato', sans-serif; font-weight: 700; line-height: 60px; text-align: left; margin-left: 20px;">麦吉减肥法</el-col>
      <el-col :span="8"style="color: #fff; font-size: 20px; font-family: 'Lato', sans-serif; font-weight: 700; line-height: 60px; text-align: right;">{{admin}} - {{onlyRead && '只读' || '读写'}}</el-col>
      <el-col :span="2" style="text-align: right;">
        <el-button @click="countDialogVisible = true" :class="{animationCount}" style="border: none; background-color: rgba(255, 255, 255, 0);">
          <i class="el-icon-message-solid" style="font-size:35px; line-height:35px; color:#ecec00"/>
          <el-badge :value="countNumber" style="margin-left: -9px; margin-top: -38px;"/>
        </el-button>
      </el-col>
      <el-col :span="2" style="text-align: right;">
        <el-dropdown @command="handleCommand">
          <i class="el-icon-user" style="font-size: 40px; line-height: 65px; color: #ecec00; cursor: pointer;"/>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">注销</el-dropdown-item>
            <el-dropdown-item command="updPwd">修改密码</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-dialog title="待处理任务" :visible.sync="countDialogVisible" width="28%" :modal-append-to-body="false" style="text-align: left;">
      <el-row class="msgList" v-for="cn in countNumbers" :key="cn.name" v-if="cn.count">
        <el-col :span="10">{{cn.name}} <el-badge :value="cn.count" class="item"/></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="countDialogVisible = false; $router.push(cn.path)">前往 <i class="el-icon-edit el-icon--right"/></el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="updPwdShow" width="30%">
      <el-form ref="updPwdFrom" :model="updPwd" label-width="100px" label-position="right">
        <el-form-item label="原密码" prop="pwdOld" :rules="[{required: 'true', message: '账号不能为空'}]">
          <el-input type="password" placeholder="请输入原密码" v-model="updPwd.pwdOld" style="width: 70%;"/>
        </el-form-item>
        <el-form-item label="新密码" prop="pwdNew" :rules="[{required: 'true', message: '密码不能为空'}]">
          <el-input type="password" placeholder="请输入新密码" v-model="updPwd.pwdNew" style="width: 70%;"/>
        </el-form-item>
        <el-form-item label="确认新密码" prop="pwdNewA" :rules="[{required: 'true', message: '密码不能为空'}]">
          <el-input type="password" placeholder="请输入新密码" v-model="updPwd.pwdNewA" style="width: 70%;"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="updPwdShow = false">取消</el-button>
          <el-button type="primary" @click="updateUser">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {logout, updUserAjax} from '../../api'
  import {mapState, mapActions} from 'vuex'

  export default {
    data () {
      return {
        admin: '',
        onlyRead: false,
        countDialogVisible: false,
        updPwdShow: false,
        updPwd: {
          uuId: '',
          pwdOld: '',
          pwdNew: '',
          pwdNewA: ''
        },
        audio: new Audio('http://downsc.chinaz.net/Files/DownLoad/sound1/201706/8858.mp3'),
        warnTimes: 4,
        animationCount: false,
        offset: 80,
        warnIntervalId: null,
      }
    },

    computed: {
      ...mapState('order', [
        'orderStatus1Count',
        'orderPrintCount',
        'orderSendCount',
        'refundStatus0Count',
        'refundStatus1Count',
        'refundStatus2Count'
      ]),
      ...mapState('goods', ['gcShieldCount', 'increasestockVolumeCount']),

      countNumber () {
        return (
          this.gcShieldCount +
          this.increasestockVolumeCount +
          this.orderStatus1Count +
          this.orderPrintCount +
          this.orderSendCount +
          this.refundStatus0Count +
          this.refundStatus3Count
        )
      },

      refundStatus3Count () {
        return this.refundStatus1Count + this.refundStatus2Count
      },

      countNumbers () {
        return [
          {
            name: '上架商品',
            count: this.increasestockVolumeCount,
            path: '/goods/up',
          },
          {
            name: '评论管理',
            count: this.gcShieldCount,
            path: '/goods/comment/list',
          },
          {
            name: '订单列表',
            count: this.orderStatus1Count,
            path: '/order/list',
          },
          {
            name: '打印快递单',
            count: this.orderPrintCount,
            path: '/order/print/list',
          },
          {
            name: '快递发货',
            count: this.orderSendCount,
            path: '/order/send/list',
          },
          {
            name: '待审核退款',
            count: this.refundStatus0Count,
            path: '/afterSale/applyRefund/:apply',
          },
          {
            name: '待执行退款',
            count: this.refundStatus3Count,
            path: '/afterSale/executeRefund/:execute',
          },
        ]
      },
    },

    mounted () {
      this.getAdmin()
      PubSub.subscribe('addLabelSuccess', (msg, success) => {
        if (success) {
          this.$message.success(`添加标签成功`)
        } else {
          this.$message.error(`添加标签失败`)
        }
      })
      PubSub.subscribe('permissionDenied', () => this.$message.error(`权限不足`))
      PubSub.subscribe('123', (msg, data) => {
        this.$alert('未安装打印插件：<a href="https://maiji-static-images.oss-cn-beijing.aliyuncs.com/CLodop_Setup_for_Win32NT.exe">请点击安装</a>',
          '打印设置', {dangerouslyUseHTMLString: true})
      })
      PubSub.subscribe('456', (msg, data) => {
        this.$message.error(`打印出货单未找到指定型号打印机：【${data}】`)
      })
      PubSub.subscribe('789', (msg, data) => {
        this.$message.error(`打印快递单未找到指定型号打印机：【${data}】`)
      })
    },

    watch: {
      countNumber: function (newCount, oldCount) {
        console.log("+++++++clearInterval-0+" + this.warnIntervalId + "++++++++++++++++")
        clearInterval(this.warnIntervalId)
        if (newCount > oldCount)
          this.animationCount = true
          this.warnIntervalId = setInterval(() => {
            this.warnTimes--
            this.audio.play()
            console.log("+++++++++++++" + this.warnIntervalId + "+++++++++++++++++++")
          }, 2500)
      },

      warnIntervalId: function (value, old) {
        console.log(value, old)
        if (old) {
          console.log("+++++++clearInterval-1+" + this.warnIntervalId + "++++++++++++++++")
          clearInterval(old)
        }
      },

      warnTimes: function (value) {
        if (value == 0) {
          console.log("+++++++clearInterval-2wsw2se+" + this.warnIntervalId + "++++++++++++++++")
          clearInterval(this.warnIntervalId)
        }
      },

      refundStatus0Count (value) {
        if (value) {
          const notification = this.$notify({
            title: '待审核退款',
            type: 'warning',
            customClass: 'refundStatusCount',
            dangerouslyUseHTMLString: true,
            message: `<strong style="text-decoration: underline;">系统有 ${this.refundStatus0Count} 条待审核退款任务, 点击前往处理</strong>`,
            duration: 0,
            offset: 70,
            onClick: () => {
              notification.close()
              this.$router.push('/afterSale/applyRefund/:apply')
            }
          })
        }
      },

      refundStatus3Count (value) {
        if (value) {
          const notification = this.$notify({
            title: '待执行退款',
            type: 'warning',
            customClass: 'refundStatusCount',
            dangerouslyUseHTMLString: true,
            message: `<strong style="text-decoration: underline;">系统有 ${this.refundStatus3Count} 条待执行退款任务, 点击前往处理</strong>`,
            duration: 0,
            offset: 160,
            onClick: () => {
              notification.close()
              this.$router.push('/afterSale/executeRefund/:execute')
            }
          })
        }
      }
    },

    methods: {
      ...mapActions(['logoutAction']),

      // 修改用户密码
      async updateUser () {
        this.$refs.updPwdFrom.validate(async valid => {
          if (!valid) return this.$message.error(`添加密码失败，请确认添加规范`)
          if (this.updPwd.pwdNew != this.updPwd.pwdNewA)
            return this.$message.warning(`新密码两次输入不一致，请重试`)
          const result = await updUserAjax(this.updPwd)
          if (result.status != "SUCCESS")
            if (result.status == "PWDOLDERROR")
              return this.$message.error(`修改用户密码失败：原密码错误，请确认后重试`)
            else return this.$message.error(`修改用户密码失败，请稍后重试`)
          this.updPwdShow = false
          this.$message.success(`修改用户密码成功`)
        })
      },

      getAdmin () {
        let maijiUser = window.localStorage.getItem('maijiUser')
        if (! maijiUser) return
        maijiUser = JSON.parse(maijiUser)
        this.admin = maijiUser.name
        this.onlyRead = maijiUser.onlyRead
      },

      handleCommand (cmd) {
        if (cmd == 'logout')
          this.$confirm('注销登录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            const result = await logout()
            if (result.status == 'SUCCESS') {
              this.logoutAction()
              this.$router.replace({path: '/'})
            }
          })
        if (cmd == 'updPwd') {
          this.updPwdShow = true
          this.updPwd.uuId = JSON.parse(localStorage.getItem('maijiUser')).uuId
        }
      }
    },

    beforeDestroy() {
      clearInterval(this.warnIntervalId)
    }
  }
</script>

<style>
  .refundStatusCount {
    background-color: #ffa50073 !important;
  }

  .animationCount {
    animation: myCount 1s linear 0s 12;
  }

  @keyframes myCount {
    0% { opacity: 1;}
    100% { opacity: 0;}
  }

  .header_bg {
    background: url("./images/headerBg.png");
    background-size: 100% 100%;
    height: 100%;
  }

  .msgList {
    margin-top: 10px;
    margin-left: 30px;
    font-size: 20px;
  }
</style>
