<template>
  <text ref="text" :x="x" :y="y" :font-size="fontSize" :fill="fill">
    {{text}}
  </text>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    fontSize: {
      type: Number,
      default: 10
    },
    fill: {
      type: String,
      default: 'black'
    }
  },
  methods: {
    getBBox () {
      return this.$refs.text.getBBox()
    }
  }
}
</script>
