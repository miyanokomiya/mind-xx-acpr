<template>
  <div>
    <div v-if="!authorityLoading && (!needAuth || authenticated)">
      <v-navigation-drawer
        v-if="!hideLedfDrawer"
        fixed
        clipped
        app
        :value="leftDrawer"
        @input="val => setLeftDrawer({ leftDrawer: val })"
      >
        <router-view name="leftDrawer" />
      </v-navigation-drawer>
      <v-app-bar app clipped-left color="blue darken-3" dark fixed dense>
        <v-toolbar-title class="ml-0 pl-3">
          <v-app-bar-nav-icon
            v-if="!hideLedfDrawer"
            class="left-drawer-activator"
            @click.stop="setLeftDrawer({ leftDrawer: !leftDrawer })"
          />
          <router-view name="headerTitle" />
        </v-toolbar-title>
        <div class="d-flex align-center icon-box" style="margin-left: auto">
          <router-view name="headerIconList" />
          <v-menu bottom left offset-y :nudge-bottom="6" v-if="user">
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" dark>
                <v-avatar size="32px">
                  <img :src="user.photoURL" />
                </v-avatar>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>{{ user.displayName }}</v-list-item-title>
              </v-list-item>
              <v-divider />
              <v-list-item @click="signOut">
                <v-list-item-title>Sign out</v-list-item-title>
              </v-list-item>
              <v-divider />
              <v-list-item @click="deleteConfirm = true">
                <v-list-item-title>Delete account</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn v-else text @click="needAuthLocal = true">SIGN IN</v-btn>
        </div>
      </v-app-bar>
      <v-content ref="content">
        <v-container fluid fill-height>
          <v-layout class="main-layout">
            <router-view name="content" />
          </v-layout>
        </v-container>
      </v-content>
      <AuthDialog v-model="reauth" :reauth="true" :persistent="false" />
      <ConfirmDialog
        v-model="deleteConfirm"
        message="All your files will be deleted and cannot revert. Are you sure you want to delete?"
        @ok="deleteUser"
        @cancel="deleteConfirm = false"
      />
    </div>
    <AuthDialog
      :value="!authorityLoading && _needAuth && !authenticated"
      :persistent="needAuth"
      @input="val => (needAuthLocal = val)"
    />
    <v-progress-linear
      class="top-progress"
      v-if="authorityLoading"
      :indeterminate="true"
    />
  </div>
</template>

<script>
import AuthDialog from '@/components/organisms/AuthDialog'
import ConfirmDialog from '@/components/organisms/ConfirmDialog'

import { mapGetters, mapActions } from 'vuex'
import { getterTypes, actionTypes } from '@/store/layouts/types'
import {
  getterTypes as userGetterTypes,
  actionTypes as userActionTypes,
} from '@/store/user/types'

export default {
  components: {
    AuthDialog,
    ConfirmDialog,
  },
  data: () => ({
    reauth: false,
    deleteConfirm: false,
    needAuthLocal: false,
  }),
  props: {
    needAuth: {
      type: Boolean,
      default: false,
    },
    hideLedfDrawer: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters('layouts', {
      leftDrawer: getterTypes.LEFT_DRAWER,
    }),
    ...mapGetters('user', {
      user: userGetterTypes.USER,
      authorityLoading: userGetterTypes.AUTHORITY_LOADING,
    }),
    authenticated() {
      return !!this.user
    },
    _needAuth() {
      return this.needAuth || this.needAuthLocal
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.leftDrawer) {
      this.setLeftDrawer({ leftDrawer: false })
      next(false)
    } else {
      next()
    }
  },
  methods: {
    ...mapActions('layouts', {
      setLeftDrawer: actionTypes.SET_LEFT_DRAWER,
    }),
    ...mapActions('user', {
      _signOut: userActionTypes.SIGN_OUT,
      _deleteUser: userActionTypes.DELETE_USER,
      reauthenticate: userActionTypes.REAUTHENTICATE,
    }),
    signOut() {
      this._signOut()
        .then()
        .catch()
        .then(() => {
          location.reload()
        })
    },
    deleteUser() {
      this.deleteConfirm = false
      this._deleteUser()
        .then(() => {
          window.location.reload()
        })
        .catch(() => {
          this.reauth = true
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.container.fill-height {
  padding: 0;
}
.main-layout {
  width: 100%;
}
.icon-box {
  margin-right: 6px !important; // FIXME
}
.top-progress {
  margin: 0;
}
</style>
