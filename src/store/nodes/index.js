import actions from './actions'
import mutations from './mutations'
import getters from './getters'

import { ROOT_NODE } from '@/constants'
import { createNode } from '@/utils/model'

export default {
  namespaced: true,
  state: {
    fileKey: null,
    nodes: {
      [ROOT_NODE]: createNode()
    },
    selectedNodes: {},
    initialLoading: true
  },
  modules: {},
  actions,
  mutations,
  getters
}
