<template>
<div class="map-canvas-wrapper">
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
      :text="node.text"
      :strokeWidth="selectedNodes[key] ? 2 : 1"
      :stroke="selectedNodes[key] ? 'blue' : 'black'"
      fill="yellow"
      @calcSize="size => calcSize({key, size})"
      @mousedown.native="e => nodeCursorDown(e, key)"
      @mouseup.native="nodeCursorUp(key)"
      @keyup.native="$emit('createNode', {from: key})"
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
  />
  <FloatEditMenu
    v-if="editMenuTarget && movingNodeCount === 0"
    :root="editMenuTarget === 'root'"
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
import { INTERVAL_CLICK, INTERVAL_DOUBLE_CLICK, NODE_MARGIN_X, NODE_MARGIN_Y } from '@/constants'
import {
  calcPositions,
  getUpdatedNodesWhenDeleteNode,
  getUpdatedNodesWhenCreateChildNode,
  getUpdatedNodesWhenCreateBrotherdNode,
  getUpdatedNodesWhenFitClosestParent,
  getParentKey
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
      default: () => ({})
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
    NODE_MARGIN_Y () { return NODE_MARGIN_Y },
    MIN_SCALE_RATE () { return -10 },
    MAX_SCALE_RATE () { return 25 },
    canvasHeight () {
      return this.$window.height - 64
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
    },
    connectorOfMovingNodes () {
      const info = this.insertInformationOfMovingNodes
      if (!info) {
        return
      }
      const movingKey = Object.keys(this.movingNodePositions)[0]
      const parentNode = this.nodes[info.parentKey]
      if (parentNode.children[info.order] === movingKey) {
        return
      }
      const parentPosition = this.nodePositions[info.parentKey]
      const parentSize = this.nodeSizes[info.parentKey]
      const start = {
        sx: parentPosition.x + parentSize.width,
        sy: parentPosition.y + parentSize.height / 2
      }
      if (parentNode.children.length === 0) {
        return Object.assign({}, start, {
          ex: start.sx + NODE_MARGIN_X,
          ey: start.sy
        })
      }
      let order = info.order
      const movingTargetIndex = parentNode.children.indexOf(movingKey)
      if (movingTargetIndex !== -1) {
        if (movingTargetIndex < order) {
          order++
        }
      }
      if (parentNode.children.length > order) {
        const youngerBrotherKey = parentNode.children[order]
        const youngerBrotherPosition = this.nodePositions[youngerBrotherKey]
        return Object.assign({}, start, {
          ex: youngerBrotherPosition.x,
          ey: youngerBrotherPosition.y - NODE_MARGIN_Y / 2
        })
      } else {
        const elderBrotherKey = parentNode.children[order - 1]
        const elderBrotherPosition = this.nodePositions[elderBrotherKey]
        const elderBrotherSize = this.nodeSizes[elderBrotherKey]
        return Object.assign({}, start, {
          ex: elderBrotherPosition.x,
          ey: elderBrotherPosition.y + elderBrotherSize.height + NODE_MARGIN_Y / 2
        })
      }
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
      // TODO brush better margin
      const margin = Math.max(100 - Math.pow(this.nodeCount, 2), 20)
      coveredRec.x -= margin
      coveredRec.y -= margin
      coveredRec.width += margin * 2
      coveredRec.height += margin * 2
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
    nodeCursorDown (e, key) {
      this.nodeCursorDownStart = Date.now()
      if (key !== 'root') {
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
          this.editTextTarget = key
          this.editingText = this.nodes[key].text
          this.selectNode(key)
          this.editMenuTarget = null
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
      this.editTextTarget = null
      this.editMenuTarget = null
      this.editingText = null
    },
    selectNode (key) {
      this.$emit('setSelectedNodes', {
        [key]: true
      })
      this.editMenuTarget = key
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
      const target = this.nodes[this.editTextTarget]
      const next = Object.assign({}, target, {
        text: this.editingText
      })
      this.$emit('updateNodes', {
        [this.editTextTarget]: next
      })
      this.clearSelect()
    },
    createNode (brother = false) {
      const key = `key_${Math.random()}`
      const updatedNodes = brother ? getUpdatedNodesWhenCreateBrotherdNode({ nodes: this.nodes, brotherKey: this.editMenuTarget, newKey: key }) : getUpdatedNodesWhenCreateChildNode({ nodes: this.nodes, parentKey: this.editMenuTarget, newKey: key })
      this.$emit('updateNodes', updatedNodes)
      this.readyEditText(key)
    },
    deleteNode () {
      const updatedNodes = getUpdatedNodesWhenDeleteNode({ nodes: this.nodes, deleteKey: this.editMenuTarget })
      this.$emit('updateNodes', updatedNodes)
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
  overflow: hidden;
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

