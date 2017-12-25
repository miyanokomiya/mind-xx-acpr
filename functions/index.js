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

// exports.removeUser = functions.auth.user().onDelete(event => {
//   const uid = event.data.uid
//   const updates = {
//     [`/users/${uid}`]: null,
//     [`/work_spaces/${uid}`]: null
//   }
//   return admin
//     .database()
//     .ref()
//     .update(updates)
// })

exports.inviteUserToFile = functions.database
  .ref('/file_invitations/{fileId}/{tmpId}')
  .onWrite(event => {
    if (!event.data.exists()) {
      return null
    }
    const fileId = event.params.fileId
    const original = event.data.val()
    const email = original.email
    return admin
      .auth()
      .getUserByEmail(email)
      .then(user => {
        console.log(user)
        if (user) {
          // the user is found
          const updates = {
            [`/file_authorities/${fileId}/${user.uid}`]: {
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
        } else {
          // the user is not found
          // return Promise.resolve()
          return event.data.ref.remove()
        }
      })
  })
