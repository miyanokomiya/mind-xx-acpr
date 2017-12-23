<template>
<div
  class="map-canvas-wrapper"
  tabindex="1"
  ref="svgCanvasWrapper"
  @keydown.self.enter.exact="keydownEnter"
  @keydown.self.enter.shift.exact="keydownShiftEnter"
  @keydown.self.up.exact="moveSelect('up')"
  @keydown.self.down.exact="moveSelect('down')"
  @keydown.self.left.exact="moveSelect('left')"
  @keydown.self.right.exact="moveSelect('right')"
  @keydown.self.up.shift.exact="changeOrder(true)"
  @keydown.self.down.shift.exact="changeOrder()"
  @keydown.self.space.self.exact="keydownSpace"
  @keydown.self.delete.exact="keydownDelete"
>
  <SvgCanvas
    ref="svgCanvas"
    :x="x"
    :y="y"
    :width="width"
    :height="height"
    :scale="scale"
    @move="move"
    @zoom="zoom"
    @click="clearSelect"
    @mousemove.native="canvasCursorMove"
    @mouseup.native="canvasCursorUp"
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
      :class="{ 'moving-origin': movingNodePositions[key] }"
      v-for="(node, key) in nodes"
      :key="key"
      :ref="`node_${key}`"
      :x="nodePositions[key].x"
      :y="nodePositions[key].y"
      :text="key === editTextTarget ? editingText : node.text"
      :strokeWidth="selectedNodes[key] ? 2 : 1"
      :stroke="selectedNodes[key] ? 'blue' : 'black'"
      fill="yellow"
      @calcSize="size => calcSize({key, size})"
      @mousedown.native="e => nodeCursorDown(e, key)"
      @mouseup.native="nodeCursorUp(key)"
    />
    <SvgTextRectangle
      class="mind-node moving-copy"
      v-for="(positions, key) in movingNodePositions"
      :key="`moving_${key}`"
      :x="positions.x"
      :y="positions.y"
      :text="nodes[key].text"
      :strokeWidth="selectedNodes[key] ? 2 : 1"
      :stroke="selectedNodes[key] ? 'blue' : 'black'"
      fill="yellow"
    />
    <g v-if="connectorOfMovingNodes" class="inserting-marker">
      <SvgConnector
        :sx="connectorOfMovingNodes.sx"
        :sy="connectorOfMovingNodes.sy"
        :ex="connectorOfMovingNodes.ex"
        :ey="connectorOfMovingNodes.ey"
      />
      <SvgRectangle
        :x="connectorOfMovingNodes.ex"
        :y="connectorOfMovingNodes.ey - NODE_MARGIN_Y / 3 / 2"
        :rx="5"
        :ry="5"
        :width="50"
        :height="NODE_MARGIN_Y / 3"
        stroke="none"
        fill="blue"
      />
    </g>
  </SvgCanvas>
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
  <FloatTextInput
    v-if="editTextTargetNode && movingNodeCount === 0"
    v-model="editingText"
    :x="editTextTargetPosition.x"
    :y="editTextTargetPosition.y"
    @blur="doneEditText"
    @done="doneEditText"
    @mousewheel.native.prevent="mousewheel"
  />
  <FloatEditMenu
    v-if="editMenuTarget && movingNodeCount === 0"
    :root="editMenuTarget === ROOT_NODE"
    :x="editMenuTargetPosition.x"
    :y="editMenuTargetPosition.y"
    @addBrother="createNode(true)"
    @addChild="createNode(false)"
    @delete="deleteNode"
    @mousewheel.native.prevent="mousewheel"
  />
</div>
</template>

<script>
import Vue from 'vue'
import firebase from '@/firebase'
import {
  INTERVAL_CLICK,
  INTERVAL_DOUBLE_CLICK,
  NODE_MARGIN_Y,
  ROOT_NODE
} from '@/constants'
import {
  calcPositions,
  getUpdatedNodesWhenDeleteNode,
  getUpdatedNodesWhenCreateChildNode,
  getUpdatedNodesWhenCreateBrotherdNode,
  getUpdatedNodesWhenFitClosestParent,
  getParentKey,
  getNodeFrom,
  getUpdatedNodesWhenChangeChildOrder,
  getConnectors,
  getBetterConnector
} from '@/utils/model'
import { getCoveredRectangle } from '@/utils/geometry'
import * as canvasUtils from '@/utils/canvas'

