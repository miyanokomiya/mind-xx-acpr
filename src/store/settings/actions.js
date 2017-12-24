import { actionTypes, mutationTypes } from './types'

export default {
  [actionTypes.SET_NODE_COLOR] (context, { nodeColor }) {
    context.commit(mutationTypes.SET_NODE_COLOR, { nodeColor })
  },
  [actionTypes.SET_TEXT_COLOR] (context, { textColor }) {
    context.commit(mutationTypes.SET_TEXT_COLOR, { textColor })
  }
}
