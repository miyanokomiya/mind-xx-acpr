import { storiesOf } from '@storybook/vue'

import HistoryToolBox from '@/components/molecules/HistoryToolBox'

storiesOf('molecules/HistoryToolBox', module).add('story', () => {
  return {
    components: { HistoryToolBox },
    template: `
      <v-app>
        <HistoryToolBox/>
      </v-app>
    `,
    data: () => ({}),
    methods: {}
  }
})
