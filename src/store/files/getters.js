import { getterTypes } from './types'

export default {
  [getterTypes.FILES] (state) {
    return state.files
  },
  [getterTypes.FILE_AUTHORITIES] (state) {
    return state.fileAuthorities
  }
}
