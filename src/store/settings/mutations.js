import { mutationTypes } from './types'

export default {
  [mutationTypes.SET_NODE_COLOR] (state, { nodeColor }) {
    state.nodeColor = nodeColor
  },
  [mutationTypes.SET_TEXT_COLOR] (state, { textColor }) {
    state.textColor = textColor
  }
}
