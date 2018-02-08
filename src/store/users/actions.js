import { actionTypes, mutationTypes, getterTypes } from './types'
import firebase from '@/firebase'

export default {
  [actionTypes.LOAD_USER] (context, { uid }) {
    if (!context.rootState.user.user) {
      // unauthorized user cannot load users
      return Promise.resolve()
    }
    if (context.getters[getterTypes.USERS][uid]) {
      // It has been loaded already.
      return Promise.resolve()
    }

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
  },
  [actionTypes.LOAD_USER_FROM_EMAIL] (context, { email }) {
    if (!context.rootState.user.user) {
      // unauthorized user cannot load users
      return Promise.resolve()
    }
    const loadedUsers = context.getters[getterTypes.USERS]
    const loaded = Object.keys(loadedUsers).find(uid => {
      return loadedUsers[uid].email === email
    })
    if (loaded) {
      // It has been loaded already.
      return Promise.resolve()
    } else {
      return firebase
        .database()
        .ref('/users')
        .orderByChild('email')
        .equalTo(email)
        .once('value')
        .then(snapshot => {
          const users = snapshot.val()
          if (users) {
            context.commit(mutationTypes.UPDATE_USERS, {
              users
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
  },
  [actionTypes.LOAD_USERS_FROM_EMAIL] (context, { emailList }) {
    return Promise.all(
      emailList.map(email => {
        return context.dispatch(actionTypes.LOAD_USER_FROM_EMAIL, { email })
      })
    )
  }
}
