import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    nodes: {
      root: { x: 0, y: 0, text: '', children: [] }
    },
    selectedNodes: {}
  },
  modules: {},
  actions,
  mutations,
  getters
}
