import Vue from 'vue'
import { mutationTypes } from './types'

export default {
  [mutationTypes.UPDATE_COMMENTS](state, { comments }) {
    Object.keys(comments).forEach(key => {
      if (comments[key]) {
        Vue.set(state.comments, key, comments[key])
      } else {
        Vue.delete(state.comments, key)
      }
    })
  },
  [mutationTypes.SET_FILE_KEY](state, { fileKey }) {
    state.fileKey = fileKey
  },
  [mutationTypes.CLEAR_COMMENTS](state) {
    state.fileKey = null
    state.comments = {}
  },
}
