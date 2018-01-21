<template>
<div
  class="float-edit-menu-wrapper"
  :class="{mobile: $isMobile.any}"
  :style="{top: `${_y}px`, left: `${_x}px`, width: width}"
>
  <v-btn icon small outline color="indigo" class="list-item"
    @click="$emit('editText')"
  >
    <v-icon>edit</v-icon>
  </v-btn
  ><v-btn icon small outline color="indigo" class="list-item"
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
  ><v-btn icon small outline :color="modeDependency ? 'red lighten-2' : 'indigo'" class="list-item"
    @click="$emit('editDependency')"
  >
    <v-icon>call_missed</v-icon>
  </v-btn
  ><v-btn icon small outline color="grey" class="list-item"
    @click="clickDelete"
  >
    <v-icon>delete</v-icon>
  </v-btn>
  <v-snackbar
    bottom
    right
    :timeout="2000"
    v-model="snackbar"
  >
    One more click to delete.
  </v-snackbar>
</div>
</template>

<script>
import {
  CANVAS_MODE
} from '@/constants'

export default {
  data: () => ({
    snackbar: false
  }),
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
    },
    mode: {
      type: String,
      default: CANVAS_MODE.NORMAL
    }
  },
  computed: {
    _x () {
      return this.$isMobile.any ? 0 : this.x
    },
    _y () {
      return this.$isMobile.any ? 0 : this.y
    },
    width () {
      return this.$isMobile.any ? '100%' : ''
    },
    modeDependency () {
      return this.mode === CANVAS_MODE.DEPENDENCY
    }
  },
  methods: {
    clickDelete () {
      if (this.snackbar) {
        this.$emit('delete')
        this.snackbar = false
      } else {
        this.snackbar = true
      }
    }
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
.float-edit-menu-wrapper.mobile {
  .list-item {
    margin: 2px 6px;
    width: 36px;
    height: 36px;
  }
}
</style>

