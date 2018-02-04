<template>
  <div class="toggle-close-button-wrapper"
    :style="{
      left: `${x}px`,
      top: `${y}px`
    }"
  >
    <v-btn icon small outline color="indigo" class="button"
      v-if="closed"
      @click="$emit('open')"
    >
      <v-icon>arrow_drop_down</v-icon>
    </v-btn>
    <v-btn icon small outline color="indigo" class="button"
      v-else
      @click="$emit('close')"
    >
      <v-icon>arrow_drop_up</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    closed: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.toggle-close-button-wrapper {
  position: absolute;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: white;

  .button {
    margin: 0;
  }
}
</style>

