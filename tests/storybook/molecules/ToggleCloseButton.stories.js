import { storiesOf } from '@storybook/vue'
import { number } from '@storybook/addon-knobs'

import ToggleCloseButton from '@/components/molecules/ToggleCloseButton'

storiesOf('molecules/ToggleCloseButton', module).add('story', () => {
  const options1 = {
    range: true,
    min: 0,
    max: 500,
    step: 1,
  }
  const x = number('x', 110, options1)
  const y = number('y', 110, options1)
  return {
    components: { ToggleCloseButton },
    template: `
      <v-app>
        <ToggleCloseButton :x="x" :y="y" :closed="closed" @open="closed = false" @close="closed = true" />
      </v-app>
    `,
    data: () => ({
      x,
      y,
      closed: false,
    }),
    methods: {},
  }
})
