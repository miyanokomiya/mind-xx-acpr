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
  },
  [getterTypes.FILE_FROM_KEY]: state => ({ fileKey }) => {
    return state.sharedFiles[fileKey] || state.files[fileKey] || null
  },
  [getterTypes.FILE_AUTHORITY_FROM_KEY]: state => ({ fileKey }) => {
    return (
      state.sharedFileAuthorities[fileKey] ||
      state.fileAuthorities[fileKey] ||
      null
    )
  },
  [getterTypes.IS_MY_FILE_FROM_KEY]: state => ({ fileKey }) => {
    return fileKey in state.files
  }
}
