import Vue from 'vue'
import Vuex from 'vuex'
import { queryAllStaf, loadBySort } from '@/api/index.js'

Vue.use(Vuex)

export default new Vuex.Store({
  orderLogs: [
    {
      name: '名称',
      value: 'tester'
    },
    {
      name: '创建人',
      value: '张三'
    },
    {
      name: '描述',
      value: '这是描述'
    },
    {
      name: '耗时',
      value: 1
    }
  ],

  exchangeSort: [],
  state: {
    isCollapse: false,
    allStaf: [],
    statusDictObj: {
      'FH': [],
      'KP': [],
      'DH': [],
      'DK': [],
      'JH': [],
      'JG': [],
      'zh': []
    },
    ticketStatusDictObj: [],
    sortMap: new Map()
  },
  mutations: {
    switchCollapse (state) {
      state.isCollapse = !state.isCollapse
    },
    SET_All_STAF (state, data) {
      state.allStaf = data || []
    },
    SET_SORT (state, data) {
      try {
        const type = data.type
        state.statusDictObj[type] = data.data.statusDict ? JSON.parse(data.data.statusDict) : []
        state.ticketStatusDictObj[type] = data.data.ticketStatusDict ? JSON.parse(data.data.ticketStatusDict) : []
        state.sortMap.set(type, state.statusDictObj[type])
        console.log(state.statusDictObj, state.statusDictObj[type], type, '9999')
      } catch (err) {
      }
    }
  },
  actions: {
    async handleQueryAllStaf ({ commit, dispatch, state }, params) {
      queryAllStaf().then(res => {
        console.log(res, 'res handleQueryAllStaf')
        if (res.code === 0) {
          commit('SET_All_STAF', res.data)
        }
      })
    },
    // 获取订单、发票资料状态类型
    async handleLoadBySort ({ commit, dispatch, state }, params) {
      if (state.sortMap.has(params)) return
      loadBySort(params === 'ZH' ? '' : params).then(res => {
        console.log(res, 'res handleLoadBySort')
        if (res.code === 0) {
          if (params === 'SJJH') {
            this.exchangeSort = res.data.statusDict ? JSON.parse(res.data.statusDict) : []
            return
          }
          commit('SET_SORT', { data: res.data, type: params })
        }
      }).catch(err => {
        console.log(err, 'err')
      })
    }
  },
  getters: {
    getAllStaf (state) {
      return state.allStaf
    }
  }
})
