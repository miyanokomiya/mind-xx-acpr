<template>
<div
  class="map-canvas-wrapper"
  @mouseup="e => $isMobile.any ? '' : canvasCursorUp()"
  @touchend="e => $isMobile.any ? canvasCursorUp() : ''"
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
      @touchmove.native="e => $isMobile.any ? canvasCursorMove(e) : ''"
    >
      <!-- connectors of dependencies -->
      <SvgBridgeConnector
        v-for="(connector, i) in dependencyConnectors"
        :key="i"
        :sx="connector.sx"
        :sy="connector.sy"
        :ex="connector.ex"
        :ey="connector.ey"
        :selected="selectedDependencyConnector[i]"
      />
      <!-- connectors of family -->
      <SvgConnector
        v-for="(connector, key) in connectors"
        v-if="isShowConnectors[key]"
        :key="key"
        :sx="connector.sx"
        :sy="connector.sy"
        :ex="connector.ex"
        :ey="connector.ey"
      />
      <!-- standard nodes -->
      <SvgTextRectangle
        class="mind-node"
        :class="{ 'moving-origin': movingNodePositions[key] }"
        v-for="(node, key) in nodes"
        v-if="isShowNodes[key]"
        :key="key"
        :x="nodePositions[key].x"
        :y="nodePositions[key].y"
        :text="key === editTextTarget ? editingText : node.text"
        :strokeWidth="getStrokeWidth(key)"
        :stroke="getStrokeColor(key)"
        :fill="node.backgroundColor"
        :textFill="node.color"
        :hiddenFamilyCount="closedNodeFamilyCounts[key]"
        :commentCount="commentCounts[key]"
        :childrenCount="node.children.length"
        :root="key === ROOT_NODE"
        :checked="node.checked"
        @calcSize="size => calcSize({key, size})"
        @down="e => canWrite ? nodeCursorDown(e, key) : ''"
        @up="e => canWrite ? nodeCursorUp(key, {shift: e.shiftKey}) : ''"
        @open="openNode(key)"
        @close="closeNode(key)"
        @clickComment="showComments(key)"
        @toggleChecked="val => updateChecked({ key, val })"
      />
      <!-- a marker of switching a parent -->
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
          :width="CONNECTOR_MARKER_WIDTH"
          :height="NODE_MARGIN_Y / 3"
          stroke="none"
          fill="blue"
        />
      </g>
      <!-- moving shadow of switching a parent -->
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
        :hiddenFamilyCount="closedNodeFamilyCounts[key]" 
        :commentCount="commentCounts[key]"     
        :childrenCount="nodes[key].children.length"  
        :checked="nodes[key].checked"
      />
    </SvgCanvas>
  </div>
  <div class="scale-tool">
    <ScaleToolBox
      :min="MIN_SCALE_RATE"
      :max="MAX_SCALE_RATE"
      :step="0.1"
      :scaleRate="scaleRate"
      @changeScaleRate="setScaleRateBaseCenter"
      @clearZoom="clearZoom"
    />
  </div>
  <div class="history-tool" v-if="canWrite">
    <HistoryToolBox
      @undo="$emit('undo')"
      @redo="$emit('redo')"
    />
  </div>
  <ToggleCloseButton
    v-if="showEditMenu && editMenuTargetNode.children.length > 0 && editMenuTarget !== ROOT_NODE"
    :x="fixTopBoxPosition.x"
    :y="fixTopBoxPosition.y"
    :closed="editMenuTargetNode.closed"
    @open="openNode(editMenuTarget)"
    @close="closeNode(editMenuTarget)"
    @mousewheel.native.prevent="e => $isMobile.any ? '' : mousewheel(e)"
  />
  <FloatButton
    v-if="showEditMenu"
    :x="fixTopBoxPosition.x - fixButtonMargin"
    :y="fixTopBoxPosition.y"
    @click="deleteNode"
    @mousewheel.native.prevent="e => $isMobile.any ? '' : mousewheel(e)"
  >
    <v-icon>delete</v-icon>
  </FloatButton>
  <FloatButton
    v-if="showEditMenu"
    :x="fixTopBoxPosition.x + fixButtonMargin"
    :y="fixTopBoxPosition.y"
    color="indigo"
    @click="readyEditText(editMenuTarget)"
    @mousewheel.native.prevent="e => $isMobile.any ? '' : mousewheel(e)"
  >
    <v-icon>edit</v-icon>
  </FloatButton>
  <FloatButton
    v-if="showEditMenu && !isOppositeEditTarget && editMenuTarget !== ROOT_NODE"
    :x="fixBottomBoxPosition.x - fixButtonMargin"
    :y="fixBottomBoxPosition.y"
    :color="mode === CANVAS_MODE.DEPENDENCY ? 'deep-orange' : 'indigo'"
    @click="editDependency"
    @mousewheel.native.prevent="e => $isMobile.any ? '' : mousewheel(e)"
  >
    <v-icon>call_missed</v-icon>
  </FloatButton>
  <FloatButton
    v-if="showEditMenu && isOppositeEditTarget && editMenuTarget !== ROOT_NODE"
    :x="fixBottomBoxPosition.x + fixButtonMargin"
    :y="fixBottomBoxPosition.y"
    :color="mode === CANVAS_MODE.DEPENDENCY ? 'deep-orange' : 'indigo'"
    @click="editDependency"
    @mousewheel.native.prevent="e => $isMobile.any ? '' : mousewheel(e)"
  >
    <v-icon>call_missed_outgoing</v-icon>
  </FloatButton>
  <FloatButton
    v-if="showEditMenu && editMenuTarget === ROOT_NODE"
    :x="fixBottomBoxPosition.x - fixButtonMargin"
    :y="fixBottomBoxPosition.y"
    color="indigo"
    @click="createNode(false, true)"
    @mousewheel.native.prevent="e => $isMobile.any ? '' : mousewheel(e)"
  >
    <v-icon>subdirectory_arrow_left</v-icon>
  </FloatButton>
  <FloatButton
    v-if="showEditMenu && editMenuTarget !== ROOT_NODE"
    :x="fixBottomBoxPosition.x"
    :y="fixBottomBoxPosition.y"
    color="indigo"
    @click="createNode(true)"
    @mousewheel.native.prevent="e => $isMobile.any ? '' : mousewheel(e)"
  >
    <v-icon>add</v-icon>
  </FloatButton>
  <FloatButton
    v-if="showEditMenu && !isOppositeEditTarget"
    :x="fixBottomBoxPosition.x + fixButtonMargin"
    :y="fixBottomBoxPosition.y"
    color="indigo"
    @click="createNode(false)"
    @mousewheel.native.prevent="e => $isMobile.any ? '' : mousewheel(e)"
  >
    <v-icon>subdirectory_arrow_right</v-icon>
  </FloatButton>
  <FloatButton
    v-if="showEditMenu && isOppositeEditTarget && editMenuTarget !== ROOT_NODE"
    :x="fixBottomBoxPosition.x - fixButtonMargin"
    :y="fixBottomBoxPosition.y"
    color="indigo"
    @click="createNode(false)"
    @mousewheel.native.prevent="e => $isMobile.any ? '' : mousewheel(e)"
  >
    <v-icon>subdirectory_arrow_left</v-icon>
  </FloatButton>
  <FloatTextInput
    ref="floatTextInput"
    v-if="showTextInput"
    v-model="editingText"
    :targetKey="editTextTarget"
    @done="doneEditText"
    @mousewheel.native.prevent="e => $isMobile.any ? '' : mousewheel(e)"
  />
  <FloatEditMenu
    ref="floatEditMenu"
    v-if="showEditMenu"
    :check="editMenuTargetNode.checked !== -1"
    @selectProp="prop => $emit('selectProp', prop)"
    @toggleCheck="toggleCheck"
    @mousewheel.native.prevent="e => $isMobile.any ? '' : mousewheel(e)"
  />
  <CommentList
    class="comment-list"
    v-show="showEditMenu"
    ref="commentList"
    :comments="targetNodeComments"
    :users="users"
    :user="user"
    @postComment="postComment"
  />
  <v-snackbar
    bottom
    right
    :timeout="2000"
    v-model="comfirmDelete"
  >
    One more click to delete.
  </v-snackbar>
