import { storiesOf } from '@storybook/vue'

import SvgBridgeConnector from '@/components/molecules/svg/SvgBridgeConnector'

storiesOf('molecules/svg/SvgBridgeConnector', module).add('story', () => ({
  components: { SvgBridgeConnector },
  template: `
    <svg-wrapper>
      <SvgBridgeConnector :sx="10" :sy="10" :ex="100" :ey="100" />
      <SvgBridgeConnector :sx="10" :sy="100" :ex="50" :ey="200" />
      <SvgBridgeConnector :sx="100" :sy="200" :ex="50" :ey="300" />
    </svg-wrapper>
  `,
}))
