<template>
  <div
    class="float-button-wrapper"
    :style="{
      left: `${x}px`,
      top: `${y}px`,
    }"
  >
    <v-btn icon small outlined :color="color" class="button" @click="$emit('click')">
      <slot />
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: 'black',
    },
  },
}
</script>

<style lang="scss" scoped>
.float-button-wrapper {
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
