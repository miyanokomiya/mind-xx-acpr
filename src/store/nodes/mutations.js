import Vue from 'vue'
import { mutationTypes } from './types'

export default {
  [mutationTypes.UPDATE_NODES] (state, { nodes }) {
    Object.keys(nodes).forEach(key => {
      Vue.set(state.nodes, key, nodes[key])
    })
  }
}