</div>
</template>

<script>
import Vue from 'vue'
import firebase from '@/firebase'
import {
  INTERVAL_CLICK,
  INTERVAL_DOUBLE_CLICK,
  NODE_MARGIN_Y,
  ROOT_NODE,
  CANVAS_MODE,
  CONNECTOR_MARKER_WIDTH
} from '@/constants'
import {
  calcPositions,
  getUpdatedNodesWhenDeleteNode,
  getUpdatedNodesWhenDeleteNodes,
  getUpdatedNodesWhenCreateChildNode,
  getUpdatedNodesWhenCreateBrotherdNode,
  getUpdatedNodesWhenFitClosestParent,
  getParentKey,
  getFamilyKeys,
  getNearestFamilyKey,
  getNodeFrom,
  getUpdatedNodesWhenChangeChildOrder,
  getConnectors,
  getDependencyConnectors,
  getBetterConnector,
  getHiddenNodes,
  createComment,
  isOpposite
} from '@/utils/model'
import { getCoveredRectangle, isCoveredRectangle } from '@/utils/geometry'
import * as canvasUtils from '@/utils/canvas'

import SvgCanvas from '@/components/atoms/svg/SvgCanvas'
import SvgRectangle from '@/components/atoms/svg/SvgRectangle'
import SvgTextRectangle from '@/components/molecules/svg/SvgTextRectangle'
import SvgConnector from '@/components/molecules/svg/SvgConnector'
import SvgBridgeConnector from '@/components/molecules/svg/SvgBridgeConnector'
import FloatTextInput from '@/components/molecules/FloatTextInput'
import FloatEditMenu from '@/components/molecules/FloatEditMenu'
import ScaleToolBox from '@/components/molecules/ScaleToolBox'
import HistoryToolBox from '@/components/molecules/HistoryToolBox'
import ToggleCloseButton from '@/components/molecules/ToggleCloseButton'
import FloatButton from '@/components/molecules/FloatButton'
import CommentList from './CommentList'

