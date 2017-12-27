import { configure } from '@storybook/vue'
import Vue from 'vue'
import Vuetify from 'vuetify'
import '@/utils/windowState'
import '@/utils/isMobile'
import { addDecorator } from '@storybook/vue'
import { withKnobs } from '@storybook/addon-knobs'

import 'ress'
import 'vuetify/dist/vuetify.min.css'
import '@/assets/styles/icons.css'

Vue.use(Vuetify)

Vue.component('svg-wrapper', {
  template: `
  <div style="width: 500px; height: 500px; border: 1px solid #000;">
    <svg viewBox="0 0 400 400">
      <slot/>
    </svg>
  </div>
  `
})

addDecorator(withKnobs)

const req = require.context('../test/storybook', true, /\.stories\.js$/)

const loadStories = () => {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
