import { actionTypes, mutationTypes, getterTypes } from './types'
import firebase from '@/firebase'

export default {
  [actionTypes.LOAD_USER] (context) {
    context.commit(mutationTypes.SET_AUTHORITY_LOADING, true)
    return firebase.auth().onAuthStateChanged(user => {
      context.commit(mutationTypes.SET_AUTHORITY_LOADING, true)
      if (user) {
        context.commit(mutationTypes.SET_USER, user)
        context.commit(mutationTypes.SET_AUTHORITY_LOADING, false)
        // update the information of my account to be latest allways
        return firebase
          .database()
          .ref(`/users/${user.uid}`)
          .set(context.getters[getterTypes.USER])
      } else {
        return firebase
          .auth()
          .getRedirectResult()
          .then(result => {
            // The signed-in user info.
            context.commit(mutationTypes.SET_USER, result.user)
            context.commit(mutationTypes.SET_AUTHORITY_LOADING, false)
          })
          .catch(error => {
            context.commit(mutationTypes.SET_USER, null)
            context.commit(mutationTypes.SET_AUTHORITY_LOADING, false)
            console.log(error)
            return Promise.reject(error)
          })
      }
    })
  },
  [actionTypes.SIGN_OUT] (context) {
    return new Promise((resolve, reject) => {
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
  },
  [actionTypes.DELETE_USER] (context) {
    const user = firebase.auth().currentUser
    return user.delete()
  }
}
