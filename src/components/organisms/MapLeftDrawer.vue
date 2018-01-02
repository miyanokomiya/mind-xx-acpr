<template>
<v-tabs grow>
  <v-tabs-bar class="grey lighten-4" light>
    <v-tabs-item href="#left-drawer-edit" class="primary--text">
      <v-icon>mode_edit</v-icon>
    </v-tabs-item>
    <v-tabs-item href="#left-drawer-file" class="primary--text">
      <v-icon>insert_drive_file</v-icon>
    </v-tabs-item>
    <v-tabs-slider color="yellow"></v-tabs-slider>
  </v-tabs-bar>
  <v-tabs-items>
    <v-tabs-content
      :id="'left-drawer-edit'"
    >
      <v-list>
        <v-list-tile :style="{background: nodeColor}" @click="showNodeColorPicker = !showNodeColorPicker">
          <v-list-tile-action>
            <v-icon :style="{color: textColor}">palette</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title :style="{color: textColor}"><b>Node Color</b></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <li v-if="showNodeColorPicker" class="picker-box">
          <ColorPicker :value="nodeColor" @input="val => $emit('changeNodeColor', val.hex)"/>
        </li>
        <v-list-tile :style="{background: nodeColor}" @click="showTextColorPicker = !showTextColorPicker">
          <v-list-tile-action>
            <v-icon :style="{color: textColor}">palette</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title :style="{color: textColor}"><b>Text Color</b></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <li v-if="showTextColorPicker" class="picker-box">
          <ColorPicker :value="textColor" @input="val => $emit('changeTextColor', val.hex)"/>
        </li>
      </v-list>
    </v-tabs-content>
    <v-tabs-content
      :id="'left-drawer-file'"
    >
      <v-list>
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
        <v-divider/>
        <v-list-tile @click="$emit('repairFile')">
          <v-list-tile-action>
            <v-icon>autorenew</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Repair file</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-tabs-content>
  </v-tabs-items>
</v-tabs>


</template>

<script>
import { Swatches } from 'vue-color'
import MapCanvas from './MapCanvas'
import { ROOT_NODE } from '@/constants'

export default {
  components: {
    ColorPicker: Swatches,
    MapCanvas
  },
  data: () => ({
    renderCanvas: false,
    showNodeColorPicker: false,
    showTextColorPicker: false
  }),
  props: {
    nodes: {
      type: Object,
      required: true,
      validator: (value) => {
        return (ROOT_NODE in value)
      }
    },
    file: {
      type: Object,
      required: true
    },
    nodeColor: {
      type: String,
      default: '#87cefa'
    },
    textColor: {
      type: String,
      default: '#000000'
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
          this.downloadText(textXml, this.file.name)
          this.renderCanvas = false
        })
      })
    },
    downloadText (text, fileName) {
      var blob = new Blob([ text ], { 'type': 'image/svg+xml' })
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
.vc-swatches {
  width: auto;
}
</style>

