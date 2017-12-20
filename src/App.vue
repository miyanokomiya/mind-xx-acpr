<template>
  <div id="app">
    <router-view/>
    <AuthDialog v-model="needAuth"/>
  </div>
</template>

<script>
import firebase from './firebase'
import AuthDialog from './components/organisms/AuthDialog'

export default {
  name: 'app',
  data: () => ({
    needAuth: false
  }),
  components: {
    AuthDialog
  },
  mounted () {
    firebase.auth().getRedirectResult().then((result) => {
      // if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // var token = result.credential.accessToken
      // }
      // The signed-in user info.
      var user = result.user
      console.log(user)
      if (!user) {
        this.needAuth = true
      }
    }).catch(function (error) {
      // Handle Errors here.
      // var errorCode = error.code
      // var errorMessage = error.message
      // // The email of the user's account used.
      // var email = error.email
      // // The firebase.auth.AuthCredential type that was used.
      // var credential = error.credential
      console.log(error.code, error.message)
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
