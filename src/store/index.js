import Vue from 'vue'
import Vuex from 'vuex'
import layouts from './layouts'
import nodes from './nodes'
import user from './user'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  namespaced: true,
  state: {},
  modules: {
    layouts,
    nodes,
    user
  },
  mutations: {}
})
