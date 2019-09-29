import { storiesOf } from '@storybook/vue'

import SvgConnector from '@/components/molecules/svg/SvgConnector'

storiesOf('molecules/svg/SvgConnector', module).add('story', () => ({
  components: { SvgConnector },
  template: `
    <svg-wrapper>
      <SvgConnector :sx="0" :sy="0" :ex="100" :ey="100" />
      <SvgConnector :sx="0" :sy="100" :ex="50" :ey="200" />
      <SvgConnector :sx="0" :sy="200" :ex="50" :ey="300" curve />
    </svg-wrapper>
  `,
}))
