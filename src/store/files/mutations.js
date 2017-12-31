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
  [mutationTypes.UPDATE_FILE_AUTHORITIES] (state, { fileAuthorities }) {
    Object.keys(fileAuthorities).forEach(key => {
      if (fileAuthorities[key]) {
        Vue.set(state.fileAuthorities, key, fileAuthorities[key])
      } else {
        Vue.delete(state.fileAuthorities, key)
      }
    })
  },
  [mutationTypes.UPDATE_SHARED_FILES] (state, { sharedFiles }) {
    Object.keys(sharedFiles).forEach(key => {
      if (sharedFiles[key]) {
        Vue.set(state.sharedFiles, key, sharedFiles[key])
      } else {
        Vue.delete(state.sharedFiles, key)
      }
    })
  },
  [mutationTypes.UPDATE_SHARED_FILE_AUTHORITIES] (
    state,
    { sharedFileAuthorities }
  ) {
    Object.keys(sharedFileAuthorities).forEach(key => {
      if (sharedFileAuthorities[key]) {
        Vue.set(state.sharedFileAuthorities, key, sharedFileAuthorities[key])
      } else {
        Vue.delete(state.sharedFileAuthorities, key)
      }
    })
  },
  [mutationTypes.CLEAR_FILES] (state) {
    state.files = {}
    state.fileAuthorities = {}
    state.sharedFiles = {}
    state.sharedFileAuthorities = {}
  },
  [mutationTypes.SET_PERMISSION_DENIED] (state, { permissionDenied }) {
    state.permissionDenied = permissionDenied
  }
}
