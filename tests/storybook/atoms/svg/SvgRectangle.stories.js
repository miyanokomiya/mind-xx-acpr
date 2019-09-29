import { storiesOf } from '@storybook/vue'

import SvgRectangle from '@/components/atoms/svg/SvgRectangle'

storiesOf('atoms/svg/SvgRectangle', module).add('story', () => ({
  components: { SvgRectangle },
  template: `
    <svg-wrapper>
      <SvgRectangle :x="10" :y="10" :width="100" :height="40" />
      <SvgRectangle :x="10" :y="80"  :rx="10" :ry="5" :width="100" :height="40" fill="yellow" />
      <SvgRectangle :x="10" :y="150" :width="100" :height="40" stroke="none" fill="yellow" />
    </svg-wrapper>
  `,
}))
