import { getterTypes } from './types'

export default {
  [getterTypes.USERS] (state) {
    return state.users
  }
}
