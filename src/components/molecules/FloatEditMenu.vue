<template>
<div class="float-edit-menu-wrapper">
  <div class="button-box">
    <v-btn icon small class="list-item color"
      v-for="(prop, i) in colorProps"
      :key="i"
      :style="{color: prop.color, background: prop.backgroundColor}"
      @click="selectProp(prop)"
    >
      <v-icon>text_format</v-icon>
    </v-btn>
    <span class="split" />
    <v-btn icon small class="list-item"
      :style="{color: check ? 'black' : 'grey'}"
      @click="$emit('toggleCheck')"
    >
      <v-icon>check_box</v-icon>
    </v-btn>
    <v-btn icon small class="list-item"
      :style="{color: grouping ? 'black' : 'grey'}"
      @click="$emit('toggleGrouping')"
    >
      <!-- FIXME replace better icon -->
      <v-icon>check_box</v-icon>
    </v-btn>
  </div>
</div>
</template>

<script>
export default {
  data: () => ({
  }),
  props: {
    check: {
      type: Boolean,
      default: false
    },
    grouping: {
      type: Boolean,
      default: false
    }
  },
  computed: {
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
    }
  },
  methods: {
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

  .button-box {
    display: flex;
    justify-content: center;
    align-items: center;

    .list-item {
      margin: 2px 6px;
      width: 28px;
      height: 28px;
    }
    .split {
      width: 2px;
      height: 24px;
      background-color: black;
    }
  }
}
</style>

