<template>
  <g>
    <SvgTextRectangle
      class="mind-node"
      :class="{ 'moving-origin': movingNodeFamilyKeyList.includes(key) }"
      v-for="(node, key) in nodes"
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
      @calcSize="size => $emit('calcSize', { key, size })"
      @down="e => (canWrite ? $emit('down', e, key) : '')"
      @up="e => (canWrite ? $emit('up', key, { shift: e.shiftKey }) : '')"
      @open="$emit('open', key)"
      @close="$emit('close', key)"
      @clickComment="$emit('clickComment', key)"
      @toggleChecked="val => $emit('updateChecked', { key, val })"
    />
  </g>
</template>

<script>
import Vue from 'vue'
import { ROOT_NODE } from '@/constants'
import SvgTextRectangle from '@/components/molecules/svg/SvgTextRectangle'

export default Vue.extend({
  components: {
    SvgTextRectangle,
  },
  props: {
    nodes: { type: Object, default: () => ({}) },
    nodePositions: { type: Object, default: () => ({}) },
    selectedNodes: { type: Object, default: () => ({}) },
    closedNodeFamilyCounts: { type: Object, default: () => ({}) },
    commentCounts: { type: Object, default: () => ({}) },
    movingNodeFamilyKeyList: { type: Array, default: () => [] },
    editTextTarget: { type: String, default: '' },
    editingText: { type: String, default: '' },
    editDependencyTarget: { type: String, default: '' },
    canWrite: { type: Boolean, default: false },
  },
  computed: {
    ROOT_NODE: () => ROOT_NODE,
  },
  methods: {
    getStrokeWidth(key) {
      if (this.selectedNodes[key]) {
        return 2
      }
      if (this.editDependencyTarget === key) {
        return 2
      }
      return 1
    },
    getStrokeColor(key) {
      if (this.editDependencyTarget === key) {
        return 'tomato'
      }
      if (this.selectedNodes[key]) {
        return 'blue'
      }
      return 'black'
    },
  },
})
</script>

<style lang="scss" scoped>
.mind-node {
  cursor: pointer;

  &.moving-origin {
    opacity: 0.2;
  }
}
</style>
