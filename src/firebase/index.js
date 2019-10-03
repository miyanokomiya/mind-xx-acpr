import * as firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

const config = process.env.VUE_APP_ENV === 'production'
  ? {
      apiKey: 'AIzaSyB_t7IC5k4U8bedjSXvpbtsdF6KH5RfpOk',
      authDomain: 'mind-xx-acpr.firebaseapp.com',
      databaseURL: 'https://mind-xx-acpr.firebaseio.com',
      projectId: 'mind-xx-acpr',
      storageBucket: 'mind-xx-acpr.appspot.com',
      messagingSenderId: '940754615168',
    }
  : {
      apiKey: 'AIzaSyDDWQAqCu-VBjSxTH_-AFJ-X7GGPxxGLTo',
      authDomain: 'mind-xx-acpr-stg.firebaseapp.com',
      databaseURL: 'https://mind-xx-acpr-stg.firebaseio.com',
      projectId: 'mind-xx-acpr-stg',
      storageBucket: '',
      messagingSenderId: '313245988200',
      appId: '1:313245988200:web:c4acbad4ef2db513d492dd',
      measurementId: 'G-T4R3VTYPW3',
    }

firebase.initializeApp(config)

export default firebase
