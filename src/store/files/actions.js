import { actionTypes, mutationTypes } from './types'
import firebase from '@/firebase'
import { createFile } from '@/utils/model'

export default {
  [actionTypes.LOAD_FILE] (context, { key }) {
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
  },
  [actionTypes.LOAD_FILES] (context, payload) {
    context.commit(mutationTypes.CLEAR_FILES)

    const uid = firebase.auth().currentUser.uid
    firebase
      .database()
      .ref(`/work_spaces/${uid}/files`)
      .once('value')
      .then(snapshot => {
        const fileKeys = snapshot.val()
        if (!fileKeys) {
          return
        }
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
      .ref(`/file_authorities/${fileKey}/${uid}`)
      .set({
        write: true
      })
      .then(() => {
        // local commit the authority
        context.commit(mutationTypes.UPDATE_FILE_AUTHORITIES, {
          fileAuthorities: {
            [fileKey]: {
              [uid]: {
                write: true
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
        // reloat the file
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
    // delete files at first
    const updates = Object.keys(files).reduce((p, c) => {
      p[`/files/${c}`] = null
      p[`/work_spaces/${uid}/files/${c}`] = null
      p[`/nodes/${c}`] = null
      return p
    }, {})
    firebase
      .database()
      .ref()
      .update(updates)
      .then(() => {
        // commit
        context.commit(mutationTypes.UPDATE_FILES, { files })
        // delete authorities of files
        const updates = Object.keys(files).reduce((p, c) => {
          p[`/file_authorities/${c}`] = null
          return p
        }, {})
        firebase
          .database()
          .ref()
          .update(updates)
      })
  },
  [actionTypes.INVITE_USER] (context, { email, fileKey }) {
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
        write: true
      })
      .then(() => {})
  }
}
