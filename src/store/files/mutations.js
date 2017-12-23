import Vue from 'vue'
import { mutationTypes } from './types'

export default {
  [mutationTypes.UPDATE_FILES] (state, { files }) {
    Object.keys(files).forEach(key => {
      if (files[key]) {
        Vue.set(state.files, key, files[key])
      } else {
        Vue.delete(state.files, key)
      }
    })
  },
  [mutationTypes.CLEAR_FILES] (state) {
    state.files = {}
    state.fileAuthorities = {}
  },
  [mutationTypes.UPDATE_FILE_AUTHORITIES] (state, { fileAuthorities }) {
    Object.keys(fileAuthorities).forEach(key => {
      if (fileAuthorities[key]) {
        Vue.set(state.fileAuthorities, key, fileAuthorities[key])
      } else {
        Vue.delete(state.fileAuthorities, key)
      }
    })
  }
}
