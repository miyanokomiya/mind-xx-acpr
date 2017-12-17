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
    :rows="3"
    v-model="_value"
    @keyup.esc="$emit('done')"
    @blur="e => $emit('blur', e)"
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

