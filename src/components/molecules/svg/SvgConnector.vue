<template>
  <path stroke="black" stroke-width="1" fill="none"
    :d="`M ${sx} ${sy} Q ${qx} ${qy} ${ex} ${ey}`"
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
    }
  },
  methods: {
  }
}
</script>
