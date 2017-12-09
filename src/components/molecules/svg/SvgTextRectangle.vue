<template>
<g>
  <SvgRectangle :x="x" :y="y" :width="textWidth" :height="height" :stroke-width="strokeWidth" :stroke="stroke" :fill="fill"/>
  <SvgText
    v-for="(l, i) in text.split(/\n|\r\n/)"
    :key="i"
    :x="textX"
    :y="textY + textHeight * (i + 1)"
    :font-size="fontSize"
    :text="l"
    @calcBox="calcBox"
  />
</g>
</template>

<script>
import SvgText from '@/components/atoms/svg/SvgText'
import SvgRectangle from '@/components/atoms/svg/SvgRectangle'

export default {
  components: {
    SvgText,
    SvgRectangle
  },
  data: () => ({
    textWidth: 100
  }),
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
    strokeWidth: {
      type: Number,
      default: 2
    },
    stroke: {
      type: String,
      default: 'black'
    },
    fill: {
      type: String,
      default: 'none'
    }
  },
  computed: {
    lines () {
      return this.text.split(/\n|\r\n/)
    },
    width () {
      return this.textWidth
    },
    height () {
      return this.textHeight * this.lines.length + 8
    },
    textHeight () {
      return this.fontSize + 5
    },
    textX () {
      return this.x + this.textPaddingX
    },
    textY () {
      return this.y
    },
    textPaddingX () {
      return 5
    }
  },
  watch: {
    text () {
      this.textWidth = 100
    }
  },
  methods: {
    calcBox (bbox) {
      this.textWidth = Math.max(this.textWidth, (bbox.width + this.textPaddingX * 2))
    }
  }
}
</script>
