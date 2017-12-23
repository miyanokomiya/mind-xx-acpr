import { getterTypes } from './types'

export default {
  [getterTypes.USER] (state, getters) {
    return state.user
  },
  [getterTypes.AUTHORITY_LOADING] (state, getters) {
    return state.authorityLoading
  }
}
