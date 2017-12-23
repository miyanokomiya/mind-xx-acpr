import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    user: {
      uid: null,
      displayName: null,
      email: null,
      photoURL: null
    },
    authorityLoading: true
  },
  modules: {},
  actions,
  mutations,
  getters
}
