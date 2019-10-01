import { storiesOf } from '@storybook/vue'

import SvgText from '@/components/atoms/svg/SvgText'

storiesOf('atoms/svg/SvgText', module).add('story', () => ({
  components: { SvgText },
  template: `
    <svg-wrapper>
      <SvgText :x="10" :y="10" text="text" />
      <SvgText :x="10" :y="30" text="あいうえお" />
      <SvgText :x="10" :y="50" text="https://mind-xx-acpr.firebaseapp.com/map/-L1k9pQdQ248amP4NQOe" />
    </svg-wrapper>
  `,
}))
