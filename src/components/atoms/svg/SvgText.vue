<template>
  <text
    ref="text"
    :x="x"
    :y="y"
    :font-size="fontSize"
    :font-weight="fontWeight"
    :fill="fill"
    :text-decoration="textDecoration"
    @click="isLink ? moveLink : ''"
  >
    {{ isLink ? '' : text }}
    <a
      v-if="isLink"
      :xlink:href="text"
      target="_blank"
      :style="{ cursor: 'pointer', 'text-shadow': '1px 1px 0 blue' }"
    >
      {{ text }}
    </a>
  </text>
</template>

<script>
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
      return this.text.indexOf('https://') === 0 || this.text.indexOf('http://') === 0
    },
  },
  methods: {
    getBBox() {
      return this.$refs.text.getBBox()
    },
    moveLink() {
      window.open(this.text)
    },
  },
}
</script>
