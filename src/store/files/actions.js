import { actionTypes, mutationTypes, getterTypes } from './types'
import firebase from '@/firebase'
import { createFile } from '@/utils/model'

export default {
  [actionTypes.LOAD_FILE] (context, { key }) {
    // reset permission status as first
    firebase
      .database()
      .ref('/file_authorities')
      .off()
    context.commit(mutationTypes.SET_PERMISSION_DENIED, {
      permissionDenied: false
    })
    // start loading
    let isMyFile = false
    let promise
    if (firebase.auth().currentUser) {
      const uid = firebase.auth().currentUser.uid
      promise = firebase
        .database()
        .ref(`/work_spaces/${uid}/files/${key}`)
        .once('value')
        .then(snapshot => {
          isMyFile = snapshot.exists()
          return Promise.resolve()
        })
    } else {
      promise = Promise.resolve()
    }
    return promise.then(() => {
      // watch the authority
      firebase
        .database()
        .ref(`/file_authorities/${key}`)
        .on(
          'value',
          snapshot => {
            context.commit(mutationTypes.SET_PERMISSION_DENIED, {
              permissionDenied: false
            })
            const fileAuthority = snapshot.val()
            if (isMyFile) {
              context.commit(mutationTypes.UPDATE_FILE_AUTHORITIES, {
                fileAuthorities: {
                  [key]: fileAuthority
                }
              })
            } else {
              context.commit(mutationTypes.UPDATE_SHARED_FILE_AUTHORITIES, {
                sharedFileAuthorities: {
                  [key]: fileAuthority
                }
              })
            }
          },
          e => {
            // if enter this route, '.on' is expired
            context.commit(mutationTypes.SET_PERMISSION_DENIED, {
              permissionDenied: true
            })
          }
        )
      firebase
        .database()
        .ref(`/files/${key}`)
        .once('value')
        .then(snapshot => {
          const file = snapshot.val()
          if (isMyFile) {
            context.commit(mutationTypes.UPDATE_FILES, {
              files: {
                [key]: file
              }
            })
          } else {
            context.commit(mutationTypes.UPDATE_SHARED_FILES, {
              sharedFiles: {
                [key]: file
              }
            })
          }
        })
        .catch(e => {
          context.commit(mutationTypes.SET_PERMISSION_DENIED, {
            permissionDenied: true
          })
          return Promise.resolve()
        })
    })
  },
  [actionTypes.LOAD_FILES] (context, payload) {
    context.commit(mutationTypes.CLEAR_FILES)

    const uid = firebase.auth().currentUser.uid
    firebase
      .database()
      .ref(`/work_spaces/${uid}`)
      .once('value')
      .then(snapshot => {
        const workSpace = snapshot.val()
        if (!workSpace) {
          return
        }
        const fileKeys = workSpace['files'] || {}
        const shredFileKeys = workSpace['invited_files'] || {}
        Object.keys(fileKeys).forEach(key => {
          firebase
            .database()
            .ref(`/file_authorities/${key}`)
            .once('value')
            .then(snapshot => {
              const fileAuthority = snapshot.val()
              context.commit(mutationTypes.UPDATE_FILE_AUTHORITIES, {
                fileAuthorities: {
                  [key]: fileAuthority
                }
              })
            })
          firebase
            .database()
            .ref(`/files/${key}`)
            .once('value')
            .then(snapshot => {
              const file = snapshot.val()
              context.commit(mutationTypes.UPDATE_FILES, {
                files: {
                  [key]: file
                }
              })
            })
        })
        Object.keys(shredFileKeys).forEach(key => {
          firebase
            .database()
            .ref(`/file_authorities/${key}`)
            .once('value')
            .then(snapshot => {
              const fileAuthority = snapshot.val()
              context.commit(mutationTypes.UPDATE_SHARED_FILE_AUTHORITIES, {
                sharedFileAuthorities: {
                  [key]: fileAuthority
                }
              })
            })
          firebase
            .database()
            .ref(`/files/${key}`)
            .once('value')
            .then(snapshot => {
              const file = snapshot.val()
              context.commit(mutationTypes.UPDATE_SHARED_FILES, {
                sharedFiles: {
                  [key]: file
                }
              })
            })
        })
      })
  },
  [actionTypes.UPDATE_FILES] (context, { files = {} }) {
    const updates = Object.keys(files).reduce((p, c) => {
      p[`/files/${c}`] = files[c]
      return p
    }, {})
    firebase
      .database()
      .ref()
      .update(updates)
      .then(() => {
        context.commit(mutationTypes.UPDATE_FILES, { files })
      })
  },
  [actionTypes.CREATE_FILE] (context, { file = {} }) {
    const uid = firebase.auth().currentUser.uid
    // get new key
    const fileKey = firebase
      .database()
      .ref()
      .child('file_authorities')
      .push().key
    // create the authority setting at first
    firebase
      .database()
      .ref(`/file_authorities/${fileKey}/users/${uid}`)
      .set({
        write: true,
        owner: true
      })
      .then(() => {
        // local commit the authority
        context.commit(mutationTypes.UPDATE_FILE_AUTHORITIES, {
          fileAuthorities: {
            [fileKey]: {
              users: {
                [uid]: {
                  write: true,
                  owner: true
                }
              }
            }
          }
        })
        // create the file
        const newFile = Object.assign({}, createFile(file), {
          created: firebase.database.ServerValue.TIMESTAMP,
          updated: firebase.database.ServerValue.TIMESTAMP
        })
        const updates = {}
        updates[`/files/${fileKey}`] = newFile
        updates[`/work_spaces/${uid}/files/${fileKey}`] = true
        return firebase
          .database()
          .ref()
          .update(updates)
      })
      .then(() => {
        // reload the file
        return firebase
          .database()
          .ref(`/files/${fileKey}`)
          .once('value')
      })
      .then(snapshot => {
        context.commit(mutationTypes.UPDATE_FILES, {
          files: {
            [fileKey]: snapshot.val()
          }
        })
      })
  },
  [actionTypes.DELETE_FILES] (context, { files }) {
    const uid = firebase.auth().currentUser.uid
    // this operation triggers cloud functions to delete files
    const updates = Object.keys(files).reduce((p, c) => {
      p[`/work_spaces/${uid}/files/${c}`] = null
      return p
    }, {})
    firebase
      .database()
      .ref()
      .update(updates)
      .then(() => {
        // commit
        context.commit(mutationTypes.UPDATE_FILES, { files })
        return Promise.resolve()
      })
  },
  [actionTypes.INVITE_USER] (context, { email, fileKey, readOnly }) {
    const key = firebase
      .database()
      .ref()
      .child('file_invitations')
      .push().key
    firebase
      .database()
      .ref(`/file_invitations/${fileKey}/${key}`)
      .set({
        email,
        write: !readOnly
      })
      .then(() => {})
  },
  [actionTypes.UPDATE_STATUS] (context, { publicFile, readOnly, fileKey }) {
    const status = publicFile
      ? {
          write: !readOnly
        }
      : null
    return firebase
      .database()
      .ref(`/file_authorities/${fileKey}/public`)
      .set(status)
      .then(() => {
        return firebase
          .database()
          .ref(`/file_authorities/${fileKey}`)
          .once('value')
      })
      .then(snapshot => {
        const isMyFile = context.getters[getterTypes.IS_MY_FILE_FROM_KEY]({
          fileKey
        })
        const fileAuthority = snapshot.val()
        if (isMyFile) {
          context.commit(mutationTypes.UPDATE_FILE_AUTHORITIES, {
            fileAuthorities: {
              [fileKey]: fileAuthority
            }
          })
        } else {
          context.commit(mutationTypes.UPDATE_SHARED_FILE_AUTHORITIES, {
            sharedFileAuthorities: {
              [fileKey]: fileAuthority
            }
          })
        }
      })
  },
  [actionTypes.UPDATE_USER_AUTHORITIES] (context, { userAuthorities, fileKey }) {
    const updates = Object.keys(userAuthorities).reduce((p, uid) => {
      const auth = userAuthorities[uid]
      if (auth) {
        p[`/file_authorities/${fileKey}/users/${uid}`] = auth
      } else {
        // delete user authority
        p[`/file_authorities/${fileKey}/users/${uid}`] = null
        p[`/work_spaces/${uid}/invited_files/${fileKey}`] = null
      }
      return p
    }, {})
    return firebase
      .database()
      .ref()
      .update(updates)
  }
}
