<template>
<g>
  <SvgRectangle
    :x="x"
    :y="y"
    :rx="3"
    :ry="3"
    :width="textWidth"
    :height="height"
    :stroke-width="strokeWidth"
    :stroke="stroke"
    :fill="fill"
  />
  <SvgText
    v-for="(l, i) in lines"
    :ref="`svgLine`"
    :key="i"
    :x="textX"
    :y="textY + textHeight * (i + 1)"
    :font-size="fontSize"
    :text="l"
    :fill="textFill"
  />
  <!-- empty text causes errors of getting the positions on Safari -->
  <SvgText
    v-if="!text"
    text="-XXACPR-"
    :x="textX"
    :y="textY + textHeight"
    :font-size="fontSize"
    :fill="textFill"
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
    textWidth: 50
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
      default: 1
    },
    stroke: {
      type: String,
      default: 'black'
    },
    fill: {
      type: String,
      default: 'none'
    },
    textFill: {
      type: String,
      default: 'black'
    }
  },
  computed: {
    lines () {
      return this.text ? this.text.split(/\n|\r\n/) : []
    },
    width () {
      return this.textWidth
    },
    height () {
      return this.textHeight * Math.max(1, this.lines.length) + 8
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
      this.$nextTick().then(() => {
        this.adjustTextWidth()
      })
    }
  },
  mounted () {
    this.adjustTextWidth()
  },
  methods: {
    adjustTextWidth () {
      const bbox = this.getBBox()
      this.textWidth = bbox.width
      this.$emit('calcSize', bbox)
    },
    getBBox () {
      const width = this.lines.reduce((p, c, i) => {
        const width = this.$refs['svgLine'][i].getBBox().width
        return Math.max(p, width)
      }, 48)
      return {
        width: width + this.textPaddingX * 2,
        height: this.height
      }
    }
  }
}
</script>
