import Vue from 'vue'
import { mutationTypes } from './types'

export default {
  [mutationTypes.UPDATE_USERS] (state, { users }) {
    Object.keys(users).forEach(key => {
      if (users[key]) {
        Vue.set(state.users, key, users[key])
      } else {
        Vue.delete(state.users, key)
      }
    })
  }
}
