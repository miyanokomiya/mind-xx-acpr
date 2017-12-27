import { getterTypes } from './types'

export default {
  [getterTypes.NODES] (state) {
    return state.nodes
  },
  [getterTypes.SELECTED_NODES] (state) {
    return state.selectedNodes
  },
  [getterTypes.FILE_KEY] (state) {
    return state.fileKey
  },
  [getterTypes.INITIAL_LOADING] (state) {
    return state.initialLoading
  }
}
