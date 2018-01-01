import { actionTypes, mutationTypes, getterTypes } from './types'
import firebase from '@/firebase'

export default {
  [actionTypes.LOAD_USER] (context, { uid }) {
    if (context.getters[getterTypes.USERS][uid]) {
      // It has been loaded already.
      return Promise.resolve()
    } else {
      return firebase
        .database()
        .ref(`/users/${uid}`)
        .once('value')
        .then(snapshot => {
          const user = snapshot.val()
          if (user) {
            context.commit(mutationTypes.UPDATE_USERS, {
              users: {
                [user.uid]: user
              }
            })
          }
          return Promise.resolve()
        })
    }
  },
  [actionTypes.LOAD_USERS] (context, { users }) {
    return Promise.all(
      Object.keys(users).map(uid => {
        return context.dispatch(actionTypes.LOAD_USER, { uid })
      })
    )
  }
}
