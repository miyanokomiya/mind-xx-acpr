import { configure } from '@storybook/vue'
import Vue from 'vue'
import Vuetify from 'vuetify'
import { addDecorator } from '@storybook/vue'

import 'ress'
import 'vuetify/dist/vuetify.min.css'
import '@/assets/styles/icons.css'

Vue.use(Vuetify)

Vue.component('svg-wrapper', {
  template: `
  <div style="width: 400px; height: 400px; border: 1px solid #000;">
    <svg viewBox="0 0 300 300">
      <slot/>
    </svg>
  </div>
  `
})

const req = require.context('../test/storybook', true, /\.stories\.js$/)

const loadStories = () => {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
