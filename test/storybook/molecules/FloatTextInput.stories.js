import { storiesOf } from '@storybook/vue'
import { number } from '@storybook/addon-knobs'

import FloatTextInput from '@/components/molecules/FloatTextInput'

storiesOf('molecules/FloatTextInput', module).add('story', () => {
  const options1 = {
    range: true,
    min: 0,
    max: 500,
    step: 1
  }
  const x = number('x', 0, options1)
  const y = number('y', 0, options1)

  return {
    components: { FloatTextInput },
    template: `
      <div style="position: relative;">
        <FloatTextInput
          v-model="text"
          :x="x"
          :y="y"
          targetKey="targetKey"
        />
      </div>
    `,
    data: () => ({
      text: 'text',
      x,
      y
    }),
    methods: {}
  }
})
