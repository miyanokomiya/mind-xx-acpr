<template>
  <div
    :style="{
      position: 'absolute',
      left: 0,
      top: 0,
      transform: `translate(${x}px, ${y}px)`,
    }"
  >
    <slot />
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  props: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
})
</script>
