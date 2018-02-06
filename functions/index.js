const functions = require('firebase-functions')
const admin = require('firebase-admin')
// admin.initializeApp(functions.config().firebase)

// this account file is gitignored
const serviceAccount = require('./mind-xx-acpr-firebase-adminsdk-wd2cq-854fdc9efc.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://mind-xx-acpr.firebaseio.com'
})

// exports.createUser = functions.auth.user().onCreate(event => {
//   const data = event.data
//   const uid = data.uid
//   return admin
//     .database()
//     .ref(`/users/${uid}`)
//     .set({
//       email: event.data.email,
//       displayName: event.data.displayName,
//       photoURL: event.data.photoURL,
//       providerId: event.data.providerId
//     })
// })

exports.deleteUser = functions.auth.user().onDelete(event => {
  const uid = event.data.uid
  return admin
    .database()
    .ref(`/work_spaces/${uid}/files`)
    .once('value')
    .then(snapshot => {
      const files = snapshot.val()
      if (files) {
        return Promise.all(
          Object.keys(files).map(fileId => {
            return deleteFile(fileId)
          })
        )
      } else {
        return Promise.resolve()
      }
    })
    .then(() => {
      const updates = {
        [`/work_spaces/${uid}`]: null,
        [`/users/${uid}`]: null
      }
      return admin
        .database()
        .ref(`/work_spaces/${uid}`)
        .update(updates)
    })
})

function deleteFile (fileId) {
  return admin
    .database()
    .ref(`/file_authorities/${fileId}/users`)
    .once('value')
    .then(snapshot => {
      const authorities = snapshot.val()
      const updates = {}
      updates[`/file_invitations/${fileId}`] = null
      updates[`/file_authorities/${fileId}`] = null
      updates[`/files/${fileId}`] = null
      updates[`/nodes/${fileId}`] = null
      updates[`/comments/${fileId}`] = null
      if (authorities) {
        Object.keys(authorities).forEach(userId => {
          updates[`/work_spaces/${userId}/files/${fileId}`] = null
          updates[`/work_spaces/${userId}/invited_files/${fileId}`] = null
        })
      }
      return admin
        .database()
        .ref()
        .update(updates)
    })
}

exports.deleteFile = functions.database
  .ref('/work_spaces/{ownerId}/files/{fileId}')
  .onDelete(event => {
    if (!event.data.previous.exists()) {
      return Promise.resolve()
    } else {
      const fileId = event.params.fileId
      return deleteFile(fileId)
    }
  })

exports.inviteUserToFile = functions.database
  .ref('/file_invitations/{fileId}/{tmpId}')
  .onWrite(event => {
    if (!event.data.exists()) {
      return Promise.resolve()
    }
    const fileId = event.params.fileId
    const original = event.data.val()
    const email = original.email
    return admin
      .auth()
      .getUserByEmail(email)
      .then(user => {
        if (user) {
          // the user is found
          return admin
            .database()
            .ref(`/file_authorities/${fileId}/users/${user.uid}`)
            .once('value')
            .then(snapshot => {
              const current = snapshot.val()
              if (current && current.owner) {
                console.error(
                  `The authority of the owner cannot change. file=${fileId}, owner=${
                    user.uid
                  }`
                )
                return event.data.ref.remove()
              } else {
                const updates = {
                  [`/file_authorities/${fileId}/users/${user.uid}`]: {
                    write: original.write
                  },
                  [`/work_spaces/${user.uid}/invited_files/${fileId}`]: true
                }
                return admin
                  .database()
                  .ref()
                  .update(updates)
                  .then(() => {
                    return event.data.ref.remove()
                  })
              }
            })
        } else {
          // the user is not found
          // return Promise.resolve()
          return event.data.ref.remove()
        }
      })
  })
