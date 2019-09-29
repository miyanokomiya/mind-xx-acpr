import { storiesOf } from '@storybook/vue'
import { number } from '@storybook/addon-knobs'

import FloatButton from '@/components/molecules/FloatButton'

storiesOf('molecules/FloatButton', module).add('story', () => {
  const options1 = {
    range: true,
    min: 0,
    max: 500,
    step: 1,
  }
  const x = number('x', 110, options1)
  const y = number('y', 110, options1)
  return {
    components: { FloatButton },
    template: `
      <v-app>
        <FloatButton :x="x" :y="y" color="red">
          <v-icon>arrow_drop_up</v-icon>
        </FloatButton>
        <FloatButton :x="x + 30" :y="y + 30">
          <v-icon>edit</v-icon>
        </FloatButton>
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
