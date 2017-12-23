import { actionTypes, mutationTypes } from './types'
import firebase from '@/firebase'
import { createFile } from '@/utils/model'

export default {
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
      .set(true)
      .then(() => {
        // create the file
        const newFile = Object.assign({}, createFile(file), {
          created: firebase.database.ServerValue.TIMESTAMP,
          updated: firebase.database.ServerValue.TIMESTAMP
        })
        const updates = {}
        updates[`/files/${fileKey}`] = newFile
        updates[`/work_spaces/${uid}/files/${fileKey}`] = true
        firebase
          .database()
          .ref()
          .update(updates)
          .then(() => {
            // reloat the file
            firebase
              .database()
              .ref(`/files/${fileKey}`)
              .once('value')
              .then(snapshot => {
                context.commit(mutationTypes.UPDATE_FILES, {
                  files: {
                    [fileKey]: snapshot.val()
                  }
                })
              })
          })
      })
  },
  [actionTypes.DELETE_FILES] (context, { files }) {
    const uid = firebase.auth().currentUser.uid
    const updates = Object.keys(files).reduce((p, c) => {
      p[`/files/${c}`] = null
      p[`/work_spaces/${uid}/files/${c}`] = null
      return p
    }, {})
    // delete files at first
    firebase
      .database()
      .ref()
      .update(updates)
      .then(() => {
        // commit
        context.commit(mutationTypes.UPDATE_FILES, { files })
        Object.keys(files).forEach(fileKey => {
          // load all users having the authority
          firebase
            .database()
            .ref(`/file_authorities/${fileKey}`)
            .once('value')
            .then(snapshot => {
              // delete the authority settings
              const userKeys = snapshot.val()
              const updates = Object.keys(userKeys).reduce((p, userKey) => {
                p[`/file_authorities/${fileKey}/${userKey}`] = null
                return p
              }, {})
              firebase
                .database()
                .ref()
                .update(updates)
            })
        })
      })
  }
}
