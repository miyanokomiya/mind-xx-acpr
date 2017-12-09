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
    <SvgTextRectangle
      class="mind-node"
      v-for="(node, key) in nodes"
      :key="key"
      :ref="`node_${key}`"
      :x="node.x"
      :y="node.y"
      :text="node.text"
      :strokeWidth="selectedKeys[key] ? 4 : 2"
      :stroke="selectedKeys[key] ? 'blue' : 'black'"
      fill="yellow"
      @mousedown.native="nodeCursorDown"
      @mouseup.native="nodeCursorUp(key)"
    />
  </SvgCanvas>
  <FloatTextInput
    v-if="editTextTarget"
    v-model="editingText"
    :x="editTextTargetPosition.x"
    :y="editTextTargetPosition.y"
    @blur="doneEditText"
  />
</div>
</template>

<script>
import Vue from 'vue'
import {INTERVAL_CLICK, INTERVAL_DOUBLE_CLICK} from '@/constants'
import SvgCanvas from '@/components/atoms/svg/SvgCanvas'
import SvgTextRectangle from '@/components/molecules/svg/SvgTextRectangle'
import FloatTextInput from '@/components/molecules/FloatTextInput'

export default {
  components: {
    SvgCanvas,
    SvgTextRectangle,
    FloatTextInput
  },
  data: () => ({
    x: 0,
    y: 0,
    scale: 1,
    nodeCursorDownStart: 0,
    nodeCursorClickLast: 0,
    selectedKeys: {},
    editTextTarget: null,
    editingText: ''
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
      const node = this.nodes[this.editTextTarget]
      return {
        x: (node.x - this.x) * this.scale,
        y: (node.y - this.y) * this.scale
      }
    }
  },
  methods: {
    move ({ x, y }) {
      this.x = x
      this.y = y
    },
    zoom ({ scale, x, y }) {
      if (0.1 < scale && scale < 10) {
        this.scale = scale
        this.x = x
        this.y = y
      }
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
    },
    toggleSelectNode (key) {
      if (this.selectedKeys[key]) {
        Vue.delete(this.selectedKeys, key)
      } else {
        Vue.set(this.selectedKeys, key, true)
      }
    },
    doneEditText () {
      const target = this.nodes[this.editTextTarget]
      const next = Object.assign({}, target, {
        text: this.editingText
      })
      this.$emit('updateNode', {
        [this.editTextTarget]: next
      })
      this.editingText = null
      this.editTextTarget = null
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

