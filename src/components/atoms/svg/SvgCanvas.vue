<template>
<div class="svg-canvas-wrapper" :style="{width: `${width}px`, height: `${height}px`}">
  <svg
    font-family="sans-serif"
    :viewBox="`${x} ${y} ${canvasWidth} ${canvasHeight}`"
    @mousedown="canvasCursorDown"
    @mouseup="canvasCursorUp"
    @mousemove.prevent="canvasCursorMove"
    @mousedown.self="canvasCursorDownSelf"
    @mouseup.self="canvasCursorUpSelf"
    @mousewheel.prevent="canvasWheel"
  >
    <slot />
  </svg>
</div>
</template>

<script>
import * as canvasUtils from '@/utils/canvas'
import {INTERVAL_CLICK, INTERVAL_DOUBLE_CLICK} from '@/constants'

export default {
  data: () => ({
    beforeMoveP: null,
    downStart: 0,
    clickLast: 0
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
    svg2dom (p, scale = this.scale) {
      return {
        x: (p.x - this.x) * scale,
        y: (p.y - this.y) * scale
      }
    },
    canvasCursorDown (e) {
      // const p = canvasUtils.getPoint(e)
    },
    canvasCursorUp (e) {
      // this.beforeMoveP = null
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
          y: this.y + dif.y
        })
        this.beforeMoveP = Object.assign({}, p)
      }
    },
    canvasWheel (e) {
      const dx = e.wheelDeltaX
      const dy = e.wheelDeltaY
      this.$emit('move', {
        x: this.x - dx / 3 / this.scale,
        y: this.y - dy / 3 / this.scale
      })
    },
    canvasCursorDownSelf (e) {
      this.downStart = Date.now()
      const p = canvasUtils.getPoint(e)
      this.beforeMoveP = Object.assign({}, p)
    },
    canvasCursorUpSelf (e) {
      const now = Date.now()
      this.beforeMoveP = null
      if (now - this.downStart < INTERVAL_CLICK) {
        if (now - this.clickLast < INTERVAL_DOUBLE_CLICK) {
          // double click
          this.$emit('doubleClick', e)
        } else {
          // single click
          this.$emit('click', e)
        }
        this.clickLast = now
      }
    },
    getPostionAfterChangeScale (nextScale) {
      // zoom based at cursor position
      const domP = {
        x: this.width / 2,
        y: this.height / 2
      }
      const svgP = this.dom2svg(domP)
      const nextSvgP = this.dom2svg(domP, nextScale)
      return {
        x: this.x + (svgP.x - nextSvgP.x),
        y: this.y + (svgP.y - nextSvgP.y)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-canvas-wrapper {
  // overflow: auto;
}
</style>

