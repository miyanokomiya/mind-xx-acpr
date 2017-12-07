import { storiesOf } from '@storybook/vue'

import AppMaps from '@/components/pages/AppMaps.vue'

storiesOf('AppMaps', module).add('story as a component', () => ({
  components: { AppMaps },
  template: '<AppMaps />'
}))
