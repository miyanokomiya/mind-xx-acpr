<template>
  <div class="svg-canvas-wrapper" :style="{ width: `${width}px`, height: `${height}px` }">
    <svg
      font-family="sans-serif"
      :viewBox="`${x} ${y} ${canvasWidth} ${canvasHeight}`"
      @mousemove.prevent="e => ($isMobile.any ? '' : canvasCursorMove(e))"
      @mousedown="e => ($isMobile.any ? '' : canvasCursorDown(e))"
      @mousedown.self="e => ($isMobile.any ? '' : canvasCursorDownSelf(e))"
      @mouseup.self="e => ($isMobile.any ? '' : canvasCursorUpSelf())"
      @mouseup="e => ($isMobile.any ? '' : canvasCursorUp())"
      @wheel.prevent="e => ($isMobile.any ? '' : canvasWheel(e))"
      @touchmove.prevent="e => ($isMobile.any ? canvasCursorMove(e) : '')"
      @touchstart="e => ($isMobile.any ? canvasCursorDown(e) : '')"
      @touchstart.self="e => ($isMobile.any ? canvasCursorDownSelf(e) : '')"
      @touchend.self="e => ($isMobile.any ? canvasCursorUpSelf(e) : '')"
      @touchend="e => ($isMobile.any ? canvasCursorUp() : '')"
    >
      <slot />
      <SvgRectangle
        v-if="selectRectangle"
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
import * as geometry from '@/utils/geometry'
import { INTERVAL_CLICK, INTERVAL_DOUBLE_CLICK } from '@/constants'
import SvgRectangle from '@/components/atoms/svg/SvgRectangle'

