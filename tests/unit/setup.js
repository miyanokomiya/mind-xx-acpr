import Vue from 'vue'
import Vuetify from 'vuetify'

import '@/utils/windowState'
import '@/utils/isMobile'
import '@/utils/track'

Vue.config.productionTip = false
Vue.use(Vuetify)
const vuetify = new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
})
Vue.prototype.vuetify = vuetify
