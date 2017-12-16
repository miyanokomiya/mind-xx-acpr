import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    leftDrawer: false
  },
  modules: {},
  actions,
  mutations,
  getters
}
