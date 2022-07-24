import Vue from 'vue'
import Router from 'vue-router'

// import Console from './views/back/Console.vue'

import SysLogin from './views/back/SysLogin.vue'
// import Echarts from './views/back/Echarts.vue'
// import NotFound from './views/back/NotFound.vue'
import OrderSort from './views/back/OrderSort.vue'
import OrderTab from './views/back/OrderTab.vue'
import OrderDict from './views/back/OrderDict.vue'
import Role from './views/back/Role.vue'
import Staff from './views/back/Staff.vue'
import SysIndex from './views/back/SysIndex.vue'
import Login from './views/Login.vue'
import OperLog from './views/OperLog.vue'
import Index from './views/Index.vue'
Vue.use(Router)
const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/syslogin',
      component: SysLogin
    },
    {
      path: '/sys',
      component: SysIndex
      // children: [
      //   {
      //     path: '/staff',
      //     name: 'staff',
      //     component: Staff
      //   }]
    },
    {
      path: '/sys/staff',
      name: 'staff',
      component: Staff
    },
    {
      path: '/sys/role',
      name: 'role',
      component: Role
    },
    {
      path: '/sys/ordersort',
      name: 'ordersort',
      component: OrderSort
    },
    {
      path: '/sys/dict',
      name: 'dict',
      component: OrderDict
    },
    {
      path: '/sys/tab',
      name: 'tab',
      component: OrderTab
    },
    // {
    //  path: '/sysback/staff',
    //  component: Staff

    // ,
    // {
    //   path: '/echarts',
    //   name: 'echarts',
    //   component: Echarts
    // },
    // {
    //   path: '/console',
    //   name: 'console',
    //   component: Console
    // }
    // ]
    // },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Index,
      children: [
        {
          path: '/operlog',
          name: 'operlog',
          component: OperLog
        }
      ]
    }

    // {
    //   path: '*',
    //   redirect: { path: '/404',
    //     component: NotFound
    //   }
    // }
  ]
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const LOGINURL = '/login'
  const sysLOGINURL = '/syslogin'
  const SYSBACK = 'sys'
  let url, staff, sysmanager
  url = to.path
  staff = sessionStorage.getItem('staff')
  sysmanager = sessionStorage.getItem('sys_usr')
  if (url === LOGINURL) {
    sessionStorage.removeItem('staff')
  }
  if (url === sysLOGINURL) {
    sessionStorage.removeItem('sys_usr')
  }
  // 判断是否登录
  if (!staff && url !== LOGINURL && url.indexOf(SYSBACK) < 0) {
    next()
    // next({ path: LOGINURL })
  } else if (!sysmanager && url !== sysLOGINURL && url.indexOf(SYSBACK) >= 0) {
    next()
    // next({ path: sysLOGINURL })
  } else {
    next()
  }
})

export default router
