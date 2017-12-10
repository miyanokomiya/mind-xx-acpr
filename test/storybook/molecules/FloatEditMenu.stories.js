import { storiesOf } from '@storybook/vue'
import { number } from '@storybook/addon-knobs'

import FloatEditMenu from '@/components/molecules/FloatEditMenu'

storiesOf('molecules/FloatEditMenu', module).add('story', () => {
  const options1 = {
    range: true,
    min: 0,
    max: 500,
    step: 1
  }
  const x = number('x', 0, options1)
  const y = number('y', 0, options1)

  return {
    components: { FloatEditMenu },
    template: `
      <div style="position: relative;">
        <FloatEditMenu
          v-model="text"
          :x="x"
          :y="y"
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
