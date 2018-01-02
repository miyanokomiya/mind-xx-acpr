<template>
<div
  class="map-canvas-wrapper"
>
  <!-- this setting, @mousewheel.prevent, make a event of mousewheel in the canvas better on Safari -->
  <div
    class="canvas-wrapper"
    :tabindex="canWrite ? '1' : ''"
    ref="svgCanvasWrapper"
    @click="getFocus"
    @keydown.self.enter.exact="keydownEnter"
    @keydown.self.enter.shift.exact="keydownShiftEnter"
    @keydown.self.up.exact="moveSelect('up')"
    @keydown.self.down.exact="moveSelect('down')"
    @keydown.self.left.exact="moveSelect('left')"
    @keydown.self.right.exact="moveSelect('right')"
    @keydown.self.up.shift.exact="changeOrder(true)"
    @keydown.self.down.shift.exact="changeOrder()"
    @keydown.self.space.self.exact="keydownSpace"
    @keydown.self.delete.shift.exact="keydownDelete"
    @keydown.self.90.ctrl.exact="$emit('undo')"
    @keydown.self.90.meta.exact="$emit('undo')"
    @keydown.self.90.ctrl.shift.exact="$emit('redo')"
    @keydown.self.90.meta.shift.exact="$emit('redo')"
    @mousewheel.prevent
  >
    <v-icon v-if="!canWrite" class="lock-button">lock</v-icon>
    <SvgCanvas
      ref="svgCanvas"
      :x="x"
      :y="y"
      :width="width"
      :height="height"
      :scale="scale"
      @move="move"
      @zoom="zoom"
      @selectRectangle="selectRectangle"
      @click="clearSelect"
      @mousemove.native="e => $isMobile.any ? '' : canvasCursorMove(e)"
      @mouseup.native="e => $isMobile.any ? '' : canvasCursorUp(e)"
      @touchmove.native="e => $isMobile.any ? canvasCursorMove(e) : ''"
      @touchend.native="e => $isMobile.any ? canvasCursorUp(e) : ''"
    >
      <SvgConnector
        v-for="(connector, i) in connectors"
        :key="i"
        :sx="connector.sx"
        :sy="connector.sy"
        :ex="connector.ex"
        :ey="connector.ey"
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
        :fill="node.backgroundColor"
        :textFill="node.color"
        @calcSize="size => calcSize({key, size})"
        @mousedown.native.prevent="e => canWrite ? ($isMobile.any ? '' : nodeCursorDown(e, key)) : ''"
        @mouseup.native.prevent="e => canWrite ? ($isMobile.any ?  '' : nodeCursorUp(key, {shift: e.shiftKey})) : ''"
        @touchstart.native.prevent="e => canWrite ? ($isMobile.any ? nodeCursorDown(e, key) : '') : ''"
        @touchend.native.prevent="e => canWrite ? ($isMobile.any ?  nodeCursorUp(key, {shift: e.shiftKey}) : '') : ''"
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
        :fill="nodes[key].backgroundColor"
        :textFill="nodes[key].color"
      />
    </SvgCanvas>
  </div>
  <div class="scale-tool" :class="{mobile: $isMobile.any}">
    <ScaleToolBox
      :min="MIN_SCALE_RATE"
      :max="MAX_SCALE_RATE"
      :step="0.1"
      :scaleRate="scaleRate"
      @changeScaleRate="setScaleRateBaseCenter"
      @clearZoom="clearZoom"
    />
  </div>
  <div class="history-tool">
    <HistoryToolBox
      @undo="$emit('undo')"
      @redo="$emit('redo')"
    />
  </div>
  <FloatTextInput
    v-if="editTextTargetNode && movingNodeCount === 0 && !isMultiSelect"
    v-model="editingText"
    :x="editTextTargetPosition.x"
    :y="editTextTargetPosition.y"
    :targetKey="editTextTarget"
    @done="doneEditText"
    @mousewheel.native.prevent="e => $isMobile.any ? '' : mousewheel(e)"
  />
  <FloatEditMenu
    v-if="editMenuTarget && movingNodeCount === 0 && !isMultiSelect"
    :root="editMenuTarget === ROOT_NODE"
    :x="editMenuTargetPosition.x"
    :y="editMenuTargetPosition.y"
    @editText="readyEditText(editMenuTarget)"
    @addBrother="createNode(true)"
    @addChild="createNode(false)"
    @delete="deleteNode"
    @mousewheel.native.prevent="e => $isMobile.any ? '' : mousewheel(e)"
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
  getUpdatedNodesWhenDeleteNodes,
  getUpdatedNodesWhenCreateChildNode,
  getUpdatedNodesWhenCreateBrotherdNode,
  getUpdatedNodesWhenFitClosestParent,
  getParentKey,
  getNodeFrom,
  getUpdatedNodesWhenChangeChildOrder,
  getConnectors,
  getBetterConnector
} from '@/utils/model'
import { getCoveredRectangle, isCoveredRectangle } from '@/utils/geometry'
import * as canvasUtils from '@/utils/canvas'

