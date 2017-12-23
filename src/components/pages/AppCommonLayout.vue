<template>
<div>
  <v-navigation-drawer
    fixed
    clipped
    app
    :value="leftDrawer"
    @input="val => setLeftDrawer({ leftDrawer: val })"
  >
    <!-- <v-list dense>
    </v-list> -->
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
      <span class="hidden-xs-only">MindXXACPR</span>
    </v-toolbar-title>
    <div class="d-flex align-center" style="margin-left: auto">
      <router-view name="headerIconList"/>
      <!-- <v-btn icon>
        <v-icon>apps</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>notifications</v-icon>
      </v-btn> -->
      <v-menu bottom left offset-y v-if="user">
        <v-btn icon slot="activator" dark>
          <v-avatar size="32px" tile>
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
        </v-list>
      </v-menu>
    </div>
  </v-toolbar>
  <v-content ref="content">
    <v-container fluid fill-height>
      <v-layout justify-center>
        <router-view name="content"/>
      </v-layout>
    </v-container>
  </v-content>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getterTypes, actionTypes } from '@/store/layouts/types'
import { getterTypes as userGetterTypes, actionTypes as userActionTypes } from '@/store/user/types'

export default {
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
      _signOut: userActionTypes.SIGN_OUT
    }),
    signOut () {
      this._signOut().then().catch().then(() => {
        location.reload()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container.fill-height {
  padding: 0;
}
</style>

