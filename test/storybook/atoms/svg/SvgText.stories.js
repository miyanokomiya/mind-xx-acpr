import { storiesOf } from '@storybook/vue'

import SvgText from '@/components/atoms/svg/SvgText'

storiesOf('atoms/svg/SvgText', module).add('story', () => ({
  components: { SvgText },
  template: `
    <svg-wrapper>
      <SvgText :x="10" :y="10" text="text" />
      <SvgText :x="10" :y="30" text="あいうえお" />
    </svg-wrapper>
  `
}))
