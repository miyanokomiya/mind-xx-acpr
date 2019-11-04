<template>
  <div>
    <ToggleCloseButton
      v-if="targetNode.children.length > 0 && !root"
      :x="fixTopBoxPosition.x"
      :y="fixTopBoxPosition.y"
      :closed="targetNode.closed"
      @open="$emit('open')"
      @close="$emit('close')"
    />
    <FloatButton
      :x="fixTopBoxPosition.x - fixButtonMargin"
      :y="fixTopBoxPosition.y"
      @click="$emit('deleteNode')"
    >
      <v-icon>delete</v-icon>
    </FloatButton>
    <FloatButton
      :x="fixTopBoxPosition.x + fixButtonMargin"
      :y="fixTopBoxPosition.y"
      color="indigo"
      @click="$emit('readyEditText')"
    >
      <v-icon>edit</v-icon>
    </FloatButton>
    <FloatButton
      v-if="!oppositeEditTarget && !root"
      :x="fixBottomBoxPosition.x - fixButtonMargin"
      :y="fixBottomBoxPosition.y"
      :color="editDependencyButtonColor"
      @click="$emit('editDependency')"
    >
      <v-icon>call_missed</v-icon>
    </FloatButton>
    <FloatButton
      v-if="oppositeEditTarget && !root"
      :x="fixBottomBoxPosition.x + fixButtonMargin"
      :y="fixBottomBoxPosition.y"
      :color="editDependencyButtonColor"
      @click="$emit('editDependency')"
    >
      <v-icon>call_missed_outgoing</v-icon>
    </FloatButton>
    <FloatButton
      v-if="root"
      :x="fixBottomBoxPosition.x - fixButtonMargin"
      :y="fixBottomBoxPosition.y"
      color="indigo"
      @click="$emit('createNode', { opposite: true })"
    >
      <v-icon>subdirectory_arrow_left</v-icon>
    </FloatButton>
    <FloatButton
      v-if="!root"
      :x="fixBottomBoxPosition.x"
      :y="fixBottomBoxPosition.y"
      color="indigo"
      @click="$emit('createNode', { brother: true })"
    >
      <v-icon>add</v-icon>
    </FloatButton>
    <FloatButton
      v-if="!oppositeEditTarget"
      :x="fixBottomBoxPosition.x + fixButtonMargin"
      :y="fixBottomBoxPosition.y"
      color="indigo"
      @click="$emit('createNode')"
    >
      <v-icon>subdirectory_arrow_right</v-icon>
    </FloatButton>
    <FloatButton
      v-if="oppositeEditTarget && !root"
      :x="fixBottomBoxPosition.x - fixButtonMargin"
      :y="fixBottomBoxPosition.y"
      color="indigo"
      @click="$emit('createNode')"
    >
      <v-icon>subdirectory_arrow_left</v-icon>
    </FloatButton>
  </div>
</template>

<script>
import Vue from 'vue'
import { CANVAS_MODE } from '@/constants'
import ToggleCloseButton from '@/components/molecules/ToggleCloseButton'
import FloatButton from '@/components/molecules/FloatButton'

export default Vue.extend({
  components: {
    ToggleCloseButton,
    FloatButton,
  },
  props: {
    targetNode: { type: Object, required: true },
    targetNodeViewSize: { type: Object, required: true },
    mode: { type: String, required: true },
    root: { type: Boolean, default: true },
    oppositeEditTarget: { type: Boolean, default: true },
  },
  computed: {
    fixTopBoxPosition() {
      return {
        x: -2 + this.targetNodeViewSize.width / 2,
        y: -29,
      }
    },
    fixBottomBoxPosition() {
      return {
        x: -2 + this.targetNodeViewSize.width / 2,
        y: 1 + this.targetNodeViewSize.height,
      }
    },
    fixButtonMargin() {
      return 36
    },
    editDependencyButtonColor() {
      return this.mode === CANVAS_MODE.DEPENDENCY ? 'deep-orange' : 'indigo'
    },
  },
})
</script>
