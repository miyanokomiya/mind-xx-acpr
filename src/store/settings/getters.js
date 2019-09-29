import { getterTypes } from './types'

export default {
  [getterTypes.NODE_COLOR](state) {
    return state.nodeColor
  },
  [getterTypes.TEXT_COLOR](state) {
    return state.textColor
  },
}
