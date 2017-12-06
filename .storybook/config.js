import { configure } from '@storybook/vue'

const req = require.context('../src', true, /\.story\.js$/)

const loadStories = () => {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