export default {
  components: {
    SvgRectangle,
  },
  props: {
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: 400,
      validator: value => {
        return value > 0
      },
    },
    height: {
      type: Number,
      default: 400,
      validator: function(value) {
        return value > 0
      },
    },
    scale: {
      type: Number,
      default: 1,
      validator: function(value) {
        return value > 0
      },
    },
  },
  data: () => ({
    beforeMoveP: null,
    downStart: 0,
    clickLast: 0,
    rectangleSelecting: false,
    downP: null,
    movingTimer: 0,
    progressiveMove: { x: 0, y: 0 },
    pinchDistance: null,
    lastSetupProgressiveMove: 0,
    movinguInvalidateTimer: -1,
  }),
  computed: {
    canvasWidth() {
      return this.width / this.scale
    },
    canvasHeight() {
      return this.height / this.scale
    },
    selectRectangle() {
      if (!this.rectangleSelecting || !this.downP || !this.beforeMoveP) {
        return null
      }
      const p1 = this.dom2svg(this.downP)
      const p2 = this.dom2svg(this.beforeMoveP)
      return {
        x: Math.min(p1.x, p2.x),
        y: Math.min(p1.y, p2.y),
        width: Math.abs(p1.x - p2.x),
        height: Math.abs(p1.y - p2.y),
      }
    },
  },
  methods: {
    dom2svg(p, scale = this.scale) {
      return {
        x: p.x / scale + this.x,
        y: p.y / scale + this.y,
      }
    },
    dom2svgScale(p) {
      return {
        x: p.x / this.scale,
        y: p.y / this.scale,
      }
    },
    svg2dom(p, scale = this.scale) {
      return {
        x: (p.x - this.x) * scale,
        y: (p.y - this.y) * scale,
      }
    },
    pinch(e) {
      const points = canvasUtils.getPoints(e)
      const p0 = points[0]
      const p1 = points[1]
      const d = geometry.getDistance(p0, p1)
      const center = geometry.getCenter(p0, p1)
      if (this.pinchDistance && Math.abs(this.pinchDistance - d) > 1) {
        const scale = this.scale * (this.pinchDistance < d ? 1.1 : 1 / 1.1)
        this.$emit('zoom', {
          scale,
          x: center.x,
          y: center.y,
        })
      }
      this.pinchDistance = d
    },
    canvasCursorMove(e) {
      if (this.movinguInvalidateTimer === -1) {
        this._canvasCursorMove(e)
        this.movinguInvalidateTimer = setTimeout(() => {
          this.movinguInvalidateTimer = -1
        }, 10)
      }
    },
    _canvasCursorMove(e) {
      if (this.beforeMoveP) {
        if (canvasUtils.isMulitTouch(e)) {
          this.pinch(e)
        } else {
          if (!this.pinchDistance) {
            const p = canvasUtils.getPoint(e)
            const viewDif = {
              x: this.beforeMoveP.x - p.x,
              y: this.beforeMoveP.y - p.y,
            }
            const dif = this.dom2svgScale(viewDif)
            if (!this.rectangleSelecting) {
              this.$emit('move', {
                x: this.x + dif.x,
                y: this.y + dif.y,
              })
              const viewD = Math.sqrt(viewDif.x * viewDif.x + viewDif.y * viewDif.y)
              const d = viewD / this.scale
              if (viewD > 5) {
                this.lastSetupProgressiveMove = Date.now()
                // limit too fast or slow moving
                const rate = Math.min(d, 40)
                this.progressiveMove = {
                  x: (dif.x / d) * rate,
                  y: (dif.y / d) * rate,
                }
              } else {
                this.progressiveMove = {
                  x: 0,
                  y: 0,
                }
              }
            }
            this.beforeMoveP = Object.assign({}, p)
          }
        }
      }
    },
    canvasWheel(e) {
      this.stopProgressiveMove()
      const dx = e.deltaX
      const dy = e.deltaY
      this.$emit('move', {
        x: this.x + dx / this.scale,
        y: this.y + dy / this.scale,
      })
    },
    stopProgressiveMove() {
      if (this.movingTimer > 0) {
        clearTimeout(this.movingTimer)
        this.movingTimer = 0
      }
      this.progressiveMove = {
        x: 0,
        y: 0,
      }
    },
    canvasCursorDown() {
      this.stopProgressiveMove()
      this.pinchDistance = null
    },
    canvasCursorDownSelf(e) {
      this.downStart = Date.now()
      const p = canvasUtils.getPoint(e)
      this.beforeMoveP = Object.assign({}, p)
      this.rectangleSelecting = e.shiftKey
      this.downP = p
    },
    canvasCursorUpSelf(e) {
      const now = Date.now()
      if (now - this.lastSetupProgressiveMove < 200) {
        this.movingTimer = setTimeout(() => {
          this.movingLoop()
        }, 10)
      } else {
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
      }
    },
    canvasCursorUp() {
      if (this.selectRectangle) {
        this.$emit('selectRectangle', this.selectRectangle)
      }
      this.beforeMoveP = null
      this.rectangleSelecting = false
    },
    movingLoop() {
      if (this.movingTimer > 0) {
        const dif = this.progressiveMove
        this.$emit('move', {
          x: this.x + dif.x,
          y: this.y + dif.y,
        })
        dif.x *= 0.92
        dif.y *= 0.92
        if (Math.abs(dif.x) + Math.abs(dif.y) > 2) {
          this.movingTimer = setTimeout(() => {
            this.movingLoop()
          }, 10)
        } else {
          this.movingTimer = 0
          this.progressiveMove = {
            x: 0,
            y: 0,
          }
        }
      }
    },
    getPostionAfterChangeScale(nextScale, baseP) {
      // zoom based at cursor position or argu
      const domP = baseP || {
        x: this.width / 2,
        y: this.height / 2,
      }
      const svgP = this.dom2svg(domP)
      const nextSvgP = this.dom2svg(domP, nextScale)
      return {
        x: this.x + (svgP.x - nextSvgP.x),
        y: this.y + (svgP.y - nextSvgP.y),
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.svg-canvas-wrapper {
  margin: auto;
  background-color: #ffffff;
}
</style>
