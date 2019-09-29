import { getterTypes } from './types'

export default {
  [getterTypes.COMMENTS](state) {
    return state.comments
  },
  [getterTypes.FILE_KEY](state) {
    return state.fileKey
  },
}
