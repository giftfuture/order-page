<template>
  <el-container class="index-box">
    <el-aside width="asideWidth">
      <div class="logo">
        <img v-show="!isCollapse" src="./../assets/logo.png" alt="ELementUI" style="padding-top: 0px;" width="122" height="122">
      </div>
<!--      <menus :isCollapse="isCollapse"/>-->
    </el-aside>
    <el-container>
      <el-header style="height: 30px;">
        <headers/>
      </el-header>
      <el-main>
        <router-view v-if="isRouterAlive"/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Headers from '@/components/header/header'

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
      return this.$store.state.isCollapse ? 'auto' : '10px'
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
    .el-header {
      border-bottom: 1px solid #f6f6f6;
      box-sizing: border-box;
      background-color: #fff;
      line-height: 30px;
    }
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
      padding-top: 0px;
      font-size: 16px;
      box-sizing: border-box;
      border-bottom: 1px solid gray;
    }
  }

  .el-card__body, .el-main{
    padding-top: 0px;
  }
}
</style>
