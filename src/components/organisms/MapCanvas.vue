<template>
<div class="map-canvas-wrapper">
  <SvgCanvas style="border: 1px solid #000;"
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
      :strokeWidth="selectedKeys[key] ? 4 : 2"
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

import SvgCanvas from '@/components/atoms/svg/SvgCanvas'
import SvgTextRectangle from '@/components/molecules/svg/SvgTextRectangle'
import SvgConnector from '@/components/molecules/svg/SvgConnector'
import FloatTextInput from '@/components/molecules/FloatTextInput'
import FloatEditMenu from '@/components/molecules/FloatEditMenu'

export default {
  components: {
    SvgCanvas,
    SvgTextRectangle,
    SvgConnector,
    FloatTextInput,
    FloatEditMenu
  },
  data: () => ({
    x: 0,
    y: 0,
    scale: 1,
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
  computed: {
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
  .mind-node {
    cursor: pointer;
  }
  .node-text-input {
    position: absolute;
  }
}
</style>

