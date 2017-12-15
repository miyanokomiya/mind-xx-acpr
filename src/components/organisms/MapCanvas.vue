<template>
<div class="map-canvas-wrapper">
  <SvgCanvas style="border: 1px solid #000;"
    ref="svgCanvas"
    :x="x"
    :y="y"
    :width="width"
    :height="height"
    :scale="scale"
    @move="move"
    @zoom="zoom"
    @click="clearSelect"
  >
    <SvgConnector
      v-for="(connector, i) in connectors"
      :key="i"
      :sx="connector.sx"
      :sy="connector.sy"
      :ex="connector.ex"
      :ey="connector.ey"
    />
    <SvgTextRectangle
      class="mind-node"
      v-for="(node, key) in nodes"
      :key="key"
      :ref="`node_${key}`"
      :x="nodePositions[key].x"
      :y="nodePositions[key].y"
      :text="node.text"
      :strokeWidth="selectedKeys[key] ? 2 : 1"
      :stroke="selectedKeys[key] ? 'blue' : 'black'"
      fill="yellow"
      @calcSize="size => calcSize({key, size})"
      @mousedown.native="nodeCursorDown"
      @mouseup.native="nodeCursorUp(key)"
      @keyup.native="$emit('createNode', {from: key})"
    />
  </SvgCanvas>
  <FloatTextInput
    v-if="editTextTarget"
    v-model="editingText"
    :x="editTextTargetPosition.x"
    :y="editTextTargetPosition.y"
    @blur="doneEditText"
  />
  <div class="scale-tool">
    <ScaleToolBox
      :min="MIN_SCALE_RATE"
      :max="MAX_SCALE_RATE"
      :step="0.1"
      :scaleRate="scaleRate"
      @changeScaleRate="val => scaleRate = val"
      @clearZoom="clearZoom"
    />
  </div>
  <FloatEditMenu
    v-if="editMenuTarget"
    :x="editMenuTargetPosition.x"
    :y="editMenuTargetPosition.y"
    @addBrother="createNode(true)"
    @addChild="createNode(false)"
    @delete="deleteNode"
  />
</div>
</template>

<script>
import Vue from 'vue'
import { INTERVAL_CLICK, INTERVAL_DOUBLE_CLICK } from '@/constants'
import { createNode, calcPositions, getParentKey, getFamilyKeys, getUpdatedNodesWhenDeleteNode, getUpdatedNodesWhenCreateChildNode, getUpdatedNodesWhenCreateBrotherdNode } from '@/utils/model'
import { getCoveredRectangle } from '@/utils/geometry'

import SvgCanvas from '@/components/atoms/svg/SvgCanvas'
import SvgTextRectangle from '@/components/molecules/svg/SvgTextRectangle'
import SvgConnector from '@/components/molecules/svg/SvgConnector'
import FloatTextInput from '@/components/molecules/FloatTextInput'
import FloatEditMenu from '@/components/molecules/FloatEditMenu'
import ScaleToolBox from '@/components/molecules/ScaleToolBox'

