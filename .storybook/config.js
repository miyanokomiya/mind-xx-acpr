import { configure } from '@storybook/vue'
import Vue from 'vue'
import Vuetify from 'vuetify'

import 'ress'
import 'vuetify/dist/vuetify.min.css'
import '@/assets/styles/icons.css'

Vue.use(Vuetify)

const req = require.context('../test/storybook', true, /\.stories\.js$/)

const loadStories = () => {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
