<template>
  <path stroke="black" stroke-width="1" fill="none"
    :d="`M ${sx} ${sy} Q ${qx1} ${qy1} ${cx} ${cy} T ${ex} ${ey}`"
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
    }
  },
  computed: {
    qx1 () {
      return this.sx * 3 / 10 + this.cx * 7 / 10
    },
    qy1 () {
      return this.sy * 7 / 10 + this.cy * 3 / 10
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
