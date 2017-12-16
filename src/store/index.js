import Vue from 'vue'
import Vuex from 'vuex'
import layouts from './layouts'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  namespaced: true,
  state: {},
  modules: {
    layouts
  },
  mutations: {}
})
