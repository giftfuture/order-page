import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import Utils from './common/utils'
import 'element-ui/lib/theme-chalk/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
// import './mock.js'
import 'font-awesome/css/font-awesome.css'

/// /////////////////////////////////////////////////////
// 引用axios，并设置基础URL为后端服务api地址
// 配置后端的访问地址
axios.defaults.baseURL = 'http://localhost:8888/'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
// 将API方法绑定到全局
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$http = axios
Vue.prototype.Utils = Utils
Vue.directive('focus', function (el) {
  el.focus()
  el.children[0].focus()
})
Vue.filter('handleValue', (keys) => {
  // const keyArr = keys.split(',')
  // console.log(this.$store.state.statusDict, 'this.$store.state.statusDict')
  // const data = keyArr.map(key => {
  //   return this.$store.state.statusDict[key]
  // })
  // console.log(data, 'data====')
  return keys + '111333'
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

/// /////////////////////////////////////////////////////
