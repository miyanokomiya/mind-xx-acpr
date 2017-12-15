<template>
<div
  class="float-edit-menu-wrapper"
  :style="{top: `${y}px`, left: `${x}px`}"
>
  <v-btn icon small outline color="indigo" class="list-item"
    v-if="!root"
    @click="$emit('addBrother')"
  >
    <v-icon>add</v-icon>
  </v-btn
  ><v-btn icon small outline color="indigo" class="list-item"
    @click="$emit('addChild')"
  >
    <v-icon>subdirectory_arrow_right</v-icon>
  </v-btn
  ><v-btn icon small outline color="indigo" class="list-item"
    v-if="!root"
    @click="$emit('delete')"
  >
    <v-icon>delete</v-icon>
  </v-btn
  >
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
    root: {
      type: Boolean,
      default: false
    }
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
.float-edit-menu-wrapper {
  position: absolute;
  border: 1px solid black;
  border-radius: 4px;
  background-color: #fff;
  padding: 0 3px;

  .list-item {
    margin-left: 3px;
    margin-right: 3px;
  }
}
</style>

