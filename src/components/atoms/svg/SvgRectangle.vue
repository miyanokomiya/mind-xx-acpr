<template>
<rect
  :x="x"
  :y="y"
  :rx="rx"
  :ry="ry"
  :width="width"
  :height="height"
  :stroke="stroke"
  :stroke-width="strokeWidth"
  :fill="fill"
  :fill-opacity="fillOpacity"
  :stroke-dasharray="strokeDasharray"
  :stroke-dashoffset="strokeDashoffset"
/>
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
    rx: {
      type: Number,
      default: 0
    },
    ry: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 50
    },
    height: {
      type: Number,
      default: 50
    },
    strokeWidth: {
      type: Number,
      default: 1
    },
    stroke: {
      type: String,
      default: 'black'
    },
    fill: {
      type: String,
      default: 'none'
    },
    fillOpacity: {
      type: Number,
      default: 1
    },
    strokeDasharray: {
      type: Number,
      default: 0
    },
    strokeDashoffset: {
      type: Number,
      default: 0
    }
  }
}
</script>
