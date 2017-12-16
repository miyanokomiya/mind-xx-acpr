import { actionTypes, mutationTypes } from './types'

export default {
  [actionTypes.UPDATE_NODES] (context, { nodes }) {
    context.commit(mutationTypes.UPDATE_NODES, { nodes })
  },
  [actionTypes.SET_SELECTED_NODES] (context, { selectedNodes }) {
    context.commit(mutationTypes.SET_SELECTED_NODES, { selectedNodes })
  },
  [actionTypes.CLEAR_SELECT] (context) {
    context.commit(mutationTypes.SET_SELECTED_NODES, {})
  }
}
