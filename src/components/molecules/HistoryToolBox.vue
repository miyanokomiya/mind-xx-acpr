<template>
  <div class="history-tool-wrapper" :class="{ mobile: $isMobile.any }">
    <div class="history-box">
      <v-btn
        icon
        small
        outlined
        color="indigo"
        class="undo-button"
        @click="$emit('undo')"
      >
        <v-icon>undo</v-icon>
      </v-btn>
      <v-btn
        icon
        small
        outlined
        color="indigo"
        class="redo-button"
        @click="$emit('redo')"
      >
        <v-icon>redo</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.history-tool-wrapper {
  text-align: left;

  .history-box {
    display: inline-block;

    .undo-button,
    .redo-button {
      width: 32px;
      height: 32px;
      margin: 0 0;
    }
    .undo-button {
      margin-right: 0.5rem;
    }
  }
}
.history-tool-wrapper.mobile {
  .history-box {
    display: inline-block;

    .undo-button,
    .redo-button {
      width: 36px;
      height: 36px;
    }
  }
}
</style>
