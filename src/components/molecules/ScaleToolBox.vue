<template>
  <div class="scale-tool-wrapper" :class="{ mobile: $isMobile.any }">
    <div class="scale-slider-wrapper">
      <v-slider
        class="slider"
        hide-details
        :step="step"
        :min="min"
        :max="max"
        :value="scaleRate"
        @input="val => $emit('changeScaleRate', val)"
      />
    </div>
    <v-btn
      icon
      small
      outlined
      color="indigo"
      class="pan-button"
      @click="$emit('clearZoom')"
    >
      <v-icon>center_focus_weak</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
      default: 0.1,
    },
    min: {
      type: Number,
      default: -10,
    },
    max: {
      type: Number,
      default: 10,
    },
    scaleRate: {
      type: Number,
      default: 1,
    },
  },
}
</script>

<style lang="scss" scoped>
.scale-tool-wrapper {
  text-align: left;

  .scale-slider-wrapper {
    padding: 0 0 0 42px;
    height: 0;
  }
  .input-group.input-group--slider {
    padding: 0;
  }
  .pan-button {
    margin: 0;
    width: 32px;
    height: 32px;
  }
  .slider {
    padding-top: 2px;
  }
}
.scale-tool-wrapper.mobile {
  .pan-button {
    margin: 0;
    width: 36px;
    height: 36px;
  }
  .slider {
    padding-top: 5px;
  }
}
</style>
