import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    nodeColor: '#B3E5FC',
    textColor: '#000000'
  },
  modules: {},
  actions,
  mutations,
  getters
}
