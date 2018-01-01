<template>
<div>
  <v-navigation-drawer
    fixed
    clipped
    app
    :value="leftDrawer"
    @input="val => setLeftDrawer({ leftDrawer: val })"
  >
    <router-view name="leftDrawer"/>
  </v-navigation-drawer>
  <v-toolbar
    color="blue darken-3"
    dark
    app
    clipped-left
    fixed
    dense
  >
    <v-toolbar-title :style="$vuetify.breakpoint.smAndUp ? 'width: 300px; min-width: 250px' : 'min-width: 72px'" class="ml-0 pl-3">
      <v-toolbar-side-icon @click.stop="setLeftDrawer({ leftDrawer: !leftDrawer })"></v-toolbar-side-icon>
      <v-btn flat @click="$router.push({name: 'WorkSpace'})">MindXXACPR</v-btn>
    </v-toolbar-title>
    <div class="d-flex align-center" style="margin-left: auto">
      <router-view name="headerIconList"/>
      <v-menu bottom left offset-y :nudge-bottom="6" v-if="user">
        <v-btn icon slot="activator" dark>
          <v-avatar size="32px">
            <img :src="user.photoURL"/>
          </v-avatar>
        </v-btn>
        <v-list>
          <v-list-tile>
            <v-list-tile-title>{{user.displayName}}</v-list-tile-title>
          </v-list-tile>
          <v-divider/>
          <v-list-tile @click="signOut">
            <v-list-tile-title>Sign out</v-list-tile-title>
          </v-list-tile>
          <v-divider/>
          <v-list-tile @click="deleteConfirm = true">
            <v-list-tile-title>Delete account</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>
  </v-toolbar>
  <v-content ref="content">
    <v-container fill-height>
      <v-layout class="main-layout">
        <router-view name="content"/>
      </v-layout>
    </v-container>
  </v-content>
  <AuthDialog v-model="reauth" :reauth="true"/>
  <ConfirmDialog
    v-model="deleteConfirm"
    message="All your files will be deleted and cannot revert. Are you sure you want to delete?"
    @ok="deleteUser"
    @cancel="deleteConfirm = false"
  />
</div>
</template>

<script>
import AuthDialog from '@/components/organisms/AuthDialog'
import ConfirmDialog from '@/components/organisms/ConfirmDialog'

import { mapGetters, mapActions } from 'vuex'
import { getterTypes, actionTypes } from '@/store/layouts/types'
import { getterTypes as userGetterTypes, actionTypes as userActionTypes } from '@/store/user/types'

export default {
  components: {
    AuthDialog,
    ConfirmDialog,
  },
  data: () => ({
    reauth: false,
    deleteConfirm: false
  }),
  props: {
  },
  computed: {
    ...mapGetters('layouts', {
      leftDrawer: getterTypes.LEFT_DRAWER
    }),
    ...mapGetters('user', {
      user: userGetterTypes.USER
    })
  },
  methods: {
    ...mapActions('layouts', {
      setLeftDrawer: actionTypes.SET_LEFT_DRAWER
    }),
    ...mapActions('user', {
      _signOut: userActionTypes.SIGN_OUT,
      _deleteUser: userActionTypes.DELETE_USER,
      reauthenticate: userActionTypes.REAUTHENTICATE
    }),
    signOut () {
      this._signOut().then().catch().then(() => {
        location.reload()
      })
    },
    deleteUser () {
      this.deleteConfirm = false
      this._deleteUser().then(() => {
        window.location.reload()
      }).catch(e => {
        this.reauth = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container.fill-height {
  padding: 0;
}
.main-layout {
  width: 100%;
}
</style>

