<template>
<v-list dense class="pt-0">
  <v-divider></v-divider>
  <v-list-tile @click="printSvg">
    <v-list-tile-action>
      <v-icon>file_download</v-icon>
    </v-list-tile-action>
    <v-list-tile-content>
      <v-list-tile-title>SVG</v-list-tile-title>
    </v-list-tile-content>
  </v-list-tile>
  <MapCanvas
    v-if="renderCanvas"
    ref="mapCanvas"
    class="map-canvas"
    :nodes="nodes"
    :width="canvasWidth"
    :height="canvasHeight"
  />
</v-list>
</template>

<script>
import MapCanvas from './MapCanvas'
import { ROOT_NODE } from '@/constants'

export default {
  components: {
    MapCanvas
  },
  data: () => ({
    renderCanvas: false
  }),
  props: {
    nodes: {
      type: Object,
      required: true,
      validator: (value) => {
        return (ROOT_NODE in value)
      }
    }
  },
  computed: {
    canvasWidth () {
      return 1024
    },
    canvasHeight () {
      return 1024
    }
  },
  methods: {
    printSvg () {
      this.renderCanvas = true
      this.$nextTick().then(() => {
        const mapCanvas = this.$refs.mapCanvas
        mapCanvas.clearZoom().then(() => {
          const svgCanvas = mapCanvas.$refs.svgCanvas
          const dom = svgCanvas.$el
          const xmlSerializer = new XMLSerializer()
          const textXml = xmlSerializer.serializeToString(dom)
          this.downloadText(textXml, 'mind-xx-acpr.svg')
          this.renderCanvas = false
        })
      })
    },
    downloadText (text, fileName) {
      var blob = new Blob([ text ], { 'type': 'text/plain' })
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, fileName)
      } else {
        var a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.target = '_blank'
        a.download = fileName
        a.click()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.map-canvas {
  opacity: 0;
}
</style>

