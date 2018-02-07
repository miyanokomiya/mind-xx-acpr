import Vue from 'vue'
import Vuex from 'vuex'
import layouts from './layouts'
import nodes from './nodes'
import comments from './comments'
import user from './user'
import users from './users'
import files from './files'
import settings from './settings'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  namespaced: true,
  state: {},
  modules: {
    files,
    layouts,
    nodes,
    comments,
    settings,
    user,
    users
  },
  mutations: {}
})
