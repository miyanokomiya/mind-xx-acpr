<template>
  <g>
    <SvgConnector
      v-for="(connector, key) in connectors"
      :key="key"
      :sx="connector.sx"
      :sy="connector.sy"
      :ex="connector.ex"
      :ey="connector.ey"
    />
  </g>
</template>

<script>
import Vue from 'vue'
import SvgConnector from '@/components/molecules/svg/SvgConnector'

export default Vue.extend({
  components: {
    SvgConnector,
  },
  props: {
    connectors: { type: Object, default: () => ({}) },
  },
})
</script>
