<template>
<div class="float-text-input-wrapper">
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
  <v-btn fab dark small color="primary" class="submit">
    <v-icon dark>done</v-icon>
  </v-btn>
</div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
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
      return 3
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
  top: 0;
  left: 0;
  width: 100%;
  border: 1px solid black;
  border-radius: 4px;
  background-color: #fff;

  .text-field {
    padding: 0;
    width: calc(100% - 42px);
    display: inline-flex;
  }
  .submit {
    width: 32px;
    height: 32px;
    margin: 0 0 2px 0;
  }
}
.float-text-input-wrapper.mobile {
  .submit {
    width: 36px;
    height: 36px;
    margin: 2px 2px 0 0;
  }
}
</style>

