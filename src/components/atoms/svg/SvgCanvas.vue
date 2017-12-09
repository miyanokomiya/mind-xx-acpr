<template>
<div
  :style="{width: `${width}px`, height: `${height}px`}"
>
  <svg
    :viewBox="`${x} ${y} ${canvasWidth} ${canvasHeight}`"
    @mousedown.self="canvasCursorDown"
    @mouseup.self="canvasCursorUp"
    @mousemove.prevent="canvasCursorMove"
    @mousewheel.prevent="canvasWheel"
  >
    <slot />
  </svg>
</div>
</template>

<script>
import * as canvasUtils from '@/utils/canvas'
export default {
  data: () => ({
    startDownP: null,
    beforeMoveP: null
  }),
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
      default: 400,
      validator: function (value) {
        return value > 0
      }
    },
    height: {
      type: Number,
      default: 400,
      validator: function (value) {
        return value > 0
      }
    },
    scale: {
      type: Number,
      default: 1,
      validator: function (value) {
        return value > 0
      }
    }
  },
  computed: {
    canvasWidth () {
      return this.width / this.scale
    },
    canvasHeight () {
      return this.height / this.scale
    }
  },
  methods: {
    dom2svg (p, scale = this.scale) {
      return {
        x: p.x / scale + this.x,
        y: p.y / scale + this.y
      }
    },
    dom2svgScale (p) {
      return {
        x: p.x / this.scale,
        y: p.y / this.scale
      }
    },
    canvasCursorDown (e) {
      const p = canvasUtils.getPoint(e)
      this.startDownP = Object.assign({}, p)
      this.beforeMoveP = Object.assign({}, p)
    },
    canvasCursorUp (e) {
      this.startDownP = null
      this.beforeMoveP = null
    },
    canvasCursorMove (e) {
      if (this.beforeMoveP) {
        const p = canvasUtils.getPoint(e)
        const dif = this.dom2svgScale({
          x: this.beforeMoveP.x - p.x,
          y: this.beforeMoveP.y - p.y
        })
        this.$emit('move', {
          x: this.x + dif.x,
          y: this.y + dif.y,
        })
        this.beforeMoveP = Object.assign({}, p)
      }
    },
    canvasWheel (e) {
      const scale = this.scale * Math.pow(1.001, e.wheelDeltaY)
      // zoom based at cursor position
      const domP = canvasUtils.getPoint(e)
      const svgP = this.dom2svg(domP)
      const nextSvgP = this.dom2svg(domP, scale)
      this.$emit('zoom', {
        scale,
        x: this.x + (svgP.x - nextSvgP.x),
        y: this.y + (svgP.y - nextSvgP.y)
      })
    }
  }
}
</script>
