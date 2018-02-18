<template>
  <path :stroke="selected ? 'tomato' : 'green'" :stroke-width="selected ? 3 : 1" fill="none" stroke-dasharray="2 4"
    :d="`M ${sx} ${sy} C ${qx1} ${qy1} ${qx2} ${qy2} ${ex} ${ey}`"
  />
</template>

<script>
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
    qx1 () {
      return this.sx > 0 ? this.sx + this.gap : this.sx - this.gap
    },
    qy1 () {
      return this.sy
    },
    qx2 () {
      return this.ex > 0 ? this.ex - this.gap : this.ex + this.gap
    },
    qy2 () {
      return this.ey
    },
    xGap () {
      return Math.abs(this.sx - this.ex)
    },
    yGap () {
      return Math.abs(this.sy - this.ey)
    },
    gap () {
      return this.xGap / 3 + this.yGap / 6
    }
    // qx () {
    //   return this.sx * 5 / 10 + this.ex * 5 / 10 + this.distance * 0.3
    // },
    // qy () {
    //   return this.sy * 5 / 10 + this.ey * 5 / 10 - this.distance * 0.3
    // },
    // cx () {
    //   return (this.sx + this.ex) / 2
    // },
    // cy () {
    //   return (this.sy + this.ey) / 2
    // }
  },
  methods: {
  }
}
</script>
