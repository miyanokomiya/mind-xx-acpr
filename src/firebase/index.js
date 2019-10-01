import * as firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

const config = {
  apiKey: 'AIzaSyB_t7IC5k4U8bedjSXvpbtsdF6KH5RfpOk',
  authDomain: 'mind-xx-acpr.firebaseapp.com',
  databaseURL: 'https://mind-xx-acpr.firebaseio.com',
  projectId: 'mind-xx-acpr',
  storageBucket: 'mind-xx-acpr.appspot.com',
  messagingSenderId: '940754615168',
}
firebase.initializeApp(config)

export default firebase
