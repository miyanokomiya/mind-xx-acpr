import Vue from 'vue'
const isMobile = require('ismobilejs')

const plugin = {
  install: function(Vue) {
    Vue.util.defineReactive(Vue.prototype, '$isMobile', isMobile)
  },
}
Vue.use(plugin)
