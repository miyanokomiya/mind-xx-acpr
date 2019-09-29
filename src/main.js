import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import vuetify from './plugins/vuetify'

import './utils/windowState'
import './utils/isMobile'
import './utils/track'

import 'ress'
import '@/assets/styles/icons.css'
import '@/assets/styles/main.scss'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
