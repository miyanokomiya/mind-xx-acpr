<template>
<div
  class="float-text-input-wrapper"
  :style="{top: `${y}px`, left: `${x}px`}"
>
  <v-text-field
    class="text-field"
    multi-line
    hide-details
    autofocus
    :rows="rows"
    v-model="_value"
    @keyup.esc="done"
    @blur="done"
  />
</div>
</template>

<script>
export default {
  props: {
    value: {
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
    targetKey: {
      type: String,
      required: true
    }
  },
  computed: {
    _value: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    lines () {
      return this._value.split(/\n|\r\n/)
    },
    rows () {
      return Math.min(this.lines.length, 3)
    }
  },
  methods: {
    done () {
      this.$emit('done', {
        value: this.value,
        targetKey: this.targetKey
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.float-text-input-wrapper {
  position: absolute;
  border: 1px solid black;
  border-radius: 4px;
  background-color: #fff;

  .text-field {
    padding: 0;
  }
}
</style>

