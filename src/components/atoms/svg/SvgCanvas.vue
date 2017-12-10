<template>
<div
  :style="{width: `${width}px`, height: `${height}px`}"
>
  <svg
    :viewBox="`${x} ${y} ${canvasWidth} ${canvasHeight}`"
    @mousedown="canvasCursorDown"
    @mouseup="canvasCursorUp"
    @mousemove.prevent="canvasCursorMove"
    @mousewheel.prevent="canvasWheel"
    @mousedown.self="canvasCursorDownSelf"
    @mouseup.self="canvasCursorUpSelf"
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
    startDownP: null,
    beforeMoveP: null,
    downStart: 0,
    clickLast: 0,
    movingTimer: 0,
    progressiveMove: {x: 0, y: 0}
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
      if (this.movingTimer > 0) {
        clearTimeout(this.movingTimer)
        this.movingTimer = 0
      }
      this.progressiveMove = {
        x: 0,
        y: 0
      }
      const p = canvasUtils.getPoint(e)
      this.startDownP = Object.assign({}, p)
      this.beforeMoveP = Object.assign({}, p)
    },
    canvasCursorUp (e) {
      this.movingTimer = setTimeout(() => {
        this.movingLoop()
      }, 25)
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
        this.progressiveMove = {
          // limit too fast moving
          x: Math.min(dif.x, 5),
          y: Math.min(dif.y, 5)
        }
      }
    },
    canvasWheel (e) {
      let scale = this.scale * Math.pow(1.001, e.wheelDeltaY)
      scale = Math.min(scale, 10)
      scale = Math.max(scale, 0.1)
      // zoom based at cursor position
      const domP = canvasUtils.getPoint(e)
      const svgP = this.dom2svg(domP)
      const nextSvgP = this.dom2svg(domP, scale)
      this.$emit('zoom', {
        scale,
        x: this.x + (svgP.x - nextSvgP.x),
        y: this.y + (svgP.y - nextSvgP.y)
      })
    },
    canvasCursorDownSelf (e) {
      this.downStart = Date.now()
    },
    canvasCursorUpSelf (e) {
      const now = Date.now()
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
    movingLoop () {
      if (this.movingTimer > 0) {
        const dif = this.progressiveMove
        this.$emit('move', {
          x: this.x + dif.x,
          y: this.y + dif.y,
        })
        dif.x *= 0.98
        dif.y *= 0.98
        if (Math.abs(dif.x) + Math.abs(dif.y) > 1) {
          this.movingTimer = setTimeout(() => {
            this.movingLoop()
          }, 25)
        } else {
          this.movingTimer = 0
          this.progressiveMove = {
            x: 0,
            y: 0
          }
        }
      }
    }
  }
}
</script>
