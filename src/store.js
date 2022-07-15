import Vue from 'vue'
import Vuex from 'vuex'
import { queryAllStaf } from '@/api/send/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isCollapse: false,
    allStaf: []
  },
  mutations: {
    switchCollapse (state) {
      state.isCollapse = !state.isCollapse
    },
    SET_All_STAF (state, data) {
      state.allStaf = data || []
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
    }
  },
  getters: {
    getAllStaf (state) {
      return state.allStaf
    }
  }
})
