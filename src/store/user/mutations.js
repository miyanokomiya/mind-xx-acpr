import { mutationTypes } from './types'

export default {
  [mutationTypes.SET_USER] (state, user) {
    if (user) {
      state.user = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      }
    } else {
      state.user = null
    }
  }
}
