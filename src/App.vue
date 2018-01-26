<template>
  <v-app id="app">
    <router-view/>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
import { actionTypes } from '@/store/user/types'

export default {
  name: 'app',
  computed: {
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
