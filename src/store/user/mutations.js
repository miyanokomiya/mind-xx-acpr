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
      state.authorityLoading = false
    } else {
      state.user = null
      state.authorityLoading = true
    }
  },
  [mutationTypes.SET_AUTHORITY_LOADING] (state, val) {
    state.authorityLoading = val
  }
}
