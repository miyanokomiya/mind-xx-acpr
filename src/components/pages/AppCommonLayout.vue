<template>
<v-app>
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
      <v-btn icon large>
        <v-avatar size="32px" tile>
          <img
            src="https://vuetifyjs.com/static/doc-images/logo.svg"
            alt="Vuetify"
          >
        </v-avatar>
      </v-btn>
    </div>
  </v-toolbar>
  <v-content ref="content">
    <v-container fluid fill-height>
      <v-layout justify-center align-center>
        <router-view name="content"/>
      </v-layout>
    </v-container>
  </v-content>
</v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getterTypes, actionTypes } from '@/store/layouts/types'

export default {
  data: () => ({
    // leftDrawer: null
  }),
  props: {
  },
  computed: {
    ...mapGetters('layouts', {
      leftDrawer: getterTypes.LEFT_DRAWER
    })
  },
  methods: {
    ...mapActions('layouts', {
      setLeftDrawer: actionTypes.SET_LEFT_DRAWER
    })
  }
}
</script>

<style lang="scss" scoped>
.container.fill-height {
  padding: 0;
}
</style>

