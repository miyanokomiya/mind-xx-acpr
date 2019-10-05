<template>
  <text
    ref="text"
    :x="x"
    :y="y"
    :font-size="fontSize"
    :font-weight="fontWeight"
    :fill="fill"
    :text-decoration="textDecoration"
    @click="moveLink"
  >
    <a
      v-if="isLink"
      :xlink:href="text"
      target="_blank"
      :style="{ cursor: 'pointer', 'text-shadow': '1px 1px 0 blue' }"
    >
      {{ text }}
    </a>
    <template v-else>
      {{ text }}
    </template>
  </text>
</template>

<script>
const hpptReg = new RegExp('^https?://')

export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
    fontSize: {
      type: Number,
      default: 10,
    },
    fill: {
      type: String,
      default: 'black',
    },
    fontWeight: {
      type: Number,
      default: 500,
    },
    textDecoration: {
      type: String,
      default: '',
    },
  },
  computed: {
    isLink() {
      return hpptReg.test(this.text)
    },
  },
  methods: {
    getBBox() {
      return this.$refs.text.getBBox()
    },
    moveLink() {
      if (!this.isLink) return
      window.open(this.text)
    },
  },
}
</script>
