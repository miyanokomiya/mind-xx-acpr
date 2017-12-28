import Vue from 'vue'
import { mutationTypes } from './types'
import { createDefaultNodes, copyNode } from '@/utils/model'

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
    state.selectedNodes = Object.keys(state.selectedNodes).reduce((p, c) => {
      if (state.nodes[c]) {
        p[c] = true
      }
      return p
    }, {})
  },
  [mutationTypes.SET_SELECTED_NODES] (state, { selectedNodes = {} }) {
    state.selectedNodes = Object.keys(selectedNodes).reduce((p, c) => {
      if (selectedNodes[c]) {
        p[c] = true
      }
      return p
    }, {})
  },
  [mutationTypes.SET_FILE_KEY] (state, { fileKey }) {
    state.fileKey = fileKey
  },
  [mutationTypes.CLEAR_NODES] (state) {
    state.fileKey = null
    state.nodes = createDefaultNodes()
    state.selectedNodes = {}
    state.undoStacks = []
    state.redoStacks = []
  },
  [mutationTypes.SET_INITIAL_LOADING] (state, { initialLoading }) {
    state.initialLoading = initialLoading
  },
  [mutationTypes.PUSH_UNDO_STACK] (state, { nodes }) {
    const current = Object.keys(nodes).reduce((p, c) => {
      p[c] = state.nodes[c] ? copyNode(state.nodes[c]) : null
      return p
    }, {})
    state.undoStacks.push(Object.assign({}, current))
    state.redoStacks = []
  },
  [mutationTypes.POP_UNDO_STACK] (state) {
    if (state.undoStacks.length > 0) {
      const stack = state.undoStacks.pop()
      const current = Object.keys(stack).reduce((p, c) => {
        p[c] = state.nodes[c] ? copyNode(state.nodes[c]) : null
        return p
      }, {})
      state.redoStacks.push(current)
    }
  },
  [mutationTypes.POP_REDO_STACK] (state) {
    if (state.redoStacks.length > 0) {
      const stack = state.redoStacks.pop()
      const current = Object.keys(stack).reduce((p, c) => {
        p[c] = state.nodes[c] ? copyNode(state.nodes[c]) : null
        return p
      }, {})
      state.undoStacks.push(current)
    }
  },
  [mutationTypes.CLEAR_STACKS] (state) {
    state.undoStacks = []
    state.redoStacks = []
  }
}