export default {
  components: {
    SvgCanvas,
    SvgTextRectangle,
    SvgConnector,
    FloatTextInput,
    FloatEditMenu,
    ScaleToolBox
  },
  data: () => ({
    x: 0,
    y: 0,
    scaleRate: 0,
    nodeCursorDownStart: 0,
    nodeCursorClickLast: 0,
    selectedKeys: {},
    nodeSizes: {},

    editTextTarget: null,
    editingText: '',
    editMenuTarget: null
  }),
  props: {
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    nodes: {
      type: Object,
      default: () => ({})
    }
  },
  mounted () {
    this.$nextTick().then(() => {
      this.clearZoom()
    })
  },
  computed: {
    MIN_SCALE_RATE () { return -10 },
    MAX_SCALE_RATE () { return 10 },
    scale: {
      get () {
        return Math.pow(1.1, this.scaleRate)
      },
      set (val) {
        let rate = Math.log(val) / Math.log(1.1)
        if (rate < this.MIN_SCALE_RATE) {
          rate = this.MIN_SCALE_RATE
        }
        if (rate > this.MAX_SCALE_RATE) {
          rate = this.MAX_SCALE_RATE
        }
        this.scaleRate = rate
      }
    },
    editTextTargetPosition () {
      const position = this.nodePositions[this.editTextTarget]
      return {
        x: (position.x - this.x) * this.scale,
        y: (position.y - this.y) * this.scale
      }
    },
    editMenuTargetPosition () {
      const position = this.nodePositions[this.editMenuTarget]
      const nodeHeight = this.$refs[`node_${this.editMenuTarget}`][0].height
      return {
        x: (position.x - this.x) * this.scale - 5,
        y: (position.y - this.y) * this.scale + nodeHeight + 5
      }
    },
    nodePositions () {
      const size = { width: 50, height: 20 }
      const sizes = {}
      Object.keys(this.nodes).forEach(k => {
        sizes[k] = this.nodeSizes[k] || Object.assign({}, size)
      })
      return calcPositions({nodes: this.nodes, sizes, parentKey: 'root'})
    },
    connectors () {
      const ret = {}
      Object.keys(this.nodes).forEach(parentKey => {
        const parent = this.nodes[parentKey]
        const parentPosition = this.nodePositions[parentKey]
        const parentSize = this.nodeSizes[parentKey]
        parent.children.forEach(childKey => {
          const childPosition = this.nodePositions[childKey]
          const childSize = this.nodeSizes[childKey]
          if (parentSize && childSize) {
            ret[`${parentKey}-${childKey}`] = {
              sx: parentPosition.x + parentSize.width,
              sy: parentPosition.y + parentSize.height / 2,
              ex: childPosition.x,
              ey: childPosition.y + childSize.height / 2
            }
          }
        })
      })
      return ret
    }
  },
  watch: {
    scale (from, to) {
      const position = this.$refs.svgCanvas.getPostionAfterChangeScale(this.scale)
      this.x = position.x
      this.y = position.y
    }
  },
  methods: {
    move ({ x, y }) {
      this.x = x
      this.y = y
    },
    zoom ({ scale, x, y }) {
      this.scale = scale
      this.x = x
      this.y = y
    },
    clearZoom () {
      const coveredRec = getCoveredRectangle({
        positions: this.nodePositions,
        sizes: this.nodeSizes
      })
      coveredRec.x -= 20
      coveredRec.y -= 20
      coveredRec.width += 40
      coveredRec.height += 40
      const widthRate = this.width / coveredRec.width
      const heightRate = this.height / coveredRec.height
      this.scale = Math.min(widthRate, heightRate)
      this.$nextTick().then(() => {
        this.x = coveredRec.x
        this.y = coveredRec.y
        if (widthRate < heightRate) {
          this.y -= (this.height / this.scale - coveredRec.height) / 2
        } else {
          this.x -= (this.width / this.scale - coveredRec.width) / 2
        }
      })

    },
    nodeCursorDown (e) {
      this.nodeCursorDownStart = Date.now()
    },
    nodeCursorUp (key) {
      const now = Date.now()
      if (now - this.nodeCursorDownStart < INTERVAL_CLICK) {
        if (now - this.nodeCursorClickLast < INTERVAL_DOUBLE_CLICK) {
          // double click
          this.editTextTarget = key
          this.editingText = this.nodes[key].text
          Vue.set(this.selectedKeys, key, true)
          this.editMenuTarget = null
        } else {
          // single click
          this.toggleSelectNode(key)
        }
        this.nodeCursorClickLast = now
      }
    },
    clearSelect () {
      this.selectedKeys = {}
      this.editTextTarget = null
      this.editMenuTarget = null
      this.editingText = null
    },
    selectNode (key) {
      this.selectedKeys = {
        [key]: true
      }
      this.editMenuTarget = key
    },
    toggleSelectNode (key) {
      if (this.selectedKeys[key]) {
        this.clearSelect()
      } else {
        this.selectNode(key)
      }
    },
    readyEditText (key) {
      this.selectedKeys = {
        [key]: true
      }
      this.editTextTarget = key
      this.editingText = this.nodes[key] ? this.nodes[key].text : ''
      this.editMenuTarget = null
    },
    doneEditText () {
      const target = this.nodes[this.editTextTarget]
      const next = Object.assign({}, target, {
        text: this.editingText
      })
      this.$emit('updateNode', {
        [this.editTextTarget]: next
      })
      this.clearSelect()
    },
    createNode (brother = false) {
      const node = createNode()
      const key = `key_${Math.random()}`
      const updatedNodes = brother ? getUpdatedNodesWhenCreateBrotherdNode({ nodes: this.nodes, brotherKey: this.editMenuTarget, newKey: key }) : getUpdatedNodesWhenCreateChildNode({ nodes: this.nodes, parentKey: this.editMenuTarget, newKey: key })
      this.$emit('updateNode', updatedNodes)
      this.readyEditText(key)
    },
    deleteNode () {
      const updatedNodes = getUpdatedNodesWhenDeleteNode({ nodes: this.nodes, deleteKey: this.editMenuTarget })
      this.$emit('updateNode', updatedNodes)
      this.clearSelect()
    },
    calcSize ({key, size}) {
      Vue.set(this.nodeSizes, key, size)
    }
  }
}
</script>

<style lang="scss" scoped>
.map-canvas-wrapper {
  position: relative;
  display: inline-block;
  .mind-node {
    cursor: pointer;
  }
  .node-text-input {
    position: absolute;
  }
  .scale-tool {
    position: absolute;
    bottom: 5px;
    width: 100%;
    padding: 0 15px 0 5px;
  }
}
</style>

