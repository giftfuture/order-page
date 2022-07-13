<template>
  <el-container class="index-box">
    <el-aside width="asideWidth">
      <div class="logo">
        <img v-show="!isCollapse" src="./../assets/logo.png" alt="ELementUI" width="122" height="27">
      </div>
<!--      <menus :isCollapse="isCollapse"/>-->
    </el-aside>
    <el-container>
      <el-header>
        <headers/>
      </el-header>
      <el-main>
        <router-view v-if="isRouterAlive"/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// import Menus from '@/components/menus/menus'
import Headers from '@/components/header/header'

// import VueTaber from '@/components/vue-tabs/vue-tabs.js'
// import '@/components/vue-tabs/vue-tabs.css' // 导入默认style, 你可以复制出来进行定制修改
// import tabs from '@/components/vue-tabs/tabs.js'
// import Vue from 'vue/types/index'
// import Vue from 'vue'
// import App from '@/App' // 导入配置
// const vueTaber = new VueTaber({
//   tabs
// })
//
// Vue.use(VueTaber)
// // eslint-disable-next-line no-new
// new Vue({
//   el: '#app',
//   taber: vueTaber,
//   template: '<App/>',
//   components: {
//     App
//   }
// })
// export default VueTaber
export default {

  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  components: {
    /* Menus, */
    Headers
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  },
  computed: {
    isCollapse () {
      return this.$store.state.isCollapse
    },
    asideWidth () {
      return this.$store.state.isCollapse ? 'auto' : '200px'
    }
  }
}
</script>

<style lang="scss">
.index-box {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  .el-container{
    height: 100%;
    .el-main {
      height: 100%;
    }
  }
  .el-aside {
    background-color: #20222A;
    height: 100vh;
    min-height: 100%;
    .logo {
      background-color: #20222A;
      color: rgba(255,255,255,.8);
      text-align: center;
      height: 100px;
      padding-top: 16px;
      font-size: 16px;
      box-sizing: border-box;
      border-bottom: 1px solid gray;
    }
  }
  .el-header {
    border-bottom: 1px solid #f6f6f6;
    box-sizing: border-box;
    background-color: #fff;
    line-height: 60px;
  }
}
</style>
