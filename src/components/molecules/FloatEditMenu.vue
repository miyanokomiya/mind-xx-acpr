<template>
<div class="float-edit-menu-wrapper">
  <div v-if="!colorMode" class="button-box">
    <v-btn icon small outline :color="modeDependency ? 'red lighten-2' : 'indigo'" class="list-item"
      v-if="!multiSelect"
      @click="$emit('editDependency')"
    >
      <v-icon>call_missed</v-icon>
    </v-btn>
    <v-btn icon small class="list-item"
      :style="{color: defaultNodeProps.color, background: defaultNodeProps.backgroundColor}"
      @click="colorMode = true"
    >
      <v-icon>text_format</v-icon>
    </v-btn>
    <v-btn icon small outline color="grey" class="list-item"
      @click="clickDelete"
    >
      <v-icon>delete</v-icon>
    </v-btn>
  </div>
  <div v-else class="button-box">
    <v-btn icon small class="list-item color"
      v-for="(prop, i) in colorProps"
      :key="i"
      :class="{selected: i === selectedProp}"
      :style="{color: prop.color, background: prop.backgroundColor}"
      @click="selectProp(prop)"
    >
      <v-icon>text_format</v-icon>
    </v-btn>
  </div>
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
    snackbar: false,
    colorMode: false
  }),
  props: {
    root: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: CANVAS_MODE.NORMAL
    },
    defaultNodeProps: {
      color: {
        type: String,
        default: '#000'
      },
      backgroundColor: {
        type: String,
        default: '#fff'
      }
    },
    multiSelect: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    modeDependency () {
      return this.mode === CANVAS_MODE.DEPENDENCY
    },
    colorProps () {
      return [
        {
          color: '#000',
          backgroundColor: '#B3E5FC'
        },
        {
          color: '#000',
          backgroundColor: '#81C784'
        },
        {
          color: '#000',
          backgroundColor: '#FFF176'
        },
        {
          color: '#000',
          backgroundColor: '#FFB74D'
        },
        {
          color: '#000',
          backgroundColor: '#E57373'
        },
        {
          color: '#000',
          backgroundColor: '#fff'
        },
        {
          color: '#fff',
          backgroundColor: '#000'
        }
      ]
    },
    selectedProp () {
      return this.colorProps.findIndex(prop => {
        return prop.color === this.defaultNodeProps.color && prop.backgroundColor === this.defaultNodeProps.backgroundColor
      })
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
    },
    selectProp (prop) {
      this.$emit('selectProp', prop)
      this.colorMode = false
    }
  }
}
</script>

<style lang="scss" scoped>
.float-edit-menu-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border: 1px solid black;
  border-radius: 4px;
  background-color: #fff;
  padding: 0 3px;

  .list-item {
    margin: 2px 6px;
    width: 36px;
    height: 36px;
  }
}
.button-box {
  display: flex;
  justify-content: center;
}
</style>

