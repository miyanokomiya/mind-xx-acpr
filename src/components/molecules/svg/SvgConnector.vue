<template>
  <path stroke="black" stroke-width="1" fill="none"
    :d="d"
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
    curve: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    qx () {
      return this.sx * 7 / 10 + this.ex * 3 / 10
    },
    qy () {
      return this.sy * 1 / 10 + this.ey * 9 / 10
    },
    cx () {
      return (this.sx + this.ex) / 2
    },
    cy () {
      return (this.sy + this.ey) / 2
    },
    d () {
      if (this.curve) {
        return `M ${this.sx} ${this.sy} Q ${this.qx} ${this.qy} ${this.ex} ${this.ey}`
      } else {
        return `M ${this.sx} ${this.sy} L ${this.sx + 20} ${this.sy} L ${this.sx + 20} ${this.ey} L ${this.ex} ${this.ey}`
      }
    }
  },
  methods: {
  }
}
</script>
