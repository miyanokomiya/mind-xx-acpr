<template>
  <MapCanvas
    :width="canvasWidth"
    :height="canvasHeight"
    :nodes="nodes"
    :selectedNodes="selectedNodes"
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

export default {
  components: {
    MapCanvas
  },
  data: () => ({
  }),
  computed: {
    ...mapGetters('layouts', {
      leftDrawer: layoutsGetterTypes.LEFT_DRAWER
    }),
    ...mapGetters('nodes', {
      nodes: nodesGetterTypes.NODES,
      selectedNodes: nodesGetterTypes.SELECTED_NODES
    }),
    canvasWidth () {
      return this.$window.width >= 1264 && this.leftDrawer ? this.$window.width - 300 - 20 : this.$window.width - 20
    },
    canvasHeight () {
      return this.$window.height - 72
    }
  },
  methods: {
    ...mapActions('nodes', {
      updateNodes: nodesActionTypes.UPDATE_NODES,
      setSelectedNodes: nodesActionTypes.SET_SELECTED_NODES,
      clearSelect: nodesActionTypes.CLEAR_SELECT
    })
  }
}
</script>

<style lang="scss" scoped>

</style>

