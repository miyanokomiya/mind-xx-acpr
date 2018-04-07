<template>
<g @click="$emit('input', !value)">
  <rect
    :x="x"
    :y="y"
    rx="2"
    ry="2"
    :width="size"
    :height="size"
    :stroke="'black'"
    stroke-width="1.5"
    :fill="'white'"
  />
  <path
    v-if="value"
    stroke="blue"
    stroke-width="1"
    fill="blue"
    :d="checkPath"
  />
</g>
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
    size: {
      type: Number,
      default: 10
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    checkPath () {
      const points = [
        { x: this.x + this.size * 1 / 8, y: this.y + this.size * 3 / 8 },
        { x: this.x + this.size * 2 / 4, y: this.y + this.size * 6.5 / 8 },
        { x: this.x + this.size * 9 / 8, y: this.y + this.size * 1 / 8 },
        { x: this.x + this.size * 8 / 8, y: this.y + this.size * 1 / 8 },
        { x: this.x + this.size * 2 / 4, y: this.y + this.size * 5 / 8 },
        { x: this.x + this.size * 2 / 8, y: this.y + this.size * 3 / 8 }
      ]
      return points.reduce((p, c) => {
        p += ` ${c.x} ${c.y}`
        return p
      }, 'M') + ' z'
    }
  },
  methods: {
  }
}
</script>
