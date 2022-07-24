<template>
  <div class="login-box">
    <el-form :model="sysLoginForm" :rules="rules" ref="sysLoginForm" class="login-form">
      <h3 class="title">系 统 登 录</h3>
      <el-form-item prop="loginName">
        <el-input
          v-model="sysLoginForm.loginName"
          autocomplete="off"
          placeholder="账 号"
          prefix-icon="el-icon-goods">
        </el-input>
      </el-form-item>
      <el-form-item prop="passwd">
        <el-input :type="textType"
          v-model="sysLoginForm.passwd"
          @keyup.native.enter="login('sysLoginForm')"
          autocomplete="off"
          placeholder="密 码"
          prefix-icon="el-icon-time">
          <i slot="suffix" class="el-input__icon el-icon-view btn-eye" @click="changeType"></i>
        </el-input>
      </el-form-item>
<!--      <el-form-item v-show="showMsg" style="margin-bottom:0;">
        <span class="text-danger">提示：用户名或密码错误，请重试！</span>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="login('sysLoginForm')" class="login-btn" v-loading="loading">登 录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { syslogin } from '@/api'

export default {
  data () {
    return {
      sysLoginForm: {
        loginName: '',
        passwd: ''
      },
      rules: {
        loginName: [
          { required: true, message: '登录名不可为空！', trigger: 'blur' }
        ],
        passwd: [
          { required: true, message: '密码不可为空！ ', trigger: 'blur' }
        ]
      },
      loading: false,
      showMsg: false,
      textType: 'password'
    }
  },
  methods: {
    login (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          // console.log(this.sysLoginForm)
          syslogin(this.sysLoginForm)
            .then((res) => {
              console.log(res)
              if (res.code === 0) {
                // 延迟两秒，演示登录按钮加载效果
                setTimeout(() => {
                  this.loading = false
                  sessionStorage.setItem('sys_usr', JSON.stringify(this.sysLoginForm))
                  this.$router.replace({ path: '/sys/' })
                }, 2000)
              } else {
                this.loading = false
                this.showMsg = true
              }
            })
        } else {
          console.log('login failed')
          return false
        }
      })
    },
    changeType () {
      this.textType = (this.textType === 'password' ? 'text' : 'password')
    }
  }
}
</script>

<style lang="scss" scoped>
.login-box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #20222A;
  .login-form {
    border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #f5f5f5;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 5px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .btn-eye {
      cursor: pointer;
    }
    .text-danger {
      color: #F56C6C;
    }
    .login-btn {
      margin: 35px 0 10px 0;
      width: 100%;
    }
  }
}

</style>
