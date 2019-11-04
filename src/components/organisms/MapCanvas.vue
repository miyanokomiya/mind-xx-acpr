<template>
  <div
    class="map-canvas-wrapper"
    @mouseup="e => ($isMobile.any ? '' : canvasCursorUp())"
    @touchend="e => ($isMobile.any ? canvasCursorUp() : '')"
  >
    <!-- this setting, @wheel.prevent, make a event of wheel in the canvas better on Safari -->
    <div
      class="canvas-wrapper"
      :tabindex="canWrite ? '1' : ''"
      ref="svgCanvasWrapper"
      @click="getFocus"
      @keydown.self.enter.exact.prevent="keydownEnter"
      @keydown.self.enter.shift.exact.prevent="keydownShiftEnter"
      @keydown.self.up.exact.prevent="moveSelect('up')"
      @keydown.self.down.exact.prevent="moveSelect('down')"
      @keydown.self.left.exact.prevent="moveSelect('left')"
      @keydown.self.right.exact.prevent="moveSelect('right')"
      @keydown.self.up.shift.exact.prevent="changeOrder(true)"
      @keydown.self.down.shift.exact.prevent="changeOrder()"
      @keydown.self.space.self.exact.prevent="keydownSpace"
      @keydown.self.delete.shift.exact.prevent="keydownDelete"
      @keydown.self.90.ctrl.exact.prevent="$emit('undo')"
      @keydown.self.90.meta.exact.prevent="$emit('undo')"
      @keydown.self.90.ctrl.shift.exact.prevent="$emit('redo')"
      @keydown.self.90.meta.shift.exact.prevent="$emit('redo')"
      @wheel.prevent
    >
      <v-icon v-if="!canWrite" class="lock-button">lock</v-icon>
      <SvgCanvas
        ref="svgCanvas"
        :x="x"
        :y="y"
        :width="width"
        :height="height"
        :scale="scale"
        :disabledProgressiveMove="disabledProgressiveMove"
        @move="move"
        @zoom="zoom"
        @selectRectangle="selectRectangle"
        @click="clearSelect"
        @mousemove.native="e => ($isMobile.any ? '' : canvasCursorMove(e))"
        @touchmove.native="e => ($isMobile.any ? canvasCursorMove(e) : '')"
      >
        <!-- family rectangles -->
        <SvgRectangle
          v-for="(rect, i) in sortedFamilyRectangles"
          :key="`grouping_${i}`"
          :x="rect.x"
          :y="rect.y"
          :rx="3"
          :ry="3"
          :width="rect.width"
          :height="rect.height"
          :stroke="rect.stroke"
          :stroke-width="2"
          :fill="rect.stroke"
          :fillOpacity="0.2"
          class="family-rectangle"
        />
        <!-- connectors of dependencies -->
        <SvgBridgeConnectorContainer
          :dependencyConnectors="dependencyConnectors"
          :selectedDependencyConnector="selectedDependencyConnector"
        />
        <!-- connectors of family -->
        <SvgConnectorContainer :connectors="connectors" />
        <!-- standard nodes -->
        <SvgNodeContainer
          :nodes="visibleNodes"
          :nodePositions="nodePositions"
          :selectedNodes="selectedNodes"
          :closedNodeFamilyCounts="closedNodeFamilyCounts"
          :commentCounts="commentCounts"
          :movingNodeFamilyKeyList="movingNodeFamilyKeyList"
          :editTextTarget="editTextTarget"
          :editingText="editingText"
          :canWrite="canWrite"
          @calcSize="calcSize"
          @down="nodeCursorDown"
          @up="nodeCursorUp"
          @open="openNode"
          @close="closeNode"
          @clickComment="showComments"
          @updateChecked="updateChecked"
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
          class="moving-copy"
          v-for="(positions, key) in movingNodePositions"
          :key="`moving_${key}`"
          :x="positions.x"
          :y="positions.y"
          :text="nodes[key].text"
          :fill="nodes[key].backgroundColor"
          :textFill="nodes[key].color"
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
      <HistoryToolBox @undo="$emit('undo')" @redo="$emit('redo')" />
    </div>
    <FloatContainer
      v-if="showEditMenu"
      :x="editTargetViewPosition.x"
      :y="editTargetViewPosition.y"
    >
      <EditButtons
        :targetNode="editMenuTargetNode"
        :targetNodeViewSize="editTargetViewSize"
        :mode="mode"
        :root="editMenuTarget === ROOT_NODE"
        :oppositeEditTarget="oppositeEditTarget"
        @open="openNode(editMenuTarget)"
        @close="closeNode(editMenuTarget)"
        @deleteNode="deleteNode"
        @readyEditText="readyEditText(editMenuTarget)"
        @editDependency="editDependency"
        @createNode="createNode"
        @wheel.native.prevent="e => ($isMobile.any ? '' : wheel(e))"
      />
    </FloatContainer>
    <FloatContainer
      v-if="showTextInput"
      :x="$isMobile.any ? 0 : editTextTargetViewPosition.x"
      :y="$isMobile.any ? 0 : editTextTargetViewPosition.y"
    >
      <FloatTextInput
        v-model="editingText"
        :targetKey="editTextTarget"
        @done="doneEditText"
      />
    </FloatContainer>
    <FloatEditMenu
      v-if="showEditMenu"
      :check="editMenuTargetNode.checked !== -1"
      :grouping="editMenuTargetNode.grouping"
      @selectProp="prop => $emit('selectProp', prop)"
      @toggleCheck="toggleCheck"
      @toggleGrouping="toggleGrouping"
      @wheel.native.prevent="e => ($isMobile.any ? '' : wheel(e))"
    />
    <CommentList
      ref="commentList"
      class="comment-list"
      v-show="showEditMenu"
      :comments="targetNodeComments"
      :users="users"
      :user="user"
      @postComment="postComment"
    />
    <v-snackbar bottom right :timeout="2000" v-model="comfirmDelete">
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
  NODE_MARGIN_X,
  NODE_MARGIN_Y,
  ROOT_NODE,
  CANVAS_MODE,
  CONNECTOR_MARKER_WIDTH,
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
  isOpposite,
} from '@/utils/model'
import { getCoveredRectangle, isCoveredRectangle } from '@/utils/geometry'
import * as canvasUtils from '@/utils/canvas'

