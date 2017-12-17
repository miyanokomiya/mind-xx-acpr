<template>
<MapLeftDrawer :nodes="nodes"/>
</template>

<script>
import MapLeftDrawer from '@/components/organisms/MapLeftDrawer'

import { mapGetters } from 'vuex'
import { getterTypes as nodesGetterTypes } from '@/store/nodes/types'

export default {
  components: {
    MapLeftDrawer
  },
  computed: {
    ...mapGetters('nodes', {
      nodes: nodesGetterTypes.NODES
    })
  }
}
</script>

<style lang="scss" scoped>

</style>

