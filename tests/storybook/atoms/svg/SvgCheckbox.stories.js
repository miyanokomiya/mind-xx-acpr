import { storiesOf } from '@storybook/vue'

import SvgCheckbox from '@/components/atoms/svg/SvgCheckbox'

storiesOf('atoms/svg/SvgCheckbox', module).add('story', () => ({
  components: { SvgCheckbox },
  template: `
    <div>
      <p>{{value}}</p>
      <svg-wrapper>
        <SvgCheckbox :x="40" :y="100" :size="20" v-model="value" />
        <SvgCheckbox :x="40" :y="150" :size="40" v-model="value" />
      </svg-wrapper>
    </div>
  `,
  data: () => ({
    value: false,
  }),
}))
