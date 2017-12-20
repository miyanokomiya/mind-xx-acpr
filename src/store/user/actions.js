import { actionTypes, mutationTypes } from './types'
import firebase from '@/firebase'

export default {
  [actionTypes.LOAD_USER] (context) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        context.commit(mutationTypes.SET_USER, user)
      } else {
        firebase
          .auth()
          .getRedirectResult()
          .then(result => {
            // The signed-in user info.
            context.commit(mutationTypes.SET_USER, result.user)
          })
          .catch(error => {
            console.log(error.code, error.message)
          })
      }
    })
  },
  [actionTypes.SIGN_OUT] (context) {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        context.commit(mutationTypes.SET_USER, null)
      })
      .catch(error => {
        // An error happened.
        console.log(error)
        context.commit(mutationTypes.SET_USER, null)
      })
  }
}
