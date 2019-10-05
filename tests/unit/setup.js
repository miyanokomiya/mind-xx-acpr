import Vue from 'vue'
import Vuetify from 'vuetify'

import '@/utils/windowState'
import '@/utils/isMobile'

Vue.config.productionTip = false
Vue.use(Vuetify)

window.SVGElement.prototype.getBBox = () => ({
  x: 10,
  y: 20,
  width: 100,
  height: 200,
})
