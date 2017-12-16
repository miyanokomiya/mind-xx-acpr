import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    nodes: {
      root: { text: '', children: [] }
    },
    selectedNodes: {}
  },
  modules: {},
  actions,
  mutations,
  getters
}
