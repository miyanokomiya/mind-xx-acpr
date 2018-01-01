<template>
<MapLeftDrawer
  v-if="file"
  :nodes="nodes"
  :file="file"
  :nodeColor="nodeColor"
  :textColor="textColor"
  @changeNodeColor="changeNodeColor"
  @changeTextColor="changeTextColor"
  @repairFile="repairFile"
/>
</template>

<script>
import MapLeftDrawer from '@/components/organisms/MapLeftDrawer'

import { mapGetters, mapActions } from 'vuex'
import { getterTypes as nodesGetterTypes, actionTypes as nodesActionTypes } from '@/store/nodes/types'
import { getterTypes as settingsGetterTypes, actionTypes as settingsActionTypes } from '@/store/settings/types'
import { getterTypes as filesGetterTypes } from '@/store/files/types'

export default {
  components: {
    MapLeftDrawer
  },
  computed: {
    ...mapGetters('nodes', {
      nodes: nodesGetterTypes.NODES,
      selectedNodes: nodesGetterTypes.SELECTED_NODES,
      fileKey: nodesGetterTypes.FILE_KEY
    }),
    ...mapGetters('settings', {
      nodeColor: settingsGetterTypes.NODE_COLOR,
      textColor: settingsGetterTypes.TEXT_COLOR
    }),
    ...mapGetters('files', {
      fileFromKey: filesGetterTypes.FILE_FROM_KEY
    }),
    file () {
      return this.fileFromKey({ fileKey: this.fileKey })
    }
  },
  methods: {
    ...mapActions('nodes', {
      updateNodes: nodesActionTypes.UPDATE_NODES,
      _repairFile: nodesActionTypes.RESCUE_CONFRICT
    }),
    ...mapActions('settings', {
      setNodeColor: settingsActionTypes.SET_NODE_COLOR,
      setTextColor: settingsActionTypes.SET_TEXT_COLOR
    }),
    changeSelectedNodesProps (props) {
      const selectedKeys = Object.keys(this.selectedNodes)
      if (selectedKeys.length > 0) {
        const updatedNodes = selectedKeys.reduce((p, key) => {
          p[key] = Object.assign({}, this.nodes[key], props)
          return p
        }, {})
        this.updateNodes({ nodes: updatedNodes })
      }
    },
    changeNodeColor (nodeColor) {
      this.setNodeColor({nodeColor})
      this.changeSelectedNodesProps({backgroundColor: nodeColor})
    },
    changeTextColor (textColor) {
      this.setTextColor({textColor})
      this.changeSelectedNodesProps({color: textColor})
    },
    repairFile () {
      this._repairFile().then(() => {
        location.reload()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