import SvgCanvas from '@/components/atoms/svg/SvgCanvas'
import SvgRectangle from '@/components/atoms/svg/SvgRectangle'
import SvgTextRectangle from '@/components/molecules/svg/SvgTextRectangle'
import SvgConnector from '@/components/molecules/svg/SvgConnector'
import FloatTextInput from '@/components/molecules/FloatTextInput'
import FloatEditMenu from '@/components/molecules/FloatEditMenu'
import ScaleToolBox from '@/components/molecules/ScaleToolBox'
import HistoryToolBox from '@/components/molecules/HistoryToolBox'

export default {
  components: {
    SvgCanvas,
    SvgRectangle,
    SvgTextRectangle,
    SvgConnector,
    FloatTextInput,
    FloatEditMenu,
    ScaleToolBox,
    HistoryToolBox
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
    },
    fileAuthority: {
      type: Object,
      default: () => ({})
    },
    user: {
      type: Object,
      default: () => ({})
    },
    defaultNodeProps: {
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
    canWrite () {
      if (this.fileAuthority) {
        if (this.fileAuthority.public && this.fileAuthority.public.write) {
          // this file is public and writable
          return true
        }
        const authority = this.fileAuthority.users[this.user.uid]
        return authority && authority.write
      } else {
        return false
      }
    },
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
    },
    isMultiSelect () {
      return Object.keys(this.selectedNodes).length > 1
    }
  },
  watch: {
    selectedNodes (to, from) {
      const keys = Object.keys(to)
      if (keys.indexOf(this.editMenuTarget) === -1) {
        this.editMenuTarget = null
      }
      if (keys.indexOf(this.editTextTarget) === -1) {
        this.editTextTarget = null
      }
    }
  },
  methods: {
    setScaleRateBaseCenter (val) {
      this.scaleRate = val
      const position = this.$refs.svgCanvas.getPostionAfterChangeScale(
        this.scale
      )
      this.x = position.x
      this.y = position.y
    },
    getFocus () {
      this.$refs.svgCanvasWrapper.focus()
    },
    move ({ x, y }) {
      this.x = x
      this.y = y
    },
    zoom ({ scale, x, y }) {
      this.scale = scale
      // this.scale is limited max and min automatically
      // so, 'this.scale' may not be equal 'scale'
      const position = this.$refs.svgCanvas.getPostionAfterChangeScale(
        this.scale,
        { x, y }
      )
      this.x = position.x
      this.y = position.y
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
    nodeCursorUp (key, { shift = false }) {
      const now = Date.now()
      if (now - this.nodeCursorDownStart < INTERVAL_CLICK) {
        if (now - this.nodeCursorClickLast < INTERVAL_DOUBLE_CLICK) {
          // double click
          this.readyEditText(key)
        } else {
          // single click
          this.toggleSelectNode(key, shift)
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
        // reduce frequency of adjusting positions
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
    clearSelectNode (key) {
      this.$emit('setSelectedNodes', Object.assign({}, this.selectedNodes, {
        [key]: false
      }))
      const keys = Object.keys(this.selectedNodes).filter(k => k !== key)
      if (keys.length === 1) {
        this.editMenuTarget = keys[0]
      } else {
        this.editMenuTarget = null
      }
      this.editTextTarget = null
      this.editingText = null
    },
    selectNode (key, multi) {
      if (!this.canWrite) {
        return
      }
      if (multi) {
        this.$emit('setSelectedNodes', Object.assign({}, this.selectedNodes, {
          [key]: true
        }))
      } else {
        this.$emit('setSelectedNodes', {
          [key]: true
        })
      }
      this.editMenuTarget = key
      this.moveViewToCoverSelectedNode(key)
    },
    toggleSelectNode (key, multi) {
      if (this.selectedNodes[key]) {
        this.clearSelectNode(key)
      } else {
        this.selectNode(key, multi)
      }
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
    readyEditText (key) {
      if (!this.canWrite) {
        return
      }
      this.selectNode(key)
      this.editTextTarget = key
      this.editingText = this.nodes[key] ? this.nodes[key].text : ''
      this.editMenuTarget = null
    },
    doneEditText ({ value, targetKey }) {
      const target = this.nodes[targetKey]
      if (target) {
        const next = Object.assign({}, target, {
          text: value
        })
        this.$emit('updateNodes', {
          [targetKey]: next
        })
        this.selectNode(targetKey)
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
      updatedNodes[key] = Object.assign({}, updatedNodes[key], this.defaultNodeProps)
      this.$emit('updateNodes', updatedNodes)
      this.$nextTick().then(() => {
        this.readyEditText(key)
      })
    },
    deleteNode () {
      if (this.isMultiSelect) {
        const updatedNodes = getUpdatedNodesWhenDeleteNodes({
          nodes: this.nodes,
          deleteKeys: this.selectedNodes
        })
        this.$emit('updateNodes', updatedNodes)
        this.clearSelect()
      } else {
        const targetKey = this.editMenuTarget
        if (targetKey) {
          // select the parent if it exists
          const parentKey = getParentKey({
            nodes: this.nodes,
            childKey: targetKey
          })
          if (parentKey) {
            this.selectNode(parentKey)
          }
          const updatedNodes = getUpdatedNodesWhenDeleteNode({
            nodes: this.nodes,
            deleteKey: targetKey
          })
          this.$emit('updateNodes', updatedNodes)
        }
      }
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
    },
    selectRectangle (rectangle) {
      const selectedNodes = Object.keys(this.nodes).reduce((p, c) => {
        const rec = {
          x: this.nodePositions[c].x,
          y: this.nodePositions[c].y,
          width: this.nodeSizes[c].width,
          height: this.nodeSizes[c].height
        }
        const selected = isCoveredRectangle({
          outer: rectangle,
          inner: rec
        })
        if (selected) {
          p[c] = true
        }
        return p
      }, {})
      this.$emit('setSelectedNodes', Object.assign({}, this.selectedNodes, selectedNodes))
    }
  }
}
</script>

<style lang="scss" scoped>
.map-canvas-wrapper {
  position: relative;
  overflow: hidden;

  .canvas-wrapper {
    outline: none;
  }
  .lock-button {
    position: absolute;
    top: 10px;
    right: 0;
  }
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
    bottom: 6px;
    width: 100%;
    padding: 0 90px 0 5px;
  }
  .scale-tool.mobile {
    padding-right: 90px;
  }
  .history-tool {
    position: absolute;
    bottom: 6px;
    right: 6px;
    padding: 0 0 0 5px;
  }
}
</style>

