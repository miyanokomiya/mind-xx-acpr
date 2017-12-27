<template>
  <MapCanvas
    v-if="loaded"
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
  />
</template>

<script>
import MapCanvas from '@/components/organisms/MapCanvas'

import { mapGetters, mapActions } from 'vuex'
import { getterTypes as layoutsGetterTypes } from '@/store/layouts/types'
import { getterTypes as nodesGetterTypes, actionTypes as nodesActionTypes } from '@/store/nodes/types'
import { getterTypes as fileGetterTypes, actionTypes as fileActionTypes } from '@/store/files/types'
import { getterTypes as userGetterTypes } from '@/store/user/types'
import { getterTypes as settingGetterTypes } from '@/store/settings/types'

export default {
  components: {
    MapCanvas
  },
  data: () => ({
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
      fileAuthorities: fileGetterTypes.FILE_AUTHORITIES,
      files: fileGetterTypes.FILES
    }),
    ...mapGetters('settings', {
      nodeColor: settingGetterTypes.NODE_COLOR,
      textColor: settingGetterTypes.TEXT_COLOR
    }),
    canvasWidth () {
      return this.$window.width >= 1264 && this.leftDrawer ? this.$window.width - 300 - 20 : this.$window.width - 20
    },
    canvasHeight () {
      return this.$window.height - 72
    },
    fileAuthority () {
      return this.fileAuthorities[this.fileKey]
    },
    defaultNodeProps () {
      return {
        backgroundColor: this.nodeColor,
        color: this.textColor
      }
    },
    file () {
      return this.files[this.fileKey]
    },
    loaded () {
      // If the count of nodes in a file is zero, the records of nodes don't exist.
      return !this.initialLoading || (this.file && this.file.nodeCount < 1)
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
      loadNodes: nodesActionTypes.LOAD_NODES
    }),
    ...mapActions('files', {
      loadFile: fileActionTypes.LOAD_FILE
    })
  }
}
</script>

<style lang="scss" scoped>

</style>

