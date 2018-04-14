<template>
<v-tabs grow>
  <v-tab ripple v-if="canWrite">
    <v-icon>mode_edit</v-icon>
  </v-tab>
  <v-tab ripple>
    <v-icon>insert_drive_file</v-icon>
  </v-tab>
  <v-tab-item v-if="canWrite">
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
  </v-tab-item>
  <v-tab-item>
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
      <v-list-tile v-if="canWrite" @click="$emit('repairFile')">
        <v-list-tile-action>
          <v-icon>autorenew</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Repair file</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-tab-item>
    <v-dialog
      max-width="400"
      :value="!!svgString"
      :persistent="false"
      @input="svgString = ''"
    >
      <v-card>
        <v-card-title class="headline">{{file.name}}</v-card-title>
        <v-card-text class="text-xs-center">
          <textarea ref="textarea" class="textarea" readonly v-model="svgString"></textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            flat="flat"
            @click="copySvg"
          >
            COPY
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    showTextColorPicker: false,
    svgString: ''
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
    },
    canWrite: {
      type: Boolean,
      default: false
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
          this.svgString = xmlSerializer.serializeToString(dom)
          this.renderCanvas = false
        })
      })
    },
    // TODO できなくなってしまっている
    downloadSvg () {
      const fileName = this.file.name
      const filteredName = fileName.replace(/^.*[(\\|/|:|*|?|"|<|>||)].*$/, '_')
      var blob = new Blob([ this.svgString ], { 'type': 'image/svg+xml' })
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, filteredName)
      } else {
        var a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.target = '_blank'
        a.download = fileName
        a.click()
        this.svgString = ''
      }
    },
    copySvg () {
      this.$refs.textarea.select()
      document.execCommand('copy')
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
.textarea {
  width: 90%;
  height: 200px;
  text-align: left;
  background-color: #eee;
  border: 1px solid #aaa;
  border-radius: 2px;
  padding: 4px 6px;
}
</style>

