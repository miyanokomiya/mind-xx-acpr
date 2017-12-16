import Vue from 'vue'
import { mutationTypes } from './types'

export default {
  [mutationTypes.UPDATE_NODES] (state, { nodes }) {
    Object.keys(nodes).forEach(key => {
      Vue.set(state.nodes, key, nodes[key])
    })
  },
  [mutationTypes.SET_SELECTED_NODES] (state, { selectedNodes }) {
    state.selectedNodes = selectedNodes
  }
}
