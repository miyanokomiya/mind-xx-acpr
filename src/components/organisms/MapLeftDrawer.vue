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
        <v-list-item
          :style="{ background: nodeColor }"
          @click="showNodeColorPicker = !showNodeColorPicker"
        >
          <v-list-item-action>
            <v-icon :style="{ color: textColor }">palette</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title :style="{ color: textColor }"
              ><b>Node Color</b></v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <li v-if="showNodeColorPicker" class="picker-box">
          <ColorPicker
            :value="nodeColor"
            @input="val => $emit('changeNodeColor', val.hex)"
          />
        </li>
        <v-list-item
          :style="{ background: nodeColor }"
          @click="showTextColorPicker = !showTextColorPicker"
        >
          <v-list-item-action>
            <v-icon :style="{ color: textColor }">palette</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title :style="{ color: textColor }"
              ><b>Text Color</b></v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <li v-if="showTextColorPicker" class="picker-box">
          <ColorPicker
            :value="textColor"
            @input="val => $emit('changeTextColor', val.hex)"
          />
        </li>
      </v-list>
    </v-tab-item>
    <v-tab-item>
      <v-list>
        <v-list-item @click="printSvg">
          <v-list-item-action>
            <v-icon>file_download</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>SVG</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <MapCanvas
          v-if="renderCanvas"
          ref="mapCanvas"
          class="map-canvas"
          :nodes="toSvgNodes"
          :width="canvasWidth"
          :height="canvasHeight"
        />
        <v-divider />
        <v-list-item v-if="canWrite" @click="$emit('repairFile')">
          <v-list-item-action>
            <v-icon>autorenew</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Repair file</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-tab-item>
    <v-dialog
      max-width="400"
      :value="!!svgString"
      :persistent="false"
      @input="svgString = ''"
    >
      <v-card>
        <v-card-title class="headline">{{ `${file.name}.svg` }}</v-card-title>
        <v-card-text class="text-xs-center">
          <textarea
            ref="textarea"
            class="textarea"
            readonly
            v-model="svgString"
            @click="copySvg"
          ></textarea>
          <v-checkbox hide-details label="Expand all nodes" v-model="expandAllNode" />
          <v-checkbox hide-details label="Landscape" v-model="landscape" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="copySvg">
            COPY
          </v-btn>
          <v-btn color="blue darken-1" text @click="downloadSvg">
            DOWNLOAD
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
    MapCanvas,
  },
  data: () => ({
    renderCanvas: false,
    showNodeColorPicker: false,
    showTextColorPicker: false,
    svgString: '',
    expandAllNode: false,
    landscape: true,
  }),
  props: {
    nodes: {
      type: Object,
      required: true,
      validator: value => {
        return ROOT_NODE in value
      },
    },
    file: {
      type: Object,
      required: true,
    },
    nodeColor: {
      type: String,
      default: '#87cefa',
    },
    textColor: {
      type: String,
      default: '#000000',
    },
    canWrite: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    canvasWidth() {
      return this.landscape ? 1024 : Math.floor(1024 / Math.SQRT2)
    },
    canvasHeight() {
      return this.landscape ? Math.floor(1024 / Math.SQRT2) : 1024
    },
    toSvgNodes() {
      if (this.expandAllNode) {
        return Object.keys(this.nodes).reduce((p, c) => {
          p[c] = {
            ...this.nodes[c],
            closed: false,
          }
          return p
        }, {})
      } else {
        return this.nodes
      }
    },
  },
  watch: {
    expandAllNode() {
      this.printSvg()
    },
    landscape() {
      this.printSvg()
    },
  },
  methods: {
    printSvg() {
      this.renderCanvas = true
      this.$nextTick().then(() => {
        const mapCanvas = this.$refs.mapCanvas
        if (mapCanvas) {
          mapCanvas.clearZoom().then(() => {
            const svgCanvas = mapCanvas.$refs.svgCanvas
            const dom = svgCanvas.$el
            const xmlSerializer = new XMLSerializer()
            this.svgString = xmlSerializer.serializeToString(dom)
            this.renderCanvas = false
          })
        }
      })
    },
    downloadSvg() {
      const fileName = this.file.name
      const filteredName = fileName.replace(/^.*[(\\|/|:|*|?|"|<|>||)].*$/, '_') + '.svg'
      var blob = new Blob([this.svgString], { type: 'image/svg+xml' })
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, filteredName)
      } else {
        var a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        // This does not work because of popup blocking.
        // a.target = '_blank'
        a.download = filteredName
        a.click()
        this.svgString = ''
        URL.revokeObjectURL(blob)
      }
    },
    copySvg() {
      this.$refs.textarea.select()
      document.execCommand('copy')
    },
  },
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
  width: 100%;
  height: 60px;
  text-align: left;
  background-color: #eee;
  border: 1px solid #aaa;
  border-radius: 2px;
  padding: 4px 6px;
  cursor: pointer;
}
</style>
