<template>
<g>
  <g v-if="commentCount > 0" @click="$emit('clickComment')">
    <ellipse :cx="x + width / 2" :cy="y + height - 2" :rx="width / 2" :ry="adjustedFontSize * 1.7" fill="#ddd"/>
    <SvgText
      :text="`${commentCount}`"
      :x="x + width / 2 - commentCircleRadius / 2"
      :y="y + height + adjustedFontSize + 1"
      :font-size="commentFontSize"
      fill="black"
    />
  </g>
  <g v-if="!root && childrenCount > 0">
    <g v-if="closed" @click="$emit('open')">
      <ellipse :cx="x + width + countCircleRadius / 2 + 1 - closeMarkerToLeft" :cy="y + height / 2" :rx="rightRx" :ry="adjustedFontSize" fill="#444"/>
      <SvgText
        :text="`${hiddenFamilyCount}`"
        :x="x + width + 2 - closeMarkerToLeft"
        :y="y + height / 2 + 3.5"
        :font-size="countFontSize"
        fill="white"
      />
    </g>
    <g v-else @click="$emit('close')">
      <ellipse :cx="x + width + countCircleRadius / 2 + 1 - closeMarkerToLeft" :cy="y + height / 2" :rx="rightRx" :ry="adjustedFontSize" fill="#aaa"/>
      <SvgText
        text="-"
        :x="x + width + 4 - closeMarkerToLeft"
        :y="y + height / 2 + 3.5"
        :font-size="countFontSize"
        fill="white"
      />
    </g>
  </g>
  <g
    @mousedown.prevent="e => $isMobile.any ? '' : $emit('down', e)"
    @mouseup.prevent="e => $isMobile.any ? '' : $emit('up', e)"
    @touchstart.prevent="e => $isMobile.any ? $emit('down', e) : ''"
    @touchend.prevent="e => $isMobile.any ? $emit('up', e) : ''"
  >
    <SvgRectangle
      :x="x"
      :y="y"
      :rx="3"
      :ry="3"
      :width="width"
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
      :font-size="adjustedFontSize"
      :text="l"
      :fill="textFill"
    />
    <!-- empty text causes errors of getting the positions on Safari -->
    <SvgText
      v-if="!text"
      text="-XXACPR-"
      :x="textX"
      :y="textY + textHeight"
      :font-size="adjustedFontSize"
      :fill="textFill"
    />
  </g>
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
    },
    hiddenFamilyCount: {
      type: Number,
      default: 0
    },
    commentCount: {
      type: Number,
      default: 0
    },
    childrenCount: {
      type: Number,
      default: 0
    },
    root: {
      type: Boolean,
      default: false
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
      return this.adjustedFontSize + 5
    },
    textX () {
      return this.x + this.textPaddingX
    },
    textY () {
      return this.y
    },
    textPaddingX () {
      return 5
    },
    closed () {
      return this.hiddenFamilyCount > 0
    },
    countLength () {
      return this.closed ? `${this.hiddenFamilyCount}`.length : 1
    },
    countFontSize () {
      return this.adjustedFontSize
    },
    countCircleMinRadius () {
      return 4 + this.countFontSize * 0.5 * 1
    },
    countCircleRadius () {
      return 4 + this.countFontSize * 0.5 * this.countLength
    },
    rightRx () {
      return Math.max(this.countCircleRadius, this.countFontSize)
    },
    commentLength () {
      return `${this.commentCount}`.length
    },
    commentFontSize () {
      return this.adjustedFontSize
    },
    commentCircleRadius () {
      return 3 + this.commentFontSize * 0.5 * this.commentLength
    },
    leftRx () {
      return this.commentCount > 0 ? Math.max(this.commentCircleRadius, this.commentFontSize) : 0
    },
    opposite () {
      return this.x + this.width / 2 < 0
    },
    closeMarkerToLeft () {
      return  this.opposite ? this.width + this.countCircleRadius + 3 : 0
    },
    adjustedFontSize () {
      return this.root ? this.fontSize * 1.5 : this.fontSize
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
      }, 50)
      return {
        width: width + this.textPaddingX * 2,
        height: this.height
      }
    }
  }
}
</script>
