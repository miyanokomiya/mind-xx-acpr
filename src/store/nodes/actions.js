import { actionTypes, mutationTypes } from './types'

export default {
  [actionTypes.UPDATE_NODES] (context, { nodes }) {
    context.commit(mutationTypes.UPDATE_NODES, { nodes })
  }
}
