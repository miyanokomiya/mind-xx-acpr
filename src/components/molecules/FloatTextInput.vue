<template>
  <div class="float-text-input-wrapper" :class="{ mobile: $isMobile.any }">
    <v-textarea
      class="text-field"
      solo
      hide-details
      autofocus
      no-resize
      :rows="rows"
      v-model="localValue"
      @keydown.esc.prevent="done"
      @keydown.enter.shift.exact.prevent="done"
      @blur="done"
    />
    <v-btn fab dark small color="primary" class="submit">
      <v-icon dark style="line-height: 32px;">done</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    targetKey: {
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
  },
  computed: {
    localValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
    lines() {
      return this.localValue.split(/\n|\r\n/)
    },
    rows() {
      return Math.max(this.lines.length, 3)
    },
  },
  methods: {
    done() {
      this.$emit('done', {
        value: this.localValue,
        targetKey: this.targetKey,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.float-text-input-wrapper {
  display: flex;
  align-items: center;
  width: 40vw;
  border: 1px solid black;
  border-radius: 4px;
  background-color: #fff;
  padding-left: 4px;

  .text-field {
    padding: 0;
    width: calc(100% - 42px);
    display: inline-flex;
    ::v-deep textarea {
      margin-top: 0;
    }
  }
  .submit {
    width: 32px;
    height: 32px;
  }
}
.float-text-input-wrapper.mobile {
  .submit {
    width: 36px;
    height: 36px;
    margin: 2px 2px 0 0;
  }
}
.float-text-input-wrapper.mobile {
  width: 100vw;
}
</style>
