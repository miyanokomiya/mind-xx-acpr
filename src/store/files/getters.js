import { getterTypes } from './types'

export default {
  [getterTypes.FILES] (state) {
    return state.files
  },
  [getterTypes.FILE_AUTHORITIES] (state) {
    return state.fileAuthorities
  },
  [getterTypes.SHARED_FILES] (state) {
    return state.sharedFiles
  },
  [getterTypes.SHARED_FILE_AUTHORITIES] (state) {
    return state.sharedFileAuthorities
  }
}
