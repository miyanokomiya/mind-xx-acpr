import { storiesOf } from '@storybook/vue'
import { number } from '@storybook/addon-knobs'

import SvgCanvas from '@/components/atoms/svg/SvgCanvas'

storiesOf('atoms/svg/SvgCanvas', module).add('story', () => {
  const options1 = {
    range: true,
    min: -1000,
    max: 1000,
    step: 10,
  }
  const options2 = {
    range: true,
    min: 20,
    max: 1000,
    step: 10,
  }
  const options3 = {
    range: true,
    min: 0.2,
    max: 20,
    step: 0.2,
  }
  const x = number('x', 0, options1)
  const y = number('y', 0, options1)
  const width = number('width', 400, options2)
  const height = number('height', 400, options2)
  const scale = number('scale', 1, options3)
  return {
    components: { SvgCanvas },
    template: `
      <SvgCanvas style="border: 1px solid #000;"
        :x="x"
        :y="y"
        :width="width"
        :height="height"
        :scale="scale"
        @move="move"
        @zoom="zoom"
      >
        <rect x="0" y="0" width="100" height="100" stroke="none" fill="green"/>
      </SvgCanvas>
    `,
    data: () => ({
      x,
      y,
      width,
      height,
      scale,
    }),
    methods: {
      move({ x, y }) {
        this.x = x
        this.y = y
      },
      zoom({ scale, x, y }) {
        this.scale = scale
        this.x = x
        this.y = y
      },
    },
  }
})
