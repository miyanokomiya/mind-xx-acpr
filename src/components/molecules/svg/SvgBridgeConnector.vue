<template>
  <path :stroke="selected ? 'tomato' : 'green'" :stroke-width="selected ? 3 : 1" fill="none" stroke-dasharray="2 4"
    :d="`M ${sx} ${sy} Q ${qx} ${qy} ${ex} ${ey}`"
  />
</template>

<script>
import { getDistance } from '@/utils/geometry'

export default {
  props: {
    sx: {
      type: Number,
      required: true
    },
    sy: {
      type: Number,
      required: true
    },
    ex: {
      type: Number,
      required: true
    },
    ey: {
      type: Number,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // radian () {
    //   return Math.atan2(this.ey - this.sy, this.ex - this.sx)
    // },
    // qRadian () {
    //   return this.radian - Math.PI / 2
    // },
    // qDistance () {
    //   return 30
    // },
    // qx () {
    //   return this.sx + Math.cos(this.qRadian) * this.qDistance
    // },
    // qy () {
    //   return this.sy + Math.sin(this.qRadian) * this.qDistance
    // }
    distance () {
      return getDistance({
        x: this.sx,
        y: this.sy
      }, {
        x: this.ex,
        y: this.ey
      })
    },
    qx () {
      return this.sx * 5 / 10 + this.ex * 5 / 10 + this.distance * 0.3
    },
    qy () {
      return this.sy * 5 / 10 + this.ey * 5 / 10 - this.distance * 0.3
    },
    cx () {
      return (this.sx + this.ex) / 2
    },
    cy () {
      return (this.sy + this.ey) / 2
    }
  },
  methods: {
  }
}
</script>
