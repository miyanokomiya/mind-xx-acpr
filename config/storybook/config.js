import { configure } from '@storybook/vue'
import Vue from 'vue'
import { addDecorator } from '@storybook/vue'
import { withKnobs } from '@storybook/addon-knobs'
import StoryRouter from 'storybook-router'

import '@/utils/windowState'
import '@/utils/isMobile'

import 'ress'
import '@/assets/styles/icons.css'
import '@/assets/styles/main.scss'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)
const vuetify =  new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
})
addDecorator(() => ({
  vuetify,
  template: '<story/>',
}))

Vue.component('svg-wrapper', {
  template: `
  <div style="width: 500px; height: 500px; border: 1px solid #000;">
    <svg viewBox="-200 -200 600 600">
      <slot/>
    </svg>
  </div>
  `
})

addDecorator(withKnobs)
addDecorator(StoryRouter())

const req = require.context('../../tests/storybook', true, /.stories.js$/)

function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
