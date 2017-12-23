import { actionTypes, mutationTypes } from './types'
import firebase from '@/firebase'

export default {
  [actionTypes.LOAD_USER] (context) {
    context.commit(mutationTypes.SET_AUTHORITY_LOADING, true)
    firebase.auth().onAuthStateChanged(user => {
      context.commit(mutationTypes.SET_AUTHORITY_LOADING, true)
      if (user) {
        context.commit(mutationTypes.SET_USER, user)
        context.commit(mutationTypes.SET_AUTHORITY_LOADING, !user)
      } else {
        firebase
          .auth()
          .getRedirectResult()
          .then(result => {
            // The signed-in user info.
            context.commit(mutationTypes.SET_USER, result.user)
            context.commit(mutationTypes.SET_AUTHORITY_LOADING, !result.user)
          })
          .catch(error => {
            console.log(error.code, error.message)
          })
      }
    })
  },
  [actionTypes.SIGN_OUT] (context) {
    return new Promise((resolve, reject) => {
      context.commit(mutationTypes.SET_AUTHORITY_LOADING, true)
      firebase
        .auth()
        .signOut()
        .then(() => {
          // Sign-out successful.
          context.commit(mutationTypes.SET_USER, null)
          resolve()
        })
        .catch(error => {
          // An error happened.
          context.commit(mutationTypes.SET_USER, null)
          reject(error)
        })
    })
  }
}