export default {
  name: 'MapCanvas',
  components: {
    SvgCanvas,
    SvgRectangle,
    SvgTextRectangle,
    SvgConnector,
    SvgBridgeConnector,
    FloatTextInput,
    FloatEditMenu,
    ScaleToolBox,
    HistoryToolBox,
    ToggleCloseButton,
    FloatButton,
    CommentList
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
    floatEditMenuWidth: 0,
    floatTextInputWidth: 0,
    mode: CANVAS_MODE.NORMAL,

    adjustParentWithMovingTimer: null,
    insertInformationOfMovingNodes: null,
    comfirmDelete: false
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
    },
    canWrite: {
      type: Boolean,
      default: false
    },
    comments: {
      type: Object,
      default: () => ({})
    },
    users: {
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
    ROOT_NODE: () => ROOT_NODE,
    NODE_MARGIN_Y: () => NODE_MARGIN_Y,
    CONNECTOR_MARKER_WIDTH: () => CONNECTOR_MARKER_WIDTH,
    MIN_SCALE_RATE () {
      return Math.min(Math.log(this.scaleCoveringAllNode) / Math.log(1.1) - 3, -5)
    },
    MAX_SCALE_RATE: () => 15,
    CANVAS_MODE: () => CANVAS_MODE,
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
    showTextInput () {
      return this.editTextTargetNode && this.movingNodeCount === 0 && !this.isMultiSelect
    },
    showEditMenu () {
      return this.editMenuTarget && this.movingNodeCount === 0
    },
    editTextTargetNode () {
      return this.nodes[this.editTextTarget]
    },
    editMenuTargetNode () {
      return this.nodes[this.editMenuTarget]
    },
    editDependencyTarget () {
      return this.mode === CANVAS_MODE.DEPENDENCY ? this.editMenuTarget : null
    },
    editTargetPosition () {
      const key = this.editMenuTarget
      if (key) {
        const position = this.nodePositions[key]
        const x = (position.x - this.x) * this.scale
        const y = (position.y - this.y) * this.scale
        return { x, y }
      } else {
        return null
      }
    },
    isOppositeEditTarget () {
      if (!this.editMenuTarget) {
        return false
      }
      return isOpposite({
        size: this.nodeSizes[this.editMenuTarget],
        position: this.nodePositions[this.editMenuTarget]
      })
    },
    fixLeftBoxPosition () {
      const key = this.editMenuTarget
      if (key) {
        const size = this.nodeSizes[key]
        const position = this.editTargetPosition
        return {
          x: position.x - 19,
          y: position.y - 28 / 2 + size.height / 2 * this.scale
        }
      } else {
        return null
      }
    },
    fixTopBoxPosition () {
      const key = this.editMenuTarget
      if (key) {
        const size = this.nodeSizes[key]
        const position = this.editTargetPosition
        return {
          x: position.x - 2 + size.width / 2 * this.scale,
          y: position.y - 29
        }
      } else {
        return null
      }
    },
    fixBottomBoxPosition () {
      const key = this.editMenuTarget
      if (key) {
        const size = this.nodeSizes[key]
        const position = this.editTargetPosition
        return {
          x: position.x - 2 + size.width / 2 * this.scale,
          y: position.y + 1 + size.height * this.scale
        }
      } else {
        return null
      }
    },
    fixButtonMargin () {
      return 36
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
    dependencyConnectors () {
      return getDependencyConnectors({
        nodes: this.nodes,
        positions: this.nodePositions,
        sizes: this.nodeSizes
      })
    },
    selectedDependencyConnector () {
      return Object.keys(this.dependencyConnectors).reduce((p, key) => {
        const dependency = this.dependencyConnectors[key]
        let selected = false
        if (this.selectedNodes[dependency.from] || this.selectedNodes[dependency.to]) {
          selected = true
        }
        return {
          ...p,
          [key]: selected
        }
      }, {})
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
        newChildOrder: info.order,
        opposite: info.opposite
      })
    },
    rectangleCoveringAllNode () {
      const positions = {}
      const sizes = {}
      Object.keys(this.nodes).forEach(key => {
        // remove hidden nodes
        if (!this.hiddenNodes[key]) {
          positions[key] = this.nodePositions[key]
          sizes[key] = this.nodeSizes[key]
        }
      })
      const coveredRec = getCoveredRectangle({
        positions,
        sizes
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
    },
    isShowNodes () {
      return Object.keys(this.nodes).reduce((p, key) => {
        const position = this.nodePositions[key]
        const size = this.nodeSizes[key]
        if (!size || !position) {
          // The node that has not been calculated its size and position should be rendered and calc them.
          p[key] = true
        } else {
          if (!this.hiddenNodes[key]) {
            // If the sizes of nodes that are not rendered are changed they do not reflect until they are rendered.
            const left = position.x
            const right = left + size.width
            const top = position.y
            const bottom = top + size.height
            if (this.isInViewBox({ left, right, top, bottom })) {
              p[key] = true
            }
          }
        }
        return p
      }, {})
    },
    isShowConnectors () {
      return Object.keys(this.connectors).reduce((p, key) => {
        const connector = this.connectors[key]
        const left = Math.min(connector.sx, connector.ex)
        const right = Math.max(connector.sx, connector.ex)
        const top = Math.min(connector.sy, connector.ey)
        const bottom = Math.max(connector.sy, connector.ey)
        if (this.isInViewBox({ left, right, top, bottom })) {
          p[key] = true
        }
        return p
      }, {})
    },
    hiddenNodes () {
      return getHiddenNodes({ nodes: this.nodes })
    },
    closedNodeFamilyCounts () {
      return Object.keys(this.nodes).reduce((p, key) => {
        const node = this.nodes[key]
        if (node.closed) {
          const familyKeys = getFamilyKeys({ nodes: this.nodes, parentKey: key })
          p[key] = familyKeys.length
        }
        return p
      }, {})
    },
    targetNodeComments () {
      return Object.keys(this.comments).reduce((p, key) => {
        const comment = this.comments[key]
        if (comment.nodeId === this.editMenuTarget) {
          p[key] = comment
        }
        return p
      }, {})
    },
    commentCounts () {
      return Object.keys(this.comments).reduce((p, c) => {
        const comment = this.comments[c]
        if (comment.nodeId in p) {
          p[comment.nodeId]++
        } else {
          p[comment.nodeId] = 1
        }
        return p
      }, {})
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
    },
    showTextInput (to) {
      if (to) {
        this.$nextTick().then(() => {
          const menu = this.$refs.floatTextInput
          this.floatTextInputWidth = menu.$el.clientWidth
        })
      }
    },
    showEditMenu (to) {
      if (to) {
        this.$nextTick().then(() => {
          const menu = this.$refs.floatEditMenu
          this.floatEditMenuWidth = menu.$el.clientWidth
        })
      }
    }
  },
  methods: {
    isInViewBox ({ left, right, top, bottom }) {
      const viewRectangle = this.viewRectangle
      if (left <= viewRectangle.x + viewRectangle.width &&
          right >= viewRectangle.x &&
          top <= viewRectangle.y + viewRectangle.height &&
          bottom >= viewRectangle.y) {
        return true
      } else {
        return false
      }
    },
    getStrokeWidth (key) {
      if (this.selectedNodes[key]) {
        return 2
      }
      if (this.editDependencyTarget === key) {
        return 2
      }
      return 1
    },
    getStrokeColor (key) {
      if (this.editDependencyTarget === key) {
        return 'tomato'
      }
      if (this.selectedNodes[key]) {
        return 'blue'
      }
      return 'black'
    },
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
      if (this.$refs.svgCanvas) {
        this.$refs.svgCanvas.stopProgressiveMove()
      }
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
      this.getFocus()
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
        if (this.editDependencyTarget) {
          this.toggleDependency({
            from: this.editDependencyTarget,
            to: key
          })
        } else {
          if (now - this.nodeCursorClickLast < INTERVAL_DOUBLE_CLICK) {
            // double click
            this.readyEditText(key)
          } else {
            // single click
            this.toggleSelectNode(key, shift)
          }
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
    canvasCursorUp () {
      if (this.$refs.svgCanvas) {
        this.$refs.svgCanvas.canvasCursorUp()
      }
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
        const opposite = isOpposite({
          size: this.nodeSizes[targetKey],
          position: this.movingNodePositions[targetKey]
        })
        const childList =
          opposite && newParentKey === ROOT_NODE ? 'oppositeChildren' : 'children'
        this.insertInformationOfMovingNodes = {
          parentKey: newParentKey,
          order: newParentNode[childList].indexOf(targetKey),
          opposite
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
      this.editingText = ''
      this.mode = CANVAS_MODE.NORMAL
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
      this.editingText = ''
      this.mode = CANVAS_MODE.NORMAL
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
      this.mode = CANVAS_MODE.NORMAL
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
        this.editingText = ''
        this.$refs.svgCanvasWrapper.focus()
      }
    },
    createNode (brother = false, opposite = false) {
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
            newKey: key,
            opposite
          })
      updatedNodes[key] = {
        ...updatedNodes[key],
        ...this.defaultNodeProps,
        checked: this.editMenuTargetNode.checked === -1 ? -1 : 0
      }
      this.$emit('updateNodes', updatedNodes)
      this.$nextTick().then(() => {
        this.readyEditText(key)
      })
    },
    deleteNode () {
      if (!this.comfirmDelete) {
        this.comfirmDelete = true
        return
      }
      this.comfirmDelete = false
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
          // select the nearest family if it exists
          const parentKey = getNearestFamilyKey({
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
        if (this.editMenuTarget === ROOT_NODE) {
          this.createNode(false, true)  
        } else {
          this.createNode()
        }
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
        if (to === 'right' || to === 'left') {
          if (isOpposite({size: this.nodeSizes[targetKey], position: this.nodePositions[targetKey]})) {
            to = to === 'right' ? 'left' : 'right'
          }
        }
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
    selectRectangle (rectangle) {
      const selectedNodes = Object.keys(this.nodes).reduce((p, c) => {
        if (!this.hiddenNodes[c]) {
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
            this.editMenuTarget = c
          }
        }
        return p
      }, {})
      this.$emit('setSelectedNodes', Object.assign({}, this.selectedNodes, selectedNodes))
    },
    editDependency () {
      this.mode = this.mode === CANVAS_MODE.DEPENDENCY ? CANVAS_MODE.NORMAL : CANVAS_MODE.DEPENDENCY
    },
    toggleDependency ({ from, to }) {
      if (from === to) {
        return
      }
      const fromNode = this.nodes[from]
      const toNode = this.nodes[to]
      if (fromNode && toNode) {
        const updated = {
          ...fromNode,
          dependencies: {
            ...fromNode.dependencies
          }
        }
        if (fromNode.dependencies[to]) {
          delete updated.dependencies[to]
        } else {
          updated.dependencies[to] = true
        }
        this.$emit('updateNodes', { [from]: updated })
      }
    },
    openNode (key) {
      const node = this.nodes[key]
      this.$emit('updateNodes', { [key]: {
        ...node,
        closed: false
      } })
    },
    closeNode (key) {
      // clear other selections
      if (this.selectedNodes[key]) {
        this.selectNode(key)
      } else {
        this.clearSelect()
      }
      const node = this.nodes[key]
      this.$emit('updateNodes', { [key]: {
        ...node,
        closed: true
      } })
    },
    postComment ({ comment, key }) {
      const nodeId = this.editMenuTarget
      if (nodeId) {
        const _key = key || firebase
          .database()
          .ref()
          .push().getKey()
        const updatedComment = comment ? createComment({
          ...comment,
          uid: this.user.uid,
          nodeId
        }) : null
        this.$emit('postComment', {
          comment: updatedComment,
          key: _key
        })
      }
    },
    showComments (key) {
      this.selectNode(key)
      this.$refs.commentList.open = true
    },
    toggleCheck () {
      const updatedChecked = this.editMenuTargetNode.checked === -1 ? 0 : -1
      const nodes = Object.keys(this.selectedNodes).reduce((p, c) => {
        const node = this.nodes[c]
        p[c] = {
          ...node,
          checked: updatedChecked === -1 ? -1 : (node.checked === 1 ? 1 : 0)
        }
        return p
      }, {})
      this.$emit('updateNodes', nodes)
    },
    updateChecked ({ key, val }) {
      const node = this.nodes[key]
      this.$emit('updateNodes', {
        [key]: {
          ...node,
          checked: val
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/responsive';

.map-canvas-wrapper {
  position: relative;
  overflow: hidden;

  .canvas-wrapper {
    outline: none;
    user-select: none;
  }
  .lock-button {
    position: absolute;
    top: 10px;
    right: 0;
  }
  .mind-node {
    cursor: pointer;

    &.moving-origin {
      opacity: 0.2;
    }
    &.moving-copy {
      opacity: 0.5;
      pointer-events: none;
    }
  }
  .inserting-marker {
    opacity: 0.5;
  }
  .node-text-input {
    position: absolute;
  }
  .scale-tool, .history-tool {
    position: absolute;
    bottom: 6px;
    padding: 0 0 0 5px;
  }
  .scale-tool {
    width: 100%;
    padding-right: 90px;
  }
  .history-tool {
    right: 6px;
  }
  .comment-list {
    position: absolute;
    right: 0;
    top: 34px;
    max-height: calc(100% - 34px - 44px);
    width: 260px;
    overflow: auto;
    border-radius: 4px;

    @include mq-down() {
      width: 100%;
      max-height: 50%;
    }
  }
}
</style>

