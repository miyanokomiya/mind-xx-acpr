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
  }
}
