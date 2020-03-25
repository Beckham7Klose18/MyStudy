<template>
  <el-row class="background">
    <div class="parent">
      <div class="child">
        <div class="title" style="height:120px">
          <img
            src="./container/images/maijiLogo.png"
            width="100px"
            style="vertical-align: middle; margin-top:-6%"
            alt
            height="100%"
          />
          <span
            style="font-size:50px;font-family:Source Han Sans CN;font-weight:400;color:#ff8b0c; line-height:120px"
          >麦吉减肥法</span>
        </div>
        <el-row style="width:100%;">
          <el-col :span="12" style="text-align: center;">
            <img src="./container/images/maijiBC.png" width="500px" style="padding-top:10%"/>
          </el-col>
          <el-col :span="8" :offset="1"
                  style="margin-top: 60px; background-color:rgba(174, 188, 201,.1); box-shadow:-5px -5px 10px #ccc;">
            <el-form
              ref="loginFrom"
              class="login-container"
              label-position="left"
              label-width="0px"
              v-loading="loading"
              :model="loginForm"
            >
              <h3 class="login_title" style="color:#128BF1; margin-bottom:15%;margin-top:5%">登录账号</h3>
              <el-form-item prop="name" :rules="[{required: 'true', message: '账号不能为空'}]">
                <div style=" margin:0 20%; position: relative;   border-bottom: 1px solid #cccccc;">
                  <img
                    src="./container/images/user.png"
                    style=" position: absolute;top: 31%;left: 3%;"
                    alt
                  />
                  <el-input
                    class="input"
                    type="text"
                    v-model="loginForm.name"
                    placeholder="请输入账号"
                    style="width:90%; padding-left:10%"
                  />
                </div>
              </el-form-item>
              <el-form-item prop="pwd" :rules="[{required: 'true', message: '密码不能为空'}]">
                <div style=" margin:0 20%; position: relative;   border-bottom: 1px solid #cccccc;">
                  <img
                    src="./container/images/password.png"
                    style=" position: absolute;top: 31%;left: 3%;"
                    alt
                  />
                  <el-input
                    class="input"
                    type="password"
                    v-model="loginForm.pwd"
                    placeholder="请输入密码"
                    style="width:90%; padding-left:10%"
                  />
                </div>
              </el-form-item>
              <el-form-item style="width: 100%;text-align:center">
                <el-button
                  type="primary"
                  style="width:40% ;margin-top:15%;margin-bottom:2%"
                  @click="submitClick"
                >登录
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-row>
</template>

<script>
  import {login} from '../api'
  import {mapActions} from 'vuex'

  export default {
    data () {
      return {
        loginForm: {
          name: '',
          pwd: '',
          // name: 'Beckham7',
          // pwd: '123456'
        },
        checked: true,
        loading: false
      }
    },

    methods: {
      ...mapActions(['loginAction']),

      async submitClick () {
        this.$refs.loginFrom.validate(async valid => {
          if (valid) {
            this.loading = true
            const formData = new FormData()
            formData.append('name', this.loginForm.name)
            formData.append('pwd', this.loginForm.pwd)
            const result = await login(formData)
            if (result.status == 'SUCCESS') {
              this.loginAction(result.data)
              this.$router.replace('/home')
              this.$message.success(`登录成功！`)
            } else {
              this.$message.error(result.message)
            }
          } else {
            this.$message.error(`登录失败！`)
          }
          this.loading = false
        })
      }
    }
  }
</script>

<style>
  .background {
    /*background: url("./container/images/BgC.png");*/
    background: url("./container/images/123.png");
    background-size: 100% 100%;
    height: 110%;
  }

  .parent {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center; /* 水平方向 居中*/
    align-items: center; /* 垂直方向 居中*/
  }

  .child {
    position: relative;
    width: 80%;
    height: 80%;
    display: flex;
    /* justify-content: center; 水平方向 居中 */
    align-items: center; /* 垂直方向 居中*/
  }

  .parent .child .login-container {
    text-align: center;
  }

  .parent .child .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

  .parent .child .el-input__inner {
    outline: none;
    border: none;
    border-radius: 0;
    background: transparent;
  }

  .parent .child .title {
    position: absolute;
    top: 3%;
    left: 3%;
  }
</style>
