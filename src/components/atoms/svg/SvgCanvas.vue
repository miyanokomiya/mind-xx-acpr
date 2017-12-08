<template>
  <svg :viewBox="`${x} ${y} ${width} ${height}`">
    <slot />
  </svg>
</template>

<script>
export default {
  props: {
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    }
  }
}
</script>
