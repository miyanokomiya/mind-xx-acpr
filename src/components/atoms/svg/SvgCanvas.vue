<template>
<div class="svg-canvas-wrapper" :style="{width: `${width}px`, height: `${height}px`}">
  <svg
    font-family="sans-serif"
    :viewBox="`${x} ${y} ${canvasWidth} ${canvasHeight}`"
    @mousemove.prevent="e => $isMobile.any ? '' : canvasCursorMove(e)"
    @mousedown.self="e => $isMobile.any ? '' : canvasCursorDownSelf(e)"
    @mouseup.self="e => $isMobile.any ? '' : canvasCursorUpSelf(e)"
    @mouseup="e => $isMobile.any ? '' : canvasCursorUp(e)"
    @mousewheel.prevent="e => $isMobile.any ? '' : canvasWheel(e)"
    @touchmove.prevent="e => $isMobile.any ? canvasCursorMove(e) : ''"
    @touchstart.self="e => $isMobile.any ? canvasCursorDownSelf(e) : ''"
    @touchend.self="e => $isMobile.any ? canvasCursorUpSelf(e) : ''"
  >
    <slot />
    <SvgRectangle
      v-if="rectangleSelecting"
      :x="selectRectangle.x"
      :y="selectRectangle.y"
      :rx="3"
      :ry="3"
      :width="selectRectangle.width"
      :height="selectRectangle.height"
      fill="none"
      stroke="blue"
      :strokeDasharray="5"
      :strokeDashoffset="5"
    />
  </svg>
</div>
</template>

<script>
import * as canvasUtils from '@/utils/canvas'
import {INTERVAL_CLICK, INTERVAL_DOUBLE_CLICK} from '@/constants'
import SvgRectangle from '@/components/atoms/svg/SvgRectangle'

export default {
  components: {
    SvgRectangle
  },
  data: () => ({
    beforeMoveP: null,
    downStart: 0,
    clickLast: 0,
    rectangleSelecting: false,
    downP: null
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
    },
    selectRectangle () {
      if (!this.rectangleSelecting || !this.downP || !this.beforeMoveP) {
        return null
      }
      const p1 = this.dom2svg(this.downP)
      const p2 = this.dom2svg(this.beforeMoveP)
      return {
        x: Math.min(p1.x, p2.x),
        y: Math.min(p1.y, p2.y),
        width: Math.abs(p1.x - p2.x),
        height: Math.abs(p1.y - p2.y)
      }
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
    canvasCursorMove (e) {
      if (this.beforeMoveP) {
        const p = canvasUtils.getPoint(e)
        const dif = this.dom2svgScale({
          x: this.beforeMoveP.x - p.x,
          y: this.beforeMoveP.y - p.y
        })
        if (!this.rectangleSelecting) {
          this.$emit('move', {
            x: this.x + dif.x,
            y: this.y + dif.y
          })
        }
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
      this.rectangleSelecting = e.shiftKey
      this.downP = p
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
    canvasCursorUp (e) {
      if (this.selectRectangle) {
        this.$emit('selectRectangle', this.selectRectangle)
      }
      this.beforeMoveP = null
      this.rectangleSelecting = false
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
</style>

