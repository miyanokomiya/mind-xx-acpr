<template>
<MapLeftDrawer
  :nodes="nodes"
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

export default {
  components: {
    MapLeftDrawer
  },
  computed: {
    ...mapGetters('nodes', {
      nodes: nodesGetterTypes.NODES,
      selectedNodes: nodesGetterTypes.SELECTED_NODES
    }),
    ...mapGetters('settings', {
      nodeColor: settingsGetterTypes.NODE_COLOR,
      textColor: settingsGetterTypes.TEXT_COLOR
    })
  },
  methods: {
    ...mapActions('nodes', {
      updateNodes: nodesActionTypes.UPDATE_NODES,
      repairFile: nodesActionTypes.RESCUE_CONFRICT
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

