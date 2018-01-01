<template>
<div class="wrapper">
  <MapCanvas
    v-if="loaded && !permissionDenied"
    :width="canvasWidth"
    :height="canvasHeight"
    :nodes="nodes"
    :selectedNodes="selectedNodes"
    :fileAuthority="fileAuthority"
    :user="user"
    :defaultNodeProps="defaultNodeProps"
    @updateNodes="nodes => updateNodes({ nodes })"
    @setSelectedNodes="selectedNodes => setSelectedNodes({ selectedNodes })"
    @clearSelect="clearSelect"
    @undo="undo"
    @redo="redo"
  />
  <div class="center-box" v-if="permissionDenied">
    <PermissionDeniedMessage/>
  </div>
  <v-snackbar
    bottom
    right
    color="error"
    :timeout="4000"
    v-model="snackbar"
  >
    {{message}}
  </v-snackbar>
</div>
</template>

<script>
import MapCanvas from '@/components/organisms/MapCanvas'
import PermissionDeniedMessage from '@/components/molecules/PermissionDeniedMessage'

import { mapGetters, mapActions } from 'vuex'
import { getterTypes as layoutsGetterTypes } from '@/store/layouts/types'
import { getterTypes as nodesGetterTypes, actionTypes as nodesActionTypes } from '@/store/nodes/types'
import { getterTypes as filesGetterTypes, actionTypes as filesActionTypes } from '@/store/files/types'
import { getterTypes as userGetterTypes } from '@/store/user/types'
import { getterTypes as settingsGetterTypes } from '@/store/settings/types'

export default {
  components: {
    MapCanvas,
    PermissionDeniedMessage
  },
  data: () => ({
    message: ''
  }),
  props: {
    fileKey: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters('layouts', {
      leftDrawer: layoutsGetterTypes.LEFT_DRAWER
    }),
    ...mapGetters('user', {
      user: userGetterTypes.USER
    }),
    ...mapGetters('nodes', {
      nodes: nodesGetterTypes.NODES,
      selectedNodes: nodesGetterTypes.SELECTED_NODES,
      initialLoading: nodesGetterTypes.INITIAL_LOADING
    }),
    ...mapGetters('files', {
      fileFromKey: filesGetterTypes.FILE_FROM_KEY,
      fileAuthorityFromKey: filesGetterTypes.FILE_AUTHORITY_FROM_KEY,
      permissionDenied: filesGetterTypes.PERMISSION_DENIED
    }),
    ...mapGetters('settings', {
      nodeColor: settingsGetterTypes.NODE_COLOR,
      textColor: settingsGetterTypes.TEXT_COLOR
    }),
    canvasWidth () {
      return this.$window.width >= 1264 && this.leftDrawer ? this.$window.width - 300 - 20 : this.$window.width - 20
    },
    canvasHeight () {
      return this.$window.height - 48
    },
    defaultNodeProps () {
      return {
        backgroundColor: this.nodeColor,
        color: this.textColor
      }
    },
    file () {
      return this.fileFromKey({fileKey: this.fileKey})
    },
    fileAuthority () {
      return this.fileAuthorityFromKey({fileKey: this.fileKey})
    },
    loaded () {
      // If the count of nodes in a file is zero, the records of nodes don't exist.
      return !this.initialLoading || (this.file && this.file.nodeCount < 1)
    },
    snackbar: {
      get () {
        return !!this.message
      },
      set (val) {
        this.message = val ? this.message : ''
      }
    }
  },
  mounted () {
    this.loadNodes({ fileKey: this.fileKey })
    this.loadFile({ key: this.fileKey })
  },
  destroyed () {
    this.disconnect()
  },
  methods: {
    ...mapActions('nodes', {
      disconnect: nodesActionTypes.DISCONNECT,
      updateNodes: nodesActionTypes.UPDATE_NODES,
      setSelectedNodes: nodesActionTypes.SET_SELECTED_NODES,
      clearSelect: nodesActionTypes.CLEAR_SELECT,
      loadNodes: nodesActionTypes.LOAD_NODES,
      _undo: nodesActionTypes.UNDO_NODES,
      _redo: nodesActionTypes.REDO_NODES
    }),
    ...mapActions('files', {
      loadFile: filesActionTypes.LOAD_FILE
    }),
    undo () {
      this._undo().catch(e => {
        this.message = e.message
      })
    },
    redo () {
      this._redo().catch(e => {
        this.message = e.message
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
}
.center-box {
  margin: 30px 10%;
}
</style>