import SvgCanvas from '@/components/atoms/svg/SvgCanvas'
import SvgRectangle from '@/components/atoms/svg/SvgRectangle'
import SvgTextRectangle from '@/components/molecules/svg/SvgTextRectangle'
import SvgConnector from '@/components/molecules/svg/SvgConnector'
import FloatTextInput from '@/components/molecules/FloatTextInput'
import FloatEditMenu from '@/components/molecules/FloatEditMenu'
import ScaleToolBox from '@/components/molecules/ScaleToolBox'

export default {
  components: {
    SvgCanvas,
    SvgRectangle,
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
    nodeSizes: {},
    beforeMoveP: null,
    movingNodePositions: {},

    editTextTarget: null,
    editingText: '',
    editMenuTarget: null,

    adjustParentWithMovingTimer: null,
    insertInformationOfMovingNodes: null
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
      required: true,
      validator: value => {
        return ROOT_NODE in value
      }
    },
    selectedNodes: {
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
    ROOT_NODE () {
      return ROOT_NODE
    },
    NODE_MARGIN_Y () {
      return NODE_MARGIN_Y
    },
    MIN_SCALE_RATE () {
      return Math.min(Math.log(this.scaleCoveringAllNode) / Math.log(1.1) - 3, -5)
    },
    MAX_SCALE_RATE () {
      return 25
    },
    viewRectangle () {
      return {
        x: this.x,
        y: this.y,
        width: this.width / this.scale,
        height: this.height / this.scale
      }
    },
    nodeCount () {
      return Object.keys(this.nodes).length
    },
    movingNodeCount () {
      return Object.keys(this.movingNodePositions).length
    },
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
    editTextTargetNode () {
      return this.nodes[this.editTextTarget]
    },
    editTextTargetPosition () {
      return this.getFloatMenuPosition(this.editTextTarget, 120)
    },
    editMenuTargetPosition () {
      return this.getFloatMenuPosition(this.editMenuTarget, 80)
    },
    nodePositions () {
      const size = { width: 50, height: 20 }
      const sizes = {}
      Object.keys(this.nodes).forEach(k => {
        sizes[k] = this.nodeSizes[k] || Object.assign({}, size)
      })
      return calcPositions({ nodes: this.nodes, sizes, parentKey: ROOT_NODE })
    },
    connectors () {
      return getConnectors({
        nodes: this.nodes,
        positions: this.nodePositions,
        sizes: this.nodeSizes
      })
    },
    connectorOfMovingNodes () {
      const info = this.insertInformationOfMovingNodes
      if (!info) {
        return
      }
      const movingKey = Object.keys(this.movingNodePositions)[0]
      return getBetterConnector({
        nodes: this.nodes,
        sizes: this.nodeSizes,
        positions: this.nodePositions,
        targetKey: movingKey,
        newParentKey: info.parentKey,
        newChildOrder: info.order
      })
    },
    rectangleCoveringAllNode () {
      const coveredRec = getCoveredRectangle({
        positions: this.nodePositions,
        sizes: this.nodeSizes
      })
      const max = Math.max(coveredRec.width, coveredRec.height)
      // TODO brush better margin
      const margin = max < 300 ? 200 : Math.max(100 - Math.pow(this.nodeCount, 2), 20)
      coveredRec.x -= margin
      coveredRec.y -= margin
      coveredRec.width += margin * 2
      coveredRec.height += margin * 2
      return coveredRec
    },
    scaleCoveringAllNode () {
      const coveredRec = this.rectangleCoveringAllNode
      const widthRate = this.width / coveredRec.width
      const heightRate = this.height / coveredRec.height
      return Math.min(widthRate, heightRate)
    }
  },
  watch: {
    scale (from, to) {
      const position = this.$refs.svgCanvas.getPostionAfterChangeScale(
        this.scale
      )
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
      return new Promise(resolve => {
        const coveredRec = this.rectangleCoveringAllNode
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
          this.$nextTick().then(() => {
            resolve()
          })
        })
      })
    },
    nodeCursorDown (e, key) {
      this.nodeCursorDownStart = Date.now()
      if (key !== ROOT_NODE) {
        const fromNodeDomP = canvasUtils.getPoint(e)
        const nodeDomP = this.$refs.svgCanvas.svg2dom(this.nodePositions[key])
        this.beforeMoveP = {
          x: fromNodeDomP.x + nodeDomP.x,
          y: fromNodeDomP.y + nodeDomP.y
        }
        this.movingNodePositions = {
          [key]: Object.assign({}, this.nodePositions[key])
        }
      }
    },
    nodeCursorUp (key) {
      const now = Date.now()
      if (now - this.nodeCursorDownStart < INTERVAL_CLICK) {
        if (now - this.nodeCursorClickLast < INTERVAL_DOUBLE_CLICK) {
          // double click
          this.readyEditText(key)
        } else {
          // single click
          this.toggleSelectNode(key)
        }
        this.nodeCursorClickLast = now
      }
    },
    canvasCursorMove (e) {
      if (this.beforeMoveP) {
        const p = canvasUtils.getPoint(e)
        const dif = this.$refs.svgCanvas.dom2svgScale({
          x: this.beforeMoveP.x - p.x,
          y: this.beforeMoveP.y - p.y
        })
        Object.keys(this.movingNodePositions).forEach(key => {
          this.movingNodePositions[key].x -= dif.x
          this.movingNodePositions[key].y -= dif.y
        })
        this.beforeMoveP = Object.assign({}, p)
        // reduce frequency of swiching positions
        if (!this.adjustParentWithMovingTimer) {
          this.adjustParentWithMovingTimer = setTimeout(() => {
            this.adjustParentWithMoving()
            this.adjustParentWithMovingTimer = null
          }, 250)
        }
      }
    },
    canvasCursorUp (e) {
      this.adjustParentWithMoving(true)
      this.beforeMoveP = null
      this.movingNodePositions = {}
    },
    adjustParentWithMoving (commit) {
      if (this.movingNodeCount > 0) {
        const targetKey = Object.keys(this.movingNodePositions)[0]
        const nodes = getUpdatedNodesWhenFitClosestParent({
          nodes: this.nodes,
          sizes: this.nodeSizes,
          positions: this.nodePositions,
          targetKey,
          movingPositions: this.movingNodePositions
        })
        const newParentKey = getParentKey({ nodes, childKey: targetKey })
        const newParentNode = nodes[newParentKey]
        this.insertInformationOfMovingNodes = {
          parentKey: newParentKey,
          order: newParentNode.children.indexOf(targetKey)
        }

        if (commit) {
          this.$emit('updateNodes', nodes)
          this.insertInformationOfMovingNodes = null
        }
      }
    },
    clearSelect () {
      this.$emit('clearSelect')
      this.editMenuTarget = null
      this.editTextTarget = null
      this.editingText = null
    },
    selectNode (key) {
      this.$emit('setSelectedNodes', {
        [key]: true
      })
      this.editMenuTarget = key
      this.moveViewToCoverSelectedNode(key)
    },
    moveViewToCoverSelectedNode (key) {
      const node = this.nodes[key]
      if (!node) {
        return
      }
      const position = this.nodePositions[key]
      const size = this.nodeSizes[key]
      if (size) {
        const rec = this.viewRectangle
        const margin = 30 / this.scale
        if (size.width > rec.width || position.x < rec.x + margin) {
          this.x = position.x - margin
        } else if (position.x + size.width > rec.x + rec.width - margin) {
          this.x = position.x + size.width + margin - rec.width
        }
        if (size.height > rec.height || position.y < rec.y + margin) {
          this.y = position.y - margin
        } else if (position.y + size.height > rec.y + rec.height - margin) {
          this.y = position.y + size.height + margin * 3 - rec.height
        }
      } else {
        this.$nextTick().then(() => {
          this.moveViewToCoverSelectedNode(key)
        })
      }
    },
    toggleSelectNode (key) {
      if (this.selectedNodes[key]) {
        this.clearSelect()
      } else {
        this.selectNode(key)
      }
    },
    readyEditText (key) {
      this.selectNode(key)
      this.editTextTarget = key
      this.editingText = this.nodes[key] ? this.nodes[key].text : ''
      this.editMenuTarget = null
    },
    doneEditText () {
      if (this.editTextTarget) {
        const target = this.nodes[this.editTextTarget]
        const next = Object.assign({}, target, {
          text: this.editingText
        })
        this.$emit('updateNodes', {
          [this.editTextTarget]: next
        })
        this.editMenuTarget = this.editTextTarget
        this.editTextTarget = null
        this.editingText = null
        this.$refs.svgCanvasWrapper.focus()
      }
    },
    createNode (brother = false) {
      if (this.editMenuTarget === ROOT_NODE) {
        brother = false
      }
      const key = firebase
        .database()
        .ref()
        .push().getKey()
      const updatedNodes = brother
        ? getUpdatedNodesWhenCreateBrotherdNode({
            nodes: this.nodes,
            brotherKey: this.editMenuTarget,
            newKey: key
          })
        : getUpdatedNodesWhenCreateChildNode({
            nodes: this.nodes,
            parentKey: this.editMenuTarget,
            newKey: key
          })
      this.$emit('updateNodes', updatedNodes)
      this.$nextTick().then(() => {
        this.readyEditText(key)
      })
    },
    deleteNode () {
      if (this.editMenuTarget) {
        const updatedNodes = getUpdatedNodesWhenDeleteNode({
          nodes: this.nodes,
          deleteKey: this.editMenuTarget
        })
        this.$emit('updateNodes', updatedNodes)
      }
      this.clearSelect()
    },
    calcSize ({ key, size }) {
      Vue.set(this.nodeSizes, key, size)
    },
    keydownEnter () {
      if (this.editMenuTarget && !this.editTextTarget) {
        this.createNode(true)
      }
    },
    keydownShiftEnter () {
      if (this.editMenuTarget && !this.editTextTarget) {
        this.createNode()
      }
    },
    keydownSpace () {
      if (this.editMenuTarget) {
        this.readyEditText(this.editMenuTarget)
      }
    },
    keydownDelete () {
      this.deleteNode()
    },
    moveSelect (to) {
      const targetKey = this.editMenuTarget
      if (targetKey) {
        const toKey = getNodeFrom({ nodes: this.nodes, to, targetKey })
        if (toKey) {
          this.selectNode(toKey)
        }
      }
    },
    changeOrder (up = false) {
      const updatedNodes = getUpdatedNodesWhenChangeChildOrder({
        nodes: this.nodes,
        childKey: this.editMenuTarget,
        dif: up ? -1 : 1
      })
      this.$emit('updateNodes', updatedNodes)
    },
    mousewheel (e) {
      this.$refs.svgCanvas.canvasWheel(e)
    },
    getFloatMenuPosition (key, bottom) {
      const position = this.nodePositions[key]
      const size = this.nodeSizes[key]
      const viewBottom = (this.viewRectangle.y + this.viewRectangle.height - this.y) * this.scale
      const nodeViewY = (position.y - this.y) * this.scale
      const nodeViewBottom = (position.y - this.y + size.height) * this.scale
      let y = Math.min(nodeViewBottom, viewBottom - bottom) + 5
      y = Math.max(y, nodeViewY)
      const viewLeft = (this.viewRectangle.x - this.x) * this.scale
      const nodeViewX = (position.x - this.x) * this.scale
      const nodeViewRight = (position.x + size.width - this.x) * this.scale
      let x = Math.max(nodeViewX, viewLeft + 20) - 5
      x = Math.min(x, nodeViewRight)
      return { x, y }
    }
  }
}
</script>

<style lang="scss" scoped>
.map-canvas-wrapper {
  position: relative;
  display: inline-block;
  overflow: hidden;
  outline: none;
  .mind-node {
    cursor: pointer;
  }
  .mind-node.moving-origin {
    opacity: 0.2;
  }
  .mind-node.moving-copy {
    opacity: 0.5;
    pointer-events: none;
  }
  .inserting-marker {
    opacity: 0.5;
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

