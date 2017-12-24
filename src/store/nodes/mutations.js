import Vue from 'vue'
import { mutationTypes } from './types'
import { createDefaultNodes } from '@/utils/model'

export default {
  [mutationTypes.UPDATE_NODES] (state, { nodes }) {
    Object.keys(nodes).forEach(key => {
      if (nodes[key]) {
        Vue.set(state.nodes, key, nodes[key])
      } else {
        Vue.delete(state.nodes, key)
      }
    })
    if (Object.keys(state.nodes).length === 0) {
      state.nodes = createDefaultNodes()
    }
  },
  [mutationTypes.SET_SELECTED_NODES] (state, { selectedNodes = {} }) {
    state.selectedNodes = selectedNodes
  },
  [mutationTypes.SET_FILE_KEY] (state, { fileKey }) {
    state.fileKey = fileKey
  },
  [mutationTypes.CLEAR_NODES] (state) {
    state.fileKey = null
    state.nodes = createDefaultNodes()
    state.selectedNodes = {}
  }
}
