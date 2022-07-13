<template>
<div class ="vux-tab-item" >
<el-form :model="sendForm" :rules="rules" ref="sendForm" class="login-form">
  <el-form-item prop="createBy">
    <el-input
      v-model="sendForm.createBy"
      autocomplete="off"
      placeholder="创建人"
      prefix-icon="el-icon-goods">
    </el-input>
  </el-form-item>
  <el-form-item prop="beginTime">
    <el-input :type="textType"
              v-model="sendForm.beginTime"
              @keyup.native.enter="login('beginTime')"
              autocomplete="off"
              placeholder="日期"
              prefix-icon="el-icon-time">
      <i slot="suffix" class="el-input__icon el-icon-view btn-eye" @click="changeType"></i>
    </el-input>
  </el-form-item>
  <el-form-item prop="endTime">
    <el-input :type="textType"
              v-model="sendForm.endTime"
              @keyup.native.enter="login('endTime')"
              autocomplete="off"
              placeholder="日期"
              prefix-icon="el-icon-time">
      <i slot="suffix" class="el-input__icon el-icon-view btn-eye" @click="changeType"></i>
    </el-input>
  </el-form-item>
  <el-input :type="textType"
            v-model="sendForm.sendContent"
            @keyup.native.enter="login('sendContent')"
            autocomplete="off"
            placeholder="发货"
            prefix-icon="el-icon-goods">
    <i slot="suffix" class="el-input__icon el-icon-view btn-eye" @click="changeType"></i>
  </el-input>
  <el-input :type="textType"
            v-model="sendForm.status"
            @keyup.native.enter="login('status')"
            autocomplete="off"
            placeholder="状态"
            prefix-icon="el-icon-goods">
    <i slot="suffix" class="el-input__icon el-icon-view btn-eye" @click="changeType"></i>
  </el-input>
  <el-input :type="textType"
            v-model="sendForm.ticketStatus"
            @keyup.native.enter="login('ticketStatus')"
            autocomplete="off"
            placeholder="钱票"
            prefix-icon="el-icon-goods">
    <i slot="suffix" class="el-input__icon el-icon-view btn-eye" @click="changeType"></i>
  </el-input>
  <el-input :type="textType"
            v-model="sendForm.remark"
            @keyup.native.enter="login('remark')"
            autocomplete="off"
            placeholder="备注"
            prefix-icon="el-icon-goods">
    <i slot="suffix" class="el-input__icon el-icon-view btn-eye" @click="changeType"></i>
  </el-input>
  <el-form-item v-show="showMsg" style="margin-bottom:0;">
    <span class="text-danger">提示：用户名或密码错误，请重试！</span>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="login('sendForm')" class="login-btn" v-loading="loading">搜索</el-button>
  </el-form-item>
</el-form>
</div>
</template>
<script>
export default {
  data () {
    return {
      sendForm: {

      },
      rules: {
      },
      loading: false,
      showMsg: false

    }
  },
  methods: {
    search (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$http.post('/order/list', this.sendForm).then((res) => {
            if (res.data.code === 0) {
              // 延迟两秒，演示登录按钮加载效果
              setTimeout(() => {
                this.loading = false
                // sessionStorage.setItem('staff', JSON.stringify(this.sendForm))
                this.$router.replace({ path: '/order/list' })
              }, 2000)
            } else {
              this.loading = false
              this.showMsg = true
            }
          })
        } else {
          console.log('search failed')
          return false
        }
      })
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
