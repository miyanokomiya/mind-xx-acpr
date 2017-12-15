<template>
  <MapCanvas
    :width="canvasWidth"
    :height="canvasHeight"
    :nodes="nodes"
  />
</template>

<script>
import MapCanvas from '@/components/organisms/MapCanvas'

export default {
  components: {
    MapCanvas
  },
  data: () => ({
    nodes: {
      root: { x: 0, y: 0, text: '', children: [] }
    }
  }),
  computed: {
    canvasWidth () {
      return this.$window.width < 1264 ? this.$window.width - 20 : this.$window.width - 300 - 20
    },
    canvasHeight () {
      return this.$window.height - 72
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

