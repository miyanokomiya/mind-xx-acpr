import Vue from 'vue'
import ismobilejs from 'ismobilejs'

export const isMobile = ismobilejs()
const plugin = {
  install: function(Vue) {
    Vue.util.defineReactive(Vue.prototype, '$isMobile', isMobile)
  },
}
Vue.use(plugin)