import SvgCanvas from '@/components/atoms/svg/SvgCanvas'
import SvgRectangle from '@/components/atoms/svg/SvgRectangle'
import SvgTextRectangle from '@/components/molecules/svg/SvgTextRectangle'
import SvgNodeContainer from '@/components/molecules/svg/SvgNodeContainer'
import SvgConnector from '@/components/molecules/svg/SvgConnector'
import SvgConnectorContainer from '@/components/molecules/svg/SvgConnectorContainer'
import SvgBridgeConnectorContainer from '@/components/molecules/svg/SvgBridgeConnectorContainer'
import SvgBridgeConnector from '@/components/molecules/svg/SvgBridgeConnector'
import FloatEditMenu from '@/components/molecules/FloatEditMenu'
import FloatTextInput from '@/components/molecules/FloatTextInput'
import EditButtons from '@/components/molecules/EditButtons'
import FloatContainer from '@/components/molecules/FloatContainer'
import ScaleToolBox from '@/components/molecules/ScaleToolBox'
import HistoryToolBox from '@/components/molecules/HistoryToolBox'
import CommentList from './CommentList'

export default {
  name: 'MapCanvas',
  components: {
    SvgCanvas,
    SvgRectangle,
    SvgTextRectangle,
    SvgNodeContainer,
    SvgConnector,
    SvgConnectorContainer,
    SvgBridgeConnectorContainer,
    SvgBridgeConnector,
    FloatEditMenu,
    FloatTextInput,
    EditButtons,
    FloatContainer,
    ScaleToolBox,
    HistoryToolBox,
    CommentList,
  },
  data: () => ({
    x: 0,
    y: 0,
    scaleRate: 0,
    disabledProgressiveMove: false,
    nodeCursorDownStart: 0,
    nodeCursorClickLast: 0,
    nodeSizes: {},
    beforeMoveP: null,
    movingNodePositions: {},

    editTextTarget: null,
    editingText: '',
    editMenuTarget: null,
    mode: CANVAS_MODE.NORMAL,

    adjustParentWithMovingTimer: null,
    insertInformationOfMovingNodes: null,
    comfirmDelete: false,
  }),
  props: {
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    nodes: {
      type: Object,
      required: true,
      validator: value => {
        return ROOT_NODE in value
      },
    },
    selectedNodes: {
      type: Object,
      default: () => ({}),
    },
    fileAuthority: {
      type: Object,
      default: () => ({}),
    },
    user: {
      type: Object,
      default: () => ({}),
    },
    defaultNodeProps: {
      type: Object,
      default: () => ({}),
    },
    canWrite: {
      type: Boolean,
      default: false,
    },
    comments: {
      type: Object,
      default: () => ({}),
    },
    users: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    this.$nextTick().then(() => {
      this.clearZoom()
    })
  },
  computed: {
    ROOT_NODE: () => ROOT_NODE,
    NODE_MARGIN_Y: () => NODE_MARGIN_Y,
    CONNECTOR_MARKER_WIDTH: () => CONNECTOR_MARKER_WIDTH,
    MIN_SCALE_RATE() {
      return Math.min(Math.log(this.scaleCoveringAllNode) / Math.log(1.1) - 3, -5)
    },
    MAX_SCALE_RATE: () => 15,
    CANVAS_MODE: () => CANVAS_MODE,
    viewRectangle() {
      return {
        x: this.x,
        y: this.y,
        width: this.width / this.scale,
        height: this.height / this.scale,
      }
    },
    nodeCount() {
      return Object.keys(this.nodes).length
    },
    movingNodeCount() {
      return Object.keys(this.movingNodePositions).length
    },
    movingNodeTarget() {
      return this.movingNodeCount > 0 ? Object.keys(this.movingNodePositions)[0] : null
    },
    movingNodeFamilyKeyList() {
      return this.movingNodeTarget
        ? [
            this.movingNodeTarget,
            ...getFamilyKeys({
              nodes: this.nodes,
              parentKey: this.movingNodeTarget,
            }),
          ]
        : []
    },
    scale: {
      get() {
        return Math.pow(1.1, this.scaleRate)
      },
      set(val) {
        let rate = Math.log(val) / Math.log(1.1)
        if (rate < this.MIN_SCALE_RATE) {
          rate = this.MIN_SCALE_RATE
        }
        if (rate > this.MAX_SCALE_RATE) {
          rate = this.MAX_SCALE_RATE
        }
        this.scaleRate = rate
      },
    },
    showTextInput() {
      return this.editTextTargetNode && this.movingNodeCount === 0 && !this.isMultiSelect
    },
    showEditMenu() {
      return this.editMenuTarget && this.movingNodeCount === 0
    },
    editTextTargetNode() {
      return this.nodes[this.editTextTarget]
    },
    editMenuTargetNode() {
      return this.nodes[this.editMenuTarget]
    },
    editDependencyTarget() {
      return this.mode === CANVAS_MODE.DEPENDENCY ? this.editMenuTarget : null
    },
    editTargetViewPosition() {
      return this.getNodeViewPosition(this.editMenuTarget)
    },
    editTargetViewSize() {
      return this.getNodeViewSize(this.editMenuTarget)
    },
    oppositeEditTarget() {
      return isOpposite({
        size: this.nodeSizes[this.editMenuTarget],
        position: this.nodePositions[this.editMenuTarget],
      })
    },
    editTextTargetViewPosition() {
      return this.getNodeViewPosition(this.editTextTarget)
    },
    nodePositions() {
      const size = { width: 50, height: 20 }
      const sizes = {}
      Object.keys(this.nodes).forEach(k => {
        sizes[k] = this.nodeSizes[k] || Object.assign({}, size)
      })
      return calcPositions({ nodes: this.nodes, sizes, parentKey: ROOT_NODE })
    },
    visibleNodes() {
      return Object.keys(this.nodes).reduce((map, key) => {
        if (this.isShowNodes[key]) {
          map[key] = this.nodes[key]
        }
        return map
      }, {})
    },
    connectors() {
      return getConnectors({
        nodes: this.nodes,
        positions: this.nodePositions,
        sizes: this.nodeSizes,
      })
    },
    dependencyConnectors() {
      return getDependencyConnectors({
        nodes: this.nodes,
        positions: this.nodePositions,
        sizes: this.nodeSizes,
      })
    },
    selectedDependencyConnector() {
      return Object.keys(this.dependencyConnectors).reduce((p, key) => {
        const dependency = this.dependencyConnectors[key]
        let selected = false
        if (this.selectedNodes[dependency.from] || this.selectedNodes[dependency.to]) {
          selected = true
        }
        return {
          ...p,
          [key]: selected,
        }
      }, {})
    },
    connectorOfMovingNodes() {
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
        opposite: info.opposite,
      })
    },
    rectangleCoveringAllNode() {
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
        sizes,
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
    scaleCoveringAllNode() {
      const coveredRec = this.rectangleCoveringAllNode
      const widthRate = this.width / coveredRec.width
      const heightRate = this.height / coveredRec.height
      return Math.min(widthRate, heightRate)
    },
    isMultiSelect() {
      return Object.keys(this.selectedNodes).length > 1
    },
    isShowNodes() {
      return Object.keys(this.nodes).reduce((p, key) => {
        const position = this.nodePositions[key]
        const size = this.nodeSizes[key]
        if (!size || !position) {
          // The node that has not been calculated its size and position should be rendered and calc them.
          p[key] = true
        } else {
          if (!this.hiddenNodes[key]) {
            p[key] = true
          }
        }
        return p
      }, {})
    },
    hiddenNodes() {
      return getHiddenNodes({ nodes: this.nodes })
    },
    closedNodeFamilyCounts() {
      return Object.keys(this.nodes).reduce((p, key) => {
        const node = this.nodes[key]
        if (node.closed) {
          const familyKeys = getFamilyKeys({
            nodes: this.nodes,
            parentKey: key,
          })
          p[key] = familyKeys.length
        }
        return p
      }, {})
    },
    targetNodeComments() {
      return Object.keys(this.comments).reduce((p, key) => {
        const comment = this.comments[key]
        if (comment.nodeId === this.editMenuTarget) {
          p[key] = comment
        }
        return p
      }, {})
    },
    commentCounts() {
      return Object.keys(this.comments).reduce((p, c) => {
        const comment = this.comments[c]
        if (comment.nodeId in p) {
          p[comment.nodeId]++
        } else {
          p[comment.nodeId] = 1
        }
        return p
      }, {})
    },
    calcSizeCeompleted() {
      return !Object.keys(this.nodes).find(key => !this.nodeSizes[key])
    },
    calcPositionCeompleted() {
      return !Object.keys(this.nodes).find(key => !this.nodePositions[key])
    },
    familyRectangles() {
      if (!this.calcSizeCeompleted || !this.calcPositionCeompleted) return {}
      return Object.keys(this.nodes).reduce((p, c) => {
        const node = this.nodes[c]
        if (!node.grouping) return p
        if (!this.isShowNodes[c]) return p

        const familyKeys = [c, ...getFamilyKeys({ nodes: this.nodes, parentKey: c })]
        const { positions, sizes } = familyKeys.reduce(
          ({ positions, sizes }, key) => {
            if (this.isShowNodes[key]) {
              positions[key] = this.nodePositions[key]
              sizes[key] = this.nodeSizes[key]
            }
            return { positions, sizes }
          },
          { positions: {}, sizes: {} },
        )
        const rect = getCoveredRectangle({ positions, sizes })
        return {
          ...p,
          [c]: {
            x: rect.x - NODE_MARGIN_X / 3,
            y: rect.y - NODE_MARGIN_Y / 3,
            width: rect.width + (NODE_MARGIN_X * 2) / 3,
            height: rect.height + (NODE_MARGIN_Y * 2) / 3,
            stroke: node.backgroundColor,
          },
        }
      }, {})
    },
    sortedFamilyRectangles() {
      return Object.values(this.familyRectangles).sort((a, b) => {
        return b.width * b.height - a.width * a.height
      })
    },
  },
  watch: {
    selectedNodes(to) {
      const keys = Object.keys(to)
      if (keys.indexOf(this.editMenuTarget) === -1) {
        this.editMenuTarget = null
      }
      if (keys.indexOf(this.editTextTarget) === -1) {
        this.editTextTarget = null
      }
    },
  },
  methods: {
    isInViewBox({ left, right, top, bottom }) {
      const viewRectangle = this.viewRectangle
      if (
        left <= viewRectangle.x + viewRectangle.width &&
        right >= viewRectangle.x &&
        top <= viewRectangle.y + viewRectangle.height &&
        bottom >= viewRectangle.y
      ) {
        return true
      } else {
        return false
      }
    },
    setScaleRateBaseCenter(val) {
      this.scaleRate = val
      const position = this.$refs.svgCanvas.getPostionAfterChangeScale(this.scale)
      this.x = position.x
      this.y = position.y
    },
    getFocus() {
      this.$refs.svgCanvasWrapper.focus()
    },
    move({ x, y }) {
      this.x = x
      this.y = y
    },
    zoom({ scale, x, y }) {
      this.scale = scale
      // this.scale is limited max and min automatically
      // so, 'this.scale' may not be equal 'scale'
      const position = this.$refs.svgCanvas.getPostionAfterChangeScale(this.scale, {
        x,
        y,
      })
      this.x = position.x
      this.y = position.y
    },
    clearZoom() {
      this.disabledProgressiveMove = true

      return new Promise(resolve => {
        const coveredRec = this.rectangleCoveringAllNode
        const widthRate = this.width / coveredRec.width
        const heightRate = this.height / coveredRec.height
        this.scale = Math.min(widthRate, heightRate)
        this.$nextTick().then(() => {
          this.disabledProgressiveMove = false
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
    nodeCursorDown(e, key) {
      this.getFocus()
      this.nodeCursorDownStart = Date.now()
      if (key !== ROOT_NODE) {
        const fromNodeDomP = canvasUtils.getPoint(e)
        const nodeDomP = this.$refs.svgCanvas.svg2dom(this.nodePositions[key])
        this.beforeMoveP = {
          x: fromNodeDomP.x + nodeDomP.x,
          y: fromNodeDomP.y + nodeDomP.y,
        }
        this.movingNodePositions = {
          [key]: Object.assign({}, this.nodePositions[key]),
        }
      }
    },
    nodeCursorUp(key, { shift = false }) {
      const now = Date.now()
      if (now - this.nodeCursorDownStart < INTERVAL_CLICK) {
        if (this.editDependencyTarget) {
          this.toggleDependency({
            from: this.editDependencyTarget,
            to: key,
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
    canvasCursorMove(e) {
      if (this.beforeMoveP) {
        const p = canvasUtils.getPoint(e)
        const dif = this.$refs.svgCanvas.dom2svgScale({
          x: this.beforeMoveP.x - p.x,
          y: this.beforeMoveP.y - p.y,
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
    canvasCursorUp() {
      if (this.$refs.svgCanvas) {
        this.$refs.svgCanvas.canvasCursorUp()
      }
      this.adjustParentWithMoving(true)
      this.beforeMoveP = null
      this.movingNodePositions = {}
    },
    adjustParentWithMoving(commit) {
      if (this.movingNodeCount > 0) {
        const targetKey = Object.keys(this.movingNodePositions)[0]
        const nodes = getUpdatedNodesWhenFitClosestParent({
          nodes: this.nodes,
          sizes: this.nodeSizes,
          positions: this.nodePositions,
          targetKey,
          movingPositions: this.movingNodePositions,
        })
        const newParentKey = getParentKey({ nodes, childKey: targetKey })
        const newParentNode = nodes[newParentKey]
        const opposite = isOpposite({
          size: this.nodeSizes[targetKey],
          position: this.movingNodePositions[targetKey],
        })
        const childList =
          opposite && newParentKey === ROOT_NODE ? 'oppositeChildren' : 'children'
        this.insertInformationOfMovingNodes = {
          parentKey: newParentKey,
          order: newParentNode[childList].indexOf(targetKey),
          opposite,
        }

        if (commit) {
          this.$emit('updateNodes', nodes)
          this.insertInformationOfMovingNodes = null
        }
      }
    },
    clearSelect() {
      this.$emit('clearSelect')
      this.editMenuTarget = null
      this.editTextTarget = null
      this.editingText = ''
      this.mode = CANVAS_MODE.NORMAL
    },
    clearSelectNode(key) {
      this.$emit(
        'setSelectedNodes',
        Object.assign({}, this.selectedNodes, {
          [key]: false,
        }),
      )
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
    selectNode(key, multi) {
      if (!this.canWrite) {
        return
      }
      if (multi) {
        this.$emit(
          'setSelectedNodes',
          Object.assign({}, this.selectedNodes, {
            [key]: true,
          }),
        )
      } else {
        this.$emit('setSelectedNodes', {
          [key]: true,
        })
      }
      this.editMenuTarget = key
      this.moveViewToCoverSelectedNode(key)
      this.mode = CANVAS_MODE.NORMAL
    },
    toggleSelectNode(key, multi) {
      if (this.selectedNodes[key]) {
        this.clearSelectNode(key)
      } else {
        this.selectNode(key, multi)
      }
    },
    moveViewToCoverSelectedNode(key) {
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
    readyEditText(key) {
      if (!this.canWrite) {
        return
      }
      this.selectNode(key)
      this.editTextTarget = key
      this.editingText = this.nodes[key] ? this.nodes[key].text : ''
      this.editMenuTarget = null
    },
    doneEditText({ value, targetKey }) {
      const target = this.nodes[targetKey]
      if (target) {
        const next = Object.assign({}, target, {
          text: value,
        })
        this.$emit('updateNodes', {
          [targetKey]: next,
        })
        this.selectNode(targetKey)
        this.editTextTarget = null
        this.editingText = ''
        this.$refs.svgCanvasWrapper.focus()
      }
    },
    createNode({ brother = false, opposite = false } = {}) {
      if (this.editMenuTarget === ROOT_NODE) {
        brother = false
      }
      const key = firebase
        .database()
        .ref()
        .push()
        .getKey()
      const updatedNodes = brother
        ? getUpdatedNodesWhenCreateBrotherdNode({
            nodes: this.nodes,
            brotherKey: this.editMenuTarget,
            newKey: key,
          })
        : getUpdatedNodesWhenCreateChildNode({
            nodes: this.nodes,
            parentKey: this.editMenuTarget,
            newKey: key,
            opposite,
          })
      updatedNodes[key] = {
        ...updatedNodes[key],
        ...this.defaultNodeProps,
        checked: this.editMenuTargetNode.checked === -1 ? -1 : 0,
      }
      this.$emit('updateNodes', updatedNodes)
      this.$nextTick().then(() => {
        this.readyEditText(key)
      })
    },
    deleteNode() {
      if (!this.comfirmDelete) {
        this.comfirmDelete = true
        return
      }
      this.comfirmDelete = false
      if (this.isMultiSelect) {
        const updatedNodes = getUpdatedNodesWhenDeleteNodes({
          nodes: this.nodes,
          deleteKeys: this.selectedNodes,
        })
        this.$emit('updateNodes', updatedNodes)
        this.clearSelect()
      } else {
        const targetKey = this.editMenuTarget
        if (targetKey) {
          // select the nearest family if it exists
          const parentKey = getNearestFamilyKey({
            nodes: this.nodes,
            childKey: targetKey,
          })
          if (parentKey) {
            this.selectNode(parentKey)
          }
          const updatedNodes = getUpdatedNodesWhenDeleteNode({
            nodes: this.nodes,
            deleteKey: targetKey,
          })
          this.$emit('updateNodes', updatedNodes)
        }
      }
    },
    calcSize({ key, size }) {
      Vue.set(this.nodeSizes, key, size)
    },
    keydownEnter() {
      if (this.editMenuTarget && !this.editTextTarget) {
        this.createNode({ brother: true })
      }
    },
    keydownShiftEnter() {
      if (this.editMenuTarget && !this.editTextTarget) {
        if (this.editMenuTarget === ROOT_NODE) {
          this.createNode({ opposite: true })
        } else {
          this.createNode()
        }
      }
    },
    keydownSpace() {
      if (this.editMenuTarget) {
        this.readyEditText(this.editMenuTarget)
      }
    },
    keydownDelete() {
      this.deleteNode()
    },
    moveSelect(to) {
      const targetKey = this.editMenuTarget
      if (targetKey) {
        if (to === 'right' || to === 'left') {
          if (
            isOpposite({
              size: this.nodeSizes[targetKey],
              position: this.nodePositions[targetKey],
            })
          ) {
            to = to === 'right' ? 'left' : 'right'
          }
        }
        const toKey = getNodeFrom({ nodes: this.nodes, to, targetKey })
        if (toKey) {
          this.selectNode(toKey)
        }
      }
    },
    changeOrder(up = false) {
      const updatedNodes = getUpdatedNodesWhenChangeChildOrder({
        nodes: this.nodes,
        childKey: this.editMenuTarget,
        dif: up ? -1 : 1,
      })
      this.$emit('updateNodes', updatedNodes)
    },
    wheel(e) {
      this.$refs.svgCanvas.canvasWheel(e)
    },
    selectRectangle(rectangle) {
      const selectedNodes = Object.keys(this.nodes).reduce((p, c) => {
        if (!this.hiddenNodes[c]) {
          const rec = {
            x: this.nodePositions[c].x,
            y: this.nodePositions[c].y,
            width: this.nodeSizes[c].width,
            height: this.nodeSizes[c].height,
          }
          const selected = isCoveredRectangle({
            outer: rectangle,
            inner: rec,
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
    editDependency() {
      this.mode =
        this.mode === CANVAS_MODE.DEPENDENCY ? CANVAS_MODE.NORMAL : CANVAS_MODE.DEPENDENCY
    },
    toggleDependency({ from, to }) {
      if (from === to) {
        return
      }
      const fromNode = this.nodes[from]
      const toNode = this.nodes[to]
      if (fromNode && toNode) {
        const updated = {
          ...fromNode,
          dependencies: {
            ...fromNode.dependencies,
          },
        }
        if (fromNode.dependencies[to]) {
          delete updated.dependencies[to]
        } else {
          updated.dependencies[to] = true
        }
        this.$emit('updateNodes', { [from]: updated })
      }
    },
    openNode(key) {
      const node = this.nodes[key]
      this.$emit('updateNodes', {
        [key]: {
          ...node,
          closed: false,
        },
      })
    },
    closeNode(key) {
      // clear other selections
      if (this.selectedNodes[key]) {
        this.selectNode(key)
      } else {
        this.clearSelect()
      }
      const node = this.nodes[key]
      this.$emit('updateNodes', {
        [key]: {
          ...node,
          closed: true,
        },
      })
    },
    postComment({ comment, key }) {
      const nodeId = this.editMenuTarget
      if (nodeId) {
        const _key =
          key ||
          firebase
            .database()
            .ref()
            .push()
            .getKey()
        const updatedComment = comment
          ? createComment({
              ...comment,
              uid: this.user.uid,
              nodeId,
            })
          : null
        this.$emit('postComment', {
          comment: updatedComment,
          key: _key,
        })
      }
    },
    showComments(key) {
      this.selectNode(key)
      this.$refs.commentList.open = true
    },
    toggleCheck() {
      const checked = this.editMenuTargetNode.checked === -1 ? 0 : -1
      this.batchUpdateNodes({ checked })
    },
    toggleGrouping() {
      this.batchUpdateNodes({ grouping: !this.editMenuTargetNode.grouping })
    },
    batchUpdateNodes(props) {
      const nodes = Object.keys(this.selectedNodes).reduce((p, c) => {
        const node = this.nodes[c]
        p[c] = {
          ...node,
          ...props,
        }
        return p
      }, {})
      this.$emit('updateNodes', nodes)
    },
    updateChecked({ key, val }) {
      const node = this.nodes[key]
      this.$emit('updateNodes', {
        [key]: {
          ...node,
          checked: val,
        },
      })
    },
    getNodeViewPosition(key) {
      if (key) {
        const position = this.nodePositions[key]
        const x = (position.x - this.x) * this.scale
        const y = (position.y - this.y) * this.scale
        return { x, y }
      } else {
        return null
      }
    },
    getNodeViewSize(key) {
      const size = this.nodeSizes[key]
      if (size) {
        const width = size.width * this.scale
        const height = size.height * this.scale
        return { width, height }
      } else {
        return { width: 0, height: 0 }
      }
    },
  },
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
    .family-rectangle {
      pointer-events: none;
    }
  }
  .moving-copy {
    cursor: pointer;
    opacity: 0.5;
    pointer-events: none;
  }
  .lock-button {
    position: absolute;
    top: 10px;
    right: 0;
  }
  .inserting-marker {
    opacity: 0.5;
  }
  .node-text-input {
    position: absolute;
  }
  .scale-tool,
  .history-tool {
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
