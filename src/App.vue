<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
#app {
  width: 100%;
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 12px !important;
  font-family:"Microsoft YaHei",Arial,Helvetica,sans-serif,"宋体" !important;
}
html,body {
  font-size: 12px !important;
  font-family:"Microsoft YaHei",Arial,Helvetica,sans-serif,"宋体" !important;
}
.commonDelete {
  text-decoration:line-through;
}
.el-form-item{
  font-size: 12px !important;
  font-family:"Microsoft YaHei",Arial,Helvetica,sans-serif,"宋体" !important;
}
.el-button{
  padding: 10px 20px !important;
}
/*.commonBody {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 12px;
  font-family:"Microsoft YaHei",Arial,Helvetica,sans-serif,"宋体";
  &_title {
    font-size: 20px;
    font-weight: 600px;
  }
}*/
</style>
