<template>
  <v-app id="app">
    <router-view v-if="!authorityLoading"/>
    <AuthDialog v-model="needAuth"/>
  </v-app>
</template>

<script>
import AuthDialog from './components/organisms/AuthDialog'

import { mapGetters, mapActions } from 'vuex'
import { getterTypes, actionTypes } from '@/store/user/types'

export default {
  name: 'app',
  components: {
    AuthDialog
  },
  computed: {
    ...mapGetters('user', {
      user: getterTypes.USER,
      authorityLoading: getterTypes.AUTHORITY_LOADING
    }),
    needAuth () {
      return !this.user
    }
  },
  mounted () {
    this.loadUser()
  },
  methods: {
    ...mapActions('user', {
      loadUser: actionTypes.LOAD_USER
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
