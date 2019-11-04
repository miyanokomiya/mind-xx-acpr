<template>
  <g>
    <SvgBridgeConnector
      v-for="(connector, key) in dependencyConnectors"
      :key="key"
      :sx="connector.sx"
      :sy="connector.sy"
      :ex="connector.ex"
      :ey="connector.ey"
      :selected="selectedDependencyConnector[key]"
    />
  </g>
</template>

<script>
import Vue from 'vue'
import SvgBridgeConnector from '@/components/molecules/svg/SvgBridgeConnector'

export default Vue.extend({
  components: {
    SvgBridgeConnector,
  },
  props: {
    dependencyConnectors: { type: Object, default: () => ({}) },
    selectedDependencyConnector: { type: Object, default: () => ({}) },
  },
})
</script>
