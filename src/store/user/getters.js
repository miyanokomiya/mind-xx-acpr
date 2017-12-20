import { getterTypes } from './types'

export default {
  [getterTypes.USER] (state, getters) {
    return state.user
  }
}
